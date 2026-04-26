import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Disclosure with Advice — withSahib SEBI RA INH000026266',
  description: 'SEBI-mandated disclosures for Research Analyst Sahib Singh Hora (INH000026266). Registration, conflict of interest, financial interest, and methodology disclosures.',
  alternates: { canonical: 'https://www.withsahib.com/disclosure' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const DISCLOSURES = [
  {
    title: 'Registration Disclosure',
    body: 'Sahib Singh Hora is registered with SEBI as a Research Analyst under Registration No. INH000026266 under SEBI (Research Analysts) Regulations, 2014. Valid: April 20, 2026 to April 19, 2031.',
  },
  {
    title: 'Conflict of Interest',
    body: 'The Research Analyst or associates may hold securities in companies covered. Any such holding is disclosed in the relevant research note. Sahib Singh Hora does not undertake trading in the 30 days before or after publishing research on any security.',
  },
  {
    title: 'Financial Interest Disclosure',
    body: 'Research fees are subscription-based. withSahib does not accept commissions, referral fees, or payments from companies covered in research.',
  },
  {
    title: 'Research Methodology',
    body: 'All recommendations are based on technical and/or fundamental analysis. No guarantee of returns is implied. Every recommendation includes risk disclosure, entry zone, and stop-loss.',
  },
]

export default function DisclosurePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Regulatory</div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px,5vw,56px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Disclosure with Advice
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            SEBI-mandated disclosures for Research Analyst Sahib Singh Hora (INH000026266).
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Letterhead */}
          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.2)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 14 }}>
              SEBI Registered Research Analyst
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Registration No.</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>INH000026266</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Analyst</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Sahib Singh Hora</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Category</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>SEBI RA — Individual</p>
              </div>
            </div>
          </div>

          {/* Disclosure Cards */}
          {DISCLOSURES.map((d, i) => (
            <div key={i} style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                {i + 1}. {d.title}
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>{d.body}</p>
            </div>
          ))}

          {/* SEBI Verification */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              Verify Registration
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
              You can verify the SEBI registration of Sahib Singh Hora (INH000026266) on the official SEBI portal.
            </p>
            <a
              href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 22px', background: 'var(--orange)', color: '#FFFFFF',
                borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              Verify on SEBI.gov.in →
            </a>
          </div>

        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
