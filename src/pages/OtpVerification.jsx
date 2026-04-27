import { useState } from 'react'
import { useI18n } from '../context/I18nContext'
import StepIndicator from '../components/StepIndicator'

// Placeholder — replace with real data from backend/context
const PLACEHOLDER = {
  firstName: 'Michael',
  lastName: 'Torres',
  email: 'michael.torres@translogixfreight.com',
  phone: '+1 (916) 555-0184',
  accountType: 'Business',
  companyName: 'TransLogix Freight LLC',
  businessType: 'LLC',
  companyTitle: 'Owner / Operator',
  companyTrucks: '12',
  companyDOT: '3847291',
  companyMC: '920184',
  usesFuelProgram: 'Yes',
  plaidVerificationStatus: 'Verified ✓',
  plaidSelectedAccount: 'Checking ••••4521',
  plaidBankName: 'Bank of America',
  plaidAccountType: 'Business Checking',
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 break-all">{value}</span>
    </div>
  )
}

export default function OtpVerification() {
  const { t } = useI18n()
  const [step, setStep] = useState('otp')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalConsent, setModalConsent] = useState(false)
  const [bankForm, setBankForm] = useState({ accountNumber: '', confirmAccountNumber: '', routingNumber: '', bankScreenshot: null })
  const [bankErrors, setBankErrors] = useState({})
  const [addressForm, setAddressForm] = useState({ street1: '', street2: '', city: '', state: '', zip: '', mailingOption: '' })
  const [addressErrors, setAddressErrors] = useState({})

  const updateBank = (key, val) => setBankForm(prev => ({ ...prev, [key]: val }))
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
    if (Object.keys(errs).length) {
      setAddressErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (addressForm.mailingOption === 'different') {
      setStep('mailingAddress')
    } else {
      setStep('addressDone') // next step — TBD
    }
  }

  const BANK_STEPS = [
    {
      label: t('bankInfo.stepLabel'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
  ]

  const handleBankSubmit = () => {
    const errs = {}
    if (!bankForm.accountNumber.trim()) {
      errs.accountNumber = t('bankInfo.errorAccountRequired')
    } else if (!/^\d+$/.test(bankForm.accountNumber)) {
      errs.accountNumber = t('bankInfo.errorAccountDigits')
    }
    if (bankForm.confirmAccountNumber !== bankForm.accountNumber) {
      errs.confirmAccountNumber = t('bankInfo.errorAccountMismatch')
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('plaid')
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError(t('otp.errorIncomplete'))
      return
    }
    setLoading(true)
    // In production: validate OTP against backend here
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('review')
  }

  if (step === 'plaid') {
    return (
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
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 10h18v2H3v-2zm2-5h14v3H5V5zm-1 9h16v6H4v-6zm6 1h4v4h-4v-4z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
                {t('plaidStub.point1')}
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

            {/* Mismatch warning */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">{t('plaidStub.mismatchWarning')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('bankInfo') }}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
                         text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('plaidStub.backBtn')}
            </button>
            <button
              type="button"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('address') }}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('plaidStub.button')}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (step === 'address') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
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
                <input
                  type="text"
                  autoComplete="address-level1"
                  value={addressForm.state}
                  onChange={e => { updateAddress('state', e.target.value.toUpperCase().slice(0, 2)); clearAddressError('state') }}
                  placeholder={t('address.placeholderState')}
                  className={addressInputClass(addressErrors.state)}
                />
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
                        : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100/60',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="mailingOption"
                      value={opt.value}
                      checked={addressForm.mailingOption === opt.value}
                      onChange={() => { updateAddress('mailingOption', opt.value); clearAddressError('mailingOption') }}
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
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
              {t('address.backBtn')}
            </button>
            <button
              type="button"
              onClick={handleAddressSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                         bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                         transition-colors duration-200 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {t('address.nextBtn')}
            </button>
          </div>
        </div>
      </main>
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
                  value={bankForm.accountNumber}
                  onChange={(e) => { updateBank('accountNumber', e.target.value.replace(/\D/g, '')); clearBankError('accountNumber') }}
                  placeholder="000000000000"
                  className={bankInputClass(bankErrors.accountNumber)}
                />
                {bankErrors.accountNumber && <p className="text-xs text-red-500 mt-1.5">{bankErrors.accountNumber}</p>}
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('bankInfo.labelConfirmAccount')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={bankForm.confirmAccountNumber}
                  onChange={(e) => { updateBank('confirmAccountNumber', e.target.value.replace(/\D/g, '')); clearBankError('confirmAccountNumber') }}
                  placeholder="000000000000"
                  className={bankInputClass(bankErrors.confirmAccountNumber)}
                />
                {bankErrors.confirmAccountNumber && <p className="text-xs text-red-500 mt-1.5">{bankErrors.confirmAccountNumber}</p>}
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

          {/* Confirm with Plaid button */}
          <button
            type="button"
            onClick={handleBankSubmit}
            className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-md shadow-ds-sm
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {t('bankInfo.confirmBtn')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
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
                <Row label={t('accountReview.labelName')}        value={`${PLACEHOLDER.firstName} ${PLACEHOLDER.lastName}`} />
                <Row label={t('accountReview.labelEmail')}       value={PLACEHOLDER.email} />
                <Row label={t('accountReview.labelPhone')}       value={PLACEHOLDER.phone} />
                <Row label={t('accountReview.labelAccountType')} value={PLACEHOLDER.accountType} />
              </div>
              {/* Right column: Business */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-6 sm:mt-0">
                  {t('accountReview.sectionBusiness')}
                </h2>
                <Row label={t('accountReview.labelCompany')}  value={PLACEHOLDER.companyName} />
                <Row label={t('accountReview.labelBizType')}  value={PLACEHOLDER.businessType} />
                <Row label={t('accountReview.labelTitle')}    value={PLACEHOLDER.companyTitle} />
                <Row label={t('accountReview.labelTrucks')}   value={PLACEHOLDER.companyTrucks} />
                <div className="flex gap-4 py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">{t('accountReview.labelDOT')}</span>
                    <p className="text-sm font-medium text-gray-900">{PLACEHOLDER.companyDOT}</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-400">{t('accountReview.labelMC')}</span>
                    <p className="text-sm font-medium text-gray-900">{PLACEHOLDER.companyMC}</p>
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

          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-800 leading-relaxed">
              {t('accountReview.errorNotice')}{' '}
              <a href="tel:+19162694606" className="font-semibold whitespace-nowrap hover:underline">
                (916) 269-4606
              </a>
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
                    setStep('bankInfo')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-md transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  {t('accountReview.modalConfirm')}
                </button>
                <a
                  href="tel:+19162694606"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold
                             text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {t('accountReview.modalContact')}
                </a>
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
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">{t('otp.enterCode')}</p>
          <input
            type="text"
            autoComplete="one-time-code"
            spellCheck={false}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError('') }}
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
                  t('otp.prepareItem2'),
                  t('otp.prepareItem3'),
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

        {/* Continue button */}
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

        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          {t('otp.noCode')}
        </p>
      </div>
    </main>
  )
}
