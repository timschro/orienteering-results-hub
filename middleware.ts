import { NextRequest, NextResponse } from 'next/server'
import {
  hostnameFromHeader,
  isDevelopmentHost,
  isSupportedDomain,
  DEFAULT_DOMAIN,
} from '@/lib/data'
import { DEFAULT_LOCALE, isLocale, matchAcceptLanguage } from '@/lib/i18n'

/**
 * Remembers the language the visitor last opened, so a return visit to `/`
 * skips the browser negotiation and goes straight there. It is written from
 * the *path*, not from a form or a script: opening `/sv` is the act of
 * choosing Swedish, whether that was the language switcher, a shared link or a
 * bookmark. That is what lets components/language-switcher.tsx be seven plain
 * links and no JavaScript at all.
 */
const LOCALE_COOKIE = 'NEXT_LOCALE'
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

// The competition data is a compile-time constant, so it is safe for the CDN to
// serve the same HTML to everyone on a host *and language*. The page renders
// its own time-dependent parts on the server (which competition is featured,
// each status label), so s-maxage caps how stale those can get: 60s is nothing
// against a race that runs for hours, and still absorbs nearly every request.
const CACHEABLE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=3600'

// Responses that carry a Set-Cookie, or that were chosen from this visitor's
// own headers, must not land in a cache shared with everybody else.
const PRIVATE = 'private, no-store'

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

  const { pathname } = request.nextUrl
  const remembered = request.cookies.get(LOCALE_COOKIE)?.value
  const segment = pathname.split('/')[1]

  // No language in the URL: pick one and redirect. This is the only place that
  // reads Accept-Language, and the only response that varies by it - which is
  // why the locale is in the path everywhere else.
  if (!isLocale(segment)) {
    const locale =
      (isLocale(remembered) ? remembered : null) ??
      matchAcceptLanguage(request.headers.get('accept-language')) ??
      DEFAULT_LOCALE

    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

    // 307, not 308: the target depends on the visitor, so it must never be
    // written into a browser's permanent redirect cache.
    const redirect = NextResponse.redirect(url, 307)
    redirect.headers.set('Cache-Control', PRIVATE)
    redirect.headers.set('Vary', 'Accept-Language, Cookie')
    return redirect
  }

  // Pass the resolved domain and locale to the app. These go on the *request*
  // headers - that is what `headers()` reads in a Server Component - and
  // x-domain is mirrored onto the response because app/layout.tsx also exposes
  // it as a meta tag.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', segment)
  // Genuinely unknown public hosts get no x-domain, which renders the
  // "domain not supported" page rather than redirecting away.
  if (domain) requestHeaders.set('x-domain', domain)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (domain) response.headers.set('x-domain', domain)

  if (remembered === segment) {
    response.headers.set('Cache-Control', CACHEABLE)
    return response
  }

  // First visit in this language: remember it. The Set-Cookie is why this one
  // response is uncacheable - every later request for the same URL is served
  // from the shared cache again.
  response.cookies.set(LOCALE_COOKIE, segment, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
  response.headers.set('Cache-Control', PRIVATE)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (build output, images, HMR)
     * - the file-based metadata routes Next serves without an extension
     *
     * and except anything containing a dot, which covers /favicon.ico,
     * /robots.txt, /sitemap.xml, /manifest.webmanifest and every file in
     * /public. Those must NOT be redirected under a locale prefix: the
     * language belongs to the page, not to the assets.
     */
    '/((?!api|_next|icon|apple-icon|opengraph-image|.*\\.).*)',
  ],
}
