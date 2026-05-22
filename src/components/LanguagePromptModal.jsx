import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../context/I18nContext'

const STORAGE_KEY = 'itrucking-lang'

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'es', label: 'Español', shortLabel: 'ES' },
  { code: 'uk', label: 'Українська', shortLabel: 'UK' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU' },
]

function safeGetStoredLang() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export default function LanguagePromptModal() {
  const { setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const firstFocusRef = useRef(null)

  const closeWithEnglish = () => {
    setLang('en')
    setOpen(false)
  }

  const chooseLang = (code) => {
    setLang(code)
    setOpen(false)
  }

  useEffect(() => {
    const existing = safeGetStoredLang()
    if (!existing) setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeWithEnglish()
    }
    window.addEventListener('keydown', onKeyDown)

    const focusTimer = window.setTimeout(() => {
      firstFocusRef.current?.focus?.()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeWithEnglish}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-prompt-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-ds-xl border border-gray-100 p-6 sm:p-8 animate-fadeIn"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="language-prompt-title" className="text-lg sm:text-xl font-semibold text-gray-900">
              {t('languagePrompt.title')}
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {t('languagePrompt.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={closeWithEnglish}
            className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label={t('languagePrompt.closeAria')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {LANGUAGE_OPTIONS.map((opt, idx) => (
            <button
              key={opt.code}
              type="button"
              ref={idx === 0 ? firstFocusRef : undefined}
              onClick={() => chooseLang(opt.code)}
              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
              <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700">{opt.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={closeWithEnglish}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-md shadow-ds-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Continue in English
          </button>
        </div>
      </div>
    </div>
  )
}
