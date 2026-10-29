// DS React stack guideline: lazy() for routes — code splitting
import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './context/I18nContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import SiteFooter, { SiteFooterContext } from './components/SiteFooter'
import LanguagePromptModal from './components/LanguagePromptModal'
import RenameRoute from './components/RenameRoute'
import { SURFACE, PORTAL_HOME } from './config/surfaces'
import { validateSession, ATTENTION_TOKEN_KEY } from './api/portal'

const LeadForm         = lazy(() => import('./pages/LeadForm'))
const OtpVerification  = lazy(() => import('./pages/OtpVerification'))
const PostSigning      = lazy(() => import('./pages/PostSigning'))
const RelinkPage       = lazy(() => import('./pages/RelinkPage'))
const AttentionPage    = lazy(() => import('./pages/attention/AttentionPage'))
const TutorialsApp     = lazy(() => import('./pages/tutorials/app/App'))

function titleKey(pathname) {
  if (pathname.startsWith('/tutorials')) return 'tutorials.title'
  if (SURFACE === 'portal' || pathname.startsWith('/portal') || pathname.startsWith('/attention')) {
    return 'portal.title'
  }
  if (pathname.startsWith('/setup') || pathname.startsWith('/post-signing')) return 'registration.title'
  return 'lead.title'
}

function TitleUpdater() {
  const { t } = useI18n()
  const location = useLocation()

  useEffect(() => {
    document.title = t(titleKey(location.pathname))
  }, [location.pathname, t])

  return null
}

// The route tables, one per host (src/config/surfaces.js). A one-host build
// mounts both, the portal at #/portal. A route of the other host never reaches
// these: main.jsx sends it there first.

// Onboarding: registration.itrucking.pro.
const onboardingRoutes = (
  <>
    <Route path="/" element={<LeadForm />} />
    <Route path="/setup" element={<OtpVerification />} />
    <Route path="/post-signing" element={<PostSigning />} />
    <Route path="/relink" element={<RelinkPage />} />
    {/* Its name until PUBLIC-HOSTS-02: OTP e-mails and approval links already
        sent carry it, with their ?code=. */}
    <Route path="/registration" element={<RenameRoute to="/setup" />} />
  </>
)

// The customer portal and the tutorials: portal.itrucking.pro.
const portalRoutes = (
  <>
    <Route path={PORTAL_HOME} element={<AttentionPage />} />
    <Route
      path="/tutorials/*"
      element={<RequirePortalSession><TutorialsApp /></RequirePortalSession>}
    />
    {/* The portal's earlier names (PORTAL-UI-01, PUBLIC-HOSTS-02), kept for
        links already shared. */}
    {['/attention', '/attantion', '/portal-demo', '/portal']
      .filter((path) => path !== PORTAL_HOME)
      .map((path) => <Route key={path} path={path} element={<RenameRoute to={PORTAL_HOME} />} />)}
  </>
)

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

// The tutorials are for signed-in customers only (TUTORIALS-AUTH-01). The same
// check the portal makes on a direct visit: no stored session, or one the
// server no longer accepts (or cannot be asked about), goes to the portal's
// sign-in at PORTAL_HOME — `replace`, so Back does not bounce through here
// again. Signing in then lands on the portal overview, like any sign-in.
// Checked once on entering #/tutorials, not on moves inside it.
function RequirePortalSession({ children }) {
  const [status, setStatus] = useState(() =>
    sessionStorage.getItem(ATTENTION_TOKEN_KEY) ? 'checking' : 'signedOut')

  useEffect(() => {
    const token = sessionStorage.getItem(ATTENTION_TOKEN_KEY)
    if (!token) return
    let cancelled = false
    validateSession(token)
      .then(({ ok, data }) => ok && data?.success)
      .catch(() => false)
      .then((valid) => {
        if (cancelled) return
        if (!valid) sessionStorage.removeItem(ATTENTION_TOKEN_KEY)
        setStatus(valid ? 'signedIn' : 'signedOut')
      })
    return () => { cancelled = true }
  }, [])

  if (status === 'signedOut') return <Navigate to={PORTAL_HOME} replace />
  if (status === 'checking') return <PageFallback />
  return children
}

// The portal's signing return is not a route here: Zoho refuses a `#` in a
// redirect URL, so it is the static public/portal-signing-return.html.
function AppShell() {
  // The tutorials knowledge base is the tutorial.itrucking.pro React app
  // (src/pages/tutorials/) with its own footer and RU/EN content; it renders
  // the app header itself, so it gets neither the app header and footer here
  // nor the first-visit language prompt. Every other page
  // gets the site header modelled on it (SITE-CHROME-01). The site footer is
  // for the signed-in customer portal only — a page opts in with
  // `useSiteFooter`, and only AttentionPage does, once signed in
  // (ATTENTION-LOGIN-NO-FOOTER-01). The registration pages (lead form,
  // registration, post-signing, relink) stay free of it so nothing pulls an
  // applicant away mid-flow. The column layout keeps it at the bottom of a
  // short page.
  const { pathname } = useLocation()
  const standalone = pathname.startsWith('/tutorials')
  const [withFooter, setWithFooter] = useState(false)

  return (
    <SiteFooterContext.Provider value={setWithFooter}>
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <TitleUpdater />
        {!standalone && <Header />}
        {!standalone && <LanguagePromptModal />}
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {SURFACE !== 'portal' && onboardingRoutes}
              {SURFACE !== 'onboarding' && portalRoutes}
            </Routes>
          </Suspense>
        </div>
        {withFooter && <SiteFooter />}
      </div>
    </SiteFooterContext.Provider>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </ThemeProvider>
    </I18nProvider>
  )
}
