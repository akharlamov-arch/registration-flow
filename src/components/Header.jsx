import { useI18n } from '../context/I18nContext'
import logoUrl from '../assets/logo.svg'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
]

// Shared button-like style — used for both language select wrapper and phone link
const controlClass = [
  'inline-flex items-center gap-1.5 px-2.5 py-1.5',
  'text-sm font-medium text-gray-700 bg-gray-50',
  'border border-gray-200 rounded-lg',
  'hover:border-gray-400 hover:bg-gray-100',
  'transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-gray-300',
].join(' ')

export default function Header() {
  const { lang, setLang } = useI18n()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-ds-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16">

        {/* 3-column layout: left=lang, center=logo, right=phone */}
        <div className="flex items-center h-full">

          {/* LEFT — Language selector */}
          <div className="flex-1 flex items-center justify-start">
            <div className="relative flex items-center">
              <svg className="absolute left-2 w-4 h-4 text-gray-400 pointer-events-none"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" />
              </svg>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={[
                  'pl-7 pr-2 py-1.5 text-sm font-medium text-gray-700 bg-gray-50',
                  'border border-gray-200 rounded-lg cursor-pointer',
                  'hover:border-gray-400 hover:bg-gray-100',
                  'focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400',
                  'transition-colors duration-200 appearance-none',
                ].join(' ')}
                aria-label="Select language"
              >
                {LANGUAGES.map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CENTER — Logo */}
          <div className="flex-1 flex items-center justify-center">
            <a href="#/" aria-label="iTrucking home" className="flex items-center focus:outline-none">
              <img
                src={logoUrl}
                alt="iTrucking"
                className="h-[22px] sm:h-[26px] w-auto"
              />
            </a>
          </div>

          {/* RIGHT — Phone */}
          <div className="flex-1 flex items-center justify-end">
            <a
              href="tel:+19162694606"
              className={controlClass}
              aria-label="Call (916) 269-4606"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="hidden sm:inline">(916) 269-4606</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  )
}
