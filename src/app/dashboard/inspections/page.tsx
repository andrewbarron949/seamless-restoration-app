'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export default function InspectionsPage() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Inspections</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your inspection items</p>
        </div>
        {(session.user as ExtendedUser)?.role === 'INSPECTOR' && (
          <Link 
            href="/dashboard/inspections/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            + Add Item
          </Link>
        )}
      </div>


      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Items List</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No items yet</h3>
            <p className="text-slate-600 mb-4">Start by adding your first item.</p>
            <Link 
              href="/dashboard/inspections/new"
              className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
            >
              + Add Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}