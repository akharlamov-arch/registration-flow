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
import { requestCode, verifyCode, validateSession, getMe } from '../../api/portal'
import { initialForm, initialSameAs, validate, isComplete, buildPayload } from './formState'
import Stepper from './Stepper'
import Step1Contract from './Step1Contract'
import Step2Bank from './Step2Bank'
import BankReminder from './BankReminder'

const TOKEN_KEY = 'itrucking-portal-demo-token'

const inputCls =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-900 bg-white ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
  'transition-colors duration-ds-normal'

const primaryBtn =
  'w-full px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg ' +
  'shadow-ds-sm transition-colors duration-ds-normal cursor-pointer ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed'

// ── Chrome ──────────────────────────────────────────────────────────────────

// Account bar — sits inside the page, under the shared site header. Carries
// only what is specific to a signed-in portal session; the logo, language
// selector and support phone stay where they always were, in Header.jsx.
function AccountBar({ company, onSignOut }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-900 truncate">{company}</span>

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onSignOut}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-ds-normal"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

function AllDone() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 mx-auto flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900">You are all set</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
        Your updated contract is signed and your bank account is verified. Nothing else is needed from you right now.
      </p>
    </div>
  )
}

// ── Login ───────────────────────────────────────────────────────────────────

function Login({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter a valid email address')
    setError(''); setBusy(true)
    await requestCode(email.trim())
    setBusy(false); setSent(true)
  }

  const verify = async (e) => {
    e.preventDefault()
    if (!code.trim()) return setError('Enter the code from your email')
    setError(''); setBusy(true)
    const { ok, data } = await verifyCode(email.trim(), code.trim())
    setBusy(false)
    if (ok && data?.success) {
      sessionStorage.setItem(TOKEN_KEY, data.session_token)
      onSignedIn(data.session_token, data.customer)
    } else {
      setError('That code is not valid or has already been used')
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
      <p className="text-sm text-gray-500 mb-6">
        We will email you a one-time code. No password needed.
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
            {error}
          </p>
        )}

        {!sent ? (
          <form onSubmit={send} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Email address</label>
              <input type="email" autoComplete="email" className={inputCls} value={email}
                     placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className={primaryBtn} disabled={busy}>{busy ? 'Sending…' : 'Send code'}</button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Verification code</label>
              <input type="text" inputMode="text" autoComplete="one-time-code" maxLength={6}
                     className={`${inputCls} text-center text-lg font-bold tracking-[0.3em] uppercase`}
                     value={code} placeholder="000000" onChange={(e) => setCode(e.target.value)} />
            </div>
            <button className={primaryBtn} disabled={busy}>{busy ? 'Verifying…' : 'Continue'}</button>
            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button" onClick={() => { setSent(false); setCode(''); setError('') }}
                      className="text-gray-500 hover:text-gray-800">Change email</button>
              <button type="button" onClick={send} className="text-primary hover:text-secondary">Resend code</button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PortalDemo() {
  const [view, setView] = useState('loading')
  const [token, setToken] = useState('')
  const [customer, setCustomer] = useState(null)

  const [signed, setSigned] = useState(false)
  const [linked, setLinked] = useState(false)
  const [step, setStep] = useState(1)
  const [signing, setSigning] = useState(false)

  const [values, setValues] = useState(() => initialForm(null))
  const [sameAs, setSameAs] = useState(initialSameAs)
  const [showErrors, setShowErrors] = useState(false)

  const applyCustomer = useCallback((c) => {
    setCustomer(c)
    setValues(initialForm(c))
    setSigned(c?.contract?.status === 'signed')
    setLinked(c?.bank_verification?.plaid_linked === true)
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

  const errors = useMemo(() => validate(values, sameAs), [values, sameAs])
  const complete = useMemo(() => isComplete(values, sameAs), [values, sameAs])

  const setValue = (key, v) => setValues((prev) => ({ ...prev, [key]: v }))
  const toggleSameAs = (id, on) => setSameAs((prev) => ({ ...prev, [id]: on }))

  const handleSign = () => {
    setShowErrors(true)
    if (!complete) return
    setSigning(true)
    // The payload the backend would receive — logged so it can be compared
    // against the contract while the demo is being walked through.
    console.log('[portal-demo] updated-contract payload', buildPayload(values, sameAs))
    setTimeout(() => {
      setSigning(false)
      setSigned(true)
      setStep(2)
    }, 900)
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
    { id: 1, title: 'Updated contract details', state: signed ? 'done' : 'active' },
    { id: 2, title: 'Bank account', state: linked ? 'done' : 'active' },
  ]

  const allDone = signed && linked
  const remind = signed && !linked

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-portal mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AccountBar company={customer?.profile?.cust_name} onSignOut={handleSignOut} />

        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {allDone ? 'Your account is up to date' : 'A few things need your attention'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {allDone
              ? 'Nothing outstanding right now.'
              : 'You can complete these in any order.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-20">
            <Stepper steps={steps} current={step} onSelect={setStep} />
          </aside>

          <div className="min-w-0">
            {remind && <BankReminder onGo={() => setStep(2)} />}

            {allDone ? (
              <AllDone />
            ) : step === 1 ? (
              <Step1Contract
                values={values}
                errors={errors}
                sameAs={sameAs}
                showErrors={showErrors}
                complete={complete}
                signing={signing}
                onChange={setValue}
                onToggleSameAs={toggleSameAs}
                onSign={handleSign}
              />
            ) : (
              <Step2Bank
                bank={customer?.bank}
                connected={linked}
                onConnected={() => { setLinked(true); refresh() }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
