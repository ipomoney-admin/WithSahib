import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Refund Policy — withSahib',
  description: 'Refund and cancellation policy for withSahib subscription plans. Learn about eligibility, how to claim a refund, and our billing terms.',
  alternates: { canonical: 'https://www.withsahib.com/refund-policy' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const SECTIONS = [
  {
    title: 'Cancellation',
    body: 'You may cancel your subscription at any time from your dashboard. Access continues until the end of the current billing period. No prorated refunds are issued for partial months.',
  },
  {
    title: 'Refund Eligibility',
    body: 'Refunds are available within 7 days of initial purchase for first-time subscribers only. Renewals are not eligible for refunds. Refunds are not issued after research content has been accessed.',
  },
  {
    title: 'How to Claim',
    body: 'Email connect@withsahib.com with your registered email, order ID, and reason for refund. We will respond within 5 business days.',
  },
  {
    title: 'Contact for Refunds',
    body: null,
    isContact: true,
  },
]

export default function RefundPolicyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Billing</div>
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
            Refund Policy
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Our refund terms for subscription plans.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                {i + 1}. {s.title}
              </h2>
              {s.isContact ? (
                <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
                  For refund requests, email{' '}
                  <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                    connect@withsahib.com
                  </a>
                  {' '}with your order details. We will respond within 5 business days.
                </p>
              ) : (
                <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>{s.body}</p>
              )}
            </div>
          ))}

          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.15)' }}>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--text2)' }}>Note: </strong>
              withSahib.com is operated by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
              Research services are subscription-based. Subscription fees cover access to research reports
              and are not refundable after content has been viewed.
            </p>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
