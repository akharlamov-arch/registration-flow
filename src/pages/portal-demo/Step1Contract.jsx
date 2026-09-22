// Step 1 — the updated contract's required details.
//
// Every field is a live input: no per-field "Edit" toggles. The customer fills
// the form top to bottom, and the sign button stays disabled until everything
// required validates.
//
// Groups that carry a `choice` render the same radio set as the matching
// registration step, and reveal their inputs only on the option that needs them.

import { useI18n } from '../../context/I18nContext'
import { GROUPS } from './fields'
import DemoField from './inputs'
import { groupHidden } from './formState'

function ChoiceRadios({ group, selected, onSelect }) {
  const { t } = useI18n()
  const { key, options, hintKey } = group.choice

  return (
    <div className="space-y-2 mb-5">
      {options.map(([value, labelKey]) => {
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
                {t(labelKey)}
              </span>
              {active && hintKey && value === options[0][0] && (
                <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{t(hintKey)}</span>
              )}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function GroupCard({ group, values, errors, choices, onChange, onSelectChoice }) {
  const { t } = useI18n()
  const hidden = groupHidden(group, choices)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-ds-sm p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{t(group.titleKey)}</h3>
        {group.blurbKey && <p className="text-sm text-gray-500 mt-0.5">{t(group.blurbKey)}</p>}
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

          {group.noticeKey && (
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">{t(group.noticeKey)}</p>
          )}
        </>
      )}
    </section>
  )
}

// Copy differs between first signing and a later change request; everything
// else — fields, validation, the red-highlight behaviour — is identical, so the
// customer edits the same form they filled originally.

export default function Step1Contract({
  values, errors, choices, showErrors, complete, signing, mode = 'sign',
  onChange, onSelectChoice, onSign, onCancel,
}) {
  const { t } = useI18n()
  const errorCount = Object.keys(errors).length
  const copy = (k) => t(`portalDemo.${mode}.${k}`)

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h2 className="text-xl font-bold text-gray-900">{copy('heading')}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">{copy('blurb')}</p>
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
              ? copy('ready')
              : showErrors && errorCount > 0
                ? `${errorCount} ${t(errorCount === 1 ? 'portalDemo.needAttentionOne' : 'portalDemo.needAttentionMany')}`
                : copy('idle')}
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:items-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         hover:bg-gray-50 rounded-lg transition-colors duration-ds-normal"
            >
              {t('portalDemo.cancel')}
            </button>
          )}
          <button
            type="button"
            onClick={onSign}
            disabled={signing}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-secondary rounded-lg
                       shadow-ds-sm transition-colors duration-ds-normal cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signing ? copy('busy') : copy('submit')}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
