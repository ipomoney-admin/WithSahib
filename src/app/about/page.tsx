import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About Sahib Singh Hora — Best SEBI RA India 2026',
  description:
    'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266). Best SEBI RA India 2026 — verified stock market advisor India for intraday tips, NSE swing trades & options.',
  keywords: [
    'Sahib Singh Hora',
    'SEBI registered research analyst',
    'best SEBI RA India 2026',
    'verified stock market analyst India',
    'INH000026266',
    'research analyst India',
    'stock market advisor India',
    'SEBI RA',
    'withSahib',
    'SEBI registered analyst fees',
    'paid stock advisory India',
  ],
  alternates: { canonical: 'https://www.withsahib.com/about' },
  openGraph: {
    title: 'About Sahib Singh Hora — SEBI RA INH000026266',
    description: 'Verified stock market analyst India. SEBI Registered Research Analyst offering intraday tips, NSE swing trades, options advisory & AI stock research.',
    url: 'https://www.withsahib.com/about',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sahib Singh Hora',
  url: 'https://www.withsahib.com',
  jobTitle: 'SEBI Registered Research Analyst',
  description: 'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) providing intraday stock tips, NSE swing trade picks, Nifty & Bank Nifty options calls, and AI-powered stock research reports for Indian retail investors.',
  identifier: { '@type': 'PropertyValue', name: 'SEBI Registration Number', value: 'INH000026266' },
  knowsAbout: ['Intraday Trading', 'Stock Options', 'Swing Trading', 'Technical Analysis', 'SEBI Regulations', 'NSE Equities', 'Nifty Options', 'Bank Nifty'],
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: 0, left: '60%', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Avatar card */}
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
              {['SEBI RA', 'NISM Certified', 'Technical Analyst', 'Options Strategist'].map(tag => (
                <span key={tag} style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '6px', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="section-tag">About</div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.15, marginBottom: '24px' }}>
              India&apos;s verified<br />
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>stock market advisor</em>
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px' }}>
              I&apos;m Sahib Singh Hora — a SEBI Registered Research Analyst (INH000026266) and one of India&apos;s
              most transparent stock market advisors. I built withSahib.com to give retail investors access
              to institutional-grade share market tips, intraday stock tips, and AI-powered research — legally,
              transparently, and under full SEBI regulation.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8 }}>
              Every intraday call, every NSE swing trade pick, every Nifty options tip on this platform carries
              my SEBI registration number — because accountability is not optional in financial research.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
              <Link href="/pricing" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>View Plans</Link>
              <Link href="/appointments" className="btn btn-ghost btn-md" style={{ textDecoration: 'none' }}>Book a Session</Link>
            </div>
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
          <p style={{ fontSize: '16px', color: 'var(--text)', lineHeight: 1.8, marginBottom: '20px', fontWeight: 400 }}>
            The Indian stock market is drowning in noise. Telegram channels selling intraday tips with no accountability.
            YouTube &quot;analysts&quot; calling themselves research analysts without SEBI registration. Unverified tipsters
            running paid stock advisory services with zero regulatory oversight.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '20px', fontWeight: 300 }}>
            I became a SEBI Registered Research Analyst specifically to build something different. When you see
            INH000026266 on a recommendation from withSahib.com, you can verify it at SEBI&apos;s official portal in 30
            seconds. That&apos;s the standard every stock market subscription India deserves.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '20px', fontWeight: 300 }}>
            withSahib.com combines systematic technical analysis with AI-powered research to deliver the best stock
            tips in India — not because of hype, but because of methodology. Every intraday call has a stop-loss.
            Every swing trade has a rationale. Every options tip has a risk framework.
          </p>
          <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.8, fontWeight: 300 }}>
            I built withSahib with one mission: to make the kind of research that institutional traders
            use every day accessible to every retail investor in India — under full SEBI regulatory
            supervision, with transparent SEBI registered analyst fees.
          </p>
        </div>
      </section>

      {/* What I offer */}
      <section style={{ padding: '60px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="section-tag">Services</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '28px' }}>
            What I offer as a SEBI RA
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { title: 'Intraday Stock Tips NSE', desc: 'Daily pre-market share market tips — best stock to buy today with entry, target & SL. Available to Pro & Elite subscribers.', href: '/services/intraday' },
              { title: 'Nifty & Bank Nifty Options Tips', desc: 'Index options calls using OI analysis and PCR-based signals. Options trading tips with defined risk setups.', href: '/services' },
              { title: 'Swing Trading Stocks India', desc: '2–10 day positional trade ideas — NSE tips for swing traders. 3–5 picks per week with full technical rationale.', href: '/services' },
              { title: 'AI Research Reports', desc: 'Automated stock research reports India — DCF models and earnings analysis generated on BSE/NSE filings.', href: '/reports' },
              { title: 'Model Portfolio', desc: 'SEBI RA-curated long-term portfolio of best stocks to buy — quarterly rebalanced with published reasoning.', href: '/services' },
              { title: '1-on-1 Advisory Sessions', desc: 'Book a personal session with a verified stock market advisor India. Portfolio review or strategy deep-dive.', href: '/appointments' },
            ].map((svc) => (
              <Link key={svc.href + svc.title} href={svc.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, transition: 'border-color 0.2s' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{svc.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{svc.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEBI credentials */}
      <section style={{ padding: '60px 40px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="section-tag">Credentials</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '28px' }}>
            Fully verifiable SEBI registration
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { label: 'SEBI Registration Number', value: 'INH000026266', mono: true },
              { label: 'Registered Name', value: 'Sahib Singh Hora', mono: false },
              { label: 'Category', value: 'Individual RA', mono: false },
              { label: 'Valid From', value: 'Apr 20, 2026', mono: false },
              { label: 'Valid Until', value: 'Apr 19, 2031', mono: false },
              { label: 'Regulator', value: 'SEBI, Government of India', mono: false },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</p>
                <p style={{ fontSize: item.mono ? '13px' : '14px', fontWeight: 600, color: 'var(--text)', fontFamily: item.mono ? 'Courier New, monospace' : 'Outfit, sans-serif' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '14px', color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
            Verify on SEBI&apos;s official portal →
          </a>
        </div>
      </section>

      {/* Internal links */}
      <section style={{ padding: '48px 40px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 16 }}>Explore withSahib</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { href: '/pricing', label: 'Subscription Plans & Fees' },
              { href: '/services/intraday', label: 'Intraday Tips NSE' },
              { href: '/reports', label: 'AI Research Reports' },
              { href: '/appointments', label: 'Book Advisory Session' },
              { href: '/faq', label: 'SEBI RA FAQ' },
              { href: '/blog', label: 'Stock Market Blog' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ textDecoration: 'none', padding: '8px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text2)', transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-narrow" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. SEBI registration does not guarantee returns.
          Sahib Singh Hora · SEBI RA · INH000026266 · withSahib.com
        </div>
      </div>

      <Footer />
    </div>
  )
}
