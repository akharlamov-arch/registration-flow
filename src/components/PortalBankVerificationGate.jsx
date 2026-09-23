import { useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import PortalNotice from './PortalNotice'

/**
 * Blocking bank-verification gate for the customer portal (PORTAL-PLAID-GATE-01).
 *
 * The chrome — red modal, collapse control, pinned banner — is `PortalNotice`,
 * shared with the stale-contract notice.
 *
 * `Verify` no longer runs the Plaid flow in place (ATTANTION-PAGE-01): it
 * hands the session token to the redesigned portal (`/attention`) via router
 * state — never the URL, the token is a bearer credential — and opens it on
 * the "Bank account" tab, with "Updated contract details" locked there until
 * this gate's own condition (`bank_verification.plaid_linked`) clears. That
 * keeps a customer sent here to fix one thing from wandering off to the other
 * mid-flow. The real Plaid Link flow lives on that page now (its
 * Step2Bank.jsx), reusing the same usePlaidLink + createPlaidVerificationSession
 * + fetchRelinkLinkToken + exchangeRelink sequence this gate used to run
 * directly.
 *
 * The overlay cannot be dismissed by a backdrop click or Esc. The only exits
 * are `Verify` (which navigates away), `Sign out` (so a customer who signed in
 * with the wrong email is not trapped), and `Collapse`, which does not clear
 * the requirement: the host keeps refusing edits while the gate is up, the
 * banner stays pinned to the top of the page, and the customer can read their
 * data meanwhile.
 *
 * @param {string}   props.sessionToken — the portal session token.
 * @param {Function} props.onSignOut — clears the session.
 * @param {boolean}  [props.collapsed] — render the sticky banner instead of the
 *   modal. The host owns this so the banner sits in the page flow above the
 *   dashboard rather than inside the overlay.
 * @param {Function} [props.onCollapse] — the modal's Collapse button.
 */
export default function PortalBankVerificationGate({
  sessionToken,
  onSignOut,
  collapsed = false,
  onCollapse,
  modalSlot,
  bannerSlot,
}) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleVerify = () => {
    // Directly, never via a retired URL: those redirect, and a redirect drops
    // router state — the token would not arrive.
    navigate('/attention', { state: { token: sessionToken, entry: 'bank' } })
  }

  return (
    <PortalNotice
      heading={t('portal.bankGate.heading')}
      body={t('portal.bankGate.body')}
      onAction={handleVerify}
      actionLabel={
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M3 21h18M5.25 21V9.75L12 5.25l6.75 4.5V21M9.75 21v-5.25h4.5V21" />
          </svg>
          {t('portal.bankGate.verifyBtn')}
        </>
      }
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseLabel={t('portal.bankGate.collapse')}
      modalSlot={modalSlot}
      bannerSlot={bannerSlot}
      footer={
        <button
          type="button"
          onClick={onSignOut}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {t('portal.bankGate.logoutBtn')}
        </button>
      }
    />
  )
}
