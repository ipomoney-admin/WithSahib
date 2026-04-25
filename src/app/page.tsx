'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { CredentialBar } from '@/components/layout/CredentialBar'
import { Footer } from '@/components/layout/Footer'
import {
  TrendingUp, BarChart2, Target, RefreshCw, BookOpen, Calendar,
  Brain, Shield, ArrowRight, ChevronRight, Check,
  Linkedin, Twitter, Instagram, Facebook, ShieldCheck
} from 'lucide-react'
import { FALLBACK_DATA, type TickerItem } from '@/lib/utils/marketData'

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Intraday Research',
    desc: 'Pre-market equity research for NSE-listed stocks — setup rationale, entry zone, risk levels, and sector context documented and published before 9 AM every trading session.',
    badge: 'Daily',
    badgeColor: 'green',
    href: '/services/intraday',
  },
  {
    icon: BarChart2,
    title: 'Stock Options',
    desc: 'Options research covering strike selection, premium targets, and expiry-week setups across weekly and monthly contracts. Each recommendation includes OI context, IV rank, and defined max-risk parameters.',
    badge: 'Weekly',
    badgeColor: 'gold',
    href: '/services/stock-options',
  },
  {
    icon: Target,
    title: 'Index Options',
    desc: 'Nifty and Bank Nifty derivatives research built on open interest analysis, PCR signals, and multi-timeframe structure. Expiry-day plays with full written rationale.',
    badge: 'Expiry Plays',
    badgeColor: 'gold',
    href: '/services/index-options',
  },
  {
    icon: RefreshCw,
    title: 'Swing Trades',
    desc: 'Positional research for 2–10 day NSE equity setups. Chart structure analysis — flags, triangles, cup-and-handle — with volume confirmation, target levels, and documented invalidation criteria.',
    badge: '3–5/Week',
    badgeColor: 'green',
    href: '/services/swing',
  },
  {
    icon: BookOpen,
    title: 'Model Portfolio',
    desc: 'A curated NSE equity portfolio, research-backed and quarterly-rebalanced. Every holding is supported by a documented valuation thesis, sector allocation rationale, and published rebalancing logic.',
    badge: 'Long Term',
    badgeColor: 'blue',
    href: '/pricing',
  },
  {
    icon: Calendar,
    title: '1-on-1 Sessions',
    desc: 'Scheduled one-to-one sessions with a SEBI Registered Analyst. Portfolio review, stock-specific research deep-dives, and options strategy consultation — 15 or 30-minute structured sessions.',
    badge: 'Book a Slot',
    badgeColor: 'blue',
    href: '/appointments',
  },
  {
    icon: Brain,
    title: 'Research Reports',
    desc: 'Equity research notes published on BSE/NSE results filings. DCF analysis, earnings quality assessment, management commentary breakdown, and a formal Buy/Hold/Sell recommendation with documented reasoning.',
    badge: 'On Filing',
    badgeColor: 'green',
    href: '/research',
  },
  {
    icon: Shield,
    title: 'Courses',
    desc: 'Structured learning modules on technical analysis methodology, options frameworks, and systematic research process — taught by a SEBI Registered Research Analyst.',
    badge: 'Self-Paced',
    badgeColor: 'gold',
    href: '/courses',
  },
]

// ─── PRICING DATA ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: 'free',
    name: 'Free',
    monthly: 0,
    yearlyMonthly: 0,
    yearlyTotal: 0,
    discount: 0,
    sub: 'No card needed. Forever.',
    features: [
      { text: 'Signal previews', ok: true },
      { text: 'Market ticker & news', ok: true },
      { text: 'Sample research reports', ok: true },
      { text: 'Trade calls', ok: false },
      { text: 'Options picks', ok: false },
      { text: 'Research engine access', ok: false },
    ],
    cta: 'Start Free',
    color: 'default',
  },
  {
    tier: 'basic',
    name: 'Basic',
    monthly: 999,
    yearlyMonthly: 919,
    yearlyTotal: 11029,
    discount: 8,
    sub: 'Swing traders & beginners.',
    features: [
      { text: '5 swing picks / week', ok: true },
      { text: 'Model portfolio access', ok: true },
      { text: 'Weekly market outlook', ok: true },
      { text: 'Company news feed', ok: true },
      { text: 'Intraday calls', ok: false },
      { text: 'Options picks', ok: false },
    ],
    cta: 'Start Basic',
    color: 'sapphire',
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthly: 2499,
    yearlyMonthly: 2199,
    yearlyTotal: 26390,
    discount: 12,
    sub: 'For active traders. Per service.',
    features: [
      { text: 'Daily intraday picks', ok: true },
      { text: 'Stock & index options', ok: true },
      { text: 'Swing picks + portfolio', ok: true },
      { text: 'In-depth research reports', ok: true },
      { text: '1 appointment / month', ok: true },
      { text: 'Priority support', ok: false },
    ],
    cta: 'Start Pro',
    color: 'emerald',
    featured: true,
  },
  {
    tier: 'elite',
    name: 'Elite',
    monthly: 6999,
    yearlyMonthly: 5949,
    yearlyTotal: 71390,
    discount: 15,
    sub: 'Full research access. Direct analyst relationship.',
    features: [
      { text: 'Everything in Pro', ok: true },
      { text: 'Unlimited appointments', ok: true },
      { text: 'HNI research reports', ok: true },
      { text: 'Priority WhatsApp alerts', ok: true },
      { text: 'All courses included', ok: true },
      { text: 'Direct analyst access', ok: true },
    ],
    cta: 'Go Elite',
    color: 'gold',
  },
]

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
      <CredentialBar />
      <LiveTicker />
      <HeroSection />
      <StatsStrip />
      <ServicesSection />
      <HowItWorksSection />
      <DepthSection />
      <WhoSection />
      <AnalystDarkSection />
      <PricingSection />
      <TestimonialSection />
      <TrackRecordSection />
      <ComplianceSection />
      <CTASection />
      <Footer />
    </div>
  )
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
const REFRESH_MS = 4 * 60 * 60 * 1000

function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_DATA)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/market-data', { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      if (json.tickers?.length) {
        setItems(json.tickers)
        setIsLive(json.live ?? false)
      }
    } catch {
      // silently use fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, REFRESH_MS)
    return () => clearInterval(interval)
  }, [fetchData])

  const doubled = [...items, ...items]

  return (
    <div
      className="ticker-wrap"
      style={{
        background: 'var(--black)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: 36,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Live / Delayed badge */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 1,
          color: isLive ? 'var(--green-bright)' : 'rgba(255,255,255,0.4)',
          background: 'linear-gradient(to right, transparent, var(--black) 30%)',
          paddingLeft: 40,
          paddingRight: 14,
          fontFamily: 'var(--font-body)',
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: isLive ? 'var(--green-bright)' : 'rgba(255,255,255,0.4)',
            animation: isLive ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          }}
        />
        {loading ? 'LOADING' : isLive ? 'LIVE' : 'DELAYED'}
      </div>

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
              {item.sym}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)' }}>
              ₹{item.val}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: item.up ? 'var(--green-bright)' : '#FF5B5B', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'var(--font-body)' }}>
              {item.up ? '▲' : '▼'} {item.chg}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px', userSelect: 'none' }}>·</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        padding: '80px 40px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: '-10%', left: '-5%', opacity: 0.6 }} />
      <div className="glow-orb glow-orange" style={{ width: '400px', height: '300px', bottom: '0%', right: '10%', opacity: 0.4 }} />

      <div className="container-wide" style={{ padding: 0, position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">
          {/* Left — copy */}
          <div>
            {/* Tag */}
            <div
              className="animate-fade-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(26,122,74,0.07)',
                border: '1px solid rgba(26,122,74,0.18)',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--green)',
                letterSpacing: '1.5px',
                marginBottom: '24px',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
              }}
            >
              <ShieldCheck size={13} strokeWidth={2.5} />
              SEBI RA INH000026266
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-up-1"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(38px, 5vw, 68px)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: 'var(--text)',
                marginBottom: '20px',
              }}
            >
              Real Research.{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--green)', fontWeight: 400 }}>Documented process.</em>{' '}
              Your name on every call.
            </h1>

            {/* Sub */}
            <p
              className="animate-fade-up-2"
              style={{
                fontSize: '18px',
                color: 'var(--text2)',
                maxWidth: '520px',
                lineHeight: 1.7,
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                marginBottom: '36px',
              }}
            >
              Equity research with a documented process, written rationale on every recommendation, and a SEBI registration number that puts every call on record.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up-3 hero-ctas"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                Start Free Today
                <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
                See Plans
              </Link>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text4)', fontFamily: 'var(--font-body)', letterSpacing: '0.3px' }}>
              No credit card required · Cancel anytime · SEBI regulated
            </p>
          </div>

          {/* Right — Sample Research Card */}
          <div className="animate-fade-up-2">
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  background: 'var(--black)',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-bright)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
                    Sample Research Call
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>INH000026266</span>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>NSE · Intraday Research</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>RELIANCE</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>₹2,847.50</div>
                  </div>
                  <span style={{ background: 'rgba(26,122,74,0.10)', color: 'var(--green)', border: '1px solid rgba(26,122,74,0.22)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', fontFamily: 'var(--font-body)' }}>BUY</span>
                </div>

                {/* Levels */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { label: 'Entry', value: '₹2,840–2,855', color: 'var(--text)' },
                    { label: 'Target', value: '₹2,920', color: 'var(--green)' },
                    { label: 'Stop Loss', value: '₹2,810', color: '#DC2626' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--bg2)', borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text4)', marginBottom: '4px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* R:R */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ height: '4px', flex: 1, background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '67%', background: 'var(--green)', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-body)' }}>R:R 1:2.3</span>
                </div>

                {/* Rationale preview */}
                <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'var(--font-body)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  Cup-and-handle breakout on daily. Volume confirmation. Sector (Refinery) showing relative strength vs Nifty. SL below demand zone.
                </p>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text4)', marginTop: '10px', fontFamily: 'var(--font-body)' }}>
              For illustration only. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── STATS STRIP ─────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { num: 'INH000026266', label: 'SEBI Reg. No.' },
    { num: 'NISM', label: 'Certified Analyst' },
    { num: '14+', label: 'Years Experience' },
    { num: 'Full Record', label: 'All Calls Logged' },
  ]
  return (
    <div
      style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '24px 40px',
      }}
    >
      <div
        className="container-wide"
        style={{
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: s.num.length > 6 ? 'var(--font-mono)' : 'var(--font-heading)',
              fontSize: s.num.length > 6 ? '13px' : '28px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: s.num.length > 6 ? '0.5px' : 'normal',
              marginBottom: '4px',
            }}>
              {s.num}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function ServicesSection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Research Coverage</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            color: 'var(--text)',
            maxWidth: '540px',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          Research coverage across{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>every time horizon</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '48px', fontFamily: 'var(--font-body)' }}>
          From intraday to long-term portfolios — every recommendation published under SEBI RA INH000026266 with full written rationale.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <Link key={i} href={svc.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  className="card svc-card"
                  style={{
                    padding: '28px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, border-color 0.2s, box-shadow 0.2s`,
                  }}
                >
                  <span className="svc-arrow" style={{ position: 'absolute', top: 20, right: 20, fontSize: 18, color: 'var(--green)', opacity: 0, transition: 'opacity 0.2s, transform 0.2s', transform: 'translateX(-4px)' }}>→</span>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(26,122,74,0.07)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={20} strokeWidth={1.5} color="var(--green)" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
                    {svc.desc}
                  </p>
                  <span className={`badge badge-${svc.badgeColor}`}>{svc.badge}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const { ref, inView } = useInView()
  const steps = [
    {
      n: '01',
      title: 'I scan the market every morning before 9 AM',
      desc: 'Sahib reviews overnight global cues, FII/DII data, and technical setups across 1500+ Nifty 500 stocks before the market opens.',
    },
    {
      n: '02',
      title: 'I pick only the highest-conviction setups',
      desc: 'Not every setup qualifies. I share 1–3 calls per day maximum — quality over quantity, every single trading day.',
    },
    {
      n: '03',
      title: 'You get the full reasoning, not just the call',
      desc: 'Entry range, two targets, stop loss, and written rationale. You understand the trade before you take it.',
    },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">How It Works</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '12px',
          }}
        >
          Research you can{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>follow and understand</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '56px', fontFamily: 'var(--font-body)' }}>
          Every call on withSahib has a person behind it — not a black box.
        </p>
        <div className="how-grid">
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: '36px 32px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.12}s`,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '72px',
                  fontWeight: 700,
                  color: '#C8C4BC',
                  lineHeight: 1,
                  marginBottom: '20px',
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── DEPTH SECTION (I–VI) ─────────────────────────────────────────────────────
function DepthSection() {
  const { ref, inView } = useInView()
  const cards = [
    { num: 'I', title: 'Multi-Timeframe Analysis', desc: 'Every setup is validated across daily, weekly, and intraday charts. Structure, volume, and momentum must align before a recommendation is published.' },
    { num: 'II', title: 'Risk Definition First', desc: 'Stop-loss and invalidation criteria are defined before entry. A recommendation without a clear risk level is speculation, not research.' },
    { num: 'III', title: 'Written Rationale Always', desc: 'Every recommendation includes a written explanation — pattern, catalyst, sector context, and timing. Subscribers understand the research, not just the numbers.' },
    { num: 'IV', title: 'Open Interest Analysis', desc: 'Options calls are built on OI data, PCR signals, and IV rank — not just chart patterns. The derivatives market tells a story the charts alone cannot.' },
    { num: 'V', title: 'Sector Context Included', desc: 'Every call comes with broader market context — Nifty trend, sector strength, FII/DII activity — so you understand why the setup matters now.' },
    { num: 'VI', title: 'Full Outcome Logging', desc: 'Every signal published is logged with its result — wins and losses. No cherry-picking. A full, SEBI-compliant audit trail from the first call.' },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Research Depth</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            color: 'var(--text)',
            maxWidth: '560px',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          Six layers of research{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>behind every call</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '48px', fontFamily: 'var(--font-body)' }}>
          A research house operates by process, not instinct.
        </p>
        <div className="depth-grid">
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '28px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.08}s`,
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, color: 'var(--green)', letterSpacing: '3px', marginBottom: '16px', textTransform: 'uppercase' }}>
                {c.num}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px', fontFamily: 'var(--font-body)' }}>{c.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── WHO IS IT FOR ────────────────────────────────────────────────────────────
function WhoSection() {
  const { ref, inView } = useInView()
  const who = [
    { title: 'Active Traders', desc: 'Intraday & options traders who want research-backed setups with clear entry, target, and stop-loss — not random signals.' },
    { title: 'Swing Traders', desc: 'Positional traders looking for 2–10 day setups with volume confirmation and documented invalidation criteria.' },
    { title: 'Long-Term Investors', desc: 'Investors who want an institutional-grade model portfolio with quarterly rebalancing and documented valuation thesis.' },
    { title: 'Serious Learners', desc: 'Anyone who wants to understand technical analysis methodology and options frameworks from a SEBI-registered analyst.' },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Who It's For</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            color: 'var(--text)',
            maxWidth: '500px',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          Built for investors who{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>demand accountability</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '48px', fontFamily: 'var(--font-body)' }}>
          withSahib is not for everyone. It is for people who want regulated, documented research — not tips.
        </p>
        <div className="who-grid">
          {who.map((w, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '28px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{w.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{w.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '48px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Start Free <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
            See All Plans
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── ANALYST DARK SECTION ─────────────────────────────────────────────────────
function AnalystDarkSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      style={{ padding: '80px 40px', background: 'var(--black)' }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        <div
          className="resp-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr',
            gap: '64px',
            alignItems: 'start',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {/* Brand card */}
          <div
            style={{
              borderRadius: 'var(--r-lg)',
              border: '1px solid rgba(26,122,74,0.25)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              textAlign: 'center',
              background: 'rgba(26,122,74,0.03)',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100px', height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(26,122,74,0.3)',
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/sahib-primary.jpg"
                alt="Sahib Singh Hora — SEBI Registered Research Analyst"
                fill
                sizes="100px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginTop: '16px', marginBottom: 0 }}>
              Sahib Singh Hora
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', marginBottom: 0, fontFamily: 'var(--font-body)' }}>
              SEBI Registered Research Analyst
            </p>
            <span style={{ display: 'inline-block', marginTop: '12px', background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontFamily: 'var(--font-mono)', fontSize: '12px', borderRadius: '4px', padding: '3px 8px', border: '1px solid rgba(212,168,67,0.25)' }}>
              INH000026266
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
              {['NISM Certified', 'Technical Analyst', 'Options Strategist'].map((tag) => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', borderRadius: '4px', padding: '3px 8px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-body)' }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {[
                { href: 'https://www.linkedin.com/in/sahibsinghhora/', icon: <Linkedin size={16} />, label: 'LinkedIn' },
                { href: 'https://x.com/WithSahib_', icon: <Twitter size={16} />, label: 'Twitter' },
                { href: 'https://www.instagram.com/withsahib_/', icon: <Instagram size={16} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/sahib1313', icon: <Facebook size={16} />, label: 'Facebook' },
              ].map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'all 0.2s' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: 'var(--green-bright)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
              The Analyst
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 700, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2, marginBottom: '20px' }}>
              Accountability by name and by regulation
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              I&apos;m Sahib Singh Hora — a SEBI Registered Research Analyst (INH000026266), licensed under SEBI (Research Analysts) Regulations, 2014. Every recommendation on withSahib is made under that registration — individually named, publicly verifiable, and legally accountable.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
              That is the structural difference between a registered research house and an unregistered channel: the name on the call has a regulatory consequence.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/about" style={{ textDecoration: 'none', padding: '11px 24px', borderRadius: 'var(--r-sm)', border: '1px solid rgba(26,122,74,0.5)', color: 'var(--green-bright)', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                Read my story →
              </Link>
              <Link href="/appointments" style={{ textDecoration: 'none', padding: '11px 24px', borderRadius: 'var(--r-sm)', background: 'var(--orange)', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, transition: 'opacity 0.2s', fontFamily: 'var(--font-body)' }}>
                Book a session →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const { ref, inView } = useInView()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section ref={ref} id="pricing" style={{ padding: '80px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Research Access</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
            Transparent pricing,{' '}
            <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>zero surprises</em>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
            Start free. Upgrade when ready. Cancel anytime.
          </p>
          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px', gap: '4px' }}>
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: billing === b ? 'var(--green)' : 'transparent',
                  color: billing === b ? '#FFFFFF' : 'var(--text2)',
                  transition: 'all 0.2s',
                }}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-grid" style={{ alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const displayPrice = billing === 'yearly' ? plan.yearlyMonthly : plan.monthly
            const borderColor =
              plan.color === 'emerald' ? 'var(--green)' :
              plan.color === 'gold' ? 'var(--gold)' :
              plan.color === 'sapphire' ? 'var(--sapphire)' :
              'var(--border)'

            return (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--r-xl)',
                  padding: '28px',
                  position: 'relative',
                  opacity: inView ? 1 : 0,
                  transform: inView ? `translateY(${(plan as any).featured ? '-8px' : '0'})` : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                  boxShadow: (plan as any).featured ? '0 0 0 1px rgba(26,122,74,0.1), 0 16px 48px rgba(26,122,74,0.08)' : 'none',
                }}
              >
                {(plan as any).featured && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--green)', color: '#FFFFFF', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'var(--text3)', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
                    {plan.name}
                  </div>
                  {billing === 'yearly' && plan.discount > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(26,122,74,0.10)', color: 'var(--green)', border: '1px solid rgba(26,122,74,0.18)', fontFamily: 'var(--font-body)' }}>
                      SAVE {plan.discount}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                    {displayPrice === 0 ? '₹0' : `₹${displayPrice.toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-body)' }}>/mo</span>
                </div>
                {billing === 'yearly' && plan.yearlyTotal > 0 && (
                  <p style={{ fontSize: '11px', color: 'var(--green)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>
                    ₹{plan.yearlyTotal.toLocaleString('en-IN')} billed yearly
                  </p>
                )}
                <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)' }}>
                  {plan.sub}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: f.ok ? 'var(--text2)' : 'var(--text4)', fontFamily: 'var(--font-body)' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.ok ? 'rgba(26,122,74,0.10)' : 'var(--border)', border: `1.5px solid ${f.ok ? 'var(--green)' : 'var(--border2)'}` }}>
                        {f.ok && <Check size={9} color="var(--green)" strokeWidth={3} />}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/pricing?tier=${plan.tier}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--r-sm)',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                    background: (plan as any).featured ? 'var(--orange)' :
                      plan.color === 'gold' ? 'rgba(146,104,10,0.1)' : 'transparent',
                    color: (plan as any).featured ? '#FFFFFF' :
                      plan.color === 'gold' ? 'var(--gold)' : 'var(--text2)',
                    border: (plan as any).featured ? 'none' :
                      plan.color === 'gold' ? '1px solid rgba(146,104,10,0.3)' :
                      '1px solid var(--border)',
                    boxShadow: (plan as any).featured ? 'var(--orange-glow)' : 'none',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* HNI Band */}
        <div className="hni-band" style={{ marginTop: '48px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
              HNI &amp; Corporate
            </div>
            <div className="hni-title">Looking for custom research coverage?</div>
            <div className="hni-sub">For HNI investors, family offices, and corporate treasuries requiring bespoke equity research — get in touch directly.</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Link href="/contact" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', background: 'var(--orange)', boxShadow: 'var(--orange-glow)' }}>
              Contact for Custom Research
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialSection() {
  const { ref, inView } = useInView()
  const testimonials = [
    {
      text: 'The written rationale on every call is what sets this apart. I understand the setup, not just the entry price.',
      name: 'Subscriber since 2026',
      sub: 'Pro Plan · Active Trader',
    },
    {
      text: 'Finally a SEBI-registered analyst who actually explains the reasoning. The stop-loss logic alone has saved me multiple times.',
      name: 'Subscriber since 2026',
      sub: 'Elite Plan · Swing Trader',
    },
    {
      text: 'The 1-on-1 session gave me a completely different perspective on my portfolio. Worth every rupee.',
      name: 'Subscriber since 2026',
      sub: 'Elite Plan · Long-term Investor',
    },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">From Subscribers</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', marginBottom: '48px', maxWidth: '480px' }}>
          What investors say about{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>the research</em>
        </h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '28px',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
            >
              <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '20px', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text4)', marginTop: '2px', fontFamily: 'var(--font-body)' }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TRACK RECORD ─────────────────────────────────────────────────────────────
function TrackRecordSection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="resp-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
          <div>
            <div className="section-tag">Performance Disclosure</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: '20px' }}>
              Every call logged.{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 400 }}>Wins and losses both.</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              From May 2026, every research recommendation is publicly logged with its outcome — entry, exit, result, and the written rationale behind each. A research house is accountable for its record, not selective about it.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text3)', lineHeight: 1.7, marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
              Win rate alone is not a useful metric. A 70% win rate with poor risk management produces negative returns. The published record shows risk-to-reward ratios alongside win rates — because that is the complete picture.
            </p>
            <Link href="/track-record" className="btn btn-ghost btn-md" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              View Track Record <ChevronRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { val: 'May 2026', label: 'Logging Begins', sub: 'Every recommendation tracked from the first published call — no retrospective additions' },
              { val: 'Wins + Losses', label: 'Full Record', sub: 'Both profitable and unprofitable calls are logged. Cherry-picking defeats the purpose of a public record.' },
              { val: 'R:R + Win Rate', label: 'Dual Metrics', sub: 'Risk-to-reward ratio is published alongside win rate. The combination tells the true story.' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '20px 24px', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.5s ease ${i * 0.12}s` }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>{m.val}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', marginBottom: '6px', letterSpacing: '0.5px', fontFamily: 'var(--font-body)' }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── COMPLIANCE ───────────────────────────────────────────────────────────────
function ComplianceSection() {
  return (
    <section style={{ padding: '64px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-narrow" style={{ padding: 0, textAlign: 'center' }}>
        <div className="section-tag" style={{ justifyContent: 'center' }}>Regulatory</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: 'var(--text)', marginBottom: '36px' }}>
          Built on{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic', fontWeight: 400 }}>full compliance</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {[
            { title: 'SEBI Registered RA', desc: 'INH000026266 — individually registered, publicly verifiable on SEBI\'s intermediary portal.' },
            { title: 'Disclosure First', desc: 'All conflicts of interest, holdings, and analyst disclosures published per SEBI RA Regulations 2014.' },
            { title: 'Client Data Safe', desc: 'No data sharing with third parties. SEBI-compliant client onboarding with proper documentation.' },
            { title: 'Research Integrity', desc: 'Every report follows SEBI\'s research analyst code — full transparency, no undisclosed positions.' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '20px', textAlign: 'left' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>{item.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="sebi-disclaimer">
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary
          or provide any assurance of returns to investors. Past performance is not indicative of future results.
          Research Analyst: Sahib Singh Hora · SEBI RA Reg. No. INH000026266
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg)', textAlign: 'center' }}>
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '56px 40px',
          background: 'var(--black)',
          borderRadius: 'var(--r-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="glow-orb glow-emerald" style={{ width: '400px', height: '300px', top: '-50%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.2 }}>
            Ready to trade with{' '}
            <em style={{ color: 'var(--green-bright)', fontStyle: 'italic', fontWeight: 400 }}>real research?</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            Join investors who trust SEBI-registered analysis over anonymous signals.
            Start free — upgrade when you&apos;re ready.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Start Free Today
              <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none', padding: '14px 32px', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
              See Pricing
            </Link>
          </div>
          <p style={{ marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
            SEBI RA · INH000026266 · No credit card required for free plan
          </p>
        </div>
      </div>
    </section>
  )
}
