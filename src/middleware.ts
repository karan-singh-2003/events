import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionId = req.cookies.get('session_id')?.value
  const { pathname } = req.nextUrl

  const publicRoutes = ['/login']

  const protectedRoutes = ['/dashboard', '/workspace', '/profile']

  if (sessionId && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (
    !sessionId &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

// ✅ Apply middleware to all relevant routes
export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/workspace/:path*',
    '/profile/:path*',
  ],
}
