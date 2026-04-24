/**
 * StepIndicator — icon-based step progress
 * Props:
 *   steps: [{ label: string, icon: JSX }]
 *   currentStep: number (1-based)
 */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="mb-6 sm:mb-10" role="list" aria-label="Form steps">
      <div className="flex items-center justify-center">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent  = stepNum === currentStep

          return (
            <div key={stepNum} className="flex items-center">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`h-px w-12 sm:w-20 transition-colors duration-300 ${
                    isCompleted ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  role="listitem"
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={step.label}
                  className={[
                    'w-11 h-11 rounded-full flex items-center justify-center',
                    'transition-all duration-300 select-none',
                    isCompleted
                      ? 'bg-gray-700 text-white'
                      : isCurrent
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400 border border-gray-200',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    /* Checkmark for completed */
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
