import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
