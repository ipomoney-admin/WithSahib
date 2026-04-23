'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/auth/login?message=password_updated'), 2500)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <span style={{ fontSize: '22px' }}>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
          <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
        </span>
      </Link>

      {/* Card */}
      <div
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeUp 0.5s ease',
        }}
      >
        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={40} color="#00C896" style={{ marginBottom: 16 }} />
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>
              Password updated
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text3)' }}>
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: 'DM Serif Display, serif',
                fontSize: '28px',
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: '6px',
              }}
            >
              Set new password
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '32px' }}>
              Choose a strong password for your account.
            </p>

            {error && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px',
                  background: 'rgba(244,123,123,0.08)',
                  border: '1px solid rgba(244,123,123,0.2)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '13px', color: 'var(--coral)',
                }}
              >
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', letterSpacing: '.5px', display: 'block', marginBottom: '6px' }}>
                  NEW PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', letterSpacing: '.5px', display: 'block', marginBottom: '6px' }}>
                  CONFIRM PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Updating…' : 'Update Password'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text3)', marginTop: '24px' }}>
              <Link href="/auth/login" style={{ color: 'var(--emerald)', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>

      <p
        style={{
          marginTop: '24px', fontSize: '11px', color: 'var(--text3)',
          fontFamily: 'Courier New, monospace', letterSpacing: '1px', textAlign: 'center',
        }}
      >
        SEBI RA · INH000026266 · Sahib Singh Hora
      </p>
    </div>
  )
}
