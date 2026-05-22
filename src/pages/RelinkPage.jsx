// Standalone Plaid re-link page (PLAID-RELINK-01).
//
// Lifecycle:
//   1. Mount: parse `?token=` from the location's search, call fetchRelinkSession
//      to validate. On 410, render an invalid-state screen. On 200, store the
//      display name + expiry and render the Plaid Link launcher.
//   2. User clicks "Connect Bank": call fetchRelinkLinkToken, hand the returned
//      `link_token` to window.Plaid.create + open. The Plaid script is loaded
//      from index.html (see <script src="https://cdn.plaid.com/link/v2/...">).
//   3. Plaid onSuccess → exchangeRelink with public_token + account_id; render
//      a success or error message accordingly.
//
// The token is stripped from the URL on mount via replaceState so it does not
// leak via referer headers or shared screenshots.

import { useEffect, useRef, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { fetchRelinkSession, fetchRelinkLinkToken, exchangeRelink } from '../api/relink'

const STATE = {
  LOADING: 'loading',
  INVALID: 'invalid',
  READY: 'ready',
  IN_PROGRESS: 'in_progress',
  SUCCESS: 'success',
  ERROR: 'error',
}

// Map server-side error codes to user-facing copy. Keep this list in sync with
// `PijbWeb.PlaidRelinkController`'s response bodies (codes like
// `PLAID_HOLDER_TYPE_MISMATCH`, `PLAID_NAME_MISMATCH`, etc).
function exchangeErrorMessage(code) {
  switch (code) {
    case 'PLAID_HOLDER_TYPE_MISMATCH':
      return 'The linked account type (business vs. personal) does not match the registration. Please pick a different account or contact support.'
    case 'PLAID_NAME_MISMATCH':
      return 'The account holder name from your bank does not match the name on file. Please pick the correct account or contact support to authorise the alternate name.'
    case 'PLAID_NO_ELIGIBLE_ACCOUNT':
      return 'The selected account is not eligible (must be a checking or savings account).'
    case 'PLAID_IDENTITY_UNAVAILABLE':
      return 'Your bank did not return identity information for this account. Please pick a different account.'
    case 'PLAID_TOKEN_EXCHANGE_FAILED':
    case 'PLAID_PERSIST_FAILED':
      return 'We could not complete the bank link due to a service error. Please try again or contact support.'
    default:
      return 'Something went wrong while completing the bank link. Please try again or contact support.'
  }
}

function invalidStateMessage(reason) {
  switch (reason) {
    case 'consumed':
      return 'This re-link link has already been used. If you need to update your bank account again, please contact your support representative for a new link.'
    case 'expired':
      return 'This re-link link has expired. Please contact your support representative to request a new one.'
    case 'not_found':
    default:
      return 'This re-link link is not valid. Please contact your support representative for a new link.'
  }
}

// Detailed breakdown shown when the server returns PLAID_NAME_MISMATCH.
// Mirrors the "Plaid Identity (Reported by Bank)" card in the CRM lead view.
function NameMismatchDetails({ details }) {
  if (!details) return null
  const ownerNames = details.owner_names ?? (details.best_owner ? [details.best_owner] : [])
  const score = details.score ?? null
  const target = details.target ?? null

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm space-y-3">
      <p className="font-medium text-amber-900">
        The account holder name reported by your bank does not match the name on your registration.
      </p>

      <dl className="divide-y divide-amber-200">
        <div className="py-2 grid grid-cols-2 gap-x-3">
          <dt className="text-amber-700 font-medium">Name(s) on account</dt>
          <dd className="text-amber-900 break-words">
            {ownerNames.length > 0 ? ownerNames.join(', ') : '—'}
          </dd>
        </div>
        {target && (
          <div className="py-2 grid grid-cols-2 gap-x-3">
            <dt className="text-amber-700 font-medium">Matched against</dt>
            <dd className="text-amber-900 break-words">{target}</dd>
          </div>
        )}
        {score !== null && (
          <div className="py-2 grid grid-cols-2 gap-x-3">
            <dt className="text-amber-700 font-medium">Match score</dt>
            <dd className="text-amber-900">{score} / 100</dd>
          </div>
        )}
      </dl>

      <p className="text-amber-800 text-xs">
        If the account is held under a related entity or a DBA name, please contact your support
        representative and ask them to add the alternate name to the allowlist before re-linking.
      </p>
    </div>
  )
}

export default function RelinkPage() {
  const location = useLocation()
  const [state, setState] = useState(STATE.LOADING)
  const [invalidReason, setInvalidReason] = useState(null)
  const [exchangeError, setExchangeError] = useState(null)
  const [nameMismatchDetails, setNameMismatchDetails] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [expiresAt, setExpiresAt] = useState(null)
  const [token, setToken] = useState(null)

  // The Plaid handler is created once per link-token; we keep it in a ref so
  // unmount + reopens cleanly destroy the previous instance.
  const plaidHandlerRef = useRef(null)

  // ── Mount: extract token from query string, validate, strip from URL ──────
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const t = searchParams.get('token')

    if (!t) {
      setInvalidReason('not_found')
      setState(STATE.INVALID)
      return
    }

    setToken(t)

    fetchRelinkSession(t).then(({ ok, data }) => {
      if (ok && data?.success) {
        setDisplayName(data.display_name || '')
        setExpiresAt(data.expires_at || null)
        setState(STATE.READY)

        // Strip the token from the URL so it doesn't leak via referer/history.
        // Keep the pathname + hash route but drop the search component.
        try {
          const url = new URL(window.location.href)
          url.search = ''
          window.history.replaceState({}, '', url.toString())
        } catch {
          /* best-effort */
        }
      } else {
        setInvalidReason(data?.error || 'not_found')
        setState(STATE.INVALID)
      }
    })

    return () => {
      if (plaidHandlerRef.current) {
        try { plaidHandlerRef.current.destroy() } catch { /* ignore */ }
      }
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Plaid Link open ───────────────────────────────────────────────────────
  const openPlaidLink = async () => {
    if (!token || state === STATE.IN_PROGRESS) return
    setExchangeError(null)
    setState(STATE.IN_PROGRESS)

    const { ok, data } = await fetchRelinkLinkToken(token)
    if (!ok || !data?.success || !data?.link_token) {
      setExchangeError(data?.message || 'Plaid is unavailable right now. Please try again.')
      setState(STATE.ERROR)
      return
    }

    if (!window.Plaid?.create) {
      setExchangeError('Plaid Link script failed to load. Please refresh and try again.')
      setState(STATE.ERROR)
      return
    }

    try { plaidHandlerRef.current?.destroy() } catch { /* ignore */ }

    plaidHandlerRef.current = window.Plaid.create({
      token: data.link_token,
      onSuccess: handlePlaidSuccess,
      onExit: handlePlaidExit,
    })
    plaidHandlerRef.current.open()
  }

  const handlePlaidSuccess = async (publicToken, metadata) => {
    // In Plaid update mode the SDK may pass publicToken as null — the backend
    // resolves the stored access token and ignores the public token in that
    // case, so we forward whatever we receive without blocking on it here.
    const accountId = metadata?.accounts?.[0]?.id

    const { ok, data } = await exchangeRelink(token, {
      publicToken,
      accountId,
      metadata,
    })

    if (ok && data?.success) {
      setState(STATE.SUCCESS)
      return
    }

    setExchangeError(exchangeErrorMessage(data?.code))
    setState(STATE.ERROR)
  }

  const handlePlaidExit = (err) => {
    if (state === STATE.SUCCESS) return
    // Exit without error → user closed the popup; allow another attempt.
    if (!err) {
      setState(STATE.READY)
      return
    }
    setExchangeError('Plaid Link was interrupted. Please try again.')
    setState(STATE.ERROR)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {state === STATE.LOADING && (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded-xl w-2/3 mx-auto" />
          <div className="h-4 bg-gray-100 rounded-xl w-1/2 mx-auto" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      )}

      {state === STATE.INVALID && (
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">Link no longer valid</h1>
          <p className="text-sm text-gray-600">{invalidStateMessage(invalidReason)}</p>
          <Link to="/" className="inline-block text-sm text-primary hover:text-secondary">
            Go to the main registration page
          </Link>
        </div>
      )}

      {(state === STATE.READY || state === STATE.IN_PROGRESS || state === STATE.ERROR) && (
        <div className="space-y-5">
          <header className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Re-link your bank account</h1>
            {displayName && (
              <p className="text-sm text-gray-600">
                Hi <span className="font-medium text-gray-900">{displayName}</span> — please reconnect
                your bank account through Plaid below.
              </p>
            )}
            {expiresAt && (
              <p className="text-xs text-gray-400">
                This link expires {new Date(expiresAt).toLocaleString()}
              </p>
            )}
          </header>

          {state === STATE.ERROR && exchangeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {exchangeError}
            </div>
          )}

          <button
            type="button"
            onClick={openPlaidLink}
            disabled={state === STATE.IN_PROGRESS}
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            {state === STATE.IN_PROGRESS ? 'Connecting…' : 'Connect Bank with Plaid'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We verify the linked account is held in the same name as your registration. If the
            account is held under a related entity (e.g. a subsidiary), please ask your support
            representative to whitelist that name before connecting.
          </p>
        </div>
      )}

      {state === STATE.SUCCESS && (
        <div className="text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-semibold text-gray-900">Bank account linked</h1>
          <p className="text-sm text-gray-600">
            Your bank account has been successfully updated. You can close this page — your support
            team will follow up if anything else is needed.
          </p>
        </div>
      )}
    </main>
  )
}
