// Vertical step rail. Steps are numbered so the customer knows what is being
// asked, but neither is gated — both can be opened and completed in any order.

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

const DOT = {
  done:    'bg-green-600 text-white border-green-600',
  active:  'bg-primary text-white border-primary',
  pending: 'bg-amber-500 text-white border-amber-500',
}

const LABEL = {
  done:    'text-gray-500',
  active:  'text-gray-900',
  pending: 'text-gray-900',
}

const STATUS_TEXT = {
  done:    'Completed',
  active:  'Action required',
  pending: 'Awaiting review',
}

export default function Stepper({ steps, current, onSelect }) {
  return (
    <ol className="space-y-1">
      {steps.map((step, i) => {
        const isCurrent = step.id === current

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              className={`w-full text-left flex gap-3 rounded-xl px-3 py-3 cursor-pointer
                          transition-colors duration-ds-normal hover:bg-white
                          ${isCurrent ? 'bg-white shadow-ds-sm border border-gray-200' : 'border border-transparent'}`}
            >
              <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border flex items-center justify-center
                                text-xs font-bold ${DOT[step.state]}`}>
                {step.state === 'done' ? <CheckIcon /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-semibold ${LABEL[step.state]}`}>{step.title}</span>
                <span className={`block text-xs mt-0.5 ${
                  step.state === 'active' ? 'text-primary font-medium'
                  : step.state === 'pending' ? 'text-amber-600 font-medium'
                  : 'text-gray-400'
                }`}>
                  {STATUS_TEXT[step.state]}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
