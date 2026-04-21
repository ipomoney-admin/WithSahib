'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  TrendingUp, BarChart2, Target, RefreshCw, BookOpen, Calendar,
  Brain, Shield, ArrowRight, ChevronRight, Check, X, Star,
  Zap, Award, Clock, Users
} from 'lucide-react'

// ─── TICKER DATA ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { sym: 'NIFTY 50', val: '24,162.45', chg: '+0.87%', up: true },
  { sym: 'BANK NIFTY', val: '52,341.80', chg: '-0.18%', up: false },
  { sym: 'SENSEX', val: '79,823.15', chg: '+0.72%', up: true },
  { sym: 'RELIANCE', val: '2,847.30', chg: '+1.24%', up: true },
  { sym: 'HDFC BANK', val: '1,638.90', chg: '-0.32%', up: false },
  { sym: 'INFOSYS', val: '1,421.55', chg: '+2.14%', up: true },
  { sym: 'TCS', val: '3,892.20', chg: '+0.56%', up: true },
  { sym: 'WIPRO', val: '462.75', chg: '+1.90%', up: true },
  { sym: 'ICICI BANK', val: '1,248.60', chg: '+0.43%', up: true },
  { sym: 'L&T', val: '3,621.40', chg: '-0.67%', up: false },
]

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Intraday Calls',
    desc: 'Pre-market buy/sell levels with entry, target & SL for NSE equities. Delivered by 9 AM every trading day.',
    badge: 'Daily',
    badgeColor: 'green',
    tier: 'pro',
  },
  {
    icon: BarChart2,
    title: 'Stock Options',
    desc: 'Weekly & monthly options strategies with strike selection, premium targets, and risk-defined setups.',
    badge: 'Weekly',
    badgeColor: 'gold',
    tier: 'pro',
  },
  {
    icon: Target,
    title: 'Index Options',
    desc: 'Nifty & Bank Nifty options with OI analysis, PCR-based directional calls, and expiry plays.',
    badge: 'Expiry Plays',
    badgeColor: 'gold',
    tier: 'pro',
  },
  {
    icon: RefreshCw,
    title: 'Swing Trades',
    desc: '2–10 day positional ideas based on pattern breakouts, volume confirmation & multi-timeframe analysis.',
    badge: '3–5/Week',
    badgeColor: 'green',
    tier: 'basic',
  },
  {
    icon: BookOpen,
    title: 'Model Portfolio',
    desc: 'Curated long-term portfolio with quarterly rebalancing, sector allocation & live performance tracking.',
    badge: 'Long Term',
    badgeColor: 'blue',
    tier: 'basic',
  },
  {
    icon: Calendar,
    title: '1-on-1 Sessions',
    desc: 'Personal 15 or 30-minute sessions — portfolio review, stock deep-dives, or strategy discussions.',
    badge: 'Book a Slot',
    badgeColor: 'blue',
    tier: 'elite',
  },
  {
    icon: Brain,
    title: 'AI Research Reports',
    desc: 'Automated DCF models, quarterly results analysis, and institutional-grade notes — generated on filing.',
    badge: 'AI Powered',
    badgeColor: 'green',
    tier: 'pro',
  },
  {
    icon: Shield,
    title: 'Courses',
    desc: 'Structured courses on technical analysis, options theory & building a systematic trading process.',
    badge: 'Self-Paced',
    badgeColor: 'gold',
    tier: 'basic',
  },
]

// ─── PRICING DATA ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    sub: 'No card needed. Forever.',
    features: [
      { text: 'Signal previews', ok: true },
      { text: 'Market ticker & news', ok: true },
      { text: 'Sample research reports', ok: true },
      { text: 'Trade calls', ok: false },
      { text: 'Options picks', ok: false },
      { text: 'AI research engine', ok: false },
    ],
    cta: 'Start Free',
    color: 'default',
  },
  {
    tier: 'basic',
    name: 'Basic',
    price: 999,
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
    price: 2499,
    sub: 'For active traders.',
    features: [
      { text: 'Daily intraday calls', ok: true },
      { text: 'Stock & index options', ok: true },
      { text: 'Swing picks + portfolio', ok: true },
      { text: 'AI research reports', ok: true },
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
    price: 5999,
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
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
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
      <CTASection />
      <Footer />
    </div>
  )
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '10px 0', overflow: 'hidden' }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', fontFamily: 'Courier New, monospace', letterSpacing: '.5px' }}>
              {item.sym}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{item.val}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: item.up ? 'var(--emerald)' : 'var(--coral)' }}>
              {item.chg}
            </span>
            <span style={{ color: 'var(--border2)', fontSize: '12px' }}>·</span>
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
            animation: 'fadeUp 0.6s ease both',
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
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 400,
            lineHeight: 1.08,
            color: 'var(--text)',
            animation: 'fadeUp 0.6s 0.1s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
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
          style={{
            fontSize: '18px',
            color: 'var(--text2)',
            maxWidth: '580px',
            margin: '24px auto 0',
            fontWeight: 300,
            lineHeight: 1.7,
            animation: 'fadeUp 0.6s 0.2s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          Institutional-grade technical analysis, AI-powered research reports,
          and real-time trade calls — by a SEBI-registered analyst, for serious retail investors.
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '40px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.3s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          <Link href="/pricing" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Start Free Today
            <ArrowRight size={16} />
          </Link>
          <Link href="/services" className="btn btn-ghost btn-lg" style={{ textDecoration: 'none' }}>
            View Services
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '56px',
            flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.4s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          {[
            { num: '4', suf: '+', label: 'Service Tiers' },
            { num: '8', suf: '', label: 'Advisory Services' },
            { num: '5', suf: 'Y', label: 'Valid Licence' },
            { num: '24/7', suf: '', label: 'AI Research Engine' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
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
            animation: 'fadeUp 0.6s 0.5s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
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
              <div
                key={i}
                className="card card-hover"
                style={{
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.07}s`,
                }}
              >
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
    { n: '03', title: 'Your Dashboard', desc: 'Personalized dashboard with live picks, AI reports, and watchlist tailored to your tier.' },
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
          Not tips. Not gut feel. Every recommendation is backed by automated analysis running 24/7.
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
                {b === 'yearly' ? 'Yearly (save 20%)' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const price = billing === 'yearly' && plan.price > 0
              ? Math.round(plan.price * 0.8)
              : plan.price
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
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
                    {price === 0 ? '₹0' : `₹${price.toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text3)' }}>/mo</span>
                </div>
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
            Join investors who trust SEBI-registered analysis over anonymous tips.
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
