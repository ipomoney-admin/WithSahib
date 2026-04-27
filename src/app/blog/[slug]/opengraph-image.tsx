import { ImageResponse } from 'next/og'
import { POSTS } from '@/lib/data/posts'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function BlogPostOGImage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug)
  const title = post?.title ?? 'withSahib — Equity Research'
  const category = post?.category ?? 'Research'
  const readTime = post?.readTime ?? ''

  const titleSize = title.length > 70 ? 38 : title.length > 50 ? 44 : 50

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#080D0A',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '56px 72px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Emerald glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 560,
            height: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,200,150,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Category + readTime pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(0,200,150,0.12)',
              border: '1px solid rgba(0,200,150,0.35)',
              borderRadius: 8,
              padding: '6px 18px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#00C896',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {category}
          </div>
          {readTime && (
            <div
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: 1,
                display: 'flex',
              }}
            >
              {readTime}
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: '#E8EDF5',
            lineHeight: 1.2,
            marginBottom: 40,
            maxWidth: 960,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {title}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 48,
            height: 2,
            background: '#00C896',
            marginBottom: 28,
            display: 'flex',
          }}
        />

        {/* Author row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#E8EDF5',
                letterSpacing: 0.3,
                display: 'flex',
              }}
            >
              Sahib Singh Hora
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#D4A843',
                letterSpacing: 1.5,
                display: 'flex',
              }}
            >
              SEBI RA · INH000026266
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '10px 24px',
              fontSize: 15,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 0.5,
              display: 'flex',
            }}
          >
            withsahib.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
