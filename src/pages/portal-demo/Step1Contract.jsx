// Step 1 — the updated contract's required details.
//
// Every field is a live input: no per-field "Edit" toggles. The customer fills
// the form top to bottom, and the sign button stays disabled until everything
// required validates.

import { useState } from 'react'
import { GROUPS, DERIVED_FIELDS } from './fields'
import DemoField from './inputs'
import { derived } from './formState'

function GroupCard({ group, values, errors, sameAs, showCrm, onChange, onToggleSameAs }) {
  const collapsed = !!group.sameAs && sameAs[group.id]

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{group.title}</h3>
        {group.blurb && <p className="text-sm text-gray-500 mt-0.5">{group.blurb}</p>}
      </div>

      {group.sameAs && (
        <label className="flex items-center gap-2.5 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!sameAs[group.id]}
            onChange={(e) => onToggleSameAs(group.id, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
          />
          <span className="text-sm text-gray-700">{group.sameAs.label}</span>
          {showCrm && (
            <code className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded px-1 py-px">
              {group.sameAs.crm}
            </code>
          )}
        </label>
      )}

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          {group.fields.map((field) => (
            <div key={field.key} className={field.span === 2 ? 'sm:col-span-2' : ''}>
              <DemoField
                field={field}
                value={values[field.key] ?? ''}
                error={errors[field.key]}
                showCrm={showCrm}
                onChange={(v) => onChange(field.key, v)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function DerivedPanel({ values }) {
  const [open, setOpen] = useState(false)
  const computed = derived(values)

  return (
    <section className="bg-gray-50 rounded-2xl border border-gray-200 p-5 sm:p-6">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <svg className={`w-4 h-4 transition-transform duration-ds-normal ${open ? 'rotate-90' : ''}`}
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        Fields we fill in for you
        <span className="text-xs font-normal text-gray-400">({DERIVED_FIELDS.length})</span>
      </button>

      {open && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500 mb-3">
            Not asked for — derived from what you entered or held internally.
          </p>
          {DERIVED_FIELDS.map((f) => (
            <div key={f.crm} className="flex items-baseline justify-between gap-4 text-xs py-1.5 border-b border-gray-200 last:border-0">
              <code className="text-gray-600 shrink-0">{f.crm}</code>
              <span className="text-gray-400 text-right">{computed[f.crm] || f.from}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Step1Contract({
  values, errors, sameAs, showCrm, showErrors, complete, signing,
  onChange, onToggleSameAs, onSign,
}) {
  const errorCount = Object.keys(errors).length

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">Review your updated contract details</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Our updated agreement asks for a few details we did not collect before. Fill them in, then sign.
        </p>
      </header>

      {GROUPS.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          values={values}
          errors={showErrors ? errors : {}}
          sameAs={sameAs}
          showCrm={showCrm}
          onChange={onChange}
          onToggleSameAs={onToggleSameAs}
        />
      ))}

      <DerivedPanel values={values} />

      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 -mx-4 px-4 py-4 sm:mx-0 sm:px-6 sm:rounded-2xl sm:border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <p className="text-sm text-gray-500">
            {complete
              ? 'All required details are filled in.'
              : showErrors && errorCount > 0
                ? `${errorCount} field${errorCount === 1 ? '' : 's'} still need${errorCount === 1 ? 's' : ''} attention.`
                : 'Complete every required field to enable signing.'}
          </p>
          <button
            type="button"
            onClick={onSign}
            disabled={!complete || signing}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                       shadow-ds-sm transition-colors duration-ds-normal cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            {signing ? 'Signing…' : 'Sign updated contract'}
          </button>
        </div>
      </div>
    </div>
  )
}
