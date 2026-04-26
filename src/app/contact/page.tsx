'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const SUBJECTS = [
  'General Enquiry',
  'Subscription',
  'HNI Research',
  'Media',
  'Complaint',
]

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Contact</div>
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
            Get <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>in touch.</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            Reach out for subscriptions, HNI research, media inquiries, or complaints.
          </p>
        </div>
      </section>

      {/* Form + Cards */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

          {/* Contact Form */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 28 }}>
              Send a Message
            </h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Subject</label>
                  <select className="input" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Message *</label>
                <textarea className="input" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help…" required rows={5} style={{ resize: 'vertical', minHeight: 120 }} />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 28px',
                  background: 'var(--orange)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>Email</p>
              <a href="mailto:connect@withsahib.com" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
                connect@withsahib.com
              </a>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>Response within 1–2 business days</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 10 }}>WhatsApp</p>
              <a href="https://wa.me/919981248888" target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
                +91 99812 48888
              </a>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6 }}>For Elite subscribers</p>
            </div>
          </div>

          {/* Compliance Officer */}
          <div style={{ ...cardStyle, background: 'rgba(255,107,0,0.04)', borderColor: 'rgba(255,107,0,0.15)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 10 }}>Compliance Officer</p>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
              Sahib Singh Hora &middot;{' '}
              <a href="mailto:sahib13singh13@gmail.com" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                sahib13singh13@gmail.com
              </a>
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
