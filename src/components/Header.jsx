// Site header (SITE-CHROME-01) — the tutorials page's header
// (src/pages/tutorials/tutorials.css, `.header`), rebuilt in Tailwind for every
// other page: logo on the left, language and theme on the right. The language
// stays a dropdown with all four app languages rather than the tutorials'
// RU/EN buttons. The support phone moved to the footer.
//
// The tutorials page renders it too, with two overrides: `lang`/`onLangChange`
// (it shows RU before any language is chosen, without persisting it) and
// `extra` (its PWA install button, placed before the theme toggle).

import { useI18n } from '../context/I18nContext'
import { useTheme } from '../context/ThemeContext'
import logoLight from '../assets/tutorials/logos/Logo_for_white_theme.png'
import logoDark from '../assets/tutorials/logos/Logo_for_dark_theme.png'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
]

// Shared look of the square header buttons (theme toggle, tutorials' install).
export const headerIconBtnCls =
  'w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer ' +
  'hover:bg-primary transition-colors duration-ds-slow ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'

export default function Header({ lang: langOverride, onLangChange, extra = null }) {
  const { lang: appLang, setLang, t } = useI18n()
  const lang = langOverride ?? appLang
  const changeLang = onLangChange ?? setLang
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <header className="site-header sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-6 py-4 md:px-8 md:py-6 flex items-center justify-between gap-3 min-[481px]:gap-4 md:gap-8">

        {/* Logo — like the tutorials page, it opens the company site. Never
            "#/": that is the new-applicant form, where a customer who hit the
            logo by accident used to land. */}
        <a
          href="https://itrucking.pro/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center min-w-0"
        >
          <img
            src={dark ? logoDark : logoLight}
            alt="iTrucking"
            className="h-[22px] min-[481px]:h-6 md:h-8 w-auto max-w-full object-contain object-left"
          />
        </a>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Language — the tutorials' switch container, holding a dropdown. */}
          <div className="relative flex items-center bg-gray-100 rounded-lg p-1">
            <svg className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" />
            </svg>
            <select
              value={lang}
              onChange={(e) => changeLang(e.target.value)}
              aria-label={t('header.language')}
              className="h-[33px] pl-7 pr-7 rounded-md bg-white text-primary text-sm font-medium shadow-ds-sm cursor-pointer
                         font-[Instrument_Sans,sans-serif] hover:text-secondary transition-colors duration-ds-slow
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <svg className="absolute right-3 w-3.5 h-3.5 text-gray-500 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {extra}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t(dark ? 'header.themeLight' : 'header.themeDark')}
            title={t(dark ? 'header.themeLight' : 'header.themeDark')}
            className={headerIconBtnCls}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
