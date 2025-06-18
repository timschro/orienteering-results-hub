import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { headers } from 'next/headers'
import { getDomainConfig } from '@/lib/data'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const domain = headersList.get('x-domain') || 'results.ol-dm.de'
  const domainConfig = getDomainConfig(domain)
  
  const title = domainConfig?.name || 'Orienteering Results Hub'
  const description = `Live results and tracking for ${domainConfig?.name || 'orienteering competitions'}`
  
  return {
    title,
    description,
    generator: 'Next.js',
    metadataBase: new URL(`https://${domain}`),
    openGraph: {
      type: 'website',
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const domain = headersList.get('x-domain') || 'results.ol-dm.de'
  
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://oresults.eu" />
        <link rel="preconnect" href="https://livelox.com" />
        <link rel="dns-prefetch" href="https://oresults.eu" />
        <link rel="dns-prefetch" href="https://livelox.com" />
        <meta name="x-domain" content={domain} />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
