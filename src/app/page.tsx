'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import {
  TrendingUp, BarChart2, Target, RefreshCw,
  Shield, ArrowRight, Check,
  Linkedin, Twitter, Instagram, Facebook,
  FileText, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PayButton } from '@/components/ui/PayButton'
import { BillingSelector, BILLING_OPTIONS, type BillingValue } from '@/components/ui/BillingSelector'
import { CouponInput } from '@/components/ui/CouponInput'
import { TypewriterHero } from '@/components/ui/TypewriterHero'

// ─── PRICING DATA ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: 'positional',
    name: 'Positional',
    monthlyPaise: 399900,
    originalMonthly: 7998,
    sub: 'Swing and positional research with full written rationale.',
    features: [
      '8–12 positional setups per month',
      'Entry zone, 2 targets, stop-loss on every pick',
      'Written research rationale on every idea',
      'Sector context included',
      'Full research archive access',
    ],
    cta: 'Start Positional',
    color: 'default',
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPaise: 699900,
    originalMonthly: 13998,
    sub: 'Active trading coverage with direct analyst access.',
    features: [
      'All Positional features included',
      'WhatsApp delivery before 9 AM',
      'Intraday · Stock Options · Index Options (pick one)',
      'Direct WhatsApp access to Sahib Singh Hora',
      '1 × 15-min strategy session per month',
    ],
    cta: 'Go Pro',
    color: 'emerald',
    featured: true,
  },
  {
    tier: 'elite',
    name: 'Elite',
    monthlyPaise: 1249900,
    originalMonthly: 24998,
    sub: 'Full coverage, all three services, maximum analyst access.',
    features: [
      'All three services: Intraday + Options + Index',
      '4 × 15-min weekly strategy calls',
      'Monthly portfolio review',
      'Bespoke research note per month',
      'Direct call + WhatsApp access',
    ],
    cta: 'Go Elite',
    color: 'gold',
  },
]

function calcFinalPaise(monthlyPaise: number, months: number, billingDiscount: number, couponDiscount: number) {
  const total = monthlyPaise * months
  const afterBilling = total * (1 - billingDiscount / 100)
  const afterCoupon = afterBilling * (1 - couponDiscount / 100)
  return Math.round(afterCoupon)
}

function fmtINR(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

const FAQ_ITEMS = [
  {
    q: 'Is this guaranteed profit?',
    a: 'No. Research ideas are not guaranteed to result in profits. All investments carry risk. withSahib provides structured research — the decision to act is always yours.',
  },
  {
    q: 'How are research ideas delivered?',
    a: 'Published on the dashboard before 9 AM on every trading day. Pro and Elite subscribers also receive WhatsApp delivery.',
  },
  {
    q: 'Is this suitable for beginners?',
    a: 'Yes — each idea includes a written rationale explaining the structural basis. However, understanding basic market concepts is recommended.',
  },
  {
    q: 'What risk management approach is followed?',
    a: 'Every idea includes a defined stop-loss and two targets. Position sizing and risk-per-trade decisions remain with the subscriber.',
  },
  {
    q: 'Is Sahib Singh Hora SEBI registered?',
    a: 'Yes. Registration number INH000026266 under SEBI (Research Analysts) Regulations, 2014. Verify at sebi.gov.in.',
  },
]

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
      <MissedOpportunitySection />
      <HowItWorksSection />
      <TrustBlockSection />
      <ServicesSection />
      <DifferentiatorSection />
      <AnalystDarkSection />
      <PricingSection />
      <UrgencySection />
      <FAQSection />
      <CTASection />
      <BookingBanner />
      <Footer />
    </div>
  )
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        padding: 'clamp(64px, 8vw, 100px) 40px clamp(56px, 7vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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

            <TypewriterHero />

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
                Start Free Today
                <ArrowRight size={16} />
              </Button>
              <Button href="/methodology" variant="secondary" size="lg">
                See the Process
              </Button>
            </div>

            <p style={{
              fontSize: '12px', color: 'var(--text4)',
              fontFamily: 'var(--font-body)', letterSpacing: '0.3px',
            }}>
              SEBI RA · INH000026266 · Sahib Singh Hora · 14+ years market experience
            </p>

            {/* Telegram CTA */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--border2)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text4)', fontFamily: 'var(--font-body)' }}>or</span>
                <div style={{ width: '40px', height: '1px', background: 'var(--border2)' }} />
              </div>
              <span className="telegram-badge">🔔 Free signals &amp; market updates</span>
              <a
                href="https://t.me/withsahib"
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Join Free on Telegram →
              </a>
            </div>
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
                    Sample Research Report
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                  INH000026266
                </span>
              </div>

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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Entry Zone', value: '₹2,840–2,855', color: 'var(--text)' },
                    { label: 'Target', value: '₹2,920', color: 'var(--green)' },
                    { label: 'Stop Loss', value: '₹2,810', color: 'var(--coral)' },
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ height: '3px', flex: 1, background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '67%', background: 'var(--green)', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-body)' }}>
                    R:R 1:2.3
                  </span>
                </div>

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
              For illustration only · Not investment advice · Past performance is not indicative of future results.
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

// ─── SECTION 2: MISSED OPPORTUNITY ───────────────────────────────────────────
function MissedOpportunitySection() {
  const cards = [
    {
      symbol: 'RELIANCE',
      exchange: 'NSE · Swing',
      timeLabel: 'Levels shared: Pre-market, 8:47 AM',
      sessionNote: 'Zone respected during session',
    },
    {
      symbol: 'HDFCBANK',
      exchange: 'NSE · Intraday',
      timeLabel: 'Levels shared: Pre-market, 8:51 AM',
      sessionNote: 'Zone respected during session',
    },
    {
      symbol: 'NIFTY',
      exchange: 'NSE · Index Options',
      timeLabel: 'Levels shared: Pre-market, 8:55 AM',
      sessionNote: 'Zone respected during session',
    },
  ]

  return (
    <section
      id="missed-opportunity"
      style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div
            className="section-tag"
            style={{
              justifyContent: 'center',
              color: 'var(--orange)',
            }}
          >
            Why Timing Matters
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              marginBottom: 0,
            }}
          >
            The setup was there.<br />
            The levels were shared.<br />
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>Did you have them?</em>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--r-lg)',
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--green), var(--green-bright))',
                }}
              />
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
                  color: 'var(--text4)', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', marginBottom: '6px',
                }}>
                  {card.exchange}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px', fontWeight: 700, color: 'var(--text)',
                  lineHeight: 1,
                }}>
                  {card.symbol}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                  {card.timeLabel}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text4)', flexShrink: 0 }} />
                  {card.sessionNote}
                </div>
              </div>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(26,122,74,0.07)',
                border: '1px solid rgba(26,122,74,0.2)',
                borderRadius: '20px',
                padding: '5px 12px',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--green-bright)',
                }} />
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                  color: 'var(--green)', fontFamily: 'var(--font-body)',
                }}>
                  Move initiated
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '14px', color: 'var(--text3)', fontStyle: 'italic',
            fontFamily: 'var(--font-heading)', marginBottom: '28px', lineHeight: 1.6,
          }}>
            All research is published before 9 AM on every trading day.
          </p>
          <Button href="/auth/register" variant="primary" size="lg">
            Don&apos;t Miss the Next Setup →
          </Button>
          <p style={{
            marginTop: '16px', fontSize: '11px', color: 'var(--text4)',
            fontFamily: 'var(--font-body)',
          }}>
            Past setups shown for illustrative purposes only. Not indicative of future results.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 3: HOW IT WORKS ──────────────────────────────────────────────────
function HowItWorksSection() {
  const { ref, inView } = useInView()
  const steps = [
    {
      n: '01',
      title: 'Pre-Market Scanning',
      desc: 'Every trading day, 200+ charts are reviewed before the market opens — against overnight global cues, FII/DII data, and technical structure.',
    },
    {
      n: '02',
      title: 'Setup Selection',
      desc: 'Only high-probability, structurally sound setups are selected — with clear invalidation levels. If nothing qualifies, nothing is published.',
    },
    {
      n: '03',
      title: 'Research Published',
      desc: 'Entry zone, two targets, and stop-loss — with written rationale. Delivered before 9 AM. You decide whether to act.',
    },
  ]
  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}
    >
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
          Every research note on withSahib has a named person behind it — not a black box, not a committee.
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
        <p style={{
          marginTop: '28px',
          fontSize: '12px', color: 'var(--text4)',
          fontFamily: 'var(--font-body)', textAlign: 'center',
        }}>
          Research ideas are not buy/sell recommendations. Exercise your own judgment.
        </p>
      </div>
    </section>
  )
}

// ─── SECTION 4: TRUST BLOCK ───────────────────────────────────────────────────
function TrustBlockSection() {
  const pillars = [
    {
      icon: Shield,
      title: 'SEBI Registered',
      desc: 'Registered Research Analyst under SEBI (Research Analysts) Regulations, 2014.',
      detail: 'Registration No: INH000026266',
      link: { text: 'Verify on SEBI →', href: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14' },
      accentColor: 'var(--green)',
      accentBg: 'rgba(26,122,74,0.08)',
      accentBorder: 'rgba(26,122,74,0.2)',
    },
    {
      icon: Target,
      title: 'Risk-First Approach',
      desc: 'Every research idea includes a defined stop-loss. Capital preservation is the first priority.',
      detail: 'No idea published without a defined exit.',
      accentColor: 'var(--orange)',
      accentBg: 'rgba(255,107,0,0.06)',
      accentBorder: 'rgba(255,107,0,0.18)',
    },
    {
      icon: FileText,
      title: 'No Tips, Only Research',
      desc: 'No Telegram forwards. No anonymous calls. Structured research with written rationale on every idea.',
      detail: 'One analyst. One standard. Every time.',
      accentColor: 'var(--text2)',
      accentBg: 'rgba(0,0,0,0.03)',
      accentBorder: 'var(--border2)',
    },
  ]

  return (
    <section
      id="trust"
      className="always-dark"
      style={{ padding: '80px 40px' }}
    >
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div
            className="section-tag"
            style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}
          >
            Why It Matters
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              color: '#FAFAF7',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            Regulated.{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>Accountable.</em>{' '}
            Structured.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={i}
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 'var(--r-lg)',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: '44px', height: '44px',
                    background: p.accentBg,
                    border: `1px solid ${p.accentBorder}`,
                    borderRadius: 'var(--r-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={1.5} color={p.accentColor} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px', fontWeight: 700,
                  color: '#FAFAF7',
                  marginBottom: '10px', lineHeight: 1.3,
                }}>
                  {p.title}
                </h3>

                <p style={{
                  fontSize: '14px', color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.7, fontFamily: 'var(--font-body)',
                  marginBottom: '12px', flex: 1,
                }}>
                  {p.desc}
                </p>

                <p style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.3px',
                  marginBottom: p.link ? '14px' : 0,
                }}>
                  {p.detail}
                </p>

                {p.link && (
                  <a
                    href={p.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13px', fontWeight: 600,
                      color: 'var(--green)', textDecoration: 'none',
                      fontFamily: 'var(--font-body)',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                  >
                    {p.link.text}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 5: SERVICES ──────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    {
      icon: RefreshCw,
      title: 'Swing Trades',
      desc: '2–10 day positional ideas. Pattern-based, systematic. Entry zone, two targets, and stop-loss on every setup.',
      badge: 'New',
      badgeClass: 'badge-orange',
      href: '/services/swing',
    },
    {
      icon: TrendingUp,
      title: 'Intraday Research',
      desc: 'Pre-market levels for the day\'s session. Reviewed and published in before 9 AM every trading day.',
      badge: 'Live',
      badgeClass: 'badge-green',
      href: '/services/intraday',
    },
    {
      icon: BarChart2,
      title: 'Stock Options',
      desc: 'Weekly F&O research with strike selection, OI analysis, IV rank, and PCR context. Full written rationale.',
      badge: 'Live',
      badgeClass: 'badge-green',
      href: '/services/stock-options',
    },
    {
      icon: Target,
      title: 'Index Options',
      desc: 'Nifty, BankNifty, FinNifty. Expiry plays with PCR signals and multi-timeframe structure — before the open.',
      badge: 'Live',
      badgeClass: 'badge-green',
      href: '/services/index-options',
    },
  ]

  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
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
          Research across{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>every timeframe.</em>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text2)', marginBottom: '48px', fontFamily: 'var(--font-body)', maxWidth: '520px' }}>
          From pre-market intraday levels to weekly options setups — every research note published under SEBI RA INH000026266.
        </p>

        <div
          className="who-grid"
          style={{
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {services.map((svc, i) => {
            const Icon = svc.icon
            return (
              <Link key={i} href={svc.href} style={{ textDecoration: 'none' }}>
                <div
                  className="card card-hover"
                  style={{
                    padding: '28px 24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)' }}
                >
                  <div style={{
                    width: '40px', height: '40px',
                    background: 'rgba(26,122,74,0.07)',
                    borderRadius: 'var(--r-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px', flexShrink: 0,
                  }}>
                    <Icon size={20} strokeWidth={1.5} color="var(--green)" />
                  </div>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 700, color: 'var(--text)',
                    marginBottom: '8px', fontFamily: 'var(--font-body)',
                  }}>
                    {svc.title}
                  </h3>
                  <p style={{
                    fontSize: '14px', color: 'var(--text2)',
                    lineHeight: 1.65, marginBottom: '16px', fontFamily: 'var(--font-body)',
                    flex: 1,
                  }}>
                    {svc.desc}
                  </p>
                  <span className={`badge ${svc.badgeClass}`}>
                    {svc.badge}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button href="/services" variant="ghost">
            Explore All Services →
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 6: DIFFERENTIATION ──────────────────────────────────────────────
function DifferentiatorSection() {
  const left = [
    'Anonymous tips on Telegram',
    'No stop-loss mentioned',
    'Entry after the move already happened',
    'No written rationale',
    'Unregulated, unaccountable',
  ]
  const right = [
    'Structured research with written reasoning',
    'Stop-loss on every idea, always',
    'Levels published before market opens',
    'Full rationale — sector context, pattern, risk',
    'SEBI Registered Research Analyst',
  ]

  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div className="section-tag">The Difference</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.15,
            marginBottom: '48px',
            letterSpacing: '-0.01em',
          }}
        >
          Research,{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>not noise.</em>
        </h2>

        <div
          className="resp-2col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          {/* Left — what you're used to */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--r-lg)',
              padding: '32px 28px',
            }}
          >
            <p style={{
              fontSize: '20px', fontWeight: 600,
              color: 'var(--text3)',
              fontFamily: 'var(--font-body)', marginBottom: '24px',
              lineHeight: 1.2,
            }}>
              What you&apos;re used to
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {left.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{
                    fontSize: '18px', color: 'var(--muted)',
                    fontWeight: 700, lineHeight: 1, flexShrink: 0, marginTop: '2px',
                  }}>
                    ✕
                  </span>
                  <span style={{
                    fontSize: '18px', color: 'var(--text3)',
                    fontFamily: 'var(--font-body)', lineHeight: 1.8,
                    textDecoration: 'line-through',
                    textDecorationColor: 'var(--muted)',
                    textDecorationThickness: '2px',
                    opacity: 0.7,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — withSahib */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(26,122,74,0.3)',
              borderTop: '2px solid var(--green)',
              borderRadius: 'var(--r-lg)',
              padding: '32px 28px',
            }}
          >
            <p style={{
              fontSize: '20px', fontWeight: 600,
              color: 'var(--text)',
              fontFamily: 'var(--font-body)', marginBottom: '24px',
              lineHeight: 1.2,
            }}>
              withSahib
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {right.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{
                    fontSize: '18px', color: 'var(--color-orange)',
                    fontWeight: 700, lineHeight: 1, flexShrink: 0, marginTop: '2px',
                  }}>
                    ✓
                  </span>
                  <span style={{
                    fontSize: '18px', color: 'var(--text)',
                    fontFamily: 'var(--font-body)', lineHeight: 1.8, fontWeight: 500,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 7: THE ANALYST ───────────────────────────────────────────────────
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
              Who publishes this research?
            </h2>
            <p style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, marginBottom: '16px', fontFamily: 'var(--font-body)',
            }}>
              Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) with 14+ years of active market experience. NISM certified. Every research note published on withSahib is authored, reviewed, and accountable.
            </p>
            <p style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8, marginBottom: '32px', fontFamily: 'var(--font-body)',
            }}>
              This is not a team of anonymous analysts. This is one person, one voice, one standard.
            </p>

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

            <Link
              href="/about"
              style={{
                textDecoration: 'none', padding: '11px 24px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px', fontWeight: 600,
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                display: 'inline-block',
              }}
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 8: PRICING PREVIEW ───────────────────────────────────────────────
function PricingSection() {
  const [billing, setBilling] = useState<BillingValue>('monthly')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)

  const billingOpt = BILLING_OPTIONS.find((o) => o.value === billing)!

  return (
    <section id="pricing" style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="container-wide" style={{ padding: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          <p style={{ fontSize: '16px', color: 'var(--text2)', fontFamily: 'var(--font-body)', marginBottom: '20px' }}>
            Start free. Upgrade when the research proves its worth.
          </p>

          {/* 50% OFF badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,107,0,0.08)',
            border: '1px solid rgba(255,107,0,0.22)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '20px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '1px', fontFamily: 'var(--font-body)' }}>
              🎉 LIMITED OFFER — 50% OFF all plans
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <BillingSelector value={billing} onChange={setBilling} />
            <CouponInput
              onApplied={(code, pct) => { setCouponCode(code); setCouponDiscount(pct) }}
              onRemoved={() => { setCouponCode(''); setCouponDiscount(0) }}
              appliedCode={couponCode}
              appliedDiscount={couponDiscount}
            />
          </div>
        </div>

        <div className="pricing-grid" style={{ alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const isFeatured = !!plan.featured
            const isElite = plan.color === 'gold'
            const finalPaise = calcFinalPaise(plan.monthlyPaise, billingOpt.months, billingOpt.discount, couponDiscount)
            const perMonthPaise = Math.round(finalPaise / billingOpt.months)
            const planNameWithBilling = billing === 'monthly' ? plan.tier : `${plan.tier}_${billing}`
            const displayName = `${plan.name} Plan — ${billingOpt.label} — ${fmtINR(finalPaise)}`

            const showBreakdown = billingOpt.months > 1 || couponDiscount > 0
            const baseTotal = plan.monthlyPaise * billingOpt.months
            const breakdownParts: string[] = [fmtINR(baseTotal)]
            if (billingOpt.discount > 0) breakdownParts.push(`${billingOpt.discount}% off`)
            if (couponDiscount > 0) breakdownParts.push(`${couponDiscount}% off`)
            breakdownParts.push(`${fmtINR(finalPaise)} total`)

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
                  boxShadow: isFeatured ? '0 20px 60px rgba(26,122,74,0.12)' : 'none',
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

                <div style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                  color: isFeatured ? 'rgba(255,255,255,0.5)' : 'var(--text3)',
                  textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                  marginBottom: '10px',
                }}>
                  {plan.name}
                </div>

                {/* Strike-through + 50% OFF + current price */}
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '14px',
                      color: isFeatured ? 'rgba(255,255,255,0.35)' : 'var(--text4)',
                      textDecoration: 'line-through',
                      fontFamily: 'var(--font-body)',
                    }}>
                      ₹{plan.originalMonthly.toLocaleString('en-IN')}
                    </span>
                    <span style={{
                      background: 'rgba(255,107,0,0.15)',
                      color: 'var(--orange)',
                      fontSize: '10px', fontWeight: 700,
                      padding: '2px 7px', borderRadius: '4px',
                      fontFamily: 'var(--font-body)', letterSpacing: '0.5px',
                    }}>
                      50% OFF
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{
                      fontSize: '42px', fontWeight: 800,
                      color: isFeatured ? '#FFFFFF' : 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      letterSpacing: '-1px',
                    }}>
                      {fmtINR(perMonthPaise)}
                    </span>
                    <span style={{ fontSize: '13px', color: isFeatured ? 'rgba(255,255,255,0.4)' : 'var(--text3)', fontFamily: 'var(--font-body)' }}>
                      /mo
                    </span>
                  </div>
                  {billingOpt.months > 1 && (
                    <p style={{ fontSize: '12px', color: 'var(--orange)', fontFamily: 'var(--font-body)', marginTop: '2px', fontWeight: 500 }}>
                      {fmtINR(finalPaise)} billed {billingOpt.label.toLowerCase()}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                {showBreakdown && (
                  <p style={{
                    fontSize: '11px', color: isFeatured ? 'rgba(255,255,255,0.3)' : 'var(--text4)',
                    fontFamily: 'var(--font-body)', marginBottom: '8px', lineHeight: 1.5,
                  }}>
                    {breakdownParts.join(' → ')}
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

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', paddingLeft: '4px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontSize: '16px',
                      color: isFeatured ? 'rgba(255,255,255,0.85)' : 'var(--text2)',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.7,
                    }}>
                      <span style={{
                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '3px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(26,122,74,0.12)',
                        border: '1.5px solid var(--green)',
                      }}>
                        <Check size={10} color="var(--green)" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <PayButton
                  planName={planNameWithBilling}
                  planDisplayName={displayName}
                  amountPaise={finalPaise}
                  couponCode={couponCode || undefined}
                  style={{
                    display: 'block', width: '100%', padding: '12px',
                    borderRadius: 'var(--r-sm)', textAlign: 'center',
                    fontSize: '14px', fontWeight: 700,
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
                </PayButton>

                <p style={{
                  fontSize: '11px', color: isFeatured ? 'rgba(255,255,255,0.3)' : 'var(--text4)',
                  textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-body)',
                }}>
                  💳 No-cost EMI available on credit cards
                </p>
              </div>
            )
          })}
        </div>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '12px', color: 'var(--text4)',
          fontFamily: 'var(--font-body)', maxWidth: '560px', margin: '24px auto 0',
        }}>
          Fees are for research and analyst access services only. Subscribing does not guarantee profits or returns.
        </p>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button href="/pricing" variant="ghost">
            See Full Plan Details →
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 9: URGENCY ───────────────────────────────────────────────────────
function UrgencySection() {
  return (
    <section
      className="always-dark"
      style={{ padding: '80px 40px', textAlign: 'center' }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700,
          color: '#FAFAF7',
          lineHeight: 1.15,
          marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}>
          Tomorrow&apos;s research is being{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>prepared tonight.</em>
        </h2>
        <p style={{
          fontSize: '17px', color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.75, marginBottom: '36px',
          fontFamily: 'var(--font-body)', maxWidth: '500px', margin: '0 auto 36px',
        }}>
          Every trading day, levels are published before the market opens. Once the session begins, that window closes.
        </p>
        <Button href="/auth/register" variant="primary" size="lg">
          Get Access Before Market Opens →
        </Button>
        <p style={{
          marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-body)',
        }}>
          Free plan available. No credit card required to start.
        </p>
      </div>
    </section>
  )
}

// ─── SECTION 10: FAQ ─────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-narrow" style={{ padding: 0 }}>
        <div className="section-tag">Common Questions</div>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '40px',
          letterSpacing: '-0.01em',
        }}>
          Frequently asked questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{ background: 'var(--surface)' }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '20px 24px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <span style={{
                  fontSize: '15px', fontWeight: 600, color: 'var(--text)',
                  fontFamily: 'var(--font-body)', lineHeight: 1.4,
                }}>
                  {item.q}
                </span>
                {open === i
                  ? <ChevronUp size={18} strokeWidth={2} color="var(--orange)" style={{ flexShrink: 0 }} />
                  : <ChevronDown size={18} strokeWidth={2} color="var(--text3)" style={{ flexShrink: 0 }} />
                }
              </button>
              {open === i && (
                <div style={{ padding: '0 24px 20px' }}>
                  <p style={{
                    fontSize: '14px', color: 'var(--text2)',
                    lineHeight: 1.75, fontFamily: 'var(--font-body)',
                  }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sebi-disclaimer" style={{ marginTop: '32px' }}>
          Research by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk. Past performance not indicative of future results. Not investment advice.
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 11: FINAL CTA ────────────────────────────────────────────────────
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
            Be prepared before{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>the market opens.</em>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '16px',
            marginBottom: '32px', lineHeight: 1.7, fontFamily: 'var(--font-body)',
          }}>
            Join traders who start their day with structured research — not noise.
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
            SEBI RA INH000026266 · No spam · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
