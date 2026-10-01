// The attention page's landing view: two action cards that open the contract
// and bank tabs. The step rail beside it is a status readout here, not
// navigation — a customer moves on through these buttons.

import { useI18n } from '../../context/I18nContext'

function DocumentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 9.75H8.25m5.25 3H8.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  )
}

function ActionCard({ icon, title, body, cta, onClick }) {
  return (
    <div className="flex items-center gap-4 sm:gap-5 rounded-2xl border border-gray-200 bg-white shadow-ds-sm px-4 sm:px-6 py-5">
      <span className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{body}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 px-5 sm:px-7 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700
                   rounded-full transition-colors duration-ds-normal focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {cta}
      </button>
    </div>
  )
}

export default function Overview({ onOpenContract, onOpenBank, requestReceived = false }) {
  const { t } = useI18n()
  return (
    <div className="space-y-4">
      {requestReceived && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 px-4 sm:px-6 py-4 flex items-start gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center" aria-hidden="true">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <p className="text-sm font-medium text-green-900 leading-relaxed">{t('attention.review.requestReceived')}</p>
        </div>
      )}
      <ActionCard
        icon={<DocumentIcon />}
        title={t('attention.hub.contractTitle')}
        body={t('attention.hub.contractBody')}
        cta={t('attention.hub.cta')}
        onClick={onOpenContract}
      />
      <ActionCard
        icon={<BankIcon />}
        title={t('attention.hub.bankTitle')}
        body={t('attention.hub.bankBody')}
        cta={t('attention.hub.cta')}
        onClick={onOpenBank}
      />
    </div>
  )
}
