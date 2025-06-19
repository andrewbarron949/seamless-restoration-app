import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Role-based access control with organization context
    if (token) {
      const userRole = token.role as string
      const organizationId = token.organizationId as string
      
      // Ensure user has organization context (all users must belong to an organization)
      if (!organizationId) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Manager/Admin only routes
      if (pathname.startsWith('/dashboard/claims')) {
        if (!['MANAGER', 'ADMIN'].includes(userRole)) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
      // Admin only routes (Users = former Team, Settings)
      if (pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/settings')) {
        if (userRole !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
      // Inspector only routes
      if (pathname.startsWith('/dashboard/inspections/new')) {
        if (userRole !== 'INSPECTOR') {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
      // API routes security - ensure organization isolation
      if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
        // Add organization context headers for API routes
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('x-organization-id', organizationId)
        requestHeaders.set('x-user-role', userRole)
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        if (pathname.startsWith('/login') || 
            pathname.startsWith('/register') || 
            pathname.startsWith('/api/auth') ||
            pathname.startsWith('/api/test-db') ||
            pathname === '/') {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}