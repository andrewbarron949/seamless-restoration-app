import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Role-based access control
    if (token) {
      const userRole = token.role as string
      
      // Manager/Admin only routes
      if (pathname.startsWith('/dashboard/claims') || pathname.startsWith('/dashboard/team')) {
        if (!['MANAGER', 'ADMIN'].includes(userRole)) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
      
      // Admin only routes
      if (pathname.startsWith('/dashboard/settings')) {
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