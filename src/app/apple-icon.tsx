import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Scale factor: 180/32 = 5.625
const S = 5.625

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#06090F',
          borderRadius: 36,
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* Bar 1: x=4*S, y=20*S, width=6*S, height=8*S, opacity 0.4 */}
        <div style={{ position: 'absolute', left: Math.round(4 * S), top: Math.round(20 * S), width: Math.round(6 * S), height: Math.round(8 * S), background: '#00C896', opacity: 0.4, borderRadius: 4 }} />
        {/* Bar 2 */}
        <div style={{ position: 'absolute', left: Math.round(13 * S), top: Math.round(14 * S), width: Math.round(6 * S), height: Math.round(14 * S), background: '#00C896', opacity: 0.7, borderRadius: 4 }} />
        {/* Bar 3 */}
        <div style={{ position: 'absolute', left: Math.round(22 * S), top: Math.round(6 * S), width: Math.round(6 * S), height: Math.round(22 * S), background: '#00C896', opacity: 1, borderRadius: 4 }} />
        {/* Dot */}
        <div style={{ position: 'absolute', left: Math.round(25.5 * S), top: Math.round(3.5 * S), width: Math.round(5 * S), height: Math.round(5 * S), borderRadius: '50%', background: '#00C896' }} />
      </div>
    ),
    { ...size }
  )
}
