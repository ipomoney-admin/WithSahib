'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'
import { PayButton } from '@/components/ui/PayButton'
import { createClient } from '@/lib/supabase/client'

const PRICES = { '15': 1999, '30': 2999 }
const AMOUNT_PAISE = { '15': 199900, '30': 299900 }
const PLAN_DISPLAY_NAMES = {
  '15': '15 Min Session with Sahib Singh Hora',
  '30': '30 Min Session with Sahib Singh Hora',
}
const PLAN_NAMES = { '15': 'appointment_15', '30': 'appointment_30' }

interface LoggedInUser { name: string; email: string; phone?: string }

export default function AppointmentsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null)

  const [duration, setDuration] = useState<'15' | '30'>('30')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [booked, setBooked] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const meta = data.user.user_metadata ?? {}
      const resolvedName = meta.full_name ?? meta.name ?? data.user.email?.split('@')[0] ?? ''
      setLoggedInUser({ name: resolvedName, email: data.user.email ?? '', phone: meta.phone ?? '' })
    })
  }, [supabase])

  const effectiveName  = loggedInUser ? loggedInUser.name  : name
  const effectiveEmail = loggedInUser ? loggedInUser.email : email
  const effectivePhone = loggedInUser ? (loggedInUser.phone ?? '') : phone

  const validateForm = () => {
    if (!effectiveName.trim()) return 'Please enter your full name.'
    if (!effectiveEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) return 'Please enter a valid email address.'
    return null
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    setBookingLoading(true)
    try {
      await fetch('/api/appointments/book-after-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: effectiveName.trim(),
          email: effectiveEmail.trim(),
          phone: effectivePhone.trim(),
          duration,
          preferred_date: preferredDate,
          message: message.trim(),
          razorpay_payment_id: paymentId,
          plan_name: PLAN_NAMES[duration],
        }),
      })
    } catch {
      // emails are non-critical — booking is still confirmed
    } finally {
      setBookingLoading(false)
    }
    setBooked(true)
    setName('')
    setEmail('')
    setPhone('')
    setPreferredDate('')
    setMessage('')
  }

  const handlePayClick = () => {
    const err = validateForm()
    if (err) {
      setFormError(err)
      return false
    }
    setFormError('')
    return true
  }

  if (booked) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(26,122,74,0.1)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>
            ✓
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>
            Session booked.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 32 }}>
            A confirmation has been sent to your email. Sahib will review your preferred date and send a Google Meet or Zoom link within 24 hours.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>
            Questions? Email{' '}
            <a href="mailto:connect@withsahib.com" style={{ color: 'var(--orange)', textDecoration: 'none' }}>connect@withsahib.com</a>
          </p>
        </div>
        <BookingBanner />
        <Footer />
      </div>
    )
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

        {/* Booking form */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

            {/* Identity — auto-filled if logged in, manual if not */}
            {loggedInUser ? (
              <div style={{ background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Booking as {loggedInUser.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '2px 0 0' }}>{loggedInUser.email}</p>
                </div>
                <Link href="/auth/login" style={{ fontSize: '12px', color: 'var(--text3)', textDecoration: 'underline' }}>Not you? Sign out</Link>
              </div>
            ) : (
              <>
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
                <div>
                  <label htmlFor="appt-phone" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phone</label>
                  <input id="appt-phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </>
            )}

            {/* Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: loggedInUser ? '1 / -1' : undefined }}>
                <label htmlFor="appt-date" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Preferred Date</label>
                <input id="appt-date" className="input" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="appt-message" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>What would you like to discuss?</label>
              <textarea id="appt-message" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Review my portfolio, analyse HDFC Bank chart, options strategy for expiry..." style={{ resize: 'vertical' }} />
            </div>

            {formError && <p style={{ fontSize: '13px', color: 'var(--coral)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', padding: '10px 14px', borderRadius: '8px' }}>{formError}</p>}

            <div onClick={handlePayClick}>
              <PayButton
                planName={PLAN_NAMES[duration]}
                planDisplayName={PLAN_DISPLAY_NAMES[duration]}
                amountPaise={AMOUNT_PAISE[duration]}
                onPaymentSuccess={handlePaymentSuccess}
                style={{
                  padding: '14px 28px', borderRadius: '10px',
                  background: '#FF6B00',
                  color: '#FFFFFF', border: 'none',
                  fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 6px 20px rgba(255,107,0,0.35)',
                  transition: 'all 0.2s', width: '100%',
                  opacity: bookingLoading ? 0.7 : 1,
                }}
              >
                {bookingLoading ? 'Confirming booking...' : `Pay & Book ${duration}-min session — ₹${PRICES[duration].toLocaleString('en-IN')} →`}
              </PayButton>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text4)', textAlign: 'center', lineHeight: 1.6 }}>
              Secure payment via Razorpay · All major cards, UPI, NetBanking accepted<br />
              Sessions Mon–Fri, 9 AM–5 PM IST · Google Meet or Zoom
            </p>
        </div>

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
