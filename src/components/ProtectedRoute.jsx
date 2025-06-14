import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    const hasAccess = checkRoleAccess(profile?.role, requiredRole)
    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role: {requiredRole} | Your role: {profile?.role || 'Unknown'}
            </p>
          </div>
        </div>
      )
    }
  }

  return children
}

function checkRoleAccess(userRole, requiredRole) {
  const roleHierarchy = {
    'Inspector': ['Inspector'],
    'Manager': ['Inspector', 'Manager'],
    'Admin': ['Inspector', 'Manager', 'Admin']
  }

  return roleHierarchy[userRole]?.includes(requiredRole) || false
}