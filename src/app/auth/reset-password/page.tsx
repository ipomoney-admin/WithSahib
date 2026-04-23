'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
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
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth/login')
      } else {
        setSessionReady(true)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  const eyeBtn: React.CSSProperties = {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#6B8AAA',
    display: 'flex', alignItems: 'center',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: '10%', left: '50%', transform: 'translateX(-50%)' }} />

      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <span style={{ fontSize: '22px' }}>
          <span style={{ fontWeight: 300, color: '#E8EDF5' }}>with</span>
          <span style={{ fontWeight: 700, color: '#00C896' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: '#E8EDF5' }}>.com</span>
        </span>
      </Link>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#141F2E',
        border: '1px solid #1A2333',
        borderRadius: '24px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 0.5s ease',
      }}>
        {!sessionReady && !done ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B8AAA', fontSize: 14 }}>
            Verifying session…
          </div>
        ) : done ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1.5px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={28} color="#00C896" />
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', fontWeight: 400, color: '#E8EDF5', marginBottom: 8 }}>
              Password updated successfully
            </h1>
            <p style={{ fontSize: 14, color: '#8FA8C0', lineHeight: 1.6 }}>
              Taking you to your dashboard…
            </p>
          </div>
        ) : (
          <>
            <h1 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: '28px',
              fontWeight: 400,
              color: '#E8EDF5',
              marginBottom: '8px',
            }}>
              Set a New Password
            </h1>
            <p style={{ fontSize: 14, color: '#8FA8C0', marginBottom: 32, lineHeight: 1.6 }}>
              Choose a strong password for your withSahib account. This step is required to continue.
            </p>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px',
                background: 'rgba(244,123,123,0.08)',
                border: '1px solid rgba(244,123,123,0.2)',
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 13, color: 'var(--coral)',
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#6B8AAA', display: 'block', marginBottom: 6 }}>
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
                  <button type="button" onClick={() => setShowPass(!showPass)} style={eyeBtn}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#6B8AAA', display: 'block', marginBottom: 6 }}>
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
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: 8, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Updating…' : 'Update Password'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6B8AAA', marginTop: 24 }}>
              <Link href="/auth/login" style={{ color: '#00C896', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>

      <p style={{
        marginTop: 24, fontSize: 11, color: '#6B8AAA',
        fontFamily: 'Courier New, monospace', letterSpacing: 1, textAlign: 'center',
      }}>
        SEBI RA · INH000026266 · Sahib Singh Hora
      </p>
    </div>
  )
}
