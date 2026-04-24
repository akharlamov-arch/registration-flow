import { useI18n } from '../context/I18nContext'

/**
 * ProgressBar — step indicator dots + track bar
 * DS: space-2xl (48px) margin, primary color dots, 300ms transition
 */
export default function ProgressBar({ currentStep, totalSteps }) {
  const { t } = useI18n()
  const percent = totalSteps > 1 ? Math.round(((currentStep - 1) / (totalSteps - 1)) * 100) : 100

  return (
    // DS: space-2xl bottom margin (48px)
    <div className="mb-12 max-w-2xl mx-auto">

      {/* Step dots + connector lines */}
      <div className="flex items-center justify-center mb-3" role="list" aria-label="Form steps">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={stepNum} className="flex items-center">
              {/* Connector line — DS: primary when done, gray-200 when pending */}
              {i > 0 && (
                <div
                  className={`h-0.5 w-10 sm:w-14 transition-colors duration-300 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Dot — DS: ring-4 ring-primary/20 on current, shadow-ds-sm */}
              <div
                role="listitem"
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${t('progress.stepLabel')} ${stepNum}`}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300 select-none shadow-ds-sm
                  ${isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                    : 'bg-white text-slate-400 border-2 border-gray-200'
                  }
                `}
              >
                {isCompleted ? (
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

      {/* Counter — DS: text-ds-text muted */}
      <p className="text-center text-xs text-blue-400 mb-3 font-medium tracking-wide uppercase">
        {t('progress.stepLabel')} {currentStep} {t('progress.of')} {totalSteps}
      </p>

      {/* Progress track — DS: primary, 300ms */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out"
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
