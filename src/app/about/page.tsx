'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Pre-Market Scan',
    desc: 'Every research day begins before the market opens. 1,500+ Nifty 500 equities are systematically screened for overnight developments, global market cues, FII/DII data, and gap analysis before the Indian session opens.',
    stat: '1,500+ equities screened every morning',
  },
  {
    num: '02',
    title: 'Technical Filter',
    desc: 'Chart structure is evaluated across daily, weekly, and intraday timeframes. Volume profile, momentum indicators, and multi-timeframe alignment must converge before an equity qualifies for the next stage.',
    stat: 'Daily + weekly alignment required to advance',
  },
  {
    num: '03',
    title: 'Fundamental Overlay',
    desc: 'Technical analysis is validated against sector strength, FII/DII flow data, and macro context. A technically strong equity in a fundamentally weak sector carries higher risk — this layer filters it out.',
    stat: 'Sector strength + FII flow checked on every recommendation',
  },
  {
    num: '04',
    title: 'Risk Calibration',
    desc: 'Before entry is defined, the stop-loss and invalidation criteria are established. A minimum risk-to-reward ratio of 1:2 is required. No research note is published without a defined maximum loss.',
    stat: 'Minimum R:R of 1:2 required before publication',
  },
  {
    num: '05',
    title: 'Report Drafted',
    desc: 'Every qualifying equity is documented: entry range, up to two price targets, stop-loss level, and a full written rationale explaining the pattern, catalyst, and timing. Written reasoning is mandatory — not optional.',
    stat: 'Written rationale required on every research note',
  },
  {
    num: '06',
    title: 'Published',
    desc: 'Research notes are published on the platform and distributed to subscribers before market open. Pro and Elite subscribers also receive WhatsApp alerts for time-sensitive intraday recommendations.',
    stat: 'Published before market open every trading day',
  },
]

function CountUp({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || started.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || started.current) return
      started.current = true
      const start = performance.now()
      function frame(now: number) {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function AboutPage() {
  const { t } = useLanguage()
  return (
    <div style={{ background: 'var(--bg)' }}>
      <style>{`
        .about-hero { background: #F5F3EE; }
        .dark .about-hero { background: #0A0A0A; }
        .about-hero-name { color: #0A0A0A; }
        .dark .about-hero-name { color: #FFFFFF; }
        .about-hero-p1 { color: rgba(0,0,0,0.8); }
        .dark .about-hero-p1 { color: rgba(255,255,255,0.8); }
        .about-hero-p2 { color: rgba(0,0,0,0.55); }
        .dark .about-hero-p2 { color: rgba(255,255,255,0.6); }
        .about-hero-stat-grid { background: rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.08); }
        .dark .about-hero-stat-grid { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.07); }
        .about-hero-stat-cell { background: rgba(0,0,0,0.03); }
        .dark .about-hero-stat-cell { background: rgba(255,255,255,0.02); }
        .about-hero-stat-label { color: rgba(0,0,0,0.4); }
        .dark .about-hero-stat-label { color: rgba(255,255,255,0.35); }
        .about-hero-social { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); color: rgba(0,0,0,0.5); }
        .dark .about-hero-social { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }
        .about-sebi-badge { background: rgba(212,168,67,0.12); color: #7A5900; border-color: rgba(212,168,67,0.3); }
        .dark .about-sebi-badge { background: rgba(212,168,67,0.15); color: #D4A843; border-color: rgba(212,168,67,0.25); }
      `}</style>
      <Navbar />

      {/* ── HERO: PHOTO FIRST ──────────────────────────────────── */}
      <section
        className="about-hero"
        style={{
          padding: '80px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 800px 500px at 70% 50%, rgba(255,107,0,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 600px 400px at 20% 80%, rgba(26,122,74,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '500px 1fr',
              gap: '64px',
              alignItems: 'center',
            }}
            className="resp-2col"
          >
            {/* Photo */}
            <div>
              <div style={{
                position: 'relative', width: '100%', minHeight: '600px',
                borderRadius: '12px', overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
              }}>
                <Image
                  src="/images/sahib-primary.jpg"
                  alt="Sahib Singh Hora — SEBI Registered Research Analyst"
                  fill
                  sizes="500px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                {[
                  { href: 'https://www.linkedin.com/in/sahibsinghhora/', icon: <Linkedin size={16} />, label: 'LinkedIn', handle: 'Sahib Singh Hora' },
                  { href: 'https://x.com/WithSahib_', icon: <Twitter size={16} />, label: 'Twitter/X', handle: '@withsahib_' },
                  { href: 'https://www.instagram.com/withsahib_/', icon: <Instagram size={16} />, label: 'Instagram', handle: '@withsahib_' },
                  { href: 'https://www.facebook.com/sahib1313', icon: <Facebook size={16} />, label: 'Facebook', handle: 'sahib1313' },
                ].map(({ href, icon, label, handle }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="about-hero-social"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px',
                      border: '1px solid',
                      borderRadius: '8px', textDecoration: 'none',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)', fontWeight: 500,
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.color = '#FF6B00'
                      el.style.borderColor = 'rgba(255,107,0,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.removeAttribute('style')
                    }}
                  >
                    {icon}
                    <span>{handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
                borderRadius: '20px', padding: '6px 16px', fontSize: '11px',
                fontWeight: 600, color: '#FF6B00', letterSpacing: '1.5px',
                marginBottom: '24px', fontFamily: 'var(--font-body)', textTransform: 'uppercase',
              }}>
                {t('about.eyebrow')}
              </div>

              <h1
                className="about-hero-name"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(36px, 4.5vw, 60px)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  marginBottom: '12px',
                }}
              >
                Sahib Singh Hora
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                <span className="about-sebi-badge" style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '4px', border: '1px solid',
                }}>
                  INH000026266
                </span>
                <span className="about-hero-p2" style={{ fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                  {t('about.sebi_title')}
                </span>
              </div>

              <p className="about-hero-p1" style={{ fontSize: '16px', lineHeight: 1.85, marginBottom: '18px', fontFamily: 'var(--font-body)' }}>
                {t('about.bio')}
              </p>
              <p className="about-hero-p2" style={{ fontSize: '16px', lineHeight: 1.85, marginBottom: '18px', fontFamily: 'var(--font-body)' }}>
                I became a SEBI Registered Research Analyst under INH000026266 to build something structurally different: a research house where every recommendation carries a name, a registration number, and a regulatory consequence. Not a channel. A firm.
              </p>
              <p className="about-hero-p2" style={{ fontSize: '16px', lineHeight: 1.85, fontFamily: 'var(--font-body)' }}>
                My market philosophy is simple: process over instinct. A systematic, repeatable methodology — multi-timeframe technical analysis, fundamental validation, defined risk-to-reward — applied consistently every single trading day for 14+ years.
              </p>

              <div className="about-hero-stat-grid" style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                borderRadius: '12px',
                overflow: 'hidden', marginTop: '36px',
              }}>
                {[
                  { num: 1500, suffix: '+', label: 'Equities Screened Daily' },
                  { num: 6, suffix: ' Layers', label: 'Before Any Recommendation' },
                  { num: 14, suffix: '+ Yrs', label: 'Market Experience' },
                ].map((s, i) => (
                  <div key={i} className="about-hero-stat-cell" style={{ padding: '20px 18px' }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                      fontSize: '28px', fontWeight: 700, color: '#FF6B00', lineHeight: 1,
                      marginBottom: '6px',
                    }}>
                      <CountUp target={s.num} suffix={s.suffix} />
                    </div>
                    <div className="about-hero-stat-label" style={{ fontSize: '11px', letterSpacing: '0.5px', fontFamily: 'var(--font-body)' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINDING SETUPS ─────────────────────────────────────── */}
      <section style={{ padding: '96px 40px', background: 'var(--bg)', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 600, letterSpacing: '2px',
              color: 'var(--text3)', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', marginBottom: '16px',
            }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--orange)', display: 'inline-block' }} />
              Finding Setups
              <span style={{ width: '24px', height: '1px', background: 'var(--orange)', display: 'inline-block' }} />
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 700, color: 'var(--text)', lineHeight: 1.15,
            }}>
              Six steps from{' '}
              <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>scan to signal.</em>
            </h2>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '36px', top: '48px', bottom: '48px',
              width: '2px', background: 'linear-gradient(to bottom, var(--green) 0%, var(--orange) 100%)',
              opacity: 0.25,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr',
                    gap: '32px',
                    alignItems: 'start',
                    paddingBottom: i < PROCESS_STEPS.length - 1 ? '48px' : '0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: i === 5 ? 'var(--orange)' : 'var(--surface)',
                      border: `2px solid ${i === 5 ? 'var(--orange)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700,
                      color: i === 5 ? '#FFFFFF' : 'var(--text3)',
                      flexShrink: 0, zIndex: 1, position: 'relative',
                    }}>
                      {step.num}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-lg)',
                      padding: '28px 32px',
                    }}
                  >
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '22px',
                      fontWeight: 700, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.2,
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '15px', color: 'var(--text2)', lineHeight: 1.8,
                      fontFamily: 'var(--font-body)', marginBottom: '16px',
                    }}>
                      {step.desc}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '6px 14px',
                      background: 'rgba(255,107,0,0.06)',
                      border: '1px solid rgba(255,107,0,0.14)',
                      borderRadius: '20px',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--orange)', fontFamily: 'var(--font-body)' }}>
                        {step.stat}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS ───────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '11px', fontWeight: 600, letterSpacing: '2px',
              color: 'var(--text3)', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)', marginBottom: '16px',
            }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'inline-block' }} />
              Credentials
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px,3.5vw,40px)',
              fontWeight: 700, color: 'var(--text)', lineHeight: 1.15,
            }}>
              Regulated, verified,{' '}
              <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>accountable.</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { label: 'SEBI Registration', value: 'INH000026266', mono: true },
              { label: 'Certification', value: 'NISM Certified', mono: false },
              { label: 'Specialisation', value: 'Technical Analysis', mono: false },
              { label: 'Experience', value: '14+ Years', mono: false },
              { label: 'Regulator', value: 'SEBI, Govt. of India', mono: false },
              { label: 'Category', value: 'Individual RA', mono: false },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '20px',
                }}
              >
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: item.mono ? '13px' : '15px', fontWeight: 600, color: 'var(--text)',
                  fontFamily: item.mono ? 'var(--font-mono)' : 'var(--font-body)',
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKET PHILOSOPHY ─────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--black)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)',
              fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2,
            }}>
              Market{' '}
              <em style={{ color: '#FF6B00', fontStyle: 'italic', fontWeight: 400 }}>philosophy.</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Process over instinct', desc: 'Markets reward consistency. A documented, repeatable methodology outperforms gut feel over any meaningful time horizon.' },
              { title: 'Risk first, always', desc: 'The stop-loss is not an afterthought. It is defined before the entry. Every recommendation begins with: what is my maximum loss?' },
              { title: 'Accountability by design', desc: 'Every recommendation is logged. Every outcome is recorded. A research house that hides its losses is not a research house.' },
              { title: 'Transparency is compliance', desc: 'Under SEBI RA regulations, full disclosure is required. I treat it as a feature, not a burden — it is the foundation of trust.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)', padding: '28px',
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                  fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                  marginBottom: '10px',
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '14px', color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.75, fontFamily: 'var(--font-body)',
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,4vw,44px)',
            fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: '20px',
          }}>
            Work with a{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>SEBI-registered analyst.</em>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '36px', fontFamily: 'var(--font-body)' }}>
            Book a 1-on-1 session or start a subscription. Every recommendation carries a name, a registration number, and regulatory accountability.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button href="/appointments" variant="primary" size="lg">
              Book a Session →
            </Button>
            <a
              href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '14px 26px', border: '1px solid var(--border2)',
                color: 'var(--text2)', borderRadius: '10px', fontSize: '14px',
                fontWeight: 500, textDecoration: 'none', fontFamily: 'var(--font-body)',
              }}
            >
              Verify on SEBI.gov.in →
            </a>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────── */}
      <div style={{ padding: '0 40px 40px', background: 'var(--bg)' }}>
        <div className="sebi-disclaimer container-narrow" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. SEBI registration does not guarantee returns.
          Sahib Singh Hora · SEBI RA · INH000026266 · withSahib.com
        </div>
      </div>

      <BookingBanner />
      <Footer />
    </div>
  )
}
