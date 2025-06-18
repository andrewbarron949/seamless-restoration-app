'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

export default function Navigation({ isMobile = false, onLinkClick }: NavigationProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['INSPECTOR', 'MANAGER', 'ADMIN'] },
    { href: '/dashboard/profile', label: 'My Profile', icon: '👤', roles: ['INSPECTOR', 'MANAGER', 'ADMIN'] },
    { href: '/dashboard/inspections', label: 'My Inspections', icon: '📋', roles: ['INSPECTOR'] },
    { href: '/dashboard/inspections/new', label: 'New Inspection', icon: '➕', roles: ['INSPECTOR'] },
    { href: '/dashboard/claims', label: 'All Claims', icon: '📄', roles: ['MANAGER', 'ADMIN'] },
    { href: '/dashboard/team', label: 'Team Management', icon: '👥', roles: ['MANAGER', 'ADMIN'] },
    { href: '/dashboard/settings', label: 'System Settings', icon: '⚙️', roles: ['ADMIN'] },
  ]

  const visibleItems = menuItems.filter(item => 
    session?.user?.role && item.roles.includes(session.user.role)
  )

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick()
  }

  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-1' : 'space-y-1'}`}>
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive(item.href)
              ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-900'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span className="mr-3 text-lg">{item.icon}</span>
          {item.label}
        </Link>
      ))}
      
      <div className="pt-4 mt-4 border-t border-slate-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
        >
          <span className="mr-3 text-lg">🚪</span>
          Sign Out
        </button>
      </div>
    </nav>
  )
}