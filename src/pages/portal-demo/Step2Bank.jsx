// Step 2 — bank connection via Plaid.
//
// Plaid Link itself is simulated — a mock link_token cannot drive the real SDK
// — but the two calls around it are real: a re-link session is minted, and the
// exchange is posted. Connecting for the first time and swapping to a different
// bank run the same path, which is how the backend already works
// (src/api/portal.js createPlaidVerificationSession → src/api/relink.js
// exchangeRelink).
//
// A customer Plaid will not connect can fall back to manual verification
// through MOOV — the same void check + account/routing details the main flow's
// bankInfo step collects. That submission is reviewed by a person, so it lands
// in a pending state rather than a verified one.

import { useI18n } from '../../context/I18nContext'
import { useState } from 'react'
import MoovFallback from './MoovFallback'
import { createPlaidVerificationSession } from '../../api/portal'
import { exchangeRelink } from '../../api/relink'

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

function Connected({ bank, onRelink }) {
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

          <p className="text-xs text-gray-500 mt-4 mb-2">{t('portalDemo.bank.changeQ')}</p>
          <button
            type="button"
            onClick={onRelink}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300
                       hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {t('plaidStub.retryDifferentAccountBtn')}
          </button>
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

export default function Step2Bank({ token, bank, connected, pending, onConnected, onManualSubmitted }) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [moovOpen, setMoovOpen] = useState(false)
  // Swapping banks: the connected account stays in place until a new one is
  // linked, so backing out leaves the customer exactly where they were.
  const [relinking, setRelinking] = useState(false)
  const [error, setError] = useState('')

  const connect = async () => {
    setError(''); setBusy(true)

    const { ok, data } = await createPlaidVerificationSession(token)
    if (!ok || !data?.success) {
      setBusy(false)
      return setError(t('otp.errorPlaidUnavailable'))
    }

    // Stands in for the Plaid Link round trip.
    await new Promise((r) => setTimeout(r, 1200))

    const exchange = await exchangeRelink(data.relink_token, { publicToken: 'public-demo-token' })
    setBusy(false)
    if (!exchange.ok) return setError(t('otp.errorPlaidFlowFailed'))

    setRelinking(false)
    onConnected()
  }

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{t('portalDemo.bank.heading')}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{t('portalDemo.bank.blurb')}</p>
      </header>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4" role="alert">
          {error}
        </p>
      )}

      {connected && !relinking ? (
        <Connected bank={bank} onRelink={() => { setError(''); setRelinking(true) }} />
      ) : pending && !relinking ? (
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

              {relinking && (
                <button
                  type="button"
                  onClick={() => setRelinking(false)}
                  className="mt-4 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200
                             hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
                >
                  {t('portalDemo.bank.keepBtn')}
                </button>
              )}
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
