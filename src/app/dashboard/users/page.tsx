'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
  organizationId: string
}

interface User {
  id: string
  email: string
  name?: string | null
  role: string
  isOwner: boolean
  createdAt: string
  updatedAt?: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if ((session?.user as ExtendedUser)?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    if (session?.user && (session.user as ExtendedUser).role === 'ADMIN') {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch {
      setError('An error occurred while fetching users')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete user')
      }
    } catch {
      setError('An error occurred while deleting the user')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'MANAGER': return 'bg-blue-100 text-blue-800'
      case 'INSPECTOR': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!session || (session.user as ExtendedUser)?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">Only administrators can access user management.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage organization users and their roles</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          + Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-100">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Total Users</h3>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-100">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Inspectors</h3>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.role === 'INSPECTOR').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-purple-100">
              <span className="text-2xl">👑</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-600">Admins</h3>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Organization Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900 flex items-center">
                        {user.name || 'Unnamed User'}
                        {user.isOwner && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-slate-600 hover:text-slate-900">
                        Edit
                      </button>
                      {!user.isOwner && (
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onUserAdded={(newUser) => {
            setUsers([...users, newUser])
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

// Simple Add User Modal Component
function AddUserModal({ onClose, onUserAdded }: { 
  onClose: () => void, 
  onUserAdded: (user: User) => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'INSPECTOR',
    temporaryPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        onUserAdded(data.user)
        alert(`User created successfully! Temporary password: ${data.temporaryPassword}`)
      } else {
        setError(data.error || 'Failed to create user')
      }
    } catch {
      setError('An error occurred while creating the user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="user@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="INSPECTOR">Inspector</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Temporary Password (optional)
            </label>
            <input
              type="text"
              value={formData.temporaryPassword}
              onChange={(e) => setFormData({...formData, temporaryPassword: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Leave empty to auto-generate"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}