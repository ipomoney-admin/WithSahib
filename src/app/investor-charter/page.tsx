import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Investor Charter — withSahib SEBI RA INH000026266',
  description: 'Investor Charter as required by SEBI for withSahib — SEBI Registered Research Analyst Sahib Singh Hora (INH000026266). Rights of investors and obligations of the Research Analyst.',
  alternates: { canonical: 'https://www.withsahib.com/investor-charter' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const INVESTOR_RIGHTS = [
  'Receive research reports with full written rationale for every recommendation.',
  'Access SEBI registration details of the Research Analyst at any time.',
  'File a complaint with SEBI SCORES if services are unsatisfactory.',
  'Approach the ODR mechanism (SMART ODR) for online dispute resolution.',
  'Receive disclosure of any conflicts of interest in every research note.',
  'Not be pressured into subscribing to any service by the Research Analyst.',
]

const RA_OBLIGATIONS = [
  'Publish all research under SEBI RA registration INH000026266.',
  'Disclose any conflicts of interest alongside every recommendation published.',
  'Maintain research integrity and independence at all times.',
  'Respond to investor complaints within 30 days of receipt.',
  'Comply fully with SEBI (Research Analysts) Regulations, 2014.',
]

export default function InvestorCharterPage() {
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
            Investor Charter
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            As required by SEBI, the following Investor Charter outlines the rights of investors and the
            obligations of withSahib as a SEBI Registered Research Analyst.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Letterhead */}
          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.2)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 14 }}>
              SEBI Registered Research Analyst
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>withSahib</p>
              <p style={{ fontSize: 14, color: 'var(--text2)' }}>Operated by <strong>Sahib Singh Hora</strong></p>
              <p style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'monospace', letterSpacing: 0.5 }}>SEBI RA Registration No. INH000026266</p>
              <p style={{ fontSize: 13, color: 'var(--text3)' }}>Valid: April 20, 2026 to April 19, 2031</p>
            </div>
          </div>

          {/* Rights of Investors */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
              Rights of Investors
            </h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {INVESTOR_RIGHTS.map((right, i) => (
                <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(26,122,74,0.1)', border: '1px solid rgba(26,122,74,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--green)', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, margin: 0, paddingTop: 2 }}>{right}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Obligations of RA */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
              Obligations of Research Analyst
            </h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {RA_OBLIGATIONS.map((obligation, i) => (
                <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--orange)', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, margin: 0, paddingTop: 2 }}>{obligation}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Grievance Redressal */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
              Grievance Redressal
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 20 }}>
              If you have a complaint, withSahib provides a structured escalation process. Start with our
              internal complaint mechanism and escalate to SEBI SCORES if unresolved within 30 days.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link
                href="/complaints"
                style={{
                  padding: '10px 22px', background: 'var(--orange)', color: '#FFFFFF',
                  borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              >
                File a Complaint
              </Link>
              <a
                href="https://scores.sebi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 22px', border: '1px solid var(--border)',
                  color: 'var(--text2)', borderRadius: 10, fontSize: 14,
                  fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)',
                }}
              >
                SEBI SCORES Portal
              </a>
            </div>
          </div>

        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
