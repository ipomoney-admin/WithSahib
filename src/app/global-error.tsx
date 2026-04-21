'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#06090F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#E8EDF5',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(244,123,123,0.12)',
            border: '1px solid rgba(244,123,123,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            marginBottom: 24,
          }}
        >
          ⚠
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: '#E8EDF5', marginBottom: 8 }}>
          with<span style={{ color: '#00C896' }}>Sahib</span>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 400, color: '#E8EDF5', marginBottom: 12 }}>
          Application error
        </h2>

        <p style={{ fontSize: 15, color: '#8FA8C0', marginBottom: 32, maxWidth: 380, lineHeight: 1.7 }}>
          A critical error occurred. Please try refreshing the page.
        </p>

        <button
          onClick={reset}
          style={{
            padding: '12px 28px',
            background: '#00C896',
            color: '#031A13',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </body>
    </html>
  )
}
