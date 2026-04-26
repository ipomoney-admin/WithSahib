import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Courses — Live 1-on-1 Trading Education | withSahib SEBI RA',
  description:
    'Live, personalised 1-on-1 sessions with SEBI RA Sahib Singh Hora (INH000026266). Foundation, Options & Derivatives, and Complete Research Methodology courses. 3-month handholding included.',
  alternates: { canonical: 'https://www.withsahib.com/courses' },
  openGraph: {
    title: 'Courses — Live 1-on-1 Sessions | withSahib SEBI RA',
    description: 'Not pre-recorded. Not YouTube. Live 1-on-1 sessions built around your portfolio — by SEBI RA Sahib Singh Hora.',
    url: 'https://www.withsahib.com/courses',
  },
}

const COURSES = [
  {
    label: 'Course 01',
    title: 'Foundation: Reading Markets',
    price: '₹7,999',
    desc: 'Chart structure, price action, volume analysis, and how to identify high-probability setups. Built from scratch — no prior knowledge needed.',
    includes: [
      '3-month handholding',
      'Live 1-on-1 sessions',
      'Personalised feedback on your charts',
    ],
    color: 'var(--green)',
    borderColor: 'rgba(26,122,74,0.25)',
  },
  {
    label: 'Course 02',
    title: 'Advanced: Options & Derivatives',
    price: '₹9,999',
    desc: 'Open interest, PCR, IV rank, options strategies. Learn to trade expiry week setups, build structured positions, and manage risk in F&O.',
    includes: [
      '3-month handholding',
      'Live 1-on-1 sessions',
      'Trade review sessions',
    ],
    color: '#2563EB',
    borderColor: 'rgba(37,99,235,0.25)',
  },
  {
    label: 'Course 03',
    title: 'Pro: Complete Research Methodology',
    price: '₹12,999',
    desc: 'The full withSahib research framework — from pre-market scan to published report. Learn exactly how every call is built, filtered, and risk-calibrated.',
    includes: [
      '3-month handholding',
      'Live 1-on-1 sessions',
      'Access to all research during course',
    ],
    color: 'var(--gold)',
    borderColor: 'rgba(146,104,10,0.25)',
  },
]

const TIMELINE = [
  { week: 'Week 1–2', label: 'Foundation concepts', desc: 'Core theory, frameworks, and vocabulary. Establishing the mental model before applying it.' },
  { week: 'Week 3–6', label: 'Applied practice', desc: 'Real charts, real setups. Working through live and historical examples with Sahib.' },
  { week: 'Week 7–10', label: 'Live market sessions', desc: 'Trading alongside the research process in real-time. Your decisions, your reasoning.' },
  { week: 'Week 11–12', label: 'Independent review + handholding', desc: 'You run the process. Sahib reviews and refines. Building confidence through repetition.' },
]

export default function CoursesPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>Courses</div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px,5vw,56px)',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Learn to read{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>the market.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36, fontFamily: 'var(--font-body)' }}>
            Live, personalised, one-on-one sessions with a SEBI Registered Analyst. Not pre-recorded. Not YouTube. Built around your portfolio.
          </p>
          <Link href="/appointments" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Book a Session →
          </Link>
        </div>
      </section>

      {/* Course Cards */}
      <section style={{ padding: '0 40px 64px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {COURSES.map((course) => (
            <div
              key={course.label}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${course.borderColor}`,
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: course.color, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-body)' }}>
                {course.label}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
                {course.title}
              </h3>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {course.price}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                One-time · 3-month handholding
              </p>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20, fontFamily: 'var(--font-body)', flex: 1 }}>
                {course.desc}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {course.includes.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: course.color, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/appointments"
                style={{
                  display: 'block', textAlign: 'center', padding: '12px',
                  borderRadius: 12, fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'var(--font-body)',
                  background: 'transparent', color: 'var(--text2)',
                  border: '1px solid var(--border2)', transition: 'all 0.2s',
                }}
              >
                Book a Session →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why 1-on-1 */}
      <section style={{ padding: '64px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>Why 1-on-1?</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>
            Teaching is most effective when it&apos;s personal.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 40, maxWidth: 640, fontFamily: 'var(--font-body)' }}>
            Most courses teach theory. These sessions are built around your actual trades, your actual questions, your actual portfolio. Every session is different because every trader is different.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { title: 'Personalised to your level', desc: 'Whether you\'re a beginner or an experienced trader, the curriculum adapts to where you actually are.' },
              { title: 'Focused on your active trades', desc: 'Bring your live watchlist, your recent trades, your confusions. We work with real examples, not textbook setups.' },
              { title: 'Direct access to a SEBI RA', desc: 'Every session is with Sahib Singh Hora — a SEBI Registered Research Analyst, not an assistant or junior trainer.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', marginBottom: 14 }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning timeline */}
      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>Learning Timeline</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: 'var(--text)', marginBottom: 40, lineHeight: 1.2 }}>
            Twelve weeks. Structured progress.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                    {i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 8 }} />
                  )}
                </div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-body)' }}>
                    {step.week}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                    {step.label}
                  </h4>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section style={{ padding: '0 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px' }}>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 8, fontFamily: 'var(--font-body)' }}>
            <strong style={{ color: 'var(--text)' }}>Already on the Elite plan?</strong> Courses are included.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            On an annual plan? Ask about course discounts —{' '}
            <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', textDecoration: 'none' }}>connect@withsahib.com</a>
          </p>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
