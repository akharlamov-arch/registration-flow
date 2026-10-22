// Tutorials knowledge base (TUTORIALS-PAGE-01) — a port of the static site
// tutorial.itrucking.pro, kept identical in markup, styles and behaviour.
// Texts come from content.js (RU/EN only) rather than t(): the page shows RU
// or EN even when the app language is UK/ES, and RU before any choice.
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { STRINGS, TUTORIALS, asset } from './content'
import TutorialModal from './TutorialModal'
import InstallModal, { useInstallPrompt } from './InstallModal'
import './tutorials.css'

const LANG_KEY = 'itrucking-lang'
const THEME_KEY = 'itrucking-theme'
const EXCLUDED_RECOMMENDATION_ID = 7 // "How to set Unit number and PIN"

const CATEGORIES = [
  { id: 'all' },
  { id: 'pump-price', icon: 'categories/iTrucking_Pro.png' },
  { id: 'onramp', icon: 'categories/Onramp.png' },
  { id: 'efs-cards', emoji: '💳' },
  { id: 'tire-discount', emoji: '🚛' },
]

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore storage failures (e.g. private mode / blocked storage)
  }
}

// The language is shared with the rest of the app (itrucking-lang), mapped to
// the two languages the tutorials exist in. Until the visitor has chosen one
// anywhere, the page opens in RU like the original, without persisting it.
function usePageLang() {
  const { lang, setLang } = useI18n()
  const [chosen, setChosen] = useState(() => Boolean(safeGet(LANG_KEY)))
  const pageLang = !chosen || lang === 'ru' || lang === 'uk' ? 'ru' : 'en'
  const choose = (code) => {
    setLang(code)
    setChosen(true)
  }
  return [pageLang, choose]
}

function pluralizeSteps(count, lang) {
  if (lang === 'en') return count === 1 ? 'step' : 'steps'
  const cases = [2, 0, 1, 1, 1, 2]
  const titles = ['шаг', 'шага', 'шагов']
  if (count % 100 > 4 && count % 100 < 20) return titles[2]
  return titles[cases[Math.min(count % 10, 5)]]
}

// Two random tutorials from the same category; a category with no siblings
// falls back to the tire-discount ones.
function pickRecommendations(id) {
  const current = TUTORIALS.find((t) => t.id === id)
  if (!current) return []
  const sameCategory = TUTORIALS.filter((t) =>
    t.category === current.category && t.id !== id && t.id !== EXCLUDED_RECOMMENDATION_ID)
  if (sameCategory.length >= 2) return sameCategory.sort(() => Math.random() - 0.5).slice(0, 2)
  if (sameCategory.length === 1) return sameCategory
  return TUTORIALS.filter((t) =>
    t.category === 'tire-discount' && t.id !== id && t.id !== EXCLUDED_RECOMMENDATION_ID).slice(0, 2)
}

// The original's <head>: tab icons, home-screen icon and browser theme colour,
// swapped in while the page is mounted.
function useTutorialsHead() {
  useEffect(() => {
    const added = []
    const add = (tag, attrs) => {
      const el = document.createElement(tag)
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
      document.head.appendChild(el)
      added.push(el)
    }
    const icon = document.querySelector('link[rel="icon"]')
    const prevIcon = icon && { href: icon.getAttribute('href'), type: icon.getAttribute('type') }
    if (icon) {
      icon.setAttribute('href', asset('icons/favicon.ico'))
      icon.setAttribute('type', 'image/x-icon')
    }
    add('link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: asset('icons/favicon-32x32.png') })
    add('link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: asset('icons/favicon-16x16.png') })
    add('link', { rel: 'apple-touch-icon', sizes: '180x180', href: asset('icons/apple-touch-icon.png') })
    add('meta', { name: 'theme-color', content: '#0066ff' })
    add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' })
    add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' })
    add('meta', { name: 'apple-mobile-web-app-title', content: 'iTrucking' })
    return () => {
      added.forEach((el) => el.remove())
      if (icon) {
        icon.setAttribute('href', prevIcon.href)
        icon.setAttribute('type', prevIcon.type)
      }
    }
  }, [])
}

export default function TutorialsPage() {
  const [lang, chooseLang] = usePageLang()
  const s = (key) => STRINGS[lang][key]
  const categoryName = (category) => s(`category-${category}`) || category

  const [theme, setTheme] = useState(() => safeGet(THEME_KEY) || 'light')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [modal, setModal] = useState({ id: null, open: false, recommendations: [] })
  const [lightbox, setLightbox] = useState({ src: '', open: false })
  const install = useInstallPrompt()
  const timers = useRef([])

  useTutorialsHead()

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    safeSet(THEME_KEY, next)
  }

  const openTutorial = (id) => setModal({ id, open: true, recommendations: pickRecommendations(id) })
  const closeModal = () => setModal((m) => ({ ...m, open: false }))
  const navigateTo = (id) => {
    closeModal()
    later(() => openTutorial(id), 300)
  }

  const openLightbox = (src) => setLightbox({ src, open: true })
  const closeLightbox = () => {
    setLightbox((l) => ({ ...l, open: false }))
    later(() => setLightbox((l) => (l.open ? l : { ...l, src: '' })), 200)
  }

  // Esc closes the tutorial and the lightbox together, as on the original.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setModal((m) => ({ ...m, open: false }))
      setLightbox((l) => (l.open ? { ...l, open: false } : l))
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Page scroll stays locked while any overlay is open (the original unlocked
  // it when the lightbox closed even with a tutorial still open).
  const locked = modal.open || lightbox.open || install.open
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [locked])

  // Overscroll areas show <body>; paint it like the original's body.
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : '#fafafa'
    return () => { document.body.style.backgroundColor = prev }
  }, [theme])

  // Footer placeholders link to "#": jump to the top like the original instead
  // of letting HashRouter route to the lead form.
  const toTop = (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
  }

  const term = query.toLowerCase()
  const filtered = TUTORIALS.filter((t) =>
    (category === 'all' || t.category === category) &&
    (term === '' || t.title[lang].toLowerCase().includes(term) || t.description[lang].toLowerCase().includes(term)))
  const hasQuery = query.trim().length > 0

  return (
    <div className="tutorials-page" data-theme={theme}>
      <header className="header">
        <div className="header-container">
          <a href="https://itrucking.pro/" className="logo" target="_blank" rel="noopener noreferrer">
            <div className="logo-icon">
              <img src={asset('logos/Logo_for_white_theme.png')} alt="iTrucking" className="logo-img logo-light" />
              <img src={asset('logos/Logo_for_dark_theme.png')} alt="iTrucking" className="logo-img logo-dark" />
            </div>
          </a>
          <div className="header-controls">
            <div className="lang-switcher">
              {['ru', 'en'].map((code) => (
                <button key={code} className={`lang-btn${lang === code ? ' active' : ''}`} onClick={() => chooseLang(code)}>
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button className={`install-btn${install.visible ? ' show' : ''}`} title={s('install-app')} onClick={install.install}>📱</button>
            <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
          </div>
        </div>
      </header>

      <section className="search-section">
        <div className="search-header">
          <h1 dangerouslySetInnerHTML={{ __html: s('main-title') }} />
          <p>{s('main-subtitle')}</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder={s('search-placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: hasQuery ? 'none' : 'block' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <svg className="search-icon search-clear-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: hasQuery ? 'block' : 'none' }} onClick={() => setQuery('')}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-title">{s('categories-title')}</div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`category-btn${category === c.id ? ' active' : ''}`} data-category={c.id} onClick={() => setCategory(c.id)}>
              {c.id === 'all' ? s('category-all') : (
                <>
                  {c.icon && <img src={asset(c.icon)} alt="" className="category-icon" />}
                  {c.emoji && `${c.emoji} `}
                  <span>{s(`category-${c.id}`)}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="tutorials-section">
        <div className="tutorials-grid">
          {filtered.map((t) => (
            <div className="tutorial-card" key={t.id} onClick={() => openTutorial(t.id)}>
              <div className="tutorial-image-wrapper">
                <img src={t.mainImage[lang]} alt={t.title[lang]} className="tutorial-card-image" />
              </div>
              <div className="tutorial-content">
                <div className="tutorial-meta">
                  <span className="tutorial-badge">{categoryName(t.category)}</span>
                </div>
                <h3 className="tutorial-title">{t.title[lang]}</h3>
                <p className="tutorial-description">{t.description[lang]}</p>
                <div className="tutorial-stats">
                  {/* One text node each, as in the original: split JSX text
                      shapes a fraction of a pixel differently. */}
                  <span className="tutorial-stat">{`📖 ${t.readTime} ${s('read-time')}`}</span>
                  <span className="tutorial-stat">{`✓ ${t.stepsCount} ${pluralizeSteps(t.stepsCount, lang)}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`no-results${filtered.length > 0 ? ' hidden' : ''}`}>
          <h3>{s('no-results')}</h3>
          <p>{s('no-results-text')}</p>
        </div>
      </section>

      <TutorialModal
        tutorial={TUTORIALS.find((t) => t.id === modal.id)}
        open={modal.open}
        lang={lang}
        s={s}
        categoryName={categoryName}
        recommendations={modal.recommendations}
        onClose={closeModal}
        onNavigate={navigateTo}
        onZoom={openLightbox}
      />

      <div className={`image-lightbox${lightbox.open ? ' active' : ''}`} onClick={closeLightbox}>
        <button className="image-lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox() }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <img src={lightbox.src || undefined} alt="" onClick={(e) => e.stopPropagation()} />
      </div>

      <InstallModal open={install.open} kind={install.kind} onClose={install.close} s={s} />

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{s('footer-contact')}</h3>
            <div className="footer-links">
              <a href="tel:+19162694606" className="footer-link">
                <span>{s('footer-main-phone')}</span><br />
                <small>+1 (916) 269-4606</small>
              </a>
              <a href="tel:+19162694606,3" className="footer-link">
                <span>{s('footer-accounting-phone')}</span><br />
                <small>+1 (916) 269-4606 ext. 3</small>
              </a>
              <a href="tel:+19162340257" className="footer-link">
                <span>{s('footer-tire-phone')}</span><br />
                <small>+1 (916) 234-0257</small>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>{s('footer-departments')}</h3>
            <div className="footer-links">
              <a href="mailto:info@itruckingservices.com" className="footer-link">
                <span>{s('footer-general')}</span><br />
                <small>info@itruckingservices.com</small>
              </a>
              <a href="mailto:fuel@itrucking.org" className="footer-link">
                <span>{s('footer-fuel')}</span><br />
                <small>fuel@itrucking.org</small>
              </a>
              <a href="mailto:accounting@itrucking.org" className="footer-link">
                <span>{s('footer-accounting')}</span><br />
                <small>accounting@itrucking.org</small>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>{s('footer-resources')}</h3>
            <div className="footer-links">
              <a href="https://www.itruckingservices.com" target="_blank" rel="noopener noreferrer" className="footer-link">www.itruckingservices.com</a>
              <a href="#" className="footer-link" onClick={toTop}>{s('footer-privacy')}</a>
              <a href="#" className="footer-link" onClick={toTop}>{s('footer-terms')}</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>{s('footer-address')}</h3>
            <div className="footer-links">
              <p className="footer-link" style={{ cursor: 'default' }}>1229 Pleasant Grove Blvd<br />Roseville, CA 95678</p>
            </div>
          </div>
          <div className="footer-section">
            <h3>{s('footer-social')}</h3>
            <div className="footer-social-buttons">
              <a href="https://www.instagram.com/itrucking.inc/" target="_blank" rel="noopener noreferrer" className="social-button instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/itruckingservicesinc/" target="_blank" rel="noopener noreferrer" className="social-button facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 <span>{s('footer-copyright')}</span></p>
        </div>
      </footer>
    </div>
  )
}
