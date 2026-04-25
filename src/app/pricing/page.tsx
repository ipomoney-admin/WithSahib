'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { Check, X, HelpCircle, Crown, Zap, Shield, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
  { category: 'Signals & Calls', items: [
    { label: 'Daily swing trade picks', free: false, basic: true, pro: true, elite: true },
    { label: 'Intraday stock calls (NSE)', free: false, basic: false, pro: true, elite: true },
    { label: 'Index options signals (Nifty/BankNifty)', free: false, basic: false, pro: true, elite: true },
    { label: 'Stock options signals', free: false, basic: false, pro: true, elite: true },
    { label: 'Research rationale with every call', free: false, basic: true, pro: true, elite: true },
    { label: 'Entry, Target 1, Target 2, Stop Loss levels', free: false, basic: true, pro: true, elite: true },
  ]},
  { category: 'Delivery & Alerts', items: [
    { label: 'WhatsApp signal alerts', free: false, basic: false, pro: false, elite: true },
    { label: 'Telegram paid channel access', free: false, basic: false, pro: true, elite: true },
    { label: 'Weekly track record report', free: false, basic: true, pro: true, elite: true },
    { label: 'Signal previews (public)', free: true, basic: true, pro: true, elite: true },
  ]},
  { category: 'Advisory & Access', items: [
    { label: '1-on-1 session with Sahib (monthly)', free: false, basic: false, pro: '1/month', elite: 'Unlimited' },
    { label: 'Priority WhatsApp access', free: false, basic: false, pro: false, elite: true },
    { label: 'In-depth research reports', free: false, basic: false, pro: true, elite: true },
    { label: 'All courses included', free: false, basic: false, pro: false, elite: true },
    { label: 'Dashboard & reports portal', free: true, basic: true, pro: true, elite: true },
  ]},
]

function FeatureCell({ val }: { val: boolean | string }) {
  if (val === true) return <Check size={16} color="var(--emerald)" strokeWidth={2.5} />
  if (val === false) return <X size={14} color="var(--text4)" strokeWidth={2} />
  return <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold)' }}>{val}</span>
}

export default function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [ctaLoading, setCtaLoading] = useState<string | null>(null)
  const [ctaError, setCtaError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [])

  async function handlePlanClick(e: React.MouseEvent, tier: string) {
    e.preventDefault()
    setCtaError('')

    if (tier === 'free') {
      router.push(hasSession ? '/dashboard' : '/auth/register')
      return
    }

    if (!hasSession) {
      router.push(`/auth/register?plan=${tier}`)
      return
    }

    // Logged in — create subscription via Razorpay
    setCtaLoading(tier)
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billing }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setCtaError(data.error ?? 'Could not start subscription. Please try again.')
        return
      }
      // Redirect to settings with subscription_id for Razorpay checkout
      router.push(`/settings?subscription=${data.subscription_id}&plan=${tier}`)
    } catch {
      setCtaError('Network error. Please try again.')
    } finally {
      setCtaLoading(null)
    }
  }

  // Yearly = monthly × 10 (2 months free ≈ 20% off)
  const plans = [
    { tier: 'free',  name: 'Free',  monthly: 0,    yearlyMonthly: 0,    yearlyTotal: 0,     discount: 0,  color: 'var(--text3)',    cta: 'Start Free',  ctaStyle: 'ghost',   badgeColor: 'grey'    },
    { tier: 'basic', name: 'Basic', monthly: 999,  yearlyMonthly: 832,  yearlyTotal: 9990,  discount: 20, color: 'var(--sapphire)', cta: 'Start Basic', ctaStyle: 'ghost',   badgeColor: 'grey'    },
    { tier: 'pro',   name: 'Pro',   monthly: 2499, yearlyMonthly: 2082, yearlyTotal: 24990, discount: 20, color: 'var(--emerald)',  cta: 'Start Pro',   ctaStyle: 'primary', featured: true, badgeColor: 'emerald' },
    { tier: 'elite', name: 'Elite', monthly: 5999, yearlyMonthly: 4999, yearlyTotal: 59990, discount: 20, color: 'var(--gold)',     cta: 'Go Elite',    ctaStyle: 'gold',    badgeColor: 'gold'    },
  ]

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '20px' }}>Pricing</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: 'var(--text)', marginBottom: '16px', lineHeight: 1.1 }}>
            Simple, transparent pricing.<br />
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Zero surprises.</em>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text2)', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Start free. Upgrade when you're ready. Cancel anytime — no lock-ins.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: '10px 24px', borderRadius: '9px', border: 'none',
                  fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer',
                  background: billing === b ? 'var(--emerald)' : 'transparent',
                  color: billing === b ? '#031A13' : 'var(--text2)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEBI Risk Disclaimer — above pricing */}
      <section style={{ padding: '0 40px 16px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: '13px', color: 'var(--gold)', lineHeight: 1.6, margin: 0 }}>
            <strong>Risk Disclaimer:</strong> Investments in securities are subject to market risk. Research provided by Sahib Singh Hora, SEBI RA INH000026266. Past performance does not guarantee future returns. Please read all risk disclosures before investing.
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ padding: '0 40px 8px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text3)', letterSpacing: '0.5px' }}>
            Join traders already on the platform · SEBI RA INH000026266 · Cancel anytime
          </p>
        </div>
      </section>

      {/* Waitlist banner */}
      <section style={{ padding: '0 40px 40px' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            background: 'rgba(0,200,150,0.04)',
            border: '1px solid rgba(0,200,150,0.18)',
            borderRadius: '16px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase' }}>
              Payment Gateway Launching Soon
            </span>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '520px', lineHeight: 1.6 }}>
            Join the waitlist for early access and a launch discount when payments go live.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ padding: '0 40px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {plans.map((plan) => {
            const price = billing === 'yearly' ? plan.yearlyMonthly : plan.monthly
            return (
              <div
                key={plan.tier}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${plan.featured ? 'var(--emerald)' : plan.tier === 'elite' ? 'rgba(212,168,67,0.3)' : 'var(--border)'}`,
                  borderRadius: '24px',
                  padding: '32px 28px',
                  position: 'relative',
                  transform: plan.featured ? 'translateY(-8px)' : 'none',
                  boxShadow: plan.featured ? '0 0 0 1px rgba(0,200,150,0.1), 0 20px 60px rgba(0,200,150,0.08)' :
                    plan.tier === 'elite' ? '0 0 0 1px rgba(212,168,67,0.05)' : 'none',
                }}
              >
                {plan.featured && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--emerald)', color: '#031A13', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                {plan.tier === 'elite' && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#1A0F00', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={11} /> ELITE
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: plan.color, textTransform: 'uppercase' }}>
                    {plan.name}
                  </div>
                  {billing === 'yearly' && plan.discount > 0 && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                      background: plan.badgeColor === 'gold' ? 'rgba(212,168,67,0.12)' : plan.badgeColor === 'emerald' ? 'rgba(0,200,150,0.1)' : 'rgba(148,163,184,0.1)',
                      color: plan.badgeColor === 'gold' ? 'var(--gold)' : plan.badgeColor === 'emerald' ? 'var(--emerald)' : 'var(--text3)',
                      border: plan.badgeColor === 'gold' ? '1px solid rgba(212,168,67,0.25)' : plan.badgeColor === 'emerald' ? '1px solid rgba(0,200,150,0.2)' : '1px solid rgba(148,163,184,0.2)',
                    }}>
                      Save {plan.discount}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '44px', fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>
                    {price === 0 ? '₹0' : `₹${price.toLocaleString('en-IN')}`}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text3)' }}>/mo</span>
                </div>
                {billing === 'yearly' && plan.yearlyTotal > 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--emerald)', marginBottom: '4px' }}>
                    ₹{plan.yearlyTotal.toLocaleString('en-IN')} billed yearly
                  </p>
                )}
                <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                  {plan.tier === 'free' ? 'No card needed. Forever.' :
                    plan.tier === 'basic' ? 'For swing traders & beginners.' :
                    plan.tier === 'pro' ? 'For active traders. Best value.' :
                    'Full access. Serious capital.'}
                </p>

                <button
                  onClick={(e) => handlePlanClick(e, plan.tier)}
                  disabled={ctaLoading === plan.tier}
                  style={{
                    display: 'block', width: '100%', padding: '13px',
                    borderRadius: '12px', textAlign: 'center',
                    fontSize: '14px', fontWeight: 700, cursor: ctaLoading === plan.tier ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', outline: 'none',
                    opacity: ctaLoading === plan.tier ? 0.7 : 1,
                    background: plan.ctaStyle === 'primary' ? 'var(--emerald)' :
                      plan.ctaStyle === 'gold' ? 'rgba(212,168,67,0.1)' : 'transparent',
                    color: plan.ctaStyle === 'primary' ? '#031A13' :
                      plan.ctaStyle === 'gold' ? 'var(--gold)' : 'var(--text2)',
                    border: plan.ctaStyle === 'primary' ? 'none' :
                      plan.ctaStyle === 'gold' ? '1px solid rgba(212,168,67,0.3)' : '1px solid var(--border)',
                  }}
                >
                  {ctaLoading === plan.tier ? 'Starting…' : plan.cta}
                </button>
                {plan.tier !== 'free' && (
                  <p style={{ fontSize: '10px', color: 'var(--text4)', textAlign: 'center', marginTop: '8px', marginBottom: '16px' }}>
                    {hasSession ? 'Click to subscribe' : 'Register or sign in to subscribe'}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA error */}
      {ctaError && (
        <div style={{ maxWidth: '1100px', margin: '-16px auto 24px', padding: '0 40px' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(244,123,123,0.08)', border: '1px solid rgba(244,123,123,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--coral)', textAlign: 'center' }}>
            {ctaError}
          </div>
        </div>
      )}

      {/* Feature comparison table */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px', textAlign: 'center' }}>
            Full feature comparison
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text2)', textAlign: 'center', marginBottom: '40px' }}>
            Every feature, every tier — clearly laid out.
          </p>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', padding: '16px 24px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
              <div />
              {plans.map((p) => (
                <div key={p.tier} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: p.color, textTransform: 'uppercase' }}>{p.name}</p>
                </div>
              ))}
            </div>

            {FEATURES.map((cat, ci) => (
              <div key={ci}>
                <div style={{ padding: '12px 24px', background: 'rgba(0,200,150,0.03)', borderBottom: '1px solid var(--border)', borderTop: ci > 0 ? '1px solid var(--border)' : 'none' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: 'var(--emerald)', textTransform: 'uppercase' }}>{cat.category}</p>
                </div>
                {cat.items.map((item, ii) => (
                  <div
                    key={ii}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)',
                      padding: '12px 24px', borderBottom: '1px solid var(--border)',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ fontSize: '13px', color: 'var(--text2)' }}>{item.label}</p>
                    {(['free', 'basic', 'pro', 'elite'] as const).map((tier) => (
                      <div key={tier} style={{ display: 'flex', justifyContent: 'center' }}>
                        <FeatureCell val={(item as any)[tier]} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '32px', textAlign: 'center' }}>
            Common questions
          </h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your dashboard. No questions asked. You keep access until the end of your billing period.' },
            { q: 'Is the free plan really free?', a: 'Yes, forever. No credit card needed. You get signal previews, market news, and sample reports at no cost.' },
            { q: 'How are trade calls delivered?', a: 'Via your dashboard in real time. Pro and Elite subscribers also receive WhatsApp alerts for time-sensitive intraday calls.' },
            { q: 'Is Sahib SEBI registered?', a: 'Yes. Sahib Singh Hora is a SEBI Registered Research Analyst with registration number INH000026266. You can verify this on SEBI\'s official intermediary portal at sebi.gov.in.' },
            { q: 'Are investments guaranteed?', a: 'No. All investments in the securities market are subject to market risk. Past performance does not guarantee future returns. Please read all risk disclosures before investing.' },
          ].map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <section style={{ padding: '40px 40px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '12px' }}>
          Have questions before subscribing? Join the community.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://t.me/withsahib"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(0,136,204,0.08)', border: '1px solid rgba(0,136,204,0.2)', color: '#0088CC', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Join Telegram — @withsahib
          </a>
          <a
            href="https://wa.me/919981248888?text=Hi%20Sahib%2C%20I%20have%20a%20question%20about%20your%20plans."
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp Sahib
          </a>
        </div>
      </section>

      <div style={{ padding: '32px 40px 40px' }}>
        <div className="sebi-disclaimer container-tight" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          SEBI RA Registration: Sahib Singh Hora · INH000026266 · withSahib.com
        </div>
      </div>
      <BookingBanner />$1
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return submitted ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', fontSize: '14px', fontWeight: 500 }}>
      <Check size={16} color="var(--emerald)" />
      You&apos;re on the list! We&apos;ll notify you at launch.
    </div>
  ) : (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '11px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border2)',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontSize: '14px',
          fontFamily: 'Outfit, sans-serif',
          outline: 'none',
          width: '240px',
        }}
      />
      <button
        onClick={() => { if (email.includes('@')) setSubmitted(true) }}
        style={{
          padding: '11px 24px',
          borderRadius: '10px',
          border: 'none',
          background: 'var(--emerald)',
          color: '#031A13',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        Join Waitlist
      </button>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', gap: '12px', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>{q}</span>
        <span style={{ color: 'var(--emerald)', fontSize: '20px', flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, paddingBottom: '20px', animation: 'fadeIn 0.2s ease' }}>
          {a}
        </p>
      )}
    </div>
  )
}
