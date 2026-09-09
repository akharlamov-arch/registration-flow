import { useI18n } from '../context/I18nContext'

/**
 * Actionable Plaid exchange failure UI for the registration portal.
 * Mirrors the mismatch guidance on RelinkPage — helps users pick the correct
 * account instead of retrying the same wrong one.
 */
export default function PlaidExchangeErrorPanel({ code, details, message }) {
  const { t } = useI18n()

  if (!code && !message) return null

  const isNameMismatch = code === 'PLAID_NAME_MISMATCH'
  const isHolderMismatch = code === 'PLAID_HOLDER_TYPE_MISMATCH'

  const ownerNames = details?.owner_names
    ?? (details?.best_owner ? [details.best_owner] : [])
  const target = details?.target ?? null
  const declared = details?.declared ?? null
  const plaidHolder = details?.plaid ?? null

  const headline = isNameMismatch
    ? t('plaidStub.exchangeErrors.nameMismatchTitle')
    : isHolderMismatch
      ? t('plaidStub.exchangeErrors.holderMismatchTitle')
      : t('plaidStub.exchangeErrors.genericTitle')

  const body = message
    || (isNameMismatch
      ? t('plaidStub.exchangeErrors.nameMismatchBody')
      : isHolderMismatch
        ? holderMismatchBody(t, declared, plaidHolder)
        : t('plaidStub.exchangeErrors.genericBody'))

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm space-y-3 mb-4">
      <p className="font-medium text-amber-900">{headline}</p>
      <p className="text-amber-800 leading-relaxed">{body}</p>

      {isNameMismatch && (ownerNames.length > 0 || target) && (
        <dl className="divide-y divide-amber-200">
          {ownerNames.length > 0 && (
            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
              <dt className="text-amber-700 font-medium">{t('plaidStub.exchangeErrors.labelAccountOwners')}</dt>
              <dd className="text-amber-900 break-words">{ownerNames.join(', ')}</dd>
            </div>
          )}
          {target && (
            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
              <dt className="text-amber-700 font-medium">{t('plaidStub.exchangeErrors.labelRegisteredAs')}</dt>
              <dd className="text-amber-900 break-words">{target}</dd>
            </div>
          )}
        </dl>
      )}

      {isHolderMismatch && (declared || plaidHolder) && (
        <dl className="divide-y divide-amber-200">
          {declared && (
            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
              <dt className="text-amber-700 font-medium">{t('plaidStub.exchangeErrors.labelRegisteredAs')}</dt>
              <dd className="text-amber-900 capitalize">{declared}</dd>
            </div>
          )}
          {plaidHolder && (
            <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
              <dt className="text-amber-700 font-medium">{t('plaidStub.exchangeErrors.labelLinkedAccount')}</dt>
              <dd className="text-amber-900 capitalize">{plaidHolder}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="text-amber-800 text-xs leading-relaxed">
        {t('plaidStub.exchangeErrors.remediation')}
      </p>
    </div>
  )
}

function holderMismatchBody(t, declared, plaid) {
  if (declared === 'business' && plaid === 'personal') {
    return t('plaidStub.exchangeErrors.holderBusinessOnPersonal')
  }
  if (declared === 'personal' && plaid === 'business') {
    return t('plaidStub.exchangeErrors.holderPersonalOnBusiness')
  }
  return t('plaidStub.exchangeErrors.holderMismatchBody')
}
