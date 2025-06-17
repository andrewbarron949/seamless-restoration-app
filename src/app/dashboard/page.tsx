"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ExtendedUser {
  id: string
  email: string
  name?: string | null
  role: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user as ExtendedUser

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Seamless Restoration Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, {user.name || user.email}
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user.role}
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 hover:text-red-500"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to the Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                You are successfully logged in as a {user.role.toLowerCase()}.
              </p>
              <p className="text-sm text-gray-500">
                User ID: {user.id}
              </p>
              <p className="text-sm text-gray-500">
                Email: {user.email}
              </p>
              
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  Authentication system is working! 🎉
                </p>
                <p className="text-xs text-gray-500">
                  Next: Implement claims management, inspections, and photo uploads
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}