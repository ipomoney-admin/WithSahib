'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLANS = [
  {
    tier: 'basic',
    name: 'Basic',
    price: 999,
    sub: 'For swing traders & beginners.',
    color: 'var(--sapphire)',
    borderColor: 'rgba(37,99,235,0.3)',
    ctaStyle: 'ghost' as const,
    features: [
      { text: 'Daily swing trade research picks', ok: true },
      { text: 'Entry zone · 2 targets · Stop-loss defined', ok: true },
      { text: 'Written rationale on every pick', ok: true },
      { text: 'Sector & market context included', ok: true },
      { text: 'Weekly research digest', ok: true },
      { text: 'Access to research archive', ok: true },
    ],
    cta: 'Start Basic',
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 2499,
    sub: 'Per service — Intraday / Stock Options / Index Options.',
    color: 'var(--green)',
    borderColor: 'rgba(26,122,74,0.35)',
    ctaStyle: 'primary' as const,
    featured: true,
    features: [
      { text: 'Everything in Basic', ok: true },
      { text: 'Daily intraday research picks', ok: true },
      { text: 'Options strategy research (Nifty, BankNifty, Sensex)', ok: true },
      { text: 'Pre-market delivery before 9 AM via WhatsApp', ok: true },
      { text: '1 × 15-min strategy call/month with Sahib', ok: true },
      { text: 'Priority research alerts', ok: true },
    ],
    cta: 'Start Pro',
  },
  {
    tier: 'elite',
    name: 'Elite',
    price: 6999,
    sub: 'All services. Maximum access.',
    color: 'var(--gold)',
    borderColor: 'rgba(146,104,10,0.35)',
    ctaStyle: 'gold' as const,
    features: [
      { text: 'Everything in Pro (all services)', ok: true },
      { text: '1 × 15-min strategy call every week with Sahib', ok: true },
      { text: 'Bespoke HNI research coverage', ok: true },
      { text: 'FinNifty & MidcapNifty research', ok: true },
      { text: 'Direct WhatsApp access to analyst', ok: true },
      { text: 'All courses included', ok: true },
    ],
    cta: 'Go Elite',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [ctaLoading, setCtaLoading] = useState<string | null>(null)
  const [ctaError, setCtaError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [])

  async function handlePlanClick(tier: string) {
    setCtaError('')
    if (!hasSession) {
      router.push(`/auth/register?plan=${tier}`)
      return
    }
    setCtaLoading(tier)
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billing: 'monthly' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setCtaError(data.error ?? 'Could not start subscription. Please try again.')
        return
      }
      router.push(`/settings?subscription=${data.subscription_id}&plan=${tier}`)
    } catch {
      setCtaError('Network error. Please try again.')
    } finally {
      setCtaLoading(null)
    }
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '40px 40px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '16px' }}>Pricing</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px,5vw,56px)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}>
            Research that{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>pays for itself.</em>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text2)', marginBottom: '32px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            Choose your coverage. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Plan cards — immediately below hero */}
      <section style={{ padding: '24px 40px 48px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${plan.borderColor}`,
                borderRadius: '20px',
                padding: '32px 28px',
                position: 'relative',
                transform: plan.featured ? 'translateY(-6px)' : 'none',
                boxShadow: plan.featured ? '0 12px 48px rgba(26,122,74,0.08)' : 'none',
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--green)', color: '#fff',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                  padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body)',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: plan.color, textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-body)' }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text3)', fontFamily: 'var(--font-body)' }}>/mo</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                {plan.sub}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: f.ok ? 'var(--text2)' : 'var(--text4)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    <span style={{ flexShrink: 0, marginTop: '2px' }}>
                      {f.ok
                        ? <Check size={14} color="var(--green)" strokeWidth={2.5} />
                        : <X size={13} color="var(--text4)" strokeWidth={2} />
                      }
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan.tier)}
                disabled={ctaLoading === plan.tier}
                style={{
                  display: 'block', width: '100%', padding: '13px',
                  borderRadius: '12px', textAlign: 'center',
                  fontSize: '14px', fontWeight: 700,
                  cursor: ctaLoading === plan.tier ? 'not-allowed' : 'pointer',
                  opacity: ctaLoading === plan.tier ? 0.7 : 1,
                  transition: 'all 0.2s', outline: 'none',
                  fontFamily: 'var(--font-body)',
                  background: plan.ctaStyle === 'primary' ? 'var(--green)'
                    : plan.ctaStyle === 'gold' ? 'rgba(146,104,10,0.1)' : 'transparent',
                  color: plan.ctaStyle === 'primary' ? '#fff'
                    : plan.ctaStyle === 'gold' ? 'var(--gold)' : 'var(--text2)',
                  border: plan.ctaStyle === 'primary' ? 'none'
                    : plan.ctaStyle === 'gold' ? '1px solid rgba(146,104,10,0.3)' : '1px solid var(--border2)',
                }}
              >
                {ctaLoading === plan.tier ? 'Starting…' : plan.cta}
              </button>
              {plan.tier !== 'free' && (
                <p style={{ fontSize: '10px', color: 'var(--text4)', textAlign: 'center', marginTop: '8px', fontFamily: 'var(--font-body)' }}>
                  {hasSession ? 'Click to subscribe' : 'Register or sign in to subscribe'}
                </p>
              )}
            </div>
          ))}
        </div>

        {ctaError && (
          <div style={{ maxWidth: 1060, margin: '16px auto 0', padding: '12px 16px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--coral)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
            {ctaError}
          </div>
        )}
      </section>

      {/* Free tier notice */}
      <section style={{ padding: '0 40px 48px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Start free — no card needed</p>
              <p style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-body)' }}>Get signal previews, market ticker, and sample reports at no cost.</p>
            </div>
            <Link href="/auth/register" className="btn btn-ghost btn-md" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Risk disclaimer */}
      <section style={{ padding: '0 40px 48px' }}>
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
            { q: 'Is Pro per service or all services?', a: 'Pro is priced per service — ₹2,499/month for Intraday, or ₹2,499/month for Options. Elite at ₹6,999/month gives you access to all services.' },
            { q: 'How are research picks delivered?', a: 'Via your dashboard in real time. Pro and Elite subscribers also get WhatsApp delivery before 9 AM for intraday calls.' },
            { q: 'Is Sahib SEBI registered?', a: 'Yes. Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266). Verify on SEBI\'s official portal at sebi.gov.in.' },
            { q: 'Are returns guaranteed?', a: 'No. All investments in securities are subject to market risk. Past performance does not guarantee future returns.' },
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
