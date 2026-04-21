'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Send, MessageCircle, MapPin, Clock, Shield } from 'lucide-react'

const SUBJECTS = [
  'General Inquiry',
  'Subscription / Billing',
  'Research Reports',
  'Intraday Calls',
  'Book a 1-on-1 Session',
  'Technical Support',
  'SEBI Compliance Query',
  'Partnership / Media',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    // Simulate submission — wire to real endpoint later
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('sent')
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Hero */}
        <section
          style={{
            padding: '80px 40px 56px',
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -80,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 700,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            <div className="section-tag">Get in Touch</div>
            <h1
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 400,
                color: 'var(--text)',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Contact{' '}
              <em style={{ color: 'var(--emerald)', fontStyle: 'italic' }}>withSahib</em>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 520 }}>
              Have a question about research, subscriptions, or SEBI compliance?
              Use the form below or reach out directly.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>

            {/* Left — Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* SEBI Info card */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid rgba(212,168,67,0.2)',
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Shield size={18} color="var(--gold)" strokeWidth={1.5} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase' }}>
                    SEBI Registered RA
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Analyst', value: 'Sahib Singh Hora' },
                    { label: 'SEBI Reg. No.', value: 'INH000026266' },
                    { label: 'Valid Until', value: 'April 19, 2031' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--text3)', flexShrink: 0 }}>{row.label}</span>
                      <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', fontFamily: row.label.includes('No.') || row.label === 'CIN' ? 'Courier New, monospace' : undefined }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <MapPin size={18} color="var(--emerald)" strokeWidth={1.5} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--text3)', textTransform: 'uppercase' }}>
                    Registered Address
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Sahib Singh Hora<br />
                  Madhya Pradesh, India
                </p>
              </div>

              {/* WhatsApp */}
              <div
                style={{
                  background: 'rgba(0,200,150,0.05)',
                  border: '1px solid rgba(0,200,150,0.15)',
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <MessageCircle size={18} color="var(--emerald)" strokeWidth={1.5} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--emerald)', textTransform: 'uppercase' }}>
                    WhatsApp (Elite)
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>
                  Elite subscribers receive direct WhatsApp alerts and can message for urgent queries.
                </p>
                <Link
                  href="/pricing?tier=elite"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--emerald)',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    background: 'rgba(0,200,150,0.08)',
                    borderRadius: 8,
                    border: '1px solid rgba(0,200,150,0.2)',
                  }}
                >
                  Upgrade to Elite →
                </Link>
              </div>

              {/* Response time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <Clock size={16} color="var(--text3)" strokeWidth={1.5} />
                <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                  Typical response time: <strong style={{ color: 'var(--text2)' }}>1–2 business days</strong>
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 40,
              }}
            >
              {status === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'rgba(0,200,150,0.1)',
                      border: '1px solid rgba(0,200,150,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      margin: '0 auto 20px',
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontSize: 26,
                      fontWeight: 400,
                      color: 'var(--text)',
                      marginBottom: 10,
                    }}
                  >
                    Message sent!
                  </h3>
                  <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7 }}>
                    Thanks for reaching out. We&#39;ll get back to you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2
                    style={{
                      fontFamily: 'DM Serif Display, serif',
                      fontSize: 26,
                      fontWeight: 400,
                      color: 'var(--text)',
                      marginBottom: 28,
                    }}
                  >
                    Send a message
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Name + Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                          Name *
                        </label>
                        <input
                          className="input"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                          Email *
                        </label>
                        <input
                          className="input"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                        Subject
                      </label>
                      <select
                        className="input"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Select a topic…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                        Message *
                      </label>
                      <textarea
                        className="input"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what you need..."
                        required
                        rows={6}
                        style={{ resize: 'vertical', minHeight: 140 }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '13px 28px',
                        background: status === 'sending' ? 'var(--emerald-deep)' : 'var(--emerald)',
                        color: '#031A13',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Send size={15} />
                      {status === 'sending' ? 'Sending…' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}

              {/* SEBI disclaimer */}
              <div className="sebi-disclaimer" style={{ marginTop: 24 }}>
                <strong style={{ color: 'var(--gold)' }}>Disclaimer: </strong>
                withSahib.com is operated by Sahib Singh Hora, SEBI Registered Research Analyst
                (INH000026266). Research provided is general in nature and not personalised financial
                advice. Investments are subject to market risks.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
