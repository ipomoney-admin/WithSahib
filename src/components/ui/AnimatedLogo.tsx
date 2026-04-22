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
