import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: "Who It's For — withSahib SEBI RA Research",
  description:
    'withSahib is built for active traders, swing traders, long-term investors, and HNI family offices who want accountable, SEBI-registered equity research — not anonymous tips.',
  alternates: { canonical: 'https://www.withsahib.com/who-its-for' },
}

const SEGMENTS = [
  {
    id: 'traders',
    tag: 'Active Traders',
    headline: 'Intraday & options traders who need research, not guesswork.',
    pain: "You've been burned by Telegram tipsters with no SEBI registration and zero accountability. You need pre-market setups with defined entry, target, and stop-loss — published before 9 AM.",
    gets: [
      'Daily intraday picks — NSE equities, pre-market by 9 AM',
      'Nifty & Bank Nifty options signals with OI + PCR analysis',
      'Risk-defined setups — max loss defined before entry',
      'Written rationale on every call, not just a price',
    ],
    plan: 'Pro Plan',
    planHref: '/pricing?tier=pro',
    accent: '#FF6B00',
  },
  {
    id: 'swing',
    tag: 'Swing Traders',
    headline: 'Positional traders who cannot watch screens all day.',
    pain: "You're a working professional. You can't monitor intraday. You need 2–10 day setups that are well-researched and based on clear chart patterns — not gut feel.",
    gets: [
      '3–5 swing picks per week — NSE-listed, liquid stocks only',
      'Pattern-based: breakouts, pullbacks, flags, cup-and-handle',
      'Multi-timeframe: daily + weekly alignment required',
      'Sector rotation context included on each pick',
    ],
    plan: 'Basic Plan',
    planHref: '/pricing?tier=basic',
    accent: '#1A7A4A',
  },
  {
    id: 'investors',
    tag: 'Long-Term Investors',
    headline: "Investors building wealth over years, not days.",
    pain: "You want a model portfolio that isn't just a list of popular stocks. You want documented valuation thesis, quarterly rebalancing with reasons published, and institutional-grade research backing every holding.",
    gets: [
      'Model portfolio — 10–15 NSE stocks across sectors',
      'Quarterly rebalancing with published reasoning',
      'DCF-backed research reports on each holding',
      'Dividend and corporate action updates',
    ],
    plan: 'Basic Plan',
    planHref: '/pricing?tier=basic',
    accent: '#1A7A4A',
  },
  {
    id: 'serious',
    tag: 'Serious Learners',
    headline: 'Want to understand markets — not just receive tips.',
    pain: "You want to understand the methodology, not just follow calls blindly. You want to learn technical analysis, options frameworks, and systematic research process from someone legally accountable.",
    gets: [
      'Structured courses on technical analysis & options',
      'Every call comes with the reasoning — you learn as you trade',
      '1-on-1 sessions to review your own positions and process',
      'Research reports with full DCF methodology shown',
    ],
    plan: 'Elite Plan',
    planHref: '/pricing?tier=elite',
    accent: '#D4A843',
  },
  {
    id: 'hni',
    tag: 'HNI / Family Offices',
    headline: 'High-net-worth investors who require bespoke coverage.',
    pain: "Generic advisory platforms give you the same calls as 50,000 other subscribers. You need custom research, direct analyst access, and a SEBI-registered relationship that is legally accountable.",
    gets: [
      'Custom research coverage on specific stocks or sectors',
      'Direct analyst relationship — not a support queue',
      'Unlimited 1-on-1 sessions with Sahib Singh Hora',
      'HNI research reports unavailable on any other plan',
    ],
    plan: 'Elite / Custom',
    planHref: '/contact',
    accent: '#D4A843',
  },
]

export default function WhoItsForPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          padding: '80px 40px 64px',
          background: 'var(--black)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 700px 400px at 60% 50%, rgba(255,107,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
            borderRadius: '20px', padding: '6px 16px', fontSize: '11px',
            fontWeight: 600, color: '#FF6B00', letterSpacing: '1.5px',
            marginBottom: '24px', fontFamily: 'var(--font-body)', textTransform: 'uppercase',
          }}>
            WHO IT&apos;S FOR
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Built for investors who{' '}
            <em style={{ color: '#FF6B00', fontStyle: 'italic', fontWeight: 400 }}>demand accountability.</em>
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: '600px',
              fontFamily: 'var(--font-body)',
            }}
          >
            withSahib is not for everyone. It is for people who want regulated, documented equity research — not anonymous signals from an unverified Telegram channel.
          </p>
        </div>
      </section>

      {/* Segment cards */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {SEGMENTS.map((seg) => (
            <div
              key={seg.id}
              id={seg.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${seg.accent}`,
                borderRadius: 'var(--r-lg)',
                padding: '40px',
                scrollMarginTop: 80,
              }}
            >
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: `${seg.accent}14`,
                border: `1px solid ${seg.accent}30`,
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                color: seg.accent,
                letterSpacing: '1px',
                marginBottom: '16px',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
              }}>
                {seg.tag}
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.2,
                  marginBottom: '16px',
                }}
              >
                {seg.headline}
              </h2>

              <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '24px', fontFamily: 'var(--font-body)' }}>
                {seg.pain}
              </p>

              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                  What you get
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {seg.gets.map((g) => (
                    <li key={g} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: seg.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  href={seg.planHref}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '10px 22px',
                    background: seg.accent,
                    color: seg.accent === '#D4A843' ? '#0A0A0A' : '#FFFFFF',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                    textDecoration: 'none', fontFamily: 'var(--font-body)',
                  }}
                >
                  {seg.plan} →
                </Link>
                <Link
                  href="/auth/register"
                  style={{
                    fontSize: '13px', color: 'var(--text3)', textDecoration: 'none',
                    fontFamily: 'var(--font-body)', fontWeight: 500,
                  }}
                >
                  Start free first
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '48px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>
            All research is published under
          </p>
          <p style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '24px', fontFamily: 'var(--font-body)' }}>
            Sahib Singh Hora · SEBI RA · INH000026266
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/pricing" style={{ padding: '12px 28px', background: 'var(--orange)', color: '#FFFFFF', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              See Plans
            </Link>
            <Link href="/about" style={{ padding: '12px 28px', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              About the Analyst
            </Link>
            <Link href="/appointments" style={{ padding: '12px 28px', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
