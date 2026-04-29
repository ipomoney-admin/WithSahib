'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { POSTS, type Post } from '@/lib/data/posts'

const CATEGORY_COLORS: Record<string, string> = {
  Regulation: '#2563EB',
  Intraday: 'var(--green)',
  Options: 'var(--gold)',
  'Swing Trading': 'var(--green)',
  Education: '#2563EB',
  Compliance: 'var(--gold)',
  'Market Analysis': 'var(--orange)',
  Research: 'var(--green)',
}

const ALL_CATEGORIES = ['All', 'Research', 'Options', 'Swing Trades', 'Market Analysis', 'Education']

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory || p.category.includes(activeCategory.replace('Swing Trades', 'Swing Trading')))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="section-tag" style={{ justifyContent: 'center', marginBottom: 16 }}>Blog</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 16 }}>
            Research. Insights.{' '}
            <em style={{ color: 'var(--orange)', fontStyle: 'italic', fontWeight: 400 }}>Practical edge.</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
            In-depth articles on Indian equity markets — intraday trading, options strategies, swing picks, and SEBI compliance — by Sahib Singh Hora (INH000026266).
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <section style={{ padding: '24px 40px 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                fontSize: 13,
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                background: activeCategory === cat ? 'var(--orange)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--text3)',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
                marginBottom: -1,
                borderBottom: activeCategory === cat ? 'none' : '2px solid transparent',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Post grid */}
      <section style={{ padding: '40px 40px 80px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 24 }}>
          {filtered.length === 0 && (
            <p style={{ color: 'var(--text3)', fontFamily: 'var(--font-body)', gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
              No posts in this category yet.
            </p>
          )}
          {filtered.map((post: Post) => {
            const catColor = CATEGORY_COLORS[post.category] ?? 'var(--text3)'
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                aria-label={`Read article: ${post.title}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 16, overflow: 'hidden', height: '100%',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>
                  {/* Featured image placeholder */}
                  <div style={{ height: 160, background: 'linear-gradient(135deg, #0A0A0A, #1A1A1A)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px 16px 0 0' }}>
                    <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 20, fontStyle: 'italic', color: 'rgba(255,107,0,0.18)', userSelect: 'none', letterSpacing: '-0.5px', pointerEvents: 'none' }}>withSahib</span>
                    <div style={{ position: 'absolute', top: 12, left: 16 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: catColor === 'var(--orange)' ? '#FF6B00' : catColor === 'var(--gold)' ? '#B8975A' : '#1A7A4A', textTransform: 'uppercase', background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: 4 }}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                        color: catColor, textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)',
                        background: catColor === 'var(--orange)' ? 'rgba(255,107,0,0.08)' : 'rgba(26,122,74,0.08)',
                        padding: '2px 8px', borderRadius: 4,
                      }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--font-body)' }}>{post.readTime}</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 10 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ position: 'relative', width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border2)', flexShrink: 0 }}>
                          <Image src="/images/sahib-primary.jpg" alt="Sahib Singh Hora" fill sizes="24px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--font-body)' }}>{post.dateDisplay}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </section>

      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', background: 'rgba(146,104,10,0.05)', border: '1px solid rgba(146,104,10,0.18)', borderRadius: 12, padding: '14px 20px', fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          <strong style={{ color: '#92680A' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Past performance is not indicative of future results. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266 · withSahib.com
        </div>
      </div>
      <BookingBanner />
      <Footer />
    </div>
  )
}
