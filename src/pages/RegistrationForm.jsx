import { useState } from 'react'
import { useI18n } from '../context/I18nContext'
import ProgressBar from '../components/ProgressBar'
import FormField from '../components/FormField'

const TOTAL_STEPS = 1  // Will grow as more steps are added

const inputClass = `
  w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-colors duration-200 placeholder:text-slate-400
`.trim()

export default function RegistrationForm() {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
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

  const handleNext = () => {
    const e = step === 1 ? validateStep1() : {}
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    } else {
      setSubmitted(true)
    }
  }

  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  if (submitted) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100
                        p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('registration.success.title')}</h2>
          <p className="text-slate-500 text-sm">{t('registration.success.message')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('registration.heading')}
        </h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          {t('registration.subheading')}
        </p>
      </div>

      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">

        {/* ===== STEP 1: Personal Information ===== */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">{t('registration.step1.title')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('registration.step1.desc')}</p>
            </div>

            <div className="space-y-5">
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

        {/* ===== NAV BUTTONS ===== */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600
                       border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300
                       transition-colors duration-200 cursor-pointer
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
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
                       bg-cta hover:bg-orange-500 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            {step < TOTAL_STEPS ? (
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
