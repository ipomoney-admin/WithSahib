'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PayButton } from '@/components/ui/PayButton'
import { BillingSelector, BILLING_OPTIONS, type BillingValue } from '@/components/ui/BillingSelector'
import { CouponInput } from '@/components/ui/CouponInput'

// ─── PLAN DATA ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    tier: 'positional',
    name: 'Positional',
    monthlyPaise: 399900,
    originalMonthly: 7998,
    badge: null,
    featured: false,
    cardBorder: 'var(--border2)',
    cardBg: 'var(--surface)',
    ctaStyle: 'ghost' as const,
    features: [
      '8–12 high-conviction positional setups per month — low risk, asymmetric reward',
      'Precisely defined entry zone, two price targets, and stop-loss on every pick',
      'Written research rationale explaining the structural basis for each recommendation',
      'Sector context and broader market conditions included',
      'Weekly research digest with closed-trade performance summary',
      'Access to full research archive',
    ],
    highlightBox: null,
  },
  {
    tier: 'pro',
    name: 'Pro',
    monthlyPaise: 699900,
    originalMonthly: 13998,
    badge: { label: 'MOST POPULAR', bg: '#1A7A4A', color: '#FFFFFF' },
    featured: true,
    cardBorder: '#1A7A4A',
    cardBorderWidth: 2,
    cardBg: 'var(--surface)',
    ctaStyle: 'primary' as const,
    features: [
      '8–12 swing setups/month + entry zone, 2 targets, stop-loss on every pick',
      'WhatsApp research delivery before market opens — before 9 AM',
      'Your specialisation: Intraday Research · Stock Options · Index Options (pick one)',
      '3 institutional research reports per month',
      'Direct WhatsApp access to Sahib Singh Hora',
      '1 × 15-minute strategy session with Sahib every month',
    ],
    highlightBox: null,
  },
  {
    tier: 'elite',
    name: 'Elite',
    monthlyPaise: 1249900,
    originalMonthly: 24998,
    badge: { label: 'FLAGSHIP TIER', bg: '#B8975A', color: '#FFFFFF' },
    featured: false,
    cardBorder: '#B8975A',
    cardBorderWidth: 2,
    cardBg: 'var(--bg2)',
    ctaStyle: 'gold' as const,
    features: [
      'All three services: Intraday + Stock Options + Index Options — full coverage',
      'WhatsApp delivery before 9 AM + full swing/positional research archive',
      '4 × 15-minute weekly strategy calls with Sahib (₹7,996 standalone value)',
      'Monthly portfolio review and personalised trade feedback',
      'One bespoke research note per month — commissioned exclusively for you',
      'Direct call + WhatsApp access to Sahib Singh Hora',
    ],
    highlightBox: '🎁 Annual Elite members receive the Market Foundations course at no charge (₹24,999 value) — accessible within the first 3 months',
  },
]

const FOOTER_LINE = 'Research by Sahib Singh Hora · 14+ Years Experience · SEBI RA'

// ─── PRICE UTILS ──────────────────────────────────────────────────────────────
function calcFinalPaise(
  monthlyPaise: number,
  months: number,
  billingDiscount: number,
  couponDiscount: number,
): number {
  const total = monthlyPaise * months
  const afterBilling = total * (1 - billingDiscount / 100)
  const afterCoupon = afterBilling * (1 - couponDiscount / 100)
  return Math.round(afterCoupon)
}

function formatINR(paise: number) {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const { t } = useLanguage()
  const [billing, setBilling] = useState<BillingValue>('monthly')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)

  const billingOpt = BILLING_OPTIONS.find((o) => o.value === billing)!

  const handleCouponApplied = (code: string, discount: number) => {
    setCouponCode(code)
    setCouponDiscount(discount)
  }
  const handleCouponRemoved = () => {
    setCouponCode('')
    setCouponDiscount(0)
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '40px 40px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '16px' }}>{t('pricing.eyebrow')}</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px,5vw,56px)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}>
            {t('pricing.headline')}{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>{t('pricing.headline_italic')}</em>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text2)', marginBottom: '24px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            {t('pricing.subline')}
          </p>

          {/* 50% OFF badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,107,0,0.08)',
            border: '1px solid rgba(255,107,0,0.25)',
            borderRadius: '20px',
            padding: '6px 16px',
            marginBottom: '16px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '1px', fontFamily: 'var(--font-body)' }}>
              🎉 LIMITED OFFER — 50% OFF all plans
            </span>
          </div>
        </div>
      </section>

      {/* Billing + Coupon Controls */}
      <section style={{ padding: '20px 40px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <BillingSelector value={billing} onChange={setBilling} />
          <CouponInput
            onApplied={handleCouponApplied}
            onRemoved={handleCouponRemoved}
            appliedCode={couponCode}
            appliedDiscount={couponDiscount}
          />
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ padding: '24px 40px 16px' }}>
        <div style={{
          maxWidth: 1060, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px', alignItems: 'start',
        }}>
          {PLANS.map((plan) => {
            const borderWidth = ('cardBorderWidth' in plan ? plan.cardBorderWidth : undefined) ?? 1
            const finalPaise = calcFinalPaise(plan.monthlyPaise, billingOpt.months, billingOpt.discount, couponDiscount)
            const perMonthPaise = Math.round(finalPaise / billingOpt.months)
            const planNameWithBilling = billing === 'monthly' ? plan.tier : `${plan.tier}_${billing}`
            const displayName = `${plan.name} Plan — ${billingOpt.label} — ${formatINR(finalPaise)}`

            // Price breakdown string
            const showBreakdown = billingOpt.months > 1 || couponDiscount > 0
            const baseTotal = plan.monthlyPaise * billingOpt.months
            const afterBillingPaise = Math.round(baseTotal * (1 - billingOpt.discount / 100))
            const breakdownParts: string[] = [formatINR(baseTotal)]
            if (billingOpt.discount > 0) breakdownParts.push(`${billingOpt.discount}% off`)
            if (couponDiscount > 0) breakdownParts.push(`${couponDiscount}% off`)
            breakdownParts.push(`${formatINR(finalPaise)} total`)
            const breakdownStr = breakdownParts.join(' → ')

            return (
              <div
                key={plan.tier}
                style={{
                  background: plan.cardBg,
                  border: `${borderWidth}px solid ${plan.cardBorder}`,
                  borderRadius: '20px',
                  padding: '32px 28px',
                  position: 'relative',
                  transform: plan.featured ? 'translateY(-8px)' : 'none',
                  boxShadow: plan.featured
                    ? '0 16px 56px rgba(26,122,74,0.12)'
                    : plan.tier === 'elite'
                      ? '0 8px 32px rgba(184,151,90,0.08)'
                      : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: plan.badge.bg, color: plan.badge.color,
                    fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                    padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {plan.tier === 'pro' ? t('pricing.most_popular') : t('pricing.flagship_tier')}
                  </div>
                )}

                {/* Plan name */}
                <div style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                  color: plan.tier === 'elite' ? '#B8975A' : plan.tier === 'pro' ? '#1A7A4A' : 'var(--text3)',
                  textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-body)',
                }}>
                  {t('pricing.' + plan.tier)}
                </div>

                {/* Price display: strike-through + 50% OFF badge + current price */}
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: 'var(--text4)',
                      textDecoration: 'line-through',
                    }}>
                      ₹{plan.originalMonthly.toLocaleString('en-IN')}
                    </span>
                    <span style={{
                      background: 'rgba(255,107,0,0.1)',
                      color: 'var(--orange)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-body)',
                      letterSpacing: '0.5px',
                    }}>
                      50% OFF
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                      {formatINR(perMonthPaise)}
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--text3)', fontFamily: 'var(--font-body)' }}>{t('pricing.per_month')}</span>
                  </div>
                  {billingOpt.months > 1 && (
                    <p style={{ fontSize: '12px', color: 'var(--orange)', fontFamily: 'var(--font-body)', marginTop: '2px', fontWeight: 500 }}>
                      {formatINR(finalPaise)} billed {billingOpt.label.toLowerCase()}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                {showBreakdown && (
                  <p style={{
                    fontSize: '11px', color: 'var(--text4)', fontFamily: 'var(--font-body)',
                    marginBottom: '8px', lineHeight: 1.5,
                  }}>
                    {breakdownStr}
                  </p>
                )}

                {/* Sub / tagline */}
                <p style={{
                  fontSize: '13px', color: 'var(--text3)', marginBottom: '24px',
                  paddingBottom: '20px', borderBottom: '1px solid var(--border)',
                  fontFamily: 'var(--font-body)', lineHeight: 1.5,
                }}>
                  {t('pricing.' + plan.tier + '_tagline')}
                </p>

                {/* Features */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: '2px' }}>
                        <Check size={14} color={plan.tier === 'elite' ? '#B8975A' : '#1A7A4A'} strokeWidth={2.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Highlight box for Elite */}
                {plan.highlightBox && (
                  <div style={{
                    background: 'rgba(255,107,0,0.06)',
                    border: '1px solid rgba(255,107,0,0.2)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                    fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {plan.highlightBox}
                  </div>
                )}

                {/* CTA button */}
                <PayButton
                  planName={planNameWithBilling}
                  planDisplayName={displayName}
                  amountPaise={finalPaise}
                  couponCode={couponCode || undefined}
                  style={{
                    display: 'block', width: '100%', padding: '13px',
                    borderRadius: '12px', textAlign: 'center',
                    fontSize: '14px', fontWeight: 700,
                    transition: 'all 0.2s', outline: 'none',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.02em',
                    ...(plan.ctaStyle === 'primary' ? {
                      background: 'var(--orange)',
                      color: '#FFFFFF',
                      border: 'none',
                      boxShadow: '0 8px 24px rgba(255,107,0,0.35)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    } : plan.ctaStyle === 'gold' ? {
                      background: 'rgba(184,151,90,0.08)',
                      color: '#B8975A',
                      border: '1.5px solid #B8975A',
                    } : {
                      background: 'transparent',
                      color: 'var(--text2)',
                      border: '1px solid var(--border2)',
                    }),
                  }}
                >
                  {t(plan.tier === 'positional' ? 'pricing.start_basic' : plan.tier === 'pro' ? 'pricing.go_pro' : 'pricing.go_elite')}
                </PayButton>

                {/* EMI note */}
                <p style={{
                  fontSize: '11px', color: 'var(--text4)', textAlign: 'center',
                  marginTop: '8px', fontFamily: 'var(--font-body)', lineHeight: 1.5,
                }}>
                  💳 No-cost EMI available on credit cards · Interest borne by withSahib
                </p>

                {/* Footer line */}
                <p style={{
                  fontSize: '10px', color: 'var(--text4)', textAlign: 'center',
                  marginTop: '6px', fontFamily: 'var(--font-body)', lineHeight: 1.5,
                }}>
                  {FOOTER_LINE}
                </p>
              </div>
            )
          })}
        </div>

        {/* Free line */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text4)', marginTop: '20px', fontFamily: 'var(--font-body)' }}>
          {t('pricing.free_note')}
        </p>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text4)', marginTop: '6px', fontFamily: 'var(--font-body)' }}>
          Fees are for research and analyst access services only. Subscribing does not guarantee profits or returns.
        </p>
      </section>

      {/* HNI Band */}
      <section style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{
            background: 'var(--black)',
            borderRadius: 16,
            padding: '28px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#B8975A', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                {t('pricing.hni_title')}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontStyle: 'italic', lineHeight: 1.3 }}>
                Starting ₹9,999/mo — {t('pricing.hni_sub')}
              </p>
            </div>
            <Button href="/contact" variant="gold" size="md" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              {t('pricing.hni_cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* Risk disclaimer */}
      <section style={{ padding: '0 40px 32px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', background: 'rgba(146,104,10,0.05)', border: '1px solid rgba(146,104,10,0.2)', borderRadius: 12, padding: '14px 20px' }}>
          <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            <strong style={{ color: '#92680A' }}>Risk Disclaimer: </strong>
            Investments in securities market are subject to market risks. Read all related documents carefully before investing.
            SEBI RA Registration: <strong>Sahib Singh Hora · INH000026266</strong> · withSahib.com
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 40px 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', marginBottom: '28px', textAlign: 'center' }}>
            Common questions
          </h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. No questions asked. Access continues until the end of your billing period.' },
            { q: 'What is the difference between Positional and Pro?', a: 'Positional covers 8–12 high-conviction positional setups per month with full written rationale. Pro adds your choice of one service (Intraday, Stock Options, or Index Options), real-time WhatsApp delivery before 9 AM, 3 institutional research reports/month, direct WhatsApp access to Sahib, and a monthly 15-minute strategy session.' },
            { q: 'How are research picks delivered?', a: 'Via your dashboard in real time. Pro and Elite subscribers also get WhatsApp delivery before 9 AM for intraday calls.' },
            { q: 'Is Sahib SEBI registered?', a: "Yes. Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266). Verify on SEBI's official portal at sebi.gov.in." },
            { q: 'Are returns guaranteed?', a: 'No. All investments in securities are subject to market risk. Past performance does not guarantee future returns.' },
            { q: 'Is no-cost EMI really free?', a: 'Yes. No-cost EMI means the interest is borne by withSahib, not you. You pay only the plan amount in instalments with zero extra charges.' },
          ].map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Community links */}
      <section style={{ padding: '0 40px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
          Questions before subscribing?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://t.me/withsahib"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(0,136,204,0.08)', border: '1px solid rgba(0,136,204,0.2)', color: '#0088CC', fontSize: '14px', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram
          </a>
          <a
            href="https://wa.me/919981248888?text=Hi%20Sahib%2C%20I%20have%20a%20question%20about%20your%20plans."
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366', fontSize: '14px', fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
          >
            WhatsApp Sahib
          </a>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0', gap: '12px', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{q}</span>
        <span style={{ color: 'var(--orange)', fontSize: '20px', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, paddingBottom: '18px', fontFamily: 'var(--font-body)' }}>
          {a}
        </p>
      )}
    </div>
  )
}
