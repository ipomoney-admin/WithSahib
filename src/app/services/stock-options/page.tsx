import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Stock Options Advisory — Weekly & Monthly Strategies',
  description:
    'SEBI RA Sahib Singh Hora (INH000026266) publishes weekly and monthly stock options strategies — strike selection, premium targets, and risk-defined setups for NSE-listed equities.',
  alternates: { canonical: 'https://www.withsahib.com/services/stock-options' },
  openGraph: {
    title: 'Stock Options Advisory — withSahib SEBI RA',
    description: 'Weekly & monthly stock options strategies by SEBI RA Sahib Singh Hora INH000026266. Strike selection, premium targets, defined-risk setups.',
    url: 'https://www.withsahib.com/services/stock-options',
  },
}

export default function StockOptionsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-gold" style={{ width: '500px', height: '400px', top: 0, left: '60%' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag">Stock Options</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            NSE Stock Options — <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>weekly & monthly strategies</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 32 }}>
            Defined-risk options strategies on NSE-listed equities. Strike selection, premium targets, and full rationale — published by SEBI RA Sahib Singh Hora (INH000026266).
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/pricing?plan=pro" style={{ padding: '13px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Access Stock Options — Pro
            </Link>
            <Link href="/faq" style={{ padding: '13px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Read FAQ
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { title: 'Weekly CE/PE strategies', desc: 'Near-the-money and out-of-the-money calls and puts with weekly expiry — targeting 30–80% premium gain on defined risk.' },
            { title: 'Monthly positional options', desc: 'Longer-dated setups using monthly contracts. Lower theta decay pressure, suited for swing option strategies.' },
            { title: 'Strike & premium selection', desc: 'Each call specifies exact strike, type (CE/PE), entry premium range, target premium, and stop-loss premium — no ambiguity.' },
            { title: 'Risk-defined setups only', desc: 'All stock options calls from withSahib are buying strategies — maximum loss is limited to premium paid. No naked selling for retail subscribers.' },
            { title: 'Quarterly results plays', desc: 'Options strategies around earnings — using IV expansion/contraction patterns and historical earnings move analysis.' },
            { title: 'SEBI-compliant disclosure', desc: 'Every options call carries the SEBI registration number INH000026266, analyst disclosure, and mandatory risk disclaimer.' },
          ].map((f) => (
            <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 40px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/services" style={{ fontSize: 14, color: 'var(--text3)', textDecoration: 'none' }}>← All Services</Link>
          <span style={{ color: 'var(--border2)' }}>·</span>
          <Link href="/services/index-options" style={{ fontSize: 14, color: 'var(--emerald)', textDecoration: 'none' }}>Index Options →</Link>
        </div>
        <div className="sebi-disclaimer" style={{ maxWidth: 700, margin: '0 auto', padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Options can result in 100% loss of premium. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266
        </div>
      </section>
      <BookingBanner />$1
    </div>
  )
}
