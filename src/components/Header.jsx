import { useI18n } from '../context/I18nContext'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
]

export default function Header() {
  const { lang, setLang } = useI18n()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#/" className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" aria-label="iTrucking home">
          <img src="/registration-flow/logo.svg" alt="" className="h-8 w-auto" aria-hidden="true" />
          <span className="font-bold text-xl text-slate-900 tracking-tight">iTrucking</span>
        </a>

        {/* Right controls */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Language selector */}
          <div className="relative flex items-center">
            {/* Globe icon */}
            <svg
              className="absolute left-2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12
                   21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515
                   3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843
                   4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686
                   0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0
                   0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113
                   1.157-4.418"
              />
            </svg>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-sm font-medium text-slate-900 bg-gray-50
                         border border-gray-200 rounded-lg cursor-pointer hover:border-primary
                         focus:outline-none focus:ring-2 focus:ring-primary/30
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
            className="flex items-center gap-1.5 text-sm font-medium text-primary
                       hover:text-secondary transition-colors duration-200 cursor-pointer"
            aria-label="Call us at (916) 269-4606"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091
                   l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0
                   01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963
                   3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <span className="hidden sm:block">(916) 269-4606</span>
          </a>

        </div>
      </div>
    </header>
  )
}
