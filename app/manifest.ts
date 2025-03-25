import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Orienteering Results Hub',
    short_name: 'OL Results',
    description: 'Live results and tracking for orienteering competitions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0891b2',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}