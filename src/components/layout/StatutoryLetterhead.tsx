'use client'

import Link from 'next/link'
import { LogoMark } from '@/components/ui/Logo'

interface StatutoryLetterheadProps {
  title: string
  lastUpdated?: string
}

export function StatutoryLetterhead({ title, lastUpdated }: StatutoryLetterheadProps) {
  return (
    <>
      {/* Letterhead bar */}
      <div
        style={{
          background: '#FAFAF7',
          borderBottom: '2px solid #FF6B00',
          padding: '28px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Left: logo + wordmark */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogoMark size={32} animated={false} />
          <span style={{ fontSize: '22px', letterSpacing: '-0.3px' }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0A0A0A', fontWeight: 400 }}>with</span>
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
          </span>
        </Link>

        {/* Right: SEBI details */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#6E6E73', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.5px', marginBottom: '2px' }}>
            SEBI RA INH000026266
          </p>
          <p style={{ fontSize: '11px', color: '#6E6E73', fontFamily: 'Inter, system-ui, sans-serif' }}>
            Sahib Singh Hora
          </p>
        </div>
      </div>

      {/* Page title block */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 0' }}>
        <p style={{ fontSize: '12px', color: '#6E6E73', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          Legal
        </p>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '40px', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px' }}>
          {title}
        </h1>
        {lastUpdated && (
          <p style={{ fontSize: '14px', color: '#6E6E73', marginBottom: '48px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </>
  )
}
