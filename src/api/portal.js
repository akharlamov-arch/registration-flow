// API helpers for the self-serve customer portal (CUST-PORTAL-01..04).
//
// Contract: docs/conventions/portal-api-contract.md. All authenticated calls
// pass the session token as `Authorization: Bearer <token>`. Mirrors the helper
// style of api/leads.js + api/relink.js.

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

// Fired on `window` when an authenticated call is refused because the session
// is gone (6h absolute / 10 min idle). Pages that hold a session listen for it
// and return the customer to sign-in instead of leaving a dead form behind.
export const SESSION_EXPIRED_EVENT = 'portal:session-expired'

function announceSessionLoss(status, data) {
  if (status === 401 && data?.code === 'INVALID_SESSION') {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }
}

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  announceSessionLoss(res.status, data)
  return { ok: res.ok, status: res.status, data }
}

// Code of the synthetic result `apiUpload` gives a request that never completed.
export const UPLOAD_INTERRUPTED = 'UPLOAD_INTERRUPTED'

/**
 * `apiFetch` for a body that takes a while to send. XMLHttpRequest rather than
 * fetch because only it reports upload progress — which is what tells a customer
 * on a weak signal that the upload is crawling, not dead.
 *
 * Resolves to the same `{ ok, status, data }` and fires the same session-expired
 * event. A request that never completes — dropped connection, nginx giving up on
 * a stalled body, a refusal the browser hides behind CORS — resolves to
 * `{ ok: false, status: 0, data: { code: UPLOAD_INTERRUPTED } }` instead of
 * rejecting, so the caller can tell it from a server refusal.
 */
export function apiUpload(url, { headers = {}, body, onProgress } = {}) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    Object.entries(headers).forEach(([name, value]) => xhr.setRequestHeader(name, value))

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      let data = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // A non-JSON body (a proxy's error page) carries no code.
      }
      announceSessionLoss(xhr.status, data)
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data })
    }

    const interrupted = () => resolve({ ok: false, status: 0, data: { code: UPLOAD_INTERRUPTED } })
    xhr.onerror = interrupted
    xhr.onabort = interrupted
    xhr.ontimeout = interrupted

    xhr.send(body)
  })
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

// ── Bank verification (Plaid) ───────────────────────────────────────────────

/**
 * Mints (or re-uses) a Plaid re-link token for the signed-in customer.
 *
 * There is no portal-specific Plaid exchange: the returned `relink_token` is
 * driven through the existing `/api/plaid/relink/:token/*` endpoints in
 * `api/relink.js`, which is where identity validation and persistence live.
 * The backend returns the *same* token until it is used or expires, so calling
 * this twice cannot fan out sessions.
 *
 * Response on success: { success, relink_token, expires_at }
 * Response on failure (503): { success: false, code: "PLAID_SESSION_UNAVAILABLE" }
 */
export function createPlaidVerificationSession(token) {
  return apiFetch(`${BASE}/api/portal/plaid/verification-session`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  })
}

// ── Contract (CONTRACT-REFRESH-01) ──────────────────────────────────────────

/**
 * The subject the customer's contract would be rendered from, plus the fields
 * the server refuses to save without and the option lists the form renders.
 *
 * SSN and driver-licence numbers are never in this payload — the response says
 * only whether each is on file (`stored`), and a save that omits them leaves
 * the stored ones untouched.
 *
 * Response: { success, contract: { signed_on, stale, pending },
 *             subject: { subject, required_fields, stored, options } }
 */
export function fetchContractSubject(token) {
  return apiFetch(`${BASE}/api/portal/contract`, {
    method: 'GET',
    headers: authHeaders(token),
  })
}

// The portal signs in place, in an embedded Zoho frame — never by email, which
// is the CRM operator's Send (PORTAL-SIGN-01). `sign_url` is a bearer link to
// sign this customer's contract: keep it in memory only — never in a URL,
// storage or a log.

/**
 * Save, render and open the contract for signing — `Sign updated contract`.
 * Response: { success, sign_url } | 422 errors | 422 CONTRACT_INCOMPLETE |
 * 502 CONTRACT_SIGN_FAILED.
 */
export function signContract(token, subject) {
  return apiFetch(`${BASE}/api/portal/contract/sign`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ subject }),
  })
}

/**
 * A fresh signing URL for the pending embedded request — the same request,
 * nothing new is created.
 * Response: { success, sign_url } | 409 SIGNING_NOT_RESUMABLE (sign again) | 502.
 */
export function resumeContractSigning(token) {
  return apiFetch(`${BASE}/api/portal/contract/sign-url`, {
    method: 'POST',
    headers: authHeaders(token),
  })
}

/**
 * Records the signature once Zoho confirms it. Idempotent — call it when the
 * frame returns and on load while `contract.pending.delivery === "embedded"`.
 * Response: { success, signed: true, contract } | 409 SIGNING_NOT_COMPLETED | 502.
 */
export function completeContractSigning(token) {
  return apiFetch(`${BASE}/api/portal/contract/complete`, {
    method: 'POST',
    headers: authHeaders(token),
  })
}

/**
 * Uploads the contract form's driver-licence scan THROUGH the backend
 * (PORTAL-UPLOAD-01), which stores it and records it on the customer before
 * answering — so it survives a reload before signing, like a lead's upload.
 * Multipart: only the Authorization header; the browser sets the boundary.
 * `onProgress(percent)` is called as the body goes out.
 * Response: 201 { success, file: { name, type } }
 *         | 422 { code: FILE_REQUIRED | FILE_TYPE_INVALID | FILE_TOO_LARGE } | 502 UPLOAD_FAILED
 *         | status 0 { code: UPLOAD_INTERRUPTED } when the request never completed.
 */
export function uploadDriverLicense(token, file, onProgress) {
  const body = new FormData()
  body.append('file', file, file.name)
  return apiUpload(`${BASE}/api/portal/contract/driver-license`, {
    headers: { Authorization: `Bearer ${token}` },
    body,
    onProgress,
  })
}

// ── File upload (browser → S3) ───────────────────────────────────────────────

/**
 * Mints a presigned S3 PUT URL for a change-request supporting file. Nothing
 * is recorded server-side until an operator applies the request — never use
 * this for a file that must survive the page (see uploadDriverLicense).
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
