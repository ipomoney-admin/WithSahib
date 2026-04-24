'use client'

import { useEffect, useRef } from 'react'

export function AnimatedLogo() {
  const playedRef = useRef(false)

  useEffect(() => {
    playedRef.current = true
  }, [])

  return (
    <svg
      width="148"
      height="36"
      viewBox="0 0 148 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="withSahib.com"
    >
      {/* Bar 1 — shortest */}
      <rect className="ws-anim-bar1" x="0" y="20" width="9" height="14" fill="#00C896" opacity="0.4" rx="2" />
      {/* Bar 2 — medium */}
      <rect className="ws-anim-bar2" x="13" y="11" width="9" height="23" fill="#00C896" opacity="0.7" rx="2" />
      {/* Bar 3 — tallest */}
      <rect className="ws-anim-bar3" x="26" y="2" width="9" height="32" fill="#00C896" opacity="1.0" rx="2" />
      {/* Pulse dot */}
      <circle className="ws-anim-dot" cx="39" cy="4" r="3.5" fill="#00C896" />
      {/* Wordmark — starts at x=52 giving a clear 13px gap from dot */}
      <g className="ws-anim-word">
        <text x="52" y="25" fontFamily="Outfit, system-ui, sans-serif" fontWeight="400" fontSize="18" fill="currentColor">with</text>
        <text x="80" y="25" fontFamily="Outfit, system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#00C896">Sahib</text>
        <text x="121" y="25" fontFamily="Outfit, system-ui, sans-serif" fontWeight="300" fontSize="18" fill="currentColor" opacity="0.55">.com</text>
      </g>
    </svg>
  )
}
