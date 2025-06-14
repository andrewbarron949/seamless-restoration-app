export default function LocationNotesStep({ form }) {
  const { register, formState: { errors } } = form

  const roomLocations = [
    'Living Room',
    'Dining Room',
    'Kitchen',
    'Master Bedroom',
    'Bedroom',
    'Bathroom',
    'Master Bathroom',
    'Basement',
    'Attic',
    'Garage',
    'Home Office',
    'Laundry Room',
    'Hallway',
    'Closet',
    'Outdoor/Patio',
    'Other'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Location & Additional Notes
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Specify the location details and add any additional notes relevant to the inspection.
        </p>
      </div>

      <div>
        <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">
          Property Address *
        </label>
        <textarea
          id="propertyAddress"
          rows={2}
          {...register('propertyAddress', {
            required: 'Property address is required',
            minLength: {
              value: 10,
              message: 'Please provide a complete address'
            }
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter the full property address including street, city, state, and ZIP code"
        />
        {errors.propertyAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.propertyAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="roomLocation" className="block text-sm font-medium text-gray-700">
          Room/Area Location
        </label>
        <select
          id="roomLocation"
          {...register('roomLocation')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select room/area</option>
          {roomLocations.map(room => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Select the primary room or area where the item was located
        </p>
      </div>

      <div>
        <label htmlFor="inspectorNotes" className="block text-sm font-medium text-gray-700">
          Inspector Notes
        </label>
        <textarea
          id="inspectorNotes"
          rows={6}
          {...register('inspectorNotes')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Add any additional notes, observations, or relevant information about the inspection..."
        />
        <p className="mt-1 text-sm text-gray-500">
          Include any relevant details such as:
        </p>
        <ul className="mt-1 text-sm text-gray-500 list-disc list-inside space-y-1">
          <li>Environmental conditions during inspection</li>
          <li>Access limitations or restrictions</li>
          <li>Additional damage observed</li>
          <li>Repair recommendations</li>
          <li>Items that could not be inspected and why</li>
          <li>Communication with property owner/occupant</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">Good Practices</h4>
              <ul className="mt-1 text-sm text-green-700 list-disc list-inside space-y-1">
                <li>Be thorough and detailed</li>
                <li>Document any safety concerns</li>
                <li>Note weather conditions if relevant</li>
                <li>Record time spent on inspection</li>
              </ul>
            </div>
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
              <h4 className="text-sm font-medium text-blue-800">Remember</h4>
              <p className="mt-1 text-sm text-blue-700">
                Your notes will be part of the official record and may be reviewed by adjusters, attorneys, and other stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}