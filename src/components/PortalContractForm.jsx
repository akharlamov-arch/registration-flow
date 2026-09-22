import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../context/I18nContext'
import FormField from './FormField'
import { US_STATES } from './ReviewCard'
import { Spinner } from './PortalNotice'
import { fetchContractSubject, submitContractSubject } from '../api/portal'

/**
 * The customer-facing Prepare-Contract form (CONTRACT-REFRESH-01).
 *
 * The same values the CRM's `/crm/customers/:id/contract` page collects, opened
 * pre-filled with whatever we already hold, so the customer corrects a contract
 * rather than retyping one.
 *
 * **Which fields are mandatory is the server's answer, not this form's.**
 * `required_fields` comes back with the subject and only drives the asterisk;
 * the refusal itself comes from `Pijb.Contracts.Subject.changeset/2` and lands
 * as `errors: {field: [message]}`, which is what marks a field red. A list
 * duplicated here would drift from the CRM the first time the rule changed.
 *
 * SSN and driver-licence numbers are never sent to the browser. When one is on
 * file the input shows that it is and stays blank; submitting it blank leaves
 * the stored value untouched (the server drops blanks rather than clearing).
 *
 * `Done` saves, renders and mails the contract for signature in one server
 * call, then this switches to a "check your email" state.
 */

const inputCls =
  'w-full px-4 py-3 rounded-xl border-2 text-gray-900 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-200'

const okBorder = 'border-gray-200 focus:border-gray-400'
const errBorder = 'border-red-400 focus:border-red-500'

const ADDRESS_KEYS = ['company_address', 'mailing_address', 'personal_address']

const EMPTY_ADDRESS = { line1: '', line2: '', city: '', state: '', zip: '' }
const EMPTY_BILLING = { name: '', role: '', email: '', phone: '' }

function scalar(value) {
  return value === null || value === undefined ? '' : value
}

// Defined at module scope, never inside the form's render. A component declared
// inside a render is a NEW element type on every keystroke, so React unmounts
// the old input and mounts a fresh one — the field keeps its value (it is
// controlled) but loses focus after each character, which makes the form
// unusable. Caught in the browser, not by the build.
function TextField({ label, optional, value, error, type = 'text', placeholder, onChange }) {
  return (
    <FormField label={label} optional={optional}>
      <input
        type={type}
        className={`${inputCls} ${error ? errBorder : okBorder}`}
        value={scalar(value)}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </FormField>
  )
}

// A stored value the server's option list does not contain still has to be
// visible: rendering it as an empty select would show a blank field while
// silently submitting the old value, so it joins the list instead.
function SelectField({ label, optional, value, error, options, onChange }) {
  const current = scalar(value)
  const list = options || []
  const choices = current && !list.includes(current) ? [current, ...list] : list

  return (
    <FormField label={label} optional={optional}>
      <select
        className={`${inputCls} ${error ? errBorder : okBorder}`}
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">—</option>
        {choices.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </FormField>
  )
}

function AddressFields({ t, label, value, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v })

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <FormField label={t('portal.fields.line1')} optional>
            <input
              className={`${inputCls} ${okBorder}`}
              value={scalar(value.line1)}
              onChange={(e) => set('line1', e.target.value)}
            />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label={t('portal.fields.line2')} optional>
            <input
              className={`${inputCls} ${okBorder}`}
              value={scalar(value.line2)}
              onChange={(e) => set('line2', e.target.value)}
            />
          </FormField>
        </div>
        <FormField label={t('portal.fields.city')} optional>
          <input
            className={`${inputCls} ${okBorder}`}
            value={scalar(value.city)}
            onChange={(e) => set('city', e.target.value)}
          />
        </FormField>
        <FormField label={t('portal.fields.state')} optional>
          <select
            className={`${inputCls} ${okBorder}`}
            value={scalar(value.state)}
            onChange={(e) => set('state', e.target.value)}
          >
            <option value="">—</option>
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </FormField>
        <FormField label={t('portal.fields.zip')} optional>
          <input
            className={`${inputCls} ${okBorder}`}
            value={scalar(value.zip)}
            onChange={(e) => set('zip', e.target.value)}
          />
        </FormField>
      </div>
    </div>
  )
}

export default function PortalContractForm({ sessionToken, onClose, onSent }) {
  const { t } = useI18n()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState(null)
  const [meta, setMeta] = useState({ required_fields: [], stored: {}, options: {} })

  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [sentTo, setSentTo] = useState(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    fetchContractSubject(sessionToken).then(({ ok, status, data }) => {
      if (cancelled) return

      if (!ok || !data?.success) {
        // A portal session is single-active per customer: requesting a new code
        // anywhere rotates it, so an expired session is an ordinary outcome
        // here and deserves its own instruction rather than "try again".
        setLoadError(
          status === 401
            ? t('portal.contractForm.errorSession')
            : t('portal.contractForm.errorLoad'),
        )
        setLoading(false)
        return
      }

      const payload = data.subject
      const subject = payload.subject || {}

      setForm({
        ...subject,
        ssn: '',
        driver_license_number: '',
        // The server's field is `is_business?`; a trailing `?` cannot be a JS
        // identifier, so the form holds it under `is_business` and restores the
        // server's spelling on submit.
        is_business: subject['is_business?'] !== false,
        company_address: { ...EMPTY_ADDRESS, ...(subject.company_address || {}) },
        mailing_address: { ...EMPTY_ADDRESS, ...(subject.mailing_address || {}) },
        personal_address: { ...EMPTY_ADDRESS, ...(subject.personal_address || {}) },
        billing_contact: { ...EMPTY_BILLING, ...(subject.billing_contact || {}) },
      })

      setMeta({
        required_fields: payload.required_fields || [],
        stored: payload.stored || {},
        options: payload.options || {},
      })

      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [sessionToken, t])

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }, [])

  const setNested = useCallback((group, field, value) => {
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }))
  }, [])

  const required = (field) => meta.required_fields.includes(field)
  const errorFor = (field) => (errors[field] || [])[0]

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleDone = async () => {
    if (sending) return

    setSending(true)
    setErrors({})
    setFormError('')

    // `is_business?` is the server's field name; the trailing `?` is not valid
    // in a JS identifier, so the form holds it as `is_business`.
    const { is_business, ...rest } = form
    const payload = { ...rest, 'is_business?': is_business }

    const { ok, data } = await submitContractSubject(sessionToken, payload)
    setSending(false)

    if (ok && data?.success) {
      setSentTo(data.sent_to || '')
      onSent?.()
      return
    }

    if (data?.errors) {
      setErrors(data.errors)
      setFormError(t('portal.contractForm.errorFields'))
      return
    }

    if (data?.code === 'CONTRACT_INCOMPLETE') {
      setFormError(
        `${t('portal.contractForm.errorIncomplete')} ${(data.missing || []).join(', ')}`.trim(),
      )
      return
    }

    setFormError(data?.message || t('portal.contractForm.errorGeneric'))
  }

  // ── Shell ─────────────────────────────────────────────────────────────────
  const shell = (children) => (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="w-full max-w-3xl my-4 bg-white rounded-2xl shadow-ds-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
            {t('portal.contractForm.heading')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('portal.contractForm.closeBtn')}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700
                       hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )

  if (loading) {
    return shell(
      <div className="px-6 py-10 space-y-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-12 bg-gray-100 rounded-xl" />
        <div className="h-12 bg-gray-100 rounded-xl" />
        <div className="h-12 bg-gray-100 rounded-xl" />
      </div>,
    )
  }

  if (loadError) {
    return shell(
      <div className="px-6 py-10">
        <p className="text-sm text-red-700 font-medium text-center" role="alert">{loadError}</p>
      </div>,
    )
  }

  if (sentTo !== null) {
    return shell(
      <div className="px-6 py-10 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t('portal.contractForm.sentHeading')}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {t('portal.contractForm.sentBody').replace('{email}', sentTo)}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="px-7 py-3 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-md
                     shadow-ds-sm transition-colors duration-200 cursor-pointer focus:outline-none"
        >
          {t('portal.contractForm.closeBtn')}
        </button>
      </div>,
    )
  }

  return shell(
    <>
      <div className="px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
        <p className="text-sm text-gray-500 leading-relaxed">{t('portal.contractForm.intro')}</p>

        {/* Signer */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('portal.contractForm.sectionSigner')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
                label={t('portal.contractForm.firstName')}
                optional={!required('first_name')}
                value={form.first_name}
                error={errorFor('first_name')}
                onChange={(v) => setField('first_name', v)}
              />
            <TextField
                label={t('portal.contractForm.lastName')}
                optional={!required('last_name')}
                value={form.last_name}
                error={errorFor('last_name')}
                onChange={(v) => setField('last_name', v)}
              />
            <TextField
                label={t('portal.contractForm.title')}
                optional={!required('title')}
                value={form.title}
                error={errorFor('title')}
                onChange={(v) => setField('title', v)}
              />
            <TextField
                label={t('portal.fields.email')}
                optional={!required('email')}
                value={form.email}
                error={errorFor('email')}
                type="email"
                onChange={(v) => setField('email', v)}
              />
            <TextField
                label={t('portal.contractForm.phone')}
                optional={!required('phone')}
                value={form.phone}
                error={errorFor('phone')}
                type="tel"
                onChange={(v) => setField('phone', v)}
              />
          </div>
        </section>

        {/* Company + terms */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('portal.contractForm.sectionCompany')}
          </h3>

          <FormField label={t('portal.contractForm.accountKind')}>
            <select
              className={`${inputCls} ${okBorder}`}
              value={form.is_business ? 'business' : 'personal'}
              onChange={(e) => setField('is_business', e.target.value === 'business')}
            >
              <option value="business">{t('portal.contractForm.business')}</option>
              <option value="personal">{t('portal.contractForm.personal')}</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
                label={t('portal.fields.companyName')}
                optional={!required('company_name')}
                value={form.company_name}
                error={errorFor('company_name')}
                onChange={(v) => setField('company_name', v)}
              />
            <SelectField
              label={t('portal.contractForm.businessType')}
              optional={!required('business_type')}
              value={form.business_type}
              error={errorFor('business_type')}
              options={meta.options.business_type}
              onChange={(v) => setField('business_type', v)}
            />
            <TextField
                label={t('portal.contractForm.mc')}
                optional={!required('company_mc')}
                value={form.company_mc}
                error={errorFor('company_mc')}
                onChange={(v) => setField('company_mc', v)}
              />
            <TextField
                label={t('portal.contractForm.dot')}
                optional={!required('company_dot')}
                value={form.company_dot}
                error={errorFor('company_dot')}
                onChange={(v) => setField('company_dot', v)}
              />
            <TextField
                label={t('portal.contractForm.fleetSize')}
                optional={!required('fleet_size')}
                value={form.fleet_size}
                error={errorFor('fleet_size')}
                onChange={(v) => setField('fleet_size', v)}
              />
            <SelectField
              label={t('portal.contractForm.account')}
              optional={!required('account')}
              value={form.account}
              error={errorFor('account')}
              options={meta.options.account}
              onChange={(v) => setField('account', v)}
            />
            <TextField
                label={t('portal.contractForm.discountTier')}
                optional={!required('discount_tier')}
                value={form.discount_tier}
                error={errorFor('discount_tier')}
                onChange={(v) => setField('discount_tier', v)}
              />
            <SelectField
              label={t('portal.contractForm.billingSchedule')}
              optional={!required('billing_schedule')}
              value={form.billing_schedule}
              error={errorFor('billing_schedule')}
              options={meta.options.billing_schedule}
              onChange={(v) => setField('billing_schedule', v)}
            />
          </div>
        </section>

        {/* Addresses */}
        <section className="space-y-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('portal.contractForm.sectionAddresses')}
          </h3>
          {ADDRESS_KEYS.map((group) => (
            <AddressFields
              key={group}
              t={t}
              label={t(`portal.contractForm.${group}`)}
              value={form[group]}
              onChange={(value) => setForm((prev) => ({ ...prev, [group]: value }))}
            />
          ))}
        </section>

        {/* Billing contact */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('portal.contractForm.sectionBillingContact')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['name', 'role', 'email', 'phone'].map((key) => (
              <FormField key={key} label={t(`portal.contractForm.billing_${key}`)} optional>
                <input
                  className={`${inputCls} ${okBorder}`}
                  value={scalar(form.billing_contact[key])}
                  onChange={(e) => setNested('billing_contact', key, e.target.value)}
                />
              </FormField>
            ))}
          </div>
        </section>

        {/* Identity */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('portal.contractForm.sectionIdentity')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label={t('portal.contractForm.ssn')}
              optional={meta.stored.ssn || !required('ssn')}
            >
              <input
                type="password"
                autoComplete="off"
                className={`${inputCls} ${errorFor('ssn') ? errBorder : okBorder}`}
                value={scalar(form.ssn)}
                placeholder={meta.stored.ssn ? t('portal.contractForm.onFile') : ''}
                onChange={(e) => setField('ssn', e.target.value)}
              />
              {errorFor('ssn') && <p className="text-xs text-red-600 mt-1">{errorFor('ssn')}</p>}
            </FormField>

            <FormField
              label={t('portal.contractForm.driverLicense')}
              optional={meta.stored.driver_license_number || !required('driver_license_number')}
            >
              <input
                type="password"
                autoComplete="off"
                className={`${inputCls} ${errorFor('driver_license_number') ? errBorder : okBorder}`}
                value={scalar(form.driver_license_number)}
                placeholder={
                  meta.stored.driver_license_number ? t('portal.contractForm.onFile') : ''
                }
                onChange={(e) => setField('driver_license_number', e.target.value)}
              />
              {errorFor('driver_license_number') && (
                <p className="text-xs text-red-600 mt-1">{errorFor('driver_license_number')}</p>
              )}
            </FormField>

            <div className="sm:col-span-2">
              <TextField
                label={t('portal.contractForm.driverLicenseFile')}
                optional={!required('driver_license_file_name')}
                value={form.driver_license_file_name}
                error={errorFor('driver_license_file_name')}
                onChange={(v) => setField('driver_license_file_name', v)}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 space-y-3">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700 font-medium" role="alert">{formError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200
                       hover:bg-gray-50 rounded-md transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            {t('portal.contractForm.cancelBtn')}
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={sending}
            className="flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white
                       bg-primary hover:bg-secondary rounded-md shadow-ds-sm transition-colors duration-200
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Spinner />
                {t('portal.contractForm.sending')}
              </>
            ) : (
              t('portal.contractForm.doneBtn')
            )}
          </button>
        </div>
      </div>
    </>,
  )
}
