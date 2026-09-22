import { useCallback, useRef, useState } from 'react'
import { useI18n } from '../context/I18nContext'
import usePlaidLink from '../hooks/usePlaidLink'
import PlaidExchangeErrorPanel from './PlaidExchangeErrorPanel'
import PortalNotice, { Spinner } from './PortalNotice'
import { createPlaidVerificationSession } from '../api/portal'
import { fetchRelinkLinkToken, exchangeRelink } from '../api/relink'

/**
 * Blocking bank-verification gate for the customer portal (PORTAL-PLAID-GATE-01).
 *
 * The chrome — red modal, collapse control, pinned banner — is `PortalNotice`,
 * shared with the stale-contract notice. What lives here is the Plaid flow and
 * the states it produces, at one mount point: collapsing must not drop a mint
 * in flight or an exchange error the customer still needs to read.
 *
 * The overlay cannot be dismissed by a backdrop click or Esc. The only exits are
 * connecting a bank, `Sign out` (so a customer who signed in with the wrong
 * email is not trapped), and `Collapse`, which does not clear the requirement:
 * the host keeps refusing edits while the gate is up, the banner stays pinned to
 * the top of the page, and the customer can read their data meanwhile.
 *
 * The flow reuses the operator re-link rails end to end: mint a session on the
 * portal (`createPlaidVerificationSession`), then the ordinary
 * `/api/plaid/relink/:token/{link-token,exchange}` endpoints.
 *
 * @param {string}   props.sessionToken — the portal session token.
 * @param {Function} props.onVerified — called after a successful exchange; the
 *   host re-fetches the summary, which clears the gate.
 * @param {Function} props.onSignOut — clears the session.
 * @param {boolean}  [props.collapsed] — render the sticky banner instead of the
 *   modal. The host owns this so the banner sits in the page flow above the
 *   dashboard rather than inside the overlay.
 * @param {Function} [props.onCollapse] — the modal's Collapse button.
 * @param {Function} [props.onExpand] — re-opens the modal from the banner.
 */
export default function PortalBankVerificationGate({
  sessionToken,
  onVerified,
  onSignOut,
  collapsed = false,
  onCollapse,
  onExpand,
  modalSlot,
  bannerSlot,
}) {
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

  const verifyLabel = busy ? (
    <>
      <Spinner />
      {status === 'verifying' ? t('portal.bankGate.verifying') : t('portal.bankGate.connecting')}
    </>
  ) : (
    <>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M3 21h18M5.25 21V9.75L12 5.25l6.75 4.5V21M9.75 21v-5.25h4.5V21" />
      </svg>
      {t('portal.bankGate.verifyBtn')}
    </>
  )

  return (
    <PortalNotice
      heading={t('portal.bankGate.heading')}
      body={t('portal.bankGate.body')}
      onAction={handleVerify}
      actionLabel={verifyLabel}
      actionDisabled={busy || status === 'done'}
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseLabel={t('portal.bankGate.collapse')}
      modalSlot={modalSlot}
      bannerSlot={bannerSlot}
      bannerNote={
        <>
          {error?.message && !error.code && (
            <p className="text-xs text-white font-medium mt-1.5">{error.message}</p>
          )}
          {error?.code && (
            <button
              type="button"
              onClick={onExpand}
              className="text-xs text-white font-medium underline mt-1.5 focus:outline-none"
            >
              {t('portal.bankGate.showDetails')}
            </button>
          )}
          {status === 'done' && (
            <p className="text-xs text-white font-medium mt-1.5">
              {t('portal.bankGate.successNote')}
            </p>
          )}
        </>
      }
      footer={
        <button
          type="button"
          onClick={onSignOut}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {t('portal.bankGate.logoutBtn')}
        </button>
      }
    >
      {error && (error.code ? (
        <PlaidExchangeErrorPanel code={error.code} details={error.details} message={error.message} />
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
    </PortalNotice>
  )
}
