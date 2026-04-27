import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Grievance Redressal Process — withSahib',
  description: 'Step-by-step process to raise and resolve a complaint with withSahib. SEBI Registered Research Analyst Sahib Singh Hora (INH000026266).',
  alternates: { canonical: 'https://www.withsahib.com/grievance-redressal' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const STEPS = [
  {
    level: 'Level 1 — Internal',
    desc: 'Email connect@withsahib.com with your complaint details. Include your registered email, subscription plan, and a clear description of the issue.',
    detail: 'Compliance Officer: Sahib Singh Hora · sahib13singh13@gmail.com',
    action: 'connect@withsahib.com',
    href: 'mailto:connect@withsahib.com',
    note: 'Response within 30 days',
  },
  {
    level: 'Level 2 — SEBI SCORES',
    desc: 'If your complaint is not resolved within 30 days at Level 1, you may file on the SEBI SCORES portal. SEBI will facilitate resolution between you and withSahib.',
    detail: null,
    action: 'scores.sebi.gov.in',
    href: 'https://scores.sebi.gov.in',
    note: 'If Level 1 unresolved after 30 days',
  },
  {
    level: 'Level 3 — SMART ODR',
    desc: 'For online dispute resolution, visit SMART ODR. This is a free, government-backed platform for securities market disputes — no court required.',
    detail: null,
    action: 'smartodr.in',
    href: 'https://smartodr.in',
    note: 'Online dispute resolution',
  },
]

export default function GrievanceRedressalPage() {
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
            Grievance Redressal Process
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Step-by-step process to raise and resolve a complaint with withSahib.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Number */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'var(--orange)' : 'var(--surface)',
                  border: `1px solid ${i === 0 ? 'var(--orange)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700,
                  color: i === 0 ? '#FFFFFF' : 'var(--text3)',
                }}>
                  {i + 1}
                </div>

                <div style={{ ...cardStyle, flex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                    {step.level}
                  </h2>
                  <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, marginBottom: step.detail ? 10 : 16 }}>
                    {step.desc}
                  </p>
                  {step.detail && (
                    <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, fontStyle: 'italic' }}>{step.detail}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <a
                      href={step.href}
                      target={step.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ fontSize: 14, color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {step.action} →
                    </a>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{step.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to file complaint */}
          <div style={{ textAlign: 'center', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <p style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 16 }}>
              Ready to file a complaint? Start with Level 1 — our internal process.
            </p>
            <Button href="/complaints" variant="primary">
              File a Complaint →
            </Button>
          </div>

        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
