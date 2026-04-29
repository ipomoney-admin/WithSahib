'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const PRICES = { '15': 1999, '30': 2999 }

export default function AppointmentsPage() {
  const [duration, setDuration] = useState<'15' | '30'>('30')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [refId, setRefId] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Name and email are required.'); return }
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, duration, preferredDate, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setRefId(data.referenceId || '')
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed. Please email connect@withsahib.com directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div className="section-tag" style={{ marginBottom: 12 }}>1-on-1 Sessions</div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 400, color: 'var(--text)', marginBottom: '12px' }}>
            Book a session with Sahib
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7 }}>
            Personal 15 or 30-minute sessions — portfolio review, stock deep-dives, or strategy discussion. All sessions via Google Meet or Zoom.
          </p>
        </div>

        {/* Session cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          {(['15', '30'] as const).map((d) => (
            <div key={d} style={{ background: 'var(--surface)', border: `2px solid ${duration === d ? 'var(--orange)' : 'var(--border)'}`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => setDuration(d)}>
              <p style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', color: duration === d ? 'var(--orange)' : 'var(--text)', marginBottom: '4px' }}>{d} min</p>
              <p style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>₹{PRICES[d].toLocaleString('en-IN')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text3)', lineHeight: 1.5 }}>
                {d === '15' ? 'Quick review: chart analysis, one stock, or a strategy question.' : 'Deep dive: portfolio review, multiple stocks, or strategy session.'}
              </p>
            </div>
          ))}
        </div>

        {/* Booking form or success */}
        {success ? (
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(26,122,74,0.25)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(26,122,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: 'var(--text)', marginBottom: '10px' }}>Request received!</h2>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '8px' }}>
              Sahib will confirm your {duration}-minute slot within 24 hours with payment details and meeting link.
            </p>
            {refId && <p style={{ fontSize: '11px', color: 'var(--text4)', fontFamily: '"Courier New", monospace', marginBottom: '20px' }}>Ref: {refId}</p>}
            <button onClick={() => { setSuccess(false); setName(''); setEmail(''); setPhone(''); setPreferredDate(''); setMessage('') }} style={{ fontSize: '13px', color: 'var(--orange)', background: 'none', border: '1px solid var(--border2)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Book another →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '4px' }}>Request your {duration}-minute session</h2>

            {/* Duration radio */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>Duration</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['15', '30'] as const).map((d) => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 16px', borderRadius: '10px', border: `1.5px solid ${duration === d ? 'var(--orange)' : 'var(--border)'}`, background: duration === d ? 'rgba(255,107,0,0.05)' : 'var(--bg2)', flex: 1, transition: 'all 0.15s' }}>
                    <input type="radio" name="duration" value={d} checked={duration === d} onChange={() => setDuration(d)} style={{ accentColor: 'var(--orange)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: duration === d ? 'var(--orange)' : 'var(--text)' }}>{d} min — ₹{PRICES[d].toLocaleString('en-IN')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="appt-name" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                <input id="appt-name" className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" required />
              </div>
              <div>
                <label htmlFor="appt-email" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email *</label>
                <input id="appt-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rahul@example.com" required />
              </div>
            </div>

            {/* Phone + Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="appt-phone" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phone</label>
                <input id="appt-phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label htmlFor="appt-date" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Preferred Date</label>
                <input id="appt-date" className="input" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="appt-message" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>What would you like to discuss?</label>
              <textarea id="appt-message" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Review my portfolio, analyse HDFC Bank chart, options strategy for expiry..." style={{ resize: 'vertical' }} />
            </div>

            {error && <p style={{ fontSize: '13px', color: 'var(--coral)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', padding: '10px 14px', borderRadius: '8px' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 28px', borderRadius: '10px',
                background: loading ? 'rgba(255,107,0,0.5)' : '#FF6B00',
                color: '#FFFFFF', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(255,107,0,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Sending request...' : `Request ${duration}-min session — ₹${PRICES[duration].toLocaleString('en-IN')} →`}
            </button>

            <p style={{ fontSize: '11px', color: 'var(--text4)', textAlign: 'center', lineHeight: 1.6 }}>
              Payment via UPI/bank transfer — details sent after Sahib confirms your slot.<br />
              Sessions Mon–Fri, 9 AM–5 PM IST · Google Meet or Zoom
            </p>
          </form>
        )}

        {/* Manual booking note */}
        <div style={{ marginTop: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>Prefer direct contact?</strong> WhatsApp or email{' '}
            <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', textDecoration: 'none' }}>connect@withsahib.com</a>{' '}
            with your preferred date and time. You&apos;ll receive payment details and meeting link once your slot is confirmed.
          </p>
        </div>
      </div>

      <BookingBanner />
      <Footer />
    </div>
  )
}
