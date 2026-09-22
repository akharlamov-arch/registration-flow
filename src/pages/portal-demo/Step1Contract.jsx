// Step 1 — the updated contract's required details.
//
// Every field is a live input: no per-field "Edit" toggles. The customer fills
// the form top to bottom, and the sign button stays disabled until everything
// required validates.
//
// Groups that carry a `choice` render the same radio set as the matching
// registration step, and reveal their inputs only on the option that needs them.

import { GROUPS } from './fields'
import DemoField from './inputs'
import { groupHidden } from './formState'

function ChoiceRadios({ group, selected, onSelect }) {
  const { key, options, hint } = group.choice

  return (
    <div className="space-y-2 mb-5">
      {options.map(([value, label]) => {
        const active = selected === value
        return (
          <label
            key={value}
            className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border cursor-pointer
                        transition-colors duration-ds-normal
                        ${active ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <input
              type="radio"
              name={key}
              value={value}
              checked={active}
              onChange={() => onSelect(group.id, value)}
              className="mt-0.5 w-4 h-4 border-gray-300 text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="min-w-0">
              <span className={`block text-sm ${active ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                {label}
              </span>
              {active && hint && value === options[0][0] && (
                <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{hint}</span>
              )}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function GroupCard({ group, values, errors, choices, onChange, onSelectChoice }) {
  const hidden = groupHidden(group, choices)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{group.title}</h3>
        {group.blurb && <p className="text-sm text-gray-500 mt-0.5">{group.blurb}</p>}
      </div>

      {group.choice && (
        <ChoiceRadios group={group} selected={choices[group.id]} onSelect={onSelectChoice} />
      )}

      {!hidden && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            {group.fields.map((field) => (
              <div
                key={field.key}
                id={`field-${field.key}`}
                className={field.span === 2 ? 'sm:col-span-2' : ''}
              >
                <DemoField
                  field={field}
                  value={values[field.key] ?? ''}
                  error={errors[field.key]}
                  onChange={(v) => onChange(field.key, v)}
                />
              </div>
            ))}
          </div>

          {group.notice && (
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">{group.notice}</p>
          )}
        </>
      )}
    </section>
  )
}

export default function Step1Contract({
  values, errors, choices, showErrors, complete, signing,
  onChange, onSelectChoice, onSign,
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
          choices={choices}
          onChange={onChange}
          onSelectChoice={onSelectChoice}
        />
      ))}

      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 -mx-4 px-4 py-4 sm:mx-0 sm:px-6 sm:rounded-2xl sm:border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <p className="text-sm text-gray-500">
            {complete
              ? 'All required details are filled in.'
              : showErrors && errorCount > 0
                ? `${errorCount} field${errorCount === 1 ? '' : 's'} still need${errorCount === 1 ? 's' : ''} attention — highlighted in red above.`
                : 'Fill in every required field, then sign.'}
          </p>
          <button
            type="button"
            onClick={onSign}
            disabled={signing}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                       shadow-ds-sm transition-colors duration-ds-normal cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signing ? 'Signing…' : 'Sign updated contract'}
          </button>
        </div>
      </div>
    </div>
  )
}
