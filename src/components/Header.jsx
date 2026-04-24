import { useI18n } from '../context/I18nContext'

// DS: EN / RU / UK / ES language options
const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
]

export default function Header() {
  const { lang, setLang } = useI18n()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-ds-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#/" className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" aria-label="iTrucking home">
          <img src="/registration-flow/logo.svg" alt="" className="h-8 w-auto" aria-hidden="true" />
          <span className="font-bold text-xl text-ds-text tracking-tight">iTrucking</span>
        </a>

        {/* Right controls */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Language selector */}
          <div className="relative flex items-center">
            <svg className="absolute left-2 w-4 h-4 text-slate-400 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" />
            </svg>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-sm font-medium text-ds-text bg-gray-50
                         border border-gray-200 rounded-lg cursor-pointer
                         hover:border-primary hover:bg-primary/5
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                         transition-colors duration-200 appearance-none"
              aria-label="Select language"
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <a
            href="tel:+19162694606"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary
                       hover:text-secondary transition-colors duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30 rounded"
            aria-label="Call us at (916) 269-4606"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372
                   c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97
                   1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143
                   c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963
                   3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="hidden sm:block">(916) 269-4606</span>
          </a>

        </div>
      </div>
    </header>
  )
}
