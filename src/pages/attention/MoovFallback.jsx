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
//
// The void check is kept in memory and sent with the details in one multipart
// request (PORTAL-MOOV-03): the server stores it, so a dialog closed without
// submitting leaves nothing behind in S3.

import { useI18n } from '../../context/I18nContext'
import { useEffect, useState } from 'react'
import FormField from '../../components/FormField'
import Attachment from './Attachment'
import { inputCls, errorCls } from './inputs'
import { emptyBankDetails, validateBankDetails } from './formState'
import { submitManualBank } from './api'

// Server field → the dialog field that shows it.
const SERVER_FIELDS = {
  account_number: 'accountNumber',
  routing_number: 'routingNumber',
  void_check: 'voidCheck',
}

// Refusals that name no field → a message for the whole dialog.
const REFUSAL_KEYS = {
  SAME_AS_CURRENT: 'attention.moov.errSameAsCurrent',
  SUBMISSION_OPEN: 'attention.moov.errSubmissionOpen',
  UPLOAD_FAILED: 'attention.moov.errUpload',
}

export default function MoovFallback({ open, token, onClose, onSubmitted }) {
  const { t } = useI18n()
  const [values, setValues] = useState(emptyBankDetails)
  // The picked void check itself; `values.voidCheck` holds its name, which is
  // what validation and the attachment control read.
  const [voidFile, setVoidFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

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

  const submit = async (e) => {
    e.preventDefault()
    const found = validateBankDetails(values)
    setErrors(found)
    setShowErrors(true)
    setFormError('')
    if (Object.keys(found).length || !voidFile) return

    setBusy(true)
    let result
    try {
      // The bank in use stays in use until this one is verified and approved.
      result = await submitManualBank(token, {
        accountNumber: values.accountNumber,
        routingNumber: values.routingNumber,
        bankName: values.bankName,
        voidCheck: voidFile,
      })
    } catch {
      result = { ok: false, data: {} }
    }
    setBusy(false)

    if (result.ok && result.data?.success) {
      onSubmitted()
      return
    }

    const { data = {} } = result
    if (data.errors) {
      // Server messages are shown as sent (`t` returns an unknown key as-is).
      const fieldErrors = {}
      for (const [key, messages] of Object.entries(data.errors)) {
        const field = SERVER_FIELDS[key]
        if (field) fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages
      }
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) setFormError(t('attention.moov.errGeneric'))
      return
    }

    setFormError(t(REFUSAL_KEYS[data.code] || 'attention.moov.errGeneric'))
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
      aria-label={t('attention.moov.title')}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-ds-xl
                   max-h-[92vh] sm:max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">{t('attention.moov.title')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t('attention.moov.sub')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('attention.moov.close')}
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
            <Attachment
              value={values.voidCheck}
              onChange={(v) => set('voidCheck', v)}
              invalid={!!err('voidCheck')}
              upload={async (file) => {
                setVoidFile(file)
                return { ok: true, key: file.name }
              }}
            />
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

          {formError && (
            <p className="text-sm text-red-600" role="alert">{formError}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              {t('attention.cancel')}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                         shadow-ds-sm transition-colors duration-ds-normal
                         focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            >
              {busy ? t('attention.moov.submitting') : t('attention.moov.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
