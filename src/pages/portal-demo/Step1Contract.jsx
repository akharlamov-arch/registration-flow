// Step 1 — the updated contract's required details.
//
// Every field is a live input: no per-field "Edit" toggles. The customer fills
// the form top to bottom, and the sign button stays disabled until everything
// required validates.

import { GROUPS } from './fields'
import DemoField from './inputs'

function GroupCard({ group, values, errors, sameAs, onChange, onToggleSameAs }) {
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
                onChange={(v) => onChange(field.key, v)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Step1Contract({
  values, errors, sameAs, showErrors, complete, signing,
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
          onChange={onChange}
          onToggleSameAs={onToggleSameAs}
        />
      ))}

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
