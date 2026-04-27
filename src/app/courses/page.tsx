import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const courseSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Market Foundations (Equity Focus)',
    description: 'Structured equity market education with 3-month live 1-on-1 mentorship by SEBI RA Sahib Singh Hora.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '24999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Beginner',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Options Positioning System',
    description: 'Specialised F&O training — OI analysis, IV rank, PCR, expiry-week strategies with 3-month live handholding.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '34999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Intermediate',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Research Framework (Pro)',
    description: 'Advanced research methodology — how to research, screen, and evaluate trades the way a SEBI RA does.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '44999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Advanced',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Flagship Mentorship',
    description: 'Complete 3-month personalised 1-on-1 mentorship with SEBI RA Sahib Singh Hora. One mentee per batch.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '74999', priceCurrency: 'INR', availability: 'https://schema.org/LimitedAvailability' },
    courseMode: 'online',
    educationalLevel: 'All Levels',
    url: 'https://www.withsahib.com/courses',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://www.withsahib.com/courses' },
  ],
}

export const metadata: Metadata = {
  title: 'Live 1-on-1 Market Education | withSahib Courses',
  description:
    'Personalised, live one-on-one sessions with SEBI RA Sahib Singh Hora (INH000026266). Market Foundations ₹24,999 | Options System ₹34,999 | Research Framework ₹44,999 | Flagship Mentorship ₹74,999.',
  alternates: { canonical: 'https://www.withsahib.com/courses' },
  openGraph: {
    title: 'Live 1-on-1 Market Education | withSahib Courses',
    description: 'Not pre-recorded. Not YouTube. Live 1-on-1 sessions built around your portfolio — by SEBI RA Sahib Singh Hora (INH000026266).',
    url: 'https://www.withsahib.com/courses',
  },
}

const COURSES = [
  {
    label: 'Course 01',
    badge: 'Entry Level',
    badgeColor: 'var(--text3)',
    badgeBg: 'var(--bg2)',
    title: 'Market Foundations (Equity Focus)',
    price: '₹24,999',
    desc: 'Structured learning for anyone starting from scratch. Chart reading, price action, volume, and how to identify high-probability equity setups — built systematically, not randomly.',
    includes: [
      '3-month live handholding',
      'Personalised 1-on-1 sessions',
      'Equity-focused curriculum',
      'Research access during course',
    ],
    dotColor: 'var(--green)',
    borderColor: 'rgba(26,122,74,0.25)',
  },
  {
    label: 'Course 02',
    badge: 'BEST VALUE',
    badgeColor: '#FFFFFF',
    badgeBg: '#FF6B00',
    title: 'Options Positioning System',
    price: '₹34,999',
    desc: 'Specialised options training — OI analysis, IV rank, PCR, expiry-week strategies, structured position building, and risk management in F&O markets.',
    includes: [
      '3-month live handholding',
      'Trade review sessions',
      'Options-specific research access',
      'Direct session feedback',
    ],
    dotColor: '#FF6B00',
    borderColor: 'rgba(255,107,0,0.28)',
  },
  {
    label: 'Course 03',
    badge: 'Advanced',
    badgeColor: 'var(--text3)',
    badgeBg: 'var(--bg2)',
    title: 'Research Framework (Pro)',
    price: '₹44,999',
    desc: 'The complete withSahib research methodology — from pre-market scan to published research note. Learn to build, filter, and risk-calibrate equity recommendations the way a SEBI RA does.',
    includes: [
      '3-month live handholding',
      'Full methodology access',
      'Live research sessions',
      'Personal framework development',
    ],
    dotColor: '#B8975A',
    borderColor: 'rgba(184,151,90,0.28)',
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
      {courseSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

      {/* Course Cards — 3 col */}
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
                position: 'relative',
              }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: course.badgeBg, color: course.badgeColor,
                fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                padding: '4px 12px', borderRadius: '20px',
                fontFamily: 'var(--font-body)', marginBottom: 16,
                alignSelf: 'flex-start',
                border: course.badgeBg === '#FF6B00' ? 'none' : '1px solid var(--border2)',
              }}>
                {course.badge}
              </div>

              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: 'var(--text4)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
                {course.label}
              </p>

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
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: course.dotColor, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/appointments"
                style={{
                  display: 'block', textAlign: 'center', padding: '13px',
                  borderRadius: 12, fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'var(--font-body)',
                  background: 'transparent', color: 'var(--text2)',
                  border: '1px solid var(--border2)', transition: 'all 0.2s',
                  letterSpacing: '0.02em',
                }}
              >
                Enrol Now →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Mentorship — full width */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '2px', background: '#FF6B00', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#FF6B00', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
                The Flagship
              </span>
              <span style={{ width: '40px', height: '2px', background: '#FF6B00', display: 'inline-block' }} />
            </div>
          </div>

          {/* Flagship card */}
          <div style={{
            background: '#0A0A0A',
            borderLeft: '4px solid #FF6B00',
            borderRadius: '20px',
            padding: '48px 52px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Bg glow */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '400px', height: '400px',
              background: 'radial-gradient(ellipse at top right, rgba(255,107,0,0.07) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Hero badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#1C1C1E', border: '1px solid rgba(255,107,0,0.3)',
                  borderRadius: '20px', padding: '5px 16px',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
                  color: '#FF6B00', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                }}>
                  HERO PRODUCT
                </div>
              </div>

              {/* Scarcity box — prominent */}
              <div style={{
                background: 'rgba(255,107,0,0.08)',
                border: '2px solid rgba(255,107,0,0.4)',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: 36,
              }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FF6B00', fontFamily: 'var(--font-heading)', fontStyle: 'italic', marginBottom: 8 }}>
                  Only ONE mentee per batch.
                </p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  This is not a course. This is personalised mentorship with direct access to me.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start' }} className="resp-2col">
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px,4vw,48px)',
                    fontWeight: 700,
                    color: '#FAFAF7',
                    lineHeight: 1.1,
                    marginBottom: 20,
                  }}>
                    withSahib Flagship<br />
                    <em style={{ color: '#FF6B00', fontStyle: 'italic', fontWeight: 400 }}>Mentorship (1:1)</em>
                  </h2>

                  <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 32, fontFamily: 'var(--font-body)', maxWidth: 580 }}>
                    Three months. One analyst. Built entirely around you. Your portfolio, your questions, your pace. No curriculum. No batch. No recording. Just direct, live, personalised mentorship from a SEBI Registered Research Analyst with 14+ years of market experience.
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                    {[
                      'Complete 3-month personalised mentorship',
                      'Unlimited live sessions (scheduled)',
                      'Direct WhatsApp access to Sahib',
                      'Custom research coverage for your holdings',
                      'Trade-by-trade review and feedback',
                      'Access to all 3 courses included',
                      'Priority everything',
                    ].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B00', flexShrink: 0, marginTop: 5 }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Anchors */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', marginBottom: 36 }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FF6B00', fontFamily: 'var(--font-body)' }}>
                      Batch size: 1. Always.
                    </span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>
                      Next available slot: June 2026
                    </span>
                  </div>
                </div>

                {/* Price block */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 56, fontWeight: 700, color: '#FAFAF7', lineHeight: 1 }}>
                    ₹74,999
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', marginTop: 6 }}>
                    one-time
                  </div>
                  <div style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)',
                    marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    or <strong style={{ color: 'rgba(255,255,255,0.85)' }}>₹26,999 × 3</strong> instalments
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '17px 40px',
                  background: '#FF6B00',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  boxShadow: '0 8px 32px rgba(255,107,0,0.40)',
                  transition: 'all 0.2s',
                }}
              >
                Apply for Flagship Mentorship →
              </Link>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '12px', fontFamily: 'var(--font-body)' }}>
                Applications reviewed personally by Sahib · Response within 48 hours
              </p>
            </div>
          </div>
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
              { title: 'Personalised to your level', desc: "Whether you're a beginner or an experienced trader, the curriculum adapts to where you actually are." },
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
            <strong style={{ color: 'var(--text)' }}>Already on the Elite plan?</strong> All 3 courses are included in your subscription.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            Questions about the Flagship or courses?{' '}
            <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', textDecoration: 'none' }}>connect@withsahib.com</a>
          </p>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
