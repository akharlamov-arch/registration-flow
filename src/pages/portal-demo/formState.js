// Form state, validation and the submit payload for step 1.
// Pure functions only — no React, no HTTP.

import { GROUPS, CHOICE_GROUPS } from './fields'

const EMAIL_RE = /^\S+@\S+\.\S+$/

export function emptyForm() {
  const values = {}
  for (const group of GROUPS) {
    for (const field of group.fields) values[field.key] = ''
  }
  return values
}

/**
 * Pre-fills what the portal already knows. Everything the updated contract
 * newly asks for starts empty — which is the point of the step.
 */
export function initialForm(customer) {
  const values = emptyForm()
  const profile = customer?.profile || {}
  const addresses = customer?.addresses || {}
  const company = addresses.company_address || {}
  const mailing = addresses.mailing_address || {}

  values.company_name = profile.cust_name || ''
  values.company_email = profile.email || ''
  values.company_street1 = company.line1 || ''
  values.company_street2 = company.line2 || ''
  values.company_city = company.city || ''
  values.company_state = company.state || ''
  values.company_zip = company.zip || ''
  values.mailing_street1 = mailing.line1 || ''
  values.mailing_street2 = mailing.line2 || ''
  values.mailing_city = mailing.city || ''
  values.mailing_state = mailing.state || ''
  values.mailing_zip = mailing.zip || ''
  // Set by iTrucking, shown read-only. Tiers are plain numbers.
  values.discount_tier = 'Tier 2'

  return values
}

/** Radio selections, keyed by group id. Defaults match the registration flow. */
export function initialChoices() {
  return CHOICE_GROUPS.reduce((acc, g) => {
    acc[g.id] = g.choice.default
    return acc
  }, {})
}

/** True when a group's inputs are hidden behind its current radio selection. */
export function groupHidden(group, choices) {
  if (!group.choice) return false
  return choices[group.id] !== group.choice.revealOn
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function fieldError(field, values) {
  const raw = String(values[field.key] || '').trim()

  if (field.required && !raw) return 'This field is required'
  if (!raw) return ''

  // Confirmation fields must match their source (personalInfo.errorDlMismatch).
  if (field.matches) {
    const other = String(values[field.matches] || '').trim()
    if (raw !== other) return 'Driver License Numbers do not match'
    return ''
  }

  switch (field.type) {
    case 'email':
      return EMAIL_RE.test(raw) ? '' : 'Please enter a valid email address'
    case 'phone': {
      const d = digits(raw)
      const local = d.length === 11 ? d.slice(1) : d
      return local.length === 10 ? '' : 'Enter a valid 10-digit phone number'
    }
    case 'zip':
      return digits(raw).length === 5 ? '' : 'ZIP code must be 5 digits'
    case 'number':
      return Number(raw) > 0 ? '' : 'Please enter a valid number'
    case 'secret':
      if (field.format === 'ssn') return digits(raw).length === 9 ? '' : 'SSN must be exactly 9 digits'
      return ''
    default:
      return ''
  }
}

/** Returns { [fieldKey]: message } for every field that fails. */
export function validate(values, choices) {
  const errors = {}
  for (const group of GROUPS) {
    if (groupHidden(group, choices)) continue
    for (const field of group.fields) {
      if (field.type === 'readonly') continue
      const message = fieldError(field, values)
      if (message) errors[field.key] = message
    }
  }
  return errors
}

export function isComplete(values, choices) {
  return Object.keys(validate(values, choices)).length === 0
}

function addressFrom(values, prefix) {
  return {
    line1: values[`${prefix}_street1`] || '',
    line2: values[`${prefix}_street2`] || '',
    city:  values[`${prefix}_city`]    || '',
    state: values[`${prefix}_state`]   || '',
    zip:   values[`${prefix}_zip`]     || '',
  }
}

/**
 * Submit payload. Field names follow prompts/LEAD_API_CONTRACT.md wherever a
 * counterpart exists, so the backend sees the shape it already knows; the rest
 * is what this step adds.
 */
export function buildPayload(values, choices) {
  const company = addressFrom(values, 'company')
  const mailing = choices.mailing === 'other' ? addressFrom(values, 'mailing') : company

  const personalAddress =
    choices.home === 'other' ? addressFrom(values, 'home')
    : choices.home === 'same-as-mailing' ? mailing
    : company

  const isSelf = choices.billing_contact === 'self'

  return {
    companyName: values.company_name,
    businessType: values.business_type,
    companyTitle: values.company_title,
    companyTrucks: Number(values.company_trucks) || 0,
    companyDOT: values.company_dot || null,
    companyMC: values.company_mc || null,
    companyPhoneNumber: values.company_phone,
    companyBillingEmail: values.company_email,

    firstName: values.first_name,
    lastName: values.last_name,
    phone: values.mobile_phone,

    companyAddress: company,
    mailingAddressChoice: choices.mailing === 'other' ? 'custom' : 'same-as-company',
    mailingAddress: mailing,

    personal: {
      // Full values — the UI masks them for display only.
      ssn: values.ssn,
      driverLicenseNumber: values.dl_number,
    },
    files: {
      driverLicenseScan: { field: 'driverLicenseScan', filename: values.dl_file || null },
    },

    personalAddressChoice: choices.home,
    personalAddress,

    billingChoice: choices.billing_contact,
    billingContact: isSelf
      ? {
          name: [values.first_name, values.last_name].filter(Boolean).join(' '),
          role: values.company_title,
          email: values.company_email,
        }
      : {
          name: [values.billing_first_name, values.billing_last_name].filter(Boolean).join(' '),
          role: values.billing_title,
          email: values.billing_email,
          phone: values.billing_phone,
        },
  }
}
