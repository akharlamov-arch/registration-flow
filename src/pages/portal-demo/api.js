// Demo-only API calls. Kept out of src/api/portal.js so the shared module that
// the live portal uses is not changed for a demo.

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
 * Demo-local rather than reusing src/api/portal.js, because it carries
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
 * Records a bank submitted through MOOV. It is stored as `pending_review` and
 * is NOT put in force — a manager checks it first, so the account currently
 * receiving payments keeps receiving them meanwhile.
 * Response (201): { success, entry }
 */
export function submitManualBank(token, details) {
  return apiFetch(`${BASE}/api/portal/bank/manual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(details),
  })
}
