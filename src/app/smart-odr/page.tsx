import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SMART ODR — Online Dispute Resolution | withSahib',
  description: 'SMART ODR is a SEBI-mandated online dispute resolution platform for resolving securities market disputes without going to court.',
  alternates: { canonical: 'https://www.withsahib.com/smart-odr' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

export default function SmartOdrPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Dispute Resolution</div>
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
            SMART ODR
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Online Dispute Resolution for securities market investors.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* What is SMART ODR */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              What is SMART ODR?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
              SMART ODR (Online Dispute Resolution) is a SEBI-mandated platform for resolving disputes
              between investors and market intermediaries online — without going to court. It is free,
              fast, and government-backed.
            </p>
          </div>

          {/* When to use it */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              When to Use It
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
              SMART ODR is Level 3 in the withSahib grievance redressal process. Use it if your complaint
              at Level 1 (withSahib internal) and Level 2 (SEBI SCORES) has not been resolved satisfactorily.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Your internal complaint (Level 1) was not resolved within 30 days',
                'Your SEBI SCORES complaint (Level 2) did not yield a satisfactory resolution',
                'You want an independent, neutral arbitration process',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--orange)', flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Big CTA */}
          <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 28px' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
              Official Platform
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              SMART ODR Portal
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
              Visit the official SEBI-mandated SMART ODR platform to file your dispute online.
              The process is free and typically resolved within 21 days.
            </p>
            <a
              href="https://smartodr.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', background: 'var(--orange)', color: '#FFFFFF',
                borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              Go to SMART ODR Platform →
            </a>
          </div>

          {/* Back link */}
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/grievance-redressal"
              style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none', fontWeight: 500 }}
            >
              ← Back to Grievance Redressal Process
            </Link>
          </div>

        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
