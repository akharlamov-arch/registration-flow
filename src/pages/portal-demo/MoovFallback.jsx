// Manual bank verification, offered when Plaid will not connect.
//
// Fields and validation mirror the main flow's manual bank card
// (src/pages/OtpVerification.jsx:2620-2672): void check, account number with
// confirmation, routing number — and nothing else. bankInfo.labelBankName and
// labelAccountType are display rows in the "Connected via Plaid" section there,
// not inputs, so they are not asked for here.
//
// Unlike the old PortalBankVerificationGate this dialog is opened by the
// customer, not thrown at them, and Escape or the backdrop closes it.

import { useI18n } from '../../context/I18nContext'
import { useEffect, useState } from 'react'
import FormField from '../../components/FormField'
import Attachment from './Attachment'
import { inputCls, errorCls } from './inputs'
import { emptyBankDetails, validateBankDetails } from './formState'

export default function MoovFallback({ open, onClose, onSubmitted }) {
  const { t } = useI18n()
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

  // errors hold translation keys; resolve at the point of display
  const err = (key) => (showErrors && errors[key] ? t(errors[key]) : undefined)
  const cls = (key) => `${inputCls} ${err(key) ? errorCls : ''}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('portalDemo.moov.title')}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-ds-xl
                   max-h-[92vh] sm:max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">{t('portalDemo.moov.title')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t('portalDemo.moov.sub')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('portalDemo.moov.close')}
            className="shrink-0 -mr-1 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors duration-ds-normal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-5 sm:px-6 py-5 space-y-4">
          <FormField
            label={t('bankInfo.voidCheckLabel')}
            required
            error={err('voidCheck')}
            hint={t('bankInfo.voidCheckDesc')}
          >
            <Attachment value={values.voidCheck} onChange={(v) => set('voidCheck', v)} invalid={!!err('voidCheck')} />
          </FormField>

          <FormField label={t('bankInfo.labelRouting')} required error={err('routingNumber')}>
            <input
              className={cls('routingNumber')}
              inputMode="numeric"
              aria-invalid={!!err('routingNumber')}
              value={values.routingNumber}
              placeholder="000000000"
              onChange={(e) => set('routingNumber', e.target.value.replace(/\D/g, '').slice(0, 9))}
            />
          </FormField>

          <FormField label={t('bankInfo.labelAccountNumber')} required error={err('accountNumber')}>
            <input
              className={cls('accountNumber')}
              inputMode="numeric"
              aria-invalid={!!err('accountNumber')}
              value={values.accountNumber}
              placeholder="000000000000"
              onChange={(e) => set('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 17))}
            />
          </FormField>

          <FormField label={t('bankInfo.labelConfirmAccount')} required error={err('accountNumberConfirm')}>
            <input
              className={cls('accountNumberConfirm')}
              inputMode="numeric"
              aria-invalid={!!err('accountNumberConfirm')}
              value={values.accountNumberConfirm}
              placeholder="000000000000"
              onChange={(e) => set('accountNumberConfirm', e.target.value.replace(/\D/g, '').slice(0, 17))}
            />
          </FormField>

          <p className="text-xs text-gray-500 leading-relaxed">{t('bankInfo.infoNotice')}</p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              {t('portalDemo.cancel')}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                         shadow-ds-sm transition-colors duration-ds-normal
                         focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            >
              {busy ? t('portalDemo.moov.submitting') : t('portalDemo.moov.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
