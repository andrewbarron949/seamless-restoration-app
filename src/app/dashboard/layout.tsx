'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Navigation from '@/components/navigation'

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800'
      case 'INSPECTOR':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width on desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:w-64 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">SR</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Seamless</h1>
                <p className="text-xs text-slate-500">Restoration</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-slate-200 lg:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 text-sm font-medium">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getRoleBadgeColor((session.user as ExtendedUser)?.role || '')}`}>
                  {(session.user as ExtendedUser)?.role || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 overflow-y-auto lg:px-6">
            <Navigation onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main content area - Full width minus sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-900 lg:hidden">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-slate-600">
                Welcome back, {(session.user as ExtendedUser)?.name?.split(' ')[0] || 'User'}
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Full width with responsive padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
          <div className="max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}