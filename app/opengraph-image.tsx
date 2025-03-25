import { ImageResponse } from 'next/og'
import { Compass } from 'lucide-react'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = 'Orienteering Results Hub'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: 32,
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 24,
          color: '#0891b2' 
        }}>
          <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <div style={{ 
            fontSize: 56, 
            fontWeight: 'bold',
            color: '#020617'
          }}>
            Orienteering Results Hub
          </div>
          <div style={{ 
            fontSize: 32,
            color: '#64748b',
            marginTop: 16
          }}>
            Live results and tracking for competitions
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}