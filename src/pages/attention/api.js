// API calls only the attention page makes: the documents library, the
// two-factor sign-in, and the manual (MOOV) bank submission. They live beside
// the page rather than in src/api/portal.js, which the older /portal page
// (src/pages/PortalPage.jsx) also uses.

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/**
 * The library of internal documents and their revisions.
 * Response: { success, policies: [{ id, title, current_version, effective_date,
 *             history: [{ version, effective_date, summary, url }] }] }
 */
export function getPolicies(token) {
  return apiFetch(`${BASE}/api/portal/policies`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// ── Password sign-in ────────────────────────────────────────────────────────
// The sign-in screen asks for email and password together and offers a
// one-time code beside them, so nothing is ever revealed about whether an
// account exists or has a password set. Whether to prompt for creating one is
// decided after the OTP, from `customer.has_password` — which only travels
// inside an authenticated response.
//
// A password alone never mints a session: it is always followed by an OTP.

/**
 * Checks the password. On success the client then requests an OTP — this call
 * does not return a session token by itself.
 * Response: { success } or 401 { success: false, code: "PASSWORD_INVALID" }
 */
export function verifyPassword(email, password) {
  return apiFetch(`${BASE}/api/portal/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Sets the password for the signed-in session. First login only.
 * Response: { success } or 422 { success: false, code: "PASSWORD_TOO_SHORT" }
 */
export function setPassword(token, password) {
  return apiFetch(`${BASE}/api/portal/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password }),
  })
}

/**
 * Exchanges the emailed code for a session — but only when both factors are in.
 *
 * Separate from src/api/portal.js's verifyCode, because it carries
 * `password_token`: proof that the password was accepted earlier in this same
 * attempt. Without it, an account that has a password gets no session and the
 * response says `password_required` with a `pending_token` instead.
 *
 * Response, both factors done: { success, session_token, customer }
 * Response, password still owed: { success, password_required, pending_token }
 */
export function verifyCodeWithFactor(email, code, passwordToken) {
  return apiFetch(`${BASE}/api/portal/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, password_token: passwordToken || undefined }),
  })
}

/**
 * Finishes a sign-in that started with the emailed code: the OTP is already
 * accepted, the password is still owed.
 * Response: { success, session_token, customer } or 401 SIGN_IN_INVALID.
 */
export function completeSignIn(pendingToken, password) {
  return apiFetch(`${BASE}/api/portal/complete-sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pending_token: pendingToken, password }),
  })
}

// ── Password reset ──────────────────────────────────────────────────────────
// Separate endpoints from ordinary sign-in so the backend can rate-limit and
// audit resets on their own.
//
// NOTE: a reset driven by an emailed code makes control of the mailbox
// sufficient to take over the account — the second factor ends up only as
// strong as the inbox. A deliberate product decision; worth an alert to the
// customer whenever it fires.

/** Sends a reset code. Always resolves the same way — never reveals who exists. */
export function requestReset(email) {
  return apiFetch(`${BASE}/api/portal/request-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

/**
 * Checks the reset code.
 * Response: { success, reset_token } — proof of mailbox control, nothing else.
 */
export function verifyReset(email, code) {
  return apiFetch(`${BASE}/api/portal/verify-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
}

/**
 * Exchanges a verified reset code for a new password and a session. Single use;
 * it also voids any half-finished sign-in for that customer.
 * Response: { success, session_token, customer }
 */
export function resetPassword(resetToken, password) {
  return apiFetch(`${BASE}/api/portal/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reset_token: resetToken, password }),
  })
}

/**
 * Submits a new bank through MOOV (docs/conventions/portal-api-contract.md §9b
 * in pijb). The bank in use stays in use: the new one is verified at Moov and
 * approved by our team before it takes over.
 *
 * Multipart, with the void check as the file itself: the server stores it and
 * picks the key, so nothing is uploaded for a submission that is never sent.
 * Only the Authorization header is set — the browser writes the boundary.
 *
 * Response (201): { success, entry, customer }. Refusals: 422 { errors: {
 * account_number, routing_number, void_check } }, 422 SAME_AS_CURRENT,
 * 409 SUBMISSION_OPEN, 502 UPLOAD_FAILED.
 */
export function submitManualBank(token, { accountNumber, routingNumber, bankName, voidCheck }) {
  const body = new FormData()
  body.append('account_number', accountNumber)
  body.append('routing_number', routingNumber)
  if (bankName) body.append('bank_name', bankName)
  body.append('void_check', voidCheck)

  return apiFetch(`${BASE}/api/portal/bank/manual`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
}
