'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── COUNT-UP ─────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = '', prefix = '', duration = 1600 }: {
  to: number; suffix?: string; prefix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el || fired.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting || fired.current) return
      fired.current = true
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(eased * to))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FILTERS = [
  {
    id: 'F01',
    label: 'FILTER 01',
    context: 'Pre-Market',
    title: 'Global & Macro Scan',
    body: 'SGX Nifty futures, dollar index, crude oil, US 10Y yields, and overnight FII flow data are evaluated before the domestic session opens. Any macro condition that creates asymmetric systemic risk removes the entire session from active trading.',
    tags: ['SGX Nifty', 'FII Flow', 'Crude Oil', 'DXY'],
    outcome: '~200 stocks eliminated',
    outcomeOrange: false,
  },
  {
    id: 'F02',
    label: 'FILTER 02',
    context: 'Chart Analysis',
    title: 'Technical Structure Validation',
    body: 'Multi-timeframe analysis: weekly → daily → hourly. Chart structure must demonstrate accumulation or a clean breakout with volume confirmation. Wyckoff phase identification on higher timeframe. Dow Theory trend alignment required.',
    tags: ['Wyckoff Method', 'Dow Theory', 'Multi-TF', 'Volume Profile'],
    outcome: '~900 stocks eliminated',
    outcomeOrange: false,
  },
  {
    id: 'F03',
    label: 'FILTER 03',
    context: 'Derivatives Layer',
    title: 'Derivatives & Institutional Flow',
    body: 'Open Interest analysis, Put-Call Ratio, IV rank, and FII/DII derivatives positioning. A technically perfect setup with institutions positioned on the opposite side does not get published. The derivatives market tells a story charts alone cannot.',
    tags: ['Open Interest', 'PCR', 'IV Rank', 'Block Deals'],
    outcome: '~200 stocks eliminated',
    outcomeOrange: false,
  },
  {
    id: 'F04',
    label: 'FILTER 04',
    context: 'Risk Gate',
    title: 'Risk Calibration',
    body: 'Stop-loss is defined before entry is considered. Minimum risk-to-reward of 1:2 required. If the structure does not allow a clean stop-loss at a logical level, the setup is discarded — regardless of how attractive the entry looks.',
    tags: ['R:R minimum 1:2', 'SL at structure', 'Checklist Method'],
    outcome: 'Most setups end here',
    outcomeOrange: true,
  },
  {
    id: 'F05',
    label: 'FILTER 05',
    context: 'Conviction Test',
    title: 'Red Team Review',
    body: 'Every setup that survives filters 1–4 is argued against. The question shifts from "why should I take this?" to "why should I not?" If a compelling counter-argument exists that cannot be dismissed, the setup is discarded.',
    tags: ['Red Team Method', 'Inversion (Munger)', "Devil's Advocate"],
    outcome: 'Final culling',
    outcomeOrange: false,
  },
]

const FRAMEWORKS = [
  { name: 'Wyckoff Method', origin: 'Richard Wyckoff · 1930s', desc: 'Accumulation and distribution phase identification using price-volume relationships. Applied in Filter 02 for structure validation.', filter: 'Filter 02' },
  { name: 'Dow Theory', origin: 'Charles Dow · 1900s', desc: 'Trend confirmation across multiple indices and timeframes. A setup must align with the prevailing Dow Theory trend to pass Filter 02.', filter: 'Filter 02' },
  { name: 'Inversion Method', origin: 'Charlie Munger', desc: '"Invert, always invert." Instead of asking what makes a recommendation strong, ask what makes it wrong. The foundation of Filter 05 red team review.', filter: 'Filter 05' },
  { name: 'Checklist Method', origin: 'Mohnish Pabrai', desc: 'Every filter in the methodology is a checklist item. No discretion, no exception. A single failure = discard. Applied across all 5 filters.', filter: 'All Filters' },
  { name: 'Darvas Box', origin: 'Nicolas Darvas · 1950s', desc: 'Breakout identification using consolidation boxes. Stocks forming Darvas Box structures with volume confirmation score higher in Filter 02.', filter: 'Filter 02' },
  { name: 'Bamboo Method', origin: 'Japanese philosophy', desc: 'Long base, explosive growth. Setups showing extended base formation before breakout are prioritised — a setup in a hurry is usually wrong.', filter: 'Filter 02' },
]

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function MethodologyPage() {
  const { t } = useLanguage()
  return (
    <div style={{ background: 'var(--bg)' }}>
      <style>{`
        @keyframes dotScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4); }
        }
        @keyframes dotRing {
          0% { box-shadow: 0 0 0 0 rgba(255,107,0,0.45); }
          70% { box-shadow: 0 0 0 8px rgba(255,107,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,107,0,0); }
        }
        .method-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 0.2s, background 0.2s;
        }
        .method-card:hover {
          background: var(--bg2);
          border-color: rgba(255,107,0,0.45);
        }
        .dark-section { background: #0A0A0A; }
        .dark .dark-section { background: #050505; }
        html:not(.dark) .methodology-dark { background: #0A0A0A !important; color: #FAFAF7; }
        html.dark .methodology-dark { background: #050505 !important; color: #FAFAF7; }
      `}</style>

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 40px 80px', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 900px 500px at 60% 30%, rgba(255,107,0,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ width: '32px', height: '2px', background: 'var(--orange)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px',
              color: 'var(--orange)', textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              {t('methodology.eyebrow')}
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(52px, 7vw, 88px)',
            fontWeight: 700, lineHeight: 1.0,
            color: '#FAFAF7', marginBottom: '28px',
          }}>
            {t('methodology.headline1')}<br />
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>{t('methodology.headline2')}</em>
          </h1>

          {/* Lead */}
          <p style={{
            fontSize: '18px', color: '#8A8A8E', lineHeight: 1.8,
            maxWidth: '640px', fontFamily: 'Inter, system-ui, sans-serif',
            marginBottom: '64px',
          }}>
            {t('methodology.lead')}
          </p>

          {/* Stat counters */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px', background: '#1C1C1E',
            border: '1px solid #1C1C1E', borderRadius: '16px', overflow: 'hidden',
          }}>
            {[
              { display: null, to: 1500, suffix: '+', label: 'Instruments Screened Daily' },
              { display: '0.3%', label: 'Of Setups Published' },
              { display: t('methodology.stat1_val'), label: t('methodology.stat1_label'), small: true },
              { display: t('methodology.stat2_val'), label: t('methodology.stat2_label'), small: true },
            ].map((s, i) => (
              <div key={i} style={{ padding: '32px 28px', background: '#0D0D0D' }}>
                <div style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontStyle: 'italic', fontSize: s.small ? '28px' : '44px', fontWeight: 700,
                  color: 'var(--orange)', lineHeight: 1, marginBottom: '10px',
                }}>
                  {s.display ?? <CountUp to={s.to!} suffix={s.suffix!} />}
                </div>
                <div style={{ fontSize: '12px', color: '#6E6E73', letterSpacing: '0.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPLE BAR ─────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'stretch',
          minWidth: 'max-content',
          margin: '0 auto', maxWidth: '1200px',
        }}>
          {[
            { n: '01', text: 'Checklist over conviction' },
            { n: '02', text: 'Risk before reward' },
            { n: '03', text: 'Structure over noise' },
            { n: '04', text: 'No quota — no deadline' },
            { n: '05', text: 'Written rationale, always' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={{ width: '1px', height: '40px', background: 'var(--border2)', margin: '0 24px', flexShrink: 0 }} />}
              <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--orange)', fontFamily: '"Courier New", monospace', letterSpacing: '0.5px' }}>
                  {p.n}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 }}>
                  {p.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROCESS / TIMELINE ────────────────────────────────────────── */}
      <section style={{ padding: '96px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ width: '32px', height: '2px', background: 'var(--orange)', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: 'var(--orange)', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
                The Process
              </span>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1, marginBottom: '16px' }}>
              {t('methodology.process_title')}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text3)', lineHeight: 1.75, fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '520px' }}>
              {t('methodology.process_sub')}
            </p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: '19px', top: '20px', bottom: '20px',
              width: '2px', background: 'var(--border2)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {FILTERS.map((f, i) => {
                const filterKey = `methodology.filter${i + 1}` as const
                return (
                <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '28px', paddingBottom: '48px' }}>
                  {/* Dot */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: 'var(--surface2)',
                      border: '2px solid var(--border2)',
                      flexShrink: 0, zIndex: 1, position: 'relative',
                      animation: `dotScale 2.5s ease-in-out ${i * 0.4}s infinite`,
                    }} />
                  </div>

                  {/* Card */}
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '28px 32px',
                  }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}>
                        {f.label}
                      </span>
                      <span style={{ width: '1px', height: '12px', background: 'var(--border2)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500, letterSpacing: '0.5px' }}>
                        {f.context}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {t(filterKey)}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {f.body}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                      {f.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 10px', background: 'var(--bg2)',
                          border: '1px solid var(--border2)', borderRadius: '20px',
                          fontSize: '11px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif',
                          fontWeight: 500,
                        }}>{tag}</span>
                      ))}
                    </div>

                    {/* Outcome */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.outcomeOrange ? 'var(--orange)' : 'var(--border2)', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: f.outcomeOrange ? 'var(--orange)' : 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.3px' }}>
                        {f.outcome}
                      </span>
                    </div>
                  </div>
                </div>
                )
              })}

              {/* PUBLISHED step */}
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '28px' }}>
                {/* Orange dot with ring pulse */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: 'var(--orange)',
                    flexShrink: 0, zIndex: 1, position: 'relative',
                    animation: `dotScale 2.5s ease-in-out 2.0s infinite, dotRing 2.5s ease-out 2.0s infinite`,
                  }} />
                </div>

                {/* Published card — orange accent */}
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(255,107,0,0.35)',
                  borderTop: '2px solid var(--orange)',
                  borderRadius: '16px', padding: '28px 32px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}>
                      PUBLISHED
                    </span>
                    <span style={{ width: '1px', height: '12px', background: 'var(--border2)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500 }}>
                      Report Delivered
                    </span>
                  </div>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
                    Research Report Delivered
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Every surviving setup becomes a written research report: entry range, targets, stop-loss, risk-to-reward, and full written rationale. Published to the platform before market open. Pro and Elite subscribers receive WhatsApp alerts.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <div style={{ padding: '6px 14px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: '20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange)', fontFamily: 'Inter, system-ui, sans-serif' }}>1–3 reports / day</span>
                    </div>
                    <div style={{ padding: '6px 14px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: '20px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif' }}>Named · Timestamped · Logged</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FRAMEWORKS ────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ width: '32px', height: '2px', background: 'var(--orange)', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: 'var(--orange)', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Named Frameworks
              </span>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15 }}>
              {t('methodology.frameworks_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {FRAMEWORKS.map((fw, i) => (
              <div key={i} className="method-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                      {fw.name}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'Inter, system-ui, sans-serif' }}>{fw.origin}</p>
                  </div>
                  <span style={{ padding: '3px 10px', background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: 'var(--orange)', fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {fw.filter}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.75, fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {fw.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ────────────────────────────────────────────────── */}
      <section className="dark-section methodology-dark" style={{ padding: '96px 40px', borderTop: '1px solid #1C1C1E' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#FAFAF7', lineHeight: 1.2 }}>
              {t('methodology.philosophy_title')}
            </h2>
          </div>

          {/* Pull quote */}
          <div style={{
            borderLeft: '3px solid #92680A',
            paddingLeft: '32px', marginBottom: '56px',
          }}>
            <p style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic', fontSize: 'clamp(18px,2.5vw,26px)',
              color: '#D4A843', lineHeight: 1.7, marginBottom: '20px',
            }}>
              &ldquo;{t('methodology.quote')}&rdquo;
            </p>
            <p style={{ fontSize: '13px', color: '#6E6E73', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.3px' }}>
              — Sahib Singh Hora, SEBI RA INH000026266
            </p>
          </div>

          {/* Two cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="resp-2col">
            <div style={{ background: '#0D0D0D', border: '1px solid #1C1C1E', borderRadius: '16px', padding: '32px' }}>
              <h4 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#FAFAF7', marginBottom: '12px' }}>
                What this means for you
              </h4>
              <p style={{ fontSize: '14px', color: '#8A8A8E', lineHeight: 1.8, fontFamily: 'Inter, system-ui, sans-serif' }}>
                Every report you receive has survived a six-stage elimination process. The analysis is not a directional bet dressed up with rationale — it is a surviving setup in an adversarial process designed to eliminate anything that isn&apos;t exceptional.
              </p>
            </div>
            <div style={{ background: '#0D0D0D', border: '1px solid #1C1C1E', borderRadius: '16px', padding: '32px' }}>
              <h4 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#FAFAF7', marginBottom: '12px' }}>
                Why some days have zero reports
              </h4>
              <p style={{ fontSize: '14px', color: '#8A8A8E', lineHeight: 1.8, fontFamily: 'Inter, system-ui, sans-serif' }}>
                There is no quota. No daily minimum. If no setup survives all six filters on a given day, nothing is published. A forced call is worse than no call. The market will offer better opportunities tomorrow.
              </p>
            </div>
          </div>

          {/* SEBI badge + CTA */}
          <div style={{ marginTop: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', paddingTop: '40px', borderTop: '1px solid #1C1C1E' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#6E6E73', letterSpacing: '1px', fontFamily: '"Courier New", monospace', marginBottom: '4px' }}>
                SEBI RA · INH000026266
              </p>
              <p style={{ fontSize: '13px', color: '#FAFAF7', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Sahib Singh Hora · Research Analyst
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button href="/auth/register" variant="primary" size="md">
                Start Free →
              </Button>
              <Button href="/appointments" variant="ghost" size="md">
                Book a Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
