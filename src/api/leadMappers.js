// ── Response mappers (API snake_case → React camelCase) ────────────────────

/**
 * Maps the top-level lead object returned by fetch_by_code into the shape
 * expected by the React form state.
 */
export function mapLeadFromApi(apiLead) {
  return {
    firstName:            apiLead.first_name   || '',
    lastName:             apiLead.last_name    || '',
    email:                apiLead.email        || '',
    phone:                apiLead.phone        || '',
    accountType:          apiLead['is_business?'] ? 'business' : 'personal',
    businessOwnerConfirm: !!apiLead['is_business?'],
    companyName:          apiLead.company_name || '',
    businessType:         apiLead.business_type || '',
    companyTitle:         apiLead.title        || '',
    fleetSize:            apiLead.fleet_size   ?? '',
    dot: apiLead.company_dot != null ? String(apiLead.company_dot) : '',
    mc:  apiLead.company_mc  != null ? String(apiLead.company_mc)  : '',
    refFirstName:         apiLead.referer?.ref_first_name || '',
    refLastName:          apiLead.referer?.ref_last_name  || '',
    refCompany:           apiLead.referer?.ref_company    || '',
    refPhone:             apiLead.referer?.ref_phone      || '',
    driverLicenseNumber:  apiLead.driver_license_number   || '',
  }
}

const EMPTY_ADDRESS = { line1: '', line2: '', city: '', state: '', zip: '' }

function pickAddress(raw) {
  if (!raw) return null
  return {
    line1: raw.line1 || '',
    line2: raw.line2 || '',
    city:  raw.city  || '',
    state: raw.state || '',
    zip:   raw.zip   || '',
  }
}

/**
 * Returns company, mailing, and personal address state from the API lead.
 * Falls back to same-as-company / same-as-business when the server has no
 * separate address stored.
 */
export function mapAddressesFromApi(apiLead) {
  const companyAddress = pickAddress(apiLead.company_address || apiLead.address)
    ?? { ...EMPTY_ADDRESS }

  const rawMailing = pickAddress(apiLead.mailing_address)
  const mailingAddressChoice = rawMailing ? 'other' : 'same-as-company'
  const mailingAddress = rawMailing ?? { ...companyAddress }

  const rawPersonal = pickAddress(apiLead.shipping_address)
  const personalAddressChoice = rawPersonal ? 'other' : 'same-as-business'
  const personalAddress = rawPersonal ?? { ...companyAddress }

  return {
    companyAddress,
    mailingAddressChoice,
    mailingAddress,
    personalAddressChoice,
    personalAddress,
  }
}

/**
 * Mirrors `Pijb.Plaid.Rejection.rejected?/1` on the client so resume state
 * does not treat a rejection audit snapshot as a successful verification.
 */
export function isUnresolvedPlaidRejection(metadataPlaid = {}, apiRejected) {
  if (apiRejected === true) return true

  const reason = metadataPlaid.plaid_last_rejection_reason
  if (!reason) return false

  const verification = metadataPlaid.verification_method
  const skipUser = metadataPlaid.skip_authorization?.user_id

  if (verification === 'plaid') return false
  if (verification === 'bypassed' && skipUser) return false
  if (verification === 'identity_fixed') return false
  if (verification === 'relink_operator_accepted') return false
  return true
}

export function rejectionReasonToCode(reason) {
  switch (reason) {
    case 'name_mismatch':
      return 'PLAID_NAME_MISMATCH'
    case 'holder_type_mismatch':
      return 'PLAID_HOLDER_TYPE_MISMATCH'
    default:
      return 'PLAID_VERIFICATION_FAILED'
  }
}

/**
 * Returns bank form values and the initial Plaid state derived from the API lead.
 * Detects whether the lead was previously verified via Plaid and restores that state.
 * Unresolved identity rejections restore `error` (not `verified`) even when Plaid
 * snapshot fields are present on bank_information.
 */
export function mapBankFromApi(apiLead, opts = {}) {
  const bank         = apiLead.bank_information || {}
  const metadataPlaid = apiLead.metadata?.plaid || {}
  const apiRejected = opts.plaid_rejected ?? apiLead.plaid_rejected

  const bankForm = {
    name:                      bank.name                  || '',
    accountType:               bank.account_type          || '',
    routingNumber:             bank.routing_number        || '',
    accountNumberMasked:       bank.account_number_masked || '',
    accountNumberMaskedConfirm: bank.account_number_masked || '',
  }

  const isPlaid =
    bank.verification_method === 'plaid' ||
    !!bank.plaid_account_id              ||
    !!metadataPlaid.plaid_account_id

  if (!isPlaid) {
    return {
      bank: bankForm,
      plaidState: {
        status:                 'not_started',
        linkSessionId:          '',
        requestId:              null,
        requiresManualBankInput: false,
        institution:            null,
        selectedAccount:        null,
        rejectionCode:          null,
        rejectionDetails:       null,
        rejectionMessage:       null,
      },
    }
  }

  const mask    = bank.plaid_account_mask    || metadataPlaid.plaid_account_mask    || bank.account_number_masked || ''
  const subtype = bank.plaid_account_subtype || metadataPlaid.plaid_account_subtype || bank.account_type || ''

  const institution = {
    name: bank.plaid_institution_name || metadataPlaid.plaid_institution_name || bank.name || '',
  }

  const selectedAccount = {
    id:      bank.plaid_account_id || metadataPlaid.plaid_account_id || null,
    mask,
    subtype,
    type:    subtype,
  }

  const sharedPlaidFields = {
    linkSessionId: bank.plaid_link_session_id || metadataPlaid.plaid_link_session_id || '',
    requestId:    null,
    requiresManualBankInput: !!metadataPlaid.plaid_manual_bank_required,
    institution,
    selectedAccount,
  }

  if (isUnresolvedPlaidRejection(metadataPlaid, apiRejected)) {
    const storedDetails = metadataPlaid.plaid_last_rejection_details || {}
    const ownerNames = bank.plaid_identity_names || storedDetails.owner_names || []

    return {
      bank: bankForm,
      plaidState: {
        ...sharedPlaidFields,
        status: 'error',
        rejectionCode: rejectionReasonToCode(metadataPlaid.plaid_last_rejection_reason),
        rejectionDetails: {
          ...storedDetails,
          owner_names: ownerNames.length > 0 ? ownerNames : storedDetails.owner_names,
        },
        rejectionMessage: null,
      },
    }
  }

  return {
    bank: bankForm,
    plaidState: {
      ...sharedPlaidFields,
      status:       'verified',
      rejectionCode: null,
      rejectionDetails: null,
      rejectionMessage: null,
    },
  }
}

/**
 * Returns billingChoice and billingContact from the API lead.
 * A billing contact whose email differs from the lead's primary email is "other".
 */
export function mapBillingContactFromApi(apiLead, primaryEmail) {
  const billing = apiLead.billing_contact || {}

  if (billing.email && billing.email !== primaryEmail) {
    return {
      billingChoice: 'other',
      billingContact: {
        name:  billing.name  || '',
        role:  billing.role  || '',
        email: billing.email || '',
      },
    }
  }

  return {
    billingChoice: 'self',
    billingContact: {
      name:  billing.name                   || '',
      role:  billing.role                   || '',
      email: primaryEmail || billing.email  || '',
    },
  }
}

/**
 * Converts the API's files array into the form.files map and initial uploadStatus.
 * API shape: [{ type: 'voidCheck', name: 'void_check.pdf' }, ...]
 */
export function mapFilesFromApi(apiLead) {
  const files        = {}
  const uploadStatus = {}

  for (const fileInfo of apiLead.files || []) {
    if (fileInfo.type && fileInfo.name) {
      files[fileInfo.type]        = { field: fileInfo.type, filename: fileInfo.name }
      uploadStatus[fileInfo.type] = { type: 'success', message: 'Document previously uploaded.' }
    }
  }

  return { files, uploadStatus }
}

/**
 * Determines which step to resume at from a fetch_by_code response.
 * Valid resumable range is [2, 12]; anything outside defaults to step 2.
 * Callers must additionally trigger contract embed loading when step === 10.
 */
export function getResumeStep(json) {
  const raw  = json.step_completed ?? json.completed_step
  const step = typeof raw === 'number' ? raw : parseInt(raw, 10)
  return Number.isFinite(step) && step >= 2 && step <= 12 ? step : 2
}

/**
 * Converts a successful Plaid exchange API response into the Plaid state slice.
 * requiresManualBankInput is true when the backend returns a tokenized account
 * number that requires the user to enter routing/account details manually.
 */
export function mapPlaidExchangeResult(data, metadata, selectedAccount) {
  const p = data?.plaid || {}

  return {
    status:       'verified',
    linkSessionId: metadata?.link_session_id || '',
    requestId:    p.request_id || null,
    requiresManualBankInput: data?.requires_manual_bank_input ?? false,
    institution: {
      name: p.institution_name || metadata?.institution?.name || '',
    },
    selectedAccount: {
      id:      p.plaid_account_id  || selectedAccount?.id      || null,
      mask:    p.account_mask      || selectedAccount?.mask     || '',
      subtype: p.account_subtype   || selectedAccount?.subtype  || '',
      type:    selectedAccount?.type || '',
    },
    bankUpdates: {
      name:        p.institution_name  || metadata?.institution?.name || '',
      accountType: p.account_subtype   || selectedAccount?.subtype    || '',
    },
  }
}

// ── Payload builders (React state → API request body) ─────────────────────

/**
 * Builds the body for POST /api/leads/update-lead.
 *
 * bank.routingNumber is omitted when empty: after a successful non-tokenized Plaid
 * exchange the routing number is stored server-side only; sending an empty string
 * would overwrite (clear) the server-stored value.
 */
export function buildUpdateLeadPayload(form, otpCode, sessionToken, plaidState, stepCompleted) {
  const bank = { ...form.bank }
  if (!bank.routingNumber) {
    delete bank.routingNumber
  }

  return {
    form: {
      ...form,
      bank,
      plaid: {
        status:                 plaidState.status,
        linkSessionId:          plaidState.linkSessionId          || '',
        requestId:              plaidState.requestId              || null,
        requiresManualBankInput: !!plaidState.requiresManualBankInput,
        institution:            plaidState.institution            || null,
        selectedAccount:        plaidState.selectedAccount        || null,
      },
    },
    code:          otpCode,
    sessionToken,
    stepCompleted,
  }
}

/**
 * Builds the FormData for POST /api/leads/upload_document.
 * Do NOT set Content-Type when sending — the browser sets the multipart boundary.
 */
export function buildUploadDocumentFormData(key, file, otpCode, sessionToken) {
  const formData = new FormData()
  formData.append('code', otpCode || '')
  if (sessionToken) {
    formData.append('sessionToken', sessionToken)
  }
  formData.append('field', key)
  formData.append('file', file, file.name)
  return formData
}

/**
 * Builds the body for POST /api/leads/generate_contract.
 */
export function buildContractPayload(form, otpCode, sessionToken, registrationProof = null) {
  return {
    registrationProof,
    code:    otpCode,
    sessionToken,
    form,
  }
}

/**
 * Builds the body for POST /api/leads/sign_embed_url.
 */
export function buildSignEmbedPayload(otpCode, sessionToken, documentId) {
  return { code: otpCode, sessionToken, documentId }
}

/**
 * Builds the body for POST /api/leads/set_fuel_cards.
 * otpCode is included only when present (index.js flow); omitted for post-signing flow.
 */
export function buildFuelCardsPayload(otpCode, sessionToken, fuelCards) {
  const payload = { sessionToken, fuelCards }
  if (otpCode) payload.otpCode = otpCode
  return payload
}

// ── Validation helpers ─────────────────────────────────────────────────────

/**
 * Validates the OTP code format.
 * Accepts both pure-numeric (generated by generateOtpCode) and legacy hex codes.
 */
export function isValidOtp(otp) {
  return /^[0-9A-F]{6}$/.test(String(otp || '').trim().toUpperCase())
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * Validates a file before upload.
 * Returns { ok: true } or { ok: false, reason: 'size' | 'type' }.
 */
export function validateUploadFile(file) {
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: 'size' }
  const allowed = file.type === 'application/pdf' || file.type.startsWith('image/')
  if (!allowed) return { ok: false, reason: 'type' }
  return { ok: true }
}
