// Vertical step rail. Steps are numbered so the customer knows what is being
// asked, and normally neither is gated — both can be opened and completed in
// any order. A step can also arrive `locked` (ATTANTION-PAGE-01): a customer
// routed in from one of the real portal's gates is kept on the tab that sent
// them here until that gate's own condition clears, so a locked step ignores
// clicks instead of switching to it.

import { useI18n } from '../../context/I18nContext'
function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 9.75h10.5a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5z" />
    </svg>
  )
}

const DOT = {
  done:    'bg-green-600 text-white border-green-600',
  active:  'bg-primary text-white border-primary',
  pending: 'bg-amber-500 text-white border-amber-500',
  locked:  'bg-gray-100 text-gray-400 border-gray-200',
}

const LABEL = {
  done:    'text-gray-500',
  active:  'text-gray-900',
  pending: 'text-gray-900',
  locked:  'text-gray-400',
}

const STATUS_KEY = {
  done:    'attention.steps.done',
  active:  'attention.steps.active',
  pending: 'attention.steps.pending',
  locked:  'attention.steps.locked',
}

export default function Stepper({ steps, current, onSelect }) {
  const { t } = useI18n()
  return (
    <ol className="space-y-1">
      {steps.map((step, i) => {
        const isCurrent = step.id === current
        const locked = step.state === 'locked'

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => !locked && onSelect(step.id)}
              disabled={locked}
              aria-disabled={locked}
              className={`w-full text-left flex gap-3 rounded-xl px-3 py-3
                          transition-colors duration-ds-normal
                          ${locked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white'}
                          ${isCurrent ? 'bg-white shadow-ds-sm border border-gray-200' : 'border border-transparent'}`}
            >
              <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border flex items-center justify-center
                                text-xs font-bold ${DOT[step.state]}`}>
                {step.state === 'done' ? <CheckIcon /> : locked ? <LockIcon /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-semibold ${LABEL[step.state]}`}>{step.title}</span>
                <span className={`block text-xs mt-0.5 ${
                  step.state === 'active' ? 'text-primary font-medium'
                  : step.state === 'pending' ? 'text-amber-600 font-medium'
                  : 'text-gray-400'
                }`}>
                  {t(STATUS_KEY[step.state])}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
