"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
  organizationId: string
  isOwner: boolean
  organization: {
    id: string
    name: string
  }
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: string
  description?: string
}

function StatCard({ title, value, icon, color, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-2 sm:p-3 rounded-md ${color} flex-shrink-0`}>
          <span className="text-lg sm:text-2xl">{icon}</span>
        </div>
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-slate-600 truncate">{title}</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-1 truncate">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  href: string
  icon: string
  color: string
}

function QuickAction({ title, description, href, icon, color }: QuickActionProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <div className="flex items-center">
          <div className={`p-2 sm:p-3 rounded-md ${color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
            <span className="text-lg sm:text-xl">{icon}</span>
          </div>
          <div className="ml-3 sm:ml-4 flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-slate-700 truncate">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const user = session.user as ExtendedUser

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getRoleStats = () => {
    switch (user.role) {
      case 'INSPECTOR':
        return [
          { title: 'Assigned Inspections', value: 12, icon: '📋', color: 'bg-blue-100', description: '3 due today' },
          { title: 'Completed This Week', value: 8, icon: '✅', color: 'bg-green-100', description: '+2 from last week' },
          { title: 'Photos Uploaded', value: 156, icon: '📸', color: 'bg-purple-100', description: 'This month' },
          { title: 'Average Rating', value: '4.8', icon: '⭐', color: 'bg-yellow-100', description: 'From managers' }
        ]
      case 'MANAGER':
        return [
          { title: 'Active Claims', value: 34, icon: '📄', color: 'bg-blue-100', description: '5 urgent' },
          { title: 'Team Members', value: 12, icon: '👥', color: 'bg-green-100', description: '2 new this month' },
          { title: 'Completed Claims', value: 89, icon: '✅', color: 'bg-purple-100', description: 'This quarter' },
          { title: 'Avg. Resolution Time', value: '3.2 days', icon: '⏱️', color: 'bg-orange-100', description: 'Improved 15%' }
        ]
      case 'ADMIN':
        return [
          { title: 'Total Users', value: 156, icon: '👤', color: 'bg-blue-100', description: '12 active today' },
          { title: 'System Uptime', value: '99.9%', icon: '⚡', color: 'bg-green-100', description: 'Last 30 days' },
          { title: 'Total Claims', value: 1247, icon: '📊', color: 'bg-purple-100', description: '+23 this week' },
          { title: 'Storage Used', value: '2.4 TB', icon: '💾', color: 'bg-orange-100', description: '68% of quota' }
        ]
      default:
        return []
    }
  }

  const getQuickActions = () => {
    switch (user.role) {
      case 'INSPECTOR':
        return [
          { title: 'Start New Inspection', description: 'Begin a new inspection assignment', href: '/dashboard/inspections/new', icon: '➕', color: 'bg-blue-100' },
          { title: 'View My Inspections', description: 'See all your current assignments', href: '/dashboard/inspections', icon: '📋', color: 'bg-green-100' },
          { title: 'Update Profile', description: 'Manage your account settings', href: '/dashboard/profile', icon: '👤', color: 'bg-purple-100' }
        ]
      case 'MANAGER':
        return [
          { title: 'View All Claims', description: 'Manage active and pending claims', href: '/dashboard/claims', icon: '📄', color: 'bg-blue-100' },
          { title: 'Inspector Dashboard', description: 'View inspector assignments and progress', href: '/dashboard/inspections', icon: '👥', color: 'bg-green-100' },
          { title: 'Generate Reports', description: 'Export analytics and performance data', href: '/dashboard/reports', icon: '📊', color: 'bg-purple-100' }
        ]
      case 'ADMIN':
        return [
          { title: 'User Management', description: 'Add, edit, and manage user accounts', href: '/dashboard/users', icon: '👥', color: 'bg-blue-100' },
          { title: 'System Settings', description: 'Configure application settings', href: '/dashboard/settings', icon: '⚙️', color: 'bg-green-100' },
          { title: 'View Analytics', description: 'System performance and usage metrics', href: '/dashboard/analytics', icon: '📈', color: 'bg-purple-100' }
        ]
      default:
        return []
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
          {getGreeting()}, {user.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base lg:text-lg">
          Welcome to your {user.role.toLowerCase()} dashboard for {user.organization?.name}. Here&apos;s what&apos;s happening today.
        </p>
        {user.isOwner && (
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            🎯 Organization Owner
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {getRoleStats().map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
          {getQuickActions().map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Recent Activity</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">System initialized successfully</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Authentication system is working properly</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">Dashboard layout implemented</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Role-based navigation and responsive design</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">Ready for claims management</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Next phase: Implementing core business logic</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}