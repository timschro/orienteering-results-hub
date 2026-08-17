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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl()

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
