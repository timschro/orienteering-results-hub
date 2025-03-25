import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

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

export const metadata: Metadata = {
  title: 'Orienteering Results Hub',
  description: 'Live results and tracking for orienteering competitions',
  generator: 'Next.js',
  metadataBase: new URL('https://orienteering-results-hub.example.com'),
  openGraph: {
    type: 'website',
    title: 'Orienteering Results Hub',
    description: 'Live results and tracking for orienteering competitions',
    siteName: 'Orienteering Results Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orienteering Results Hub',
    description: 'Live results and tracking for orienteering competitions',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://oresults.eu" />
        <link rel="preconnect" href="https://livelox.com" />
        <link rel="dns-prefetch" href="https://oresults.eu" />
        <link rel="dns-prefetch" href="https://livelox.com" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
