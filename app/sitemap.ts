import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { LOCALES, LOCALE_META } from '@/lib/i18n'

async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  // x-domain is set by the middleware; fall back to the raw Host header.
  const host =
    headersList.get('x-domain') || headersList.get('host') || 'results.ol-dm.de'
  const hostname = host.split(':')[0]
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  const protocol =
    headersList.get('x-forwarded-proto') || (isLocalhost ? 'http' : 'https')

  return `${protocol}://${host}`
}

/**
 * One entry per language, each listing all the others as `alternates` — the
 * sitemap equivalent of the hreflang tags in app/[locale]/page.tsx. `/` is not
 * listed: it only redirects, and what it redirects to depends on who is asking.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl()

  const languages = Object.fromEntries(
    LOCALES.map((locale) => [LOCALE_META[locale].htmlLang, `${baseUrl}/${locale}`])
  )

  return LOCALES.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: { languages },
  }))
}
