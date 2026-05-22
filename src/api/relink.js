// API helpers for the standalone Plaid re-link flow (PLAID-RELINK-01).
//
// All three endpoints are unauthenticated and resolve by the session token in
// the URL path. They are routed to `PijbWeb.PlaidRelinkController` on the
// backend; see `lib/pijb_web/controllers/plaid_relink_controller.ex`.

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

/**
 * Validates a re-link session token and returns minimal display info.
 *
 * Response on success: { success: true, display_name, expires_at }
 * Response on failure (410 Gone): { success: false, error: "not_found" | "consumed" | "expired" }
 */
export function fetchRelinkSession(token) {
  return apiFetch(`${BASE}/api/plaid/relink/${encodeURIComponent(token)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Creates a Plaid Link token for the recipient's browser.
 *
 * Response on success: { success, link_token, expiration, request_id }
 */
export function fetchRelinkLinkToken(token) {
  return apiFetch(`${BASE}/api/plaid/relink/${encodeURIComponent(token)}/link-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
}

/**
 * Exchanges the Plaid `public_token` returned by Plaid Link onSuccess, runs
 * server-side identity validation, and persists `bank_information` on the
 * parent (lead or customer). Failure modes:
 *   - 410 — token not found / consumed / expired
 *   - 422 — identity mismatch (holder_type, name)
 *   - 502 — Plaid upstream failure
 */
export function exchangeRelink(token, payload) {
  return apiFetch(`${BASE}/api/plaid/relink/${encodeURIComponent(token)}/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
