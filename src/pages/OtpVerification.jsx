import { useState, useRef } from 'react'
import { useI18n } from '../context/I18nContext'
import StepIndicator from '../components/StepIndicator'

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep('personalInfo')
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
              {t('common.nextStep')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </main>
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
      if (!personalForm.dlFile) errs.dlFile = t('personalInfo.errorDlFileRequired')
      if (Object.keys(errs).length) {
        setPersonalErrors(errs)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
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
                  onChange={e => { updatePersonal('dlFile', e.target.files[0] ?? null); setPersonalErrors(prev => { const n = { ...prev }; delete n.dlFile; return n }) }}
                />
                {personalForm.dlFile ? (
                  <>
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">{personalForm.dlFile.name}</p>
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // next step TBD
    }

    const AddressPreview = ({ form }) => (
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        {form.street1}{form.street2 ? `, ${form.street2}` : ''}, {form.city}, {form.state} {form.zip}
      </p>
    )

    const radioBase = 'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors duration-200'
    const radioSelected = 'border-primary bg-blue-50/40'
    const radioIdle = 'border-gray-200 hover:border-gray-300 bg-white'

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
