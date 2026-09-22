// Step 2 — bank connection via Plaid.
//
// Simulated happy path: the real SDK needs a live link_token from the backend,
// which the local mock cannot mint. The point here is the surrounding UX —
// where the step sits, what it says, and what "verified" looks like afterwards.
//
// A customer Plaid will not connect can fall back to manual verification
// through MOOV — the same void check + account/routing details the main flow's
// bankInfo step collects. That submission is reviewed by a person, so it lands
// in a pending state rather than a verified one.

import { useI18n } from '../../context/I18nContext'
import { useState } from 'react'
import MoovFallback from './MoovFallback'

function BankIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 4.5H3L12 3zM4.5 10.5v6m5-6v6m5-6v6m5-6v6M3 20.25h18" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
    </svg>
  )
}

function Connected({ bank }) {
  const { t } = useI18n()
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
          <ShieldIcon />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{t('portalDemo.bank.verifiedTitle')}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {bank?.institution || 'Chase'} ···· {bank?.last4 || '4471'} · Checking
          </p>
          <p className="text-xs text-gray-400 mt-2">{t('portalDemo.bank.verifiedNote')}</p>
        </div>
      </div>
    </div>
  )
}

function PendingReview() {
  const { t } = useI18n()
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{t('portalDemo.bank.pendingTitle')}</p>
          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t('portalDemo.bank.pendingBody')}</p>
          <p className="text-xs text-gray-400 mt-2">{t('portalDemo.bank.pendingNote')}</p>
        </div>
      </div>
    </div>
  )
}

export default function Step2Bank({ bank, connected, pending, onConnected, onManualSubmitted }) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [moovOpen, setMoovOpen] = useState(false)

  const connect = () => {
    setBusy(true)
    // Stands in for the Plaid Link round trip.
    setTimeout(() => {
      setBusy(false)
      onConnected()
    }, 1400)
  }

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('portalDemo.bank.heading')}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{t('portalDemo.bank.blurb')}</p>
      </header>

      {connected ? (
        <Connected bank={bank} />
      ) : pending ? (
        <PendingReview />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 max-w-2xl">
            <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-primary flex items-center justify-center shrink-0">
              <BankIcon />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t('portalDemo.bank.noneTitle')}</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t('portalDemo.bank.noneBody')}</p>

              <ul className="mt-4 space-y-2">
                {['b1', 'b2', 'b3'].map((k) => (
                  <li key={k} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-green-600 mt-0.5 shrink-0"><ShieldIcon /></span>
                    {t(`portalDemo.bank.${k}`)}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={connect}
                disabled={busy}
                className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                           shadow-ds-sm transition-colors duration-ds-normal cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              >
                {busy ? t('portalDemo.bank.opening') : t('portalDemo.bank.connect')}
              </button>
              {/* Deliberately quiet: Plaid is the path we want people on, so the
                  fallback is smaller and carries no accent colour. The underline
                  keeps it discoverable as a control without competing for the eye. */}
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {t('portalDemo.moov.q')}{' '}
                <button
                  type="button"
                  onClick={() => setMoovOpen(true)}
                  className="font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2
                             transition-colors duration-ds-normal focus:outline-none focus:ring-2
                             focus:ring-gray-300 rounded"
                >
                  {t('portalDemo.moov.link')}
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      <MoovFallback
        open={moovOpen}
        onClose={() => setMoovOpen(false)}
        onSubmitted={() => { setMoovOpen(false); onManualSubmitted() }}
      />
    </div>
  )
}
