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

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if ((session?.user as ExtendedUser)?.role && (session?.user as ExtendedUser).role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  if ((session?.user as ExtendedUser)?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">Only administrators can access system settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organization Settings</h1>
        <p className="text-slate-600 mt-1">Manage your organization configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Your Organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="https://yourcompany.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="contact@yourcompany.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Require Strong Passwords</h3>
                <p className="text-xs text-slate-500">Enforce password complexity requirements</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-500">Require 2FA for all users</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Session Timeout</h3>
                <p className="text-xs text-slate-500">Auto-logout after inactivity</p>
              </div>
              <select className="text-sm border border-slate-300 rounded px-2 py-1">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Email Notifications</h3>
                <p className="text-xs text-slate-500">Send email updates to users</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Weekly Reports</h3>
                <p className="text-xs text-slate-500">Send weekly activity summaries</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">System Alerts</h3>
                <p className="text-xs text-slate-500">Notify about system events</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Data Retention</h3>
                <p className="text-xs text-slate-500">How long to keep data</p>
              </div>
              <select className="text-sm border border-slate-300 rounded px-2 py-1">
                <option>1 year</option>
                <option>2 years</option>
                <option>5 years</option>
                <option>Forever</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Export Data</h3>
                <p className="text-xs text-slate-500">Allow users to export their data</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Analytics</h3>
                <p className="text-xs text-slate-500">Collect usage analytics</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Version:</span>
            <span className="ml-2 font-medium text-slate-900">1.0.0</span>
          </div>
          <div>
            <span className="text-slate-600">Environment:</span>
            <span className="ml-2 font-medium text-slate-900">Development</span>
          </div>
          <div>
            <span className="text-slate-600">Database:</span>
            <span className="ml-2 font-medium text-slate-900">PostgreSQL</span>
          </div>
          <div>
            <span className="text-slate-600">Template:</span>
            <span className="ml-2 font-medium text-slate-900">Next.js SaaS</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
          Save Changes
        </button>
        <button className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300 transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}