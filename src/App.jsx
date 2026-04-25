// DS React stack guideline: lazy() for routes — code splitting
import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './context/I18nContext'
import Header from './components/Header'

const LeadForm         = lazy(() => import('./pages/LeadForm'))
const RegistrationForm = lazy(() => import('./pages/RegistrationForm'))
const OtpVerification  = lazy(() => import('./pages/OtpVerification'))
const AccountReview    = lazy(() => import('./pages/AccountReview'))

function TitleUpdater() {
  const { t } = useI18n()
  const location = useLocation()

  useEffect(() => {
    const isReg = location.pathname.startsWith('/registration')
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

function AppShell() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TitleUpdater />
      <Header />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<LeadForm />} />
          <Route path="/verify" element={<OtpVerification />} />
          <Route path="/account-review" element={<AccountReview />} />
          <Route path="/registration" element={<RegistrationForm />} />
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
