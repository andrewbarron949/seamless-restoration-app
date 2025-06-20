'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  onLinkClick?: () => void
}

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

export default function Navigation({ onLinkClick }: NavigationProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['INSPECTOR', 'MANAGER', 'ADMIN'] },
    { href: '/dashboard/profile', label: 'My Profile', icon: '👤', roles: ['INSPECTOR', 'MANAGER', 'ADMIN'] },
    { href: '/dashboard/inspections', label: 'Items', icon: '📋', roles: ['INSPECTOR'] },
    { href: '/dashboard/inspections/new', label: 'Add Item', icon: '➕', roles: ['INSPECTOR'] },
    { href: '/dashboard/claims', label: 'Claims', icon: '📄', roles: ['MANAGER', 'ADMIN'] },
    { href: '/dashboard/users', label: 'Users', icon: '👥', roles: ['ADMIN'] },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️', roles: ['ADMIN'] },
  ]

  const visibleItems = menuItems.filter(item => 
    (session?.user as ExtendedUser)?.role && item.roles.includes((session?.user as ExtendedUser).role)
  )

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick()
  }

  return (
    <nav className="space-y-2">
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive(item.href)
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span className={`mr-3 text-lg transition-transform duration-200 ${isActive(item.href) ? '' : 'group-hover:scale-110'}`}>
            {item.icon}
          </span>
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
      
      <div className="pt-6 mt-6 border-t border-slate-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  )
}