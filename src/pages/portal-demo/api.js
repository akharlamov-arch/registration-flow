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
