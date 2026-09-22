import { useCallback, useRef, useState } from 'react'
import { useI18n } from '../context/I18nContext'
import usePlaidLink from '../hooks/usePlaidLink'
import PlaidExchangeErrorPanel from './PlaidExchangeErrorPanel'
import { createPlaidVerificationSession } from '../api/portal'
import { fetchRelinkLinkToken, exchangeRelink } from '../api/relink'

/**
 * Blocking bank-verification gate for the customer portal (PORTAL-PLAID-GATE-01).
 *
 * Rendered over the dashboard while `customer.bank_verification.plaid_linked`
 * is false. It is deliberately non-dismissible — no close button, no backdrop
 * click, no Esc — because an unverified account is not a state the customer can
 * postpone. `Sign out` is the only way out other than connecting a bank, so a
 * customer who signed in with the wrong email is not trapped.
 *
 * The flow reuses the operator re-link rails end to end: mint a session on the
 * portal (`createPlaidVerificationSession`), then the ordinary
 * `/api/plaid/relink/:token/{link-token,exchange}` endpoints.
 *
 * @param {string}   props.sessionToken — the portal session token.
 * @param {Function} props.onVerified — called after a successful exchange; the
 *   host re-fetches the summary, which clears the gate.
 * @param {Function} props.onSignOut — clears the session.
 */
export default function PortalBankVerificationGate({ sessionToken, onVerified, onSignOut }) {
  const { t } = useI18n()

  const [status, setStatus] = useState('idle') // idle | connecting | verifying | done
  const [error, setError] = useState(null) // { code, details, message }

  // The minted re-link token is needed again at exchange time. It lives in a
  // ref rather than state because Plaid's onSuccess fires outside React's
  // update cycle and must not race a re-render.
  const relinkTokenRef = useRef(null)

  const busy = status === 'connecting' || status === 'verifying'

  // One click does the whole handshake: mint the session, then ask for the
  // link token with it.
  const fetchLinkToken = useCallback(async () => {
    const { ok, data } = await createPlaidVerificationSession(sessionToken)

    if (!ok || !data?.success || !data?.relink_token) {
      return { ok: false, data: { code: 'PORTAL_SESSION_UNAVAILABLE' } }
    }

    relinkTokenRef.current = data.relink_token
    return fetchRelinkLinkToken(data.relink_token)
  }, [sessionToken])

  const handleSuccess = useCallback(async (publicToken, metadata) => {
    setStatus('verifying')
    setError(null)

    const { ok, data } = await exchangeRelink(relinkTokenRef.current, {
      publicToken,
      accountId: metadata?.accounts?.[0]?.id,
      metadata,
    })

    if (ok && data?.success) {
      setStatus('done')
      onVerified?.()
      return
    }

    // Identity rejections carry a code + details the shared panel renders with
    // actionable guidance ("pick a different account", "contact support").
    setError({ code: data?.code, details: data?.details, message: data?.message })
    setStatus('idle')
  }, [onVerified])

  const handleExit = useCallback((err) => {
    setStatus((prev) => (prev === 'done' || prev === 'verifying' ? prev : 'idle'))
    if (err) setError({ code: null, message: t('portal.bankGate.errorInterrupted') })
  }, [t])

  const handleLinkError = useCallback(({ code, message }) => {
    setStatus('idle')
    setError({
      code: null,
      message:
        code === 'PLAID_SCRIPT_MISSING'
          ? t('portal.bankGate.errorScript')
          : message || t('portal.bankGate.errorSession'),
    })
  }, [t])

  const { open } = usePlaidLink({
    fetchLinkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
    onError: handleLinkError,
  })

  const handleVerify = async () => {
    if (busy) return
    setError(null)
    setStatus('connecting')

    const opened = await open()
    // `open` reports its own failure through onError, which resets the status.
    if (opened) setStatus('idle')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/70 overflow-y-auto"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="portal-bank-gate-heading"
    >
      <div className="w-full max-w-lg my-auto bg-white rounded-2xl shadow-ds-xl border-2 border-red-600 overflow-hidden">
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
          <svg
            className="w-7 h-7 text-white flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h2 id="portal-bank-gate-heading" className="text-lg sm:text-xl font-bold text-white">
            {t('portal.bankGate.heading')}
          </h2>
        </div>

        <div className="px-6 py-6 space-y-5">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {t('portal.bankGate.body')}
          </p>

          {error && (error.code ? (
            <PlaidExchangeErrorPanel
              code={error.code}
              details={error.details}
              message={error.message}
            />
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700 font-medium" role="alert">{error.message}</p>
            </div>
          ))}

          {status === 'done' && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700 font-medium">{t('portal.bankGate.successNote')}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={busy || status === 'done'}
            className="w-full flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-red-600 hover:bg-red-700 rounded-md shadow-ds-sm transition-colors duration-200
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {busy ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {status === 'verifying'
                  ? t('portal.bankGate.verifying')
                  : t('portal.bankGate.connecting')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M3 21h18M5.25 21V9.75L12 5.25l6.75 4.5V21M9.75 21v-5.25h4.5V21" />
                </svg>
                {t('portal.bankGate.verifyBtn')}
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {t('portal.bankGate.logoutBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
