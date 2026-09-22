// Form state, validation and the proposed submit payload for step 1.
// Pure functions only — no React, no HTTP.

import { GROUPS } from './fields'

const EMAIL_RE = /^\S+@\S+\.\S+$/

// Groups whose inputs are skipped while their "same as" box is ticked.
export const SAME_AS_GROUPS = GROUPS.filter((g) => g.sameAs)

export function emptyForm() {
  const values = {}
  for (const group of GROUPS) {
    for (const field of group.fields) values[field.key] = ''
  }
  return values
}

/**
 * Pre-fills what the portal already knows about the customer. Everything the
 * updated contract newly asks for starts empty — which is the point of the step.
 */
export function initialForm(customer) {
  const values = emptyForm()
  const profile = customer?.profile || {}
  const addresses = customer?.addresses || {}
  const company = addresses.company_address || {}
  const mailing = addresses.mailing_address || {}

  values.company_name = profile.cust_name || ''
  values.company_email = profile.email || ''
  values.company_line1 = company.line1 || ''
  values.company_city = company.city || ''
  values.company_state = company.state || ''
  values.company_zip = company.zip || ''
  values.mailing_line1 = mailing.line1 || ''
  values.mailing_line2 = mailing.line2 || ''
  values.mailing_city = mailing.city || ''
  values.mailing_state = mailing.state || ''
  values.mailing_zip = mailing.zip || ''
  values.fuel_tier = 'Tier 2 — 12¢/gal'

  return values
}

// `sameAs` flags live beside the values: { mailing: true, home: true }.
export function initialSameAs() {
  // Both default to "same as" — the common case, and it matches the server
  // fallback in api/leadMappers.js:56 (no personal address stored →
  // personalAddressChoice "same-as-business"). Unticking reveals the inputs.
  return SAME_AS_GROUPS.reduce((acc, g) => {
    acc[g.id] = true
    return acc
  }, {})
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function fieldError(field, value) {
  const raw = String(value || '').trim()

  if (field.required && !raw) return 'Required'
  if (!raw) return ''

  switch (field.type) {
    case 'email':
      return EMAIL_RE.test(raw) ? '' : 'Enter a valid email address'
    case 'phone': {
      const d = digits(raw)
      const local = d.length === 11 ? d.slice(1) : d
      return local.length === 10 ? '' : 'Enter a 10-digit phone number'
    }
    case 'zip':
      return digits(raw).length === 5 ? '' : 'ZIP must be 5 digits'
    case 'number':
      return Number(raw) > 0 ? '' : 'Enter a number greater than zero'
    case 'secret':
      if (field.format === 'ssn') return digits(raw).length === 9 ? '' : 'SSN must be 9 digits'
      return raw.length >= 4 ? '' : 'Enter the full number'
    default:
      return ''
  }
}

/** Returns { [fieldKey]: message } for every field that fails. */
export function validate(values, sameAs) {
  const errors = {}
  for (const group of GROUPS) {
    if (group.sameAs && sameAs[group.id]) continue
    for (const field of group.fields) {
      if (field.type === 'readonly') continue
      const message = fieldError(field, values[field.key])
      if (message) errors[field.key] = message
    }
  }
  return errors
}

export function isComplete(values, sameAs) {
  return Object.keys(validate(values, sameAs)).length === 0
}

function addressFrom(values, prefix) {
  return {
    line1: values[`${prefix}_line1`] || '',
    line2: values[`${prefix}_line2`] || '',
    city: values[`${prefix}_city`] || '',
    state: values[`${prefix}_state`] || '',
    zip: values[`${prefix}_zip`] || '',
  }
}

/**
 * PROPOSED payload for the updated-contract submission. Named to match
 * prompts/LEAD_API_CONTRACT.md where a counterpart exists; the rest is what
 * this step adds and is what the backend team needs to agree on.
 */
export function buildPayload(values, sameAs) {
  const company = addressFrom(values, 'company')
  return {
    companyName: values.company_name,
    businessFormationType: values.formation_type,
    companyPhoneNumber: values.company_phone,
    companyBillingEmail: values.company_email,
    truckCount: Number(values.truck_count) || 0,
    dotNumber: values.dot_number || null,
    mcNumber: values.mc_number || null,
    companyAddress: company,
    mailingAddressChoice: sameAs.mailing ? 'same-as-company' : 'custom',
    mailingAddress: sameAs.mailing ? company : addressFrom(values, 'mailing'),
    firstName: values.first_name,
    lastName: values.last_name,
    billingContact: {
      name: [values.first_name, values.last_name].filter(Boolean).join(' '),
      role: values.contact_role,
      email: values.company_email,
    },
    mobilePhoneNumber: values.mobile_phone,
    personal: {
      // Full values — the UI masks them for display only.
      ssn: values.ssn,
      driverLicenseNumber: values.driver_license,
    },
    files: {
      driverLicenseScan: { field: 'driverLicenseScan', filename: values.dl_file || null },
    },
    personalAddressChoice: sameAs.home ? 'same-as-business' : 'custom',
    personalAddress: sameAs.home ? company : addressFrom(values, 'home'),
  }
}
