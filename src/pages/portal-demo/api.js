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
// First login: OTP, then the customer creates a password.
// Every login after that: password, then an OTP — the password alone never
// mints a session.

/**
 * Which way this email signs in.
 * Response: { success, has_password }
 *
 * NOTE for the backend: answering this truthfully tells an anonymous caller
 * whether an account exists, which /request-code deliberately avoids (it
 * returns the same 200 either way). If that matters, the alternative is to
 * always show the password field and offer "first time? get a code instead",
 * which reveals nothing.
 */
export function loginMethod(email) {
  return apiFetch(`${BASE}/api/portal/login-method`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

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
