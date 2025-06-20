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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Claims</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your business entities here</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap">
          + Add Claim
        </button>
      </div>


      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">Claims List</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No claims yet</h3>
            <p className="text-slate-600 mb-4">Start by creating your first claim.</p>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
              + Add Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}