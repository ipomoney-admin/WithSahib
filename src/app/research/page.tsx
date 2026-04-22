import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Research — AI Stock Reports & SEBI RA Analysis',
  description:
    'Institutional-grade stock research by Sahib Singh Hora, SEBI RA INH000026266. AI-powered DCF models, earnings analysis, and NSE equity research reports. Subscribe for full access.',
  alternates: { canonical: 'https://www.withsahib.com/research' },
  openGraph: {
    title: 'Research — withSahib SEBI RA Stock Analysis',
    description: 'AI-powered NSE equity research, DCF models, and earnings analysis by SEBI RA Sahib Singh Hora (INH000026266).',
    url: 'https://www.withsahib.com/research',
  },
}

const SAMPLE_REPORTS = [
  {
    ticker: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    type: 'DCF Valuation + Earnings Analysis',
    sector: 'Energy & Retail',
    date: 'Q4 FY26',
    preview: 'Revenue beat by 4.2% driven by Jio and Retail segments. EBITDA margins expanded 80bps. DCF model suggests fair value range of ₹1,480–₹1,620 at 8% WACC. Key catalyst: Jio IPO timeline.',
    locked: true,
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    type: 'Earnings Analysis + NIM Outlook',
    sector: 'Banking & Finance',
    date: 'Q4 FY26',
    preview: 'Net interest margin compressed 12bps QoQ on deposit repricing. Loan growth of 14.5% YoY remains healthy. Credit cost guidance maintained at 40–50bps. Stock pricing in recovery.',
    locked: true,
  },
  {
    ticker: 'INFY',
    name: 'Infosys Ltd',
    type: 'Revenue Guidance Analysis',
    sector: 'Information Technology',
    date: 'Q4 FY26',
    preview: 'FY27 revenue guidance of 4.5–7% in constant currency — above street estimates. Large deal TCV of $2.6B signals pipeline strength. Margin band maintained at 20–22%. Watch discretionary spending revival.',
    locked: true,
  },
]

const METHODOLOGY = [
  {
    step: '01',
    title: 'Automated Filing Detection',
    desc: 'The AI engine monitors BSE and NSE filing portals in real time. When a company publishes quarterly results, the report generation pipeline triggers automatically.',
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
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Institutional-grade research.<br />
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>SEBI-compliant. AI-powered.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36, maxWidth: 640, margin: '0 auto 36px' }}>
            Every time a company files quarterly results on BSE or NSE, the withSahib AI engine generates a full research report — DCF model, earnings analysis, and SEBI-compliant analyst disclosure.
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

      {/* Sample Reports */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Sample Reports</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)' }}>
              Latest research — preview
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text3)', marginTop: 10 }}>Full content unlocked for Pro and Elite subscribers.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {SAMPLE_REPORTS.map((r) => (
              <div key={r.ticker} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Courier New, monospace', fontSize: 14, fontWeight: 700, color: 'var(--emerald)', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', padding: '3px 10px', borderRadius: 6 }}>{r.ticker}</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{r.sector}</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>·</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{r.date}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{r.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text3)' }}>{r.type}</p>
                  </div>
                  <Link href="/pricing?plan=pro" style={{ padding: '10px 20px', background: 'var(--emerald)', color: '#031A13', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Unlock Full Report
                  </Link>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>{r.preview}</p>
                {/* Lock overlay */}
                <div style={{ background: 'linear-gradient(to bottom, transparent, var(--surface))', position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16 }}>
                  <Link href="/pricing?plan=pro" style={{ fontSize: 13, color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
                    Subscribe to read full DCF analysis →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ padding: '60px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 12 }}>Methodology</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)' }}>
              How the AI research engine works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {METHODOLOGY.map((m) => (
              <div key={m.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, color: 'rgba(0,200,150,0.2)', lineHeight: 1, marginBottom: 12 }}>{m.step}</p>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>
          Start reading full reports
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 32 }}>Pro plan — ₹2,499/month. Includes all AI research reports, intraday picks, and options picks.</p>
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
      <Footer />
    </div>
  )
}
