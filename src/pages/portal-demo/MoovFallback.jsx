// Manual bank verification, offered when Plaid will not connect.
//
// Fields and validation mirror the main flow's bankInfo step
// (src/pages/OtpVerification.jsx:790-812, labels from translations.js
// bankInfo.*): void check, bank name, account type, account number with
// confirmation, routing number.
//
// Unlike the old PortalBankVerificationGate this dialog is opened by the
// customer, not thrown at them, and Escape or the backdrop closes it.

import { useEffect, useState } from 'react'
import FormField from '../../components/FormField'
import FileUpload from '../../components/FileUpload'
import { inputCls, errorCls } from './inputs'
import { emptyBankDetails, validateBankDetails } from './formState'

const ACCOUNT_TYPES = ['Checking', 'Savings']

export default function MoovFallback({ open, onClose, onSubmitted }) {
  const [values, setValues] = useState(emptyBankDetails)
  const [errors, setErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    // Stop the page behind the dialog from scrolling under it.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const set = (key, v) => {
    const next = { ...values, [key]: v }
    setValues(next)
    if (showErrors) setErrors(validateBankDetails(next))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validateBankDetails(values)
    setErrors(found)
    setShowErrors(true)
    if (Object.keys(found).length) return

    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onSubmitted()
    }, 800)
  }

  const err = (key) => (showErrors ? errors[key] : undefined)
  const cls = (key) => `${inputCls} ${err(key) ? errorCls : ''}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Verify your bank with MOOV"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-ds-xl
                   max-h-[92vh] sm:max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Verify your bank with MOOV</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter the account you plan to use for payments and attach a void check.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-1 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors duration-ds-normal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-5 sm:px-6 py-5 space-y-4">
          <FormField
            label="Void Check"
            required
            error={err('voidCheck')}
            hint="Uploading a void check can help resolve verification issues."
          >
            <FileUpload
              id="moov-void-check"
              accept=".jpg,.jpeg,.png,.heic,.pdf"
              onChange={(files) => set('voidCheck', files?.[0]?.name || '')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Bank Name" optional>
              <input className={inputCls} value={values.bankName} onChange={(e) => set('bankName', e.target.value)} />
            </FormField>

            <FormField label="Account Type" optional>
              <select className={inputCls} value={values.accountType} onChange={(e) => set('accountType', e.target.value)}>
                <option value="">Select...</option>
                {ACCOUNT_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Routing Number" required error={err('routingNumber')}>
            <input
              className={cls('routingNumber')}
              inputMode="numeric"
              aria-invalid={!!err('routingNumber')}
              value={values.routingNumber}
              placeholder="123456789"
              onChange={(e) => set('routingNumber', e.target.value.replace(/\D/g, '').slice(0, 9))}
            />
          </FormField>

          <FormField label="Account Number" required error={err('accountNumber')}>
            <input
              className={cls('accountNumber')}
              inputMode="numeric"
              aria-invalid={!!err('accountNumber')}
              value={values.accountNumber}
              onChange={(e) => set('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 17))}
            />
          </FormField>

          <FormField label="Confirm Account Number" required error={err('accountNumberConfirm')}>
            <input
              className={cls('accountNumberConfirm')}
              inputMode="numeric"
              aria-invalid={!!err('accountNumberConfirm')}
              value={values.accountNumberConfirm}
              onChange={(e) => set('accountNumberConfirm', e.target.value.replace(/\D/g, '').slice(0, 17))}
            />
          </FormField>

          <p className="text-xs text-gray-500 leading-relaxed">
            Enter the bank account details you plan to use for payments for our services.
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                         shadow-ds-sm transition-colors duration-ds-normal
                         focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            >
              {busy ? 'Submitting…' : 'Submit for verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
