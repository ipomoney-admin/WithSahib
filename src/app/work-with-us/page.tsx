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

export default function WorkWithUsPage() {
  const [form, setForm] = useState({ name: '', email: '', role: '', about: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '72px 40px 56px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 24 }}>Careers</div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.05,
              marginBottom: 0,
            }}
          >
            Work<br />
            <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>Withsahib.</em>
          </h1>
        </div>
      </section>

      {/* Description */}
      <section style={{ padding: '0 40px 64px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '40px 44px',
            marginBottom: 32,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.25,
              marginBottom: 20,
            }}>
              We&apos;re looking for one thing.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
              People who are obsessed with getting it right. Not fast. Right. If you&apos;ve spent years building a process — in research, writing, or engineering — and you believe financial analysis should be structured, accountable, and honest, we want to talk.
            </p>
            <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>
              We don&apos;t hire for speed. We hire for standard.
            </p>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(26,122,74,0.07)', border: '1px solid rgba(26,122,74,0.18)',
            borderRadius: 10, padding: '12px 18px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text)' }}>Research Analyst applicants:</strong> NISM Series XV certification is mandatory. Applications without it will not be reviewed.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '40px 44px',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                  Application received.
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
                  We review every application personally and respond to each one. We&apos;ll be in touch at <strong>{form.email}</strong>.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Apply
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 32, fontFamily: 'var(--font-body)' }}>
                  We respond to every submission.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Name *</label>
                      <input
                        className="input"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Email *</label>
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

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-body)' }}>Role *</label>
                    <select
                      className="input"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a role…</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
                      2–3 lines about yourself *
                    </label>
                    <textarea
                      className="input"
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      placeholder="What you've built, what you care about, and why you want to work here."
                      required
                      rows={5}
                      style={{ resize: 'vertical', minHeight: 120 }}
                    />
                  </div>

                  <div style={{ paddingTop: 4 }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        padding: '13px 32px',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      Submit Application →
                    </button>
                    <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 12, fontFamily: 'var(--font-body)' }}>
                      Reviewed at <strong style={{ color: 'var(--text2)' }}>connect@withsahib.com</strong>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <BookingBanner />
      <Footer />
    </div>
  )
}
