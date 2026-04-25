import { useState } from 'react'
import { useI18n } from '../context/I18nContext'

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
  companyMC: 'MC-920184',
  usesFuelProgram: 'Yes',
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

  if (step === 'review') {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-5">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
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
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-xl shadow-ds-sm
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

              {/* Marketing consent (shown only if not already checked) */}
              {!marketingConsent && (
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
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { /* TODO: proceed to next step */ setShowModal(false) }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white
                             bg-primary hover:bg-secondary rounded-xl transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  {t('accountReview.modalConfirm')}
                </button>
                <a
                  href="tel:+19162694606"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold
                             text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-5">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
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
                     bg-primary hover:bg-secondary rounded-xl shadow-ds-sm
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
