import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog — Stock Market Research & Trading Insights | withSahib',
  description:
    'Expert articles on SEBI regulations, intraday trading, options strategies, and building a systematic trading process — by Sahib Singh Hora, SEBI RA INH000026266.',
  alternates: { canonical: 'https://withsahib.com/blog' },
  openGraph: {
    title: 'Blog — Stock Market Research & Insights | withSahib',
    description:
      'In-depth articles on Indian markets, SEBI regulations, and trading strategies by SEBI Registered Research Analyst Sahib Singh Hora (INH000026266).',
    url: 'https://withsahib.com/blog',
  },
}

const POSTS = [
  {
    slug: 'how-to-identify-genuine-sebi-registered-research-analyst',
    title: 'How to Identify a Genuine SEBI Registered Research Analyst',
    excerpt:
      'With thousands of unregulated "tipsters" operating on Telegram and YouTube, knowing how to verify a SEBI RA is the first step to protecting your capital. Here\'s exactly what to check.',
    category: 'Regulation',
    readTime: '6 min read',
    date: '2026-04-15',
    dateDisplay: 'April 15, 2026',
    tags: ['SEBI', 'Research Analyst', 'INH000026266', 'Investor Safety'],
    content: `
A SEBI Registered Research Analyst (RA) is licensed under the SEBI (Research Analysts) Regulations, 2014.
Here's your complete verification checklist:

**1. Check the SEBI Intermediary Portal**
Go to sebi.gov.in → Registered Intermediaries → Research Analyst.
Enter the RA's registration number (e.g. INH000026266 for Sahib Singh Hora) and verify:
- Active registration status
- Valid licence dates
- Registered entity name

**2. Look for SEBI Reg. Number on All Research**
Every SEBI RA is legally required to display their registration number on all research outputs.
If a "research service" doesn't show a SEBI number — it's unregistered.

**3. Check for NISM Certification**
SEBI RAs must pass the NISM Series XV exam. Ask for their NISM certificate or check NISM's website.

**4. Conflict of Interest Disclosures**
Genuine SEBI RAs must disclose if they hold positions in recommended stocks. No disclosure = red flag.

**5. No "Guaranteed Return" Claims**
It's illegal under SEBI rules to guarantee returns. Any service promising "100% accurate signals" or
"guaranteed profits" is operating outside the law.

**Sahib Singh Hora (INH000026266)** is publicly registered and verifiable at sebi.gov.in.
    `,
  },
  {
    slug: 'understanding-intraday-trading-entry-target-stop-loss',
    title: 'Understanding Intraday Trading: Entry, Target and Stop-Loss Explained',
    excerpt:
      'Every intraday call has three numbers: entry, target, and stop-loss. Most retail traders ignore one of them — and it\'s usually the one that destroys their capital. Here\'s the complete framework.',
    category: 'Trading Education',
    readTime: '8 min read',
    date: '2026-04-10',
    dateDisplay: 'April 10, 2026',
    tags: ['Intraday Trading', 'NSE', 'Stop Loss', 'Risk Management'],
    content: `
Intraday trading means buying and selling a stock within the same trading session (9:15 AM – 3:30 PM IST).
Every trade needs three price levels defined BEFORE you enter:

**Entry Range**
The price zone where you initiate the position. Buying at the exact right entry is less important than
not chasing. If the stock has already moved 2% past your entry, skip the trade.

**Target Price**
Where you plan to exit with a profit. For intraday, targets are typically 0.5% to 2.5% from entry
depending on the stock's Average True Range (ATR). Set your target based on the next resistance level.

**Stop-Loss (SL)**
The most important number. SL is the price at which you admit you're wrong and exit to protect capital.
A strict SL at 0.5–1% limits damage. Without an SL, a single bad trade can wipe out weeks of gains.

**Risk:Reward Ratio**
Only take trades where potential reward is at least 2x the risk. If your SL is 1%, your target should be 2%+.

**Position Sizing**
Never risk more than 1–2% of your total capital on a single intraday trade. If SL is 1% on the stock,
that means your position size = (2% of capital) / (1% SL) = 2x your intended capital risk.

All withSahib intraday calls include all three levels with context on volume and sector momentum.
    `,
  },
  {
    slug: 'what-is-model-portfolio-why-retail-investors-need-one',
    title: 'What Is a Model Portfolio and Why Every Retail Investor Needs One',
    excerpt:
      'Most retail investors own a random collection of stocks they bought based on news, tips, and hope. A model portfolio is the opposite — systematic, diversified, and built on research. Here\'s what it changes.',
    category: 'Portfolio Strategy',
    readTime: '7 min read',
    date: '2026-04-05',
    dateDisplay: 'April 5, 2026',
    tags: ['Model Portfolio', 'Long Term Investing', 'NSE Equities', 'Portfolio Management'],
    content: `
A model portfolio is a pre-defined, researched selection of stocks that together represent an investment
strategy — designed to balance risk and return across sectors, market caps, and time horizons.

**Why Random Stock Picking Fails**
Most retail investors accumulate stocks based on:
- A tip from a friend or family member
- A Telegram group recommendation
- A stock appearing on CNBC
- A company they use as a consumer

The result? A portfolio with 15 unrelated stocks, zero sector balance, and no exit strategy.

**What a Model Portfolio Does Differently**

1. **Defined allocation** — Each stock has a % allocation based on conviction and risk
2. **Sector diversification** — Spread across IT, banking, pharma, FMCG, etc. to reduce correlation
3. **Entry criteria** — Each position entered with a valuation rationale (P/E, DCF, or momentum)
4. **Review schedule** — Quarterly rebalancing with published reasoning

**The withSahib Model Portfolio**
Published under SEBI RA guidelines, the withSahib model portfolio tracks 10–15 NSE-listed stocks
with quarterly rebalancing. Every change is documented with the full research rationale.

Available on the Basic plan and above.
    `,
  },
]

const blogListSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'withSahib Blog',
  url: 'https://withsahib.com/blog',
  description: 'Stock market research, trading education, and SEBI compliance articles by Sahib Singh Hora',
  author: {
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    url: 'https://withsahib.com',
  },
  blogPost: POSTS.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://withsahib.com/blog/${post.slug}`,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Sahib Singh Hora' },
    keywords: post.tags.join(', '),
  })),
}

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Header */}
        <section
          style={{
            padding: '80px 40px 56px',
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: '10%',
              width: 500,
              height: 350,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative' }}>
            <div className="section-tag">Research & Education</div>
            <h1
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              The withSahib{' '}
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Blog</em>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560 }}>
              In-depth articles on SEBI regulations, stock market research, trading frameworks,
              and building a systematic investment process — by Sahib Singh Hora, SEBI RA INH000026266.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section style={{ padding: '64px 40px', maxWidth: 840, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {POSTS.map((post, i) => (
              <article
                key={post.slug}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 18,
                  padding: '36px 40px',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: 'var(--emerald)',
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      background: 'rgba(0,200,150,0.08)',
                      borderRadius: 20,
                      border: '1px solid rgba(0,200,150,0.15)',
                    }}
                  >
                    {post.category}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text4)' }}>{post.dateDisplay}</span>
                  <span style={{ fontSize: 12, color: 'var(--text4)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text4)' }}>{post.readTime}</span>
                </div>

                <h2
                  style={{
                    fontFamily: 'DM Serif Display, serif',
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    fontWeight: 400,
                    color: 'var(--text)',
                    lineHeight: 1.25,
                    marginBottom: 12,
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--text2)',
                    lineHeight: 1.75,
                    marginBottom: 20,
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: 'var(--text3)',
                        padding: '3px 9px',
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Content preview */}
                <div
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '20px 24px',
                    marginBottom: 24,
                    fontSize: 14,
                    color: 'var(--text3)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                  }}
                >
                  Full article coming soon — this is a preview of the content we&#39;ll be publishing.
                  Subscribe to get notified when the complete post goes live.
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(0,200,150,0.1)',
                        border: '1px solid rgba(0,200,150,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--emerald)',
                      }}
                    >
                      S
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Sahib Singh Hora</div>
                      <div style={{ fontSize: 11, color: 'var(--text4)', fontFamily: 'Courier New, monospace', letterSpacing: 0.5 }}>SEBI RA · INH000026266</div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 20px',
                      background: 'rgba(0,200,150,0.08)',
                      border: '1px solid rgba(0,200,150,0.2)',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--emerald)',
                      textDecoration: 'none',
                    }}
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon */}
          <div
            style={{
              marginTop: 40,
              padding: '32px 36px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 8 }}>
              More articles on technical analysis, options theory, and market psychology coming weekly.
            </p>
            <Link
              href="/auth/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 22px',
                background: 'var(--emerald)',
                color: '#031A13',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Subscribe free to get notified
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
