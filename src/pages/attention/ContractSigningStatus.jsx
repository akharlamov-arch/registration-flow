// Step 1 between "sign" and "signed" (PORTAL-SIGN-02).
//
// `ContractPending` — a request is out and awaiting the customer's signature
// (`contract.pending.delivery === "embedded"`). Resuming reopens that same
// request; it never re-submits the form, which would create a new document and
// supersede the one the customer was part-way through.
//
// `ContractInInbox` — its emailed sibling (`delivery === "email"`): an operator
// approved the customer's change request, or sent the contract from the CRM.
// The signature happens in the email, so the panel says so instead of
// offering the form again (ATTENTION-INBOX-01). The form stays one deliberate
// click away, labelled for what it will do: on the review track it stages
// another request (the emailed contract stays the one to sign until a new one
// is sent); otherwise it signs here and replaces the emailed contract.
//
// `ContractConfirming` — the frame returned and the server is asking Zoho
// whether the signature really landed. Nothing reads as signed until it says so.
//
// `ContractUnderReview` — the customer's contract data is past its first
// revision (CRM-CONTRACT-REVIEW-01, backend-side gate keyed off the
// contract's version — never computed here), so `POST /contract/sign`
// staged it for operator review instead of opening a Zoho request.
// Informational only: no resume/edit action, since a second submission
// while one is pending is refused by the server (`contract.update_review`
// on load; `CONTRACT_UPDATE_PENDING_REVIEW` on a repeat Sign attempt).

import { useI18n } from '../../context/I18nContext'
import { formatLongDate } from './dates'

function EnvelopeBadge() {
  return (
    <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    </span>
  )
}

function PenBadge() {
  return (
    <span className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
      </svg>
    </span>
  )
}

function ReviewBadge() {
  return (
    <span className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export function ContractInInbox({ sentAt, reviewRequired, onEdit }) {
  const { t } = useI18n()
  const when = formatLongDate(sentAt)
  const [editKey, noteKey] = reviewRequired
    ? ['attention.signing.inboxEditReview', 'attention.signing.inboxReviewNote']
    : ['attention.signing.inboxEditSign', 'attention.signing.inboxSignNote']

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('attention.signed.heading')}</h2>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <EnvelopeBadge />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{t('attention.signing.inboxTitle')}</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
              {when && `${t('attention.signing.inboxSentOn')} ${when}. `}
              {t('attention.signing.inboxBody')}
            </p>
            <p className="text-xs text-gray-400 mt-2">{t('attention.signing.inboxNote')}</p>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200
                           hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
              >
                {t(editKey)}
              </button>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{t(noteKey)}</p>
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

export function ContractUnderReview() {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('attention.steps.contract')}</h2>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
        <div className="flex items-start gap-4">
          <ReviewBadge />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{t('attention.signing.underReviewTitle')}</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t('attention.signing.underReviewBody')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
