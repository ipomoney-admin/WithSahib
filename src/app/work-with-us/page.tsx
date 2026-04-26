'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const ROLES = [
  'Research Analyst',
  'Content & Writing',
  'Engineering / Tech',
  'Other',
]

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '24px 28px',
}

const roleCards = [
  {
    title: 'Research Analysts',
    desc: 'Deep experience in technical and/or fundamental analysis. NISM certified preferred. Must be able to write clear, structured research notes with defined entry, stop-loss, and targets.',
  },
  {
    title: 'Content & Writing',
    desc: 'Strong financial writing ability. You understand equity markets and can communicate complex ideas in plain English. Portfolio of published financial content required.',
  },
  {
    title: 'Engineering / Tech',
    desc: 'Full-stack engineers who care about product quality. Experience with Next.js, TypeScript, and financial data APIs preferred. We build tools traders actually use.',
  },
]

export default function WorkWithUsPage() {
  const [form, setForm] = useState({ name: '', email: '', role: '', why: '', portfolio: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag">Careers</div>
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
            Work with{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>withSahib.</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            We&apos;re building something different in Indian financial research. If you believe in systematic,
            accountable research — let&apos;s talk.
          </p>
        </div>
      </section>

      {/* Who we're looking for */}
      <section style={{ padding: '0 40px 60px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>
            Who we&apos;re looking for
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 56 }}>
            {roleCards.map((r) => (
              <div key={r.title} style={cardStyle}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>{r.desc}</p>
              </div>
            ))}
          </div>

          {/* What we value */}
          <div style={{ ...cardStyle, marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
              What we value
            </h2>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Precision over speed', desc: 'We publish less. What we publish is right.' },
                { label: 'Accountability over anonymity', desc: 'Every call has a name and a registration number attached.' },
                { label: 'Research over opinion', desc: 'Structured process, not gut-feel recommendations.' },
              ].map((v) => (
                <li key={v.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>{v.label}</span>
                    <span style={{ fontSize: 14, color: 'var(--text3)', marginLeft: 8 }}>{v.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Form */}
          <div style={cardStyle}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Apply
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 28 }}>
              Applications reviewed personally. We respond to every submission.
            </p>
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

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Role Interested In *</label>
                <select className="input" name="role" value={form.role} onChange={handleChange} required>
                  <option value="">Select a role…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Why you want to join *</label>
                <textarea className="input" name="why" value={form.why} onChange={handleChange} placeholder="Tell us about your background and why withSahib…" required rows={5} style={{ resize: 'vertical', minHeight: 120 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Portfolio / CV Link</label>
                <input className="input" type="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://your-portfolio.com or LinkedIn" />
              </div>

              <p style={{ fontSize: 12, color: 'var(--text3)' }}>
                Applications are reviewed at <strong>connect@withsahib.com</strong>
              </p>

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
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
