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

  const getQuickActions = () => {
    const baseActions = [
      { title: 'User Profile', description: 'View and edit your profile', href: '/dashboard/profile', icon: '👤', color: 'bg-blue-100' }
    ]
    
    if (user.role === 'ADMIN') {
      baseActions.push(
        { title: 'User Management', description: 'Manage organization users', href: '/dashboard/users', icon: '👥', color: 'bg-green-100' },
        { title: 'Settings', description: 'Organization settings', href: '/dashboard/settings', icon: '⚙️', color: 'bg-purple-100' }
      )
    }
    
    return baseActions
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
          {getGreeting()}, {user.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base lg:text-lg">
          Welcome to your {user.role.toLowerCase()} dashboard for {user.organization?.name}. This is your SaaS application starting point.
        </p>
        {user.isOwner && (
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            🎯 Organization Owner
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4">Template Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Multi-tenant architecture</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">NextAuth.js authentication</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Role-based access control</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Responsive design</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">PostgreSQL + Prisma</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">TypeScript ready</span>
          </div>
        </div>
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

      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-4 sm:mb-6">Getting Started</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">Authentication system ready</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Login, registration, and session management working</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">Multi-tenant architecture implemented</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Organization-scoped data and user management</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-slate-700">Ready for your business logic</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Start building your SaaS features on this foundation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}