'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Check, X, HelpCircle, Crown, Zap, Shield, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
  { category: 'Advisory Services', items: [
    { label: 'Signal previews', free: true, basic: true, pro: true, elite: true },
    { label: 'Weekly market outlook', free: false, basic: true, pro: true, elite: true },
    { label: 'Swing picks (5/week)', free: false, basic: true, pro: true, elite: true },
    { label: 'Model portfolio', free: false, basic: true, pro: true, elite: true },
    { label: 'Daily intraday calls', free: false, basic: false, pro: true, elite: true },
    { label: 'Stock options picks', free: false, basic: false, pro: true, elite: true },
    { label: 'Index options picks', free: false, basic: false, pro: true, elite: true },
  ]},
  { category: 'Research & AI', items: [
    { label: 'Sample research reports', free: true, basic: false, pro: false, elite: false },
    { label: 'Company news feed', free: false, basic: true, pro: true, elite: true },
    { label: 'AI research reports', free: false, basic: false, pro: true, elite: true },
    { label: 'DCF model reports', free: false, basic: false, pro: true, elite: true },
    { label: 'HNI deep-dive reports', free: false, basic: false, pro: false, elite: true },
  ]},
  { category: 'Appointments & Courses', items: [
    { label: '1-on-1 appointment', free: false, basic: false, pro: '1/month', elite: 'Unlimited' },
    { label: 'All courses included', free: false, basic: false, pro: false, elite: true },
    { label: 'Courses at discount', free: false, basic: '20%', pro: '30%', elite: 'Free' },
  ]},
  { category: 'Support & Access', items: [
    { label: 'Standard support', free: true, basic: true, pro: true, elite: true },
    { label: 'Priority WhatsApp alerts', free: false, basic: false, pro: false, elite: true },
    { label: 'Direct analyst access', free: false, basic: false, pro: false, elite: true },
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

  // Basic: 8% off, Pro: 12% off, Elite: 15% off
  const plans = [
    { tier: 'free',  name: 'Free',  monthly: 0,    yearlyMonthly: 0,    yearlyTotal: 0,     discount: 0,  color: 'var(--text3)',    cta: 'Start Free',  ctaStyle: 'ghost',   badgeColor: 'grey'    },
    { tier: 'basic', name: 'Basic', monthly: 999,  yearlyMonthly: 919,  yearlyTotal: 11029, discount: 8,  color: 'var(--sapphire)', cta: 'Start Basic', ctaStyle: 'ghost',   badgeColor: 'grey'    },
    { tier: 'pro',   name: 'Pro',   monthly: 2499, yearlyMonthly: 2199, yearlyTotal: 26390, discount: 12, color: 'var(--emerald)',  cta: 'Start Pro',   ctaStyle: 'primary', featured: true, badgeColor: 'emerald' },
    { tier: 'elite', name: 'Elite', monthly: 5999, yearlyMonthly: 5099, yearlyTotal: 61190, discount: 15, color: 'var(--gold)',     cta: 'Go Elite',    ctaStyle: 'gold',    badgeColor: 'gold'    },
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
            { q: 'Is Sahib SEBI registered?', a: 'Yes. Sahib Singh Hora is a SEBI Registered Research Analyst with registration number INH000026266, valid from April 2026 to April 2031. You can verify this on SEBI\'s official intermediary portal.' },
            { q: 'Are investments guaranteed?', a: 'No. All investments in the securities market are subject to market risk. Past performance does not guarantee future returns. Please read all risk disclosures before investing.' },
          ].map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-tight" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing.
          SEBI RA Registration: Sahib Singh Hora · INH000026266 · withSahib.com
        </div>
      </div>

      <Footer />
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
