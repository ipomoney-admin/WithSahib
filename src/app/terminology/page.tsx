import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Research Terminology — withSahib',
  description: 'Plain-English definitions of terms used in withSahib research notes. Entry Zone, Stop Loss, R:R, OI, PCR, IV Rank, EMA, Wyckoff Accumulation, and more.',
  alternates: { canonical: 'https://www.withsahib.com/terminology' },
}

const TERMS: { term: string; definition: string }[] = [
  {
    term: 'Entry Zone',
    definition: 'The price range within which a position can be initiated. Not a single price — a zone that accounts for execution variance.',
  },
  {
    term: 'Stop Loss (SL)',
    definition: 'The price at which a trade is closed to limit losses. Defined before entry. Non-negotiable once set.',
  },
  {
    term: 'Target 1 / T1',
    definition: 'The first profit-taking level. Conservative — typically 40–50% of the expected move.',
  },
  {
    term: 'Target 2 / T2',
    definition: 'The extended profit target. For positions that develop strongly.',
  },
  {
    term: 'R:R (Risk-to-Reward)',
    definition: 'Ratio of potential loss to potential gain. A 1:2 R:R means risking ₹1 to make ₹2. Minimum 1:2 on all withSahib recommendations.',
  },
  {
    term: 'Open Interest (OI)',
    definition: 'Total number of outstanding derivative contracts. Rising OI with rising price = bullish confirmation.',
  },
  {
    term: 'PCR (Put-Call Ratio)',
    definition: 'Ratio of put open interest to call open interest. Above 1.0 = more puts = bearish sentiment.',
  },
  {
    term: 'IV Rank',
    definition: 'Implied Volatility Rank. Measures current IV vs. 52-week range. High IV rank = expensive options.',
  },
  {
    term: 'EMA',
    definition: 'Exponential Moving Average. Gives more weight to recent prices. 20 EMA used for short-term, 50 EMA for medium-term trend.',
  },
  {
    term: 'Support',
    definition: 'A price level where buying interest is expected to emerge. A floor.',
  },
  {
    term: 'Resistance',
    definition: 'A price level where selling pressure is expected. A ceiling.',
  },
  {
    term: 'Breakout',
    definition: 'When price moves above resistance on high volume. Confirms strength.',
  },
  {
    term: 'Expiry Day',
    definition: 'The day F&O contracts expire (weekly for index options, monthly for stock options).',
  },
  {
    term: 'FII / DII',
    definition: 'Foreign / Domestic Institutional Investors. Their net buying/selling is tracked for market direction.',
  },
  {
    term: 'Wyckoff Accumulation',
    definition: 'A price pattern indicating institutional buying before a markup phase.',
  },
]

export default function TerminologyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Glossary</div>
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
            Research Terminology
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Plain-English definitions of terms used in withSahib research notes.
          </p>
        </div>
      </section>

      {/* Glossary Grid */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 16,
            }}
          >
            {TERMS.map(({ term, definition }) => (
              <div
                key={term}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '24px 28px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 8,
                    fontStyle: 'italic',
                  }}
                >
                  {term}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>{definition}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 40,
              padding: '16px 24px',
              background: 'rgba(255,107,0,0.04)',
              border: '1px solid rgba(255,107,0,0.15)',
              borderRadius: 12,
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.8 }}>
              Terms and definitions are used consistently across all withSahib research reports published
              under SEBI RA registration INH000026266. If a term in a report is unclear, email{' '}
              <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>
                connect@withsahib.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
