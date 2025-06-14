export default function ProgressIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            <div className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index < currentStep
                      ? 'border-indigo-600 bg-indigo-600'
                      : index === currentStep
                      ? 'border-indigo-600 bg-white'
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
                      className={`text-sm font-medium ${
                        index === currentStep ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    index <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
            
            {index !== steps.length - 1 && (
              <div className="absolute top-5 left-5 -ml-px mt-0.5 h-px w-8 sm:w-20 bg-gray-300" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}