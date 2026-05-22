const BASE        = import.meta.env.VITE_API_BASE_URL        ?? ''
const UPLOAD_BASE  = 'https://kaktw4vgmkbqzmxaxoaiitzwqm0tfdtk.lambda-url.us-east-1.on.aws/'

// ── Internal helpers ───────────────────────────────────────────────────────

async function apiFetch(url, options = {}) {
  const res  = await fetch(url, options)
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

function apiPost(path, body) {
  return apiFetch(`${BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

function apiGet(path) {
  return apiFetch(`${BASE}${path}`, {
    method:  'GET',
    headers: { 'Content-Type': 'application/json' },
  })
}

// ── Lead creation (LeadForm) ───────────────────────────────────────────────

export function createLead(payload) {
  return apiPost('/api/leads/save', payload)
}

/**
 * Validates a personalized invite token before the prospect starts filling
 * the form. Called on mount when `?invite=<token>` is present in the URL.
 *
 * Response on success: { success: true, invite_label, invite_expires_at }
 * Response on failure: { success: false, error: "not_found" | "consumed" | "expired" }
 */
export function fetchInvite(token) {
  return apiGet(`/api/leads/invite/${encodeURIComponent(token)}`)
}

// ── OTP / session ──────────────────────────────────────────────────────────

/**
 * Verifies an OTP code and returns the lead + session token.
 * The code is consumed on success — store the returned session_token immediately.
 * Response: { success, pending, session_token, lead, step_completed, document_id, code }
 */
export function verifyOtp(otp) {
  return apiGet(`/api/leads/fetch_by_code?code=${encodeURIComponent(otp)}`)
}

/**
 * Validates an existing session token (post-signing page).
 * Response: { success, lead, step_completed, message }
 */
export function validateSession(sessionToken) {
  return apiGet(`/api/leads/validate-session?sessionToken=${encodeURIComponent(sessionToken)}`)
}

/**
 * Sends a new OTP code to the given email address.
 * Always resolves — never rejects — to prevent email enumeration.
 * The backend always returns 200 regardless of whether the email exists.
 */
export async function requestNewCode(email) {
  try {
    await fetch(`${BASE}/api/leads/request-new-code`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email }),
    })
  } catch {
    // intentionally swallowed — caller always shows a success message
  }
}

// ── Progress saves ─────────────────────────────────────────────────────────

/**
 * Persists partial form progress on the server.
 * Intended to be fire-and-forget from navigation paths: call with .catch(), never await.
 * Payload shape: { form, code, sessionToken, stepCompleted }
 */
export function updateLead(payload) {
  return apiPost('/api/leads/update-lead', payload)
}

// ── Document upload ────────────────────────────────────────────────────────

/**
 * Uploads a document (voidCheck, driverLicenseScan) to the lead controller.
 * Accepts a pre-built FormData — do NOT set Content-Type; the browser must set
 * the multipart boundary itself.
 * Response: { success, fileName, message }
 */
export async function uploadDocument(formData) {
  const res  = await fetch(`${BASE}/api/leads/upload_document`, {
    method: 'POST',
    body:   formData,
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

/**
 * Uploads a fuel invoice to the pre-auth Lambda (no session token required).
 * Uses raw bytes with Content-Type + X-File-Name headers — distinct from uploadDocument.
 * Response: { success, fileName }
 */
export async function uploadFuelInvoice(file) {
  const res  = await fetch(UPLOAD_BASE, {
    method:  'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'X-File-Name':  file.name,
    },
    body: file,
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

// ── Contract & signing ─────────────────────────────────────────────────────

/**
 * Generates the contract document in Google Drive.
 * Payload shape: { registrationProof, code, sessionToken, form }
 * Response: { success, document_id, message }
 */
export function generateContract(payload) {
  return apiPost('/api/leads/generate_contract', payload)
}

/**
 * Returns a Zoho signing embed URL for the given document.
 * Payload shape: { code, sessionToken, documentId }
 * Response: { success, sign_url, message }
 */
export function getSignEmbedUrl(payload) {
  return apiPost('/api/leads/sign_embed_url', payload)
}

/**
 * Marks the lead as signed and triggers onboarding task creation.
 * Idempotent and fire-and-forget — failure is non-blocking.
 */
export async function completeSigning(sessionToken) {
  try {
    await fetch(`${BASE}/api/leads/complete-signing`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sessionToken }),
    })
  } catch {
    // fire-and-forget — safe to retry on next page load
  }
}


// ── Plaid ──────────────────────────────────────────────────────────────────

export const plaidConfig = {
  step5Enabled:        (import.meta.env.VITE_PLAID_STEP5_ENABLED        ?? 'true')  !== 'false',
  combinedLinkEnabled: (import.meta.env.VITE_PLAID_COMBINED_LINK_ENABLED ?? 'false') !== 'false',
}

/**
 * Fetches a Plaid Link token for standard bank auth.
 * Payload shape: { verificationCode, sessionToken, mode: 'standard' }
 * Response: { success, link_token, expiration, request_id }
 */
export function getPlaidLinkToken(payload) {
  return apiPost('/api/leads/plaid/link-token', payload)
}

/**
 * Fetches a combined Plaid Link token (bank auth + identity verification).
 * Payload shape: { verificationCode, sessionToken, mode: 'single_session_probe' }
 * Response: { success, mode, link_token, expiration, request_id,
 *             identity_verification_template_id }
 */
export function getPlaidCombinedLinkToken(payload) {
  return apiPost('/api/leads/plaid/combined-link-token', payload)
}

/**
 * Exchanges a Plaid public token after the Link UI completes.
 * Payload shape: { verificationCode, sessionToken, publicToken, accountId, metadata }
 * Response: { success, plaid: { ... }, requires_manual_bank_input, message }
 */
export function exchangePlaidToken(payload) {
  return apiPost('/api/leads/plaid/exchange', payload)
}

// ── Bank ACH verification ──────────────────────────────────────────────────

/**
 * Verifies a bank account via ACH database lookup (read-only, no linking).
 * Payload shape: { sessionToken, accountNumber, routingNumber, legalName }
 * Response: { success, verification_status, message }
 *   verification_status: 'database_insights_pass' | 'database_insights_pass_with_caution' | 'database_insights_fail'
 */
export function authVerifyBank(payload) {
  return apiPost('/api/leads/plaid/auth-verify', payload)
}

// ── Fuel cards ─────────────────────────────────────────────────────────────

/**
 * Bypasses Plaid verification after at least one failed attempt.
 * Available only when the server has recorded a prior Plaid failure.
 * Payload shape: { sessionToken }
 * Response: { success, step_completed, next_step }
 */
export function skipPlaidVerification(payload) {
  return apiPost('/api/leads/plaid/skip-verification', payload)
}

/**
 * Saves fuel card assignments.
 * Payload differs slightly between flows:
 *   - OTP flow:         { otpCode, sessionToken, fuelCards }
 *   - Post-signing flow: { sessionToken, fuelCards }
 * fuelCards: Array<{ unit: string, driver_id: string }>
 * Response: { success, message }
 */
export function setFuelCards(payload) {
  return apiPost('/api/leads/set_fuel_cards', payload)
}

// ── OTP generation ─────────────────────────────────────────────────────────

export function generateOtpCode() {
  const min = 100000, max = 999999
  if (window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1)
    window.crypto.getRandomValues(arr)
    return String(min + (arr[0] % (max - min + 1)))
  }
  return String(Math.floor(Math.random() * (max - min + 1)) + min)
}
