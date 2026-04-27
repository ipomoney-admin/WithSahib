import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Index Options Research — Nifty BankNifty Sensex | withSahib',
  description:
    'Nifty, BankNifty, and Sensex options research by SEBI RA Sahib Singh Hora (INH000026266). OI analysis, PCR-based directional calls, and expiry-week strategies for serious Indian options traders.',
  alternates: { canonical: 'https://www.withsahib.com/services/index-options' },
  openGraph: {
    url: 'https://www.withsahib.com/services/index-options',
    title: 'Index Options Research — Nifty BankNifty Sensex | withSahib',
    description: 'Nifty & BankNifty options calls by SEBI RA INH000026266. OI analysis, PCR signals, expiry strategies — every week.',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Nifty & Bank Nifty Index Options Research',
  description: 'Nifty, BankNifty, and Sensex options research by SEBI RA Sahib Singh Hora (INH000026266). OI analysis, PCR-based directional calls, and expiry-week strategies.',
  provider: {
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    identifier: 'INH000026266',
    url: 'https://www.withsahib.com/about',
  },
  url: 'https://www.withsahib.com/services/index-options',
  areaServed: { '@type': 'Country', name: 'India' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.withsahib.com/services' },
    { '@type': 'ListItem', position: 3, name: 'Index Options', item: 'https://www.withsahib.com/services/index-options' },
  ],
}

export default function IndexOptionsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: 0, left: '40%' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag">Index Options</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Nifty & Bank Nifty options —{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>OI-driven calls</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            Directional index options calls using open interest analysis, put-call ratio signals, and multi-timeframe technicals. Every call from Sahib Singh Hora SEBI RA (INH000026266) includes the full rationale.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/pricing?plan=pro" style={{ padding: '13px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Access Index Options — Pro
            </Link>
            <Link href="/blog/bank-nifty-vs-nifty-options-complete-guide-2026" style={{ padding: '13px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Read: Nifty vs Bank Nifty Guide
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
            {[
              { sym: 'NIFTY 50', color: 'var(--emerald)', items: ['Weekly Thursday expiry calls', 'OI buildup at key strikes', 'PCR-based directional bias', 'Pre-expiry strategy (3 DTE)', 'Support/resistance call writing'] },
              { sym: 'BANK NIFTY', color: 'var(--gold)', items: ['High-volatility directional plays', 'RBI event-based strategies', 'Wednesday expiry momentum calls', 'Banking sector OI interpretation', 'Gap-fill and reversal setups'] },
            ].map((idx) => (
              <div key={idx.sym} style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: 16, padding: 28 }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 700, color: idx.color, marginBottom: 20 }}>{idx.sym}</p>
                {idx.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: idx.color, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>What each index options call includes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {['Index & direction', 'Strike price (CE/PE)', 'Entry premium range', 'Target premium', 'Stop-loss level', 'Holding period', 'OI/PCR rationale', 'Risk disclaimer'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--emerald)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 40px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/services/stock-options" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← Stock Options</Link>
          <span style={{ color: 'var(--border2)' }}>·</span>
          <Link href="/services/swing" style={{ fontSize: 14, color: 'var(--emerald)', textDecoration: 'none' }}>Swing Trades →</Link>
        </div>
        <div className="sebi-disclaimer" style={{ maxWidth: 700, margin: '0 auto', padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Index options are leveraged derivatives. They can expire worthless. Investments in securities market are subject to market risks. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266
        </div>
      </section>
      <BookingBanner />
    </div>
  )
}
