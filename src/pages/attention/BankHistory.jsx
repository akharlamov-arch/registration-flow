// Every bank this customer has connected, newest first.
//
// The list makes the rule visible: a Plaid connection is verified on the spot
// and takes over immediately, while one submitted through MOOV sits at
// "Awaiting review" and takes over only once a manager has checked it. Until
// then the previous account is still the one in use — which is how the
// customer is never left without a bank.
//
// What an entry says about itself — its tag, its sentence, its account — comes
// from src/components/bankDisplay.js (PORTAL-BANK-02): `method` has three
// values, and a bank typed in by hand must never read as a Plaid verification.

import { useI18n } from '../../context/I18nContext'
import { bankLabel, historyMethodKey, historyNoteKey } from '../../components/bankDisplay'

const BADGE = {
  active:         'bg-green-50 text-green-700 border-green-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  replaced:       'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_KEY = {
  active:         'attention.bank.historyActive',
  pending_review: 'attention.bank.historyPending',
  replaced:       'attention.bank.historyReplaced',
}

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BankHistory({ entries = [] }) {
  const { t } = useI18n()

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-5 sm:p-6 mt-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {t('attention.bank.historyHeading')}
      </h3>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">{t('attention.bank.historyEmpty')}</p>
      ) : (
        <ol className="space-y-3">
          {entries.map((e) => {
            const connected = formatDate(e.connected_at)
            const verified = formatDate(e.verified_at)
            // A status this page has no copy for yet (PORTAL-MOOV-03 reserves
            // three) renders without a badge rather than crashing `t()`.
            const statusKey = STATUS_KEY[e.status]
            const noteKey = historyNoteKey(e)

            return (
              <li
                key={e.id}
                className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border px-3.5 py-3
                            ${e.status === 'active' ? 'border-gray-200' : 'border-gray-100 bg-gray-50/60'}`}
              >
                <span className={`text-sm font-medium ${e.status === 'replaced' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {bankLabel(e)}
                </span>

                {statusKey && (
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded border ${BADGE[e.status]}`}>
                    {t(statusKey)}
                  </span>
                )}

                <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                  {t(historyMethodKey(e.method))}
                </span>

                <span className="w-full text-xs text-gray-400">
                  {connected && `${t('attention.bank.historyConnected')} ${connected}`}
                  {verified && ` · ${t('attention.bank.historyVerified')} ${verified}`}
                </span>

                {noteKey && <span className="w-full text-xs text-gray-500">{t(noteKey)}</span>}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
