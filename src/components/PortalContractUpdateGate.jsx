import { useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import PortalNotice from './PortalNotice'

/**
 * "Update the contract data" — the notice for a contract signed before the
 * current terms took effect (CONTRACT-REFRESH-01).
 *
 * Same chrome as the bank gate (`PortalNotice`): a red modal with `Update` and
 * a collapse control, and a banner pinned above the dashboard once collapsed.
 * Whether it appears at all is the server's call — `customer.contract.stale`
 * from `/api/portal/me`, resolved by `Pijb.Contracts.Freshness`.
 *
 * `Update` no longer opens `PortalContractForm` in place (ATTANTION-PAGE-01):
 * it hands the session token to the redesigned portal (`/attention`) via
 * router state — never the URL, the token is a bearer credential — and opens
 * it on the "Updated contract details" tab. The bank tab stays reachable
 * there: that page never locks it (only the bank gate locks the contract tab).
 * The real editing form lives on that page now, reusing the same
 * fetchContractSubject/submitContractSubject pair this gate used to call
 * directly.
 *
 * @param {string}   props.sessionToken — the portal session token.
 * @param {Object}   [props.contract] — `{ signed_on, stale }` from the summary.
 * @param {boolean}  [props.collapsed] / @param {Function} [props.onCollapse]
 */
export default function PortalContractUpdateGate({
  sessionToken,
  contract,
  collapsed = false,
  onCollapse,
  modalSlot,
  bannerSlot,
}) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const signedOn = contract?.signed_on ? new Date(contract.signed_on) : null

  const body = signedOn
    ? t('portal.contractGate.bodyDated').replace(
        '{date}',
        signedOn.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      )
    : t('portal.contractGate.bodyUndated')

  const handleUpdate = () => {
    // Directly, never via a retired URL: those redirect, and a redirect drops
    // router state — the token would not arrive.
    navigate('/attention', { state: { token: sessionToken, entry: 'contract' } })
  }

  return (
    <PortalNotice
      heading={t('portal.contractGate.heading')}
      body={body}
      onAction={handleUpdate}
      actionLabel={
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
            />
          </svg>
          {t('portal.contractGate.updateBtn')}
        </>
      }
      collapsed={collapsed}
      onCollapse={onCollapse}
      collapseLabel={t('portal.contractGate.collapse')}
      modalSlot={modalSlot}
      bannerSlot={bannerSlot}
    />
  )
}
