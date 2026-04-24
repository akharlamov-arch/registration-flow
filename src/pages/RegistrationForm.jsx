import { useState } from 'react'
import { useI18n } from '../context/I18nContext'
import ProgressBar from '../components/ProgressBar'
import FormField from '../components/FormField'

const TOTAL_STEPS = 1

// DS: focus:ring-2 focus:ring-primary/30 + 200ms transition
const inputClass = [
  'w-full px-4 py-3 text-sm border border-gray-200 rounded-xl',
  'text-ds-text placeholder:text-slate-400',
  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
  'transition-colors duration-200',
  'bg-white',
].join(' ')

export default function RegistrationForm() {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  // DS: loading state — show spinner → success
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = t('common.required')
    if (!form.email.trim()) {
      e.email = t('common.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t('common.invalidEmail')
    }
    if (!form.phone.trim()) e.phone = t('common.required')
    return e
  }

  const handleNext = async () => {
    const e = step === 1 ? validateStep1() : {}
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    } else {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  if (submitted) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-ds-md border border-gray-100
                        p-10 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-ds-text mb-3">{t('registration.success.title')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{t('registration.success.message')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

      {/* DS: heading 32px+ text-ds-h1, text-ds-text */}
      <div className="text-center mb-12">
        <h1 className="text-ds-h1 font-bold text-ds-text">
          {t('registration.heading')}
        </h1>
        <p className="text-blue-400 mt-3 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {t('registration.subheading')}
        </p>
      </div>

      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* DS: shadow-ds-md, rounded-2xl card */}
      <div className="bg-white rounded-2xl shadow-ds-md border border-gray-100 p-6 sm:p-10 max-w-2xl mx-auto">

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-ds-h2 font-semibold text-ds-text">{t('registration.step1.title')}</h2>
              <p className="text-sm text-blue-400 mt-1.5 leading-relaxed">{t('registration.step1.desc')}</p>
            </div>

            <div className="space-y-6">
              <FormField label={t('registration.step1.fullName')} required error={errors.fullName}>
                <input
                  type="text"
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder={t('registration.step1.fullNamePlaceholder')}
                  autoComplete="name"
                  className={inputClass}
                  aria-invalid={!!errors.fullName}
                />
              </FormField>

              <FormField label={t('registration.step1.email')} required error={errors.email}>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder={t('registration.step1.emailPlaceholder')}
                  autoComplete="email"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                />
              </FormField>

              <FormField label={t('registration.step1.phone')} required error={errors.phone}>
                <input
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder={t('registration.step1.phonePlaceholder')}
                  autoComplete="tel"
                  className={inputClass}
                  aria-invalid={!!errors.phone}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* NAV BUTTONS — DS: cursor-pointer, 200ms, CTA orange for registration */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-500
                       border border-gray-200 rounded-xl
                       hover:bg-gray-50 hover:border-gray-300 hover:text-ds-text
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/20
                       disabled:opacity-0 disabled:pointer-events-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t('common.back')}
          </button>

          {/* DS: CTA orange (#F97316) for registration submit — "delivery orange" */}
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white
                       bg-cta hover:bg-orange-500 rounded-xl shadow-ds-sm
                       transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-cta/30
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
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
            ) : step < TOTAL_STEPS ? (
              <>
                {t('common.next')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            ) : (
              t('common.submit')
            )}
          </button>
        </div>

      </div>
    </main>
  )
}

