import Link from 'next/link'

export function BookingBanner() {
  return (
    <div
      style={{
        background: '#FF6B00',
        padding: '28px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            Book a 1-on-1 session with Sahib
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.82)',
              fontWeight: 400,
            }}
          >
            30-minute strategy call — limited slots — SEBI Registered Analyst
          </p>
        </div>
        <Link
          href="/appointments"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 32px',
            background: '#FFFFFF',
            color: '#FF6B00',
            borderRadius: '10px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 700,
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
        >
          Book Now →
        </Link>
      </div>
    </div>
  )
}
