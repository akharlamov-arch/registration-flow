// Local-only mock backend for the customer portal. NEVER deploy this.
//
// Why it exists: the portal's login is entirely server-side (src/api/portal.js
// holds no bypass code), so with no backend reachable you cannot get past the
// email/code screen to review the UI. This stands in for that backend on
// localhost so the portal can be walked through end to end.
//
// Lives on the CUSTOMER-PLAID-MOCK branch only and must never reach `main`:
// GitHub Pages deploys from `main` (.github/workflows/deploy.yml).
//
// Run:  node devtools/portal-mock-server.mjs
// Wire: .env.local -> VITE_API_BASE_URL=http://<lan-ip>:8787   (gitignored via *.local)
//
// ── Fidelity notes ─────────────────────────────────────────────────────────
// Values below are taken from the repository, not invented:
//   • account_type "PP_BUSINESS" is the only attested literal
//     (prompts/LEAD_API_CONTRACT.md:58). "PP_PERSONAL" appears nowhere, so it
//     is not used here.
//   • document types are the ones the portal itself offers for upload —
//     voidCheck / driverLicenseScan / other (src/data/translations.js:82-86).
//   • the summary shape matches what src/api/portalMappers.js reads:
//     profile / addresses / bank / bank_verification / documents.
//
// The one exception is `contract`, marked PROPOSED below — the existing portal
// has no contract-signing concept at all, so that field is a design proposal
// for the redesign, not part of the current backend contract.

import { createServer } from 'node:http'

const PORT = Number(process.env.PORT || 8787)

// Change requests received this session, surfaced on /mock and logged as JSON
// so backend devs can see the exact payload the frontend sends.
const submitted = []

// Passwords, by email. A customer who has never set one goes through the
// first-login path: OTP, then create a password. Everyone else signs in with
// the password first and an OTP after it.
const DEMO_PASSWORD = 'demo1234'

// Short-lived tokens that prove ONE factor and grant nothing else. A session
// token is minted only when both have been proved in the same attempt.
//   passwordTokens — password accepted, OTP still owed
//   pendingTokens  — OTP accepted, password still owed
const passwordTokens = new Map()
const pendingTokens = new Map()
// Proof that a reset code was accepted. Exchanged once for a new password.
const resetTokens = new Map()

// Re-link sessions: relink_token → email. Minted by
// /api/portal/plaid/verification-session, consumed by the exchange.
const relinkTokens = new Map()

// Bank connection history, keyed by email. The newest `active` entry is the
// account in force; `bank` on the summary is derived from it, never stored
// separately, so the two can never disagree.
//
// Statuses:
//   active         — the account payments go to
//   replaced       — superseded by a later connection, kept for the record
//   pending_review — submitted through MOOV, waiting on a manager. NOT in force
//                    Approval happens in the CRM, not here: this mock has no
//                    way to approve, and a pending entry simply stays pending.
//
// The invariant "there is always at least one connected bank" falls out of the
// design: a new entry only becomes active once it is verified, so nothing is
// ever given up before its replacement is good. A pending MOOV submission
// leaves the current account exactly where it is.
const bankHistory = new Map()
let entrySeq = 0

function addEntry(email, entry) {
  const list = bankHistory.get(email) || []
  list.unshift({ id: `bank-${++entrySeq}`, connected_at: new Date().toISOString(), ...entry })
  bankHistory.set(email, list)
  return list[0]
}

// Promotes an entry to active and demotes whatever held that place.
function makeActive(email, id) {
  const list = bankHistory.get(email) || []
  for (const e of list) if (e.status === 'active') e.status = 'replaced'
  const entry = list.find((e) => e.id === id)
  if (entry) {
    entry.status = 'active'
    entry.verified_at = new Date().toISOString()
  }
  return entry
}

const activeBank = (email) => (bankHistory.get(email) || []).find((e) => e.status === 'active')
const OTHER_BANKS = [
  { institution: 'Wells Fargo', last4: '8830' },
  { institution: 'Bank of America', last4: '2215' },
  { institution: 'US Bank', last4: '6074' },
]
let bankSeq = 0

// Arms the next re-link exchange to fail, so the "a failed swap must not touch
// the stored bank" behaviour can be demonstrated rather than asserted on faith.
// Set from /mock. Codes are the ones PijbWeb.PlaidRelinkController returns and
// src/pages/RelinkPage.jsx already maps.
let relinkFailure = null
const FAILURES = [
  ['PLAID_NAME_MISMATCH', 422, 'holder name differs'],
  ['PLAID_HOLDER_TYPE_MISMATCH', 422, 'business vs personal'],
  ['PLAID_TOKEN_EXCHANGE_FAILED', 502, 'upstream failure'],
]
let tokenSeq = 0
const STORES = { pwd: passwordTokens, pending: pendingTokens, reset: resetTokens, relink: relinkTokens }
const mintToken = (kind, email) => {
  const token = `${kind}-${++tokenSeq}`
  STORES[kind].set(token, email)
  return token
}
const passwords = new Map([
  ['itravkin@itrucking.org', DEMO_PASSWORD],
  ['myatsenka@itrucking.org', DEMO_PASSWORD],
  // akharlamov@itrucking.org deliberately absent — that is the first-login demo.
])

// ── Fixtures ───────────────────────────────────────────────────────────────
// Three personas, selected by the email typed at login. Each represents one
// state of the portal.

function doc(origin, name, type) {
  return { name, type, download_url: `${origin}/api/portal/documents/${name}` }
}

// What the customer submitted when they signed. Keys match
// src/pages/attention/fields.js so a change request opens pre-filled.
function signedDetails(over = {}) {
  return {
    values: {
      company_name: 'Summit Haul Inc',
      business_type: 'llc',
      company_title: 'owner',
      company_trucks: '18',
      company_dot: '3417755',
      company_mc: '881204',
      company_email: 'billing@summithaul.com',
      discount_tier: 'Tier 2',
      company_street1: '1190 Industrial Pkwy',
      company_street2: 'Bldg C',
      company_city: 'Columbus',
      company_state: 'OH',
      company_zip: '43219',
      mailing_street1: '', mailing_street2: '', mailing_city: '', mailing_state: '', mailing_zip: '',
      first_name: 'Ivan',
      last_name: 'Travkin',
      mobile_phone: '+1 (614) 555-0177',
      ssn: '412556690',
      dl_number: 'OH4471902',
      dl_confirm: 'OH4471902',
      dl_file: 'driver-license.pdf',
      home_street1: '', home_street2: '', home_city: '', home_state: '', home_zip: '',
      billing_first_name: '', billing_last_name: '', billing_email: '', billing_phone: '', billing_title: '',
      ...over,
    },
    choices: { mailing: 'same-as-company', home: 'same-as-business', billing_contact: 'self' },
  }
}

// Internal documents the customer can review. Titles are the ones the app
// already names — translations.js:266 (Terms of Service, Privacy Policy) and
// translations.js:494 (Terms and Conditions, accepted at signing). Any further
// documents are for the backend team to supply.
function policies(origin) {
  const url = (slug, v) => `${origin}/api/portal/documents/${slug}-v${v}.pdf`
  return [
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      current_version: '4.2',
      effective_date: '2026-09-01',
      history: [
        { version: '4.2', effective_date: '2026-09-01', summary: 'Added the updated contract details customers are asked to confirm in the portal.', url: url('terms-of-service', '4.2') },
        { version: '4.1', effective_date: '2026-03-15', summary: 'Clarified payment timing for factored invoices.', url: url('terms-of-service', '4.1') },
        { version: '4.0', effective_date: '2025-11-02', summary: 'Rewritten for the new fuel discount tiers.', url: url('terms-of-service', '4.0') },
      ],
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      current_version: '2.4',
      effective_date: '2026-07-20',
      history: [
        { version: '2.4', effective_date: '2026-07-20', summary: 'Describes how bank data received through Plaid and MOOV is stored.', url: url('privacy-policy', '2.4') },
        { version: '2.3', effective_date: '2025-12-08', summary: 'Added retention periods for driver licence scans.', url: url('privacy-policy', '2.3') },
      ],
    },
    {
      id: 'terms-and-conditions',
      title: 'Terms and Conditions',
      current_version: '3.1',
      effective_date: '2026-06-03',
      history: [
        { version: '3.1', effective_date: '2026-06-03', summary: 'Updated the agreement accepted at contract signing.', url: url('terms-and-conditions', '3.1') },
        { version: '3.0', effective_date: '2025-09-19', summary: 'Separated carrier and broker obligations.', url: url('terms-and-conditions', '3.0') },
      ],
    },
  ]
}

const CUSTOMERS = {
  // 1 — nothing done: contract unsigned AND no bank linked.
  'akharlamov@itrucking.org': (origin) => ({
    profile: {
      cust_name: 'Blue Ridge Freight LLC',
      email: 'akharlamov@itrucking.org',
      account_type: 'PP_BUSINESS',
    },
    addresses: {
      mailing_address: { line1: '4820 Commerce St', line2: 'Suite 210', city: 'Dallas', state: 'TX', zip: '75201' },
      company_address: { line1: '4820 Commerce St', line2: '', city: 'Dallas', state: 'TX', zip: '75201' },
    },
    bank: null,
    bank_verification: { plaid_linked: false },
    // PROPOSED shape — see header note. Nothing in the current portal renders it.
    contract: { status: 'pending', signed_at: null },
    documents: [doc(origin, 'driver-license.pdf', 'Driver license')],
  }),

  // 2 — contract signed, bank still missing.
  'itravkin@itrucking.org': (origin) => ({
    profile: {
      cust_name: 'Summit Haul Inc',
      email: 'itravkin@itrucking.org',
      account_type: 'PP_BUSINESS',
    },
    addresses: {
      mailing_address: { line1: '77 Lakeview Dr', line2: '', city: 'Columbus', state: 'OH', zip: '43215' },
      company_address: { line1: '1190 Industrial Pkwy', line2: 'Bldg C', city: 'Columbus', state: 'OH', zip: '43219' },
    },
    bank: null,
    bank_verification: { plaid_linked: false },
    contract: { status: 'signed', signed_at: '2026-08-14T15:22:00Z' },
    contract_details: signedDetails(),
    documents: [doc(origin, 'driver-license.pdf', 'Driver license')],
  }),

  // 3 — everything complete.
  'myatsenka@itrucking.org': (origin) => ({
    profile: {
      cust_name: 'Northline Transport LLC',
      email: 'myatsenka@itrucking.org',
      account_type: 'PP_BUSINESS',
    },
    addresses: {
      mailing_address: { line1: '2200 Harbor Blvd', line2: 'Unit 4', city: 'Tampa', state: 'FL', zip: '33602' },
      company_address: { line1: '2200 Harbor Blvd', line2: 'Unit 4', city: 'Tampa', state: 'FL', zip: '33602' },
    },
    bank: { institution: 'Chase', last4: '4471' },
    bank_verification: { plaid_linked: true },
    contract: { status: 'signed', signed_at: '2026-06-03T11:05:00Z' },
    contract_details: signedDetails({
      company_name: 'Northline Transport LLC',
      company_trucks: '34',
      company_email: 'billing@northlinetransport.com',
      company_street1: '2200 Harbor Blvd',
      company_street2: 'Unit 4',
      company_city: 'Tampa',
      company_state: 'FL',
      company_zip: '33602',
      first_name: 'Maria',
      last_name: 'Yatsenka',
      mobile_phone: '+1 (813) 555-0164',
      dl_number: 'FL8820341',
      dl_confirm: 'FL8820341',
    }),
    documents: [
      doc(origin, 'void-check.pdf', 'Void check'),
      doc(origin, 'driver-license.pdf', 'Driver license'),
    ],
  }),
}

// Seeded so the completed customer arrives with a history rather than one row.
bankHistory.set('myatsenka@itrucking.org', [
  { id: 'bank-seed-2', institution: 'Chase', last4: '4471', method: 'plaid', status: 'active',
    connected_at: '2026-06-03T11:12:00Z', verified_at: '2026-06-03T11:12:00Z' },
  { id: 'bank-seed-1', institution: 'Regions Bank', last4: '9903', method: 'moov', status: 'replaced',
    connected_at: '2025-11-18T09:40:00Z', verified_at: '2025-11-20T14:05:00Z' },
])

const PERSONAS = [
  ['akharlamov@itrucking.org', 'contract pending · bank not linked · no password yet'],
  ['itravkin@itrucking.org', 'contract signed · bank not linked · password set'],
  ['myatsenka@itrucking.org', 'contract signed · bank linked · password set'],
]

// An unknown email falls through to the complete persona rather than dead-ending,
// so a typo never blocks a demo.
const FALLBACK = 'myatsenka@itrucking.org'

function tokenFor(email) {
  return `mock-session-${email.split('@')[0]}`
}

function emailForToken(token) {
  return Object.keys(CUSTOMERS).find((e) => tokenFor(e) === token) || null
}

function customerFor(email, origin) {
  const key = String(email || '').trim().toLowerCase()
  const resolved = CUSTOMERS[key] ? key : FALLBACK
  const base = CUSTOMERS[resolved](origin)

  const history = bankHistory.get(resolved) || []
  const active = activeBank(resolved)
  if (history.length) {
    base.bank = active ? { institution: active.institution, last4: active.last4 } : null
    base.bank_verification = { plaid_linked: !!active }
  }
  // PROPOSED field — the current portal contract has no history.
  base.bank_history = history

  return { has_password: passwords.has(resolved), ...base }
}

// ── HTTP plumbing ──────────────────────────────────────────────────────────

function send(res, status, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json',
    ...headers,
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

const CONTROL_PAGE = () => `<!doctype html>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portal mock</title>
<style>
 body{font:16px/1.5 system-ui,sans-serif;margin:0;padding:24px;background:#f5f5f5;color:#111}
 .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:20px;max-width:460px;margin:0 auto}
 h1{font-size:18px;margin:0 0 4px} p{color:#6b7280;font-size:14px;margin:0 0 16px}
 li{margin-bottom:14px;list-style:none}
 code{font:13px ui-monospace,monospace;background:#f3f4f6;padding:2px 6px;border-radius:6px;word-break:break-all}
 .s{display:block;color:#6b7280;font-size:13px;margin-top:2px}
 ul{padding:0;margin:0}
 a.btn{display:block;text-align:center;text-decoration:none;margin-top:8px;padding:10px;
       border-radius:10px;font-weight:600;font-size:13px;background:#2563EB;color:#fff}
 a.ghost{background:#fff;color:#374151;border:1px solid #e5e7eb}
</style>
<div class="card">
  <h1>Portal mock</h1>
  <p>Local review fixture. Any login code is accepted — the email selects the state.</p>
  <ul>
    ${PERSONAS.map(([email, state]) => `<li><code>${email}</code><span class="s">${state}</span></li>`).join('')}
  </ul>
  <p style="margin-top:16px">
    Password for accounts that have one: <code>${DEMO_PASSWORD}</code><br>
    Accounts without a password go through create-a-password after the code.
  </p>
  <p style="margin-top:16px">Next bank re-link:
    <strong>${relinkFailure ? 'fails with ' + relinkFailure : 'succeeds'}</strong>
  </p>
  ${FAILURES.map(([code, status, why]) =>
    `<a class="btn ghost" href="/mock/relink/${code}">Fail next with ${code} (${status}) — ${why}</a>`).join('')}
  <a class="btn ghost" href="/mock/relink/none">Let the next one succeed</a>
  <p>Change requests received: <strong>${submitted.length}</strong></p>
</div>`

const server = createServer(async (req, res) => {
  const origin = `http://${req.headers.host}`
  const { pathname } = new URL(req.url, origin)

  if (req.method === 'OPTIONS') return send(res, 204, '')

  if (pathname.startsWith('/mock/relink/')) {
    const code = pathname.split('/')[3]
    relinkFailure = code === 'none' ? null : code
    return send(res, 302, '', { Location: '/mock' })
  }

  if (pathname === '/mock') {
    return send(res, 200, CONTROL_PAGE(), { 'Content-Type': 'text/html; charset=utf-8' })
  }

  // ── Auth ─────────────────────────────────────────────────────────────────

  // Step one of a sign-in with a password. A correct password alone does not
  // sign anyone in — the client then requests an OTP and exchanges that for a
  // token.
  //
  // The same 401 comes back for an unknown email, an email with no password
  // set, and a wrong password. Distinguishing them would tell an anonymous
  // caller which accounts exist, which is exactly what /request-code avoids.
  if (pathname === '/api/portal/verify-password') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const key = String(body.email || '').trim().toLowerCase()
    const stored = passwords.get(key)
    if (!stored || stored !== String(body.password || '')) {
      return send(res, 401, { success: false, code: 'SIGN_IN_INVALID' })
    }
    // Proof of one factor only — it must be presented back with a valid OTP.
    return send(res, 200, { success: true, password_token: mintToken('pwd', key) })
  }

  // ── Password reset ───────────────────────────────────────────────────────
  // A separate code from the sign-in one, on its own endpoints, so the backend
  // can rate-limit and audit resets apart from ordinary sign-ins.
  //
  // NOTE: a reset driven by an emailed code means control of the mailbox is by
  // itself enough to take over the account — the second factor is only as
  // strong as the inbox. That is a deliberate product decision, not an
  // oversight. Rate-limit this endpoint and alert the customer when it fires.
  if (pathname === '/api/portal/request-reset') {
    // Always the same answer, like /request-code — never reveal who exists.
    return send(res, 200, { success: true })
  }

  if (pathname === '/api/portal/verify-reset') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const key = String(body.email || '').trim().toLowerCase()
    const resolved = CUSTOMERS[key] ? key : FALLBACK
    if (!String(body.code || '').trim()) {
      return send(res, 401, { success: false, code: 'OTP_INVALID_OR_USED' })
    }
    return send(res, 200, { success: true, reset_token: mintToken('reset', resolved) })
  }

  // Exchanges a verified reset code for a new password and a session.
  if (pathname === '/api/portal/reset-password') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const email = resetTokens.get(String(body.reset_token || ''))
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    const pw = String(body.password || '')
    if (pw.length < 8) return send(res, 422, { success: false, code: 'PASSWORD_TOO_SHORT' })

    resetTokens.delete(body.reset_token)
    passwords.set(email, pw)
    // Any half-finished sign-in for this customer is void once the password
    // changes.
    for (const [tok, who] of pendingTokens) if (who === email) pendingTokens.delete(tok)
    for (const [tok, who] of passwordTokens) if (who === email) passwordTokens.delete(tok)
    console.log(`password reset for ${email}`)

    return send(res, 200, {
      success: true,
      session_token: tokenFor(email),
      customer: customerFor(email, origin),
    })
  }

  // Second half of the code-first path: the OTP is already accepted, the
  // password is still owed.
  if (pathname === '/api/portal/complete-sign-in') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const email = pendingTokens.get(String(body.pending_token || ''))
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    if (passwords.get(email) !== String(body.password || '')) {
      return send(res, 401, { success: false, code: 'SIGN_IN_INVALID' })
    }
    pendingTokens.delete(body.pending_token)
    return send(res, 200, {
      success: true,
      session_token: tokenFor(email),
      customer: customerFor(email, origin),
    })
  }

  // Sets the password for the signed-in session (first login only).
  if (pathname === '/api/portal/set-password') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const email = emailForToken(token)
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const pw = String(body.password || '')
    if (pw.length < 8) return send(res, 422, { success: false, code: 'PASSWORD_TOO_SHORT' })
    passwords.set(email, pw)
    console.log(`password set for ${email}`)
    return send(res, 200, { success: true })
  }

  if (pathname === '/api/portal/request-code') return send(res, 200, { success: true })

  // Accepting the OTP is never enough on its own for an account that has a
  // password. Either the password was already proved in this attempt (the
  // client presents `password_token`), or it is still owed and the response
  // carries no session token at all.
  if (pathname === '/api/portal/verify-code') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const key = String(body.email || '').trim().toLowerCase()
    const resolved = CUSTOMERS[key] ? key : FALLBACK
    if (!CUSTOMERS[key]) console.log(`unknown email "${key}" → falling back to ${FALLBACK}`)

    const hasPassword = passwords.has(resolved)
    const pwToken = String(body.password_token || '')
    const passwordProved = pwToken && passwordTokens.get(pwToken) === resolved

    if (hasPassword && !passwordProved) {
      // One factor down, one to go. No session, no customer data.
      return send(res, 200, {
        success: true,
        password_required: true,
        pending_token: mintToken('pending', resolved),
      })
    }

    if (passwordProved) passwordTokens.delete(pwToken)
    return send(res, 200, {
      success: true,
      session_token: tokenFor(resolved),
      customer: customerFor(resolved, origin),
    })
  }

  if (pathname === '/api/portal/session' || pathname === '/api/portal/me') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const email = emailForToken(token)
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    return send(res, 200, { success: true, customer: customerFor(email, origin) })
  }

  // ── Internal documents ───────────────────────────────────────────────────
  if (pathname === '/api/portal/policies') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    if (!emailForToken(token)) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    return send(res, 200, { success: true, policies: policies(origin) })
  }

  // ── Manual bank verification (MOOV) ──────────────────────────────────────
  // Recorded as pending_review, never active: a person checks it first, so the
  // account currently in force stays in force meanwhile.
  if (pathname === '/api/portal/bank/manual') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const email = emailForToken(token)
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })

    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const entry = addEntry(email, {
      institution: body.bank_name || 'Pending review',
      last4: String(body.account_number || '').slice(-4),
      method: 'moov',
      status: 'pending_review',
    })
    console.log(`manual bank submitted for ${email} → awaiting a manager`)
    return send(res, 201, { success: true, entry })
  }

  // ── Change requests ──────────────────────────────────────────────────────
  if (pathname === '/api/portal/change-requests') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    submitted.push(body)
    console.log('\n── change request ──\n' + JSON.stringify(body, null, 2))
    return send(res, 201, { success: true, change_request: { id: submitted.length, status: 'pending', ...body } })
  }

  // ── Uploads ──────────────────────────────────────────────────────────────
  if (pathname === '/api/portal/uploads/presign') {
    const body = JSON.parse((await readBody(req)).toString() || '{}')
    const key = `mock-uploads/${Date.now()}-${body.filename || 'file'}`
    return send(res, 200, { success: true, key, url: `${origin}/mock-s3/${encodeURIComponent(key)}` })
  }

  if (pathname.startsWith('/mock-s3/')) {
    await readBody(req)
    return send(res, 200, { success: true })
  }

  // ── Documents ────────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/portal/documents/')) {
    return send(res, 200, 'Mock document — placeholder bytes for download testing.', {
      'Content-Type': 'text/plain; charset=utf-8',
    })
  }

  // ── Plaid ────────────────────────────────────────────────────────────────
  // A mock link_token cannot satisfy the real Plaid SDK, so the gate is
  // reviewable but not completable. Log in as the linked persona to get past it.
  // Mints a re-link session for the signed-in customer. Used both to connect a
  // bank for the first time and to swap to a different one.
  if (pathname === '/api/portal/plaid/verification-session') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    const email = emailForToken(token)
    if (!email) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    return send(res, 200, {
      success: true,
      relink_token: mintToken('relink', email),
      expires_at: new Date(Date.now() + 3600e3).toISOString(),
    })
  }

  if (pathname.startsWith('/api/plaid/relink/')) {
    // A mock link_token cannot satisfy the real Plaid SDK, so Link itself is
    // simulated client-side; the session and the exchange are real calls.
    if (pathname.endsWith('/link-token')) {
      return send(res, 503, { success: false, code: 'PLAID_SESSION_UNAVAILABLE' })
    }

    if (pathname.endsWith('/exchange')) {
      await readBody(req)
      const relinkToken = decodeURIComponent(pathname.split('/')[4] || '')
      const email = relinkTokens.get(relinkToken)
      // 410 for a token that was never issued, already used, or expired —
      // matching the failure mode documented in src/api/relink.js.
      if (!email) return send(res, 410, { success: false, code: 'RELINK_TOKEN_CONSUMED' })

      // A rejected exchange leaves everything alone: the stored bank is
      // untouched and the token stays usable, so the customer can pick another
      // account without starting over.
      if (relinkFailure) {
        const [code, status] = FAILURES.find((f) => f[0] === relinkFailure) || FAILURES[0]
        relinkFailure = null
        console.log(`re-link REJECTED for ${email} → ${code}; bank left as-is`)
        return send(res, status, { success: false, code })
      }

      relinkTokens.delete(relinkToken)
      const picked = OTHER_BANKS[bankSeq++ % OTHER_BANKS.length]
      // Plaid verifies the customer itself, so the entry is active immediately.
      const entry = addEntry(email, { ...picked, method: 'plaid', status: 'pending_review' })
      makeActive(email, entry.id)
      console.log(`bank re-linked for ${email} → ${picked.institution} (plaid, active at once)`)
      return send(res, 200, { success: true, bank: picked })
    }

    return send(res, 200, { success: true })
  }

  send(res, 404, { success: false, error: 'not found', path: pathname })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`portal mock listening on http://0.0.0.0:${PORT}`)
  console.log(`controls: http://localhost:${PORT}/mock`)
  for (const [email, state] of PERSONAS) console.log(`  ${email.padEnd(30)} ${state}`)
})
