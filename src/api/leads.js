const BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_LAMBDA_URL ?? ''

export async function createLead(payload) {
  const res = await fetch(`${BASE}/api/leads/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

export async function uploadFuelInvoice(file) {
  const res = await fetch(UPLOAD_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'X-File-Name': file.name,
    },
    body: file,
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export function generateOtpCode() {
  const min = 100000, max = 999999
  if (window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1)
    window.crypto.getRandomValues(arr)
    return String(min + (arr[0] % (max - min + 1)))
  }
  return String(Math.floor(Math.random() * (max - min + 1)) + min)
}
