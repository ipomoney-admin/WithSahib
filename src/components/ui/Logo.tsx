'use client'

import { useRef } from 'react'

interface LogoMarkProps {
  size?: number
  animated?: boolean
}

export function LogoMark({ size = 28, animated = true }: LogoMarkProps) {
  const barW = Math.round(size * 0.18)
  const gap = Math.round(size * 0.12)
  const dotR = Math.round(size * 0.12)
  const heights = [size * 0.38, size * 0.60, size * 0.88]
  const totalBarsW = barW * 3 + gap * 2
  const svgW = totalBarsW + dotR * 2 + gap
  const svgH = size

  return (
    <>
      <style>{`
        @keyframes wsBarIn {
          0%   { transform: scaleY(0); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes wsDotPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          80%  { transform: scale(0.9); }
          100% { transform: scale(1.0); opacity: 1; }
        }
        @keyframes wsDotPulse {
          0%, 100% { transform: scale(1.0); }
          50%       { transform: scale(1.2); }
        }
        .ws-bar { transform-origin: bottom center; }
        .ws-dot-wrap { transform-origin: center center; }
        .ws-logo-svg:hover .ws-bar {
          filter: brightness(1.3);
        }
        .ws-logo-svg:hover .ws-dot {
          animation: wsDotPulse 0.6s ease forwards !important;
        }
      `}</style>
      <svg
        className="ws-logo-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', flexShrink: 0 }}
      >
        <rect
          className="ws-bar"
          x={0}
          y={svgH - (heights[0] ?? 0)}
          width={barW}
          height={heights[0] ?? 0}
          rx={barW * 0.35}
          fill="rgba(26,122,74,0.45)"
          style={animated ? { animation: 'wsBarIn 0.3s ease-out 0s both' } : {}}
        />
        <rect
          className="ws-bar"
          x={barW + gap}
          y={svgH - (heights[1] ?? 0)}
          width={barW}
          height={heights[1] ?? 0}
          rx={barW * 0.35}
          fill="rgba(26,122,74,0.72)"
          style={animated ? { animation: 'wsBarIn 0.3s ease-out 0.25s both' } : {}}
        />
        <rect
          className="ws-bar"
          x={(barW + gap) * 2}
          y={svgH - (heights[2] ?? 0)}
          width={barW}
          height={heights[2] ?? 0}
          rx={barW * 0.35}
          fill="#1A7A4A"
          style={animated ? { animation: 'wsBarIn 0.3s ease-out 0.5s both' } : {}}
        />
        <g
          className="ws-dot-wrap ws-dot"
          style={animated ? { animation: 'wsDotPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.75s both' } : {}}
        >
          <circle
            cx={totalBarsW + gap + dotR}
            cy={svgH * 0.12}
            r={dotR}
            fill="#FF6B00"
          />
        </g>
      </svg>
    </>
  )
}

interface LogoProps {
  size?: number
  showWordmark?: boolean
  animated?: boolean
  dark?: boolean
}

export function Logo({ size = 28, showWordmark = true, animated = true, dark = false }: LogoProps) {
  const played = useRef(false)
  if (!played.current) played.current = true

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} animated={animated} />
      {showWordmark && (
        <span
          style={{
            fontSize: `${size * 0.65}px`,
            letterSpacing: '-0.3px',
            animation: animated ? 'wsWordIn 0.3s ease-out 0.9s both' : undefined,
          }}
        >
          <style>{`
            @keyframes wsWordIn {
              0%   { opacity: 0; transform: translateX(-4px); }
              100% { opacity: 1; transform: translateX(0); }
            }
          `}</style>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: dark ? 'rgba(255,255,255,0.75)' : '#0A0A0A' }}>with</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
        </span>
      )}
    </div>
  )
}

export default Logo
