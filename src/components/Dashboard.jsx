import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Seamless Restoration
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {profile?.first_name} {profile?.last_name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {profile?.role}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600">
                Welcome to the Seamless Restoration Inspection System
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500">User: {user?.email}</p>
                <p className="text-sm text-gray-500">Role: {profile?.role}</p>
                <p className="text-sm text-gray-500">
                  User ID: {user?.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}