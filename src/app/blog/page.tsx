import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { POSTS, type Post } from '@/lib/data/posts'

export const metadata: Metadata = {
  title: 'Blog — SEBI RA Research, Intraday Picks & Trading Insights',
  description:
    'In-depth articles on SEBI registered analyst services, intraday picks NSE, Nifty options signals, Bank Nifty calls, swing trading stocks India — by Sahib Singh Hora, SEBI RA INH000026266.',
  keywords: [
    'market intelligence', 'intraday picks', 'NSE picks', 'SEBI registered analyst',
    'research analyst India', 'options trading signals', 'Nifty options signals today',
    'Bank Nifty signals', 'swing trading stocks', 'SEBI RA', 'INH000026266',
  ],
  alternates: { canonical: 'https://www.withsahib.com/blog' },
  openGraph: {
    title: 'Blog — SEBI RA Stock Market Research',
    description: 'Intraday picks, options strategies, swing trading and SEBI compliance articles by Sahib Singh Hora (INH000026266).',
    url: 'https://www.withsahib.com/blog',
  },
}

const blogListSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'withSahib Blog',
  description: 'Stock market research, intraday picks, and trading insights by SEBI RA Sahib Singh Hora',
  url: 'https://www.withsahib.com/blog',
  author: {
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    url: 'https://www.withsahib.com/about',
  },
  blogPost: POSTS.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    url: `https://www.withsahib.com/blog/${p.slug}`,
    datePublished: p.date,
    author: { '@type': 'Person', name: 'Sahib Singh Hora' },
  })),
}

const CATEGORY_COLORS: Record<string, string> = {
  Regulation: 'var(--sapphire)',
  Intraday: 'var(--emerald)',
  Options: 'var(--gold)',
  'Swing Trading': 'var(--emerald)',
  Education: 'var(--sapphire)',
  Compliance: 'var(--gold)',
}

export default function BlogPage() {
  const categories = Array.from(new Set(POSTS.map((p) => p.category)))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '80px 40px 56px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 20 }}>Blog</div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, marginBottom: 20 }}>
            Research. Insights.{' '}
            <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>Practical edge.</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            In-depth articles on Indian stock markets — intraday trading, options strategies, swing picks, and SEBI compliance — by Sahib Singh Hora (INH000026266).
          </p>
        </div>
      </section>

      {/* Category pills */}
      <section style={{ padding: '32px 40px 0' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <span key={cat} style={{
              fontSize: 12, fontWeight: 600, padding: '5px 14px',
              borderRadius: 20, border: '1px solid var(--border)',
              color: CATEGORY_COLORS[cat] ?? 'var(--text3)',
              background: 'var(--surface)',
            }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Post grid */}
      <section style={{ padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {POSTS.map((post: Post) => {
            const catColor = CATEGORY_COLORS[post.category] ?? 'var(--text3)'
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: 28, height: '100%',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                      color: catColor, textTransform: 'uppercase',
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text4)' }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--text4)' }}>{post.readTime}</span>
                  </div>
                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, fontWeight: 400, color: 'var(--text)', lineHeight: 1.3, marginBottom: 12 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ position: 'relative', width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,200,150,0.2)', flexShrink: 0 }}>
                        <Image src="/images/sahib-primary.jpg" alt="Sahib Singh Hora" fill sizes="24px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text4)' }}>{post.dateDisplay}</span>
                    </div>
                    <span style={{ fontSize: 12, color: catColor, fontWeight: 600 }}>Read →</span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div className="sebi-disclaimer container-tight" style={{ padding: '16px 20px' }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Past performance is not indicative of future results. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266 · withSahib.com
        </div>
      </div>
      <BookingBanner />$1
    </div>
  )
}
