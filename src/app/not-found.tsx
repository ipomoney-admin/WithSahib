import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  robots: { index: false, follow: false },
}

const SUGGESTED = [
  { label: 'Home', href: '/', desc: 'Back to the homepage' },
  { label: 'Pricing', href: '/pricing', desc: 'View subscription plans' },
  { label: 'Intraday Calls', href: '/services/intraday', desc: 'Daily trade signals' },
  { label: 'Research Reports', href: '/reports', desc: 'Data-driven stock research' },
  { label: 'FAQ', href: '/faq', desc: 'Common questions answered' },
  { label: 'Contact', href: '/contact', desc: 'Get in touch' },
]

export default function NotFound() {
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 640 }}>
        {/* 404 number */}
        <div
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(96px, 18vw, 180px)',
            fontWeight: 400,
            lineHeight: 1,
            color: 'rgba(0,200,150,0.06)',
            letterSpacing: -4,
            marginBottom: -20,
            userSelect: 'none',
          }}
        >
          404
        </div>

        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(0,200,150,0.08)',
            border: '1px solid rgba(0,200,150,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            fontSize: 28,
          }}
        >
          ↗
        </div>

        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'var(--text2)',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 440,
            margin: '0 auto 40px',
          }}
        >
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
          Here are some helpful links:
        </p>

        {/* Suggested pages */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 10,
            marginBottom: 40,
            textAlign: 'left',
          }}
        >
          {SUGGESTED.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              style={{
                padding: '14px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                {page.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{page.desc}</div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            background: 'var(--emerald)',
            color: '#031A13',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          ← Go Home
        </Link>

        <p
          style={{
            marginTop: 36,
            fontSize: 11,
            color: 'var(--text4)',
            fontFamily: 'Courier New, monospace',
            letterSpacing: 1,
          }}
        >
          withSahib.com · SEBI RA INH000026266
        </p>
      </div>
    </div>
  )
}
