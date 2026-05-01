'use client'

import React, { useEffect } from 'react'

// NOTE: These protections deter casual copying but cannot prevent determined users
// (OS screenshot tools, DevTools). Server-side per-user watermarking would be needed
// for stronger protection. This is a deterrent layer only.

export function DashboardProtection({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      const blocked = ['c', 'a', 's', 'p', 'u']
      if ((e.ctrlKey || e.metaKey) && blocked.includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {/* Diagonal watermark — fixed to viewport */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none', userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '-30%', left: '-30%',
          width: '160%', height: '160%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(10, 1fr)',
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-30deg)',
              opacity: 0.035,
              color: 'var(--text3)',
              fontSize: 18,
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, system-ui, sans-serif',
              userSelect: 'none',
            }}>
              withSahib · INH000026266 · Confidential
            </div>
          ))}
        </div>
      </div>

      {/* Content sits above watermark */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </>
  )
}
