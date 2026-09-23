// Customer portal — /attantion.
//
// A copy of the portal-demo redesign (src/pages/portal-demo/PortalDemo.jsx).
// The "Updated contract details" tab keeps the exact visual of the original
// (Step1Contract.jsx + fields.js — the card-per-section layout with the
// "same as company" address shortcuts), but the data under it is real: values
// are loaded from and saved to the same /api/portal/contract endpoints
// src/components/PortalContractForm.jsx uses — the modal
// PortalContractUpdateGate opens when it detects a stale contract
// (`customer.contract.stale`). See formState.js for the field mapping between
// this step's flat GROUPS and the real, more nested contract subject.
//
// The "Bank account" tab's "Connect with Plaid" button drives the real Plaid
// Link flow — the same usePlaidLink + createPlaidVerificationSession +
// fetchRelinkLinkToken + exchangeRelink sequence
// PortalBankVerificationGate's "Verify" button runs (see Step2Bank.jsx).
//
// Because both tabs now read and write the real backend, `signed`/`linked`
// are derived straight from `customer` on every render (not tracked as
// separate state, the way the portal-demo original fakes an instant flip) —
// a `refresh()` after either flow is what actually moves a tab from "Action
// required" to "Completed".
//
// Data comes from the same /api/portal endpoints as the real page, so the
// three mock personas drive which state you land in.
//
// Arriving from a real gate (ATTANTION-PAGE-01): `PortalContractUpdateGate`'s
// "Update" and `PortalBankVerificationGate`'s "Verify" now navigate here
// instead of acting in place, handing the already-authenticated session token
// through router state (`location.state.token` — never the URL, it is a
// bearer credential) plus which gate sent the customer (`entry`). That opens
// the matching tab directly and locks the other one for as long as the gate
// that sent them here is still open — signing the contract or linking the
// bank is what lifts it — so a customer sent to fix one thing cannot wander
// off to the other mid-flow.

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import { validateSession, getMe, fetchContractSubject, submitContractSubject } from '../../api/portal'
import { getPolicies } from './api'
import {
  initialFormFromSubject, initialChoicesFromSubject, validate, isComplete,
  buildContractPayload, mapServerErrors,
} from './formState'
import Stepper from './Stepper'
import Step1Contract from './Step1Contract'
import Step2Bank from './Step2Bank'
import BankReminder from './BankReminder'
import ContractSigned from './ContractSigned'
import PoliciesLibrary from './PoliciesLibrary'
import Login from './Login'

const TOKEN_KEY = 'itrucking-attantion-token'

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

// After a real send: the contract was mailed for signature, it is not signed
// yet — same "check your email" acknowledgment PortalContractForm's own modal
// shows before you close it.
function ContractSent({ sentTo, onBack }) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('portal.contractForm.sentHeading')}</h2>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {t('portal.contractForm.sentBody').replace('{email}', sentTo || '')}
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              {t('portal.contractForm.closeBtn')}
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
  const location = useLocation()
  const navigate = useNavigate()
  // Captured once, at mount, rather than read from `location.state` on every
  // render: the browser keeps `history.state` attached to this entry across
  // an ordinary reload (not just React re-renders), so a plain read would
  // keep re-arming the lock every time this tab reopens `/attantion`, and
  // would also survive an explicit Sign out + fresh sign-in — a customer who
  // reloads or starts over should land like any ordinary visit, not stay
  // routed from the gate that brought them here once. The effect right below
  // scrubs the history entry's state after this first read, so only the very
  // navigation from the gate carries it; `handleSignOut` clears the in-memory
  // copy for the same reason.
  const routedTokenRef = useRef(location.state?.token)
  const [entry, setEntry] = useState(() => location.state?.entry)

  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time scrub, not reactive to location
  }, [])

  const [view, setView] = useState('loading')
  const [token, setToken] = useState('')
  const [customer, setCustomer] = useState(null)

  // Manual MOOV details submitted — a person reviews them, so this is neither
  // unconnected nor verified. There is no real backend field for this yet, so
  // it stays local to the session, same as the portal-demo original.
  const [bankPending, setBankPending] = useState(false)
  // 1 | 2 | 'policies'
  const [step, setStep] = useState(1)
  const [policies, setPolicies] = useState([])
  const [policiesLoading, setPoliciesLoading] = useState(true)

  // The real contract subject (src/api/portal.js fetchContractSubject) backing
  // the Step1Contract card layout.
  const [subjectLoading, setSubjectLoading] = useState(true)
  const [subjectLoadError, setSubjectLoadError] = useState('')
  const [serverSubject, setServerSubject] = useState(null)
  const [values, setValues] = useState({})
  const [choices, setChoices] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [signing, setSigning] = useState(false)
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [sendError, setSendError] = useState('')
  const [sentTo, setSentTo] = useState(null)
  // Re-opens the sign form on an already-signed contract ("Change request" in
  // ContractSigned) — the same form, the same real endpoint either way.
  const [editingContract, setEditingContract] = useState(false)

  // Derived from the real summary on every render — the same fields
  // PortalPage.jsx's gates key off (`contract.stale`, `bank_verification.
  // plaid_linked`) — so a `refresh()` after either modal is what actually
  // flips a tab to "Completed", never a locally faked boolean.
  const signed = customer?.contract?.stale !== true
  const linked = customer?.bank_verification?.plaid_linked === true

  const applyCustomer = useCallback((c) => {
    setCustomer(c)
    setBankPending(false)
    setEditingContract(false)
    setSentTo(null)
    setStep(entry === 'bank' ? 2 : entry === 'contract' ? 1 : c?.contract?.stale === true ? 1 : 2)
  }, [entry])

  useEffect(() => {
    // Arriving from a real gate: the session is already authenticated there,
    // so it rides along instead of asking the customer to sign in again.
    // Persisted under the same key a direct visit uses, so a reload keeps it.
    const routedToken = routedTokenRef.current
    if (routedToken) {
      sessionStorage.setItem(TOKEN_KEY, routedToken)
      validateSession(routedToken).then(({ ok, data }) => {
        if (ok && data?.success) {
          setToken(routedToken)
          applyCustomer(data.customer)
          setView('portal')
        } else {
          sessionStorage.removeItem(TOKEN_KEY)
          setView('login')
        }
      })
      return
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- routedTokenRef is a ref, intentionally read once
  }, [applyCustomer])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setPoliciesLoading(true)
    getPolicies(token)
      .then(({ ok, data }) => {
        if (cancelled) return
        if (ok && data?.success) setPolicies(data.policies || [])
        setPoliciesLoading(false)
      })
      // A network-level failure (offline, CORS, the endpoint not deployed yet)
      // rejects rather than resolving with `ok: false` — leaves the tab
      // spinning forever and throws an unhandled rejection if not caught here.
      .catch(() => {
        if (cancelled) return
        setPoliciesLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setSubjectLoading(true)
    setSubjectLoadError('')

    fetchContractSubject(token).then(({ ok, status, data }) => {
      if (cancelled) return

      if (!ok || !data?.success) {
        setSubjectLoadError(
          status === 401 ? t('portal.contractForm.errorSession') : t('portal.contractForm.errorLoad'),
        )
        setSubjectLoading(false)
        return
      }

      const subject = data.subject?.subject || {}
      setServerSubject(subject)
      setValues(initialFormFromSubject(subject))
      setChoices(initialChoicesFromSubject(subject))
      setSubjectLoading(false)
    }).catch(() => {
      if (cancelled) return
      setSubjectLoadError(t('portal.contractForm.errorLoad'))
      setSubjectLoading(false)
    })

    return () => { cancelled = true }
  }, [token, t])

  const errors = useMemo(
    () => ({ ...validate(values, choices), ...serverFieldErrors }),
    [values, choices, serverFieldErrors],
  )
  const complete = useMemo(() => isComplete(values, choices), [values, choices])

  const setValue = (key, v) => {
    setValues((prev) => ({ ...prev, [key]: v }))
    setServerFieldErrors({})
  }
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

  const handleSign = async () => {
    setShowErrors(true)
    // Pressing Sign on an incomplete form is how most customers will discover
    // what is missing — they will not scroll looking for it. Mark every
    // offending field and bring the first one into view.
    if (!complete) {
      revealFirstError()
      return
    }

    const payload = buildContractPayload(values, choices, serverSubject || {})
    setSigning(true)
    setSendError('')
    setServerFieldErrors({})

    const { ok, data } = await submitContractSubject(token, payload)
    setSigning(false)

    if (ok && data?.success) {
      setSentTo(data.sent_to || '')
      setEditingContract(false)
      refresh()
      return
    }

    if (data?.errors) {
      const { fieldErrors, unmapped } = mapServerErrors(data.errors)
      setServerFieldErrors(fieldErrors)
      setSendError(
        unmapped.length
          ? `${t('portal.contractForm.errorFields')} (${unmapped.join(', ')})`
          : t('portal.contractForm.errorFields'),
      )
      return
    }

    if (data?.code === 'CONTRACT_INCOMPLETE') {
      setSendError(`${t('portal.contractForm.errorIncomplete')} ${(data.missing || []).join(', ')}`.trim())
      return
    }

    setSendError(data?.message || t('portal.contractForm.errorGeneric'))
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(''); setCustomer(null); setView('login')
    // A fresh sign-in afterward is an ordinary visit, not a continuation of
    // whichever gate originally sent this browser tab here.
    setEntry(undefined)
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

  // Locked while the gate that sent the customer here is still open — signing
  // the contract is what lifts it, never a one-time flag, so it stays in sync
  // if the customer resolves it some other way too. Bank account is never
  // locked: whatever sent the customer here, that tab always stays reachable.
  const lockedStep = entry === 'bank' && !linked ? 1 : null

  const steps = [
    { id: 1, title: t('portalDemo.steps.contract'), state: lockedStep === 1 ? 'locked' : signed ? 'done' : 'active' },
    { id: 2, title: t('portalDemo.steps.bank'), state: linked ? 'done' : bankPending ? 'pending' : 'active' },
  ]

  const allDone = signed && linked
  // Once manual details are in, the customer has done their part — keep the
  // red reminder for the case where nothing has been submitted at all.
  const remind = signed && !linked && !bankPending

  const renderContractTab = () => {
    if (sentTo !== null) {
      return <ContractSent sentTo={sentTo} onBack={() => setSentTo(null)} />
    }

    if (subjectLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      )
    }

    if (subjectLoadError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5" role="alert">
          <p className="text-sm font-semibold text-red-800">{subjectLoadError}</p>
        </div>
      )
    }

    if (signed && !editingContract) {
      return (
        <ContractSigned
          signedAt={customer?.contract?.signed_on}
          onRequestChange={() => setEditingContract(true)}
        />
      )
    }

    return (
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
        mode={signed ? 'change' : 'sign'}
        onCancel={signed ? () => setEditingContract(false) : undefined}
        token={token}
        formError={sendError}
      />
    )
  }

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
            <Stepper
              steps={steps}
              current={step}
              onSelect={(id) => { if (id !== lockedStep) setStep(id) }}
            />

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
              renderContractTab()
            ) : (
              <Step2Bank
                token={token}
                bank={customer?.bank}
                history={customer?.bank_history || []}
                connected={linked}
                pending={bankPending}
                onConnected={() => refresh()}
                onManualSubmitted={() => { setBankPending(true); refresh() }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
