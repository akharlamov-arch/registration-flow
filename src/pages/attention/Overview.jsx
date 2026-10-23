// The attention page's landing view (PORTAL-ATTENTION-MOCKUP). What it shows
// follows the account's real state rather than always offering both cards:
//
// - something is still open → one task card per open step; with exactly one
//   left, a "Need to change something else?" disclosure under it offers the
//   step that is already done;
// - nothing is open → a single "Your account is all set" card, whose
//   disclosure offers both steps for when details change.
//
// The step rail beside it is a status readout here, not navigation — a
// customer moves on through these buttons. Tutorials follow in every state.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import PortalTutorials from './PortalTutorials'

function DocumentIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 9.75H8.25m5.25 3H8.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function BankIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0 mt-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-ds-slow ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// The "all set" check draws itself once, on mount (keyframes in index.css).
function CheckBadge() {
  return (
    <svg className="check-badge w-12 h-12 sm:w-14 sm:h-14 shrink-0" viewBox="0 0 56 56" aria-hidden="true">
      <circle className="check-badge-bg" cx="28" cy="28" r="28" />
      <circle className="check-badge-ring" cx="28" cy="28" r="24" transform="rotate(-90 28 28)" />
      <path className="check-badge-check" d="M19 28.5l6 6 12-13" />
    </svg>
  )
}

const BADGE = {
  active:  'text-primary bg-blue-50',
  locked:  'text-gray-500 bg-gray-100',
  pending: 'text-amber-700 bg-amber-50',
  waiting: 'text-amber-700 bg-amber-50',
}

const BADGE_KEY = {
  active:  'attention.steps.active',
  locked:  'attention.steps.locked',
  pending: 'attention.steps.pending',
  waiting: 'attention.steps.waiting',
}

function Disclosure({ id, label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-gray-900 underline decoration-gray-300
                   underline-offset-4 hover:decoration-current transition-colors duration-ds-normal"
      >
        <span>{label}</span>
        <ChevronIcon open={open} />
      </button>
      <div
        id={id}
        inert={open ? undefined : ''}
        className={`grid transition-[grid-template-rows] duration-ds-slow ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden min-h-0">
          <ul className={`pt-2 transition-opacity duration-ds-normal ${open ? 'opacity-100' : 'opacity-0'}`}>
            {children}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ChangeRow({ icon, title, body, cta, onClick }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] min-[480px]:grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 items-center
                   py-3.5 border-t border-gray-100 first:border-t-0">
      <span className="hidden min-[480px]:flex w-10 h-10 shrink-0 rounded-full bg-green-50 text-green-600 items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">{title}</h3>
        <p className="text-[13px] text-gray-500 mt-0.5">{body}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 px-[18px] py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-full
                   hover:border-gray-900 hover:bg-gray-50 transition-colors duration-ds-normal"
      >
        {cta}
      </button>
    </li>
  )
}

function TaskCard({ id, icon, state, title, body, secure, cta, onClick, children }) {
  const { t } = useI18n()
  const locked = state === 'locked'
  return (
    <section aria-labelledby={`${id}-h`} className="rounded-2xl border border-gray-200 bg-white shadow-ds-sm p-5 sm:px-7 sm:py-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] gap-4 sm:gap-5 items-center">
        <span className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-blue-50 text-primary flex items-center justify-center">
          {icon}
        </span>
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-1.5 mb-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${BADGE[state]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            {t(BADGE_KEY[state])}
          </span>
          <h2 id={`${id}-h`} className="text-[17px] sm:text-lg font-semibold text-gray-900 leading-snug">{title}</h2>
          <p className="flex items-start gap-1.5 text-sm text-gray-500 mt-0.5">
            {secure && <LockIcon />}
            <span>{body}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={locked}
          className="col-span-full sm:col-auto whitespace-nowrap px-[26px] py-[11px] text-sm font-semibold text-white bg-gray-900
                     border border-gray-900 rounded-full hover:bg-gray-700 hover:border-gray-700 transition-colors duration-ds-normal
                     focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {cta}
        </button>
      </div>
      {children}
    </section>
  )
}

// `contractInInbox`: a contract is out for signature by email
// (ATTENTION-INBOX-01). The landing page is where a returning customer arrives,
// and "Update details" alone gives no hint that a signature is owed.
export default function Overview({
  contractState, bankState, codeAwaited = false,
  onOpenContract, onOpenBank, requestReceived = false, contractInInbox = false,
}) {
  const { t } = useI18n()

  const rows = {
    contract: (
      <ChangeRow
        key="contract"
        icon={<DocumentIcon className="w-5 h-5" />}
        title={t('attention.hub.contractTitle')}
        body={t('attention.hub.contractBody')}
        cta={t('attention.hub.cta')}
        onClick={onOpenContract}
      />
    ),
    bank: (
      <ChangeRow
        key="bank"
        icon={<BankIcon className="w-5 h-5" />}
        title={t('attention.hub.bankTitle')}
        body={t('attention.hub.bankBody')}
        cta={t('attention.hub.cta')}
        onClick={onOpenBank}
      />
    ),
  }

  const open = [
    contractState !== 'done' && 'contract',
    bankState !== 'done' && 'bank',
  ].filter(Boolean)
  const done = ['contract', 'bank'].filter((id) => !open.includes(id))
  // Only offered next to a single remaining task — with both open, the cards
  // themselves are the way in.
  const more = open.length === 1 && (
    <Disclosure id="attention-more-open" label={t('attention.home.moreOpen')}>
      {done.map((id) => rows[id])}
    </Disclosure>
  )

  const tasks = {
    contract: (
      <TaskCard
        key="contract"
        id="task-contract"
        icon={<DocumentIcon />}
        state={contractState}
        title={t('attention.home.contractTitle')}
        body={t('attention.home.contractBody')}
        cta={contractState === 'pending' ? t('attention.home.viewStatus') : t('attention.home.contractCta')}
        onClick={onOpenContract}
      >
        {more}
      </TaskCard>
    ),
    bank: (
      <TaskCard
        key="bank"
        id="task-bank"
        icon={<BankIcon />}
        state={bankState}
        title={t('attention.home.bankTitle')}
        body={t('attention.home.bankBody')}
        secure
        cta={
          codeAwaited ? t('attention.home.continue')
          : bankState === 'active' ? t('attention.home.bankCta')
          : t('attention.home.viewStatus')
        }
        onClick={onOpenBank}
      >
        {more}
      </TaskCard>
    ),
  }

  return (
    <div>
      {requestReceived && (
        <div role="status" className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 sm:px-6 py-4 flex items-start gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center" aria-hidden="true">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <p className="text-sm font-medium text-green-900 leading-relaxed">{t('attention.review.requestReceived')}</p>
        </div>
      )}
      {contractInInbox && (
        <div role="status" className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 sm:px-6 py-4 flex items-start gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full bg-primary text-white flex items-center justify-center" aria-hidden="true">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </span>
          <p className="text-sm font-medium text-gray-900 leading-relaxed">{t('attention.hub.inboxBanner')}</p>
        </div>
      )}

      {open.length > 0 ? (
        <div className="grid gap-4">{open.map((id) => tasks[id])}</div>
      ) : (
        <section aria-labelledby="status-h" className="rounded-2xl border border-gray-200 bg-white shadow-ds-sm px-5 py-6 sm:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <CheckBadge />
            <div className="min-w-0">
              <h1 id="status-h" className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight tracking-tight mt-1 sm:mt-1.5">
                {t('attention.home.doneTitle')}
              </h1>
              <p className="text-[15px] text-gray-500 mt-1.5 max-w-[54ch]">{t('attention.home.doneSub')}</p>
            </div>
          </div>
          <Disclosure id="attention-more-done" label={t('attention.home.moreDone')}>
            {rows.contract}
            {rows.bank}
          </Disclosure>
        </section>
      )}

      <PortalTutorials />
    </div>
  )
}
