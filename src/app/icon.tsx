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
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Bar 1: x=4, y=20, width=6, height=8, opacity 0.4 */}
        <div style={{ position: 'absolute', left: 4, top: 20, width: 6, height: 8, background: '#00C896', opacity: 0.4, borderRadius: 1 }} />
        {/* Bar 2: x=13, y=14, width=6, height=14, opacity 0.7 */}
        <div style={{ position: 'absolute', left: 13, top: 14, width: 6, height: 14, background: '#00C896', opacity: 0.7, borderRadius: 1 }} />
        {/* Bar 3: x=22, y=6, width=6, height=22, opacity 1.0 */}
        <div style={{ position: 'absolute', left: 22, top: 6, width: 6, height: 22, background: '#00C896', opacity: 1, borderRadius: 1 }} />
        {/* Dot: cx=28, cy=6, r=2.5 */}
        <div style={{ position: 'absolute', left: 25.5, top: 3.5, width: 5, height: 5, borderRadius: '50%', background: '#00C896' }} />
      </div>
    ),
    { ...size }
  )
}
