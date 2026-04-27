'use client'

import type { Metadata } from 'next'

const STOCKS = [
  { name: 'RELIANCE', alloc: '18%', change: '+2.3%' },
  { name: 'HDFCBANK', alloc: '14%', change: '+1.1%' },
  { name: 'INFY', alloc: '12%', change: '+3.7%' },
]

const SEGMENTS = [
  { label: 'Large Cap', pct: 40, color: '#FF6B00', dash: 251 },
  { label: 'Mid Cap', pct: 35, color: '#22C55E', dash: 220 },
  { label: 'Cash', pct: 25, color: '#64A0FF', dash: 157 },
]

const CIRCUMFERENCE = 628 // 2π × 100

export default function ModelPortfolioPage() {
  return (
    <div style={{ minHeight: '80vh', background: '#0A0A0A', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes drawArc0 {
          from { stroke-dashoffset: 251; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawArc1 {
          from { stroke-dashoffset: 220; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawArc2 {
          from { stroke-dashoffset: 157; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 45%; }
        }
        @keyframes fadeLabel {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Title */}
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#FF6B00', textTransform: 'uppercase', marginBottom: 16 }}>Coming Soon</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 400, color: '#F0F0F0', textAlign: 'center', marginBottom: 12 }}>
        Model Portfolio
      </h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 460, lineHeight: 1.7, marginBottom: 56 }}>
        We are building something exceptional.
      </p>

      {/* Animation panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: '100%', maxWidth: 720, marginBottom: 48 }}>

        {/* Left: stock cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STOCKS.map((s, i) => (
            <div
              key={s.name}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                animation: `slideInLeft 0.5s ease both`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              <div>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 700, color: '#F0F0F0', marginBottom: 2 }}>{s.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Allocation: <span style={{ color: '#FF6B00', fontWeight: 600 }}>{s.alloc}</span></p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                {/* Sparkline */}
                <svg width="60" height="24" style={{ display: 'block', marginBottom: 4 }}>
                  <polyline
                    points="0,20 10,14 20,16 30,8 40,10 50,4 60,6"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    style={{
                      animation: `drawLine 1s ease both`,
                      animationDelay: `${0.3 + i * 0.4}s`,
                    }}
                  />
                </svg>
                <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: donut chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <svg width="160" height="160" viewBox="0 0 220 220">
              {/* Background circle */}
              <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="28" />
              {/* Segment 0 — Large Cap */}
              <circle
                cx="110" cy="110" r="80"
                fill="none" stroke="#FF6B00" strokeWidth="28"
                strokeDasharray="251 628"
                strokeDashoffset="628"
                transform="rotate(-90 110 110)"
                style={{ strokeDashoffset: 377, animation: 'drawArc0 1s ease both', animationDelay: '0.2s' }}
              />
              {/* Segment 1 — Mid Cap */}
              <circle
                cx="110" cy="110" r="80"
                fill="none" stroke="#22C55E" strokeWidth="28"
                strokeDasharray="220 628"
                strokeDashoffset="628"
                transform="rotate(-90 110 110)"
                style={{ strokeDashoffset: 157, animation: 'drawArc1 1s ease both', animationDelay: '1.1s' }}
              />
              {/* Segment 2 — Cash */}
              <circle
                cx="110" cy="110" r="80"
                fill="none" stroke="#64A0FF" strokeWidth="28"
                strokeDasharray="157 628"
                strokeDashoffset="628"
                transform="rotate(-90 110 110)"
                style={{ strokeDashoffset: 0, animation: 'drawArc2 1s ease both', animationDelay: '2.0s' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' }}>Portfolio</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#F0F0F0' }}>100%</p>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SEGMENTS.map((seg, i) => (
              <div
                key={seg.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  animation: 'fadeLabel 0.5s ease both',
                  animationDelay: `${1.2 + i * 0.6}s`,
                  opacity: 0,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{seg.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: seg.color, marginLeft: 'auto', paddingLeft: 8 }}>{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 560, marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Portfolio construction in progress</span>
          <span style={{ fontSize: 12, color: '#FF6B00', animation: 'pulse 2s ease-in-out infinite' }}>Researching 1,500+ instruments</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #FF6B00, #C45200)',
              borderRadius: 999,
              width: '0%',
              animation: 'progressFill 8s ease-in-out infinite alternate',
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 540, lineHeight: 1.8, marginBottom: 32 }}>
        Sahib Singh Hora is personally researching and constructing a model portfolio with defined entry levels,
        allocation strategy, and rebalancing framework. Available to Elite subscribers first.
      </p>

      {/* CTA */}
      <a
        href="mailto:connect@withsahib.com?subject=Model Portfolio Notification"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', borderRadius: 10,
          background: '#FF6B00', color: '#fff',
          fontWeight: 700, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(255,107,0,0.35)',
          transition: 'all 0.2s',
        }}
      >
        Notify me when live →
      </a>
    </div>
  )
}
