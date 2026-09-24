// DS React stack guideline: lazy() for routes — code splitting
import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './context/I18nContext'
import Header from './components/Header'
import LanguagePromptModal from './components/LanguagePromptModal'

const LeadForm         = lazy(() => import('./pages/LeadForm'))
const OtpVerification  = lazy(() => import('./pages/OtpVerification'))
const PostSigning      = lazy(() => import('./pages/PostSigning'))
const RelinkPage       = lazy(() => import('./pages/RelinkPage'))
const PortalPage       = lazy(() => import('./pages/PortalPage'))
const AttentionPage    = lazy(() => import('./pages/attention/AttentionPage'))
const PortalSigningReturn = lazy(() => import('./pages/PortalSigningReturn'))

function TitleUpdater() {
  const { t } = useI18n()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith('/portal') || location.pathname.startsWith('/attention')) {
      document.title = t('portal.title')
      return
    }
    const isReg = location.pathname.startsWith('/registration') || location.pathname.startsWith('/post-signing')
    document.title = isReg ? t('registration.title') : t('lead.title')
  }, [location.pathname, t])

  return null
}

// DS: animate-pulse skeleton while lazy chunk loads
function PageFallback() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-2/3 mx-auto" />
        <div className="h-4 bg-gray-100 rounded-xl w-1/2 mx-auto" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    </main>
  )
}

// Pages that render inside the Zoho signing frame get no site chrome: the frame
// already sits over the portal, and a second header (or the language prompt)
// inside it would flash before the portal closes the frame.
const FRAMED_ROUTES = ['/portal-signing-return']

function AppShell() {
  const { pathname } = useLocation()
  const framed = FRAMED_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen bg-white font-sans">
      <TitleUpdater />
      {!framed && <Header />}
      {!framed && <LanguagePromptModal />}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<LeadForm />} />
          <Route path="/registration" element={<OtpVerification />} />
          <Route path="/post-signing" element={<PostSigning />} />
          <Route path="/relink" element={<RelinkPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/attention" element={<AttentionPage />} />
          <Route path="/portal-signing-return" element={<PortalSigningReturn />} />
          {/* Retired URLs, kept so links already shared with testers still land
              somewhere (PORTAL-UI-01). `replace` keeps them out of history. A
              redirect drops router state, so the /portal gates navigate to
              /attention directly rather than through these. */}
          <Route path="/attantion" element={<Navigate to="/attention" replace />} />
          <Route path="/portal-demo" element={<Navigate to="/attention" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </I18nProvider>
  )
}
