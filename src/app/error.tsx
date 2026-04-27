'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(244,123,123,0.1)',
          border: '1px solid rgba(244,123,123,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          marginBottom: 24,
        }}
      >
        ⚠
      </div>

      <h2
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: 12,
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          fontSize: 15,
          color: 'var(--text2)',
          marginBottom: 32,
          maxWidth: 400,
          lineHeight: 1.7,
        }}
      >
        An unexpected error occurred. Our team has been notified.
        {error.digest && (
          <span
            style={{
              display: 'block',
              marginTop: 8,
              fontSize: 11,
              color: 'var(--text4)',
              fontFamily: 'Courier New, monospace',
            }}
          >
            Error ID: {error.digest}
          </span>
        )}
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '11px 24px',
            background: 'var(--emerald)',
            color: '#031A13',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '11px 24px',
            background: 'transparent',
            color: 'var(--text2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontWeight: 500,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Go home
        </a>
      </div>
    </div>
  )
}
