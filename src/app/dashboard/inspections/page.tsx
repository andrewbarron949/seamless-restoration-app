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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">My Inspections</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">View and manage your inspection assignments</p>
        </div>
        {(session.user as ExtendedUser)?.role === 'INSPECTOR' && (
          <Link 
            href="/dashboard/inspections/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            + New Inspection
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-100">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Assigned</h3>
              <p className="text-2xl font-bold text-slate-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-yellow-100">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">In Progress</h3>
              <p className="text-2xl font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Completed</h3>
              <p className="text-2xl font-bold text-slate-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-purple-100">
              <span className="text-2xl">📸</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Photos Taken</h3>
              <p className="text-2xl font-bold text-slate-900">1,234</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Inspection List</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Inspection Management Coming Soon</h3>
            <p className="text-slate-600 mb-4">This feature will be available in the next phase of development.</p>
            <div className="text-sm text-slate-500">
              <p>• View assigned inspections</p>
              <p>• Update inspection status</p>
              <p>• Upload photos and documentation</p>
              <p>• Submit completed inspections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}