'use client'

import Link from 'next/link'

const FOOTER_LINKS = {
  Services: [
    { label: 'Intraday Calls', href: '/services/intraday' },
    { label: 'Stock Options', href: '/services/stock-options' },
    { label: 'Index Options', href: '/services/index-options' },
    { label: 'Swing Trades', href: '/services/swing' },
    { label: 'Model Portfolio', href: '/services/portfolio' },
    { label: 'Appointments', href: '/appointments' },
  ],
  Research: [
    { label: 'AI Reports', href: '/reports' },
    { label: 'Track Record', href: '/track-record' },
    { label: 'Trade History', href: '/track-record' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'About Sahib', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'SEBI Verification', href: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14', target: '_blank' },
  ],
}

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        padding: '56px 40px 32px',
      }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
                {[{ h: 8, op: .35 }, { h: 13, op: .65 }, { h: 20, op: 1 }].map((c, i) => (
                  <div key={i} style={{ width: '4px', height: `${c.h}px`, background: `rgba(0,200,150,${c.op})`, borderRadius: '2px' }} />
                ))}
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--emerald)', marginBottom: '1px', marginLeft: '1px' }} />
              </div>
              <span style={{ fontSize: '16px' }}>
                <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
                <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
                <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text3)', lineHeight: '1.7', maxWidth: '240px', marginBottom: '16px' }}>
              Research with clarity. Trade with confidence. Powered by SEBI-registered expertise and AI.
            </p>
            <div
              style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '1px',
                color: 'var(--gold)',
                border: '1px solid rgba(212,168,67,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontFamily: 'Courier New, monospace',
                background: 'rgba(212,168,67,0.04)',
              }}
            >
              INH000026266
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  color: 'var(--text3)',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                {section}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={(link as any).target}
                    rel={(link as any).target === '_blank' ? 'noopener noreferrer' : undefined}
                    style={{
                      textDecoration: 'none',
                      fontSize: '13px',
                      color: 'var(--text3)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = 'var(--emerald)')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = 'var(--text3)')
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEBI Disclaimer */}
        <div className="sebi-disclaimer" style={{ marginBottom: '32px' }}>
          <strong style={{ color: 'var(--gold)', fontWeight: 600 }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary
          or provide any assurance of returns to investors. Past performance is not indicative of future results.
          Research Analyst: <strong style={{ color: 'var(--text2)', fontWeight: 500 }}>Sahib Singh Hora</strong> ·
          SEBI RA Registration No. <strong style={{ fontWeight: 600, fontFamily: 'Courier New, monospace' }}>INH000026266</strong> ·
          Valid: 20th April 2026 – 19th April 2031
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
              © 2026 Sahib Singh Hora. All rights reserved. | withSahib.com
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
              SEBI RA · INH000026266
            </p>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', paddingTop: '8px', paddingBottom: '4px' }}>
            Developed by{' '}
            <a
              href="https://www.altitans.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text3)', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
            >
              Altitans Intelligence Private Limited
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
