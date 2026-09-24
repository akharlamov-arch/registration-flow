// Customer portal — the attention page (#/attention).
//
// What the customer still owes us — an updated contract and a verified bank —
// as steps that can be completed in any order, plus the documents library.
// This is the portal's only copy of these screens (PORTAL-UI-01).
//
// The "Updated contract details" tab is a card-per-section form
// (Step1Contract.jsx + fields.js, with the "same as company" address
// shortcuts) over the real contract subject, loaded from and saved to
// /api/portal/contract. See formState.js for the field mapping between this
// step's flat GROUPS and the real, more nested contract subject.
//
// The customer signs **in place**, the way a lead does (PORTAL-SIGN-02):
// `Sign updated contract` saves, renders and creates an embedded Zoho request
// (`POST /contract/sign`), and its `sign_url` opens in the same full-viewport
// frame the lead's signing step uses (src/components/ContractSigningFrame.jsx).
// When Zoho returns, the portal asks the server to confirm with Zoho
// (`POST /contract/complete`) — the frame's result is a hint, never proof. A
// request left half-signed reads as pending and is resumed, not re-created. The
// portal never has a contract emailed; that is the CRM operator's Send.
//
// The "Bank account" tab's "Connect with Plaid" button drives the real Plaid
// Link flow (usePlaidLink + createPlaidVerificationSession +
// fetchRelinkLinkToken + exchangeRelink — see Step2Bank.jsx).
//
// Both tabs read and write the real backend, so `signed`/`linked` are derived
// straight from `customer` on every render rather than tracked as separate
// state — a `refresh()` after either flow is what actually moves a tab from
// "Action required" to "Completed". Against devtools/portal-mock-server.mjs,
// the mock's personas decide which state you land in.
//
// Arriving from a gate (ATTANTION-PAGE-01): `PortalContractUpdateGate`'s
// "Update" and `PortalBankVerificationGate`'s "Verify" now navigate here
// instead of acting in place, handing the already-authenticated session token
// through router state (`location.state.token` — never the URL, it is a
// bearer credential) plus which gate sent the customer (`entry`). That opens
// the matching tab directly. A customer sent by the bank gate finds the
// contract tab locked until the bank is linked, so they cannot wander off
// mid-flow; the bank tab itself is never locked (see `lockedStep` below).

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import {
  validateSession, getMe, fetchContractSubject,
  signContract, resumeContractSigning, completeContractSigning,
} from '../../api/portal'
import ContractSigningFrame from '../../components/ContractSigningFrame'
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
import { ContractPending, ContractConfirming } from './ContractSigningStatus'
import PoliciesLibrary from './PoliciesLibrary'
import Login from './Login'

const TOKEN_KEY = 'itrucking-attention-token'

// Fail-closed: only an explicit `stale: false` with nothing awaiting a signature
// is a signed contract. A missing `contract`, a `null` `stale` or an error
// payload is never read as signed — the "Signed just now" panel once showed on
// prod for a customer who had never touched Zoho (PORTAL-SIGN-02).
function contractSigned(contract) {
  return contract?.stale === false && !contract?.pending
}

// The summary answered with a usable contract state at all.
function contractKnown(contract) {
  return typeof contract?.stale === 'boolean'
}

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
          {t('attention.signOut')}
        </button>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AttentionPage() {
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  // Captured once, at mount, rather than read from `location.state` on every
  // render: the browser keeps `history.state` attached to this entry across
  // an ordinary reload (not just React re-renders), so a plain read would
  // keep re-arming the lock every time this tab reopens `/attention`, and
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
  // it stays local to the session.
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
  // Re-opens the sign form on an already-signed contract (ContractSigned's
  // "Update my details") or over a pending one ("Change my details first").
  const [editingContract, setEditingContract] = useState(false)

  // Signing in place. `signingUrl` is a bearer link to sign this customer's
  // contract: memory only, never a URL, storage or a log. While it is set the
  // frame is open.
  const [signingUrl, setSigningUrl] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [resuming, setResuming] = useState(false)
  const [signNote, setSignNote] = useState('')
  // Set when a session opens on a pending embedded request: the customer may
  // have signed and closed the frame before Zoho redirected, so the server is
  // asked once, on load, before the tab offers "resume".
  const [needsReconcile, setNeedsReconcile] = useState(false)

  // Derived from the real summary on every render — the same fields
  // PortalPage.jsx's gates key off (`contract.stale`, `bank_verification.
  // plaid_linked`) — so a `refresh()` after either flow is what actually
  // flips a tab to "Completed", never a locally faked boolean.
  const contract = customer?.contract
  const signed = contractSigned(contract)
  const resumable = contract?.pending?.delivery === 'embedded'
  const linked = customer?.bank_verification?.plaid_linked === true

  const applyCustomer = useCallback((c) => {
    setCustomer(c)
    setBankPending(false)
    setEditingContract(false)
    setSignNote('')
    setNeedsReconcile(c?.contract?.pending?.delivery === 'embedded')
    setStep(entry === 'bank' ? 2 : entry === 'contract' ? 1 : contractSigned(c?.contract) ? 2 : 1)
  }, [entry])

  const refresh = useCallback(async () => {
    const { ok, data } = await getMe(token)
    if (ok && data?.success) setCustomer(data.customer)
  }, [token])

  // Asks the server whether Zoho has the signature. `quiet` is the load-time
  // reconcile: a customer who has simply not signed yet is shown "resume", not
  // told off.
  const confirmSignature = useCallback(async ({ quiet = false } = {}) => {
    setConfirming(true)
    setSignNote('')
    try {
      const { ok, status, data } = await completeContractSigning(token)
      if (ok && data?.success) {
        setEditingContract(false)
      } else if (status === 409) {
        if (!quiet) setSignNote(t('attention.signing.notCompleted'))
      } else if (!quiet) {
        setSignNote(data?.message || t('portal.contractForm.errorGeneric'))
      }
      await refresh()
    } catch {
      if (!quiet) setSignNote(t('portal.contractForm.errorGeneric'))
    } finally {
      setConfirming(false)
    }
  }, [token, refresh, t])

  useEffect(() => {
    if (!needsReconcile || !token) return
    setNeedsReconcile(false)
    confirmSignature({ quiet: true })
  }, [needsReconcile, token, confirmSignature])

  // The frame reported how signing ended. Either way it closes; only the
  // server's answer to "completed" can make the step read signed.
  const handleFrameResult = (result) => {
    setSigningUrl(null)
    if (result === 'completed') {
      confirmSignature()
    } else {
      // Declined or "sign later": back to the form with a note. Its Cancel
      // returns to the pending panel, where the same request can be resumed.
      setSignNote(t('attention.signing.declined'))
      setEditingContract(true)
      refresh()
    }
  }

  const handleResume = async () => {
    setResuming(true)
    setSignNote('')
    try {
      const { ok, status, data } = await resumeContractSigning(token)
      if (ok && data?.sign_url) {
        setSigningUrl(data.sign_url)
        return
      }
      setSignNote(
        status === 409
          ? t('attention.signing.notResumable')
          : data?.message || t('portal.contractForm.errorGeneric'),
      )
      if (status === 409) await refresh()
    } catch {
      setSignNote(t('portal.contractForm.errorGeneric'))
    } finally {
      setResuming(false)
    }
  }

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
    setSignNote('')
    setServerFieldErrors({})

    const { ok, data } = await signContract(token, payload).catch(() => ({ ok: false, data: null }))
    setSigning(false)

    if (ok && data?.success && data?.sign_url) {
      setSigningUrl(data.sign_url)
      // So the tab reads "pending" behind the frame, and after it if the
      // customer leaves without finishing.
      refresh()
      return
    }

    if (data?.errors) {
      const { fieldErrors, unmapped, locked } = mapServerErrors(data.errors)
      setServerFieldErrors(fieldErrors)
      setSendError(
        locked.length
          ? t('attention.lockedMissing')
          : unmapped.length
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
    setSigningUrl(null)
    // A fresh sign-in afterward is an ordinary visit, not a continuation of
    // whichever gate originally sent this browser tab here.
    setEntry(undefined)
  }

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
        <Login
          onSignedIn={(t, c) => {
            // Stored like a routed token, so a reload keeps the session (the
            // mount effect above reads this key).
            sessionStorage.setItem(TOKEN_KEY, t)
            setToken(t)
            applyCustomer(c)
            setView('portal')
          }}
        />
      </div>
    )
  }

  // Locked while the gate that sent the customer here is still open — signing
  // the contract is what lifts it, never a one-time flag, so it stays in sync
  // if the customer resolves it some other way too. Bank account is never
  // locked: whatever sent the customer here, that tab always stays reachable.
  const lockedStep = entry === 'bank' && !linked ? 1 : null

  const steps = [
    { id: 1, title: t('attention.steps.contract'), state: lockedStep === 1 ? 'locked' : signed ? 'done' : 'active' },
    { id: 2, title: t('attention.steps.bank'), state: linked ? 'done' : bankPending ? 'pending' : 'active' },
  ]

  const allDone = signed && linked
  // Once manual details are in, the customer has done their part — keep the
  // red reminder for the case where nothing has been submitted at all.
  const remind = signed && !linked && !bankPending

  const renderContractTab = () => {
    if (confirming) return <ContractConfirming />

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

    // Fail-closed: an unusable summary is an error, never the signed panel.
    if (!contractKnown(contract)) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5" role="alert">
          <p className="text-sm font-semibold text-red-800">{t('attention.signing.stateUnknown')}</p>
        </div>
      )
    }

    if (signed && !editingContract) {
      return (
        <ContractSigned
          signedAt={contract.signed_on}
          onRequestChange={() => setEditingContract(true)}
        />
      )
    }

    // An embedded request is out and unsigned: reopen it rather than create a
    // new one. An emailed one (sent by an operator) is not resumable here — the
    // form below signs in place and supersedes it.
    if (resumable && !editingContract) {
      return (
        <ContractPending
          note={signNote}
          resuming={resuming}
          onResume={handleResume}
          onEdit={() => { setSignNote(''); setEditingContract(true) }}
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
        onCancel={signed || resumable ? () => setEditingContract(false) : undefined}
        token={token}
        formError={sendError || signNote}
      />
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <main className="max-w-portal mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AccountBar company={customer?.profile?.cust_name} onSignOut={handleSignOut} />

        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {allDone ? t('attention.heroUpToDate') : t('attention.heroAttention')}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {allDone ? t('attention.subNothing') : t('attention.subAnyOrder')}
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
                    {t('attention.docsNav.title')}
                  </span>
                  <span className="block text-xs text-gray-400 mt-0.5">{t('attention.docsNav.sub')}</span>
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

      {signingUrl && <ContractSigningFrame url={signingUrl} onResult={handleFrameResult} />}
    </div>
  )
}
