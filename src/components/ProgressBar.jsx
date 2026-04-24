import { useI18n } from '../context/I18nContext'

/**
 * ProgressBar — step indicator dots + track bar
 *
 * Props:
 *   currentStep  — 1-based current step number
 *   totalSteps   — total number of steps
 */
export default function ProgressBar({ currentStep, totalSteps }) {
  const { t } = useI18n()
  const percent = totalSteps > 1 ? Math.round(((currentStep - 1) / (totalSteps - 1)) * 100) : 100

  return (
    <div className="mb-8 max-w-2xl mx-auto">

      {/* Step dots */}
      <div className="flex items-center justify-center mb-4" role="list" aria-label="Form steps">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={stepNum} className="flex items-center">
              {/* Connector line (not before first dot) */}
              {i > 0 && (
                <div
                  className={`h-0.5 w-8 sm:w-12 transition-colors duration-300 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Dot */}
              <div
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${t('progress.stepLabel')} ${stepNum}`}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300 select-none
                  ${isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-100 text-slate-400 border border-gray-200'
                  }
                `}
              >
                {isCompleted ? (
                  /* Checkmark */
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Counter text */}
      <p className="text-center text-xs text-slate-400 mb-2 font-medium">
        {t('progress.stepLabel')} {currentStep} {t('progress.of')} {totalSteps}
      </p>

      {/* Progress track */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
