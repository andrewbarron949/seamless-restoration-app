export default function CaseInformationStep({ form }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Case Information
        </h3>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Enter the basic case and claim information for this inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="caseNumber" className="form-label">
            Case Number <span className="text-red-500">*</span>
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
            className="input-field"
            placeholder="Enter case number"
          />
          {errors.caseNumber && (
            <p className="form-error">{errors.caseNumber.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="claimNumber" className="form-label">
            Claim Number <span className="text-red-500">*</span>
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
            className="input-field"
            placeholder="Enter claim number"
          />
          {errors.claimNumber && (
            <p className="form-error">{errors.claimNumber.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="insuranceCompany" className="form-label">
            Insurance Company <span className="text-red-500">*</span>
          </label>
          <select
            id="insuranceCompany"
            {...register('insuranceCompany', {
              required: 'Insurance company is required'
            })}
            className="input-field"
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
            <p className="form-error">{errors.insuranceCompany.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="policyHolder" className="form-label">
            Policy Holder Name <span className="text-red-500">*</span>
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
            className="input-field"
            placeholder="Enter policy holder name"
          />
          {errors.policyHolder && (
            <p className="form-error">{errors.policyHolder.message}</p>
          )}
        </div>

        <div className="form-group lg:col-span-2">
          <label htmlFor="dateOfLoss" className="form-label">
            Date of Loss <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfLoss"
            type="date"
            {...register('dateOfLoss', {
              required: 'Date of loss is required',
              validate: (value) => {
                const selectedDate = new Date(value)
                const today = new Date()
                today.setHours(23, 59, 59, 999)
                
                if (selectedDate > today) {
                  return 'Date of loss cannot be in the future'
                }
                return true
              }
            })}
            className="input-field max-w-xs"
          />
          {errors.dateOfLoss && (
            <p className="form-error">{errors.dateOfLoss.message}</p>
          )}
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-semibold text-primary-800 mb-1">
              Important Information
            </h4>
            <p className="text-sm text-primary-700">
              All fields marked with <span className="text-red-500 font-medium">*</span> are required. Please ensure all information is accurate before proceeding to the next step. This information will be used to identify and track your inspection case.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}