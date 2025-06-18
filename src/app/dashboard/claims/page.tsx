'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ClaimsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.role && !['MANAGER', 'ADMIN'].includes(session.user.role)) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (!session || !['MANAGER', 'ADMIN'].includes(session?.user?.role || '')) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Claims Management</h1>
          <p className="text-slate-600 mt-1">Manage all insurance claims and assignments</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
          + New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-100">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Total Claims</h3>
              <p className="text-2xl font-bold text-slate-900">247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-yellow-100">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Pending</h3>
              <p className="text-2xl font-bold text-slate-900">34</p>
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
              <p className="text-2xl font-bold text-slate-900">213</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Claims</h2>
        </div>
        <div className="p-6">
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