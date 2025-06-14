export default function CaseInformationStep({ form }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Case Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Enter the basic case and claim information for this inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">
            Case Number *
          </label>
          <input
            id="caseNumber"
            type="text"
            {...register('caseNumber', {
              required: 'Case number is required',
              minLength: {
                value: 3,
                message: 'Case number must be at least 3 characters'
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter case number"
          />
          {errors.caseNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.caseNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="claimNumber" className="block text-sm font-medium text-gray-700">
            Claim Number *
          </label>
          <input
            id="claimNumber"
            type="text"
            {...register('claimNumber', {
              required: 'Claim number is required',
              minLength: {
                value: 3,
                message: 'Claim number must be at least 3 characters'
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter claim number"
          />
          {errors.claimNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.claimNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-700">
            Insurance Company *
          </label>
          <select
            id="insuranceCompany"
            {...register('insuranceCompany', {
              required: 'Insurance company is required'
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select insurance company</option>
            <option value="State Farm">State Farm</option>
            <option value="Allstate">Allstate</option>
            <option value="GEICO">GEICO</option>
            <option value="Progressive">Progressive</option>
            <option value="USAA">USAA</option>
            <option value="Liberty Mutual">Liberty Mutual</option>
            <option value="Farmers">Farmers</option>
            <option value="Nationwide">Nationwide</option>
            <option value="American Family">American Family</option>
            <option value="Travelers">Travelers</option>
            <option value="Other">Other</option>
          </select>
          {errors.insuranceCompany && (
            <p className="mt-1 text-sm text-red-600">{errors.insuranceCompany.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="policyHolder" className="block text-sm font-medium text-gray-700">
            Policy Holder Name *
          </label>
          <input
            id="policyHolder"
            type="text"
            {...register('policyHolder', {
              required: 'Policy holder name is required',
              minLength: {
                value: 2,
                message: 'Policy holder name must be at least 2 characters'
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter policy holder name"
          />
          {errors.policyHolder && (
            <p className="mt-1 text-sm text-red-600">{errors.policyHolder.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfLoss" className="block text-sm font-medium text-gray-700">
            Date of Loss *
          </label>
          <input
            id="dateOfLoss"
            type="date"
            {...register('dateOfLoss', {
              required: 'Date of loss is required',
              validate: (value) => {
                const selectedDate = new Date(value)
                const today = new Date()
                today.setHours(23, 59, 59, 999) // Set to end of today
                
                if (selectedDate > today) {
                  return 'Date of loss cannot be in the future'
                }
                return true
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.dateOfLoss && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfLoss.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> All fields marked with * are required. Please ensure all information is accurate before proceeding to the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}