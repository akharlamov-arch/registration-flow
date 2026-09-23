// Inline reminder that bank verification is still outstanding.
//
// Deliberately NOT a blocking modal: the old PortalBankVerificationGate threw a
// full-screen red overlay that read as an error and trapped the customer. This
// sits in the flow, states what is missing, and links to the step.

import { useI18n } from '../../context/I18nContext'
export default function BankReminder({ onGo }) {
  const { t } = useI18n()
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 mb-6">
      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-red-800">{t('portalDemo.reminder.title')}</p>
        <p className="text-sm text-red-700 mt-0.5 leading-relaxed">{t('portalDemo.reminder.body')}</p>
      </div>
      <button
        type="button"
        onClick={onGo}
        className="shrink-0 self-center px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700
                   rounded-lg transition-colors duration-ds-normal focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        {t('portalDemo.reminder.btn')}
      </button>
    </div>
  )
}
