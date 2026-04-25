import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SEBI RA Services — Intraday Picks, Options, Swing Trades',
  description:
    'SEBI registered research analyst services by Sahib Singh Hora (INH000026266): daily intraday picks NSE, market signals today, Nifty options signals, Bank Nifty signals, swing trading stocks India, research reports & 1-on-1 advisory.',
  keywords: [
    'market intelligence',
    'market signals today',
    'intraday picks',
    'NSE picks',
    'best stock to buy today',
    'Nifty prediction today',
    'SEBI registered analyst',
    'research analyst India',
    'stock picks free',
    'intraday picks NSE',
    'options trading signals',
    'Nifty options signals today',
    'Bank Nifty signals',
    'swing trading stocks',
    'best stocks to buy',
    'stock market advisor India',
    'SEBI RA',
    'INH000026266',
    'Sahib Singh Hora',
    'paid stock advisory India',
    'stock market subscription India',
    'intraday picks with accuracy',
    'verified stock market analyst',
  ],
  alternates: { canonical: 'https://www.withsahib.com/services' },
  openGraph: {
    title: 'SEBI RA Services — Market Intelligence, Intraday Picks, Options',
    description: 'All SEBI-registered stock advisory services: daily intraday picks NSE, Nifty options, Bank Nifty calls, swing trading stocks, research reports.',
    url: 'https://www.withsahib.com/services',
  },
}

const SERVICES_DETAIL = [
  {
    id: 'intraday',
    title: 'Intraday Picks NSE',
    keywords: 'intraday picks · market intelligence · best stock to buy today · NSE picks',
    badge: 'Daily · Pro Plan',
    badgeColor: '#00C896',
    desc: 'Get SEBI-verified intraday stock calls for NSE equities every trading day before 9 AM. Each call includes the stock symbol, entry range, target price(s), and stop-loss level — calculated using multi-timeframe technical analysis, volume profile, and momentum indicators.',
    features: [
      'Published pre-market — before 9:15 AM IST',
      'Entry range, 1–2 targets, strict stop-loss',
      'Based on price action + volume + momentum',
      'SEBI-compliant: full analyst disclosure on every call',
      'Nifty prediction and market direction note included',
    ],
    why: 'Unlike anonymous Telegram tipsters, every intraday call from withSahib comes with the SEBI registration number INH000026266 — legally accountable, publicly verifiable.',
    href: '/services/intraday',
    cta: 'See Intraday Picks →',
  },
  {
    id: 'options',
    title: 'Nifty & Bank Nifty Options Signals',
    keywords: 'options trading signals · Nifty options signals today · Bank Nifty signals',
    badge: 'Weekly · Pro Plan',
    badgeColor: '#D4A843',
    desc: 'Options trading signals for Nifty and Bank Nifty — including strike selection, premium targets, and expiry day plays. Stock options strategies for weekly and monthly contracts with defined risk setups. Built on OI analysis, PCR signals, and volatility frameworks.',
    features: [
      'Nifty options signals today — before expiry sessions',
      'Bank Nifty signals with OI and PCR analysis',
      'Stock options: weekly and monthly strategies',
      'Risk-defined setups with max loss defined upfront',
      'IV rank and volatility context included',
    ],
    why: 'Options require precision. Every call from withSahib includes the reasoning — not just a strike price. Learn the methodology while you trade.',
    href: '/pricing',
    cta: 'Subscribe for Options Calls →',
  },
  {
    id: 'swing',
    title: 'Swing Trading Stocks India',
    keywords: 'swing trading stocks · best stocks to buy · NSE swing trade picks',
    badge: '3–5/Week · Basic Plan',
    badgeColor: '#64A0FF',
    desc: 'Swing trade picks for 2–10 day positional trades in NSE-listed stocks. Based on chart pattern breakouts — flags, triangles, cup-and-handle — combined with volume confirmation and multi-timeframe analysis. The best stocks to buy this week, curated by a SEBI RA.',
    features: [
      '3–5 swing trading stocks per week',
      'Pattern-based: breakouts, pullbacks, reversals',
      'Multi-timeframe: daily + weekly alignment',
      'Entry, target, stop-loss on every pick',
      'Sector rotation analysis included',
    ],
    why: 'Swing trading suits working professionals who cannot watch screens all day. All picks are for NSE-listed stocks with good liquidity and clear technical setups.',
    href: '/pricing',
    cta: 'Start with Basic Plan →',
  },
  {
    id: 'portfolio',
    title: 'Model Portfolio — Long Term NSE Picks',
    keywords: 'best stocks to buy · SEBI RA model portfolio · stock market subscription India',
    badge: 'Quarterly · Basic Plan',
    badgeColor: '#64A0FF',
    desc: 'A curated model portfolio of 10–15 NSE-listed equities for long-term wealth creation. Sector-diversified, quarterly rebalanced with published rationale. Every holding is research-backed with a valuation thesis — not just a name on a list.',
    features: [
      '10–15 stocks across sectors',
      'Quarterly rebalancing with published reasoning',
      'Allocation % and holding period for each stock',
      'Live portfolio performance tracking',
      'Dividend and corporate action updates',
    ],
    why: 'Unlike random "best stocks to buy" lists, the withSahib model portfolio has a documented investment thesis for every holding — updated under SEBI RA research guidelines.',
    href: '/pricing',
    cta: 'Access Model Portfolio →',
  },
  {
    id: 'reports',
    title: 'Stock Research Reports India',
    keywords: 'stock research report India · market signals today · best research analyst India',
    badge: 'On Filing · Pro Plan',
    badgeColor: '#00C896',
    desc: 'Institutional-grade research reports published when BSE/NSE-listed companies file quarterly results or major announcements. DCF models, earnings analysis, management commentary breakdown, and buy/hold/sell recommendations.',
    features: [
      'Published on Q1/Q2/Q3/Q4 results',
      'DCF valuation model included',
      'Management commentary analysis',
      'Buy / Hold / Sell recommendation',
      'Comparison vs analyst consensus estimates',
    ],
    why: 'The best research analyst India platforms charge ₹50,000+ per report. withSahib makes this accessible to retail investors at Pro plan pricing.',
    href: '/reports',
    cta: 'View Research Reports →',
  },
  {
    id: 'appointments',
    title: '1-on-1 Advisory Sessions',
    keywords: 'stock market advisor India · SEBI registered analyst fees · paid stock advisory India',
    badge: 'By Slot · Elite Plan',
    badgeColor: '#D4A843',
    desc: 'Book a personal video session with Sahib Singh Hora — SEBI RA INH000026266. 15 or 30-minute slots for portfolio review, stock deep-dives, options strategy consultation, or general trading process improvement.',
    features: [
      'Portfolio review: holdings, risk, rebalancing',
      'Stock deep-dive: valuation + technical + fundamentals',
      'Options strategy consultation',
      'Trading process and psychology coaching',
      'Unlimited sessions for Elite subscribers',
    ],
    why: 'This is the only way to get personalised, SEBI-accountable one-on-one stock advisory in India at scale. No anonymous "coaches" — a verified analyst with a public registration number.',
    href: '/appointments',
    cta: 'Book a Session →',
  },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'withSahib SEBI RA Services',
  description: 'Complete list of SEBI-registered research analyst services by Sahib Singh Hora (INH000026266)',
  itemListElement: SERVICES_DETAIL.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.title,
    url: `https://www.withsahib.com/services#${s.id}`,
  })),
}

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 64px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: '-20%', left: '40%' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div className="section-tag">SEBI Registered · INH000026266</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Market intelligence &amp;{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>research services</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
            SEBI-verified intraday picks NSE, Nifty options signals today, Bank Nifty calls, swing trading stocks,
            and in-depth research reports — all under one SEBI registered research analyst platform.
          </p>

          {/* Quick keyword links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Intraday Picks', href: '#intraday' },
              { label: 'Options Calls', href: '#options' },
              { label: 'Swing Trades', href: '#swing' },
              { label: 'Model Portfolio', href: '#portfolio' },
              { label: 'Research', href: '#reports' },
              { label: '1-on-1 Advisory', href: '#appointments' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{ padding: '7px 14px', background: 'rgba(0,200,150,0.07)', border: '1px solid rgba(0,200,150,0.18)', borderRadius: 20, fontSize: 13, color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services detail */}
      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          {SERVICES_DETAIL.map((svc) => (
            <div key={svc.id} id={svc.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px', scrollMarginTop: 80 }}>
              {/* Top */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text4)', letterSpacing: 1, marginBottom: 8, fontFamily: 'Courier New, monospace' }}>{svc.keywords}</p>
                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.2 }}>{svc.title}</h2>
                </div>
                <span style={{ padding: '6px 14px', background: `${svc.badgeColor}18`, border: `1px solid ${svc.badgeColor}30`, borderRadius: 20, fontSize: 11, fontWeight: 700, color: svc.badgeColor, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                  {svc.badge}
                </span>
              </div>

              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 24 }}>{svc.desc}</p>

              {/* Features */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 12 }}>What&apos;s included</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {svc.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--emerald)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why */}
              <div style={{ padding: '14px 16px', background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: 10, marginBottom: 24, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--emerald)' }}>Why withSahib: </strong>{svc.why}
              </div>

              <Link href={svc.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--emerald)', color: '#031A13', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                {svc.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section style={{ padding: '48px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>All services are provided by</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Sahib Singh Hora · SEBI RA · INH000026266</p>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>withSahib.com · SEBI RA INH000026266</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/pricing" style={{ padding: '12px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              See Pricing
            </Link>
            <Link href="/faq" style={{ padding: '12px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              FAQ
            </Link>
            <Link href="/about" style={{ padding: '12px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              About the Analyst
            </Link>
          </div>
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-wide" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          SEBI registration does not guarantee performance or assurance of returns.
          Research Analyst: Sahib Singh Hora · SEBI RA Reg. No. INH000026266.
        </div>
      </div>
      <Footer />
    </div>
  )
}
