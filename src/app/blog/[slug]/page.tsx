import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { POSTS } from '@/lib/data/posts'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `https://www.withsahib.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.withsahib.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Sahib Singh Hora'],
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug)
  if (!post) notFound()

  const postIndex = POSTS.indexOf(post)
  const related = POSTS.filter((_, i) => i !== postIndex).slice(0, 3)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://www.withsahib.com/blog/${post.slug}`,
    datePublished: post.date,
    image: 'https://www.withsahib.com/og-image.png',
    author: {
      '@type': 'Person',
      name: 'Sahib Singh Hora',
      identifier: 'INH000026266',
    },
    publisher: {
      '@type': 'Organization',
      name: 'withSahib',
      url: 'https://www.withsahib.com',
    },
    keywords: post.tags.join(', '),
    articleBody: post.body.join(' '),
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '72px 40px 48px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--text3)', textDecoration: 'none' }}>← Blog</Link>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'var(--emerald)', textTransform: 'uppercase' }}>{post.category}</span>
          </div>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.2, marginBottom: 20 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,200,150,0.2)', flexShrink: 0 }}>
                <Image src="/images/sahib-primary.jpg" alt="Sahib Singh Hora" fill sizes="36px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Sahib Singh Hora</p>
                <p style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'Courier New, monospace' }}>SEBI RA · INH000026266</p>
              </div>
            </div>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>{post.dateDisplay}</span>
            <span style={{ color: 'var(--border2)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: '56px 40px', maxWidth: 760, margin: '0 auto' }}>
        <article>
          {post.body.map((para, i) => (
            <p key={i} style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.85, marginBottom: 24 }}>
              {para}
            </p>
          ))}
        </article>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{ fontSize: 12, padding: '4px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text3)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Author card */}
        <div style={{ marginTop: 40, padding: 28, background: 'var(--surface)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 16, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,200,150,0.2)', flexShrink: 0 }}>
            <Image src="/images/sahib-primary.jpg" alt="Sahib Singh Hora" fill sizes="56px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Sahib Singh Hora</p>
            <p style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'Courier New, monospace', marginBottom: 8 }}>SEBI Registered Research Analyst · INH000026266</p>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
              NISM certified analyst providing intraday calls, swing trade picks, options advisory, and in-depth research reports through withSahib.com.
            </p>
          </div>
        </div>

        {/* SEBI disclaimer */}
        <div className="sebi-disclaimer" style={{ marginTop: 32 }}>
          <strong style={{ color: 'var(--gold)' }}>Risk Disclaimer: </strong>
          Investments in securities market are subject to market risks. Research Analyst: Sahib Singh Hora · SEBI RA INH000026266 · withSahib.com
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ padding: '0 40px 80px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>
              More from the blog
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'block', transition: 'border-color 0.2s' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'var(--emerald)', textTransform: 'uppercase' }}>{r.category}</span>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5, marginTop: 8, marginBottom: 8 }}>{r.title}</p>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>{r.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
