import { NextRequest, NextResponse } from 'next/server'
import { hostnameFromHeader, isDevelopmentHost, isSupportedDomain, DEFAULT_DOMAIN } from '@/lib/data'

export function middleware(request: NextRequest) {
  const hostname = hostnameFromHeader(request.headers.get('host'))

  // Development hosts (localhost, 127.0.0.1) and preview deployments
  // (*.vercel.app) are not public domains: serve them the default domain
  // instead of redirecting the developer off their own machine.
  const domain = isSupportedDomain(hostname)
    ? hostname
    : isDevelopmentHost(hostname)
      ? DEFAULT_DOMAIN
      : null

  const response = NextResponse.next()

  // Genuinely unknown public hosts get no x-domain, which renders the
  // "Domain nicht unterstützt" page rather than redirecting away.
  if (domain) {
    // Add domain to headers so it can be accessed in the app
    response.headers.set('x-domain', domain)
  }

  // The page content is a compile-time constant, so it is safe for the CDN to
  // serve it to everyone on the same host. The time-dependent parts (clock,
  // "Aktiv" badge) are computed on the client after hydration.
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
