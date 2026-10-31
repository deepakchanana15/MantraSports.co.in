import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// NextAuth v5 middleware: called on every request matching the config.matcher
export default auth((req: NextRequest & { auth: { user?: unknown } | null }) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth
  const isLoginPage = nextUrl.pathname === '/admin/login'
  const isAdminPath = nextUrl.pathname.startsWith('/admin')

  // Redirect unauthenticated users to login
  if (isAdminPath && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from the login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  // Only run middleware on admin routes (skip static assets, api/auth routes)
  matcher: ['/admin/:path*'],
}
