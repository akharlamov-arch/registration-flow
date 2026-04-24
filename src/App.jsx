import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { I18nProvider, useI18n } from './context/I18nContext'
import Header from './components/Header'
import LeadForm from './pages/LeadForm'
import RegistrationForm from './pages/RegistrationForm'

function TitleUpdater() {
  const { t } = useI18n()
  const location = useLocation()

  useEffect(() => {
    const isReg = location.pathname.startsWith('/registration')
    document.title = isReg ? t('registration.title') : t('lead.title')
  }, [location.pathname, t])

  return null
}

function AppShell() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <TitleUpdater />
      <Header />
      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/registration" element={<RegistrationForm />} />
      </Routes>
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
