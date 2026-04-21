'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings/password`,
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />

      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <span style={{ fontSize: '22px' }}>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
          <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
        </span>
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', position: 'relative', zIndex: 1, animation: 'fadeUp 0.5s ease' }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1.5px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={24} color="var(--emerald)" />
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', fontWeight: 400, color: 'var(--text)', marginBottom: '10px' }}>Check your inbox</h1>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '24px' }}>
              We've sent a password reset link to <strong style={{ color: 'var(--text)' }}>{email}</strong>. Check your spam folder if you don't see it.
            </p>
            <Link href="/auth/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '14px', color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text3)', textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s' }}>
              <ArrowLeft size={13} /> Back to login
            </Link>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,200,150,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Mail size={22} color="var(--emerald)" />
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>Reset password</h1>
            <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '28px', lineHeight: 1.6 }}>Enter your email and we'll send you a reset link.</p>
            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(244,123,123,0.08)', border: '1px solid rgba(244,123,123,0.2)', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--coral)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
