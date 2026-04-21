import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'About Sahib Singh Hora — SEBI Registered Research Analyst',
  description: 'Learn about Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266) and the story behind withSahib.com.',
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: 0, left: '60%', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,200,150,0.08)', border: '2px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Serif Display, serif', fontSize: '40px', color: 'var(--emerald)' }}>S</div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Sahib Singh Hora</h2>
              <p style={{ fontSize: '14px', color: 'var(--text2)' }}>SEBI Registered Research Analyst</p>
              <p style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'Courier New, monospace', letterSpacing: '1px', marginTop: '4px' }}>INH000026266</p>
            </div>
            <div style={{ width: '100%', padding: '12px', background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 500 }}>Valid: Apr 20, 2026 – Apr 19, 2031</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {['SEBI RA', 'NISM Certified', 'Technical Analyst', 'Options Strategist', 'Founder — Altitans Intelligence'].map(tag => (
                <span key={tag} style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '6px', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
              ))}
            </div>
          </div>
          {/* Text */}
          <div>
            <div className="section-tag">About</div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.15, marginBottom: '24px' }}>
              Research with<br />
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>accountability</em> at its core
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px' }}>
              I'm Sahib — a SEBI Registered Research Analyst who built withSahib.com because I wanted a research platform that actually treats retail investors like adults.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8 }}>
              Every call, every report, every recommendation on this platform has my name and SEBI registration number on it. Because accountability is not optional — it's the foundation.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '60px 40px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="section-tag">The Story</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '36px', fontWeight: 400, color: 'var(--text)', marginBottom: '28px', lineHeight: 1.2 }}>
            Why I built <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>withSahib</em>
          </h2>
          {[
            'The Indian stock market is full of noise. Telegram channels, anonymous "analysts", tip senders — none accountable, none regulated. Retail investors deserve better.',
            'I went through the process of becoming a SEBI Registered Research Analyst specifically because I wanted to build something with a foundation of trust. When you see INH000026266 on a recommendation, you can verify that on SEBI\'s official portal. You know exactly who is responsible.',
            'withSahib.com combines systematic backtested technical analysis with AI-powered research — not to replace human judgement, but to augment it. Every signal is explained. Every report is sourced. Every call has a stop-loss and a rationale.',
            'I built this under Altitans Intelligence Private Limited, a company my family and I started with one mission: to make institutional-grade research accessible to every retail investor in India.',
          ].map((para, i) => (
            <p key={i} style={{ fontSize: '16px', color: i === 0 ? 'var(--text)' : 'var(--text2)', lineHeight: 1.8, marginBottom: '20px', fontWeight: i === 0 ? 400 : 300 }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* SEBI credentials */}
      <section style={{ padding: '60px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="section-tag">Credentials</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '28px' }}>Fully verifiable</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Registration Number', value: 'INH000026266', mono: true },
              { label: 'Registered Name', value: 'Sahib Singh Hora', mono: false },
              { label: 'Category', value: 'Individual RA', mono: false },
              { label: 'Valid From', value: 'Apr 20, 2026', mono: false },
              { label: 'Valid Until', value: 'Apr 19, 2031', mono: false },
              { label: 'Regulator', value: 'SEBI, Government of India', mono: false },
              { label: 'Company', value: 'Altitans Intelligence Pvt. Ltd.', mono: false },
              { label: 'CIN', value: 'U62011MP2026PTC083080', mono: true },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</p>
                <p style={{ fontSize: item.mono ? '13px' : '14px', fontWeight: 600, color: 'var(--text)', fontFamily: item.mono ? 'Courier New, monospace' : 'Outfit, sans-serif' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '14px', color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
            Verify on SEBI's official portal →
          </a>
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-narrow" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Registration granted by SEBI does not guarantee returns.
          Sahib Singh Hora · SEBI RA · INH000026266 · Altitans Intelligence Private Limited.
        </div>
      </div>

      <Footer />
    </div>
  )
}
