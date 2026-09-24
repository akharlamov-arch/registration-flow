// Step 1 between "sign" and "signed" (PORTAL-SIGN-02).
//
// `ContractPending` — a request is out and awaiting the customer's signature
// (`contract.pending.delivery === "embedded"`). Resuming reopens that same
// request; it never re-submits the form, which would create a new document and
// supersede the one the customer was part-way through.
//
// `ContractConfirming` — the frame returned and the server is asking Zoho
// whether the signature really landed. Nothing reads as signed until it says so.

import { useI18n } from '../../context/I18nContext'

function PenBadge() {
  return (
    <span className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
      </svg>
    </span>
  )
}

function Spinner() {
  return (
    <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function ContractPending({ note, resuming, onResume, onEdit }) {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('attention.signed.heading')}</h2>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <PenBadge />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{t('attention.signing.pendingTitle')}</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t('attention.signing.pendingBody')}</p>
            {note && <p className="text-sm text-amber-700 mt-2" role="status">{note}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onResume}
                disabled={resuming}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-secondary
                           rounded-lg shadow-ds-sm transition-colors duration-ds-normal cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              >
                {resuming ? t('attention.signing.resuming') : t('attention.signing.resumeBtn')}
              </button>
              <button
                type="button"
                onClick={onEdit}
                disabled={resuming}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200
                           hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal disabled:opacity-60"
              >
                {t('attention.signing.editBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContractConfirming() {
  const { t } = useI18n()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
      <div className="flex items-center gap-3" role="status">
        <Spinner />
        <p className="text-sm text-gray-600">{t('attention.signing.confirming')}</p>
      </div>
    </div>
  )
}
