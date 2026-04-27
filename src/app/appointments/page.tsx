'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { initiateSubscription } from '@/lib/razorpay/client'
import { Calendar, Clock, CheckCircle, AlertCircle, Video, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { User, Appointment } from '@/types'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

const APPOINTMENT_PRICES = { 15: 500, 30: 999 }

function getNextDays(n: number) {
  const days = []
  const today = new Date()
  let count = 0
  let d = new Date(today)
  d.setDate(d.getDate() + 1)
  while (count < n) {
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) { // skip weekends
      days.push(new Date(d))
      count++
    }
    d.setDate(d.getDate() + 1)
  }
  return days
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}
function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function AppointmentsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [duration, setDuration] = useState<15 | 30>(30)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const days = getNextDays(10)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('users').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => { if (p) setUser(p) })
      supabase.from('appointments').select('*').eq('user_id', data.user.id).order('date', { ascending: true })
        .then(({ data: appts }) => { if (appts) setMyAppointments(appts) })
    })
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    supabase.from('appointments')
      .select('time_slot')
      .eq('date', toISO(selectedDate))
      .neq('status', 'cancelled')
      .then(({ data }) => {
        setBookedSlots(data?.map((a) => a.time_slot) ?? [])
        setSelectedSlot(null)
      })
  }, [selectedDate])

  const tierLevel = { free: 0, basic: 1, pro: 2, elite: 3 }[user?.tier ?? 'free']
  const canBook = tierLevel >= 2

  async function handleBook() {
    if (!selectedDate || !selectedSlot || !user) return
    setLoading(true); setError('')

    try {
      await initiateSubscription({
        tier: 'pro',
        billing: 'monthly',
        user: { name: user.name, email: user.email, phone: user.phone },
        onSuccess: async (response, _) => {
          const { error: dbErr } = await supabase.from('appointments').insert({
            user_id: user.id,
            duration,
            date: toISO(selectedDate),
            time_slot: selectedSlot,
            topic,
            price: APPOINTMENT_PRICES[duration],
            status: 'pending',
          })
          if (dbErr) { setError(dbErr.message); setLoading(false); return }
          setSuccess(true); setLoading(false)
        },
        onDismiss: () => setLoading(false),
      })
    } catch {
      // If already pro, book directly (no payment needed beyond subscription)
      const { error: dbErr } = await supabase.from('appointments').insert({
        user_id: user.id,
        duration,
        date: toISO(selectedDate),
        time_slot: selectedSlot,
        topic,
        price: APPOINTMENT_PRICES[duration],
        status: 'pending',
      })
      if (dbErr) setError(dbErr.message)
      else setSuccess(true)
      setLoading(false)
    }
  }

  // Show the page publicly — auth check only happens at booking time
  const isLoading = user === null && typeof window !== 'undefined'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="section-tag">1-on-1 Sessions</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 400, color: 'var(--text)', marginBottom: '10px' }}>
          Book a session with Sahib
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7 }}>
          Personal 15 or 30-minute sessions — portfolio review, stock deep-dives, or strategy discussion.
          All sessions conducted via Google Meet.
        </p>
      </div>

      {/* Session types info — always visible */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        {([15, 30] as const).map((d) => (
          <div key={d} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--emerald)', fontFamily: 'Playfair Display, serif', marginBottom: '4px' }}>{d} min</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>₹{APPOINTMENT_PRICES[d]}</p>
            <p style={{ fontSize: '13px', color: 'var(--text3)', lineHeight: 1.5 }}>
              {d === 15 ? 'Quick review: chart analysis, one stock, or a strategy question.' : 'Deep dive: portfolio review, multiple stocks, or strategy session.'}
            </p>
          </div>
        ))}
      </div>

      {/* Login / upgrade gate if not authenticated or not eligible */}
      {!user ? (
        <div style={{ padding: '24px', background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '14px', marginBottom: '28px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Log in to book a session</p>
          <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '16px' }}>Create a free account or log in — then upgrade to Pro or Elite to book.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>Create Free Account</Link>
            <Link href="/auth/login" className="btn btn-ghost btn-md" style={{ textDecoration: 'none' }}>Log In</Link>
          </div>
        </div>
      ) : !canBook ? (
        <div style={{ padding: '20px 24px', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '14px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <AlertCircle size={20} color="var(--gold)" />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>Pro plan required</p>
            <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Upgrade to Pro to book appointments with Sahib.</p>
          </div>
          <Link href="/pricing?tier=pro" className="btn btn-gold btn-sm" style={{ textDecoration: 'none', flexShrink: 0 }}>
            Upgrade to Pro
          </Link>
        </div>
      ) : null}

      {success ? (
        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,200,150,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={32} color="var(--emerald)" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: 'var(--text)', marginBottom: '10px' }}>Appointment requested!</h2>
          <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '20px', lineHeight: 1.7 }}>
            {formatDate(selectedDate!)} at {selectedSlot} ({duration} min)<br />
            You&apos;ll receive a confirmation email with the meeting link within 2 hours.
          </p>
          <button onClick={() => { setSuccess(false); setSelectedDate(null); setSelectedSlot(null); setTopic('') }} className="btn btn-ghost btn-md">Book another</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left: configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Duration */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '14px' }}>Session Duration</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {([15, 30] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1, padding: '14px 10px', borderRadius: '12px', border: `1.5px solid ${duration === d ? 'var(--emerald)' : 'var(--border)'}`,
                      background: duration === d ? 'rgba(0,200,150,0.06)' : 'var(--bg2)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                    }}
                  >
                    <Clock size={18} color={duration === d ? 'var(--emerald)' : 'var(--text3)'} />
                    <span style={{ fontSize: '16px', fontWeight: 700, color: duration === d ? 'var(--emerald)' : 'var(--text)' }}>{d} min</span>
                    <span style={{ fontSize: '12px', color: 'var(--text3)' }}>₹{APPOINTMENT_PRICES[d]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '14px' }}>What would you like to discuss?</p>
              <textarea
                className="input"
                placeholder="e.g. Review my portfolio, analyse HDFC Bank chart, options strategy for expiry..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                style={{ resize: 'vertical', fontFamily: 'Outfit, sans-serif' }}
              />
            </div>

            {/* Summary */}
            {selectedDate && selectedSlot && (
              <div style={{ background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '14px', padding: '18px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--emerald)', marginBottom: '10px' }}>Booking summary</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text3)' }}>Date</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{formatDate(selectedDate)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text3)' }}>Time</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{selectedSlot} IST</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text3)' }}>Duration</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{duration} minutes</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid rgba(0,200,150,0.15)', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ color: 'var(--text3)' }}>Price</span>
                    <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>₹{APPOINTMENT_PRICES[duration]}</span>
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={!canBook || loading}
                  className="btn btn-primary btn-md"
                  style={{ width: '100%', marginTop: '14px', opacity: (!canBook || loading) ? 0.6 : 1 }}
                >
                  {loading ? 'Processing...' : 'Confirm & Pay'}
                  <ArrowRight size={15} />
                </button>
                {error && <p style={{ fontSize: '12px', color: 'var(--coral)', marginTop: '8px' }}>{error}</p>}
              </div>
            )}
          </div>

          {/* Right: date + time */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dates */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '14px' }}>Select Date</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {days.map((d, i) => {
                  const sel = selectedDate && toISO(d) === toISO(selectedDate)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d)}
                      style={{
                        padding: '8px 4px', borderRadius: '10px', border: `1.5px solid ${sel ? 'var(--emerald)' : 'var(--border)'}`,
                        background: sel ? 'rgba(0,200,150,0.08)' : 'var(--bg2)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                        fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: sel ? 'var(--emerald)' : 'var(--text3)' }}>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: sel ? 'var(--emerald)' : 'var(--text)' }}>{d.getDate()}</span>
                      <span style={{ fontSize: '9px', color: sel ? 'var(--emerald)' : 'var(--text3)' }}>{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Available Slots — {formatDate(selectedDate)}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {TIME_SLOTS.map((slot) => {
                    const booked = bookedSlots.includes(slot)
                    const sel = selectedSlot === slot
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '9px', borderRadius: '9px',
                          border: `1.5px solid ${sel ? 'var(--emerald)' : booked ? 'var(--border)' : 'var(--border2)'}`,
                          background: sel ? 'rgba(0,200,150,0.08)' : booked ? 'var(--bg)' : 'var(--bg2)',
                          cursor: booked ? 'not-allowed' : 'pointer',
                          fontSize: '13px', fontWeight: sel ? 600 : 400,
                          color: sel ? 'var(--emerald)' : booked ? 'var(--text4)' : 'var(--text2)',
                          fontFamily: 'Courier New, monospace',
                          transition: 'all 0.15s', opacity: booked ? 0.4 : 1,
                        }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '10px' }}>All times in IST · Mon–Fri only</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My appointments */}
      {myAppointments.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px' }}>Your appointments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myAppointments.map((appt) => (
              <div key={appt.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,200,150,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Video size={18} color="var(--emerald)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>{appt.topic || 'General consultation'}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{appt.date} · {appt.time_slot} IST · {appt.duration} min</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: appt.status === 'confirmed' ? 'rgba(0,200,150,0.1)' : appt.status === 'completed' ? 'rgba(100,160,255,0.1)' : 'rgba(212,168,67,0.1)', color: appt.status === 'confirmed' ? 'var(--emerald)' : appt.status === 'completed' ? 'var(--sapphire)' : 'var(--gold)' }}>
                  {appt.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      <BookingBanner />
      <Footer />
    </div>
  )
}
