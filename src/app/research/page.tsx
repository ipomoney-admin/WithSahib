import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Research — Stock Reports & SEBI RA Analysis',
  description:
    'Institutional-grade stock research by Sahib Singh Hora, SEBI RA INH000026266. DCF models, earnings analysis, and NSE equity research reports. Subscribe for full access.',
  alternates: { canonical: 'https://www.withsahib.com/research' },
  openGraph: {
    title: 'Research — withSahib SEBI RA Stock Analysis',
    description: 'Data-driven NSE equity research, DCF models, and earnings analysis by SEBI RA Sahib Singh Hora (INH000026266).',
    url: 'https://www.withsahib.com/research',
  },
}


const METHODOLOGY = [
  {
    step: '01',
    title: 'Automated Filing Detection',
    desc: 'Our system monitors BSE and NSE filing portals in real time. When a company publishes quarterly results, the report generation pipeline triggers automatically.',
  },
  {
    step: '02',
    title: 'Financial Data Extraction',
    desc: 'Key financial metrics are extracted: revenue, EBITDA, PAT, margins, debt, and guidance commentary. These are compared against the previous quarter and consensus estimates.',
  },
  {
    step: '03',
    title: 'DCF Model Generation',
    desc: 'A discounted cash flow model is built using extracted financials, sector-appropriate WACC, and growth assumptions. Fair value ranges are derived with bull, base, and bear scenarios.',
  },
  {
    step: '04',
    title: 'SEBI-Compliant Report',
    desc: 'The final report includes: financial summary, DCF output, analyst commentary, risk factors, and the full SEBI RA disclosure — published with Sahib Singh Hora\'s registration INH000026266.',
  },
]

export default function ResearchPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>Research</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Institutional-grade research.<br />
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>SEBI-compliant. Data-driven.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 640, margin: '0 auto 36px' }}>
            Every time a company files quarterly results on BSE or NSE, withSahib generates a full research report — DCF model, earnings analysis, and SEBI-compliant analyst disclosure.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pricing?plan=pro" style={{ padding: '14px 32px', background: 'var(--emerald)', color: '#031A13', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Access Full Reports — Pro
            </Link>
            <Link href="/auth/register" style={{ padding: '14px 32px', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 12, fontSize: 15, textDecoration: 'none' }}>
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Reports status */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Reports</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)' }}>
              Research reports
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text3)', marginTop: 10 }}>Generated automatically when NSE/BSE filings are published. Accessible to Pro and Elite subscribers.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '56px 40px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--emerald)' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No reports published yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 24px' }}>
              Reports are generated automatically when companies file quarterly results on BSE/NSE. Subscribe to get notified when the first reports go live.
            </p>
            <Link href="/pricing?plan=pro" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--emerald)', color: '#031A13', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Subscribe for Access
            </Link>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ padding: '60px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Methodology</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)' }}>
              How the research engine works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {METHODOLOGY.map((m) => (
              <div key={m.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'rgba(0,200,150,0.2)', lineHeight: 1, marginBottom: 12 }}>{m.step}</p>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>
          Start reading full reports
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 32 }}>Pro plan — ₹2,499/month. Includes all research reports, intraday picks, and options picks.</p>
        <Link href="/pricing" style={{ padding: '14px 36px', background: 'var(--emerald)', color: '#031A13', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          View Pricing
        </Link>
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
