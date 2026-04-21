import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'FAQ — SEBI RA INH000026266 | withSahib',
  description:
    'Comprehensive answers about SEBI Registered Research Analyst services, INH000026266, Sahib Singh Hora, intraday calls, options advisory, and Indian stock market research.',
  alternates: { canonical: 'https://withsahib.com/faq' },
  openGraph: {
    title: 'FAQ — SEBI Research Analyst withSahib | INH000026266',
    description:
      'Everything you need to know about SEBI RA services, Sahib Singh Hora, intraday stock calls, swing trades, options picks, and AI research reports.',
    url: 'https://withsahib.com/faq',
  },
}

const FAQ_SECTIONS = [
  {
    heading: 'About SEBI Research Analysts',
    items: [
      {
        q: 'What is a SEBI Registered Research Analyst (RA)?',
        a: 'A SEBI Registered Research Analyst is a SEBI-licensed professional authorised to provide investment research, stock recommendations, and trade ideas to retail and institutional clients. They operate under the SEBI (Research Analysts) Regulations, 2014 and must follow strict disclosure, conflict-of-interest, and compliance norms. Each RA carries a unique registration number (e.g. INH000026266) that is publicly verifiable on SEBI\'s portal.',
      },
      {
        q: 'Why should I only take research from a SEBI Registered RA?',
        a: 'Unregistered "tipsters" operate illegally and have zero accountability. A SEBI Registered RA must disclose their identity, registration number, conflicts of interest, and analyst holdings in every piece of research. They are subject to SEBI inspection and can face penalties for misleading recommendations. This regulatory framework protects investors from fraud and pump-and-dump schemes.',
      },
      {
        q: 'How is a SEBI RA different from a SEBI Investment Adviser (IA)?',
        a: 'A SEBI Research Analyst provides research reports and general trade recommendations that are not tailored to individual circumstances. A SEBI Investment Adviser provides personalised advice based on a client\'s risk profile, goals, and financial situation. Sahib Singh Hora is a SEBI RA — the research published on withSahib.com is general in nature and not personal financial advice.',
      },
      {
        q: 'What are the SEBI RA Regulations 2014?',
        a: 'The SEBI (Research Analysts) Regulations, 2014 govern how research analysts can operate in India. Key requirements include: mandatory SEBI registration, NISM certification, disclosure of conflicts of interest, clear labelling of research reports with registration numbers, prohibition on trading against published recommendations for a defined period, and maintaining research records for 5 years.',
      },
      {
        q: 'What is NISM certification and why does it matter?',
        a: 'NISM (National Institute of Securities Markets) is SEBI\'s educational arm. Research Analysts are required to pass the NISM Series XV: Research Analyst Certification Examination as a prerequisite for SEBI registration. This ensures all registered analysts have a baseline understanding of securities markets, valuation, and ethics. Sahib Singh Hora is NISM certified.',
      },
    ],
  },
  {
    heading: 'About Sahib Singh Hora & INH000026266',
    items: [
      {
        q: 'Who is Sahib Singh Hora?',
        a: 'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) and the founder of Altitans Intelligence Private Limited. He provides institutional-grade technical analysis, intraday calls, swing trades, options strategies, and AI-powered research reports through withSahib.com. He is NISM certified and operates fully under SEBI\'s regulatory framework.',
      },
      {
        q: 'What is the SEBI registration number INH000026266?',
        a: 'INH000026266 is the SEBI Research Analyst registration number assigned to Sahib Singh Hora under Altitans Intelligence Private Limited. The registration is valid from April 20, 2026 to April 19, 2031. It can be verified on the official SEBI Intermediary Portal at sebi.gov.in.',
      },
      {
        q: 'How do I verify SEBI registration INH000026266?',
        a: 'Go to sebi.gov.in → Intermediaries/Market Infrastructure Institutions → Registered Intermediaries → Research Analyst. Search for "INH000026266" or "Sahib Singh Hora" or "Altitans Intelligence" to verify the active registration status, validity period, and associated entity.',
      },
      {
        q: 'Where is Sahib Singh Hora based?',
        a: 'Sahib Singh Hora is based in Madhya Pradesh, India, and provides research services to clients across India through withSahib.com. All services are delivered digitally via the platform.',
      },
      {
        q: 'What is Altitans Intelligence Private Limited?',
        a: 'Altitans Intelligence Private Limited is the registered entity under which Sahib Singh Hora operates as a SEBI Research Analyst. The company publishes research on NSE-listed equities, options, and indices under the withSahib.com brand.',
      },
    ],
  },
  {
    heading: 'Services & Products',
    items: [
      {
        q: 'What intraday stock calls does withSahib provide?',
        a: 'withSahib publishes daily intraday calls for NSE-listed equities before 9 AM on every trading day. Each call includes: stock name, recommended entry range, target price(s), and stop-loss level. Calls are based on technical analysis including price action, volume, momentum indicators, and multi-timeframe analysis.',
      },
      {
        q: 'What types of options calls does withSahib offer?',
        a: 'withSahib offers two types of options calls: (1) Stock Options — weekly and monthly strategies with strike selection, premium targets, and risk-defined setups; (2) Index Options — Nifty and Bank Nifty options using OI analysis, PCR-based directional calls, and expiry day plays. Options require understanding of derivatives risk.',
      },
      {
        q: 'What are swing trade picks and how often are they published?',
        a: 'Swing trade picks are 2–10 day positional trade ideas published 3–5 times per week. They are based on chart pattern breakouts (flags, triangles, cup-and-handle), volume confirmation, and multi-timeframe technical analysis. Each pick includes entry, target, and stop-loss.',
      },
      {
        q: 'What is the Model Portfolio on withSahib?',
        a: 'The Model Portfolio is a curated long-term stock portfolio published under SEBI RA research guidelines. It includes 10–20 NSE-listed stocks selected for long-term value, sector allocation rationale, and expected holding periods. It is rebalanced quarterly with published reasoning.',
      },
      {
        q: 'What are AI Research Reports?',
        a: 'AI Research Reports are institutional-grade documents generated automatically when BSE/NSE-listed companies publish quarterly results or filings. The engine runs DCF models, analyses management commentary, and compares results against estimates to produce structured reports with buy/hold/sell recommendations. Available to Pro and Elite subscribers.',
      },
      {
        q: 'How do 1-on-1 sessions work?',
        a: '1-on-1 sessions are personal video calls with Sahib Singh Hora. Available in 15-minute or 30-minute formats. Topics can include: portfolio review, specific stock deep-dive, options strategy discussion, or general trading process improvement. Pro subscribers get 1 session/month; Elite subscribers get unlimited sessions. Book at withsahib.com/appointments.',
      },
      {
        q: 'What courses are available on withSahib?',
        a: 'withSahib offers self-paced courses on technical analysis fundamentals, options theory and pricing, and building a systematic trading process. Courses include video modules, quizzes, and downloadable materials. Available to Basic, Pro, and Elite subscribers.',
      },
    ],
  },
  {
    heading: 'Pricing & Plans',
    items: [
      {
        q: 'What are the subscription plans on withSahib?',
        a: 'There are 4 plans: Free (₹0/month) — signal previews and market data; Basic (₹999/month) — swing trades, model portfolio, weekly outlook; Pro (₹2,499/month) — daily intraday calls, options picks, AI reports, 1 session/month; Elite (₹5,999/month) — everything in Pro plus unlimited sessions, priority WhatsApp alerts, all courses, and HNI research. Annual billing saves 20%.',
      },
      {
        q: 'Is there a free plan available?',
        a: 'Yes. The Free plan requires no credit card and gives access to signal previews, market ticker, news feed, and sample research reports — indefinitely. You can upgrade at any time from your dashboard.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. Subscriptions can be cancelled anytime from your account settings. You retain access until the end of your current billing period. No cancellation fees or lock-in.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'Payments are processed via Razorpay, which supports all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and EMI options.',
      },
    ],
  },
  {
    heading: 'Compliance & Risk',
    items: [
      {
        q: 'Are withSahib\'s recommendations guaranteed to make profit?',
        a: 'No. Investments in securities markets are subject to market risks. SEBI registration does not guarantee performance or returns to investors. All research on withSahib is for informational and educational purposes, published under SEBI RA regulations. You should assess your own risk tolerance and consult a SEBI Investment Adviser for personalised financial advice.',
      },
      {
        q: 'What is the standard SEBI risk disclaimer?',
        a: 'Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. Research Analyst: Sahib Singh Hora, SEBI RA Reg. No. INH000026266.',
      },
      {
        q: 'Does withSahib share my personal data?',
        a: 'No. withSahib does not share client data with any third parties. Client onboarding follows SEBI-compliant procedures. All data is stored securely using Supabase (PostgreSQL) infrastructure with industry-standard encryption.',
      },
      {
        q: 'Does the analyst personally hold positions in recommended stocks?',
        a: 'All conflicts of interest and analyst holdings are disclosed in research reports as required under SEBI RA Regulations 2014. If Sahib Singh Hora or Altitans Intelligence holds a position in a recommended security, this is explicitly disclosed in the research note.',
      },
      {
        q: 'How do I lodge a complaint against a SEBI-registered intermediary?',
        a: 'Complaints against SEBI-registered intermediaries can be filed through the SEBI SCORES (SEBI Complaints Redressal System) portal at scores.sebi.gov.in. You can also contact SEBI directly at sebi.gov.in or call 1800 22 7575 (toll-free).',
      },
    ],
  },
  {
    heading: 'Platform & Technical',
    items: [
      {
        q: 'How do I get started on withSahib?',
        a: 'Sign up at withsahib.com/auth/register — no credit card required. Your free account is created instantly with access to signal previews and market data. Upgrade from your dashboard whenever you\'re ready.',
      },
      {
        q: 'Is withSahib a mobile app?',
        a: 'withSahib.com is a Progressive Web App (PWA) — it works on any device through your browser and can be installed on your phone\'s home screen for an app-like experience. Native iOS and Android apps are planned.',
      },
      {
        q: 'How are alerts delivered?',
        a: 'Trade calls and research are published on your withSahib dashboard. Elite subscribers also receive priority WhatsApp alerts for time-sensitive intraday and options calls.',
      },
    ],
  },
]

export default function FAQPage() {
  const allItems = FAQ_SECTIONS.flatMap((s) => s.items)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '80px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,200,150,0.07)',
                border: '1px solid rgba(0,200,150,0.18)',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--emerald)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}
            >
              Answer Engine Optimised · AEO
            </div>
            <h1
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              Frequently Asked{' '}
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Questions</em>
            </h1>
            <p style={{ fontSize: '17px', color: 'var(--text2)', lineHeight: 1.7, maxWidth: '600px' }}>
              Everything about SEBI Registered Research Analyst services, INH000026266,
              Sahib Singh Hora, and withSahib — for investors, traders, and AI search engines.
            </p>
          </div>

          {/* Quick nav */}
          <nav
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px 24px',
              marginBottom: '48px',
            }}
          >
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Jump to Section
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FAQ_SECTIONS.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  style={{
                    fontSize: '13px',
                    color: 'var(--emerald)',
                    textDecoration: 'none',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: 'rgba(0,200,150,0.06)',
                    border: '1px solid rgba(0,200,150,0.15)',
                  }}
                >
                  {s.heading}
                </a>
              ))}
            </div>
          </nav>

          {/* Sections */}
          {FAQ_SECTIONS.map((section, si) => (
            <section key={si} id={`section-${si}`} style={{ marginBottom: '56px' }}>
              <h2
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {section.heading}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {section.items.map((item, qi) => (
                  <details
                    key={qi}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <summary
                      style={{
                        padding: '20px 24px',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text)',
                        cursor: 'pointer',
                        listStyle: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span>{item.q}</span>
                      <span
                        style={{
                          flexShrink: 0,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(0,200,150,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          color: 'var(--emerald)',
                          fontWeight: 400,
                        }}
                      >
                        +
                      </span>
                    </summary>
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: '14px',
                        color: 'var(--text2)',
                        lineHeight: 1.8,
                        borderTop: '1px solid var(--border)',
                        paddingTop: '16px',
                      }}
                    >
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            <h3
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: '28px',
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: '12px',
              }}
            >
              Ready to start?
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '24px' }}>
              Join withSahib free — no credit card required.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/auth/register"
                style={{
                  padding: '12px 28px',
                  background: 'var(--emerald)',
                  color: '#031A13',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Start Free
              </Link>
              <Link
                href="/pricing"
                style={{
                  padding: '12px 28px',
                  border: '1px solid var(--border)',
                  color: 'var(--text2)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                See Pricing
              </Link>
            </div>
            <p
              style={{
                marginTop: '20px',
                fontSize: '11px',
                color: 'var(--text3)',
                fontFamily: 'Courier New, monospace',
                letterSpacing: '1px',
              }}
            >
              SEBI RA · INH000026266 · Altitans Intelligence Pvt Ltd
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
