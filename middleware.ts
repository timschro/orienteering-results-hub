import { NextRequest, NextResponse } from 'next/server'
import { isSupportedDomain } from '@/lib/domains'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extract domain from hostname (remove port if present)
  const domain = hostname.split(':')[0]
  
  // Check if domain is supported
  if (!isSupportedDomain(domain)) {
    // Redirect to default domain or show error
    const defaultDomain = 'results.dm-ol.de'
    const url = request.nextUrl.clone()
    url.hostname = defaultDomain
    return NextResponse.redirect(url)
  }
  
  // Create a new response
  const response = NextResponse.next()
  
  // Add domain to headers so it can be accessed in the app
  response.headers.set('x-domain', domain)
  
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