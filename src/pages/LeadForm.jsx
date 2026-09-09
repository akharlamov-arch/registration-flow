import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import StepIndicator from '../components/StepIndicator'
import FormField from '../components/FormField'
import PhoneInput from '../components/PhoneInput'
import { createLead, fetchInvite, generateOtpCode, uploadFuelInvoice, requestNewCode } from '../api/leads'

// ── Step icon definitions ──────────────────────────────────────────────────
const CONTACT_STEP = {
  label: 'Contact',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
}
const ACCOUNT_STEP = {
  label: 'Account',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
}
const BUSINESS_STEP = {
  label: 'Business',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15M15.75 5.25H8.25A2.25 2.25 0 006 7.5v1.85a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 9.35V7.5a2.25 2.25 0 00-2.25-2.25zM9.75 12h4.5" />
    </svg>
  ),
}
const FUEL_STEP = {
  label: 'Fuel',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.185-9 7.115 0 3.233 2.524 5.986 6.064 6.824L12 21l2.936-4.061C18.476 16.1 21 13.348 21 10.115 21 6.185 16.97 3 12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  ),
}
const REFERRAL_STEP = {
  label: 'Referral',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
}
const REVIEW_STEP = {
  label: 'Review',
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
}

// ── Review helpers (used only in the review step) ──────────────────────────
function ReviewSection({ title, onEdit, children }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-secondary
                     transition-colors duration-200 cursor-pointer focus:outline-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
          Edit
        </button>
      </div>
      <div className="px-5 divide-y divide-gray-50">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-3 gap-6">
      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5 leading-relaxed">{label}</span>
      <span className="text-sm text-gray-900 text-right font-medium leading-relaxed break-all">{value || '—'}</span>
    </div>
  )
}

// DS: focus:ring-2 focus:ring-primary/30 (keyboard nav) + 200ms transition
const inputClass = (hasError) => [
  'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
  'text-gray-900 placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:border-gray-400 transition-colors duration-200 bg-white',
  hasError
    ? 'border-red-400 focus:ring-red-200'
    : 'border-gray-200 focus:ring-gray-300',
].join(' ')

const selectClass = (hasError) => [
  'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
  'text-gray-900',
  'focus:outline-none focus:ring-2 focus:border-gray-400 transition-colors duration-200 bg-white appearance-none cursor-pointer',
  hasError
    ? 'border-red-400 focus:ring-red-200'
    : 'border-gray-200 focus:ring-gray-300',
].join(' ')

export default function LeadForm() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  // DS: loading state — show spinner → then success (UX guideline: Submit Feedback)
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [uploadedFuelFile, setUploadedFuelFile] = useState(null)
  const [fuelUploading, setFuelUploading] = useState(false)
  const [fuelUploadError, setFuelUploadError] = useState('')
  const [modalErrors, setModalErrors] = useState({})

  // ── Invite-token state ───────────────────────────────────────────────
  // Resolved from ?invite=<token> on mount. Three states:
  //   inviteLoading=true            → validating token (show skeleton)
  //   inviteError=<string>          → token invalid/expired/consumed (show error page)
  //   inviteToken && inviteLabel    → token valid (show banner + form)
  const [inviteToken, setInviteToken]           = useState(null)
  const [inviteLabel, setInviteLabel]           = useState(null)
  const [inviteError, setInviteError]           = useState(null)
  const [inviteLoading, setInviteLoading]       = useState(false)
  const [inviteIsPreApproved, setInviteIsPreApproved] = useState(false)

  useEffect(() => {
    const token = searchParams.get('invite')

    if (!token) {
      // No token in URL — check if one was persisted in this session (e.g. after a reload).
      const stored = sessionStorage.getItem('itrucking-invite-token')
      if (stored) {
        setInviteToken(stored)
        setInviteLabel(sessionStorage.getItem('itrucking-invite-label') || null)
        setInviteIsPreApproved(sessionStorage.getItem('itrucking-invite-preapproved') === 'true')
      }
      return
    }

    // Strip the token from the address bar so it does not leak via the
    // Referer header or browser history sharing.
    setSearchParams({}, { replace: true })

    setInviteLoading(true)

    fetchInvite(token).then(({ ok, data }) => {
      if (ok && data.success) {
        setInviteToken(token)
        setInviteLabel(data.invite_label || null)
        setInviteIsPreApproved(data.pre_approved === true)
        // Persist across reloads for the lifetime of this browser tab.
        sessionStorage.setItem('itrucking-invite-token', token)
        sessionStorage.setItem('itrucking-invite-label', data.invite_label || '')
        sessionStorage.setItem('itrucking-invite-preapproved', String(data.pre_approved === true))
      } else {
        // Token is invalid/consumed — remove any stale stored value.
        sessionStorage.removeItem('itrucking-invite-token')
        sessionStorage.removeItem('itrucking-invite-label')
        sessionStorage.removeItem('itrucking-invite-preapproved')
        setInviteError(data.error || 'invite_invalid')
      }
      setInviteLoading(false)
    }).catch(() => {
      sessionStorage.removeItem('itrucking-invite-token')
      sessionStorage.removeItem('itrucking-invite-label')
      sessionStorage.removeItem('itrucking-invite-preapproved')
      setInviteError('invite_invalid')
      setInviteLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── OTP reset modal (shown on invalid/used invite token) ─────────────────
  const [showOtpResetModal, setShowOtpResetModal] = useState(false)
  const [otpResetEmail,     setOtpResetEmail]     = useState('')
  const [otpResetSending,   setOtpResetSending]   = useState(false)
  const [otpResetSent,      setOtpResetSent]      = useState(false)

  const handleOtpReset = async () => {
    if (otpResetSending || !otpResetEmail.trim()) return
    setOtpResetSending(true)
    await requestNewCode(otpResetEmail.trim())
    setOtpResetSending(false)
    setOtpResetSent(true)
    // Brief pause so the user sees the success state before leaving the page
    setTimeout(() => {
      window.location.replace('/#/registration')
    }, 1200)
  }

  const [form, setForm] = useState({
    // Step 1 — Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2 — Account Type
    accountType: '',
    ownerConfirmed: false,
    personalTrucks: '',       // collected in popup for personal accounts
    // Step Business — Business Details (business only)
    companyName: '',
    businessType: '',
    companyTitle: '',
    companyTrucks: '',
    companyDOT: '',
    companyMC: '',
    // Step Fuel
    usesFuelProgram: '',
    fuelDocument: null,
    otpCode: '',
    // Step Referral
    refFirstName: '',
    refLastName: '',
    refCompany: '',
    refPhone: '',
    refNote: '',
  })

  // ── Dynamic step config ──────────────────────────────────────────────
  const isBusiness = form.accountType === 'business'
  // Always 5 indicator dots — business details is a "bonus" screen between account and fuel
  const activeSteps = [CONTACT_STEP, ACCOUNT_STEP, FUEL_STEP, REFERRAL_STEP, REVIEW_STEP]
  const totalSteps = activeSteps.length

  const getContentKey = (s) => {
    if (s === 1) return 'contact'
    if (s === 2) return 'account'
    if (isBusiness) {
      if (s === 3) return 'business'
      if (s === 4) return 'fuel'
      if (s === 5) return 'referral'
      if (s === 6) return 'review'
    } else {
      if (s === 3) return 'fuel'
      if (s === 4) return 'referral'
      if (s === 5) return 'review'
    }
    return 'contact'
  }
  const contentKey = getContentKey(step)

  // Map internal step → indicator position (both personal and business show 5 dots)
  // business: 1→1, 2→2, 3(business_details)→2, 4(fuel)→3, 5(referral)→4, 6(review)→5
  const indicatorStep = isBusiness && step >= 3 ? step - 1 : step

  const getStepForKey = (key) => {
    const order = isBusiness
      ? ['contact', 'account', 'business', 'fuel', 'referral', 'review']
      : ['contact', 'account', 'fuel', 'referral', 'review']
    return order.indexOf(key) + 1
  }

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleFuelFileSelect = async (file) => {
    if (!file) return
    update('fuelDocument', file)
    setFuelUploadError('')
    setFuelUploading(true)
    try {
      const { ok, data } = await uploadFuelInvoice(file)
      if (ok && data.success) {
        setUploadedFuelFile({ field: 'fuelInvoice', filename: data.fileName })
        if (errors.fuelDocument) setErrors((prev) => ({ ...prev, fuelDocument: '' }))
      } else {
        setUploadedFuelFile(null)
        setFuelUploadError(t('common.uploadFailed'))
      }
    } catch {
      setUploadedFuelFile(null)
      setFuelUploadError(t('common.networkError'))
    } finally {
      setFuelUploading(false)
    }
  }

  // ── Validators ─────────────────────────────────────────────────────
  // Only printable ASCII (0x20–0x7E) is permitted — the resulting contract is in English.
  const isLatinOnly = (str) => /^[\x20-\x7E]*$/.test(str)

  const validateContact = () => {
    const e = {}
    if (!form.firstName.trim()) {
      e.firstName = t('common.required')
    } else if (!isLatinOnly(form.firstName)) {
      e.firstName = t('common.latinOnly')
    }
    if (!form.lastName.trim()) {
      e.lastName = t('common.required')
    } else if (!isLatinOnly(form.lastName)) {
      e.lastName = t('common.latinOnly')
    }
    if (!form.email.trim()) {
      e.email = t('common.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t('common.invalidEmail')
    }
    if (!form.phone.trim()) {
      e.phone = t('common.required')
    } else {
      const d = form.phone.replace(/\D/g, '')
      if ((d.length === 11 ? d.slice(1) : d).length !== 10) e.phone = t('common.phoneInvalid')
    }
    return e
  }

  const validateAccount = () => {
    const e = {}
    if (!form.accountType) e.accountType = t('lead.step2.selectRequired')
    if (form.accountType === 'business' && !form.ownerConfirmed)
      e.ownerConfirmed = t('lead.step2.ownerCheckboxRequired')
    return e
  }

  const validateBusiness = () => {
    const e = {}
    if (!form.companyName.trim()) {
      e.companyName = t('common.required')
    } else if (!isLatinOnly(form.companyName)) {
      e.companyName = t('common.latinOnly')
    }
    if (!form.businessType) e.businessType = t('common.required')
    if (!form.companyTitle) e.companyTitle = t('common.required')
    if (!form.companyTrucks.trim() || !/^\d+$/.test(form.companyTrucks.trim()))
      e.companyTrucks = t('lead.stepBusiness.trucksRequired')
    return e
  }

  const validateFuel = () => {
    const e = {}
    if (!form.usesFuelProgram) e.usesFuelProgram = t('lead.step3.selectRequired')
    if (form.usesFuelProgram === 'yes' && !uploadedFuelFile) e.fuelDocument = t('lead.step3.uploadRequired')
    return e
  }

  const validateReferral = () => {
    const e = {}
    if (!form.refFirstName.trim()) {
      e.refFirstName = t('common.required')
    } else if (!isLatinOnly(form.refFirstName)) {
      e.refFirstName = t('common.latinOnly')
    }
    if (!form.refLastName.trim()) {
      e.refLastName = t('common.required')
    } else if (!isLatinOnly(form.refLastName)) {
      e.refLastName = t('common.latinOnly')
    }
    if (form.refCompany.trim() && !isLatinOnly(form.refCompany)) {
      e.refCompany = t('common.latinOnly')
    }
    if (form.refNote.trim() && !isLatinOnly(form.refNote)) {
      e.refNote = t('common.latinOnly')
    }
    if (!form.refPhone.trim()) {
      e.refPhone = t('common.required')
    } else {
      const normalizePhone = (v) => { const d = v.replace(/\D/g, ''); return d.length === 11 ? d.slice(1) : d }
      if (normalizePhone(form.refPhone).length !== 10) {
        e.refPhone = t('common.phoneInvalid')
      } else if (normalizePhone(form.refPhone) === normalizePhone(form.phone)) {
        e.refPhone = t('lead.step4.phoneSameAsApplicant')
      }
    }
    return e
  }

  // ── Navigation ────────────────────────────────────────────────────
  const handleNext = async () => {
    const e = contentKey === 'contact'  ? validateContact()
      : contentKey === 'account'  ? validateAccount()
      : contentKey === 'business' ? validateBusiness()
      : contentKey === 'fuel'     ? validateFuel()
      : contentKey === 'referral' ? validateReferral()
      : {} // review → no validation, just submit
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (contentKey === 'account') {
      setShowConfirmModal(true)
    } else if (contentKey === 'review') {
      setLoading(true)
      try {
        let otpCode = form.otpCode
        if (!otpCode) {
          otpCode = generateOtpCode()
          setForm((prev) => ({ ...prev, otpCode }))
        }

        const files = uploadedFuelFile ? { fuelInvoice: uploadedFuelFile } : {}

        const payload = {
          email:         form.email,
          accountType:   form.accountType,
          stepCompleted: isBusiness ? 6 : 5,
          otpCode,
          form: {
            firstName:            form.firstName,
            lastName:             form.lastName,
            email:                form.email,
            phone:                form.phone,
            accountType:          form.accountType,
            businessOwnerConfirm: form.ownerConfirmed,
            fleetSize:            isBusiness ? Number(form.companyTrucks) : Number(form.personalTrucks),
            companyName:          form.companyName,
            businessType:         form.businessType,
            companyTitle:         form.companyTitle,
            dot:                  form.companyDOT,
            mc:                   form.companyMC,
            usedFuelProgram:      form.usesFuelProgram,
            files,
            refFirstName:         form.refFirstName,
            refLastName:          form.refLastName,
            refCompany:           form.refCompany,
            refPhone:             form.refPhone,
            refNotes:             form.refNote,
            otpCode,
          },
        }
        // When this session was initiated from a personalized invite link,
        // include the token so the backend updates the existing placeholder lead
        // instead of inserting a new row.
        if (inviteToken) {
          payload.inviteToken = inviteToken
        }
        const { ok, status, data } = await createLead(payload)
        if (ok) {
          if (data.pre_approved && data.session_token) {
            // Pre-approved invite: session already issued — navigate directly to
            // the registration page and skip the OTP step.
            sessionStorage.removeItem('itrucking-invite-token')
            sessionStorage.removeItem('itrucking-invite-label')
            sessionStorage.removeItem('itrucking-invite-preapproved')
            window.location.replace(
              '/#/registration?sessionToken=' + encodeURIComponent(data.session_token)
            )
          } else {
            // Submission complete — token has been consumed, clear storage.
            sessionStorage.removeItem('itrucking-invite-token')
            sessionStorage.removeItem('itrucking-invite-label')
            sessionStorage.removeItem('itrucking-invite-preapproved')
            setSubmitted(true)
          }
        } else if (status === 422 && data.errors) {
          const flat = {}
          for (const [field, msgs] of Object.entries(data.errors)) {
            flat[field] = Array.isArray(msgs) ? msgs[0] : msgs
          }
          setErrors(flat)
        } else {
          setErrors({ _form: data.error || t('common.submitError') })
        }
      } catch {
        setErrors({ _form: t('common.networkError') })
      } finally {
        setLoading(false)
      }
    } else {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleConfirm = () => {
    if (form.accountType === 'personal') {
      if (!form.personalTrucks.trim() || !/^\d+$/.test(form.personalTrucks.trim())) {
        setModalErrors({ personalTrucks: t('lead.step2.trucksRequired') })
        return
      }
    }
    setModalErrors({})
    setShowConfirmModal(false)
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // DS: success state with checkmark icon
  // ── Invite-token render guards ──────────────────────────────────────────
  // 1. Validating token — show skeleton while the API call is in-flight.
  if (inviteLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-10 text-center animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/3 mx-auto mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
        </div>
      </main>
    )
  }

  // 2. Token invalid / expired / already used — show friendly error page.
  if (inviteError) {
    return (
      <>
      <main className="max-w-4xl mx-auto px-4 sm:px6 py-16">
        <div className="bg-white rounded-2xl shadow-ds-md border border-red-100 p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">This invite link is no longer valid</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            The link may have expired or already been used. Enter your email below and we'll
            send you a fresh verification code.
          </p>
          <button
            type="button"
            onClick={() => {
              if (form.email) setOtpResetEmail(form.email)
              setShowOtpResetModal(true)
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Get a new verification code
          </button>
        </div>
      </main>

      {/* OTP reset modal — shown when invite token is invalid/used */}
      {showOtpResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t('otp.invalidCodeModalTitle')}</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{t('otp.invalidCodeModalBody')}</p>

            {otpResetSent ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-700 font-medium">{t('otp.recoverySent')}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('otp.recoveryPlaceholder')}</label>
                  <input
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={otpResetEmail}
                    onChange={e => setOtpResetEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleOtpReset()}
                    placeholder={t('otp.recoveryPlaceholderEmail')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400
                               text-gray-900 bg-white text-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleOtpReset}
                    disabled={otpResetSending || !otpResetEmail.trim()}
                    className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                               bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                               transition-colors duration-200 cursor-pointer
                               focus:outline-none focus:ring-2 focus:ring-primary/30
                               disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {otpResetSending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('otp.recoverySendBtn')}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpResetModal(false)}
                    className="w-full px-7 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700
                               rounded-md border border-gray-200 hover:border-gray-300 bg-white
                               transition-colors duration-200 cursor-pointer
                               focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
  }

  if (submitted) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100
                        p-10 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('lead.success.title')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{t('lead.success.message')}</p>
        </div>
      </main>
    )
  }

  return (
    // DS: py-16 (space-3xl) top/bottom — "large sections 48px+ gaps"
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">

      {/* DS: heading 32px+ (text-ds-h1), text-ds-text — shown only on first step */}
      {contentKey === 'contact' && (
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">
            {t('lead.heading').split('iTrucking').map((part, i, arr) =>
              i < arr.length - 1
                ? <span key={i}>{part}<span className="text-red-600">iTrucking</span></span>
                : <span key={i}>{part}</span>
            )}
          </h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base mx-auto leading-relaxed">
            {t('lead.subheading')}
          </p>
        </div>
      )}

      <StepIndicator steps={activeSteps} currentStep={indicatorStep} />

      { 
      /* Invite banner — shown when the form was opened via a personalized link
      {inviteToken && !inviteIsPreApproved && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">Personalized invitation</span>
          {inviteLabel ? ` — ${inviteLabel}` : ''}. Please complete the form below.
        </div>
      )} 
        Temorarily disabled 
        */}

      {/* Pre-approved invite banner */}
      {inviteToken && inviteIsPreApproved && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="font-semibold">✓ Approved invitation</span>
          Your account has been approved — complete the form below to get started immediately.
        </div>
      )}

      {/* DS: shadow-ds-md card, rounded-2xl */}
      <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10">

        {/* STEP: Contact Information */}
        {contentKey === 'contact' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.step1.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.step1.desc')}</p>
            </div>

            {/* DS: space-xl (32px) gap between fields */}
            <div className="space-y-6">
              {/* First Name + Last Name side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.step1.firstName')} required error={errors.firstName}>
                  <input
                    type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder={t('lead.step1.firstNamePlaceholder')}
                    autoComplete="given-name"
                    className={inputClass(!!errors.firstName)}
                    aria-invalid={!!errors.firstName}
                  />
                </FormField>

                <FormField label={t('lead.step1.lastName')} required error={errors.lastName}>
                  <input
                    type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder={t('lead.step1.lastNamePlaceholder')}
                    autoComplete="family-name"
                    className={inputClass(!!errors.lastName)}
                    aria-invalid={!!errors.lastName}
                  />
                </FormField>
              </div>

              {/* Email + Phone side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.step1.email')} required error={errors.email}>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder={t('lead.step1.emailPlaceholder')}
                    autoComplete="email"
                    className={inputClass(!!errors.email)}
                    aria-invalid={!!errors.email}
                  />
                </FormField>

                <FormField label={t('lead.step1.phone')} required error={errors.phone}>
                  <PhoneInput
                    id="phone"
                    value={form.phone}
                    onChange={(val) => update('phone', val)}
                    className={inputClass(!!errors.phone)}
                    aria-invalid={!!errors.phone}
                  />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* STEP: Account Type */}
        {contentKey === 'account' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.step2.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.step2.desc')}</p>
            </div>

            <div className="space-y-3">
              {/* Personal Account */}
              <label
                className={[
                  'flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-colors duration-200',
                  form.accountType === 'personal'
                    ? 'border-gray-900 bg-gray-50'
                    : errors.accountType
                      ? 'border-red-400 bg-red-50/40 hover:border-red-500'
                      : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="personal"
                  checked={form.accountType === 'personal'}
                  onChange={() => update('accountType', 'personal')}
                  className="mt-0.5 accent-gray-900 w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t('lead.step2.personalTitle')}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {t('lead.step2.personalDescPre')}
                    <strong className="font-bold text-gray-700">{t('lead.step2.personalDescBold')}</strong>
                    {t('lead.step2.personalDescPost')}
                  </p>
                </div>
              </label>

              {/* Business Account */}
              <label
                className={[
                  'flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-colors duration-200',
                  form.accountType === 'business'
                    ? 'border-gray-900 bg-gray-50'
                    : errors.accountType
                      ? 'border-red-400 bg-red-50/40 hover:border-red-500'
                      : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="accountType"
                  value="business"
                  checked={form.accountType === 'business'}
                  onChange={() => update('accountType', 'business')}
                  className="mt-0.5 accent-gray-900 w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t('lead.step2.businessTitle')}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {t('lead.step2.businessDescPre')}
                    <strong className="font-bold text-gray-700">{t('lead.step2.businessDescBold')}</strong>
                    {t('lead.step2.businessDescPost')}
                  </p>
                </div>
              </label>

              {/* Validation error for account type */}
              {errors.accountType && (
                <p className="text-xs text-red-500 mt-1">{errors.accountType}</p>
              )}

              {/* Business owner confirmation checkbox */}
              {form.accountType === 'business' && (
                <label className={[
                  'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors duration-200',
                  errors.ownerConfirmed
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                ].join(' ')}>
                  <input
                    type="checkbox"
                    checked={form.ownerConfirmed}
                    onChange={(e) => update('ownerConfirmed', e.target.checked)}
                    className="mt-0.5 accent-gray-900 w-4 h-4 flex-shrink-0"
                  />
                  <p className={[
                    'text-xs leading-relaxed',
                    errors.ownerConfirmed ? 'text-red-600' : 'text-gray-600',
                  ].join(' ')}>{t('lead.step2.ownerCheckbox')}</p>
                </label>
              )}

              {/* Validation error for owner checkbox */}
              {errors.ownerConfirmed && form.accountType === 'business' && (
                <p className="text-xs text-red-500">{errors.ownerConfirmed}</p>
              )}

              {/* Note */}
              <div className="flex items-start gap-3 mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-base leading-none mt-0.5">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed">{t('lead.step2.note')}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP: Business Details (business account only) */}
        {contentKey === 'business' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.stepBusiness.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.stepBusiness.desc')}</p>
            </div>

            <div className="space-y-6">
              {/* Company Name */}
              <FormField label={t('lead.stepBusiness.companyName')} required error={errors.companyName}>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder={t('lead.stepBusiness.companyNamePlaceholder')}
                  autoComplete="organization"
                  className={inputClass(!!errors.companyName)}
                  aria-invalid={!!errors.companyName}
                />
              </FormField>

              {/* Business Type + Company Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.stepBusiness.businessType')} required error={errors.businessType}>
                  <div className="relative">
                    <select
                      value={form.businessType}
                      onChange={(e) => update('businessType', e.target.value)}
                      className={selectClass(!!errors.businessType)}
                      aria-invalid={!!errors.businessType}
                    >
                      <option value="">{t('common.selectPlaceholder')}</option>
                      <option value="sole">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="llc">LLC</option>
                      <option value="corporation">Corporation</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </FormField>

                <FormField label={t('lead.stepBusiness.companyTitle')} required error={errors.companyTitle}>
                  <div className="relative">
                    <select
                      value={form.companyTitle}
                      onChange={(e) => update('companyTitle', e.target.value)}
                      className={selectClass(!!errors.companyTitle)}
                      aria-invalid={!!errors.companyTitle}
                    >
                      <option value="">{t('common.selectPlaceholder')}</option>
                      <option value="ceo">CEO</option>
                      <option value="cfo">CFO</option>
                      <option value="accountant">Accountant</option>
                      <option value="president">President</option>
                      <option value="owner">Owner</option>
                      <option value="other">Other</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </FormField>
              </div>

              {/* Trucks */}
              <div className="grid grid-cols-1 gap-4">
                <FormField label={t('lead.stepBusiness.trucks')} required error={errors.companyTrucks}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.companyTrucks}
                    onChange={(e) => update('companyTrucks', e.target.value.replace(/\D/g, ''))}
                    placeholder="5"
                    className={inputClass(!!errors.companyTrucks)}
                    aria-invalid={!!errors.companyTrucks}
                  />
                </FormField>
              </div>
              <p className="text-xs text-gray-400 mt-1">{t('lead.stepBusiness.dotMcHint')}</p>

              {/* DOT + MC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.stepBusiness.dot')} optional>
                  <input
                    type="text"
                    value={form.companyDOT}
                    onChange={(e) => update('companyDOT', e.target.value)}
                    placeholder="1234567"
                    className={inputClass(false)}
                  />
                </FormField>

                <FormField label={t('lead.stepBusiness.mc')} optional>
                  <input
                    type="text"
                    value={form.companyMC}
                    onChange={(e) => update('companyMC', e.target.value)}
                    placeholder="123456"
                    className={inputClass(false)}
                  />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* STEP: Fuel discount program */}
        {contentKey === 'fuel' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.step3.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.step3.desc')}</p>
            </div>

            <div className="space-y-3">
              {/* Yes */}
              <label
                className={[
                  'flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-colors duration-200',
                  form.usesFuelProgram === 'yes'
                    ? 'border-gray-900 bg-gray-50'
                    : errors.usesFuelProgram
                      ? 'border-red-400 bg-red-50/40 hover:border-red-500'
                      : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="usesFuelProgram"
                  value="yes"
                  checked={form.usesFuelProgram === 'yes'}
                  onChange={() => update('usesFuelProgram', 'yes')}
                  className="mt-0.5 accent-gray-900 w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t('lead.step3.yesLabel')}</p>
                </div>
              </label>

              {/* No */}
              <label
                className={[
                  'flex items-start gap-4 p-5 rounded-lg border-2 cursor-pointer transition-colors duration-200',
                  form.usesFuelProgram === 'no'
                    ? 'border-gray-900 bg-gray-50'
                    : errors.usesFuelProgram
                      ? 'border-red-400 bg-red-50/40 hover:border-red-500'
                      : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="usesFuelProgram"
                  value="no"
                  checked={form.usesFuelProgram === 'no'}
                  onChange={() => update('usesFuelProgram', 'no')}
                  className="mt-0.5 accent-gray-900 w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t('lead.step3.noLabel')}</p>
                </div>
              </label>

              {errors.usesFuelProgram && (
                <p className="text-xs text-red-500">{errors.usesFuelProgram}</p>
              )}

              {/* File upload — shown only when "yes" */}
              {form.usesFuelProgram === 'yes' && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{t('lead.step3.uploadTitle')}</p>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">{t('lead.step3.uploadDesc')}</p>

                  <label
                    className={[
                      'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-200',
                      errors.fuelDocument
                        ? 'border-red-300 bg-red-50'
                        : form.fuelDocument
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                      className="sr-only"
                      onChange={(e) => handleFuelFileSelect(e.target.files?.[0] ?? null)}
                    />
                    {form.fuelDocument ? (
                      <>
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">{form.fuelDocument.name}</p>
                        <p className="text-xs text-gray-400">{t('lead.step3.tapToChange')}</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">{t('lead.step3.uploadBtn')}</p>
                        <p className="text-xs text-gray-400">{t('lead.step3.uploadHint')}</p>
                      </>
                    )}
                  </label>

                  {fuelUploading && (
                    <p className="text-xs text-gray-500 mt-1.5">{t('common.loading')}</p>
                  )}
                  {fuelUploadError && (
                    <p className="text-xs text-red-500 mt-1.5">{fuelUploadError}</p>
                  )}
                  {!fuelUploading && !fuelUploadError && errors.fuelDocument && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.fuelDocument}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP: Referral */}
        {contentKey === 'referral' && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.step4.title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.step4.desc')}</p>
            </div>

            <div className="space-y-6">
              {/* First name + Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.step4.firstName')} required error={errors.refFirstName}>
                  <input
                    type="text"
                    value={form.refFirstName}
                    onChange={(e) => update('refFirstName', e.target.value)}
                    placeholder={t('lead.step4.firstNamePlaceholder')}
                    autoComplete="off"
                    className={inputClass(!!errors.refFirstName)}
                    aria-invalid={!!errors.refFirstName}
                  />
                </FormField>
                <FormField label={t('lead.step4.lastName')} required error={errors.refLastName}>
                  <input
                    type="text"
                    value={form.refLastName}
                    onChange={(e) => update('refLastName', e.target.value)}
                    placeholder={t('lead.step4.lastNamePlaceholder')}
                    autoComplete="off"
                    className={inputClass(!!errors.refLastName)}
                    aria-invalid={!!errors.refLastName}
                  />
                </FormField>
              </div>

              {/* Company + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t('lead.step4.company')} optional error={errors.refCompany}>
                  <input
                    type="text"
                    value={form.refCompany}
                    onChange={(e) => update('refCompany', e.target.value)}
                    placeholder={t('lead.step4.companyPlaceholder')}
                    autoComplete="off"
                    className={inputClass(!!errors.refCompany)}
                    aria-invalid={!!errors.refCompany}
                  />
                </FormField>
                <FormField label={t('lead.step4.phone')} required error={errors.refPhone}>
                  <PhoneInput
                    value={form.refPhone}
                    onChange={(val) => update('refPhone', val)}
                    className={inputClass(!!errors.refPhone)}
                    aria-invalid={!!errors.refPhone}
                  />
                </FormField>
              </div>

              {/* Note (optional) */}
              <FormField label={t('lead.step4.note')} optional>
                <textarea
                  value={form.refNote}
                  onChange={(e) => update('refNote', e.target.value)}
                  placeholder={t('lead.step4.notePlaceholder')}
                  rows={3}
                  className={[
                    inputClass(false),
                    'resize-none',
                  ].join(' ')}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* STEP: Review Details */}
        {contentKey === 'review' && (() => {
          const businessTypeLabels = {
            sole: 'Sole Proprietorship', partnership: 'Partnership',
            llc: 'LLC', corporation: 'Corporation',
          }
          const companyTitleLabels = {
            ceo: 'CEO', cfo: 'CFO', accountant: 'Accountant',
            president: 'President', owner: 'Owner', other: 'Other',
          }
          return (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-lg sm:text-ds-h2 font-semibold text-gray-900">{t('lead.stepReview.title')}</h2>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{t('lead.stepReview.desc')}</p>
              </div>

              <div className="space-y-3">
                {/* Contact */}
                <ReviewSection title={t('lead.stepReview.sectionContact')} onEdit={() => { setStep(getStepForKey('contact')); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  <ReviewRow label={t('lead.step1.firstName')} value={form.firstName} />
                  <ReviewRow label={t('lead.step1.lastName')} value={form.lastName} />
                  <ReviewRow label={t('lead.step1.email')} value={form.email} />
                  <ReviewRow label={t('lead.step1.phone')} value={form.phone} />
                </ReviewSection>

                {/* Account */}
                <ReviewSection title={t('lead.stepReview.sectionAccount')} onEdit={() => { setStep(getStepForKey('account')); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  <ReviewRow
                    label={t('lead.step2.title')}
                    value={form.accountType === 'personal' ? t('lead.step2.personalTitle') : t('lead.step2.businessTitle')}
                  />
                  {form.accountType === 'personal' && (
                    <ReviewRow label={t('lead.step2.trucksLabel')} value={form.personalTrucks} />
                  )}
                </ReviewSection>

                {/* Business Details (business only) */}
                {isBusiness && (
                  <ReviewSection title={t('lead.stepReview.sectionBusiness')} onEdit={() => { setStep(getStepForKey('business')); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                    <ReviewRow label={t('lead.stepBusiness.companyName')} value={form.companyName} />
                    <ReviewRow label={t('lead.stepBusiness.businessType')} value={businessTypeLabels[form.businessType] || form.businessType} />
                    <ReviewRow label={t('lead.stepBusiness.companyTitle')} value={companyTitleLabels[form.companyTitle] || form.companyTitle} />
                    <ReviewRow label={t('lead.stepBusiness.trucks')} value={form.companyTrucks} />
                    {form.companyDOT && <ReviewRow label={t('lead.stepBusiness.dot')} value={form.companyDOT} />}
                    {form.companyMC && <ReviewRow label={t('lead.stepBusiness.mc')} value={form.companyMC} />}
                  </ReviewSection>
                )}

                {/* Fuel */}
                <ReviewSection title={t('lead.stepReview.sectionFuel')} onEdit={() => { setStep(getStepForKey('fuel')); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  <ReviewRow
                    label={t('lead.stepReview.fuelLabel')}
                    value={form.usesFuelProgram === 'yes' ? t('lead.stepReview.fuelYes') : t('lead.stepReview.fuelNo')}
                  />
                  {form.fuelDocument && (
                    <ReviewRow label={t('lead.step3.uploadTitle')} value={form.fuelDocument.name} />
                  )}
                </ReviewSection>

                {/* Referral */}
                <ReviewSection title={t('lead.stepReview.sectionReferral')} onEdit={() => { setStep(getStepForKey('referral')); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  <ReviewRow label={t('lead.step4.firstName')} value={form.refFirstName} />
                  <ReviewRow label={t('lead.step4.lastName')} value={form.refLastName} />
                  <ReviewRow label={t('lead.step4.company')} value={form.refCompany} />
                  <ReviewRow label={t('lead.step4.phone')} value={form.refPhone} />
                  {form.refNote && <ReviewRow label={t('lead.step4.note')} value={form.refNote} />}
                </ReviewSection>
              </div>
            </div>
          )
        })()}

        {errors._form && (
          <p className="text-sm text-red-600 text-center mt-4">{errors._form}</p>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-500
                       border border-gray-200 rounded-md
                       hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-gray-200
                       disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t('common.back')}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              // DS: animate-spin for loading indicator only (not decorative)
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"
                     aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('common.loading')}
              </>
            ) : contentKey === 'review' && !inviteToken ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('common.submit')}
              </>
            ) : (
              <>
                {t('common.nextStep')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-ds-xl border border-gray-100 p-6 sm:p-8 max-w-md w-full animate-fadeIn">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
              {form.accountType === 'personal' ? t('lead.step2.personalTitle') : t('lead.step2.businessTitle')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              {form.accountType === 'personal'
                ? t('lead.step2.confirmPersonalText')
                : t('lead.step2.confirmBusinessText')}
            </p>

            {/* Trucks count for personal accounts */}
            {form.accountType === 'personal' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('lead.step2.trucksLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.personalTrucks}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setForm((prev) => ({ ...prev, personalTrucks: val }))
                    if (modalErrors.personalTrucks) setModalErrors({})
                  }}
                  placeholder="1"
                  className={[
                    'w-full px-4 py-3 text-base sm:text-sm border rounded-xl transition-colors duration-200 bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
                    modalErrors.personalTrucks ? 'border-red-300' : 'border-gray-200',
                  ].join(' ')}
                />
                {modalErrors.personalTrucks && (
                  <p className="text-xs text-red-500 mt-1.5">{modalErrors.personalTrucks}</p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600
                           border border-gray-200 rounded-md
                           hover:bg-gray-50 hover:border-gray-300
                           transition-colors duration-200 cursor-pointer"
              >
                {t('lead.step2.cancelBtn')}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white
                           bg-primary hover:bg-secondary rounded-md
                           transition-colors duration-200 cursor-pointer"
              >
                {t('lead.step2.confirmBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

