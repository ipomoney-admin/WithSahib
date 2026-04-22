import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#06090F',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 5,
          paddingLeft: 4,
          paddingRight: 4,
          gap: 3,
          position: 'relative',
        }}
      >
        {/* Ascending bars */}
        <div style={{ width: 5, height: 8,  background: 'rgba(0,200,150,0.45)', borderRadius: 2, marginBottom: 0 }} />
        <div style={{ width: 5, height: 13, background: 'rgba(0,200,150,0.72)', borderRadius: 2, marginBottom: 0 }} />
        <div style={{ width: 5, height: 19, background: '#00C896', borderRadius: 2, marginBottom: 0 }} />
        {/* Pulse dot — top right */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#00C896',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
