'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const COMPLAINT_TYPES = [
  'Service Quality',
  'Billing',
  'Misconduct',
  'Other',
]

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const ESCALATION = [
  {
    level: 'Level 1',
    title: 'Internal — withSahib',
    desc: 'Email connect@withsahib.com with your complaint details. Our Compliance Officer will respond within 30 days.',
    action: 'connect@withsahib.com',
    href: 'mailto:connect@withsahib.com',
    note: 'Response within 30 days',
  },
  {
    level: 'Level 2',
    title: 'SEBI SCORES',
    desc: 'If your complaint is not resolved within 30 days, file on the SEBI SCORES portal. SEBI will facilitate resolution between you and withSahib.',
    action: 'scores.sebi.gov.in',
    href: 'https://scores.sebi.gov.in',
    note: 'If Level 1 unresolved after 30 days',
  },
  {
    level: 'Level 3',
    title: 'SMART ODR',
    desc: 'For online dispute resolution, visit SMART ODR — a free, government-backed platform for securities disputes.',
    action: 'smartodr.in',
    href: 'https://smartodr.in',
    note: 'Online dispute resolution',
  },
]

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', type: '', description: '', date: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<{ referenceId: string } | null>(null)
  const [submitError, setSubmitError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? 'Submission failed. Please email connect@withsahib.com directly.')
      } else {
        setSubmitted({ referenceId: data.referenceId })
      }
    } catch {
      setSubmitError('Network error. Please email connect@withsahib.com directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Complaints</div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px,5vw,56px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            File{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>a Complaint</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            We take all complaints seriously. Here&apos;s how to raise one.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Complaint Form */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>
              Submit a Complaint
            </h2>
            {submitted ? (
              <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 12 }}>
                <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--emerald)', marginBottom: 8 }}>Complaint Received</p>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>
                  Your complaint has been filed. We will respond within 30 days as per SEBI guidelines.
                </p>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: 13, color: 'var(--text3)' }}>
                  Reference: <strong style={{ color: 'var(--text)' }}>{submitted.referenceId}</strong>
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Name *</label>
                  <input className="input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Email *</label>
                  <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Phone</label>
                  <input className="input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 00000 00000" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Complaint Type *</label>
                  <select className="input" name="type" value={form.type} onChange={handleChange} required>
                    <option value="">Select type…</option>
                    {COMPLAINT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Description *</label>
                <textarea className="input" name="description" value={form.description} onChange={handleChange} placeholder="Describe your complaint in detail…" required rows={5} style={{ resize: 'vertical', minHeight: 120 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Date of Incident</label>
                <input className="input" type="date" name="date" value={form.date} onChange={handleChange} />
              </div>

              {submitError && (
                <p style={{ fontSize: 13, color: 'var(--coral, #f47b7b)', lineHeight: 1.6 }}>
                  {submitError}
                </p>
              )}
              <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting…' : 'Submit Complaint'}
              </Button>
            </form>
            )}
          </div>

          {/* Escalation Levels */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
              Escalation Process
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {ESCALATION.map((e, i) => (
                <div key={i} style={{ ...cardStyle, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? 'rgba(255,107,0,0.1)' : 'rgba(100,116,139,0.1)',
                    border: `1px solid ${i === 0 ? 'rgba(255,107,0,0.25)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: i === 0 ? 'var(--orange)' : 'var(--text3)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{e.level}</span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{e.title}</h3>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10 }}>{e.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <a href={e.href} target={e.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                        {e.action} →
                      </a>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{e.note}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Officer */}
          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.15)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 10 }}>Compliance Officer</p>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
              Sahib Singh Hora &middot;{' '}
              <a href="mailto:sahib13singh13@gmail.com" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>sahib13singh13@gmail.com</a>
              {' '}&middot; SEBI RA INH000026266
            </p>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
