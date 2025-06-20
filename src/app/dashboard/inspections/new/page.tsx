'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export default function NewInspectionPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((session?.user as ExtendedUser)?.role && (session?.user as ExtendedUser).role !== 'INSPECTOR') {
      router.push('/dashboard')
    }
  }, [session, router])

  if ((session?.user as ExtendedUser)?.role !== 'INSPECTOR') {
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
        <h1 className="text-2xl font-bold text-slate-900">Add New Item</h1>
        <p className="text-slate-600 mt-1">Create a new item</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Item Details</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
            <input 
              type="text" 
              placeholder="Enter item name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              placeholder="Enter description"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
              <option value="">Select category</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/dashboard/inspections')}
              className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
              Save Item
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}