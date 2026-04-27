'use client'

import Link from 'next/link'
import { LogoMark } from '@/components/ui/Logo'

interface FooterLink { label: string; href: string; target?: string }

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Research: [
    { label: 'Research Reports', href: '/reports' },
    { label: 'Blog', href: '/blog' },
    { label: 'Methodology', href: '/methodology' },
  ],
  Company: [
    { label: 'About Sahib', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
    { label: 'Work With Us', href: '/work-with-us' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'MITC', href: '/mitc' },
  ],
}

const LEGAL_STRIP: FooterLink[] = [
  { label: 'Disclosure', href: '/disclosure' },
  { label: 'Investor Charter', href: '/investor-charter' },
  { label: 'File a Complaint', href: '/complaints' },
  { label: 'Grievance Redressal', href: '/grievance-redressal' },
  { label: 'SMART ODR', href: '/smart-odr' },
  { label: 'Terminology', href: '/terminology' },
  { label: 'Verify on SEBI.gov.in →', href: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14', target: '_blank' },
]

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{
        background: 'var(--black)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '56px 40px 32px',
      }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        {/* Top grid */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(3, 1fr)',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="withSahib homepage">
                <LogoMark size={40} animated={false} />
                <span style={{ fontSize: '26px', letterSpacing: '-0.3px' }}>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>with</span>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
                </span>
              </Link>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', maxWidth: '240px', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              Systematic equity research by SEBI RA Sahib Singh Hora. Accountable by regulation.
            </p>
            <a
              href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1px',
                color: '#D4A843',
                border: '1px solid rgba(212,168,67,0.25)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(212,168,67,0.08)',
                textDecoration: 'none',
              }}
            >
              INH000026266 · Verify on SEBI.gov.in →
            </a>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a
                href="https://wa.me/919981248888?text=Hi%20Sahib%2C%20I%20found%20you%20on%20withSahib.com%20and%20want%20to%20know%20more."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.2)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(37,211,102,0.1)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
              <a
                href="https://t.me/withsahib"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,136,204,0.2)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,136,204,0.1)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0088CC"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
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
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {section}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    target={link.target}
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    style={{
                      textDecoration: 'none',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.45)',
                      transition: 'color 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = '#FFFFFF')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')
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
        <div style={{ marginBottom: '32px', fontSize: '11px', color: 'rgba(255,255,255,0.28)', lineHeight: '1.7', padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontFamily: 'var(--font-body)' }}>
          <strong style={{ color: '#D4A843', fontWeight: 600 }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary
          or provide any assurance of returns to investors. Past performance is not indicative of future results.
          Research Analyst: <strong style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Sahib Singh Hora</strong> ·
          SEBI RA Registration No. <strong style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>INH000026266</strong>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
              © 2026 Sahib Singh Hora. All rights reserved. | withSahib.com
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
              SEBI RA · INH000026266
            </p>
          </div>
          <p style={{ fontSize: '11px', color: '#48484A', marginTop: '8px', fontFamily: 'var(--font-body)' }}>
            Compliance Officer: Sahib Singh Hora · sahib13singh13@gmail.com
          </p>
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px 0', alignItems: 'center' }}>
            {LEGAL_STRIP.map((link, i) => (
              <span key={link.href} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span style={{ color: '#2C2C2E', margin: '0 10px', fontSize: '10px' }}>·</span>}
                <Link
                  href={link.href}
                  target={link.target}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  style={{
                    fontSize: '11px', color: '#3A3A3C',
                    textDecoration: 'none', fontFamily: 'var(--font-body)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#3A3A3C')}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
