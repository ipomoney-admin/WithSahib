import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Swing Trades — 2–10 Day NSE Stock Picks',
  description:
    'Swing trade picks by SEBI RA Sahib Singh Hora (INH000026266). 3–5 NSE positional trade ideas per week — chart pattern breakouts, volume confirmation, full entry/target/SL. Basic plan.',
  alternates: { canonical: 'https://www.withsahib.com/services/swing' },
  openGraph: {
    title: 'Swing Trades — NSE Positional Picks | withSahib SEBI RA',
    description: '2–10 day swing trade picks by SEBI RA Sahib Singh Hora. Bull flags, breakouts, positional entries for NSE stocks. Available on Basic plan.',
    url: 'https://www.withsahib.com/services/swing',
  },
}

const PATTERNS = [
  { name: 'Bull Flag', desc: 'Strong momentum move followed by orderly pullback to EMA. Continuation setup with measured move target.' },
  { name: 'Symmetrical Triangle', desc: 'Converging trendlines with volume compression. Breakout direction confirmed by volume surge 1.5–3x average.' },
  { name: 'Cup & Handle', desc: 'Classic reversal/continuation pattern. Handle breakout with volume marks institutional accumulation complete.' },
  { name: 'EMA Pullback', desc: 'In strong uptrend, stock pulls back to 20-day EMA with declining volume. Entry on the bounce candle.' },
  { name: 'Resistance Breakout', desc: 'Multi-month horizontal resistance broken on high volume. First pullback to breakout level is the entry.' },
]

export default function SwingTradePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: 0, right: '10%' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag">Swing Trades</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            2–10 day NSE swing picks —{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>pattern-based, systematic</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            3–5 NSE positional trade ideas per week. Each pick includes the chart pattern, sector context, entry range, two targets, and a stop-loss — from SEBI RA Sahib Singh Hora (INH000026266).
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link href="/pricing?plan=basic" style={{ padding: '13px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Access Swing Picks — Basic (₹999/mo)
            </Link>
            <Link href="/blog/swing-trading-stocks-india-2-10-day-holding-strategy" style={{ padding: '13px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Read: Swing Trading Guide
            </Link>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--sapphire)', background: 'rgba(100,160,255,0.06)', border: '1px solid rgba(100,160,255,0.2)', padding: '5px 12px', borderRadius: 6 }}>
            Available on Basic plan and above
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* What's included */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>What each swing pick includes</h2>
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
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>Chart patterns used</h2>
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

      <Footer />
    </div>
  )
}
