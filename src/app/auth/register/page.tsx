'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const pw = form.password
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : 3

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please accept the terms and risk disclaimer.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, phone: form.phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
    else {
      // Send branded welcome email (fire-and-forget — don't block redirect on failure)
      const firstName = form.name.split(' ')[0] ?? form.name
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, firstName }),
      }).catch(() => {/* non-blocking */})
      router.push('/dashboard')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="glow-orb glow-emerald" style={{ width: '600px', height: '400px', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />

      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <span style={{ fontSize: '22px' }}>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
          <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
        </span>
      </Link>

      <div
        style={{
          width: '100%', maxWidth: '460px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '24px', padding: '40px',
          position: 'relative', zIndex: 1,
          animation: 'fadeUp 0.5s ease',
        }}
      >
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '28px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '32px' }}>
          Free forever. No credit card required.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(244,123,123,0.08)', border: '1px solid rgba(244,123,123,0.2)', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: 'var(--coral)' }}>
            <AlertCircle size={14} />{error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'name', label: 'FULL NAME', type: 'text', placeholder: 'Rahul Sharma' },
            { key: 'email', label: 'EMAIL ADDRESS', type: 'email', placeholder: 'you@example.com' },
            { key: 'phone', label: 'PHONE NUMBER (OPTIONAL)', type: 'tel', placeholder: '+91 98765 43210' },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                className="input"
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required={field.key !== 'phone'}
              />
            </div>
          ))}

          {/* Password with strength */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                style={{ paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pw.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: strength >= s ? (strength === 1 ? 'var(--coral)' : strength === 2 ? 'var(--gold)' : 'var(--emerald)') : 'var(--border)', transition: 'background 0.2s' }} />
                ))}
              </div>
            )}
          </div>

          {/* Agreement */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => setAgreed(!agreed)}
              style={{
                width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                border: `1.5px solid ${agreed ? 'var(--emerald)' : 'var(--border2)'}`,
                background: agreed ? 'rgba(0,200,150,0.12)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1px', transition: 'all 0.2s',
              }}
            >
              {agreed && <Check size={11} color="var(--emerald)" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6 }}>
              I have read and agree to the{' '}
              <Link href="/terms" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>Terms of Service</Link>,{' '}
              <Link href="/privacy" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>Privacy Policy</Link>, and understand that
              investments are subject to market risk. SEBI RA INH000026266.
            </span>
          </label>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Free Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text3)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
