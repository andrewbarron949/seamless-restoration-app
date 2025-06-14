export default function ItemDetailsStep({ form }) {
  const { register, watch, setValue, formState: { errors } } = form
  const selectedDamageTypes = watch('damageType') || []

  const handleDamageTypeChange = (damageType, checked) => {
    if (checked) {
      setValue('damageType', [...selectedDamageTypes, damageType])
    } else {
      setValue('damageType', selectedDamageTypes.filter(type => type !== damageType))
    }
  }

  const damageTypes = [
    'Water Damage',
    'Fire Damage',
    'Smoke Damage',
    'Mold Damage',
    'Wind Damage',
    'Hail Damage',
    'Vandalism',
    'Theft',
    'Impact Damage',
    'Wear & Tear',
    'Other'
  ]

  const itemCategories = [
    'Furniture',
    'Electronics',
    'Appliances',
    'Clothing',
    'Jewelry',
    'Artwork',
    'Books/Documents',
    'Tools',
    'Sporting Goods',
    'Kitchenware',
    'Home Decor',
    'Other'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Item Details & Damage Assessment
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Provide detailed information about the damaged item(s) and the nature of the damage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700">
            Item Category *
          </label>
          <select
            id="itemCategory"
            {...register('itemCategory', {
              required: 'Item category is required'
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select category</option>
            {itemCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.itemCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.itemCategory.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="itemAge" className="block text-sm font-medium text-gray-700">
            Approximate Age
          </label>
          <select
            id="itemAge"
            {...register('itemAge')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select age range</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="6-10 years">6-10 years</option>
            <option value="11-20 years">11-20 years</option>
            <option value="More than 20 years">More than 20 years</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">
          Item Description *
        </label>
        <textarea
          id="itemDescription"
          rows={3}
          {...register('itemDescription', {
            required: 'Item description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters'
            }
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Provide a detailed description of the item (brand, model, size, color, etc.)"
        />
        {errors.itemDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.itemDescription.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="itemConditionBefore" className="block text-sm font-medium text-gray-700">
          Condition Before Loss
        </label>
        <select
          id="itemConditionBefore"
          {...register('itemConditionBefore')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select condition</option>
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type of Damage * (Select all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {damageTypes.map(damageType => (
            <label key={damageType} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDamageTypes.includes(damageType)}
                onChange={(e) => handleDamageTypeChange(damageType, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{damageType}</span>
            </label>
          ))}
        </div>
        {errors.damageType && (
          <p className="mt-1 text-sm text-red-600">{errors.damageType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="damageDescription" className="block text-sm font-medium text-gray-700">
          Damage Description *
        </label>
        <textarea
          id="damageDescription"
          rows={4}
          {...register('damageDescription', {
            required: 'Damage description is required',
            minLength: {
              value: 20,
              message: 'Damage description must be at least 20 characters'
            }
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Describe the damage in detail - what happened, extent of damage, areas affected, etc."
        />
        {errors.damageDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.damageDescription.message}</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> Be as specific as possible in your descriptions. This information will be used for claim processing and may affect settlement amounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}