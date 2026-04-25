import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'

export default function OtpVerification() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError(t('otp.errorIncomplete'))
      return
    }
    setLoading(true)
    // In production: validate OTP against backend here
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    navigate('/account-review')
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
