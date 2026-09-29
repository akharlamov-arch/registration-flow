// API calls only the attention page makes: the documents library, the
// password half of sign-in, the manual (MOOV) bank submission and its code.
// They live beside the page rather than in src/api/portal.js, which the older
// /portal page (src/pages/PortalPage.jsx) also uses. The code half of sign-in
// (`requestCode`, `verifyCode`) is already there, and the sign-in calls below
// join it once /portal shares the sign-in screen (PORTAL-AUTH-03 §12).

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
// Sign-in is code first (Login.jsx): `requestCode` → `verifyCode`, both from
// src/api/portal.js. Whether a password is then owed, or may be created, is
// read from that authenticated response — `password_required` or
// `customer.has_password` — so nothing before the code reveals who has an
// account or a password.
//
// The server also accepts the password first (`verify-password` with a
// `password_token` on verify-code); this client does not use that order.

/**
 * Sets the password for the signed-in session. First login only.
 * Response: { success }. Refusals: 422 PASSWORD_TOO_SHORT | PASSWORD_TOO_LONG
 * (with `min_length`), 409 PASSWORD_ALREADY_SET once one exists, 401
 * INVALID_SESSION.
 */
export function setPassword(token, password) {
  return apiFetch(`${BASE}/api/portal/set-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password }),
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
 * in pijb). The bank in use stays in use: our team reviews the void check
 * first, and only then is the new one sent to Moov for its verification
 * deposit (PORTAL-MOOV-04). The entry comes back `pending_review`.
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

/**
 * Completes a Moov verification with the code from the deposit (instant) or
 * the two deposit amounts in cents (micro-deposits) — §9a in pijb's
 * portal-api-contract.md. `target` names which verification: an entry of
 * `bank_verification.awaiting_codes` ("submission" for a submitted bank,
 * "current" for the bank in use).
 *
 * Response (200): { success, customer } — the fresh summary. Refusals:
 * 422 VERIFICATION_CODE_INVALID { attempts_left }, 422 VERIFICATION_INPUT_INVALID,
 * 423 VERIFICATION_LOCKED, 409 NOTHING_TO_VERIFY, 502 VERIFICATION_UNAVAILABLE.
 */
export function submitBankCode(token, { target, code, amounts }) {
  return apiFetch(`${BASE}/api/portal/bank/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(amounts ? { target, amounts } : { target, code }),
  })
}
