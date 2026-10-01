// Form state, validation and the submit payload for step 1.
// Pure functions only — no React, no HTTP.
//
// The visual layout lives in Step1Contract.jsx and GROUPS in fields.js. The
// values behind it are mapped from the real contract subject (src/api/portal.js's
// fetchContractSubject) and mapped back the same way for signContract. GROUPS asks for a few things the real subject doesn't have a
// field for (`company_title`'s CEO/CFO options, split first/last billing
// names, the mailing/personal "same as" shortcuts) and the real subject holds
// a few things GROUPS never shows (`account`, `is_business?`, `discount_tier`,
// the signer's own `email`) — those pass through unedited so a save here never
// blanks out what this step doesn't ask about. `title` is shown, as "Your
// title" (`company_title`): it is the contract's primary-contact title and the
// signer's role on the contact the server creates after signing. There is no billing
// schedule: the server derives it from the customer's payment channel.
// `company_name` and `discount_tier` are only our team's to change; the server
// ignores what this form posts for them and keeps its own.

import { GROUPS, CHOICE_GROUPS, COMPANY_TITLES } from './fields'

const EMAIL_RE = /^\S+@\S+\.\S+$/

// GROUPS' business_type select uses short codes ('llc'); the real subject
// stores whatever Pijb.Contracts.PortalSubmission's own option list spells
// ("LLC", "Sole Proprietor", …) — see lib/pijb/contracts/portal_submission.ex
// @business_type_options. Nothing on the server enforces this (no
// `validate_inclusion`), but sending the code as-is would still quietly store
// a value the CRM's own contract page never produces.
const BUSINESS_TYPE_TO_CRM = {
  sole: 'Sole Proprietor',
  partnership: 'Partnership',
  llc: 'LLC',
  corporation: 'Corporation',
}
const CRM_TO_BUSINESS_TYPE = Object.fromEntries(
  Object.entries(BUSINESS_TYPE_TO_CRM).map(([code, label]) => [label.toLowerCase(), code]),
)

export function emptyForm() {
  const values = {}
  for (const group of GROUPS) {
    for (const field of group.fields) values[field.key] = ''
  }
  return values
}

function scalar(value) {
  return value === null || value === undefined ? '' : String(value)
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean)
  return { first: parts[0] || '', last: parts.slice(1).join(' ') }
}

function addrEqual(a = {}, b = {}) {
  return ['line1', 'line2', 'city', 'state', 'zip'].every((k) => scalar(a[k]) === scalar(b[k]))
}

/**
 * Pre-fills the form from the real contract subject
 * (`fetchContractSubject`'s `subject.subject`).
 *
 * ssn/driver_license_number are never sent by the server — they always start
 * blank here; `meta.stored` says whether one is
 * already on file, submitting blank leaves it untouched.
 */
export function initialFormFromSubject(subject = {}) {
  const values = emptyForm()

  values.first_name = scalar(subject.first_name)
  values.last_name = scalar(subject.last_name)
  values.mobile_phone = scalar(subject.phone)

  values.company_name = scalar(subject.company_name)
  // Accept either spelling already on file: a raw code (what this step itself
  // writes) or the CRM's own label (what the contract page writes).
  values.business_type = BUSINESS_TYPE_TO_CRM[subject.business_type]
    ? subject.business_type
    : CRM_TO_BUSINESS_TYPE[String(subject.business_type || '').toLowerCase()] || ''
  // "Title of the Primary Contact" is a fixed CEO/CFO/… select here but a free
  // text `title` on the real subject — preselect the option that already
  // spells it, and leave it blank rather than guess otherwise.
  values.company_title = COMPANY_TITLES.find(([, label]) => label === subject.title)?.[0] || ''
  values.company_trucks = scalar(subject.fleet_size)
  values.company_dot = scalar(subject.company_dot)
  values.company_mc = scalar(subject.company_mc)
  values.company_email = scalar(subject.billing_contact?.email) || scalar(subject.email)

  const company = subject.company_address || {}
  values.company_street1 = scalar(company.line1)
  values.company_street2 = scalar(company.line2)
  values.company_city = scalar(company.city)
  values.company_state = scalar(company.state)
  values.company_zip = scalar(company.zip)

  const mailing = subject.mailing_address || {}
  values.mailing_street1 = scalar(mailing.line1)
  values.mailing_street2 = scalar(mailing.line2)
  values.mailing_city = scalar(mailing.city)
  values.mailing_state = scalar(mailing.state)
  values.mailing_zip = scalar(mailing.zip)

  const home = subject.personal_address || {}
  values.home_street1 = scalar(home.line1)
  values.home_street2 = scalar(home.line2)
  values.home_city = scalar(home.city)
  values.home_state = scalar(home.state)
  values.home_zip = scalar(home.zip)

  values.ssn = ''
  values.dl_number = ''
  values.dl_confirm = ''
  values.dl_file = scalar(subject.driver_license_file_name)

  const billing = subject.billing_contact || {}
  const { first, last } = splitName(billing.name)
  values.billing_first_name = first
  values.billing_last_name = last
  values.billing_email = scalar(billing.email)
  values.billing_phone = scalar(billing.phone)
  values.billing_title = scalar(billing.role)

  return values
}

/**
 * Radio selections, keyed by group id — reverse-engineered from the real
 * addresses/billing contact so a subject nobody has customized yet opens on
 * the simpler "same as" option instead of "other" with everything blank.
 */
export function initialChoicesFromSubject(subject = {}) {
  const company = subject.company_address || {}
  const mailing = subject.mailing_address || {}
  const home = subject.personal_address || {}
  const billing = subject.billing_contact || {}

  const choices = {}
  for (const group of CHOICE_GROUPS) {
    if (group.id === 'mailing') {
      choices.mailing = addrEqual(mailing, company) ? 'same-as-company' : 'other'
    } else if (group.id === 'home') {
      choices.home =
        addrEqual(home, company) ? 'same-as-business'
        : addrEqual(home, mailing) ? 'same-as-mailing'
        : 'other'
    } else if (group.id === 'billing_contact') {
      choices.billing_contact = !billing.email || billing.email === subject.email ? 'self' : 'other'
    } else {
      choices[group.id] = group.choice.default
    }
  }
  return choices
}

/** True when a group's inputs are hidden behind its current radio selection. */
export function groupHidden(group, choices) {
  if (!group.choice) return false
  return choices[group.id] !== group.choice.revealOn
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

// Returns a translation KEY, not a message — the component resolves it, so the
// same validation speaks all four languages. Keys are the registration flow's
// own error strings.
function fieldError(field, values) {
  const raw = String(values[field.key] || '').trim()

  if (field.required && !raw) return 'common.required'
  if (!raw) return ''

  if (field.matches) {
    const other = String(values[field.matches] || '').trim()
    return raw === other ? '' : 'personalInfo.errorDlMismatch'
  }

  switch (field.type) {
    case 'email':
      return EMAIL_RE.test(raw) ? '' : 'common.invalidEmail'
    case 'phone': {
      const d = digits(raw)
      const local = d.length === 11 ? d.slice(1) : d
      return local.length === 10 ? '' : 'common.phoneInvalid'
    }
    case 'zip':
      return digits(raw).length === 5 ? '' : 'address.errorZipFormat'
    case 'number':
      return Number(raw) > 0 ? '' : 'lead.stepBusiness.trucksRequired'
    case 'secret':
      if (field.format === 'ssn') return digits(raw).length === 9 ? '' : 'personalInfo.errorSsnFormat'
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
 * Builds the real `/api/portal/contract` payload from this step's flat
 * values, merging in whatever `subject` (the last fetched real subject) held
 * for the fields GROUPS has no editor for — so saving never clears a value
 * this step never asked about.
 */
export function buildContractPayload(values, choices, subject = {}) {
  const company = addressFrom(values, 'company')
  const mailing = choices.mailing === 'other' ? addressFrom(values, 'mailing') : company

  const personalAddress =
    choices.home === 'other' ? addressFrom(values, 'home')
    : choices.home === 'same-as-mailing' ? mailing
    : company

  const isSelf = choices.billing_contact === 'self'
  const fullName = [values.first_name, values.last_name].filter(Boolean).join(' ')
  const companyTitleLabel = COMPANY_TITLES.find(([v]) => v === values.company_title)?.[1] || ''

  const billingContact = isSelf
    ? {
        name: fullName,
        role: companyTitleLabel,
        email: values.company_email,
        phone: values.mobile_phone,
      }
    : {
        name: [values.billing_first_name, values.billing_last_name].filter(Boolean).join(' '),
        role: values.billing_title,
        email: values.billing_email,
        phone: values.billing_phone,
      }

  return {
    // Pass-through: this step has no editor for these, so whatever the server
    // last told us rides along unchanged.
    // "Your title" — kept as the subject's own text when no option spells it.
    title: companyTitleLabel || (subject.title ?? ''),
    email: subject.email ?? '',
    'is_business?': subject['is_business?'] !== false,
    account: subject.account ?? '',
    discount_tier: subject.discount_tier ?? '',

    first_name: values.first_name,
    last_name: values.last_name,
    phone: values.mobile_phone,

    company_name: values.company_name,
    business_type: BUSINESS_TYPE_TO_CRM[values.business_type] || values.business_type,
    company_mc: values.company_mc || null,
    company_dot: values.company_dot || null,
    fleet_size: values.company_trucks,

    company_address: company,
    mailing_address: mailing,
    personal_address: personalAddress,

    billing_contact: billingContact,

    // Blank leaves the stored value untouched server-side (never clears it).
    ssn: values.ssn,
    driver_license_number: values.dl_number,
    driver_license_file_name: values.dl_file,
  }
}

// Server field name → the flat GROUPS key that shows it, for mapping a 422's
// `errors: {field: [message]}` back onto the visible red-highlighted field.
// Nested keys (company_address, billing_contact, …) have no single field to
// land on, so those surface as a general banner instead.
const SERVER_TO_FORM_FIELD = {
  first_name: 'first_name',
  last_name: 'last_name',
  phone: 'mobile_phone',
  business_type: 'business_type',
  company_mc: 'company_mc',
  company_dot: 'company_dot',
  fleet_size: 'company_trucks',
  ssn: 'ssn',
  driver_license_number: 'dl_number',
  driver_license_file_name: 'dl_file',
}

// Values only our team sets. A refusal naming one is not something the
// customer can fix on this form, so it gets a "contact support" message
// rather than a highlight on a field they cannot edit.
const LOCKED_SERVER_FIELDS = ['company_name', 'discount_tier']

export function mapServerErrors(errors = {}) {
  const fieldErrors = {}
  const unmapped = []
  const locked = []

  for (const [key, messages] of Object.entries(errors)) {
    const formKey = SERVER_TO_FORM_FIELD[key]
    const message = Array.isArray(messages) ? messages[0] : messages
    if (formKey) fieldErrors[formKey] = message
    else if (LOCKED_SERVER_FIELDS.includes(key)) locked.push(key)
    else unmapped.push(key)
  }

  return { fieldErrors, unmapped, locked }
}

// ── Manual bank verification (MOOV fallback) ────────────────────────────────
// Mirrors handleBankSubmit in src/pages/OtpVerification.jsx:790-812 exactly:
// account number 5–17 digits, confirmation must match, routing exactly 9
// digits, and a void check is required. Returns bankInfo.* translation keys.

export function emptyBankDetails() {
  return {
    accountNumber: '',
    accountNumberConfirm: '',
    routingNumber: '',
    voidCheck: '',
  }
}

export function validateBankDetails(v) {
  const errors = {}

  if (!v.voidCheck) errors.voidCheck = 'bankInfo.errorVoidCheckRequired'

  const acct = String(v.accountNumber || '').replace(/\D/g, '')
  if (!acct) errors.accountNumber = 'bankInfo.errorAccountRequired'
  else if (!/^\d{5,17}$/.test(acct)) errors.accountNumber = 'bankInfo.errorAccountDigits'

  const confirm = String(v.accountNumberConfirm || '').replace(/\D/g, '')
  if (confirm !== acct) errors.accountNumberConfirm = 'bankInfo.errorAccountMismatch'

  const routing = String(v.routingNumber || '').trim()
  if (!routing) errors.routingNumber = 'bankInfo.errorRoutingRequired'
  else if (!/^\d{9}$/.test(routing)) errors.routingNumber = 'bankInfo.errorRoutingFormat'

  return errors
}
