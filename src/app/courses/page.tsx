import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Trading Courses — Technical Analysis, Options & Systems',
  description:
    'Self-paced courses by Sahib Singh Hora, SEBI RA INH000026266. Learn technical analysis, options trading, and how to build a systematic trading process. Join the waitlist.',
  alternates: { canonical: 'https://www.withsahib.com/courses' },
  openGraph: {
    title: 'Trading Courses — withSahib SEBI RA',
    description: 'Self-paced trading courses by SEBI Registered Research Analyst Sahib Singh Hora. Technical Analysis, Options Theory, Trading Systems.',
    url: 'https://www.withsahib.com/courses',
  },
}

const COURSES = [
  {
    label: 'Course 01',
    title: 'Technical Analysis Masterclass',
    desc: 'From candlestick patterns and support/resistance to multi-timeframe analysis and volume interpretation. The complete toolkit for reading NSE charts.',
    modules: ['Candlestick patterns & psychology', 'Support, resistance & trendlines', 'Moving averages & momentum indicators', 'Volume analysis & institutional footprint', 'Multi-timeframe confluence', 'Building a watchlist system'],
    level: 'Beginner → Intermediate',
    duration: '8 hours across 24 modules',
    color: 'var(--emerald)',
  },
  {
    label: 'Course 02',
    title: 'Options Trading for Beginners',
    desc: 'Options are not lottery tickets. This course covers the real mechanics — Greeks, pricing, OI analysis, and defined-risk strategies for Nifty and Bank Nifty.',
    modules: ['Options basics: calls, puts, strikes, expiry', 'Understanding option pricing & time decay', 'The Greeks: delta, theta, vega, gamma', 'OI analysis & PCR interpretation', 'Nifty & Bank Nifty options strategies', 'Risk management for options traders'],
    level: 'Beginner → Intermediate',
    duration: '6 hours across 18 modules',
    color: 'var(--sapphire)',
  },
  {
    label: 'Course 03',
    title: 'Building a Systematic Trading Process',
    desc: 'Most traders fail not because they lack knowledge but because they have no system. This course covers pre-market process, journaling, review, and consistency.',
    modules: ['Pre-market routine & global cues analysis', 'Building a personal trade setup checklist', 'Position sizing & capital allocation rules', 'Trade journaling & performance tracking', 'Weekly review & strategy refinement', 'Psychology of consistent execution'],
    level: 'Intermediate → Advanced',
    duration: '5 hours across 15 modules',
    color: 'var(--gold)',
  },
]

export default function CoursesPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>Courses</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Learn to trade with{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>institutional discipline.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36 }}>
            Self-paced courses by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
            Built for Indian retail traders — not recycled YouTube content.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px',
            background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)',
            borderRadius: 10, fontSize: 13, color: 'var(--gold)', fontWeight: 500,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', animation: 'pulseDot 2s ease-in-out infinite' }} />
            Launching soon — join the waitlist below
          </div>
        </div>
      </section>

      {/* Course cards */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {COURSES.map((course) => (
            <div key={course.label} style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: 20, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: course.color, textTransform: 'uppercase', marginBottom: 10 }}>{course.label}</p>
                <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, fontWeight: 400, color: 'var(--text)', lineHeight: 1.2, marginBottom: 16 }}>{course.title}</h2>
                <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 24 }}>{course.desc}</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)', padding: '4px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6 }}>{course.level}</span>
                  <span style={{ fontSize: 12, color: 'var(--text3)', padding: '4px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6 }}>{course.duration}</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 14 }}>What you&apos;ll learn</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {course.modules.map((mod) => (
                    <div key={mod} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: course.color, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>Early Access</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>
            Get notified when courses launch
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 32 }}>
            Join the waitlist. Elite and Pro subscribers get early access and a 30% launch discount.
          </p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              className="input"
              style={{ flex: 1 }}
            />
            <button
              style={{
                padding: '12px 24px', background: 'var(--emerald)', color: '#031A13',
                border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
              }}
            >
              Notify Me
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text4)', marginTop: 16 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: 'var(--text3)', marginBottom: 20 }}>Already a subscriber? Courses are included in Elite plan.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/pricing" style={{ padding: '12px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            View Plans
          </Link>
          <Link href="/about" style={{ padding: '12px 28px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
            About the Analyst
          </Link>
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-tight" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266 · withSahib.com
        </div>
      </div>
      <BookingBanner />
      <Footer />
    </div>
  )
}
