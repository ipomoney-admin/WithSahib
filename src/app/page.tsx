'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import {
  TrendingUp, BarChart2, Target, RefreshCw, BookOpen, Calendar,
  Brain, Shield, ArrowRight, Check,
  Linkedin, Twitter, Instagram, Facebook,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── SERVICES DATA ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Intraday Research',
    desc: 'Pre-market equity research for NSE stocks — setup rationale, entry zone, risk levels, and sector context documented and published before 9 AM every trading session.',
    badge: 'Daily · Before 9 AM',
    badgeColor: 'green',
    href: '/services/intraday',
  },
  {
    icon: RefreshCw,
    title: 'Swing Trades',
    desc: 'Positional research for 2–10 day NSE equity setups. Chart structure, volume confirmation, target levels, and documented invalidation criteria on every pick.',
    badge: '3–5 per week',
    badgeColor: 'green',
    href: '/services/swing',
  },
  {
    icon: BarChart2,
    title: 'Options Research',
    desc: 'Nifty, BankNifty, and stock options research — strike selection, OI analysis, IV rank, PCR signals, and full written rationale. Weekly and expiry-week setups.',
    badge: 'Weekly',
    badgeColor: 'gold',
    href: '/services/stock-options',
  },
  {
    icon: BookOpen,
    title: 'Model Portfolio',
    desc: 'A conviction-based NSE equity portfolio, quarterly-rebalanced. Every holding is supported by a documented valuation thesis and published rebalancing logic.',
    badge: 'Long Term',
    badgeColor: 'blue',
    href: '/pricing',
  },
  {
    icon: Brain,
    title: 'Research Reports',
    desc: 'Equity research notes published on BSE/NSE results filings — DCF analysis, earnings quality, management commentary, and a formal Buy/Hold/Sell recommendation.',
    badge: 'On Filing',
    badgeColor: 'green',
    href: '/research',
  },
  {
    icon: Calendar,
    title: '1-on-1 Sessions',
    desc: 'Scheduled sessions with a SEBI Registered Analyst. Portfolio review, stock-specific research, and options strategy — 15 or 30-minute structured consultations.',
    badge: 'Book a Slot',
    badgeColor: 'blue',
    href: '/appointments',
  },
  {
    icon: Target,
    title: 'Index Options',
    desc: 'Nifty and Bank Nifty derivatives research built on open interest, PCR signals, and multi-timeframe structure. Expiry-day plays with full written rationale.',
    badge: 'Expiry Plays',
    badgeColor: 'gold',
    href: '/services/index-options',
  },
  {
    icon: Shield,
    title: 'Courses',
    desc: 'Structured learning on technical analysis methodology, options frameworks, and systematic research process — taught by a SEBI Registered Research Analyst.',
    badge: 'Self-Paced',
    badgeColor: 'gold',
    href: '/courses',
  },
]

// ─── PRICING DATA ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: 'positional',
    name: 'Positional',
    monthly: 3999,
    yearlyMonthly: 3679,
    yearlyTotal: 44148,
    discount: 8,
    sub: 'Swing and positional research with full written rationale.',
    features: [
      { text: '8–12 high-conviction positional setups per month', ok: true },
      { text: 'Entry zone, 2 targets, stop-loss on every pick', ok: true },
      { text: 'Written research rationale on every recommendation', ok: true },
      { text: 'Sector context and market conditions included', ok: true },
      { text: 'Weekly digest with closed-trade performance summary', ok: true },
      { text: 'Full research archive access', ok: true },
    ],
    cta: 'Start Positional',
    color: 'default',
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthly: 6999,
    yearlyMonthly: 6159,
    yearlyTotal: 73908,
    discount: 12,
    sub: 'Active trading coverage with direct analyst access.',
    features: [
      { text: 'All Positional features — full swing & positional research', ok: true },
      { text: 'WhatsApp research delivery before market opens (9 AM)', ok: true },
      { text: 'Your specialisation: Intraday · Stock Options · Index Options', ok: true },
      { text: '3 institutional research reports per month', ok: true },
      { text: 'Direct WhatsApp access to Sahib Singh Hora', ok: true },
      { text: '1 × 15-min strategy session with Sahib every month', ok: true },
    ],
    cta: 'Go Pro',
    color: 'emerald',
    featured: true,
  },
  {
    tier: 'elite',
    name: 'Elite',
    monthly: 12499,
    yearlyMonthly: 10624,
    yearlyTotal: 127488,
    discount: 15,
    sub: 'Full coverage, all three services, maximum analyst access.',
    features: [
      { text: 'All three services: Intraday + Stock Options + Index Options', ok: true },
      { text: '4 × 15-min weekly strategy calls with Sahib (₹7,996 standalone value)', ok: true },
      { text: 'Monthly portfolio review and personalised trade feedback', ok: true },
      { text: 'One bespoke research note per month — commissioned exclusively for you', ok: true },
      { text: 'Direct call + WhatsApp access to Sahib Singh Hora', ok: true },
      { text: '🎁 Market Foundations course (₹24,999 value) for annual members', ok: true },
    ],
    cta: 'Go Elite',
    color: 'gold',
  },
]

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────
function useInView(_threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  return { ref, inView: true }
}

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.withsahib.com/#webpage',
  url: 'https://www.withsahib.com/',
  name: 'withSahib — SEBI Registered Research Analyst | Equity Research India',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['#entity-definition', 'h1', 'h2'],
  },
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <div id="entity-definition" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        withSahib is a SEBI Registered Research Analyst platform operated by Sahib Singh Hora (SEBI RA INH000026266).
        It provides daily intraday NSE equity picks, Nifty and Bank Nifty options research, swing trade research, deep-dive research reports,
        and 1-on-1 advisory sessions. All research is published by Sahib Singh Hora, a NISM-certified analyst with SEBI registration
        number INH000026266 valid from April 2026 to April 2031. The platform operates at withsahib.com and is compliant with
        SEBI Research Analysts Regulations 2014.
      </div>
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <DifferentiatorSection />
      <ServicesSection />
      <HowItWorksSection />
      <AnalystDarkSection />
      <PricingSection />
      <CTASection />
      <BookingBanner />
      <Footer />
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        padding: 'clamp(64px, 8vw, 100px) 40px clamp(56px, 7vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Restrained background — single subtle orb, not two loud ones */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-120px',
          width: '560px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,122,74,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" style={{ padding: 0, position: 'relative', zIndex: 1 }}>
        <div className="hero-grid">
          {/* Left — copy */}
          <div>
            {/* Eyebrow */}
            <div
              className="animate-fade-up-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                padding: '6px 14px',
                background: 'rgba(26,122,74,0.06)',
                border: '1px solid rgba(26,122,74,0.15)',
                borderRadius: '20px',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
              <span style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                color: 'var(--green)', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
              }}>
                SEBI Registered Research Analyst · INH000026266
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-fade-up-1"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(40px, 5.2vw, 70px)',
                fontWeight: 700,
                lineHeight: 1.05,
                color: 'var(--text)',
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              Structured Trade Ideas.<br />
              <em style={{ fontStyle: 'italic', color: 'var(--orange)', fontWeight: 400 }}>Before the Market Opens.</em>
            </h1>

            {/* Sub */}
            <p
              className="animate-fade-up-2"
              style={{
                fontSize: '18px',
                color: 'var(--text2)',
                maxWidth: '500px',
                lineHeight: 1.75,
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                marginBottom: '36px',
              }}
            >
              Daily equity research from a SEBI Registered Analyst — with defined entry zones, two targets, and a stop-loss on every idea. No random tips. No noise.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up-3 hero-ctas"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}
            >
              <Button href="/auth/register" variant="primary" size="lg">
                Get Today&apos;s Research →
              </Button>
              <Button href="/methodology" variant="secondary" size="lg">
                See How It Works
              </Button>
            </div>

            <p style={{
              fontSize: '12px', color: 'var(--text4)',
              fontFamily: 'var(--font-body)', letterSpacing: '0.3px',
            }}>
              SEBI RA · INH000026266 · Sahib Singh Hora · 14+ years market experience
            </p>

            <a
              href="https://t.me/withsahib"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: '#0088cc', textDecoration: 'none',
                marginTop: '16px', fontFamily: 'var(--font-body)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Join free Telegram channel →
            </a>
          </div>

          {/* Right — Sample Research Card */}
          <div className="animate-fade-up-2">
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: '0 8px 48px rgba(0,0,0,0.07)',
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
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--green-bright)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '1.5px', fontFamily: 'var(--font-body)', textTransform: 'uppercase',
                  }}>
                    Sample Research Call
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                  INH000026266
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>
                      NSE · Intraday Research
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
                      RELIANCE
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>₹2,847.50</div>
                  </div>
                  <span style={{
                    background: 'rgba(26,122,74,0.10)',
                    color: 'var(--green)',
                    border: '1px solid rgba(26,122,74,0.22)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                    fontFamily: 'var(--font-body)',
                  }}>
                    BUY
                  </span>
                </div>

                {/* Levels */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Entry', value: '₹2,840–2,855', color: 'var(--text)' },
                    { label: 'Target', value: '₹2,920', color: 'var(--green)' },
                    { label: 'Stop Loss', value: '₹2,810', color: '#DC2626' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--bg2)', borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
                      <div style={{
                        fontSize: '9px', color: 'var(--text4)', marginBottom: '4px',
                        fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* R:R */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ height: '3px', flex: 1, background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '67%', background: 'var(--green)', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-body)' }}>
                    R:R 1:2.3
                  </span>
                </div>

                {/* Rationale */}
                <p style={{
                  fontSize: '12px', color: 'var(--text3)', lineHeight: 1.65,
                  fontFamily: 'var(--font-body)', borderTop: '1px solid var(--border)',
                  paddingTop: '12px',
                }}>
                  Cup-and-handle breakout on daily. Volume confirmation. Sector (Refinery) showing relative strength vs Nifty. SL below demand zone.
                </p>
              </div>
            </div>
            <p style={{
              textAlign: 'center', fontSize: '11px', color: 'var(--text4)',
              marginTop: '10px', fontFamily: 'var(--font-body)',
            }}>
              For illustration only. Not investment advice. Past performance is not indicative of future results.
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
    { num: 'INH000026266', label: 'SEBI Registration No.' },
    { num: 'NISM Certified', label: 'Registered Analyst' },
    { num: '14+ Years', label: 'Market Experience' },
  ]
  return (
    <div
      style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 40px',
      }}
    >
      <div
        className="container-wide"
        style={{
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: s.num.length > 10 ? 'var(--font-mono)' : 'var(--font-heading)',
              fontSize: s.num.length > 10 ? '12px' : '22px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: s.num.length > 10 ? '0.5px' : 'normal',
              marginBottom: '3px',
            }}>
              {s.num}
            </div>
            <div style={{
              fontSize: '11px', color: 'var(--text3)',
              letterSpacing: '1px', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DIFFERENTIATOR SECTION ───────────────────────────────────────────────────
function DifferentiatorSection() {
  const items = [
    {
      label: 'SEBI RA INH000026266',
      desc: 'Individually registered. Publicly verifiable on the SEBI intermediary portal. Every call carries a regulatory consequence.',
    },
    {
      label: 'No quota. No deadline.',
      desc: 'Research is only published when a setup survives all six filters. If nothing qualifies on a given day, nothing is published.',
    },
    {
      label: 'Full outcome logging',
      desc: 'Every signal is logged with its result — wins and losses both. A complete, SEBI-compliant audit trail from the first call.',
    },
    {
      label: 'Written rationale on every call',
      desc: 'Not a number. A document. Pattern, catalyst, sector context, entry logic, and risk level — in writing, every time.',
    },
  ]

  return (
    <section style={{ padding: '72px 40px', background: 'var(--bg)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
            gap: 'clamp(40px, 6vw, 88px)',
            alignItems: 'start',
          }}
        >
          {/* Left — strong statement */}
          <div>
            <div className="section-tag">What makes this different</div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.15,
                marginBottom: '20px',
                letterSpacing: '-0.01em',
              }}
            >
              Not a signal channel.{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--orange)', fontWeight: 400 }}>A research record.</em>
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'var(--text2)',
              lineHeight: 1.75,
              fontFamily: 'var(--font-body)',
              maxWidth: '340px',
              marginBottom: '28px',
            }}>
              The difference between withSahib and every anonymous Telegram channel is not the quality of the calls — it is the accountability behind them. A registered analyst. A named record. A legal standard.
            </p>
            <Link
              href="/methodology"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text2)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border2)',
                paddingBottom: '2px',
                transition: 'color 0.15s, border-color 0.15s',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--orange)'
                el.style.borderColor = 'var(--orange)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text2)'
                el.style.borderColor = 'var(--border2)'
              }}
            >
              Read the full methodology →
            </Link>
          </div>

          {/* Right — 4 specific differentiators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 0',
                  borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.6fr',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  paddingTop: '2px',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text2)',
                  lineHeight: 1.65,
                  fontFamily: 'var(--font-body)',
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function ServicesSection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} style={{ padding: '72px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">Research Coverage</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.15,
            marginBottom: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          Eight categories.{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>One registered analyst behind all of them.</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '48px', fontFamily: 'var(--font-body)', maxWidth: '560px' }}>
          From pre-market intraday research to long-term portfolio construction — every recommendation published under SEBI RA INH000026266 with full written rationale.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <Link key={i} href={svc.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    padding: '28px 24px',
                    background: 'var(--surface)',
                    position: 'relative',
                    cursor: 'pointer',
                    height: '100%',
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${i * 0.06}s, background 0.2s`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)' }}
                >
                  <div style={{
                    width: '36px', height: '36px',
                    background: 'rgba(26,122,74,0.07)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <Icon size={18} strokeWidth={1.5} color="var(--green)" />
                  </div>
                  <h3 style={{
                    fontSize: '15px', fontWeight: 600, color: 'var(--text)',
                    marginBottom: '8px', fontFamily: 'var(--font-body)',
                  }}>
                    {svc.title}
                  </h3>
                  <p style={{
                    fontSize: '13px', color: 'var(--text2)',
                    lineHeight: 1.6, marginBottom: '14px', fontFamily: 'var(--font-body)',
                  }}>
                    {svc.desc}
                  </p>
                  <span className={`badge badge-${svc.badgeColor}`} style={{ fontSize: '10px' }}>
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
    {
      n: '01',
      title: 'The market is scanned every morning before 9 AM',
      desc: '1,500+ Nifty 500 equities are reviewed against overnight global cues, FII/DII data, and technical setups before the Indian session opens. Not a shortcut. A process.',
    },
    {
      n: '02',
      title: 'Only the highest-conviction setups make the cut',
      desc: 'Not every setup qualifies. One to three research notes per day, maximum. If nothing earns publication, nothing is published. Quality over output.',
    },
    {
      n: '03',
      title: 'You receive the reasoning — not just the numbers',
      desc: 'Entry range, two targets, stop loss, and written rationale. You understand why the trade was selected before you decide whether to act on it.',
    },
  ]
  return (
    <section ref={ref} style={{ padding: '72px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">How It Works</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          Research you can{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>follow and understand</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', maxWidth: '480px', marginBottom: '52px', fontFamily: 'var(--font-body)' }}>
          Every call on withSahib has a named person behind it — not a black box, not a committee.
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
                  fontSize: '64px',
                  fontWeight: 700,
                  color: 'var(--border2)',
                  lineHeight: 1,
                  marginBottom: '20px',
                  letterSpacing: '-2px',
                }}
              >
                {step.n}
              </div>
              <h3 style={{
                fontSize: '16px', fontWeight: 600, color: 'var(--text)',
                marginBottom: '10px', lineHeight: 1.4, fontFamily: 'var(--font-body)',
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
                {step.desc}
              </p>
            </div>
          ))}
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
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(26,122,74,0.25)',
              }}
            >
              <Image
                src="/images/sahib-primary.jpg"
                alt="Sahib Singh Hora — SEBI Registered Research Analyst"
                fill
                sizes="480px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px', fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              marginTop: '16px', marginBottom: 0,
            }}>
              Sahib Singh Hora
            </h3>
            <p style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.5)',
              marginTop: '4px', marginBottom: 0, fontFamily: 'var(--font-body)',
            }}>
              SEBI Registered Research Analyst
            </p>
            <span style={{
              display: 'inline-block', marginTop: '12px',
              background: 'rgba(212,168,67,0.15)', color: '#D4A843',
              fontFamily: 'var(--font-mono)', fontSize: '12px',
              borderRadius: '4px', padding: '3px 8px',
              border: '1px solid rgba(212,168,67,0.25)',
            }}>
              INH000026266
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
              {['NISM Certified', 'Technical Analyst', 'Options Strategist'].map((tag) => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '11px', borderRadius: '4px',
                  padding: '3px 8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {[
                { href: 'https://www.linkedin.com/in/sahibsinghhora/', icon: <Linkedin size={16} />, label: 'LinkedIn' },
                { href: 'https://x.com/WithSahib_', icon: <Twitter size={16} />, label: 'Twitter' },
                { href: 'https://www.instagram.com/withsahib_/', icon: <Instagram size={16} />, label: 'Instagram' },
                { href: 'https://www.facebook.com/sahib1313', icon: <Facebook size={16} />, label: 'Facebook' },
              ].map(({ href, icon, label }) => (
                <a
                  key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              marginBottom: '12px', fontFamily: 'var(--font-body)',
            }}>
              The Analyst
            </p>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700, color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.2, marginBottom: '20px',
            }}>
              Accountability by name and by regulation
            </h2>
            <p style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, marginBottom: '16px', fontFamily: 'var(--font-body)',
            }}>
              I&apos;m Sahib Singh Hora — a SEBI Registered Research Analyst (INH000026266), licensed under SEBI (Research Analysts) Regulations, 2014. Every recommendation on withSahib is published under that registration — individually named, publicly verifiable, and legally accountable.
            </p>
            <p style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, marginBottom: '32px', fontFamily: 'var(--font-body)',
            }}>
              That is the structural difference between a registered research house and an unregistered Telegram channel: the name on the call has a regulatory consequence.
            </p>

            {/* Proof items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {[
                'Cannot recommend stocks without disclosing any personal positions',
                'Cannot accept commissions or referral fees from covered companies',
                'Cannot trade covered stocks within 30 days of publishing a recommendation',
                'Subject to SEBI inspection and regulatory action for violations',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: 'rgba(26,122,74,0.2)',
                    border: '1px solid rgba(26,122,74,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    <Check size={9} color="var(--green)" strokeWidth={3} />
                  </div>
                  <span style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.5, fontFamily: 'var(--font-body)',
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/about"
                style={{
                  textDecoration: 'none', padding: '11px 24px',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                }}
              >
                Read my story →
              </Link>
              <Button href="/appointments" variant="primary">
                Book a session →
              </Button>
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
    <section ref={ref} id="pricing" style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Research Access</div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700, color: 'var(--text)',
            marginBottom: '12px', letterSpacing: '-0.01em',
          }}>
            Transparent pricing,{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>zero surprises</em>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '28px', fontFamily: 'var(--font-body)' }}>
            Start free. Upgrade when the research proves its worth. Cancel anytime.
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text4)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>
            Free plan always available — no card required
          </p>
          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            padding: '4px', gap: '4px',
          }}>
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
                  background: billing === b ? 'var(--orange)' : 'transparent',
                  color: billing === b ? '#FFFFFF' : 'var(--text2)',
                  transition: 'all 0.2s',
                }}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly — save up to 15%'}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-grid" style={{ alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const displayPrice = billing === 'yearly' ? plan.yearlyMonthly : plan.monthly
            const isFeatured = !!('featured' in plan && plan.featured)
            const isElite = plan.color === 'gold'

            return (
              <div
                key={i}
                style={{
                  background: isFeatured ? 'var(--black)' : 'var(--surface)',
                  border: isElite
                    ? '1px solid rgba(212,168,67,0.4)'
                    : isFeatured
                      ? '1px solid rgba(26,122,74,0.4)'
                      : '1px solid var(--border2)',
                  borderTop: isElite
                    ? '2px solid #D4A017'
                    : isFeatured
                      ? '2px solid var(--green)'
                      : undefined,
                  borderRadius: 'var(--r-xl)',
                  padding: '28px',
                  position: 'relative',
                  transform: isFeatured ? 'translateY(-8px)' : undefined,
                  boxShadow: isFeatured
                    ? '0 20px 60px rgba(26,122,74,0.12)'
                    : isElite
                      ? '0 0 0 1px rgba(212,160,23,0.06)'
                      : 'none',
                }}
              >
                {isFeatured && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--green)', color: '#FFFFFF',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
                    padding: '4px 14px', borderRadius: '20px',
                    whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                    color: isFeatured ? 'rgba(255,255,255,0.5)' : 'var(--text3)',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                  }}>
                    {plan.name}
                  </div>
                  {billing === 'yearly' && plan.discount > 0 && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                      borderRadius: '4px',
                      background: isFeatured ? 'rgba(255,107,0,0.2)' : 'rgba(255,107,0,0.08)',
                      color: 'var(--orange)',
                      border: '1px solid rgba(255,107,0,0.2)',
                      fontFamily: 'var(--font-body)',
                    }}>
                      SAVE {plan.discount}%
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '42px', fontWeight: 800,
                    color: isFeatured ? '#FFFFFF' : 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '-1px',
                  }}>
                    {`₹${displayPrice.toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '13px', color: isFeatured ? 'rgba(255,255,255,0.4)' : 'var(--text3)', fontFamily: 'var(--font-body)' }}>
                    /mo
                  </span>
                </div>

                {billing === 'yearly' && plan.yearlyTotal > 0 && (
                  <p style={{ fontSize: '11px', color: isFeatured ? 'rgba(255,107,0,0.8)' : 'var(--text3)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>
                    ₹{plan.yearlyTotal.toLocaleString('en-IN')} billed annually
                  </p>
                )}

                <p style={{
                  fontSize: '12px',
                  color: isFeatured ? 'rgba(255,255,255,0.4)' : 'var(--text3)',
                  marginBottom: '20px', paddingBottom: '20px',
                  borderBottom: `1px solid ${isFeatured ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-body)',
                }}>
                  {plan.sub}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '13px',
                      color: isFeatured ? 'rgba(255,255,255,0.8)' : 'var(--text2)',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.45,
                    }}>
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(26,122,74,0.12)',
                        border: '1.5px solid var(--green)',
                      }}>
                        <Check size={9} color="var(--green)" strokeWidth={3} />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/pricing?tier=${plan.tier}`}
                  style={{
                    display: 'block', width: '100%', padding: '12px',
                    borderRadius: 'var(--r-sm)', textAlign: 'center',
                    textDecoration: 'none', fontSize: '14px', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                    background: isFeatured
                      ? 'var(--green)'
                      : isElite
                        ? 'rgba(212,160,23,0.08)'
                        : 'transparent',
                    color: isFeatured
                      ? '#FFFFFF'
                      : isElite
                        ? '#B8860B'
                        : 'var(--text2)',
                    border: isFeatured
                      ? 'none'
                      : isElite
                        ? '1px solid rgba(212,160,23,0.3)'
                        : '1px solid var(--border2)',
                    boxShadow: isFeatured ? '0 8px 25px rgba(26,122,74,0.3)' : 'none',
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
            <div style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '2px',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              marginBottom: '8px', fontFamily: 'var(--font-body)',
            }}>
              HNI &amp; Corporate
            </div>
            <div className="hni-title">Looking for custom research coverage?</div>
            <div className="hni-sub">For HNI investors, family offices, and corporate treasuries requiring bespoke equity research — contact directly.</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Button href="/contact" variant="primary" size="lg">
              Contact for Custom Research
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
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
        <div
          style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,122,74,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, color: '#FFFFFF',
            marginBottom: '14px', lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            Start with what you&apos;re{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>ready for.</em>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '16px',
            marginBottom: '32px', lineHeight: 1.7, fontFamily: 'var(--font-body)',
          }}>
            The free plan gives you signal previews, sample reports, and market data — enough to see how the research is structured before you commit. Upgrade when the quality speaks for itself.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/auth/register" variant="primary" size="lg">
              Start Free Today
              <ArrowRight size={16} />
            </Button>
            <Button href="/pricing" variant="ghost" size="lg">
              See All Plans
            </Button>
          </div>
          <p style={{
            marginTop: '24px', fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-mono)', letterSpacing: '1px',
          }}>
            SEBI RA · INH000026266 · No credit card required for free plan
          </p>
        </div>
      </div>
    </section>
  )
}
