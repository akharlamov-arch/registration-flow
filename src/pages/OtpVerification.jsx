import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import StepIndicator from '../components/StepIndicator'
import PhoneInput from '../components/PhoneInput'
import {
  verifyOtp, requestNewCode, updateLead, uploadDocument,
  generateContract, getSignEmbedUrl,
  getPlaidLinkToken, getPlaidCombinedLinkToken, exchangePlaidToken,
  plaidConfig, validateSession,
} from '../api/leads'
import {
  mapLeadFromApi, mapAddressesFromApi, mapBankFromApi,
  mapBillingContactFromApi, mapFilesFromApi, getResumeStep,
  mapPlaidExchangeResult, buildUpdateLeadPayload, buildUploadDocumentFormData,
  buildContractPayload, buildSignEmbedPayload,
  isValidOtp, validateUploadFile,
} from '../api/leadMappers'
import { ReviewSection, ReviewRow, Row, US_STATES } from '../components/ReviewCard'
import PlaidExchangeErrorPanel from '../components/PlaidExchangeErrorPanel'

// ── Review-info modal (same card design as the old review step) ─────────────
function ReviewInfoModal({ lead, marketingConsent, onConsentChange, onClose }) {
  const { t } = useI18n()
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 my-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t('accountReview.heading')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Two-column data card */}
        <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('accountReview.sectionContact')}
              </h3>
              <Row label={t('accountReview.labelName')}        value={lead ? `${lead.firstName} ${lead.lastName}` : ''} />
              <Row label={t('accountReview.labelEmail')}       value={lead?.email} />
              <Row label={t('accountReview.labelPhone')}       value={lead?.phone} />
              <Row label={t('accountReview.labelAccountType')} value={lead?.accountType} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-5 sm:mt-0">
                {t('accountReview.sectionBusiness')}
              </h3>
              <Row label={t('accountReview.labelCompany')}  value={lead?.companyName} />
              <Row label={t('accountReview.labelBizType')}  value={lead?.businessType} />
              <Row label={t('accountReview.labelTitle')}    value={lead?.companyTitle} />
              <Row label={t('accountReview.labelTrucks')}   value={lead?.fleetSize != null ? String(lead.fleetSize) : ''} />
              <div className="flex gap-4 py-2 border-b border-gray-100">
                <div className="flex-1">
                  <span className="text-xs text-gray-400">{t('accountReview.labelDOT')}</span>
                  <p className="text-sm font-medium text-gray-900">{lead?.dot || '—'}</p>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400">{t('accountReview.labelMC')}</span>
                  <p className="text-sm font-medium text-gray-900">{lead?.mc || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank notice */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-red-800 leading-relaxed">{t('accountReview.bankNotice')}</p>
        </div>

        {/* Marketing consent */}
        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => onConsentChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
            />
          </div>
          <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
            {t('accountReview.marketingConsent')}
          </span>
        </label>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-center px-7 py-3 text-sm font-semibold text-white
                     bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                     transition-colors duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {t('common.cancel') || 'Close'}
        </button>
      </div>
    </div>
  )
}

// ── Floating "Review my info" button — rendered on every post-OTP step ──────
function ReviewFab({ onClick }) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('accountReview.heading')}
      title={t('accountReview.heading')}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5
                 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700
                 rounded-full shadow-lg
                 transition-colors duration-200 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="hidden sm:inline">{t('accountReview.heading')}</span>
    </button>
  )
}

export default function OtpVerification() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [step, setStep] = useState('otp')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [codePrefilled, setCodePrefilled] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalConsent, setModalConsent] = useState(false)
  const [bankForm, setBankForm] = useState({ name: '', accountType: '', routingNumber: '', accountNumberMasked: '', accountNumberMaskedConfirm: '' })
  const [bankErrors, setBankErrors] = useState({})
  const [bankVerifying, setBankVerifying] = useState(false)
  const [bankVerificationStatus, setBankVerificationStatus] = useState(null)
  const [addressForm, setAddressForm] = useState({ street1: '', street2: '', city: '', state: '', zip: '', mailingOption: '' })
  const [addressErrors, setAddressErrors] = useState({})
  const [mailingForm, setMailingForm] = useState({ street1: '', street2: '', city: '', state: '', zip: '' })
  const [mailingErrors, setMailingErrors] = useState({})
  const [personalForm, setPersonalForm] = useState({ ssn: '', dlNumber: '', dlConfirm: '', dlFile: null })
  const [personalErrors, setPersonalErrors] = useState({})
  const [showSsn, setShowSsn] = useState(false)
  const [showDl, setShowDl] = useState(false)
  const [showDlConfirm, setShowDlConfirm] = useState(false)
  const [peekSsn, setPeekSsn] = useState(false)
  const [peekDl, setPeekDl] = useState(false)
  const [peekDlConfirm, setPeekDlConfirm] = useState(false)
  const peekTimers = useRef({})
  const [personalAddressOption, setPersonalAddressOption] = useState('')
  const [personalAddressForm, setPersonalAddressForm] = useState({ street1: '', street2: '', city: '', state: '', zip: '' })
  const [personalAddressErrors, setPersonalAddressErrors] = useState({})
  const [billingContactOption, setBillingContactOption] = useState('')
  const [billingContactForm, setBillingContactForm] = useState({ firstName: '', lastName: '', email: '', phone: '', title: '' })
  const [billingContactErrors, setBillingContactErrors] = useState({})
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [preparingContract, setPreparingContract] = useState(false)
  const [preparingPhase, setPreparingPhase] = useState(1)

  // ── Auth & session ──────────────────────────────────────────────────────
  const [sessionToken, setSessionToken] = useState(null)
  const [otpCode, setOtpCode]           = useState('')
  // Refs so async callbacks (loadContractEmbed) always read the latest values
  // even when called from a stale closure (e.g. verifyOtp before re-render).
  const sessionTokenRef = useRef(null)
  const otpCodeRef      = useRef('')
  const [lead, setLead]                 = useState(null)
  const [documentId, setDocumentId]     = useState(null)

  // ── OTP email recovery ──────────────────────────────────────────────────
  const [pendingMessage, setPendingMessage]       = useState('')
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [recoveryEmail, setRecoveryEmail]         = useState('')
  const [recoverySending, setRecoverySending]     = useState(false)
  const [recoverySent, setRecoverySent]           = useState(false)

  // ── Disclaimer modal (shown on Plaid step, unskippable until acknowledged) ────
  const [disclaimerVisible, setDisclaimerVisible] = useState(false)
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false)
  // ── Review-info modal (floating button — accessible from any step) ────────
  const [showReviewModal, setShowReviewModal] = useState(false)

  // ── Plaid ───────────────────────────────────────────────────────────────
  const [plaid, setPlaid] = useState({
    status: 'not_started',
    linkToken: '',
    linkSessionId: '',
    selectedAccount: null,
    institution: null,
    requestId: null,
    requiresManualBankInput: false,
    rejectionCode: null,
    rejectionDetails: null,
    rejectionMessage: null,
    combinedProbe: { enabled: false, mode: 'standard', idvEvents: [], lastOutcome: null },
  })
  const plaidHandlerRef = useRef(null)
  const [plaidBypassAvailable, setPlaidBypassAvailable] = useState(false)
  const [plaidManualFallback, setPlaidManualFallback]   = useState(false)
  const [plaidAttempted, setPlaidAttempted]             = useState(false)

  // ── Document uploads (voidCheck, driverLicenseScan) ─────────────────────
  const [uploadStatus, setUploadStatus] = useState({
    voidCheck:         { type: '', message: '' },
    driverLicenseScan: { type: '', message: '' },
  })
  const [uploadInFlight, setUploadInFlight] = useState({
    voidCheck: false,
    driverLicenseScan: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [voidCheckFile, setVoidCheckFile] = useState(null)

  // ── Contract / signing ──────────────────────────────────────────────────
  const [submitting, setSubmitting]               = useState(false)
  const [submitError, setSubmitError]             = useState('')
  const [contractEmbedUrl, setContractEmbedUrl]   = useState(null)
  const [loadingContract, setLoadingContract]     = useState(false)
  const [contractError, setContractError]         = useState(null)

  const updateBank = (key, val) => { setBankForm(prev => ({ ...prev, [key]: val })); setBankVerificationStatus(null) }
  const clearBankError = (key) => setBankErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  const bankInputClass = (err) => [
    'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
    'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
    'transition-colors duration-200 bg-white text-gray-900',
    err ? 'border-red-300 bg-red-50' : 'border-gray-200',
  ].join(' ')

  const updateAddress = (key, val) => setAddressForm(prev => ({ ...prev, [key]: val }))
  const clearAddressError = (key) => setAddressErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  const addressInputClass = (err) => [
    'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
    'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
    'transition-colors duration-200 bg-white text-gray-900',
    err ? 'border-red-300 bg-red-50' : 'border-gray-200',
  ].join(' ')

  const handleAddressSubmit = () => {
    const errs = {}
    if (!addressForm.street1.trim()) errs.street1 = t('address.errorStreet1Required')
    if (!addressForm.city.trim()) errs.city = t('address.errorCityRequired')
    if (!addressForm.state.trim()) errs.state = t('address.errorStateRequired')
    if (!addressForm.zip.trim()) {
      errs.zip = t('address.errorZipRequired')
    } else if (!/^\d{5}(-\d{4})?$/.test(addressForm.zip.trim())) {
      errs.zip = t('address.errorZipFormat')
    }
    if (!addressForm.mailingOption) errs.mailingOption = t('address.errorMailingOption')
    const mailingErrs = {}
    if (addressForm.mailingOption === 'different') {
      if (!mailingForm.street1.trim()) mailingErrs.street1 = t('address.errorStreet1Required')
      if (!mailingForm.city.trim()) mailingErrs.city = t('address.errorCityRequired')
      if (!mailingForm.state.trim()) mailingErrs.state = t('address.errorStateRequired')
      if (!mailingForm.zip.trim()) {
        mailingErrs.zip = t('address.errorZipRequired')
      } else if (!/^\d{5}(-\d{4})?$/.test(mailingForm.zip.trim())) {
        mailingErrs.zip = t('address.errorZipFormat')
      }
    }
    if (Object.keys(errs).length || Object.keys(mailingErrs).length) {
      setAddressErrors(errs)
      setMailingErrors(mailingErrs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    saveProgress(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('personalInfo')
  }

  const updateMailing = (key, val) => setMailingForm(prev => ({ ...prev, [key]: val }))
  const clearMailingError = (key) => setMailingErrors(prev => { const n = { ...prev }; delete n[key]; return n })

  const handleMailingSubmit = () => {
    const errs = {}
    if (!mailingForm.street1.trim()) errs.street1 = t('address.errorStreet1Required')
    if (!mailingForm.city.trim()) errs.city = t('address.errorCityRequired')
    if (!mailingForm.state.trim()) errs.state = t('address.errorStateRequired')
    if (!mailingForm.zip.trim()) {
      errs.zip = t('address.errorZipRequired')
    } else if (!/^\d{5}(-\d{4})?$/.test(mailingForm.zip.trim())) {
      errs.zip = t('address.errorZipFormat')
    }
    if (Object.keys(errs).length) {
      setMailingErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    saveProgress(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('personalInfo')
  }

  // ── Step mapping ────────────────────────────────────────────────────────
  // Plaid moved to the end of data collection (just before finalReview), so it
  // is now step 8. Steps 2–8 reshuffled; 9–12 are intentionally unchanged so the
  // post-signing (>= 11) and contract-embed (=== 10) checks below stay valid.
  const mapObsoleteStepToString = (n) => {
    const map = {
      2: 'address', 3: 'address', 4: 'address', 5: 'personalInfo',
      6: 'personalAddress', 7: 'billingContact', 8: 'plaid',
      9: 'finalReview', 10: 'contractSigning', 11: 'contractSigned', 12: 'allDone',
    }
    return map[n] ?? 'review'
  }

  // ── Form assembly (React state slices → API shape) ───────────────────────
  const assembleFormForApi = () => ({
    firstName: lead?.firstName || '',
    lastName:  lead?.lastName  || '',
    email:     lead?.email     || '',
    phone:     lead?.phone     || '',
    companyAddress: {
      line1: addressForm.street1,
      line2: addressForm.street2 || '',
      city:  addressForm.city,
      state: addressForm.state,
      zip:   addressForm.zip,
    },
    mailingAddressChoice: addressForm.mailingOption === 'different' ? 'other' : 'same-as-company',
    mailingAddress: addressForm.mailingOption === 'different'
      ? { line1: mailingForm.street1, line2: mailingForm.street2 || '',
          city: mailingForm.city, state: mailingForm.state, zip: mailingForm.zip }
      : null,
    bank: bankForm,
    personal: {
      // Send the full SSN (parity with the driver-license number) so the backend
      // can persist it. `extract_ssn` reads `ssn` first; `ssnLast4Masked` is kept
      // only as a masked echo for display. A masked-only value would be dropped
      // by `SensitiveFields.merge_update` and never saved.
      ssn: personalForm.ssn || '',
      ssnLast4Masked: personalForm.ssn ? '•••••' + personalForm.ssn.slice(-4) : '',
      driverLicenseNumber: personalForm.dlNumber,
    },
    personalAddressChoice:
      personalAddressOption === 'business' ? 'same-as-business'
      : personalAddressOption === 'mailing' ? 'same-as-mailing'
      : 'other',
    personalAddress: personalAddressOption === 'new'
      ? { line1: personalAddressForm.street1, line2: personalAddressForm.street2 || '',
          city: personalAddressForm.city, state: personalAddressForm.state, zip: personalAddressForm.zip }
      : null,
    billingChoice: billingContactOption,
    billingContact: billingContactOption === 'other'
      ? { name:  `${billingContactForm.firstName} ${billingContactForm.lastName}`.trim(),
          role:  billingContactForm.title,
          email: billingContactForm.email,
          phone: billingContactForm.phone }
      : {},
    files: uploadedFiles,
    acceptTerms: false,
  })

  // ── saveProgress (fire-and-forget) ───────────────────────────────────────
  const saveProgress = (nextStep) => {
    // When arriving via an invite link the OTP code is never set; the session
    // token alone is sufficient for the server to identify the lead.
    if (!otpCode && !sessionToken) return
    updateLead(buildUpdateLeadPayload(assembleFormForApi(), otpCode, sessionToken, plaid, nextStep))
      .catch((err) => console.error('saveProgress failed', err))
  }

  // ── Plaid verification ───────────────────────────────────────────────────
  const handlePlaidEvent = (eventName, metadata) => {
    if (!plaid.combinedProbe.enabled || !eventName) return
    if (String(eventName).startsWith('IDENTITY_VERIFICATION_')) {
      setPlaid(prev => ({
        ...prev,
        combinedProbe: {
          ...prev.combinedProbe,
          idvEvents: [...prev.combinedProbe.idvEvents, {
            eventName,
            linkSessionId: metadata?.link_session_id || null,
            viewName: metadata?.view_name || null,
            timestamp: metadata?.timestamp || new Date().toISOString(),
          }],
          lastOutcome:
            eventName === 'IDENTITY_VERIFICATION_PASS_SESSION'    ? 'idv_passed'
            : eventName === 'IDENTITY_VERIFICATION_FAIL_SESSION'  ? 'idv_failed'
            : eventName === 'IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION' ? 'idv_pending_review'
            : prev.combinedProbe.lastOutcome,
        },
      }))
    }
  }

  const handlePlaidSuccess = async (publicToken, metadata) => {
    const selectedAccount = metadata?.accounts?.[0] || null
    if (!selectedAccount?.id) {
      setPlaid(prev => ({ ...prev, status: 'error' }))
      return
    }
    try {
      const { ok, data } = await exchangePlaidToken({
        verificationCode: otpCode,
        sessionToken,
        publicToken,
        accountId: selectedAccount.id,
        metadata,
      })
      if (!ok || !data?.success) {
        setPlaid(prev => ({
          ...prev,
          status: 'error',
          rejectionCode: data?.code || 'PLAID_EXCHANGE_FAILED',
          rejectionDetails: data?.details || null,
          rejectionMessage: data?.message || null,
        }))
        if (data?.bypass_available) setPlaidBypassAvailable(true)
        return
      }
      const result = mapPlaidExchangeResult(data, metadata, selectedAccount)
      setPlaid(prev => ({
        ...prev,
        ...result,
        rejectionCode: null,
        rejectionDetails: null,
        rejectionMessage: null,
      }))
      setBankForm(prev => ({ ...prev, name: result.bankUpdates.name, accountType: result.bankUpdates.accountType }))

      saveProgress(9)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep('finalReview')
    } catch {
      setPlaid(prev => ({ ...prev, status: 'error' }))
    }
  }

  const startPlaidVerification = async () => {
    if (plaid.status === 'in_progress') return
    setPlaidAttempted(true)
    setPlaid(prev => ({
      ...prev,
      status: 'in_progress',
      rejectionCode: null,
      rejectionDetails: null,
      rejectionMessage: null,
    }))
    try {
      const useCombined = plaidConfig.combinedLinkEnabled
      const fetcher = useCombined ? getPlaidCombinedLinkToken : getPlaidLinkToken
      const { ok, data } = await fetcher({
        verificationCode: otpCode,
        sessionToken,
        mode: useCombined ? 'single_session_probe' : 'standard',
      })
      if (!ok || !data?.success || !data?.link_token) {
        throw new Error(data?.message || t('otp.errorPlaidUnavailable'))
      }
      setPlaid(prev => ({
        ...prev,
        linkToken: data.link_token,
        requestId: data.request_id || null,
        combinedProbe: { ...prev.combinedProbe, enabled: useCombined, mode: data.mode || prev.combinedProbe.mode },
      }))
      if (!window.Plaid?.create) throw new Error(t('otp.errorPlaidUnavailable'))
      plaidHandlerRef.current?.destroy()
      plaidHandlerRef.current = window.Plaid.create({
        token: data.link_token,
        onSuccess: handlePlaidSuccess,
        onEvent:   handlePlaidEvent,
        onExit: (err) => {
          if (plaid.status === 'verified') return
          setPlaid(prev => ({ ...prev, status: err ? 'error' : 'not_started' }))
        },
      })
      plaidHandlerRef.current.open()
    } catch (err) {
      setPlaid(prev => ({ ...prev, status: 'error' }))
      console.error('startPlaidVerification failed', err)
    }
  }

  // ── Document uploads ─────────────────────────────────────────────────────
  const handleDocumentUpload = async (key, file) => {
    const validation = validateUploadFile(file)
    if (!validation.ok) {
      const msg = validation.reason === 'size' ? t('common.fileTooLarge') : t('common.fileTypeInvalid')
      setUploadStatus(prev => ({ ...prev, [key]: { type: 'error', message: msg } }))
      return
    }
    setUploadInFlight(prev => ({ ...prev, [key]: true }))
    setUploadStatus(prev => ({ ...prev, [key]: { type: '', message: '' } }))
    try {
      const formData = buildUploadDocumentFormData(key, file, otpCode, sessionToken)
      const { ok, data } = await uploadDocument(formData)
      if (ok && data.success) {
        setUploadedFiles(prev => ({ ...prev, [key]: { field: key, filename: data.fileName } }))
        setUploadStatus(prev => ({ ...prev, [key]: { type: 'success', message: t('common.uploadSuccess') } }))
      } else {
        setUploadStatus(prev => ({ ...prev, [key]: { type: 'error', message: t('common.uploadFailed') } }))
      }
    } catch {
      setUploadStatus(prev => ({ ...prev, [key]: { type: 'error', message: t('common.networkError') } }))
    } finally {
      setUploadInFlight(prev => ({ ...prev, [key]: false }))
    }
  }

  const handleVoidCheckSelect = (file) => {
    if (!file || uploadInFlight.voidCheck) return
    setVoidCheckFile(file)
    handleDocumentUpload('voidCheck', file)
  }

  const handleDlFileSelect = (file) => {
    if (!file || uploadInFlight.driverLicenseScan) return
    setPersonalForm(prev => ({ ...prev, dlFile: file }))
    setPersonalErrors(prev => { const n = { ...prev }; delete n.dlFile; return n })
    handleDocumentUpload('driverLicenseScan', file)
  }

  // ── Contract & signing ───────────────────────────────────────────────────
  const loadContractEmbed = async (docId) => {
    const id = docId ?? documentId
    if (!id) {
      setContractError(t('finalReview.errorNoDocumentId'))
      setPreparingContract(false)
      return
    }
    setLoadingContract(true)
    setContractEmbedUrl(null)
    setContractError(null)
    try {
      const { ok, data } = await getSignEmbedUrl(buildSignEmbedPayload(otpCodeRef.current, sessionTokenRef.current, id))
      if (ok && data.success && data.sign_url) {
        setContractEmbedUrl(data.sign_url)
        setPreparingContract(false)
      } else {
        setContractError(data.message || t('finalReview.errorEmbedFailed'))
        setPreparingContract(false)
      }
    } catch {
      setContractError(t('common.networkError'))
      setPreparingContract(false)
    } finally {
      setLoadingContract(false)
    }
  }

  const acceptTermsAndSubmit = async () => {
    setPreparingContract(true)
    setPreparingPhase(1)
    setSubmitError('')
    try {
      const { ok, data } = await generateContract(
        buildContractPayload(assembleFormForApi(), otpCode, sessionToken)
      )
      if (!ok) {
        setPreparingContract(false)
        setShowTermsModal(false)
        setSubmitError(data.message || t('finalReview.errorContractFailed'))
        return
      }
      const docId = data.document_id
      setDocumentId(docId)
      setPreparingPhase(2)
      setShowTermsModal(false)
      setStep('contractSigning')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      await loadContractEmbed(docId)
    } catch {
      setPreparingContract(false)
      setShowTermsModal(false)
      setSubmitError(t('common.networkError'))
    }
  }

  // ── Force the entry disclaimer on the first data step (address) if not yet
  //    acknowledged. Plaid moved to the end of the flow, so this is no longer
  //    tied to the Plaid step.
  useEffect(() => {
    if (step === 'address' && !disclaimerAcknowledged) {
      setDisclaimerVisible(true)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Plaid bypass redirect: when backend allows bypass, skip Plaid entirely ──
  // If plaidBypassAvailable becomes true while on the plaid step (e.g. after
  // OTP verify, session restore, or a failed Plaid exchange), redirect the user
  // straight to the manual bank entry form instead of showing the Plaid stub.
  useEffect(() => {
    if (step === 'plaid' && plaidBypassAvailable) {
      setPlaidManualFallback(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep('bankInfo')
    }
  }, [step, plaidBypassAvailable]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── URL-based OTP prefill (deep-link support) ────────────────────────────
  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl && isValidOtp(codeFromUrl)) {
      setCode(codeFromUrl.toUpperCase())
      setCodePrefilled(true)
      setSearchParams({}, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pre-approved invite: session token passed via URL ───────────────────
  // When a prospect redeems a pre-approved invite the backend issues a session
  // token immediately (no OTP step). LeadForm.jsx navigates here with
  // ?sessionToken=<token> so we can auto-validate and skip the OTP screen.
  useEffect(() => {
    const token = searchParams.get('sessionToken')
    if (!token) return

    // Remove the token from the address bar before any async work to avoid
    // leaking it via Referer headers or browser history sharing.
    setSearchParams({}, { replace: true })

    setLoading(true)
    setError('')

    validateSession(token)
      .then(({ ok, data }) => {
        if (!ok || !data.success) {
          setError(t('otp.errorInvalid'))
          return
        }
        if (!data.lead) {
          setError(t('otp.errorLeadMissing'))
          return
        }

        const apiLead = data.lead
        const mapped  = mapLeadFromApi(apiLead)
        setLead(mapped)
        setSessionToken(token)
        sessionTokenRef.current = token
        if (data.document_id) setDocumentId(data.document_id)

        const addrSlice = mapAddressesFromApi(apiLead)
        setAddressForm({
          street1: addrSlice.companyAddress.line1,
          street2: addrSlice.companyAddress.line2,
          city:    addrSlice.companyAddress.city,
          state:   addrSlice.companyAddress.state,
          zip:     addrSlice.companyAddress.zip,
          mailingOption: addrSlice.mailingAddressChoice === 'other' ? 'different' : 'same',
        })
        if (addrSlice.mailingAddressChoice === 'other') {
          setMailingForm({
            street1: addrSlice.mailingAddress.line1,
            street2: addrSlice.mailingAddress.line2,
            city:    addrSlice.mailingAddress.city,
            state:   addrSlice.mailingAddress.state,
            zip:     addrSlice.mailingAddress.zip,
          })
        }

        const { bank: bankData, plaidState } = mapBankFromApi(apiLead, { plaid_rejected: data.plaid_rejected })
        setBankForm(bankData)
        setPlaid(prev => ({ ...prev, ...plaidState }))
        if (data.manual_verification_authorized) {
          setPlaidBypassAvailable(true)
        }

        const { billingChoice, billingContact } = mapBillingContactFromApi(apiLead, mapped.email)
        setBillingContactOption(billingChoice)
        const nameParts = (billingContact.name || '').split(' ')
        setBillingContactForm({
          firstName: nameParts[0] || '',
          lastName:  nameParts.slice(1).join(' ') || '',
          email:     billingContact.email,
          phone:     '',
          title:     billingContact.role || '',
        })

        const { files: apiFiles, uploadStatus: apiUploadStatus } = mapFilesFromApi(apiLead)
        setUploadedFiles(apiFiles)
        setUploadStatus(prev => ({ ...prev, ...apiUploadStatus }))

        const resumeStep = getResumeStep(data)

        if (resumeStep >= 11 && token) {
          window.location.replace(`/#/post-signing?token=${encodeURIComponent(token)}`)
          return
        }

        const isPlaidRelink = !!data.plaid_relink_required
        const plaidRejected = !!data.plaid_rejected
        if (isPlaidRelink) {
          setPlaid(prev => ({
            ...prev,
            status: 'not_started',
            linkToken: '',
            linkSessionId: '',
            selectedAccount: null,
            institution: null,
            requestId: null,
            requiresManualBankInput: false,
          }))
        }

        let targetStep = isPlaidRelink || plaidRejected ? 'plaid' : mapObsoleteStepToString(resumeStep)
        // Plaid now sits at the end of the flow. When manual entry is authorised,
        // flag the bypass instead of jumping straight to it — the (final) Plaid
        // step routes to the manual bank form on arrival, so the customer still
        // completes the earlier, simpler steps first.
        if (!isPlaidRelink && !plaidRejected && data.manual_verification_authorized) {
          setPlaidBypassAvailable(true)
        }
        setDisclaimerVisible(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(targetStep)
        if (resumeStep === 10) loadContractEmbed(data.document_id)
      })
      .catch(() => setError(t('common.networkError')))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const BANK_STEPS = [
    {
      label: t('bankInfo.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
    {
      label: t('address.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      label: t('personalInfo.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      label: t('personalAddress.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      label: t('billingContact.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ]

  const handleBankSubmit = () => {
    const errs = {}
    if (plaidManualFallback && !uploadedFiles.voidCheck) {
      errs.voidCheck = t('bankInfo.errorVoidCheckRequired')
    }
    const acct = bankForm.accountNumberMasked.replace(/\D/g, '')
    if (!acct) {
      errs.accountNumberMasked = t('bankInfo.errorAccountRequired')
    } else if (!/^\d{5,17}$/.test(acct)) {
      errs.accountNumberMasked = t('bankInfo.errorAccountDigits')
    }
    const acctConfirm = bankForm.accountNumberMaskedConfirm.replace(/\D/g, '')
    if (acctConfirm !== acct) {
      errs.accountNumberMaskedConfirm = t('bankInfo.errorAccountMismatch')
    }
    if (!bankForm.routingNumber.trim()) {
      errs.routingNumber = t('bankInfo.errorRoutingRequired')
    } else if (!/^\d{9}$/.test(bankForm.routingNumber)) {
      errs.routingNumber = t('bankInfo.errorRoutingFormat')
    }
    if (Object.keys(errs).length) {
      setBankErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    saveProgress(9)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('finalReview')
  }

  const handleSubmit = async () => {
    const otp = code.trim().toUpperCase()
    if (!isValidOtp(otp)) {
      setError(t('otp.errorIncomplete'))
      return
    }
    setLoading(true)
    setError('')
    setPendingMessage('')
    try {
      const { ok, data } = await verifyOtp(otp)

      if (data.pending === true) {
        setPendingMessage(t('otp.pendingMessage'))
        return
      }
      if (!ok || !data.success) {
        setError(t('otp.errorInvalid'))
        if (data.code === 'OTP_INVALID_OR_USED') {
          setCode('')
          setError('')
          setShowRecoveryModal(true)
        }
        return
      }
      if (!data.lead) {
        setError(t('otp.errorLeadMissing'))
        return
      }

      const apiLead = data.lead
      const mapped  = mapLeadFromApi(apiLead)
      setLead(mapped)
      setOtpCode(otp)
      otpCodeRef.current = otp
      setSessionToken(data.session_token || null)
      sessionTokenRef.current = data.session_token || null
      if (data.document_id) setDocumentId(data.document_id)

      const addrSlice = mapAddressesFromApi(apiLead)
      setAddressForm({
        street1: addrSlice.companyAddress.line1,
        street2: addrSlice.companyAddress.line2,
        city:    addrSlice.companyAddress.city,
        state:   addrSlice.companyAddress.state,
        zip:     addrSlice.companyAddress.zip,
        mailingOption: addrSlice.mailingAddressChoice === 'other' ? 'different' : 'same',
      })
      if (addrSlice.mailingAddressChoice === 'other') {
        setMailingForm({
          street1: addrSlice.mailingAddress.line1,
          street2: addrSlice.mailingAddress.line2,
          city:    addrSlice.mailingAddress.city,
          state:   addrSlice.mailingAddress.state,
          zip:     addrSlice.mailingAddress.zip,
        })
      }

      const { bank: bankData, plaidState } = mapBankFromApi(apiLead, { plaid_rejected: data.plaid_rejected })
      setBankForm(bankData)
      setPlaid(prev => ({ ...prev, ...plaidState }))
      if (data.manual_verification_authorized) {
        setPlaidBypassAvailable(true)
      }

      const { billingChoice, billingContact } = mapBillingContactFromApi(apiLead, mapped.email)
      setBillingContactOption(billingChoice)
      const nameParts = (billingContact.name || '').split(' ')
      setBillingContactForm({
        firstName: nameParts[0] || '',
        lastName:  nameParts.slice(1).join(' ') || '',
        email:     billingContact.email,
        phone:     '',
        title:     billingContact.role || '',
      })

      const { files: apiFiles, uploadStatus: apiUploadStatus } = mapFilesFromApi(apiLead)
      setUploadedFiles(apiFiles)
      setUploadStatus(prev => ({ ...prev, ...apiUploadStatus }))

      const resumeStep = getResumeStep(data)

      // Steps 11+ (contractSigned, allDone) now live in PostSigning.
      // Redirect using the session token so that page can validate and resume.
      if (resumeStep >= 11 && data.session_token) {
        window.location.replace(`/#/post-signing?token=${encodeURIComponent(data.session_token)}`)
        return
      }

      const isPlaidRelink = !!data.plaid_relink_required
      const plaidRejected = !!data.plaid_rejected
      if (isPlaidRelink) {
        setPlaid(prev => ({
          ...prev,
          status: 'not_started',
          linkToken: '',
          linkSessionId: '',
          selectedAccount: null,
          institution: null,
          requestId: null,
          requiresManualBankInput: false,
        }))
      }

      let targetStep = isPlaidRelink || plaidRejected ? 'plaid' : mapObsoleteStepToString(resumeStep)
      // Plaid now sits at the end of the flow. When manual entry is authorised,
      // flag the bypass instead of jumping straight to it — the (final) Plaid
      // step routes to the manual bank form on arrival, so the customer still
      // completes the earlier, simpler steps first.
      if (!isPlaidRelink && !plaidRejected && data.manual_verification_authorized) {
        setPlaidBypassAvailable(true)
      }
      setDisclaimerVisible(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep(targetStep)
      if (resumeStep === 10) loadContractEmbed(data.document_id)
    } catch {
      setError(t('common.networkError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRequestNewCode = async () => {
    if (recoverySending || !recoveryEmail.trim()) return
    setError('')
    setRecoverySending(true)
    await requestNewCode(recoveryEmail.trim())
    setRecoverySending(false)
    setRecoverySent(true)
    setShowRecoveryModal(false)
  }

  if (step === 'plaid') {
    return (
      <>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-5">
              <div className="relative h-16 w-28">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-ds-sm border-4 border-white z-10">
                  <span className="text-white font-black text-lg tracking-tight">IT</span>
                </div>
                <div className="absolute right-0 top-0 w-16 h-16 rounded-full bg-gray-950 flex items-center justify-center shadow-ds-sm border-4 border-white">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path d="M12 3L19 7V15L12 19L5 15V7L12 3Z" />
                    <path d="M5 7L12 11L19 7" />
                    <path d="M12 11V19" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900 max-w-2xl mx-auto">
              {t('plaidStub.heading')}
            </h1>
            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {t('plaidStub.subheading')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4 sm:p-5">
                <div className="w-11 h-11 rounded-xl bg-white border border-amber-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base font-semibold text-amber-800 leading-relaxed">
                  {t('accountReview.bankNotice')}
                </p>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="10" r="1.7" />
                    <path d="M13 9h6M13 12h6M6.5 16c1.1-1.4 3-2 4.6-2 1.2 0 2.5.3 3.5 1" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
                  {t('plaidStub.point2')}
                </p>
              </div>

              {/* Account match reminder */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-sm text-gray-600 leading-relaxed">{t('plaidStub.mismatchWarning')}</p>
              </div>
            </div>

            {plaid.status === 'error' && (
              <PlaidExchangeErrorPanel
                code={plaid.rejectionCode}
                details={plaid.rejectionDetails}
                message={plaid.rejectionMessage}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(true)
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                           text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                           transition-colors duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('plaidStub.backBtn')}
              </button>
              {plaid.status === 'verified' ? (
                <button
                  type="button"
                  onClick={() => {
                    saveProgress(9)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    setStep('finalReview')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                             transition-colors duration-200 cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {t('common.nextStep')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startPlaidVerification}
                  disabled={plaid.status === 'in_progress'}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                             transition-colors duration-200 cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-primary/30
                             disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {plaid.status === 'in_progress' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('plaidStub.connecting')}
                    </>
                  ) : plaid.status === 'error' ? (
                    t('plaidStub.retryDifferentAccountBtn')
                  ) : (
                    t('plaidStub.button')
                  )}
                </button>
              )}
            </div>

          </div>
        {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
        {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
        </main>
      </>
    )
  }
   if (step === 'address') {
    return (
      <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <StepIndicator steps={BANK_STEPS} currentStep={2} />
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('address.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t('address.subheading')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">
          <div className="space-y-5">

            {/* Street Address 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('address.labelStreet1')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoComplete="address-line1"
                value={addressForm.street1}
                onChange={e => { updateAddress('street1', e.target.value); clearAddressError('street1') }}
                placeholder={t('address.placeholderStreet1')}
                className={addressInputClass(addressErrors.street1)}
              />
              {addressErrors.street1 && <p className="mt-1.5 text-xs text-red-600">{addressErrors.street1}</p>}
            </div>

            {/* Street Address 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('address.labelStreet2')}
              </label>
              <input
                type="text"
                autoComplete="address-line2"
                value={addressForm.street2}
                onChange={e => updateAddress('street2', e.target.value)}
                placeholder={t('address.placeholderStreet2')}
                className={addressInputClass(false)}
              />
            </div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelCity')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={addressForm.city}
                  onChange={e => { updateAddress('city', e.target.value); clearAddressError('city') }}
                  placeholder={t('address.placeholderCity')}
                  className={addressInputClass(addressErrors.city)}
                />
                {addressErrors.city && <p className="mt-1.5 text-xs text-red-600">{addressErrors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelState')} <span className="text-red-500">*</span>
                </label>
                <select
                  autoComplete="address-level1"
                  value={addressForm.state}
                  onChange={e => { updateAddress('state', e.target.value); clearAddressError('state') }}
                  className={addressInputClass(addressErrors.state) + ' appearance-none'}
                >
                  <option value="">{t('address.placeholderState')}</option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>{code} — {name}</option>
                  ))}
                </select>
                {addressErrors.state && <p className="mt-1.5 text-xs text-red-600">{addressErrors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelZip')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={addressForm.zip}
                  onChange={e => { updateAddress('zip', e.target.value); clearAddressError('zip') }}
                  placeholder={t('address.placeholderZip')}
                  className={addressInputClass(addressErrors.zip)}
                />
                {addressErrors.zip && <p className="mt-1.5 text-xs text-red-600">{addressErrors.zip}</p>}
              </div>
            </div>

            {/* Mailing option */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-800 mb-3">{t('address.mailingLabel')}</p>
              <div className="space-y-3">
                {[
                  { value: 'same', label: t('address.radioSame') },
                  { value: 'different', label: t('address.radioDifferent') },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={[
                      'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors duration-150',
                      addressForm.mailingOption === opt.value
                        ? 'border-primary bg-blue-50/60 ring-1 ring-primary/20'
                        : addressErrors.mailingOption
                          ? 'border-red-400 bg-red-50/40 hover:bg-red-50/60'
                          : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100/60',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="mailingOption"
                      value={opt.value}
                      checked={addressForm.mailingOption === opt.value}
                      onChange={() => { updateAddress('mailingOption', opt.value); clearAddressError('mailingOption'); setMailingErrors({}) }}
                      className="w-4 h-4 accent-primary flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              {addressErrors.mailingOption && (
                <p className="mt-2 text-xs text-red-600">{addressErrors.mailingOption}</p>
              )}
            </div>

            {/* Inline mailing address form */}
            {addressForm.mailingOption === 'different' && (
              <div className="animate-fadeIn space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{t('mailingAddress.heading')}</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('address.labelStreet1')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="address-line1"
                    value={mailingForm.street1}
                    onChange={e => { updateMailing('street1', e.target.value); clearMailingError('street1') }}
                    placeholder={t('address.placeholderStreet1')}
                    className={addressInputClass(mailingErrors.street1)}
                  />
                  {mailingErrors.street1 && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.street1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('address.labelStreet2')}
                  </label>
                  <input
                    type="text"
                    autoComplete="address-line2"
                    value={mailingForm.street2}
                    onChange={e => updateMailing('street2', e.target.value)}
                    placeholder={t('address.placeholderStreet2')}
                    className={addressInputClass(false)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('address.labelCity')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={mailingForm.city}
                      onChange={e => { updateMailing('city', e.target.value); clearMailingError('city') }}
                      placeholder={t('address.placeholderCity')}
                      className={addressInputClass(mailingErrors.city)}
                    />
                    {mailingErrors.city && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('address.labelState')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      autoComplete="address-level1"
                      value={mailingForm.state}
                      onChange={e => { updateMailing('state', e.target.value); clearMailingError('state') }}
                      className={addressInputClass(mailingErrors.state) + ' appearance-none'}
                    >
                      <option value="">{t('address.placeholderState')}</option>
                      {US_STATES.map(([code, name]) => (
                        <option key={code} value={code}>{code} — {name}</option>
                      ))}
                    </select>
                    {mailingErrors.state && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('address.labelZip')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      value={mailingForm.zip}
                      onChange={e => { updateMailing('zip', e.target.value); clearMailingError('zip') }}
                      placeholder={t('address.placeholderZip')}
                      className={addressInputClass(mailingErrors.zip)}
                    />
                    {mailingErrors.zip && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.zip}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddressSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>

      {/* Before-you-continue disclaimer — unskippable, shown on first visit to the first data step */}
      {disclaimerVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t('otp.disclaimerTitle')}</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{t('otp.disclaimerLine1')}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{t('otp.disclaimerLine2')}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{t('otp.disclaimerLine3')}</p>
            <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                {t('accountReview.marketingConsent')}
              </span>
            </label>
            <button
              type="button"
              onClick={() => { setDisclaimerAcknowledged(true); setDisclaimerVisible(false) }}
              className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('otp.disclaimerCta')}
            </button>
          </div>
        </div>
      )}
      </>
    )
  }

  if (step === 'mailingAddress') {
    const mailingInputClass = (err) => [
      'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
      'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
      'transition-colors duration-200 bg-white text-gray-900',
      err ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('mailingAddress.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t('mailingAddress.subheading')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">
          <div className="space-y-5">

            {/* Street Address 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('address.labelStreet1')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoComplete="address-line1"
                value={mailingForm.street1}
                onChange={e => { updateMailing('street1', e.target.value); clearMailingError('street1') }}
                placeholder={t('address.placeholderStreet1')}
                className={mailingInputClass(mailingErrors.street1)}
              />
              {mailingErrors.street1 && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.street1}</p>}
            </div>

            {/* Street Address 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('address.labelStreet2')}
              </label>
              <input
                type="text"
                autoComplete="address-line2"
                value={mailingForm.street2}
                onChange={e => updateMailing('street2', e.target.value)}
                placeholder={t('address.placeholderStreet2')}
                className={mailingInputClass(false)}
              />
            </div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelCity')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={mailingForm.city}
                  onChange={e => { updateMailing('city', e.target.value); clearMailingError('city') }}
                  placeholder={t('address.placeholderCity')}
                  className={mailingInputClass(mailingErrors.city)}
                />
                {mailingErrors.city && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelState')} <span className="text-red-500">*</span>
                </label>
                <select
                  autoComplete="address-level1"
                  value={mailingForm.state}
                  onChange={e => { updateMailing('state', e.target.value); clearMailingError('state') }}
                  className={mailingInputClass(mailingErrors.state) + ' appearance-none'}
                >
                  <option value="">{t('address.placeholderState')}</option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>{code} — {name}</option>
                  ))}
                </select>
                {mailingErrors.state && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelZip')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={mailingForm.zip}
                  onChange={e => { updateMailing('zip', e.target.value); clearMailingError('zip') }}
                  placeholder={t('address.placeholderZip')}
                  className={mailingInputClass(mailingErrors.zip)}
                />
                {mailingErrors.zip && <p className="mt-1.5 text-xs text-red-600">{mailingErrors.zip}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('address') }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('address.backBtn')}
            </button>
            <button
              type="button"
              onClick={handleMailingSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'personalInfo') {
    const triggerPeek = (field, setter, isVisible) => {
      if (isVisible) return
      clearTimeout(peekTimers.current[field])
      setter(true)
      peekTimers.current[field] = setTimeout(() => setter(false), 700)
    }

    const personalInputClass = (err) => [
      'w-full px-4 py-3 pr-12 text-base sm:text-sm border rounded-xl',
      'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
      'transition-colors duration-200 bg-white text-gray-900',
      err ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

    const updatePersonal = (key, val) => setPersonalForm(prev => ({ ...prev, [key]: val }))
    const clearPersonalError = (key) => setPersonalErrors(prev => { const n = { ...prev }; delete n[key]; return n })

    const handlePersonalSubmit = () => {
      const errs = {}
      if (!personalForm.ssn.trim()) {
        errs.ssn = t('personalInfo.errorSsnRequired')
      } else if (!/^\d{9}$/.test(personalForm.ssn.replace(/-/g, ''))) {
        errs.ssn = t('personalInfo.errorSsnFormat')
      }
      if (!personalForm.dlNumber.trim()) errs.dlNumber = t('personalInfo.errorDlRequired')
      if (!personalForm.dlConfirm.trim()) {
        errs.dlConfirm = t('personalInfo.errorDlConfirmRequired')
      } else if (personalForm.dlConfirm !== personalForm.dlNumber) {
        errs.dlConfirm = t('personalInfo.errorDlMismatch')
      }
      if (!uploadedFiles.driverLicenseScan) errs.dlFile = t('personalInfo.errorDlFileRequired')
      if (Object.keys(errs).length) {
        setPersonalErrors(errs)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      saveProgress(6)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep('personalAddress')
    }

    const backStep = 'address'

    const EyeIcon = ({ show }) => show ? (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <StepIndicator steps={BANK_STEPS} currentStep={3} />
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('personalInfo.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {t('personalInfo.subheading')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">

          {/* Legal notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 mb-6">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-sm text-blue-800 leading-relaxed">{t('personalInfo.legalNotice')}</p>
          </div>

          <div className="space-y-5">

            {/* SSN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('personalInfo.labelSsn')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSsn || peekSsn ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  value={personalForm.ssn}
                  onChange={e => { updatePersonal('ssn', e.target.value.replace(/\D/g, '').slice(0, 9)); clearPersonalError('ssn'); triggerPeek('ssn', setPeekSsn, showSsn) }}
                  placeholder={t('personalInfo.placeholderSsn')}
                  className={personalInputClass(personalErrors.ssn)}
                />
                <button type="button" onClick={() => setShowSsn(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={showSsn ? t('common.hide') : t('common.show')}>
                  <EyeIcon show={showSsn} />
                </button>
              </div>
              {personalErrors.ssn && <p className="mt-1.5 text-xs text-red-600">{personalErrors.ssn}</p>}
            </div>

            {/* DL Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('personalInfo.labelDl')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showDl || peekDl ? 'text' : 'password'}
                  autoComplete="off"
                  value={personalForm.dlNumber}
                  onChange={e => { updatePersonal('dlNumber', e.target.value); clearPersonalError('dlNumber'); triggerPeek('dl', setPeekDl, showDl) }}
                  placeholder={t('personalInfo.placeholderDl')}
                  className={personalInputClass(personalErrors.dlNumber)}
                />
                <button type="button" onClick={() => setShowDl(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={showDl ? t('common.hide') : t('common.show')}>
                  <EyeIcon show={showDl} />
                </button>
              </div>
              {personalErrors.dlNumber && <p className="mt-1.5 text-xs text-red-600">{personalErrors.dlNumber}</p>}
            </div>

            {/* DL Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('personalInfo.labelDlConfirm')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showDlConfirm || peekDlConfirm ? 'text' : 'password'}
                  autoComplete="off"
                  value={personalForm.dlConfirm}
                  onChange={e => { updatePersonal('dlConfirm', e.target.value); clearPersonalError('dlConfirm'); triggerPeek('dlConfirm', setPeekDlConfirm, showDlConfirm) }}
                  placeholder={t('personalInfo.placeholderDlConfirm')}
                  className={personalInputClass(personalErrors.dlConfirm)}
                />
                <button type="button" onClick={() => setShowDlConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={showDlConfirm ? t('common.hide') : t('common.show')}>
                  <EyeIcon show={showDlConfirm} />
                </button>
              </div>
              {personalErrors.dlConfirm && <p className="mt-1.5 text-xs text-red-600">{personalErrors.dlConfirm}</p>}
            </div>

            {/* DL File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('personalInfo.labelDlFile')} <span className="text-red-500">*</span>
              </label>
              <label className={[
                'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-200',
                personalErrors.dlFile
                  ? 'border-red-300 bg-red-50'
                  : personalForm.dlFile
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
              ].join(' ')}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                  className="sr-only"
                  onChange={e => handleDlFileSelect(e.target.files?.[0] ?? null)}
                />
                {uploadInFlight.driverLicenseScan ? (
                  <p className="text-sm text-gray-500">{t('common.loading')}</p>
                ) : uploadedFiles.driverLicenseScan ? (
                  <>
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">{uploadedFiles.driverLicenseScan.filename}</p>
                    <p className="text-xs text-gray-400">{t('personalInfo.tapToChange')}</p>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">{t('personalInfo.uploadBtn')}</p>
                    <p className="text-xs text-gray-400">{t('personalInfo.uploadHint')}</p>
                  </>
                )}
              </label>
              {personalErrors.dlFile && <p className="mt-1.5 text-xs text-red-600">{personalErrors.dlFile}</p>}
              {uploadStatus.driverLicenseScan.type === 'error' && (
                <p className="mt-1.5 text-xs text-red-600">{uploadStatus.driverLicenseScan.message}</p>
              )}
            </div>

            {/* Owner match notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">{t('personalInfo.ownerNotice')}</p>
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(backStep) }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('address.backBtn')}
            </button>
            <button
              type="button"
              onClick={handlePersonalSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'personalAddress') {
    const hasMailing = addressForm.mailingOption === 'different'

    const updatePersonalAddr = (key, val) =>
      setPersonalAddressForm(prev => ({ ...prev, [key]: val }))
    const clearPersonalAddrError = (key) =>
      setPersonalAddressErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    const personalAddrInputClass = (err) => [
      'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
      'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
      'transition-colors duration-200 bg-white text-gray-900',
      err ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

    const handlePersonalAddressSubmit = () => {
      const errs = {}
      if (!personalAddressOption) {
        errs.option = t('personalAddress.errorOptionRequired')
      }
      if (personalAddressOption === 'new') {
        if (!personalAddressForm.street1.trim()) errs.street1 = t('address.errorStreet1Required')
        if (!personalAddressForm.city.trim()) errs.city = t('address.errorCityRequired')
        if (!personalAddressForm.state.trim()) errs.state = t('address.errorStateRequired')
        if (!personalAddressForm.zip.trim()) {
          errs.zip = t('address.errorZipRequired')
        } else if (!/^\d{5}(-\d{4})?$/.test(personalAddressForm.zip.trim())) {
          errs.zip = t('address.errorZipFormat')
        }
      }
      if (Object.keys(errs).length) {
        setPersonalAddressErrors(errs)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      saveProgress(7)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep('billingContact')
    }

    const AddressPreview = ({ form }) => (
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        {form.street1}{form.street2 ? `, ${form.street2}` : ''}, {form.city}, {form.state} {form.zip}
      </p>
    )

    const radioBase = 'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors duration-200'
    const radioSelected = 'border-primary bg-blue-50/40'
    const radioIdle = personalAddressErrors.option ? 'border-red-400 bg-red-50/40 hover:border-red-500' : 'border-gray-200 hover:border-gray-300 bg-white'

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <StepIndicator steps={BANK_STEPS} currentStep={4} />
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('personalAddress.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {t('personalAddress.subheading')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">

          <div className="space-y-3">

            {/* Option: same as business address */}
            <label className={[radioBase, personalAddressOption === 'business' ? radioSelected : radioIdle].join(' ')}>
              <input
                type="radio"
                name="personalAddressOption"
                value="business"
                checked={personalAddressOption === 'business'}
                onChange={() => { setPersonalAddressOption('business'); setPersonalAddressErrors({}) }}
                className="mt-0.5 accent-primary flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{t('personalAddress.radioBusinessLabel')}</p>
                <AddressPreview form={addressForm} />
              </div>
            </label>

            {/* Option: same as mailing address — only if mailing was provided */}
            {hasMailing && (
              <label className={[radioBase, personalAddressOption === 'mailing' ? radioSelected : radioIdle].join(' ')}>
                <input
                  type="radio"
                  name="personalAddressOption"
                  value="mailing"
                  checked={personalAddressOption === 'mailing'}
                  onChange={() => { setPersonalAddressOption('mailing'); setPersonalAddressErrors({}) }}
                  className="mt-0.5 accent-primary flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{t('personalAddress.radioMailingLabel')}</p>
                  <AddressPreview form={mailingForm} />
                </div>
              </label>
            )}

            {/* Option: new address */}
            <label className={[radioBase, personalAddressOption === 'new' ? radioSelected : radioIdle].join(' ')}>
              <input
                type="radio"
                name="personalAddressOption"
                value="new"
                checked={personalAddressOption === 'new'}
                onChange={() => { setPersonalAddressOption('new'); setPersonalAddressErrors({}) }}
                className="mt-0.5 accent-primary flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{t('personalAddress.radioNewLabel')}</p>
              </div>
            </label>

          </div>

          {personalAddressErrors.option && (
            <p className="mt-3 text-xs text-red-500">{personalAddressErrors.option}</p>
          )}

          {/* New address form */}
          {personalAddressOption === 'new' && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              {/* Street 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelStreet1')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="street-address"
                  value={personalAddressForm.street1}
                  onChange={e => { updatePersonalAddr('street1', e.target.value); clearPersonalAddrError('street1') }}
                  placeholder={t('address.placeholderStreet1')}
                  className={personalAddrInputClass(personalAddressErrors.street1)}
                />
                {personalAddressErrors.street1 && <p className="mt-1.5 text-xs text-red-600">{personalAddressErrors.street1}</p>}
              </div>
              {/* Street 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('address.labelStreet2')}
                </label>
                <input
                  type="text"
                  autoComplete="address-line2"
                  value={personalAddressForm.street2}
                  onChange={e => updatePersonalAddr('street2', e.target.value)}
                  placeholder={t('address.placeholderStreet2')}
                  className={personalAddrInputClass(false)}
                />
              </div>
              {/* City + State + ZIP */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('address.labelCity')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="address-level2"
                    value={personalAddressForm.city}
                    onChange={e => { updatePersonalAddr('city', e.target.value); clearPersonalAddrError('city') }}
                    placeholder={t('address.placeholderCity')}
                    className={personalAddrInputClass(personalAddressErrors.city)}
                  />
                  {personalAddressErrors.city && <p className="mt-1.5 text-xs text-red-600">{personalAddressErrors.city}</p>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('address.labelState')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={personalAddressForm.state}
                        onChange={e => { updatePersonalAddr('state', e.target.value); clearPersonalAddrError('state') }}
                        className={[personalAddrInputClass(personalAddressErrors.state), 'appearance-none pr-8'].join(' ')}
                      >
                        <option value="">{t('address.placeholderState')}</option>
                        {US_STATES.map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                    {personalAddressErrors.state && <p className="mt-1.5 text-xs text-red-600">{personalAddressErrors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('address.labelZip')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={10}
                      value={personalAddressForm.zip}
                      onChange={e => { updatePersonalAddr('zip', e.target.value.replace(/[^\d-]/g, '')); clearPersonalAddrError('zip') }}
                      placeholder={t('address.placeholderZip')}
                      className={personalAddrInputClass(personalAddressErrors.zip)}
                    />
                    {personalAddressErrors.zip && <p className="mt-1.5 text-xs text-red-600">{personalAddressErrors.zip}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('personalInfo') }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('personalAddress.backBtn')}
            </button>
            <button
              type="button"
              onClick={handlePersonalAddressSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'billingContact') {
    const updateBilling = (key, val) => setBillingContactForm(prev => ({ ...prev, [key]: val }))
    const clearBillingError = (key) => setBillingContactErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    const billingInputClass = (err) => [
      'w-full px-4 py-3 text-base sm:text-sm border rounded-xl',
      'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
      'transition-colors duration-200 bg-white text-gray-900',
      err ? 'border-red-300 bg-red-50' : 'border-gray-200',
    ].join(' ')

    const handleBillingSubmit = () => {
      const errs = {}
      if (!billingContactOption) {
        errs.option = t('billingContact.errorOptionRequired')
      }
      if (billingContactOption === 'other') {
        if (!billingContactForm.firstName.trim()) errs.firstName = t('billingContact.errorFirstNameRequired')
        if (!billingContactForm.lastName.trim()) errs.lastName = t('billingContact.errorLastNameRequired')
        if (!billingContactForm.email.trim()) {
          errs.email = t('billingContact.errorEmailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingContactForm.email.trim())) {
          errs.email = t('billingContact.errorEmailFormat')
        }
        if (!billingContactForm.phone.trim()) errs.phone = t('billingContact.errorPhoneRequired')
      }
      if (Object.keys(errs).length) {
        setBillingContactErrors(errs)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      saveProgress(8)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep('plaid')
    }

    const radioBase = 'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors duration-200'
    const radioSelected = 'border-primary bg-blue-50/40'
    const radioIdle = billingContactErrors.option ? 'border-red-400 bg-red-50/40 hover:border-red-500' : 'border-gray-200 hover:border-gray-300 bg-white'

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <StepIndicator steps={BANK_STEPS} currentStep={5} />
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('billingContact.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {t('billingContact.subheading')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-3xl mx-auto">

          <div className="space-y-3">

            {/* Self */}
            <label className={[radioBase, billingContactOption === 'self' ? radioSelected : radioIdle].join(' ')}>
              <input
                type="radio"
                name="billingContactOption"
                value="self"
                checked={billingContactOption === 'self'}
                onChange={() => { setBillingContactOption('self'); setBillingContactErrors({}) }}
                className="mt-0.5 accent-primary flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('billingContact.radioSelfLabel')}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t('billingContact.radioSelfDesc')}</p>
              </div>
            </label>

            {/* Someone else */}
            <label className={[radioBase, billingContactOption === 'other' ? radioSelected : radioIdle].join(' ')}>
              <input
                type="radio"
                name="billingContactOption"
                value="other"
                checked={billingContactOption === 'other'}
                onChange={() => { setBillingContactOption('other'); setBillingContactErrors({}) }}
                className="mt-0.5 accent-primary flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('billingContact.radioOtherLabel')}</p>
              </div>
            </label>

          </div>

          {billingContactErrors.option && (
            <p className="mt-3 text-xs text-red-500">{billingContactErrors.option}</p>
          )}

          {/* Other contact form */}
          {billingContactOption === 'other' && (
            <div className="mt-6 space-y-4 animate-fadeIn">

              {/* First + Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('billingContact.labelFirstName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={billingContactForm.firstName}
                    onChange={e => { updateBilling('firstName', e.target.value); clearBillingError('firstName') }}
                    placeholder={t('billingContact.placeholderFirstName')}
                    className={billingInputClass(billingContactErrors.firstName)}
                  />
                  {billingContactErrors.firstName && <p className="mt-1.5 text-xs text-red-600">{billingContactErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('billingContact.labelLastName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={billingContactForm.lastName}
                    onChange={e => { updateBilling('lastName', e.target.value); clearBillingError('lastName') }}
                    placeholder={t('billingContact.placeholderLastName')}
                    className={billingInputClass(billingContactErrors.lastName)}
                  />
                  {billingContactErrors.lastName && <p className="mt-1.5 text-xs text-red-600">{billingContactErrors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('billingContact.labelEmail')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={billingContactForm.email}
                  onChange={e => { updateBilling('email', e.target.value); clearBillingError('email') }}
                  placeholder={t('billingContact.placeholderEmail')}
                  className={billingInputClass(billingContactErrors.email)}
                />
                {billingContactErrors.email && <p className="mt-1.5 text-xs text-red-600">{billingContactErrors.email}</p>}
              </div>

              {/* Phone + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('billingContact.labelPhone')} <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    autoComplete="tel"
                    value={billingContactForm.phone}
                    onChange={val => { updateBilling('phone', val); clearBillingError('phone') }}
                    placeholder={t('billingContact.placeholderPhone')}
                    className={billingInputClass(billingContactErrors.phone)}
                  />
                  {billingContactErrors.phone && <p className="mt-1.5 text-xs text-red-600">{billingContactErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('billingContact.labelTitle')}
                  </label>
                  <input
                    type="text"
                    autoComplete="organization-title"
                    value={billingContactForm.title}
                    onChange={e => updateBilling('title', e.target.value)}
                    placeholder={t('billingContact.placeholderTitle')}
                    className={billingInputClass(false)}
                  />
                </div>
              </div>

            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('personalAddress') }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('billingContact.backBtn')}
            </button>
            <button
              type="button"
              onClick={handleBillingSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'finalReview') {
    // Determine which home address to show
    const homeAddrForm =
      personalAddressOption === 'business' ? addressForm
      : personalAddressOption === 'mailing' ? mailingForm
      : personalAddressForm

    const homeAddrLabel =
      personalAddressOption === 'business' ? t('finalReview.valueSameAsBusiness')
      : personalAddressOption === 'mailing' ? t('finalReview.valueSameAsMailing')
      : null

    // Mask SSN: show •••••XXXX
    const maskedSsn = personalForm.ssn
      ? '•••••' + personalForm.ssn.slice(-4)
      : '—'

    const maskDl = (val) => val ? val.slice(0, 2) + '•••••' + val.slice(-2) : '—'

    const goEdit = (target) => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStep(target)
    }

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('finalReview.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            {t('finalReview.subheading')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">

          {/* 1. Billing Address */}
          <ReviewSection
            title={t('finalReview.sectionBillingAddress')}
            onEdit={() => goEdit('address')}
            editLabel={t('finalReview.editBtn')}
          >
            <ReviewRow label={t('finalReview.labelStreet')} value={addressForm.street1 + (addressForm.street2 ? `, ${addressForm.street2}` : '')} />
            <ReviewRow label={t('finalReview.labelCity')} value={addressForm.city} />
            <ReviewRow label={t('finalReview.labelState')} value={addressForm.state} />
            <ReviewRow label={t('finalReview.labelZip')} value={addressForm.zip} />
          </ReviewSection>

          {/* 2. Mailing Address (if different) */}
          {addressForm.mailingOption === 'different' && (
            <ReviewSection
              title={t('finalReview.sectionMailingAddress')}
              onEdit={() => goEdit('address')}
              editLabel={t('finalReview.editBtn')}
            >
              <ReviewRow label={t('finalReview.labelStreet')} value={mailingForm.street1 + (mailingForm.street2 ? `, ${mailingForm.street2}` : '')} />
              <ReviewRow label={t('finalReview.labelCity')} value={mailingForm.city} />
              <ReviewRow label={t('finalReview.labelState')} value={mailingForm.state} />
              <ReviewRow label={t('finalReview.labelZip')} value={mailingForm.zip} />
            </ReviewSection>
          )}

          {/* 3. Personal Information */}
          <ReviewSection
            title={t('finalReview.sectionPersonalInfo')}
            onEdit={() => goEdit('personalInfo')}
            editLabel={t('finalReview.editBtn')}
          >
            <ReviewRow label={t('finalReview.labelSsn')} value={maskedSsn} />
            <ReviewRow label={t('finalReview.labelDl')} value={maskDl(personalForm.dlNumber)} />
            {personalForm.dlFile && (
              <ReviewRow label={t('finalReview.labelDlFile')} value={personalForm.dlFile.name} />
            )}
          </ReviewSection>

          {/* 4. Home Address */}
          <ReviewSection
            title={t('finalReview.sectionHomeAddress')}
            onEdit={() => goEdit('personalAddress')}
            editLabel={t('finalReview.editBtn')}
          >
            {homeAddrLabel ? (
              <ReviewRow label={t('finalReview.labelStreet')} value={homeAddrLabel} />
            ) : (
              <>
                <ReviewRow label={t('finalReview.labelStreet')} value={homeAddrForm.street1 + (homeAddrForm.street2 ? `, ${homeAddrForm.street2}` : '')} />
                <ReviewRow label={t('finalReview.labelCity')} value={homeAddrForm.city} />
                <ReviewRow label={t('finalReview.labelState')} value={homeAddrForm.state} />
                <ReviewRow label={t('finalReview.labelZip')} value={homeAddrForm.zip} />
              </>
            )}
          </ReviewSection>

          {/* 5. Bank — locked, verified via Plaid */}
          <ReviewSection
            title={t('finalReview.sectionBank')}
            editLabel={t('finalReview.plaidBadge')}
          >
            <div className="py-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('finalReview.plaidBadge')}
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">{t('finalReview.plaidNote')}</p>
            </div>
          </ReviewSection>

          {/* 6. Billing Contact */}
          <ReviewSection
            title={t('finalReview.sectionBillingContact')}
            onEdit={() => goEdit('billingContact')}
            editLabel={t('finalReview.editBtn')}
          >
            {billingContactOption === 'self' ? (
              <ReviewRow label={t('finalReview.labelContactType')} value={t('finalReview.valueSelf')} />
            ) : (
              <>
                <ReviewRow label={t('finalReview.labelFirstName')} value={billingContactForm.firstName} />
                <ReviewRow label={t('finalReview.labelLastName')} value={billingContactForm.lastName} />
                <ReviewRow label={t('finalReview.labelEmail')} value={billingContactForm.email} />
                <ReviewRow label={t('finalReview.labelPhone')} value={billingContactForm.phone} />
                {billingContactForm.title && (
                  <ReviewRow label={t('finalReview.labelTitle')} value={billingContactForm.title} />
                )}
              </>
            )}
          </ReviewSection>

        </div>

        {/* Back + Submit */}
        <div className="max-w-3xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('plaid') }}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                       text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t('finalReview.backBtn')}
          </button>
          {submitError && (
            <p className="text-sm text-red-600 text-center">{submitError}</p>
          )}
          <button
            type="button"
            onClick={() => { setSubmitError(''); setShowTermsModal(true) }}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('finalReview.submitBtn')}
          </button>
        </div>

        {/* Terms & Conditions Modal */}
        {showTermsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => !preparingContract && e.target === e.currentTarget && setShowTermsModal(false)}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative overflow-hidden">

              {/* Full-card loading overlay after Agree is clicked */}
              {preparingContract && (
                <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center gap-4 rounded-2xl">
                  <svg className="w-9 h-9 animate-spin text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-700 text-center">
                    {t('contractSigning.preparingPhase1')}
                  </p>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{t('finalReview.modalTitle')}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  disabled={preparingContract}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-0 disabled:pointer-events-none"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('finalReview.modalBody1')}
                <span className="text-primary underline underline-offset-2 decoration-primary cursor-pointer hover:text-secondary">
                  {t('finalReview.modalTermsLink')}
                </span>
                {t('finalReview.modalBody2')}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={acceptTermsAndSubmit}
                  disabled={preparingContract}
                  className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                             transition-colors duration-200 cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-primary/30
                             disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('finalReview.modalAgreeBtn')}
                </button>
              </div>

            </div>
          </div>
        )}
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'contractSigning') {
    return (
      <>
        {/* Full-screen preparing overlay — shown while generating contract + fetching signing URL */}
        {preparingContract && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex flex-col items-center justify-center gap-5 px-6">
            <svg className="w-10 h-10 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-white text-lg font-semibold text-center">
              {preparingPhase === 1 ? t('contractSigning.preparingPhase1') : t('contractSigning.preparingPhase2')}
            </p>
            <p className="text-white/60 text-sm text-center max-w-xs leading-relaxed">
              {t('contractSigning.preparingNote')}
            </p>
          </div>
        )}

        {/* Loading / error state — shown inside normal layout before iframe is ready */}
        {(loadingContract || contractError) && !preparingContract && (
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 overflow-hidden">
              {loadingContract ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-gray-500">{t('contractSigning.loading')}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <p className="text-sm text-red-600">{contractError}</p>
                  <button
                    type="button"
                    onClick={() => { setPreparingContract(true); setPreparingPhase(2); loadContractEmbed() }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-md
                               transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {t('contractSigning.retryBtn')}
                  </button>
                </div>
              )}
            </div>
          </main>
        )}

        {/* Full-viewport iframe — covers everything including Header once signing URL is ready */}
        {contractEmbedUrl && (
          <div className="fixed inset-0 z-50 bg-white">
            <iframe
              src={contractEmbedUrl}
              title="Contract signing"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        )}
      </>
    )
  }

  if (step === 'bankInfo') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <StepIndicator steps={BANK_STEPS} currentStep={1} />

        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('bankInfo.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t('bankInfo.subheading')}
          </p>
        </div>

        <div className="space-y-5">

          {/* Info notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-amber-800 leading-relaxed">{t('bankInfo.infoNotice')}</p>
          </div>

          {/* Void check upload — required for backend-bypass / manual-fallback path */}
          {plaidManualFallback && (
            <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('bankInfo.voidCheckLabel')} <span className="text-red-500">*</span>
              </label>

              {uploadedFiles.voidCheck ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">{uploadedFiles.voidCheck.filename}</p>
                    <p className="text-xs text-green-600">{t('plaidStub.voidCheckUploaded')}</p>
                  </div>
                  <label className="cursor-pointer text-xs text-green-700 underline flex-shrink-0">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                      className="sr-only"
                      onChange={e => { handleVoidCheckSelect(e.target.files?.[0] ?? null); clearBankError('voidCheck') }}
                    />
                    {t('personalInfo.tapToChange')}
                  </label>
                </div>
              ) : (
                <label className={[
                  'flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200',
                  bankErrors.voidCheck || uploadStatus.voidCheck.type === 'error'
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
                ].join(' ')}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                    className="sr-only"
                    onChange={e => { handleVoidCheckSelect(e.target.files?.[0] ?? null); clearBankError('voidCheck') }}
                  />
                  {uploadInFlight.voidCheck ? (
                    <>
                      <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-sm text-gray-500">{t('common.loading')}</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700">{t('personalInfo.uploadBtn')}</p>
                      <p className="text-xs text-gray-400">{t('personalInfo.uploadHint')}</p>
                    </>
                  )}
                </label>
              )}
              {(bankErrors.voidCheck || uploadStatus.voidCheck.type === 'error') && (
                <p className="mt-1.5 text-xs text-red-600">
                  {bankErrors.voidCheck || uploadStatus.voidCheck.message}
                </p>
              )}
            </div>
          )}

          {/* Manual input card */}
          <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-8">
            <div className="space-y-6">

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('bankInfo.labelAccountNumber')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={bankForm.accountNumberMasked}
                  onChange={(e) => { updateBank('accountNumberMasked', e.target.value.replace(/\D/g, '')); clearBankError('accountNumberMasked') }}
                  placeholder="000000000000"
                  className={bankInputClass(bankErrors.accountNumberMasked)}
                />
                {bankErrors.accountNumberMasked && <p className="text-xs text-red-500 mt-1.5">{bankErrors.accountNumberMasked}</p>}
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('bankInfo.labelConfirmAccount')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={bankForm.accountNumberMaskedConfirm}
                  onChange={(e) => { updateBank('accountNumberMaskedConfirm', e.target.value.replace(/\D/g, '')); clearBankError('accountNumberMaskedConfirm') }}
                  placeholder="000000000000"
                  className={bankInputClass(bankErrors.accountNumberMaskedConfirm)}
                />
                {bankErrors.accountNumberMaskedConfirm && <p className="text-xs text-red-500 mt-1.5">{bankErrors.accountNumberMaskedConfirm}</p>}
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('bankInfo.labelRouting')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={bankForm.routingNumber}
                  onChange={(e) => { updateBank('routingNumber', e.target.value.replace(/\D/g, '').slice(0, 9)); clearBankError('routingNumber') }}
                  placeholder="000000000"
                  className={bankInputClass(bankErrors.routingNumber)}
                />
                {bankErrors.routingNumber && <p className="text-xs text-red-500 mt-1.5">{bankErrors.routingNumber}</p>}
              </div>

            </div>
          </div>

          {/* Verification status messages */}
          {bankVerificationStatus === 'fail' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-800 leading-relaxed">{t('bankInfo.verifyFailMsg')}</p>
            </div>
          )}

          {bankVerificationStatus === 'caution' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">{t('bankInfo.verifyCautionMsg')}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setStep('plaid')
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('bankInfo.backBtn')}
            </button>

            {bankVerificationStatus === 'caution' ? (
              <button
                type="button"
                onClick={handleBankProceed}
                className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                           bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                           transition-colors duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {t('bankInfo.proceedBtn')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBankSubmit}
                disabled={bankVerifying}
                className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                           bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                           transition-colors duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/30
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {bankVerifying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('bankInfo.verifying')}
                  </>
                ) : (
                  <>
                    {t('bankInfo.confirmBtn')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      {lead && <ReviewFab onClick={() => setShowReviewModal(true)} />}
      {showReviewModal && <ReviewInfoModal lead={lead} marketingConsent={marketingConsent} onConsentChange={setMarketingConsent} onClose={() => setShowReviewModal(false)} />}
      </main>
    )
  }

  if (step === 'review') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">{t('accountReview.heading')}</h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t('accountReview.subheading')}
          </p>
        </div>

        <div className="space-y-5">
          {/* Two-column data card */}
          <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
              {/* Left column: Contact */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {t('accountReview.sectionContact')}
                </h2>
                <Row label={t('accountReview.labelName')}        value={lead ? `${lead.firstName} ${lead.lastName}` : ''} />
                <Row label={t('accountReview.labelEmail')}       value={lead?.email} />
                <Row label={t('accountReview.labelPhone')}       value={lead?.phone} />
                <Row label={t('accountReview.labelAccountType')} value={lead?.accountType} />
              </div>
              {/* Right column: Business */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 sm:mt-0">
                  {t('accountReview.sectionBusiness')}
                </h2>
                <Row label={t('accountReview.labelCompany')}  value={lead?.companyName} />
                <Row label={t('accountReview.labelBizType')}  value={lead?.businessType} />
                <Row label={t('accountReview.labelTitle')}    value={lead?.companyTitle} />
                <Row label={t('accountReview.labelTrucks')}   value={lead?.fleetSize != null ? String(lead.fleetSize) : ''} />
                <div className="flex gap-4 py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">{t('accountReview.labelDOT')}</span>
                    <p className="text-sm font-medium text-gray-900">{lead?.dot || '—'}</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">{t('accountReview.labelMC')}</span>
                    <p className="text-sm font-medium text-gray-900">{lead?.mc || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings — red background */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-800 leading-relaxed">
              {t('accountReview.bankNotice')}
            </p>
          </div>

          {/* Marketing consent */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary accent-primary cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
              {t('accountReview.marketingConsent')}
            </span>
          </label>

          <button
            type="button"
            onClick={() => { setModalConsent(marketingConsent); setShowModal(true) }}
            className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {t('accountReview.continueBtn')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Important Notice Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
               onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 space-y-5">

              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t('accountReview.modalTitle')}</h2>
                </div>
              </div>

              {/* Body */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('accountReview.modalBody')}
              </p>

              {/* Marketing consent (shown only if not already checked on the page) */}
              {!marketingConsent && (
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={modalConsent}
                      onChange={(e) => setModalConsent(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                    {t('accountReview.marketingConsent')}
                  </span>
                </label>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMarketingConsent(modalConsent)
                    setShowModal(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    // Plaid moved to the end of the flow — start with the simpler
                    // address step so customers build momentum before bank linking.
                    setStep('address')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-md transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  {t('accountReview.modalConfirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">

      {/* Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-ds-h1 font-bold text-gray-900">
          {t('otp.heading').split('iTrucking').map((part, i, arr) =>
            i < arr.length - 1
              ? <span key={i}>{part}<span className="text-red-600">iTrucking</span></span>
              : <span key={i}>{part}</span>
          )}
        </h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          {t('otp.subheading')}
        </p>
      </div>

      {/* OTP Card */}
      <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-lg mx-auto">

        {/* OTP input */}
        <div className="mb-8">
          {recoverySent && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700 text-center font-medium">{t('otp.recoverySent')}</p>
            </div>
          )}
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">{t('otp.enterCode')}</p>
          <input
            type="text"
            autoComplete="one-time-code"
            spellCheck={false}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); setCodePrefilled(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={[
              'w-full px-4 py-3 rounded-xl border-2 text-center text-xl font-bold tracking-widest uppercase',
              'text-gray-900 bg-white text-base',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200',
              error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-gray-400',
            ].join(' ')}
          />
          {error && (
            <p className="text-xs text-red-500 mt-2 text-center" role="alert">{error}</p>
          )}
          {codePrefilled && !error && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-green-600 mt-2 text-center">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('otp.prefillHint')}
            </p>
          )}
        </div>

        {/* Documents checklist */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-2">{t('otp.prepareTitle')}</p>
              <ul className="space-y-1.5">
                {[
                  t('otp.prepareItem1'),
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-amber-700">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {pendingMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 text-center">{pendingMessage}</p>
          </div>
        )}

        {/* Action button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                     bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                     transition-colors duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-primary/30
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('common.loading')}
            </>
          ) : (
            <>
              {t('otp.continueBtn')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>

        <div className="flex items-start gap-2.5 mt-5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-700 leading-relaxed">{t('otp.otpHint')}</p>
        </div>

      </div>

      {/* Invalid-code recovery modal — shown when OTP_INVALID_OR_USED */}
      {showRecoveryModal && (
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('otp.recoveryPlaceholder')}</label>
              <input
                type="email"
                autoComplete="email"
                autoFocus
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRequestNewCode()}
                placeholder={t('otp.recoveryPlaceholderEmail')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-400
                           text-gray-900 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleRequestNewCode}
                disabled={recoverySending || !recoveryEmail.trim()}
                className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                           bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                           transition-colors duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/30
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {recoverySending ? (
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
                onClick={() => setShowRecoveryModal(false)}
                className="w-full px-7 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700
                           rounded-md border border-gray-200 hover:border-gray-300 bg-white
                           transition-colors duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}


    </main>
  )
}
