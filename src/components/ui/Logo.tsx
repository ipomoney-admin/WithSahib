'use client'

import { useEffect, useRef } from 'react'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  animated?: boolean
}

export function Logo({ size = 28, showWordmark = true, animated = true }: LogoProps) {
  const playedRef = useRef(false)

  // Only animate once per mount
  useEffect(() => {
    playedRef.current = true
  }, [])

  const barW = Math.round(size * 0.18)
  const gap = Math.round(size * 0.12)
  const dotR = Math.round(size * 0.12)
  const heights = [size * 0.38, size * 0.60, size * 0.88]
  const totalBarsW = barW * 3 + gap * 2
  const svgW = totalBarsW + dotR * 2 + gap
  const svgH = size

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <style>{`
        @keyframes wsBarIn {
          0%   { transform: scaleY(0); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes wsDotPop {
          0%   { transform: scale(0.1); opacity: 0; }
          55%  { transform: scale(2.0); opacity: 1; }
          100% { transform: scale(1.0); opacity: 1; }
        }
        @keyframes wsDotPulse {
          0%, 100% { transform: scale(1.0); }
          50%       { transform: scale(1.25); }
        }
        @keyframes wsWordIn {
          0%   { opacity: 0; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes wsBarShimmer {
          0%, 100% { filter: brightness(1); }
          50%       { filter: brightness(1.6) drop-shadow(0 0 4px #00C896); }
        }
        .ws-logo-svg:hover .ws-bar {
          animation: wsBarShimmer 0.6s ease forwards !important;
        }
        .ws-logo-svg:hover .ws-dot {
          animation: wsDotPulse 0.6s ease forwards !important;
        }
        .ws-bar {
          transform-origin: bottom center;
        }
        .ws-dot-wrap {
          transform-origin: center center;
        }
      `}</style>

      <svg
        className="ws-logo-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Bar 1 — shortest */}
        <rect
          className="ws-bar"
          x={0}
          y={svgH - heights[0]}
          width={barW}
          height={heights[0]}
          rx={barW * 0.35}
          fill="rgba(0,200,150,0.38)"
          style={animated ? {
            animation: 'wsBarIn 0.4s ease-out 0s both',
          } : {}}
        />
        {/* Bar 2 — medium */}
        <rect
          className="ws-bar"
          x={barW + gap}
          y={svgH - heights[1]}
          width={barW}
          height={heights[1]}
          rx={barW * 0.35}
          fill="rgba(0,200,150,0.68)"
          style={animated ? {
            animation: 'wsBarIn 0.4s ease-out 0.15s both',
          } : {}}
        />
        {/* Bar 3 — tallest */}
        <rect
          className="ws-bar"
          x={(barW + gap) * 2}
          y={svgH - heights[2]}
          width={barW}
          height={heights[2]}
          rx={barW * 0.35}
          fill="rgba(0,200,150,1)"
          style={animated ? {
            animation: 'wsBarIn 0.4s ease-out 0.30s both',
          } : {}}
        />
        {/* Pulse dot */}
        <g
          className="ws-dot-wrap ws-dot"
          style={animated ? {
            animation: 'wsDotPop 0.3s ease-out 0.6s both',
          } : {}}
        >
          <circle
            cx={totalBarsW + gap + dotR}
            cy={svgH * 0.12}
            r={dotR}
            fill="#00C896"
            style={animated ? {
              animation: 'wsDotPulse 2s ease-in-out 0.9s infinite',
            } : {}}
          />
        </g>
      </svg>

      {showWordmark && (
        <span
          style={{
            fontSize: `${size * 0.65}px`,
            letterSpacing: '-0.3px',
            animation: animated ? 'wsWordIn 0.4s ease-out 0.9s both' : undefined,
          }}
        >
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
          <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
        </span>
      )}
    </div>
  )
}
