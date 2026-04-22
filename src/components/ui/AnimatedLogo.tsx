'use client'

import { useEffect, useRef } from 'react'

export function AnimatedLogo() {
  const playedRef = useRef(false)

  // Trigger animation only on first mount, never again
  useEffect(() => {
    playedRef.current = true
  }, [])

  return (
    <>
      <style>{`
        @keyframes barRise {
          from { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
          to   { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
        }
        @keyframes dotPop {
          0%   { transform: scale(0.1); opacity: 0; }
          60%  { transform: scale(2.0); opacity: 1; }
          100% { transform: scale(1.0); opacity: 1; }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1.0); }
          50%       { transform: scale(1.25); }
        }
        @keyframes wordFade {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ws-anim-bar1 { animation: barRise 0.35s ease-out 0s forwards; opacity: 0; transform-origin: bottom; transform-box: fill-box; }
        .ws-anim-bar2 { animation: barRise 0.35s ease-out 0.15s forwards; opacity: 0; transform-origin: bottom; transform-box: fill-box; }
        .ws-anim-bar3 { animation: barRise 0.35s ease-out 0.30s forwards; opacity: 0; transform-origin: bottom; transform-box: fill-box; }
        .ws-anim-dot  { animation: dotPop 0.5s ease-out 0.55s forwards, dotPulse 2s ease-in-out 1.1s infinite; opacity: 0; transform-origin: center; transform-box: fill-box; }
        .ws-anim-word { animation: wordFade 0.4s ease-out 0.9s forwards; opacity: 0; }
      `}</style>
      <svg
        width="120"
        height="32"
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="withSahib.com"
      >
        {/* Bar 1 — shortest */}
        <rect
          className="ws-anim-bar1"
          x="0" y="18" width="8" height="12"
          fill="#00C896" opacity="0.4" rx="1.5"
        />
        {/* Bar 2 — medium */}
        <rect
          className="ws-anim-bar2"
          x="12" y="10" width="8" height="20"
          fill="#00C896" opacity="0.7" rx="1.5"
        />
        {/* Bar 3 — tallest */}
        <rect
          className="ws-anim-bar3"
          x="24" y="2" width="8" height="28"
          fill="#00C896" opacity="1.0" rx="1.5"
        />
        {/* Pulse dot */}
        <circle
          className="ws-anim-dot"
          cx="36" cy="4" r="3"
          fill="#00C896"
        />
        {/* Wordmark */}
        <g className="ws-anim-word">
          <text x="44" y="22" fontFamily="Outfit, system-ui, sans-serif" fontWeight="300" fontSize="16" fill="currentColor">with</text>
          <text x="66" y="22" fontFamily="Outfit, system-ui, sans-serif" fontWeight="500" fontSize="16" fill="#00C896">Sahib</text>
          <text x="100" y="22" fontFamily="Outfit, system-ui, sans-serif" fontWeight="300" fontSize="16" fill="currentColor" opacity="0.6">.com</text>
        </g>
      </svg>
    </>
  )
}
