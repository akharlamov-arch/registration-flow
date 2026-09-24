// Form controls for the attention page. Same design tokens as the registration
// flow, tuned denser: 14px text, tighter rows, left-aligned.
//
// The driver-licence attachment uses Attachment, which replicates the control
// the registration flow itself uses, uploading through the recording endpoint
// (PORTAL-UPLOAD-02). components/FileUpload.jsx is deliberately
// not used here: it belongs to the old PortalPage and appears nowhere in the
// registration flow.

import { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import FormField from '../../components/FormField'
import PhoneInput from '../../components/PhoneInput'
import Attachment from './Attachment'
import InfoTooltip from './InfoTooltip'
import { uploadDriverLicense } from '../../api/portal'
import { US_STATES } from '../../components/ReviewCard'

export const inputCls =
  // 16px on touch devices: anything smaller makes mobile Safari zoom the
  // page on focus. Desktop keeps the denser 14px.
  'w-full px-3 py-2 text-sm [@media(pointer:coarse)]:text-base rounded-lg border border-gray-300 text-gray-900 bg-white ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 ' +
  'focus:border-primary transition-colors duration-ds-normal'

export const errorCls = 'border-red-400 focus:border-red-400 focus:ring-red-200'

function digitsOnly(v) {
  return v.replace(/\D/g, '')
}

export function formatSsn(digits) {
  const d = digits.slice(0, 9)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

// Shows only the last 4 characters once the value leaves focus. The full value
// stays in state and is what the submit payload carries — masking is display
// only.
export function maskTail(value) {
  const clean = String(value || '').replace(/[\s-]/g, '')
  if (clean.length <= 4) return clean
  return '•'.repeat(clean.length - 4) + clean.slice(-4)
}

function SecretInput({ value, onChange, invalid, format, digits, placeholder }) {
  const [focused, setFocused] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const show = focused || revealed

  const display = show
    ? (format === 'ssn' ? formatSsn(value) : value)
    : maskTail(value)

  return (
    <div className="relative">
      <input
        type="text"
        inputMode={format === 'ssn' ? 'numeric' : 'text'}
        autoComplete="off"
        className={`${inputCls} pr-16 font-mono tracking-wide ${invalid ? errorCls : ''}`}
        aria-invalid={invalid}
        value={display}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const next = format === 'ssn'
            ? digitsOnly(e.target.value).slice(0, digits || 9)
            : e.target.value
          onChange(next)
        }}
      />
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 px-1.5 py-1"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

// `tooltip: { key, href }` from `fields.js`: the explanation, then the link it
// points at, shown by host so the customer can see where it leads.
function FieldTooltip({ tooltip }) {
  const { t } = useI18n()

  return (
    <InfoTooltip label={t('attention.fields.moreInfo')}>
      {t(tooltip.key)}{' '}
      {tooltip.href && (
        <a
          href={tooltip.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2"
        >
          {new URL(tooltip.href).host}
        </a>
      )}
    </InfoTooltip>
  )
}

/** Renders one field from the `fields.js` table. Labels, placeholders and the
 *  error message arrive as translation keys and are resolved here. */
export default function PortalField({ field, value, error, onChange, token }) {
  const { t } = useI18n()
  const invalid = !!error
  const label = field.labelKey ? t(field.labelKey) : field.label
  const placeholder = field.placeholderKey ? t(field.placeholderKey) : field.placeholder
  const hint = field.hintKey ? t(field.hintKey) : field.hint
  const message = error ? t(error) : undefined

  if (field.type === 'readonly') {
    return (
      <div>
        <span className="flex items-center text-sm font-medium text-slate-900 mb-1.5">
          {label}
          {field.tooltip && <FieldTooltip tooltip={field.tooltip} />}
        </span>
        <div className="px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
          {value || '—'}
        </div>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    )
  }

  let control
  switch (field.type) {
    case 'select':
      control = (
        <select className={`${inputCls} ${invalid ? errorCls : ''}`} aria-invalid={invalid} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{t('common.selectPlaceholder')}</option>
          {field.options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      )
      break
    case 'state':
      control = (
        <select className={`${inputCls} ${invalid ? errorCls : ''}`} aria-invalid={invalid} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{t('address.placeholderState')}</option>
          {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      )
      break
    case 'phone':
      control = <PhoneInput className={`${inputCls} ${invalid ? errorCls : ''}`} aria-invalid={invalid} value={value} onChange={onChange} />
      break
    case 'secret':
      control = (
        <SecretInput
          value={value}
          onChange={onChange}
          invalid={invalid}
          format={field.format}
          digits={field.digits}
          placeholder={placeholder}
        />
      )
      break
    case 'file':
      // The contract form's only file is the driver-licence scan; it goes
      // through the recording endpoint so a reload before signing keeps it.
      control = (
        <Attachment
          value={value}
          onChange={onChange}
          invalid={invalid}
          upload={async (file) => {
            const { ok, data } = await uploadDriverLicense(token, file)
            return ok && data?.success ? { ok: true, key: data.file?.name } : { ok: false, code: data?.code }
          }}
        />
      )
      break
    case 'zip':
      control = (
        <input
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          aria-invalid={invalid}
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(digitsOnly(e.target.value).slice(0, 5))}
        />
      )
      break
    case 'number':
      control = (
        <input
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          aria-invalid={invalid}
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(digitsOnly(e.target.value).slice(0, 5))}
        />
      )
      break
    default:
      control = (
        <input
          type={field.type === 'email' ? 'email' : 'text'}
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          aria-invalid={invalid}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }

  return (
    <FormField label={label} required={field.required} optional={!field.required} error={message} hint={hint}>
      {control}
    </FormField>
  )
}
