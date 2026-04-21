import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'withSahib — SEBI Registered Research Analyst INH000026266'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#06090F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(#1A2333 1px, transparent 1px), linear-gradient(90deg, #1A2333 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.3,
          }}
        />

        {/* Emerald glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -60,
            width: 600,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,200,150,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Gold glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -60,
            width: 480,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            {/* Candle bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 32 }}>
              <div style={{ width: 6, height: 12, background: 'rgba(0,200,150,0.35)', borderRadius: 3 }} />
              <div style={{ width: 6, height: 20, background: 'rgba(0,200,150,0.65)', borderRadius: 3 }} />
              <div style={{ width: 6, height: 30, background: '#00C896', borderRadius: 3 }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C896', marginBottom: 4, marginLeft: 2 }} />
            </div>
            <span style={{ fontSize: 32, fontWeight: 300, color: '#E8EDF5', letterSpacing: -0.5 }}>
              with<span style={{ fontWeight: 700, color: '#00C896' }}>Sahib</span>.com
            </span>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#E8EDF5',
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 780,
              letterSpacing: -1.5,
            }}
          >
            Research with{' '}
            <span style={{ color: '#00C896' }}>clarity.</span>
            <br />
            Trade with{' '}
            <span style={{ color: '#D4A843' }}>conviction.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 22,
              color: '#8FA8C0',
              fontWeight: 300,
              marginTop: 24,
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            SEBI Registered Research Analyst — institutional-grade intraday calls,
            NSE swing trades, options picks & AI research.
          </p>
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* SEBI badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                padding: '10px 20px',
                background: 'rgba(212,168,67,0.08)',
                border: '1px solid rgba(212,168,67,0.25)',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: '#D4A843',
                letterSpacing: 2,
                fontFamily: 'Courier New, monospace',
              }}
            >
              SEBI RA · INH000026266
            </div>
            <div
              style={{
                padding: '10px 20px',
                background: 'rgba(0,200,150,0.08)',
                border: '1px solid rgba(0,200,150,0.2)',
                borderRadius: 8,
                fontSize: 14,
                color: '#00C896',
                letterSpacing: 1,
              }}
            >
              withSahib.com
            </div>
          </div>

          {/* Analyst name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#E8EDF5' }}>Sahib Singh Hora</span>
            <span style={{ fontSize: 13, color: '#4A6580', letterSpacing: 1 }}>Research Analyst</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
