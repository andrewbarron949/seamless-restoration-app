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

export default function ClaimsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((session?.user as ExtendedUser)?.role && !['MANAGER', 'ADMIN'].includes((session?.user as ExtendedUser).role)) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (!session || !['MANAGER', 'ADMIN'].includes((session?.user as ExtendedUser)?.role || '')) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">Only managers and administrators can access claims management.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Claims Management</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage all insurance claims and assignments</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap">
          + New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-md bg-blue-100 flex-shrink-0">
              <span className="text-lg sm:text-2xl">📄</span>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 truncate">Total Claims</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-md bg-yellow-100 flex-shrink-0">
              <span className="text-lg sm:text-2xl">⏳</span>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 truncate">Pending</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">34</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-md bg-green-100 flex-shrink-0">
              <span className="text-lg sm:text-2xl">✅</span>
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-slate-600 truncate">Completed</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">213</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">Recent Claims</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Claims Management Coming Soon</h3>
            <p className="text-slate-600 mb-4">This feature will be available in the next phase of development.</p>
            <div className="text-sm text-slate-500">
              <p>• Create and manage insurance claims</p>
              <p>• Assign inspectors to claims</p>
              <p>• Track claim status and progress</p>
              <p>• Generate claim reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}