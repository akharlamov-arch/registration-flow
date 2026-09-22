// Step 2 — bank connection via Plaid.
//
// Simulated happy path: the real SDK needs a live link_token from the backend,
// which the local mock cannot mint. The point here is the surrounding UX —
// where the step sits, what it says, and what "verified" looks like afterwards.

import { useState } from 'react'

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
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6">
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
          <ShieldIcon />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">Bank account verified</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {bank?.institution || 'Chase'} ···· {bank?.last4 || '4471'} · Checking
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Connected through Plaid. We never see or store your banking credentials.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Step2Bank({ bank, connected, onConnected }) {
  const [busy, setBusy] = useState(false)

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
        <h2 className="text-xl font-bold text-gray-900">Connect your bank account</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          We use Plaid to confirm your account is real and belongs to your business. This is how payments reach you.
        </p>
      </header>

      {connected ? (
        <Connected bank={bank} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-6 sm:p-8">
          <div className="flex items-start gap-4 max-w-2xl">
            <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-primary flex items-center justify-center shrink-0">
              <BankIcon />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">No account connected</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                You will be taken to Plaid to pick your bank and sign in. It takes about a minute.
              </p>

              <ul className="mt-4 space-y-2">
                {[
                  'Your credentials go to your bank, never to iTrucking.',
                  'We receive only the account and routing numbers needed for payment.',
                  'You can disconnect at any time from this portal.',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-green-600 mt-0.5 shrink-0"><ShieldIcon /></span>
                    {line}
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
                {busy ? 'Opening Plaid…' : 'Connect with Plaid'}
              </button>
              <p className="text-[11px] text-gray-400 mt-2">Demo — simulates the Plaid Link round trip.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
