// Customer portal — redesign demo.
//
// Separate from src/pages/PortalPage.jsx so the two can be opened side by side.
// Same brand tokens as the registration flow, different density: a 1200px
// working area, left-aligned, 14px body text, live inputs instead of per-field
// "Edit" toggles, and work presented as ordered steps.
//
// Steps are gated: the updated contract must be signed before the bank step
// opens. Once it is signed and the bank is still missing, an inline red
// reminder sits at the top of the content — replacing the full-screen red
// modal that PortalBankVerificationGate throws today.
//
// Data comes from the same /api/portal endpoints as the real page, so the
// three mock personas drive which state you land in.

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useI18n } from '../../context/I18nContext'
import { validateSession, getMe, submitChangeRequest } from '../../api/portal'
import { getPolicies } from './api'
import { initialForm, initialChoices, validate, isComplete, buildPayload } from './formState'
import Stepper from './Stepper'
import Step1Contract from './Step1Contract'
import Step2Bank from './Step2Bank'
import BankReminder from './BankReminder'
import ContractSigned from './ContractSigned'
import PoliciesLibrary from './PoliciesLibrary'
import Login from './Login'

const TOKEN_KEY = 'itrucking-portal-demo-token'

// ── Chrome ──────────────────────────────────────────────────────────────────

// Account bar — sits inside the page, under the shared site header. Carries
// only what is specific to a signed-in portal session; the logo, language
// selector and support phone stay where they always were, in Header.jsx.
function AccountBar({ company, onSignOut }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-900 truncate">{company}</span>

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onSignOut}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-ds-normal"
        >
          {t('portalDemo.signOut')}
        </button>
      </div>
    </div>
  )
}

function ChangeSubmitted({ onBack }) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('portalDemo.submitted.heading')}</h2>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{t('portalDemo.submitted.title')}</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t('portalDemo.submitted.body')}</p>
            <button
              type="button"
              onClick={onBack}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              {t('portalDemo.submitted.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PortalDemo() {
  const { t } = useI18n()
  const [view, setView] = useState('loading')
  const [token, setToken] = useState('')
  const [customer, setCustomer] = useState(null)

  const [signed, setSigned] = useState(false)
  const [linked, setLinked] = useState(false)
  // Manual MOOV details submitted — a person reviews them, so this is neither
  // unconnected nor verified.
  const [bankPending, setBankPending] = useState(false)
  // 1 | 2 | 'policies'
  const [step, setStep] = useState(1)
  const [signing, setSigning] = useState(false)
  // Editing an already-signed set of details, rather than signing for the first
  // time. Same form, same validation — only the copy and the endpoint differ.
  const [changeMode, setChangeMode] = useState(false)
  const [changeSubmitted, setChangeSubmitted] = useState(false)
  const [policies, setPolicies] = useState([])
  const [policiesLoading, setPoliciesLoading] = useState(true)

  const [values, setValues] = useState(() => initialForm(null))
  const [choices, setChoices] = useState(() => initialChoices(null))
  const [showErrors, setShowErrors] = useState(false)

  const applyCustomer = useCallback((c) => {
    setCustomer(c)
    setValues(initialForm(c))
    setChoices(initialChoices(c))
    setChangeMode(false)
    setChangeSubmitted(false)
    setShowErrors(false)
    setSigned(c?.contract?.status === 'signed')
    setLinked(c?.bank_verification?.plaid_linked === true)
    setBankPending(false)
    setStep(c?.contract?.status === 'signed' ? 2 : 1)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY)
    if (!stored) return setView('login')

    validateSession(stored).then(({ ok, data }) => {
      if (ok && data?.success) {
        setToken(stored)
        applyCustomer(data.customer)
        setView('portal')
      } else {
        sessionStorage.removeItem(TOKEN_KEY)
        setView('login')
      }
    })
  }, [applyCustomer])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setPoliciesLoading(true)
    getPolicies(token).then(({ ok, data }) => {
      if (cancelled) return
      if (ok && data?.success) setPolicies(data.policies || [])
      setPoliciesLoading(false)
    })
    return () => { cancelled = true }
  }, [token])

  const errors = useMemo(() => validate(values, choices), [values, choices])
  const complete = useMemo(() => isComplete(values, choices), [values, choices])

  const setValue = (key, v) => setValues((prev) => ({ ...prev, [key]: v }))
  const selectChoice = (id, value) => setChoices((prev) => ({ ...prev, [id]: value }))

  // `validate` walks GROUPS in render order, so the first key is the topmost
  // invalid field on the page.
  const revealFirstError = () => {
    const firstKey = Object.keys(errors)[0]
    if (!firstKey) return
    const wrapper = document.getElementById(`field-${firstKey}`)
    if (!wrapper) return
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // preventScroll: the smooth scroll above is already on its way.
    wrapper.querySelector('input, select, textarea')?.focus({ preventScroll: true })
  }

  const handleSign = () => {
    setShowErrors(true)
    // Pressing Sign on an incomplete form is how most customers will discover
    // what is missing — they will not scroll looking for it. Mark every
    // offending field and bring the first one into view.
    if (!complete) {
      revealFirstError()
      return
    }
    const payload = buildPayload(values, choices)
    // The payload the backend would receive — logged so it can be compared
    // against the contract while the demo is being walked through.
    console.log(`[portal-demo] ${changeMode ? 'change request' : 'updated-contract'} payload`, payload)
    setSigning(true)

    if (changeMode) {
      // A change request goes to the operators for review; nothing on the
      // account moves until they approve it.
      submitChangeRequest(token, { requested_changes: payload, description: '', files: [] })
        .then(() => {
          setSigning(false)
          setChangeMode(false)
          setChangeSubmitted(true)
        })
      return
    }

    setTimeout(() => {
      setSigning(false)
      setSigned(true)
      setStep(2)
    }, 900)
  }

  const startChange = () => {
    setChangeMode(true)
    setChangeSubmitted(false)
    setShowErrors(false)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(''); setCustomer(null); setView('login')
  }

  const refresh = useCallback(async () => {
    const { ok, data } = await getMe(token)
    if (ok && data?.success) setCustomer(data.customer)
  }, [token])

  if (view === 'loading') {
    return (
      <main className="max-w-md mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded-lg w-1/2" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </main>
    )
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-surface">
        <Login onSignedIn={(t, c) => { setToken(t); applyCustomer(c); setView('portal') }} />
      </div>
    )
  }

  const steps = [
    { id: 1, title: t('portalDemo.steps.contract'), state: signed ? 'done' : 'active' },
    { id: 2, title: t('portalDemo.steps.bank'), state: linked ? 'done' : bankPending ? 'pending' : 'active' },
  ]

  const allDone = signed && linked
  // Once manual details are in, the customer has done their part — keep the
  // red reminder for the case where nothing has been submitted at all.
  const remind = signed && !linked && !bankPending

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-portal mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AccountBar company={customer?.profile?.cust_name} onSignOut={handleSignOut} />

        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {allDone ? t('portalDemo.heroUpToDate') : t('portalDemo.heroAttention')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {allDone ? t('portalDemo.subNothing') : t('portalDemo.subAnyOrder')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-20">
            <Stepper steps={steps} current={step} onSelect={setStep} />

            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep('policies')}
                className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer
                            transition-colors duration-ds-normal hover:bg-white
                            ${step === 'policies'
                              ? 'bg-white shadow-ds-sm border border-gray-200'
                              : 'border border-transparent'}`}
              >
                <span className="w-6 h-6 shrink-0 rounded-full border border-gray-200 bg-white text-gray-400 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${step === 'policies' ? 'text-gray-900' : 'text-gray-500'}`}>
                    {t('portalDemo.docsNav.title')}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">{t('portalDemo.docsNav.sub')}</span>
                </span>
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            {remind && <BankReminder onGo={() => setStep(2)} />}

            {step === 'policies' ? (
              <PoliciesLibrary policies={policies} loading={policiesLoading} />
            ) : step === 1 ? (
              changeSubmitted ? (
                <ChangeSubmitted onBack={() => setChangeSubmitted(false)} />
              ) : signed && !changeMode ? (
                <ContractSigned
                  signedAt={customer?.contract?.signed_at}
                  onRequestChange={startChange}
                />
              ) : (
                <Step1Contract
                  values={values}
                  errors={errors}
                  choices={choices}
                  showErrors={showErrors}
                  complete={complete}
                  signing={signing}
                  onChange={setValue}
                  onSelectChoice={selectChoice}
                  onSign={handleSign}
                  mode={changeMode ? 'change' : 'sign'}
                  onCancel={changeMode ? () => { setChangeMode(false); setShowErrors(false) } : undefined}
                />
              )
            ) : (
              <Step2Bank
                bank={customer?.bank}
                connected={linked}
                pending={bankPending}
                onConnected={() => { setLinked(true); refresh() }}
                onManualSubmitted={() => setBankPending(true)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
