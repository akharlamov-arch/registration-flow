// The customer enters the code from our Moov verification deposit (or both
// deposit amounts) — docs/conventions/portal-api-contract.md §9a in pijb.
//
// One card per `bank_verification.awaiting_codes` entry. The entry says which
// verification it is (`target`), how it was sent (`method`), when it should
// arrive and how many attempts are left; the server normalises and checks
// everything again (a leading "MV" is fine), so the inputs only keep the
// customer from sending something that cannot be a code. An entry with no
// attempts left stays on screen as "contact us" rather than disappearing.
//
// Success hands the fresh summary up: the step then re-derives what to show
// from it, never from a local "verified" flag.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import FormField from '../../components/FormField'
import { inputCls, errorCls } from './inputs'
import { submitBankCode } from './api'

function formatDay(iso) {
  if (!iso) return null
  // A bare YYYY-MM-DD is a calendar day in America/Los_Angeles; parsing it as
  // a local date keeps it from shifting a day west of UTC.
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const cents = (v) => v.replace(/\D/g, '').slice(0, 2)

export default function BankCodeEntry({ token, entry, bankName, onVerified, onStale }) {
  const { t } = useI18n()
  const micro = entry.method === 'micro_deposits'
  const [code, setCode] = useState('')
  const [amounts, setAmounts] = useState(['', ''])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(entry.attempts_left)
  const locked = attemptsLeft === 0
  const expected = formatDay(entry.expected_to)
  const bank = bankName || t('attention.bank.codeYourAccount')

  const submit = async (e) => {
    e.preventDefault()
    if (busy || locked) return
    setError(null)

    const filled = micro ? amounts.every((a) => a !== '') : /^\d{4}$/.test(code.replace(/^\s*mv\s*/i, '').trim())
    if (!filled) {
      setError(t('attention.bank.codeInvalid'))
      return
    }

    setBusy(true)
    try {
      const { ok, status, data } = await submitBankCode(token, {
        target: entry.target,
        ...(micro ? { amounts: amounts.map(Number) } : { code: code.trim() }),
      })

      if (ok && data?.success) {
        onVerified(data.customer)
        return
      }

      if (data?.code === 'VERIFICATION_CODE_INVALID') {
        setAttemptsLeft(data.attempts_left)
        setError(
          data.attempts_left > 0
            ? `${t('attention.bank.codeRejected')} ${t('attention.bank.codeAttemptsLeft')} ${data.attempts_left}.`
            : t('attention.bank.codeLocked'),
        )
        // The last wrong code closed the submission on the server.
        if (data.attempts_left === 0) onStale()
      } else if (data?.code === 'VERIFICATION_INPUT_INVALID') {
        setError(t('attention.bank.codeInvalid'))
      } else if (status === 423 || data?.code === 'VERIFICATION_LOCKED') {
        setAttemptsLeft(0)
        setError(t('attention.bank.codeLocked'))
      } else if (status === 409) {
        // Verified or closed meanwhile (an operator, a webhook): show what is true now.
        onStale()
      } else {
        setError(t('attention.bank.codeUnavailable'))
      }
    } catch {
      setError(t('attention.bank.codeUnavailable'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-ds-sm p-6" data-role="bank-code-entry">
      <p className="text-sm font-semibold text-gray-900">{t('attention.bank.codeTitle')}</p>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
        {micro ? t('attention.bank.codeBodyMicro') : t('attention.bank.codeBodyInstant')}{' '}
        <span className="font-medium text-gray-700">{bank}</span>
      </p>
      {expected && (
        <p className="text-xs text-gray-400 mt-1">{t('attention.bank.codeExpected')} {expected}</p>
      )}

      {locked ? (
        <p className="text-sm text-red-600 mt-4" role="alert">{t('attention.bank.codeLocked')}</p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3 max-w-sm" noValidate>
          {micro ? (
            // Bottom-aligned: a label that wraps at phone width must not push
            // its input below the other one.
            <div className="grid grid-cols-2 gap-3 items-end">
              {[0, 1].map((i) => (
                <FormField key={i} label={t(i === 0 ? 'attention.bank.codeAmount1' : 'attention.bank.codeAmount2')}>
                  <input
                    className={`${inputCls} ${error ? errorCls : ''}`}
                    inputMode="numeric"
                    placeholder="00"
                    value={amounts[i]}
                    onChange={(e) => setAmounts((prev) => prev.map((a, j) => (j === i ? cents(e.target.value) : a)))}
                  />
                </FormField>
              ))}
            </div>
          ) : (
            <FormField label={t('attention.bank.codeLabel')}>
              <input
                className={`${inputCls} ${error ? errorCls : ''}`}
                autoComplete="one-time-code"
                placeholder="MV1234"
                value={code}
                maxLength={8}
                onChange={(e) => setCode(e.target.value)}
              />
            </FormField>
          )}

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                       shadow-ds-sm transition-colors duration-ds-normal
                       focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          >
            {busy ? t('attention.bank.codeSubmitting') : t('attention.bank.codeSubmit')}
          </button>
        </form>
      )}
    </div>
  )
}
