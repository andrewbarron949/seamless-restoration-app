import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { createInspection, uploadInspectionPhotos } from '../../lib/inspections'
import ProgressIndicator from '../ui/ProgressIndicator'
import CaseInformationStep from './steps/CaseInformationStep'
import ItemDetailsStep from './steps/ItemDetailsStep'
import LocationNotesStep from './steps/LocationNotesStep'
import PhotoUploadStep from './steps/PhotoUploadStep'
import ReviewSubmitStep from './steps/ReviewSubmitStep'

const STEPS = [
  { id: 'case-info', title: 'Case Information', component: CaseInformationStep },
  { id: 'item-details', title: 'Item Details', component: ItemDetailsStep },
  { id: 'location-notes', title: 'Location & Notes', component: LocationNotesStep },
  { id: 'photos', title: 'Photos', component: PhotoUploadStep },
  { id: 'review', title: 'Review & Submit', component: ReviewSubmitStep }
]

export default function InspectionForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      // Case Information
      caseNumber: '',
      claimNumber: '',
      insuranceCompany: '',
      policyHolder: '',
      dateOfLoss: '',
      
      // Item Details
      itemCategory: '',
      itemDescription: '',
      itemAge: '',
      itemConditionBefore: '',
      damageDescription: '',
      damageType: [],
      
      // Location & Notes
      propertyAddress: '',
      roomLocation: '',
      inspectorNotes: '',
      
      // Photos
      photos: [],
      
      // System fields
      inspectorId: user?.id || '',
      status: 'draft'
    },
    mode: 'onChange'
  })

  // Auto-save functionality
  useEffect(() => {
    const subscription = form.watch((value) => {
      const timeoutId = setTimeout(() => {
        saveDraftToLocalStorage(value)
      }, 1000) // Debounce for 1 second

      return () => clearTimeout(timeoutId)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = loadDraftFromLocalStorage()
    if (savedDraft) {
      Object.keys(savedDraft).forEach(key => {
        form.setValue(key, savedDraft[key])
      })
    }
  }, [form])

  const saveDraftToLocalStorage = (data) => {
    try {
      localStorage.setItem('inspection-draft', JSON.stringify({
        ...data,
        lastSaved: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  const loadDraftFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('inspection-draft')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load draft:', error)
      return null
    }
  }

  const clearDraftFromLocalStorage = () => {
    try {
      localStorage.removeItem('inspection-draft')
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }

  const validateCurrentStep = async () => {
    const stepFields = getFieldsForStep(currentStep)
    const isValid = await form.trigger(stepFields)
    return isValid
  }

  const getFieldsForStep = (stepIndex) => {
    const fieldsByStep = {
      0: ['caseNumber', 'claimNumber', 'insuranceCompany', 'policyHolder', 'dateOfLoss'],
      1: ['itemCategory', 'itemDescription', 'damageDescription', 'damageType'],
      2: ['propertyAddress', 'roomLocation'],
      3: [], // Photos step - validation handled separately
      4: [] // Review step - no new fields
    }
    return fieldsByStep[stepIndex] || []
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Create inspection record
      const { data: inspection, error: inspectionError } = await createInspection(data)
      
      if (inspectionError) {
        throw new Error(`Failed to create inspection: ${inspectionError.message}`)
      }

      // Upload photos if any
      if (data.photos && data.photos.length > 0) {
        const { error: photoError } = await uploadInspectionPhotos(inspection.id, data.photos)
        
        if (photoError) {
          console.error('Photo upload failed:', photoError)
          // Continue anyway - inspection was created successfully
        }
      }
      
      // Clear draft after successful submission
      clearDraftFromLocalStorage()
      
      // Navigate to success page or dashboard
      navigate('/dashboard', { 
        state: { message: 'Inspection submitted successfully!' }
      })
    } catch (error) {
      console.error('Failed to submit inspection:', error)
      alert(`Failed to submit inspection: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep].component

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              New Inspection
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete the inspection form step by step
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-gray-200">
            <ProgressIndicator 
              steps={STEPS} 
              currentStep={currentStep}
            />
          </div>

          {/* Form Content */}
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-8">
              <CurrentStepComponent 
                form={form}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>

            {/* Navigation */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Save as Draft
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}