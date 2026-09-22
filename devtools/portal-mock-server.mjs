// Local-only mock backend for the customer portal. NEVER deploy this.
//
// Why it exists: the portal's login is entirely server-side (see src/api/portal.js
// — the frontend holds no bypass code), so with no backend reachable you cannot
// get past the email/code screen to review the UI. This stands in for that
// backend on localhost so the portal can be walked through end to end.
//
// It lives on the CUSTOMER-PLAID-MOCK branch only and must never reach `main`:
// GitHub Pages deploys from `main` (.github/workflows/deploy.yml).
//
// Run:  node devtools/portal-mock-server.mjs
// Wire: .env.local -> VITE_API_BASE_URL=http://<your-lan-ip>:8787   (gitignored via *.local)
//
// Response shapes mirror docs/conventions/portal-api-contract.md as consumed by
// src/api/portal.js and src/api/portalMappers.js.

import { createServer } from 'node:http'

const PORT = Number(process.env.PORT || 8787)

// Any code is accepted — this is a review fixture, not an auth system.
const SESSION_TOKEN = 'mock-session-token'

// Flipped at runtime from /mock so the Plaid gate can be reviewed on a phone
// without restarting the server.
let plaidLinked = process.env.MOCK_PLAID_LINKED !== '0'

// Change requests submitted during a session, so the demo can be talked through.
const submitted = []

function customer(origin) {
  return {
    profile: {
      cust_name: 'Redline Carriers LLC',
      email: 'dispatch@redlinecarriers.com',
      account_type: 'Factoring',
    },
    addresses: {
      mailing_address: { line1: '4820 Commerce St', line2: 'Suite 210', city: 'Dallas', state: 'TX', zip: '75201' },
      company_address: { line1: '1190 Industrial Pkwy', line2: '', city: 'Fort Worth', state: 'TX', zip: '76106' },
    },
    bank: plaidLinked ? { institution: 'Chase', last4: '4471' } : null,
    // Only an explicit `false` raises the gate — see PortalPage `bankGateRequired`.
    bank_verification: { plaid_linked: plaidLinked },
    documents: [
      { name: 'w9.pdf', type: 'W-9', download_url: `${origin}/api/portal/documents/w9.pdf` },
      { name: 'contract.pdf', type: 'Signed Contract', download_url: `${origin}/api/portal/documents/contract.pdf` },
      { name: 'noa.pdf', type: 'Notice of Assignment', download_url: `${origin}/api/portal/documents/noa.pdf` },
    ],
  }
}

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
<title>Portal mock controls</title>
<style>
 body{font:16px/1.5 system-ui,sans-serif;margin:0;padding:24px;background:#f5f5f5;color:#111}
 .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:20px;max-width:420px;margin:0 auto}
 h1{font-size:18px;margin:0 0 4px} p{color:#6b7280;font-size:14px;margin:0 0 16px}
 .state{display:inline-block;padding:4px 10px;border-radius:999px;font-size:13px;font-weight:600;
        background:${plaidLinked ? '#dcfce7' : '#fee2e2'};color:${plaidLinked ? '#166534' : '#991b1b'}}
 a.btn{display:block;text-align:center;text-decoration:none;margin-top:10px;padding:12px;
       border-radius:10px;background:#2563EB;color:#fff;font-weight:600}
 a.ghost{background:#fff;color:#374151;border:1px solid #e5e7eb}
</style>
<div class="card">
  <h1>Portal mock</h1>
  <p>Local review fixture. Any login code is accepted.</p>
  <div>Bank: <span class="state">${plaidLinked ? 'linked — dashboard visible' : 'not linked — Plaid gate raised'}</span></div>
  <a class="btn" href="/mock/plaid/${plaidLinked ? '0' : '1'}">
    Switch to ${plaidLinked ? 'NOT linked (show gate)' : 'linked (show dashboard)'}
  </a>
  <a class="btn ghost" href="/mock">Refresh</a>
  <p style="margin-top:16px">Change requests received: <strong>${submitted.length}</strong></p>
</div>`

const server = createServer(async (req, res) => {
  const origin = `http://${req.headers.host}`
  const { pathname } = new URL(req.url, origin)

  if (req.method === 'OPTIONS') return send(res, 204, '')

  // ── Mock controls (browser-facing) ───────────────────────────────────────
  if (pathname === '/mock') return send(res, 200, CONTROL_PAGE(), { 'Content-Type': 'text/html; charset=utf-8' })
  if (pathname.startsWith('/mock/plaid/')) {
    plaidLinked = pathname.endsWith('/1')
    return send(res, 302, '', { Location: '/mock' })
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  if (pathname === '/api/portal/request-code') return send(res, 200, { success: true })

  if (pathname === '/api/portal/verify-code') {
    return send(res, 200, { success: true, session_token: SESSION_TOKEN, customer: customer(origin) })
  }

  if (pathname === '/api/portal/session' || pathname === '/api/portal/me') {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    if (token !== SESSION_TOKEN) return send(res, 401, { success: false, code: 'INVALID_SESSION' })
    return send(res, 200, { success: true, customer: customer(origin) })
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
  // reviewable but not completable. Use /mock to flip plaid_linked instead.
  if (pathname === '/api/portal/plaid/verification-session') {
    return send(res, 200, {
      success: true,
      relink_token: 'mock-relink-token',
      expires_at: new Date(Date.now() + 3600e3).toISOString(),
    })
  }

  if (pathname.startsWith('/api/plaid/relink/')) {
    if (pathname.endsWith('/link-token')) {
      return send(res, 503, { success: false, code: 'PLAID_SESSION_UNAVAILABLE' })
    }
    return send(res, 200, { success: true, customer: { cust_name: 'Redline Carriers LLC' } })
  }

  send(res, 404, { success: false, error: 'not found', path: pathname })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`portal mock listening on http://0.0.0.0:${PORT}`)
  console.log(`controls: http://localhost:${PORT}/mock`)
})
