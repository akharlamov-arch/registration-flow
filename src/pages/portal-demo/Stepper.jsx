// Vertical step rail. Steps are ordered and gated: step 2 only opens once
// step 1 is signed, so the customer always knows what is being asked next.

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 21h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12v6.75A2.25 2.25 0 006.75 21z" />
    </svg>
  )
}

const DOT = {
  done:    'bg-green-600 text-white border-green-600',
  active:  'bg-primary text-white border-primary',
  locked:  'bg-white text-gray-300 border-gray-200',
}

const LABEL = {
  done:   'text-gray-500',
  active: 'text-gray-900',
  locked: 'text-gray-400',
}

const STATUS_TEXT = {
  done:   'Completed',
  active: 'Action required',
  locked: 'Locked',
}

export default function Stepper({ steps, current, onSelect }) {
  return (
    <ol className="space-y-1">
      {steps.map((step, i) => {
        const selectable = step.state !== 'locked'
        const isCurrent = step.id === current

        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={!selectable}
              onClick={() => selectable && onSelect(step.id)}
              className={`w-full text-left flex gap-3 rounded-xl px-3 py-3 transition-colors duration-ds-normal
                          ${isCurrent ? 'bg-white shadow-ds-sm border border-gray-200' : 'border border-transparent'}
                          ${selectable ? 'cursor-pointer hover:bg-white' : 'cursor-not-allowed'}`}
            >
              <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border flex items-center justify-center
                                text-xs font-bold ${DOT[step.state]}`}>
                {step.state === 'done' ? <CheckIcon /> : step.state === 'locked' ? <LockIcon /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-semibold ${LABEL[step.state]}`}>{step.title}</span>
                <span className={`block text-xs mt-0.5 ${
                  step.state === 'active' ? 'text-primary font-medium' : 'text-gray-400'
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
