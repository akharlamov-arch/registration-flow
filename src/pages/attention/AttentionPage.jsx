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
// the matching tab directly; any other visit lands on the overview, whose two
// cards open the tabs. A customer sent by the bank gate finds the
// contract tab locked until the bank is linked, so they cannot wander off
// mid-flow; the bank tab itself is never locked (see `lockedStep` below).

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import {
  validateSession, getMe, fetchContractSubject, SESSION_EXPIRED_EVENT,
  signContract, resumeContractSigning, completeContractSigning,
} from '../../api/portal'
import ContractSigningFrame from '../../components/ContractSigningFrame'
import { getPolicies } from './api'
import {
  initialFormFromSubject, initialChoicesFromSubject, validate, isComplete,
  buildContractPayload, mapServerErrors, keptOnFile, onFileFormKeys,
} from './formState'
import Stepper from './Stepper'
import Overview from './Overview'
import Step1Contract from './Step1Contract'
import Step2Bank from './Step2Bank'
import BankReminder from './BankReminder'
import { bankVerified, openSubmission } from '../../components/bankDisplay'
import ContractSigned from './ContractSigned'
import {
  ContractPending, ContractInInbox, ContractConfirming, ContractUnderReview,
} from './ContractSigningStatus'
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
  const [sessionExpired, setSessionExpired] = useState(false)

  // Any call refused with INVALID_SESSION (10 min idle / 6h absolute) ends up
  // here: drop the dead token and go back to sign-in with a note, rather than
  // leaving the customer on a form whose every button answers 401. Ignored
  // outside the portal view — sign-in's own calls can be refused the same way.
  useEffect(() => {
    if (view !== 'portal') return
    const onExpired = () => {
      sessionStorage.removeItem(TOKEN_KEY)
      setToken(''); setCustomer(null); setSigningUrl(null)
      setEntry(undefined)
      setSessionExpired(true)
      setView('login')
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [view])

  // Manual MOOV details submitted — a person reviews them, so this is neither
  // unconnected nor verified. There is no real backend field for this yet, so
  // it stays local to the session.
  // 'overview' | 1 | 2 | 'policies'
  const [step, setStep] = useState('overview')
  const [policies, setPolicies] = useState([])
  const [policiesLoading, setPoliciesLoading] = useState(true)

  // The real contract subject (src/api/portal.js fetchContractSubject) backing
  // the Step1Contract card layout.
  const [subjectLoading, setSubjectLoading] = useState(true)
  const [subjectLoadError, setSubjectLoadError] = useState('')
  const [serverSubject, setServerSubject] = useState(null)
  // Which secrets the server has on file (never their values), and which of
  // those the customer chose to replace — see keptOnFile.
  const [stored, setStored] = useState({})
  const [replacing, setReplacing] = useState({})
  const [values, setValues] = useState({})
  const [choices, setChoices] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [signing, setSigning] = useState(false)
  const [serverFieldErrors, setServerFieldErrors] = useState({})
  const [sendError, setSendError] = useState('')
  // Re-opens the sign form on an already-signed contract (the overview's
  // "Update", ContractSigned's "Update my details") or over a pending one
  // ("Change my details first").
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
  // PortalPage.jsx's gates key off (`contract.stale`, `bank_verification`
  // through `bankVerified`) — so a `refresh()` after either flow is what actually
  // flips a tab to "Completed", never a locally faked boolean.
  const contract = customer?.contract
  const signed = contractSigned(contract)
  const resumable = contract?.pending?.delivery === 'embedded'
  // Out for signature by email — an approved change request, or a CRM Send.
  // The customer signs in the email, not here (ATTENTION-INBOX-01).
  const emailed = contract?.pending?.delivery === 'email'
  // CRM-CONTRACT-REVIEW-01: a customer past their first contract revision
  // has their Sign attempt staged for operator review instead of opening an
  // embedded request — `contract.update_review` carries that state across a
  // reload, same as `contract.pending` does for a live Zoho request.
  const pendingReview = contract?.update_review?.status === 'pending'
  // The same server rule, read ahead of time (`contract.review_required`): this
  // customer's Sign goes to review, so the button says "Request Changes".
  // Fail-closed to the plain sign flow when the server does not say.
  const reviewRequired = contract?.review_required === true
  // Channel-agnostic: a bank verified through a MOOV submission counts too.
  const linked = bankVerified(customer?.bank_verification) === true
  // A submitted (MOOV) bank still under way, read from the summary so a reload
  // keeps the tab where it was (PORTAL-MOOV-04): awaiting our review, its
  // deposit on its way, or — a code can be entered — the customer's move.
  const submission = openSubmission(customer?.bank_history)
  const bankPending = submission !== null
  const codeAwaited = (customer?.bank_verification?.awaiting_codes || []).length > 0
  const bankState = linked ? 'done'
    : codeAwaited ? 'active'
    : submission?.status === 'pending_verification' ? 'waiting'
    : bankPending ? 'pending'
    : 'active'

  const applyCustomer = useCallback((c) => {
    setCustomer(c)
    setEditingContract(false)
    setSignNote('')
    setNeedsReconcile(c?.contract?.pending?.delivery === 'embedded')
    setStep(entry === 'bank' ? 2 : entry === 'contract' ? 1 : 'overview')
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
      setStored(data.subject?.stored || {})
      setReplacing({})
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

  const kept = useMemo(() => keptOnFile(stored, replacing), [stored, replacing])
  const errors = useMemo(
    () => ({ ...validate(values, choices, kept), ...serverFieldErrors }),
    [values, choices, kept, serverFieldErrors],
  )
  const complete = useMemo(() => isComplete(values, choices, kept), [values, choices, kept])

  const setValue = (key, v) => {
    setValues((prev) => ({ ...prev, [key]: v }))
    setServerFieldErrors({})
  }
  const selectChoice = (id, value) => setChoices((prev) => ({ ...prev, [id]: value }))

  // Keeping the stored value again drops whatever was typed, so the submission
  // posts it blank and the server keeps the one on file.
  const keepOnFile = (storedKey, keep) => {
    setReplacing((prev) => ({ ...prev, [storedKey]: !keep }))
    if (keep) {
      setValues((prev) => ({
        ...prev,
        ...Object.fromEntries(onFileFormKeys(storedKey).map((key) => [key, ''])),
      }))
    }
    setServerFieldErrors({})
  }

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

    // CRM-CONTRACT-REVIEW-01: staged for operator review instead of a Zoho
    // request. `refresh()` picks up `contract.update_review`, which is what
    // actually flips the tab to the under-review panel (mirrors how the
    // embedded-frame branch above leans on `contract.pending`, not a local flag).
    // Both outcomes end the same way: back on the start page, whose banner
    // confirms the request is with our team.
    if ((ok && data?.success && data?.status === 'pending_review')
        || data?.code === 'CONTRACT_UPDATE_PENDING_REVIEW') {
      await refresh()
      setEditingContract(false)
      setStep('overview')
      window.scrollTo({ top: 0 })
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

  // The overview's "Update" is a request to change something, so a signed
  // customer lands on the form, as a stale one always has — not on the signed
  // panel, which is then only the confirmation after signing in place and
  // where the form's Cancel returns. `signed` already excludes a pending
  // request, so this never skips "Resume signing": a fresh submit there would
  // supersede the request the customer was part-way through.
  const openContract = () => {
    if (signed) setEditingContract(true)
    setStep(1)
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(''); setCustomer(null); setView('login')
    setSigningUrl(null)
    setSessionExpired(false)
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
          notice={sessionExpired ? t('attention.sessionExpired') : ''}
          onSignedIn={(t, c) => {
            setSessionExpired(false)
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
    {
      id: 1,
      title: t('attention.steps.contract'),
      state: lockedStep === 1 ? 'locked' : pendingReview ? 'pending' : signed ? 'done' : 'active',
    },
    { id: 2, title: t('attention.steps.bank'), state: bankState },
  ]

  const allDone = signed && linked
  const onOverview = step === 'overview'
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

    // CRM-CONTRACT-REVIEW-01: a Sign attempt was staged for operator review
    // instead of opening a Zoho request. Unconditional — unlike `resumable`,
    // there is no "edit and resubmit" escape hatch while one is pending (the
    // server refuses a second submission with CONTRACT_UPDATE_PENDING_REVIEW).
    if (pendingReview) {
      return <ContractUnderReview />
    }

    // An embedded request is out and unsigned: reopen it rather than create a
    // new one.
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

    // An emailed one cannot be framed here: the signature happens in the
    // email. The form is still reachable — on the review track it stages
    // another request, otherwise it signs here and replaces the emailed one.
    if (emailed && !editingContract) {
      return (
        <ContractInInbox
          sentAt={contract.pending.sent_at}
          reviewRequired={reviewRequired}
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
        stored={stored}
        kept={kept}
        onKeepOnFile={keepOnFile}
        mode={reviewRequired ? 'review' : signed ? 'change' : 'sign'}
        onCancel={signed || resumable || emailed ? () => setEditingContract(false) : undefined}
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
            {allDone ? t('attention.hub.sub') : t('attention.subAnyOrder')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-20">
            <Stepper
              steps={steps}
              current={step}
              readOnly
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
            {remind && !onOverview && <BankReminder onGo={() => setStep(2)} />}

            {!onOverview && (
              <button
                type="button"
                onClick={() => setStep('overview')}
                className="mb-6 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary hover:opacity-90
                           rounded-xl shadow-ds-sm transition-opacity duration-ds-normal focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <span aria-hidden="true">←</span> {t('attention.hub.back')}
              </button>
            )}

            {onOverview ? (
              <Overview
                onOpenContract={openContract}
                onOpenBank={() => setStep(2)}
                requestReceived={pendingReview}
                contractInInbox={emailed}
              />
            ) : step === 'policies' ? (
              <PoliciesLibrary policies={policies} loading={policiesLoading} />
            ) : step === 1 ? (
              renderContractTab()
            ) : (
              <Step2Bank
                token={token}
                bank={customer?.bank}
                history={customer?.bank_history || []}
                awaitingCodes={customer?.bank_verification?.awaiting_codes || []}
                connected={linked}
                onConnected={() => refresh()}
                onManualSubmitted={() => refresh()}
                onVerified={(fresh) => (fresh ? setCustomer(fresh) : refresh())}
                onRefresh={() => refresh()}
              />
            )}
          </div>
        </div>
      </main>

      {signingUrl && <ContractSigningFrame url={signingUrl} onResult={handleFrameResult} />}
    </div>
  )
}
