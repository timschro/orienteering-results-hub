import { ImageResponse } from 'next/og'

// Route segment config
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

// Generated favicon — reuses the compass mark from app/opengraph-image.tsx,
// recolored white-on-brand-cyan.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e7490',
          borderRadius: 6,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
