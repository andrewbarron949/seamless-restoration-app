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
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl py-6 sm:py-8 lg:py-12">
        <div className="card animate-fade-in">
          {/* Header */}
          <div className="card-header">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                New Inspection
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Complete the inspection form step by step
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <ProgressIndicator 
              steps={STEPS} 
              currentStep={currentStep}
            />
          </div>

          {/* Form Content */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col min-h-0">
            <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
              <div className="animate-slide-up">
                <CurrentStepComponent 
                  form={form}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </div>
            </div>

            {/* Navigation - Fixed at bottom on mobile */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="btn-outline order-2 sm:order-1 w-full sm:w-auto"
                >
                  Previous
                </button>

                <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Save as Draft
                  </button>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        'Submit Inspection'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}