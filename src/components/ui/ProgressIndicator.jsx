export default function ProgressIndicator({ steps, currentStep }) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-4">
      {/* Mobile Progress Bar */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-primary-600 font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="progress-bar mt-2">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-sm font-medium text-gray-900">
          {steps[currentStep].title}
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <nav aria-label="Progress" className="hidden sm:block">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li key={step.id} className="relative flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    index < currentStep
                      ? 'border-primary-600 bg-primary-600 shadow-md'
                      : index === currentStep
                      ? 'border-primary-600 bg-white ring-4 ring-primary-100'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        index === currentStep ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              
              {index !== steps.length - 1 && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-32">
                  <div className={`h-0.5 transition-colors duration-200 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}