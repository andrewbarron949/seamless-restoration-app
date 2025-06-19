'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  if (!session) {
    return null
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your account settings and preferences</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    defaultValue={session.user?.name || ''}
                  />
                ) : (
                  <p className="text-slate-900">{session.user?.name || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <p className="text-slate-900">{session.user?.email}</p>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  getRoleBadgeColor((session.user as ExtendedUser)?.role || '')
                }`}>
                  {(session.user as ExtendedUser)?.role || 'Unknown'}
                </span>
                <p className="text-xs text-slate-500 mt-1">Role is assigned by administrators</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-slate-900">Not provided</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    rows={3}
                    placeholder="Your address"
                  />
                ) : (
                  <p className="text-slate-900">Not provided</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Member Since</span>
                <span className="text-sm font-medium text-slate-900">Jun 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Login</span>
                <span className="text-sm font-medium text-slate-900">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                Login History
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Email Notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">SMS Notifications</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Dark Mode</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}