// Form controls for the portal demo. Same design tokens as the registration
// flow, tuned denser: 14px text, tighter rows, left-aligned.

import { useState } from 'react'
import FormField from '../../components/FormField'
import PhoneInput from '../../components/PhoneInput'
import { US_STATES } from '../../components/ReviewCard'

export const inputCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-900 bg-white ' +
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
// only, matching "к нам номер будет попадать полностью".
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

function FileInput({ value, onChange, invalid }) {
  return (
    <div>
      <label
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed cursor-pointer
                    transition-colors duration-ds-normal hover:bg-gray-50
                    ${invalid ? 'border-red-400' : 'border-gray-300'}`}
      >
        <span className="text-xs font-semibold text-primary shrink-0">Choose file</span>
        <span className="text-sm text-gray-500 truncate">{value || 'No file selected'}</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
        />
      </label>
    </div>
  )
}

/** Renders one field from the `fields.js` table. */
export default function DemoField({ field, value, error, onChange }) {
  const invalid = !!error

  const label = field.label

  if (field.type === 'readonly') {
    return (
      <div>
        <span className="block text-sm font-medium text-slate-900 mb-1.5">{label}</span>
        <div className="px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
          {value || '—'}
        </div>
        {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
      </div>
    )
  }

  let control
  switch (field.type) {
    case 'select':
      control = (
        <select className={`${inputCls} ${invalid ? errorCls : ''}`} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
      break
    case 'state':
      control = (
        <select className={`${inputCls} ${invalid ? errorCls : ''}`} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      )
      break
    case 'phone':
      control = (
        <PhoneInput className={`${inputCls} ${invalid ? errorCls : ''}`} value={value} onChange={onChange} />
      )
      break
    case 'secret':
      control = (
        <SecretInput
          value={value}
          onChange={onChange}
          invalid={invalid}
          format={field.format}
          digits={field.digits}
          placeholder={field.format === 'ssn' ? '000-00-0000' : ''}
        />
      )
      break
    case 'file':
      control = <FileInput value={value} onChange={onChange} invalid={invalid} />
      break
    case 'zip':
      control = (
        <input
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          inputMode="numeric"
          value={value}
          placeholder="00000"
          onChange={(e) => onChange(digitsOnly(e.target.value).slice(0, 5))}
        />
      )
      break
    case 'number':
      control = (
        <input
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(digitsOnly(e.target.value).slice(0, 5))}
        />
      )
      break
    default:
      control = (
        <input
          type={field.type === 'email' ? 'email' : 'text'}
          className={`${inputCls} ${invalid ? errorCls : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }

  return (
    <FormField label={label} required={field.required} optional={!field.required} error={error} hint={field.hint}>
      {control}
    </FormField>
  )
}
