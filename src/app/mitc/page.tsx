import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Most Important Terms & Conditions — withSahib',
  description: 'Key terms all withSahib subscribers must understand before subscribing. Research, payments, compliance, and dispute resolution terms.',
  alternates: { canonical: 'https://www.withsahib.com/mitc' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const SECTIONS = [
  {
    title: 'Research, Not Tips',
    body: 'withSahib publishes research recommendations under SEBI RA registration INH000026266. These are structured research notes with rationale, entry zone, stop-loss, and targets — not guaranteed trading tips or personalised financial advice.',
  },
  {
    title: 'No Guaranteed Returns',
    body: 'Investments in securities markets are subject to market risk. Read all related documents carefully before investing. No recommendation on withSahib guarantees profit. Past performance is not indicative of future results.',
  },
  {
    title: 'Subscription Terms',
    body: 'Subscriptions are billed monthly or annually. Access to research continues until the end of the billing period after cancellation. No prorated refunds for partial months. See the Refund Policy for full terms.',
  },
  {
    title: 'Payment',
    body: 'All payments are processed securely via Razorpay. withSahib does not store card details. Subscription fees are the sole source of research revenue — we do not accept commissions or referral fees.',
  },
  {
    title: 'Compliance with SEBI',
    body: 'All research is published in compliance with SEBI (Research Analysts) Regulations, 2014 under registration INH000026266. Research is general in nature. Sahib Singh Hora is NISM certified.',
  },
  {
    title: 'Disputes',
    body: null,
    isDisputes: true,
  },
]

export default function MitcPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Legal</div>
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
            Most Important Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Key terms all withSahib subscribers must understand before subscribing.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {SECTIONS.map((s, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'var(--orange)',
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                    {s.title}
                  </h2>
                  {s.isDisputes ? (
                    <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
                      For disputes, refer to the{' '}
                      <Link href="/grievance-redressal" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                        Grievance Redressal Process
                      </Link>
                      . Complaints can be escalated to SEBI SCORES and SMART ODR if unresolved internally within 30 days.
                    </p>
                  ) : (
                    <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Contact */}
          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.15)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 10 }}>Contact</p>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
              For questions about these terms, email{' '}
              <a href="mailto:connect@withsahib.com" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}>
                connect@withsahib.com
              </a>
              {' '}— withSahib · SEBI RA INH000026266 · Sahib Singh Hora
            </p>
          </div>

        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
