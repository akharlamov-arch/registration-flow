// Pure transforms + field metadata for the customer portal change-request form.
// No HTTP here. The whitelist mirrors the backend's
// `Pijb.Customers.ChangeRequest.proposable_fields/0` (addresses + email +
// company name; bank is intentionally excluded → Plaid re-link).

// Shipping address is intentionally omitted — it duplicates the mailing address
// and is no longer used. The backend still accepts it; the portal just won't
// propose it.
export const ADDRESS_FIELDS = ['mailing_address', 'company_address']
export const SCALAR_FIELDS = ['email', 'cust_name']
export const ADDRESS_SUBFIELDS = ['line1', 'line2', 'city', 'state', 'zip']

// i18n label keys for each proposable field (resolved via `t()` in the page).
export const FIELD_LABEL_KEYS = {
  email: 'portal.fields.email',
  cust_name: 'portal.fields.companyName',
  mailing_address: 'portal.fields.mailingAddress',
  company_address: 'portal.fields.companyAddress',
}

const EMPTY_ADDRESS = { line1: '', line2: '', city: '', state: '', zip: '' }

function pickAddress(raw) {
  return {
    line1: raw?.line1 || '',
    line2: raw?.line2 || '',
    city: raw?.city || '',
    state: raw?.state || '',
    zip: raw?.zip || '',
  }
}

/**
 * Builds the editable change-request form state, pre-filled from the read-only
 * `/me` summary so the operator-facing diff starts from the current values.
 */
export function initialChangeForm(summary) {
  const profile = summary?.profile || {}
  const addresses = summary?.addresses || {}

  return {
    email: profile.email || '',
    cust_name: profile.cust_name || '',
    mailing_address: pickAddress(addresses.mailing_address),
    company_address: pickAddress(addresses.company_address),
    description: '',
  }
}

function normalizeAddress(addr) {
  return ADDRESS_SUBFIELDS.reduce((acc, key) => {
    acc[key] = (addr?.[key] || '').trim()
    return acc
  }, {})
}

function addressChanged(current, proposed) {
  const a = normalizeAddress(current)
  const b = normalizeAddress(proposed)
  return ADDRESS_SUBFIELDS.some((key) => a[key] !== b[key])
}

/**
 * Diffs the form against the current summary and builds the submit payload.
 * Only fields the user actually changed land in `requested_changes`, so an
 * unchanged value is never proposed. Returns `{ requested_changes, description,
 * files }`. `files` is a list of `{ name, type }` (S3 keys from presign).
 */
export function buildChangeRequestPayload(summary, form, files = []) {
  const profile = summary?.profile || {}
  const addresses = summary?.addresses || {}
  const requested_changes = {}

  for (const field of SCALAR_FIELDS) {
    const next = (form[field] || '').trim()
    if (next !== (profile[field] || '').trim()) {
      requested_changes[field] = next
    }
  }

  for (const field of ADDRESS_FIELDS) {
    if (addressChanged(addresses[field], form[field])) {
      requested_changes[field] = normalizeAddress(form[field])
    }
  }

  return {
    requested_changes,
    description: (form.description || '').trim(),
    files,
  }
}

/**
 * True when there is nothing worth submitting (no field changes, no note, no
 * files) — mirrors the backend's `validate_has_content`.
 */
export function isEmptyChangeRequest(payload) {
  return (
    Object.keys(payload.requested_changes).length === 0 &&
    !payload.description &&
    (payload.files?.length ?? 0) === 0
  )
}

/**
 * Flattens the server's `errors` map (`{ field: [msg, ...] }`) into a single
 * readable string for a flash/banner.
 */
export function formatErrors(errors) {
  if (!errors || typeof errors !== 'object') return ''
  return Object.values(errors)
    .flat()
    .filter(Boolean)
    .join(' ')
}
