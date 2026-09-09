// API helpers for the self-serve customer portal (CUST-PORTAL-01..04).
//
// Contract: docs/conventions/portal-api-contract.md. All authenticated calls
// pass the session token as `Authorization: Bearer <token>`. Mirrors the helper
// style of api/leads.js + api/relink.js.

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────

/**
 * Requests a one-time login code for the given email.
 * Always resolves — never rejects — to prevent account enumeration (the backend
 * returns the same 200 regardless of whether the email matches a customer).
 */
export async function requestCode(email) {
  try {
    await fetch(`${BASE}/api/portal/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch {
    // intentionally swallowed — caller always shows the generic "code sent" copy
  }
}

/**
 * Exchanges {email, code} for a session token.
 * Response on success: { success, session_token, customer }
 * Response on failure (401): { success: false, code: "OTP_INVALID_OR_USED" }
 */
export function verifyCode(email, code) {
  return apiFetch(`${BASE}/api/portal/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
}

/**
 * Validates a stored session token and returns the customer summary.
 * Response on success: { success, customer }; 401 { code: "INVALID_SESSION" } otherwise.
 */
export function validateSession(token) {
  return apiFetch(`${BASE}/api/portal/session`, {
    method: 'GET',
    headers: authHeaders(token),
  })
}

// ── Read model ────────────────────────────────────────────────────────────

/**
 * Fetches the masked, read-only customer summary.
 * Response: { success, customer: { profile, addresses, bank, documents } }
 */
export function getMe(token) {
  return apiFetch(`${BASE}/api/portal/me`, {
    method: 'GET',
    headers: authHeaders(token),
  })
}

/**
 * Downloads an owned document and saves it via a temporary object URL.
 * A cross-origin <a download> cannot carry the Authorization header, so we fetch
 * the bytes with the Bearer token and trigger the save client-side.
 * `url` is the absolute `download_url` from a summary document; `filename` is the
 * suggested save name. Returns true on success, false otherwise.
 */
export async function downloadDocument(token, url, filename) {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return false

    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename || 'document'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
    return true
  } catch {
    return false
  }
}

// ── Change requests ─────────────────────────────────────────────────────────

/**
 * Submits a proposed change request.
 * Payload: { requested_changes, description, files: [{ name, type }] }
 * Response on success (201): { success, change_request }
 * Response on failure (422): { success: false, errors: { field: [msg] } }
 */
export function submitChangeRequest(token, payload) {
  return apiFetch(`${BASE}/api/portal/change-requests`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
}

// ── File upload (browser → S3) ───────────────────────────────────────────────

/**
 * Mints a presigned S3 PUT URL for a supporting file.
 * Response: { success, url, key }
 */
export function presignUpload(token, filename, contentType) {
  return apiFetch(`${BASE}/api/portal/uploads/presign`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ filename, content_type: contentType }),
  })
}

/**
 * PUTs the raw file bytes to the presigned S3 URL. The URL is pre-authorized —
 * do NOT add signed headers (a Content-Type not covered by the signature would
 * break it). Returns true on a 2xx response.
 */
export async function uploadToS3(url, file) {
  try {
    const res = await fetch(url, { method: 'PUT', body: file })
    return res.ok
  } catch {
    return false
  }
}
