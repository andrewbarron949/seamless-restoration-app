'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewInspectionPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role && session.user.role !== 'INSPECTOR') {
      router.push('/dashboard')
    }
  }, [session, router])

  if (session?.user?.role !== 'INSPECTOR') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">Only inspectors can create new inspections.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Inspection</h1>
        <p className="text-slate-600 mt-1">Create a new inspection assignment</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Inspection Form Coming Soon</h3>
          <p className="text-slate-600 mb-4">This feature will be available in the next phase of development.</p>
          <div className="text-sm text-slate-500 space-y-2">
            <p>• Dynamic form builder for different inspection types</p>
            <p>• Photo capture and upload functionality</p>
            <p>• GPS location tagging</p>
            <p>• Offline data collection support</p>
            <p>• Real-time form validation</p>
            <p>• Digital signature capture</p>
          </div>
          <div className="mt-6">
            <button 
              onClick={() => router.push('/dashboard/inspections')}
              className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
            >
              Back to Inspections
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inspection Types</h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-md">
              <h4 className="font-medium text-slate-900">Property Damage Assessment</h4>
              <p className="text-sm text-slate-600">Comprehensive property damage evaluation</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <h4 className="font-medium text-slate-900">Water Damage Inspection</h4>
              <p className="text-sm text-slate-600">Moisture detection and water damage assessment</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-md">
              <h4 className="font-medium text-slate-900">Fire Damage Assessment</h4>
              <p className="text-sm text-slate-600">Fire and smoke damage evaluation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Equipment</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Digital camera or smartphone
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Measuring tape
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Moisture meter (for water damage)
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Flashlight or work light
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Safety equipment (gloves, mask)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}