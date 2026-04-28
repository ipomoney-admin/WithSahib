import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Swing Trade Research — 2-10 Day NSE Setups | withSahib',
  description:
    'Positional research by SEBI RA Sahib Singh Hora (INH000026266). 8–12 high-conviction NSE setups per month — low risk, asymmetric reward, full written rationale. Available on Positional plan.',
  alternates: { canonical: 'https://www.withsahib.com/services/swing' },
  openGraph: {
    url: 'https://www.withsahib.com/services/swing',
    title: 'Swing Trade Research — 2-10 Day NSE Setups | withSahib',
    description: '8–12 high-conviction positional setups per month by SEBI RA Sahib Singh Hora. Low risk, asymmetric reward. Available on Positional plan and above.',
  },
}

const PATTERNS = [
  { name: 'Bull Flag', desc: 'Strong momentum move followed by orderly pullback to EMA. Continuation setup with measured move target.' },
  { name: 'Symmetrical Triangle', desc: 'Converging trendlines with volume compression. Breakout direction confirmed by volume surge 1.5–3x average.' },
  { name: 'Cup & Handle', desc: 'Classic reversal/continuation pattern. Handle breakout with volume marks institutional accumulation complete.' },
  { name: 'EMA Pullback', desc: 'In strong uptrend, stock pulls back to 20-day EMA with declining volume. Entry on the bounce candle.' },
  { name: 'Resistance Breakout', desc: 'Multi-month horizontal resistance broken on high volume. First pullback to breakout level is the entry.' },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Swing Trade Research — 2-10 Day NSE Setups',
  description: 'Swing trade research by SEBI RA Sahib Singh Hora (INH000026266). 3–5 NSE positional setups per week — bull flags, breakouts, volume confirmation, full entry/target/SL.',
  provider: {
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    identifier: 'INH000026266',
    url: 'https://www.withsahib.com/about',
  },
  url: 'https://www.withsahib.com/services/swing',
  areaServed: { '@type': 'Country', name: 'India' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.withsahib.com/services' },
    { '@type': 'ListItem', position: 3, name: 'Swing Trades', item: 'https://www.withsahib.com/services/swing' },
  ],
}

export default function SwingTradePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: 0, right: '10%' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag">Swing Trades</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            2–10 day NSE swing picks —{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>pattern-based, systematic</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            3–5 NSE positional trade ideas per week. Each pick includes the chart pattern, sector context, entry range, two targets, and a stop-loss — from SEBI RA Sahib Singh Hora (INH000026266).
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/pricing?plan=positional" style={{ padding: '13px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Access Positional Research — ₹3,999/mo
            </Link>
            <Link href="/blog/swing-trading-stocks-india-2-10-day-holding-strategy" style={{ padding: '13px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Read: Swing Trading Guide
            </Link>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--sapphire)', background: 'rgba(100,160,255,0.06)', border: '1px solid rgba(100,160,255,0.2)', padding: '5px 12px', borderRadius: 6 }}>
            Available on Positional plan and above
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* What's included */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>What each swing pick includes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Stock & exchange', val: 'NSE-listed equities, large & mid cap' },
                { label: 'Chart pattern', val: 'Named pattern with screenshot reference' },
                { label: 'Entry range', val: 'Price zone — not a single exact price' },
                { label: 'Target 1 & 2', val: 'Conservative and extended targets' },
                { label: 'Stop-loss', val: 'Below pattern low / key support' },
                { label: 'Holding period', val: '2–10 trading days expected' },
                { label: 'Sector context', val: 'Why this sector now' },
                { label: 'SEBI disclosure', val: 'INH000026266 on every research note' },
              ].map((item) => (
                <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Patterns used */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>Chart patterns used</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PATTERNS.map((p) => (
                <div key={p.name} style={{ display: 'flex', gap: 20, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: 12, fontWeight: 700, color: 'var(--emerald)', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', padding: '3px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>{p.name}</span>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Research Call */}
      <section style={{ padding: '0 40px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 400, color: 'var(--text)', marginBottom: 20 }}>What a swing call looks like</h2>
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="sample-banner">SAMPLE RESEARCH CALL — Illustrative Only</div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', fontSize: '64px', fontWeight: 900, color: 'rgba(139,92,246,0.04)', letterSpacing: '4px', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>
              SAMPLE
            </div>
            <div style={{ height: '3px', background: '#8B5CF6' }} />
            <div style={{ padding: '24px 28px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: 'var(--text)' }}>[SAMPLE CALL]</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(0,200,150,0.1)', color: 'var(--emerald)' }}>BUY</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>NSE · SWING · 2–7 DAYS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'ENTRY RANGE', value: '₹XXX – ₹XXX', color: 'var(--text)' },
                  { label: 'TARGET 1', value: '₹XXX (+X%)', color: 'var(--emerald)' },
                  { label: 'TARGET 2', value: '₹XXX (+X%)', color: 'var(--emerald)' },
                  { label: 'STOP LOSS', value: '₹XXX (-X%)', color: '#EF4444' },
                ].map((p) => (
                  <div key={p.label} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', marginBottom: '4px' }}>{p.label}</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: p.color, fontFamily: 'Courier New, monospace' }}>{p.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px', background: 'var(--bg2)', borderRadius: '10px', borderLeft: '2px solid #8B5CF6', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '10px' }}>
                <strong style={{ color: '#8B5CF6', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Rationale: </strong>
                Stock has formed a base above 20 EMA with RSI showing positive divergence. Entry on breakout of resistance zone. Holding period 2–7 trading days. Stop below recent swing low.
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.5 }}>
                Actual calls include the specific stock name, exact entry/target/SL levels, and full written rationale. Subscribe to access live swing picks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 40px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/services" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← All Services</Link>
          <span style={{ color: 'var(--border2)' }}>·</span>
          <Link href="/services/intraday" style={{ fontSize: 14, color: 'var(--emerald)', textDecoration: 'none' }}>Intraday Calls →</Link>
        </div>
        <div className="sebi-disclaimer" style={{ maxWidth: 700, margin: '0 auto', padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Past performance is not indicative of future results. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266
        </div>
      </section>
      <BookingBanner />
    </div>
  )
}
