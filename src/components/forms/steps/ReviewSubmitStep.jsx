export default function ReviewSubmitStep({ form }) {
  const { watch } = form
  const formData = watch()

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString()
  }

  const formatList = (array) => {
    if (!Array.isArray(array) || array.length === 0) return 'None specified'
    return array.join(', ')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Review & Submit
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please review all information before submitting the inspection. You can go back to make changes if needed.
        </p>
      </div>

      {/* Case Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Case Information
        </h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Case Number</dt>
            <dd className="text-sm text-gray-900">{formData.caseNumber || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Claim Number</dt>
            <dd className="text-sm text-gray-900">{formData.claimNumber || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Insurance Company</dt>
            <dd className="text-sm text-gray-900">{formData.insuranceCompany || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Policy Holder</dt>
            <dd className="text-sm text-gray-900">{formData.policyHolder || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Date of Loss</dt>
            <dd className="text-sm text-gray-900">{formatDate(formData.dateOfLoss)}</dd>
          </div>
        </dl>
      </div>

      {/* Item Details Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Item Details & Damage
        </h4>
        <dl className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Item Category</dt>
              <dd className="text-sm text-gray-900">{formData.itemCategory || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Item Age</dt>
              <dd className="text-sm text-gray-900">{formData.itemAge || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Condition Before Loss</dt>
              <dd className="text-sm text-gray-900">{formData.itemConditionBefore || 'Not specified'}</dd>
            </div>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Item Description</dt>
            <dd className="text-sm text-gray-900">{formData.itemDescription || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Types of Damage</dt>
            <dd className="text-sm text-gray-900">{formatList(formData.damageType)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Damage Description</dt>
            <dd className="text-sm text-gray-900">{formData.damageDescription || 'Not specified'}</dd>
          </div>
        </dl>
      </div>

      {/* Location & Notes Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location & Notes
        </h4>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Property Address</dt>
            <dd className="text-sm text-gray-900">{formData.propertyAddress || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Room/Area Location</dt>
            <dd className="text-sm text-gray-900">{formData.roomLocation || 'Not specified'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Inspector Notes</dt>
            <dd className="text-sm text-gray-900">
              {formData.inspectorNotes ? (
                <div className="whitespace-pre-wrap">{formData.inspectorNotes}</div>
              ) : (
                'No additional notes'
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Photos Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Photos ({formData.photos?.length || 0})
        </h4>
        {formData.photos && formData.photos.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {formData.photos.map((photo, index) => (
              <div key={photo.id || index} className="aspect-square">
                <img
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md border border-gray-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No photos uploaded</p>
        )}
      </div>

      {/* Submission Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Ready to Submit</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                By submitting this inspection, I certify that the information provided is accurate and complete to the best of my knowledge.
                The inspection will be saved to the database and cannot be modified after submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Required Fields Warning */}
      {(!formData.caseNumber || !formData.claimNumber || !formData.insuranceCompany || !formData.policyHolder || !formData.dateOfLoss || !formData.itemCategory || !formData.itemDescription || !formData.damageDescription || !formData.propertyAddress) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Missing Required Information</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Please go back and complete all required fields before submitting.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}