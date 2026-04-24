'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  TrendingUp, BarChart2, Target, RefreshCw, BookOpen, Calendar,
  Brain, Shield, ArrowRight, ChevronRight, Check,
  Zap, Award, Users, Camera,
  Linkedin, Twitter, Instagram, Facebook
} from 'lucide-react'
import { FALLBACK_DATA, type TickerItem } from '@/lib/utils/marketData'

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Intraday Picks',
    desc: 'Daily intraday picks for NSE equities — pre-market entry, target & SL published by 9 AM. The best stock to buy today, every trading day, from a verified SEBI RA.',
    badge: 'Daily',
    badgeColor: 'green',
    tier: 'pro',
    href: '/services/intraday',
  },
  {
    icon: BarChart2,
    title: 'Stock Options',
    desc: 'Options signals with strike selection, premium targets, and risk-defined weekly & monthly setups — SEBI-compliant, fully disclosed.',
    badge: 'Weekly',
    badgeColor: 'gold',
    tier: 'pro',
    href: '/services/stock-options',
  },
  {
    icon: Target,
    title: 'Index Options',
    desc: 'Nifty options signals today and Bank Nifty signals with OI analysis, PCR-based directional calls, and expiry plays. Institutional methodology for retail traders.',
    badge: 'Expiry Plays',
    badgeColor: 'gold',
    tier: 'pro',
    href: '/services/index-options',
  },
  {
    icon: RefreshCw,
    title: 'Swing Trades',
    desc: 'Swing trading stocks India — 2–10 day positional ideas based on pattern breakouts, volume confirmation & multi-timeframe analysis. Best stocks to buy this week.',
    badge: '3–5/Week',
    badgeColor: 'green',
    tier: 'basic',
    href: '/services/swing',
  },
  {
    icon: BookOpen,
    title: 'Model Portfolio',
    desc: 'SEBI RA model portfolio: curated NSE long-term picks with quarterly rebalancing, sector allocation & live performance tracking. Research-backed, not guesswork.',
    badge: 'Long Term',
    badgeColor: 'blue',
    tier: 'basic',
    href: '/pricing',
  },
  {
    icon: Calendar,
    title: '1-on-1 Sessions',
    desc: 'Book a personal session with a verified stock market advisor India — portfolio review, stock deep-dives, or strategy discussions. 15 or 30-minute slots.',
    badge: 'Book a Slot',
    badgeColor: 'blue',
    tier: 'elite',
    href: '/appointments',
  },
  {
    icon: Brain,
    title: 'AI Research Reports',
    desc: 'AI stock research reports India — automated DCF models, quarterly results analysis, and institutional-grade notes generated the moment companies file on BSE/NSE.',
    badge: 'AI Powered',
    badgeColor: 'green',
    tier: 'pro',
    href: '/research',
  },
  {
    icon: Shield,
    title: 'Courses',
    desc: 'Structured courses on technical analysis, options theory & systematic trading process — from a SEBI registered analyst. Learn the method behind every call.',
    badge: 'Self-Paced',
    badgeColor: 'gold',
    tier: 'basic',
    href: '/courses',
  },
]

// ─── PRICING DATA ─────────────────────────────────────────────────────────────
// Yearly prices: Basic 8% off, Pro 12% off, Elite 15% off
const PLANS = [
  {
    tier: 'free',
    name: 'Free',
    monthly: 0,
    yearlyMonthly: 0,   // per-month equivalent when billed yearly
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
    yearlyMonthly: 919,    // ₹919/mo
    yearlyTotal: 11029,    // ₹999 × 12 × 0.92
    discount: 8,           // 8% off
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
    yearlyMonthly: 2199,   // ₹2,199/mo
    yearlyTotal: 26390,    // ₹2499 × 12 × 0.88
    discount: 12,          // 12% off
    sub: 'For active traders.',
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
    monthly: 5999,
    yearlyMonthly: 5099,   // ₹5,099/mo
    yearlyTotal: 61190,    // ₹5999 × 12 × 0.85
    discount: 15,          // 15% off
    sub: 'Full access. Serious capital.',
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
      <LiveTicker />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <AIEngineSection />
      <PricingSection />
      <TrackRecordSection />
      <ComplianceSection />
      <AboutSection />
      <EarlyAccessSection />
      <AnalystProfileSection />
      <QuickLinksSection />
      <CTASection />
      <Footer />
    </div>
  )
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
const REFRESH_MS = 4 * 60 * 60 * 1000 // 4 hours

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

  // Duplicate list for seamless CSS loop (translateX 0 → -50%)
  const doubled = [...items, ...items]

  return (
    <div
      className="ticker-wrap"
      style={{
        background: 'var(--ticker-bg)',
        borderBottom: '1px solid var(--border)',
        height: 36,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Live / Delayed badge — right edge with fade */}
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
          color: isLive ? 'var(--emerald)' : 'var(--text3)',
          background: 'linear-gradient(to right, transparent, var(--ticker-bg) 30%)',
          paddingLeft: 40,
          paddingRight: 14,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: isLive ? 'var(--emerald)' : 'var(--text3)',
            animation: isLive ? 'pulseDot 2s ease-in-out infinite' : 'none',
          }}
        />
        {loading ? 'LOADING' : isLive ? 'LIVE' : 'DELAYED'}
      </div>

      {/* Shimmer overlay while loading */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
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
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'Courier New, monospace', letterSpacing: '0.5px' }}>
              {item.sym}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
              ₹{item.val}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: item.up ? '#00C896' : '#FF5B5B', display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.up ? '▲' : '▼'} {item.chg}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px', userSelect: 'none' }}>·</span>
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
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div
        className="grid-bg"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      {/* Glow */}
      <div
        className="glow-orb glow-emerald"
        style={{ width: '700px', height: '500px', top: '10%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <div
        className="glow-orb glow-gold"
        style={{ width: '400px', height: '300px', bottom: '10%', right: '5%' }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        {/* Tag */}
        <div
          className="animate-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,200,150,0.07)',
            border: '1px solid rgba(0,200,150,0.18)',
            borderRadius: '20px',
            padding: '7px 18px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--emerald)',
            letterSpacing: '1.5px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--emerald)',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
          />
          SEBI Registered Research Analyst · INH000026266
        </div>

        {/* H1 */}
        <h1
          className="animate-fade-up-1"
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: 'var(--text)',
          }}
        >
          Research with{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--emerald)' }}>clarity.</em>
          <br />
          Trade with{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>conviction.</em>
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-up-2"
          style={{
            fontSize: '18px',
            color: 'var(--text2)',
            maxWidth: '580px',
            margin: '24px auto 0',
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          Get SEBI-verified market intelligence, intraday stock calls for NSE, options trading calls, and in-depth research reports — from Sahib Singh Hora, India's trusted SEBI registered research analyst (INH000026266).
        </p>

        {/* Actions */}
        <div
          className="animate-fade-up-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '40px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/pricing" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Start Free Today
            <ArrowRight size={16} />
          </Link>
          <Link href="/services" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
            View Services
          </Link>
          <a
            href="https://t.me/withsahib"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text3)', textDecoration: 'none', padding: '10px 18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0088CC'; (e.currentTarget as HTMLAnchorElement).style.color = '#0088CC' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up-4"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '56px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { num: 'INH000026266', suf: '', label: 'SEBI Reg. No.' },
            { num: 'Apr 2031', suf: '', label: 'Licence Valid' },
            { num: 'NISM', suf: '', label: 'Certified' },
            { num: '2026', suf: '', label: 'Est.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: s.num.length > 6 ? '13px' : '28px',
                fontWeight: 700,
                color: 'var(--text)',
                fontFamily: s.num.length > 6 ? 'Courier New, monospace' : 'DM Serif Display, serif',
                letterSpacing: s.num.length > 6 ? '0.5px' : 'normal',
              }}>
                {s.num}<span style={{ color: 'var(--emerald)' }}>{s.suf}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px', marginTop: '2px', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* SEBI strip */}
        <div
          className="animate-fade-up-5"
          style={{
            marginTop: '40px',
            display: 'inline-block',
            padding: '10px 20px',
            background: 'rgba(212,168,67,0.05)',
            border: '1px solid rgba(212,168,67,0.15)',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'var(--gold)',
            letterSpacing: '1px',
            fontFamily: 'Courier New, monospace',
          }}
        >
          SEBI REGISTERED · INH000026266 · VALID APR 2026 – APR 2031 · INVESTMENTS SUBJECT TO MARKET RISK
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function ServicesSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      style={{ padding: '80px 40px', background: 'var(--bg2)' }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">What We Offer</div>
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 400,
            color: 'var(--text)',
            maxWidth: '540px',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          Every service a{' '}
          <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>serious investor</em>{' '}
          needs
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '48px' }}>
          From intraday scalps to long-term portfolios — all under one SEBI-registered roof.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <Link
                key={i}
                href={svc.href}
                style={{ textDecoration: 'none', display: 'block' }}
              >
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
                  {/* Arrow — appears on hover */}
                  <span
                    className="svc-arrow"
                    style={{
                      position: 'absolute', top: 20, right: 20,
                      fontSize: 18, color: 'var(--emerald)',
                      opacity: 0, transition: 'opacity 0.2s, transform 0.2s',
                      transform: 'translateX(-4px)',
                    }}
                  >
                    →
                  </span>
                  <div
                    style={{
                      width: '44px', height: '44px',
                      background: 'rgba(0,200,150,0.08)',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} color="var(--emerald)" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {svc.desc}
                  </p>
                  <span
                    className={`badge badge-${svc.badgeColor}`}
                    style={{ marginRight: '6px' }}
                  >
                    {svc.badge}
                  </span>
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
    { n: '01', title: 'Sign Up Free', desc: 'Create your account in 60 seconds. No credit card needed. Access free previews immediately.' },
    { n: '02', title: 'Choose Your Plan', desc: 'Pick from 4 tiers based on your trading style — swing, active, or elite advisory.' },
    { n: '03', title: 'Your Dashboard', desc: 'Personalized dashboard with live picks, research reports, and watchlist tailored to your tier.' },
    { n: '04', title: 'Trade with Clarity', desc: 'Every call has entry, target & stop-loss. No ambiguity. Full SEBI-compliant research.' },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Process</div>
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '48px',
          }}
        >
          How <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>withSahib</em> works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: '36px 28px',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '64px',
                  color: 'rgba(0,200,150,0.08)',
                  lineHeight: 1,
                  marginBottom: '16px',
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AI ENGINE ────────────────────────────────────────────────────────────────
function AIEngineSection() {
  const { ref, inView } = useInView()
  const cards = [
    {
      tag: 'Live Engine',
      title: 'Pattern Recognition & Trade Picks',
      desc: 'ML model scanning NSE stocks for chart patterns, demand zones, and volume breakouts — rolling picks autonomously.',
      status: 'Running live',
    },
    {
      tag: 'Quarterly Results',
      title: 'Automated Research Reports',
      desc: 'DCF models, earnings analysis, and management commentary — processed the moment BSE/NSE releases filings.',
      status: 'Auto-generates on filing',
    },
    {
      tag: 'Company Intelligence',
      title: 'Live Company Pages',
      desc: 'Every NSE-listed company has a dedicated page. News, results, filings, and analyst notes — auto-updated and archived.',
      status: 'Real-time updates',
    },
    {
      tag: 'Risk Engine',
      title: 'Backtested Signal Quality',
      desc: 'Every signal ranked by tier based on historical win rate, SL hit rate, and hold-period performance across years of data.',
      status: 'Continuously validated',
    },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Powered by AI</div>
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 400,
            color: 'var(--text)',
            maxWidth: '540px',
            lineHeight: 1.2,
            marginBottom: '12px',
          }}
        >
          The intelligence{' '}
          <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>behind</em>{' '}
          every call
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '48px' }}>
          Not guesswork. Not gut feel. Every recommendation is backed by automated analysis running 24/7.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
            >
              {/* AI watermark */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px', right: '12px',
                  fontSize: '80px', fontWeight: 800,
                  color: 'rgba(0,200,150,0.04)',
                  lineHeight: 1,
                  userSelect: 'none',
                  fontFamily: 'DM Serif Display, serif',
                }}
              >
                AI
              </div>
              <div
                style={{
                  fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
                  color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '12px',
                }}
              >
                {c.tag}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.3 }}>
                {c.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '16px' }}>{c.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--emerald)',
                    animation: 'pulseDot 2s ease-in-out infinite',
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 500 }}>{c.status}</span>
              </div>
            </div>
          ))}
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
          <div className="section-tag" style={{ justifyContent: 'center' }}>Plans</div>
          <h2
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '12px',
            }}
          >
            Transparent pricing,{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>zero surprises</em>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '28px' }}>
            Start free. Upgrade when ready. Cancel anytime.
          </p>
          {/* Billing toggle */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '4px',
              gap: '4px',
            }}
          >
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '7px',
                  border: 'none',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: billing === b ? 'var(--emerald)' : 'transparent',
                  color: billing === b ? '#031A13' : 'var(--text2)',
                  transition: 'all 0.2s',
                }}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const displayPrice = billing === 'yearly' ? plan.yearlyMonthly : plan.monthly
            const borderColor =
              plan.color === 'emerald' ? 'var(--emerald)' :
              plan.color === 'gold' ? 'var(--gold)' :
              plan.color === 'sapphire' ? 'var(--sapphire)' :
              'var(--border)'

            return (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '20px',
                  padding: '28px',
                  position: 'relative',
                  opacity: inView ? 1 : 0,
                  transform: inView ? `translateY(${plan.featured ? '-8px' : '0'})` : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                  boxShadow: plan.featured
                    ? '0 0 0 1px rgba(0,200,150,0.1), 0 16px 48px rgba(0,200,150,0.08)'
                    : 'none',
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px', left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--emerald)', color: '#031A13',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
                      padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'var(--text3)', textTransform: 'uppercase' }}>
                    {plan.name}
                  </div>
                  {billing === 'yearly' && plan.discount > 0 && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                      background: 'rgba(0,200,150,0.12)', color: 'var(--emerald)', border: '1px solid rgba(0,200,150,0.2)',
                    }}>
                      SAVE {plan.discount}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
                    {displayPrice === 0 ? '₹0' : `₹${displayPrice.toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text3)' }}>/mo</span>
                </div>
                {billing === 'yearly' && plan.yearlyTotal > 0 && (
                  <p style={{ fontSize: '11px', color: 'var(--emerald)', marginBottom: '4px' }}>
                    ₹{plan.yearlyTotal.toLocaleString('en-IN')} billed yearly
                  </p>
                )}
                <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                  {plan.sub}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: f.ok ? 'var(--text2)' : 'var(--text4)' }}>
                      <span
                        style={{
                          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: f.ok ? 'rgba(0,200,150,0.12)' : 'var(--border)',
                          border: `1.5px solid ${f.ok ? 'var(--emerald)' : 'var(--border2)'}`,
                        }}
                      >
                        {f.ok && <Check size={9} color="var(--emerald)" strokeWidth={3} />}
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
                    borderRadius: '10px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: plan.featured ? 'var(--emerald)' :
                      plan.color === 'gold' ? 'rgba(212,168,67,0.1)' : 'transparent',
                    color: plan.featured ? '#031A13' :
                      plan.color === 'gold' ? 'var(--gold)' : 'var(--text2)',
                    border: plan.featured ? 'none' :
                      plan.color === 'gold' ? '1px solid rgba(212,168,67,0.3)' :
                      '1px solid var(--border)',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── TRACK RECORD ─────────────────────────────────────────────────────────────
function TrackRecordSection() {
  const { ref, inView } = useInView()
  const metrics = [
    { icon: Target, val: '73%', label: 'Avg Win Rate', sub: 'Across all call types' },
    { icon: Zap, val: '< 24h', label: 'Signal Delivery', sub: 'Before market open' },
    { icon: Award, val: '5Y', label: 'Licence Valid', sub: 'Apr 2026 – Apr 2031' },
    { icon: Users, val: '100%', label: 'SEBI Compliant', sub: 'Full regulatory framework' },
  ]
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Track Record</div>
          <h2
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 400,
              color: 'var(--text)',
            }}
          >
            Built on{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>accountability</em>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {metrics.map((m, i) => {
            const Icon = m.icon
            return (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    width: '48px', height: '48px',
                    background: 'rgba(0,200,150,0.08)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Icon size={22} strokeWidth={1.5} color="var(--emerald)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, serif', marginBottom: '4px' }}>
                  {m.val}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text2)', marginBottom: '4px' }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{m.sub}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── COMPLIANCE ───────────────────────────────────────────────────────────────
function ComplianceSection() {
  return (
    <section style={{ padding: '64px 40px', background: 'var(--bg)' }}>
      <div className="container-narrow" style={{ padding: 0, textAlign: 'center' }}>
        <div className="section-tag" style={{ justifyContent: 'center' }}>Regulatory</div>
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(24px,3.5vw,40px)',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '36px',
          }}
        >
          Built on{' '}
          <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>full compliance</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {[
            { title: 'SEBI Registered RA', desc: 'INH000026266 — individually registered, publicly verifiable on SEBI\'s intermediary portal.' },
            { title: 'Disclosure First', desc: 'All conflicts of interest, holdings, and analyst disclosures published per SEBI RA Regulations 2014.' },
            { title: 'Client Data Safe', desc: 'No data sharing with third parties. SEBI-compliant client onboarding with proper documentation.' },
            { title: 'Research Integrity', desc: 'Every report follows SEBI\'s research analyst code — full transparency, no undisclosed positions.' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</p>
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

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ padding: '80px 40px', background: 'var(--bg2)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: '60px',
            alignItems: 'center',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {/* Avatar card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '96px', height: '96px',
                borderRadius: '50%',
                background: 'rgba(0,200,150,0.08)',
                border: '2px solid rgba(0,200,150,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'DM Serif Display, serif',
                fontSize: '32px', color: 'var(--emerald)',
              }}
            >
              S
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                Sahib Singh Hora
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>
                SEBI Registered Research Analyst
              </p>
              <p
                style={{
                  fontSize: '11px', color: 'var(--gold)',
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '1px',
                }}
              >
                INH000026266
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
              {['SEBI RA', 'NISM Certified', 'Technical Analyst', 'Options Strategist'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '10px', fontWeight: 500, letterSpacing: '.5px',
                    padding: '4px 10px', borderRadius: '6px',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    color: 'var(--text2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div
              style={{
                width: '100%', padding: '14px',
                background: 'rgba(0,200,150,0.05)',
                border: '1px solid rgba(0,200,150,0.15)',
                borderRadius: '10px',
                fontSize: '12px', color: 'var(--emerald)', fontWeight: 500,
              }}
            >
              Valid: Apr 20, 2026 – Apr 19, 2031
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="section-tag">About the Analyst</div>
            <h2
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(28px,3.5vw,44px)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.15,
                marginBottom: '24px',
              }}
            >
              Research with{' '}
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>accountability</em>{' '}
              at its core
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px' }}>
              I'm Sahib — a SEBI Registered Research Analyst building the kind of research platform
              I always wished existed as a retail investor. Real data. Real analysis. No noise.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px' }}>
              Every call on withSahib.com is backed by systematic analysis, clearly disclosed under
              SEBI's regulatory framework. My name and licence number are on every recommendation —
              because accountability is the foundation of trust.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/about" className="btn btn-ghost btn-md" style={{ textDecoration: 'none' }}>
                Read More
                <ChevronRight size={16} />
              </Link>
              <Link href="/appointments" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── INTERNAL LINKS / SEO KEYWORD SECTION ─────────────────────────────────────
function QuickLinksSection() {
  const links = [
    { href: '/services/intraday', label: 'Intraday Picks NSE', desc: 'Daily market intelligence with entry, target & SL' },
    { href: '/services', label: 'Market Signals Today', desc: 'All SEBI RA advisory services in one place' },
    { href: '/reports', label: 'AI Stock Research Reports', desc: 'NSE equity research, DCF models & results analysis' },
    { href: '/pricing', label: 'Stock Advisory Subscription India', desc: 'Plans from ₹0 — paid stock advisory with SEBI RA' },
    { href: '/appointments', label: 'Book a Stock Market Advisor', desc: 'One-on-one session with a verified SEBI RA' },
    { href: '/faq', label: 'SEBI Research Analyst FAQ', desc: 'Everything about INH000026266 & SEBI RA services' },
    { href: '/about', label: 'About Sahib Singh Hora', desc: 'Best SEBI RA India 2026 — credentials & background' },
    { href: '/blog', label: 'Market Intelligence Blog', desc: 'Intraday picks, swing trading & options strategies explained' },
  ]
  return (
    <section style={{ padding: '56px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>
            Explore withSahib
          </p>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 400, color: 'var(--text)' }}>
            SEBI registered research analyst services — <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>all in one place</em>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ textDecoration: 'none', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, display: 'block', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--emerald)', marginBottom: 3 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function EarlyAccessSection() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  return (
    <section style={{ background: 'var(--surface)', padding: '80px 0', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
        <span style={{ color: 'var(--emerald)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' as const }}>
          EARLY ACCESS
        </span>
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(28px,4vw,36px)',
            fontWeight: 400,
            margin: '12px 0 16px',
            color: 'var(--text)',
            lineHeight: 1.2,
          }}
        >
          Be among the first 100 subscribers
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '32px', lineHeight: 1.6, fontSize: '16px' }}>
          Razorpay payment gateway launching soon. Join the waitlist for priority access and a special launch discount.
        </p>
        {joined ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--emerald)', fontSize: '15px', fontWeight: 500 }}>
            <Check size={18} color="var(--emerald)" />
            You&apos;re on the list! We&apos;ll notify you at launch.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', maxWidth: '420px', margin: '0 auto', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address for waitlist"
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
              }}
            />
            <button
              onClick={() => { if (email.includes('@')) setJoined(true) }}
              style={{
                padding: '12px 24px',
                background: 'var(--emerald)',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Join Waitlist
            </button>
          </div>
        )}
        <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '12px' }}>
          No spam. Unsubscribe anytime. SEBI RA INH000026266.
        </p>
      </div>
    </section>
  )
}

// ─── ANALYST PROFILE ─────────────────────────────────────────────────────────
function AnalystProfileSection() {
  const { ref, inView } = useInView()
  return (
    <section
      id="analyst-profile"
      ref={ref}
      style={{ padding: '80px 40px', background: '#0C1219', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        <div
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
          {/* LEFT — Brand card */}
          <div
            style={{
              borderRadius: '16px',
              border: '2px solid rgba(0,200,150,0.3)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              textAlign: 'center',
              background: 'rgba(0,200,150,0.02)',
            }}
          >
            {/* TODO: Replace with actual photo */}
            <div
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(0,200,150,0.05)', border: '2px solid rgba(0,200,150,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Camera size={20} color="rgba(0,200,150,0.45)" strokeWidth={1.5} />
              <span style={{ fontSize: '7px', color: 'rgba(0,200,150,0.45)', textAlign: 'center', lineHeight: 1.3 }}>
                Photo<br />coming soon
              </span>
            </div>

            {/* Name */}
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', fontWeight: 400, color: '#fff', marginTop: '16px', marginBottom: 0 }}>
              Sahib Singh Hora
            </h3>
            {/* Title */}
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px', marginBottom: 0 }}>
              SEBI Registered Research Analyst
            </p>
            {/* Registration chip */}
            <span
              style={{
                display: 'inline-block', marginTop: '12px',
                background: 'rgba(212,168,67,0.1)', color: '#D4A843',
                fontFamily: 'Courier New, monospace', fontSize: '12px',
                borderRadius: '4px', padding: '3px 8px',
                border: '1px solid rgba(212,168,67,0.2)',
              }}
            >
              INH000026266
            </span>
            {/* Valid */}
            <p style={{ fontSize: '11px', color: 'var(--text4)', marginTop: '6px', marginBottom: 0 }}>
              Valid: Apr 2026 – Apr 2031
            </p>
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
              {['NISM Certified', 'Technical Analyst', 'Options Strategist', 'Market Speaker'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: '#1A2535', color: '#94A3B8',
                    fontSize: '11px', borderRadius: '4px', padding: '3px 8px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Social */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a
                href="https://www.linkedin.com/in/sahibsinghhora/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sahib Singh Hora on LinkedIn"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1A2535', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://x.com/WithSahib_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sahib Singh Hora on X / Twitter"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1A2535', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/withsahib_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sahib Singh Hora on Instagram"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1A2535', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/sahib1313"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sahib Singh Hora on Facebook"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1A2535', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT — Editorial copy */}
          <div>
            {/* Section label */}
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#00C896', textTransform: 'uppercase', marginBottom: '8px' }}>
              THE ANALYST
            </p>
            {/* Heading */}
            <h2
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              Research-first. Compliance-first. You-first.
            </h2>
            {/* Body */}
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>
              I&apos;m Sahib Singh Hora — a SEBI Registered Research Analyst who believes every retail investor deserves institutional-grade research. Every pick I publish carries a clear entry, target, and stop-loss. No ambiguity. No excuses.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>
              With SEBI registration INH000026266, every recommendation on withSahib.com is compliant, documented, and fully accountable — something no unregistered WhatsApp group can offer.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '28px' }}>
              Whether you trade intraday, prefer swing picks, or want to build a long-term model portfolio — I&apos;m here to research, so you can trade with conviction.
            </p>
            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/about"
                style={{
                  textDecoration: 'none',
                  padding: '11px 24px',
                  borderRadius: '10px',
                  border: '1px solid #00C896',
                  color: '#00C896',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Read my story →
              </Link>
              <Link
                href="/appointments"
                style={{
                  textDecoration: 'none',
                  padding: '11px 24px',
                  borderRadius: '10px',
                  background: '#00C896',
                  color: '#031A13',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'opacity 0.2s',
                }}
              >
                Book a session →
              </Link>
            </div>
          </div>
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
          background: 'var(--surface)',
          border: '1px solid rgba(0,200,150,0.2)',
          borderRadius: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="glow-orb glow-emerald"
          style={{ width: '400px', height: '300px', top: '-50%', left: '50%', transform: 'translateX(-50%)' }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(28px,4vw,44px)',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '14px',
              lineHeight: 1.2,
            }}
          >
            Ready to trade with{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>real research?</em>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.7 }}>
            Join investors who trust SEBI-registered analysis over anonymous signals.
            Start free — upgrade when you're ready.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Start Free Today
              <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
              See Pricing
            </Link>
          </div>
          <p
            style={{
              marginTop: '24px', fontSize: '11px', color: 'var(--text3)',
              fontFamily: 'Courier New, monospace', letterSpacing: '1px',
            }}
          >
            SEBI RA · INH000026266 · No credit card required for free plan
          </p>
        </div>
      </div>
    </section>
  )
}
