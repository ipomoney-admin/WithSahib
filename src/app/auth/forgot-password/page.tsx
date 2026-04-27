'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, CheckCircle, Mail, Hash, AlertCircle } from 'lucide-react'

type Tab = 'link' | 'otp'
type OtpStage = 'email' | 'code'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('link')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [otpStage, setOtpStage] = useState<OtpStage>('email')

  const heading =
    tab === 'link' && linkSent ? 'Check your inbox' :
    tab === 'otp' && otpStage === 'code' ? 'Enter your code' :
    tab === 'link' ? 'Reset via link' : 'Reset via OTP'

  function switchTab(next: Tab) {
    setTab(next)
    setError('')
  }

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setLinkSent(true)
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setOtpStage('code')
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/auth/reset-password')
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 0',
    background: active ? 'var(--surface)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #00C896' : '2px solid transparent',
    color: active ? '#E8EDF5' : '#6B8AAA',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'var(--font-body)',
  })

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
      <div className="glow-orb glow-emerald" style={{ width: '500px', height: '400px', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />

      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <span style={{ fontSize: '22px' }}>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
          <span style={{ fontWeight: 700, color: '#00C896' }}>Sahib</span>
          <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
        </span>
      </Link>

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--surface)',
        border: '1px solid #1A2333',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 0.5s ease',
      }}>

        {/* ── RESET LINK SUCCESS ── */}
        {tab === 'link' && linkSent ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '1.5px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={24} color="#00C896" />
            </div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 400, color: '#E8EDF5', marginBottom: 10 }}>Check your inbox</p>
            <p style={{ fontSize: 14, color: '#8FA8C0', lineHeight: 1.7, marginBottom: 24 }}>
              A reset link was sent to <strong style={{ color: '#E8EDF5' }}>{email}</strong>. Click it and you&apos;ll be taken straight to the password reset page. Check your spam folder if you don&apos;t see it within a minute.
            </p>
            <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#00C896', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>

        ) : tab === 'otp' && otpStage === 'code' ? (
          /* ── OTP CODE ENTRY ── */
          <div style={{ padding: '40px' }}>
            <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B8AAA', textDecoration: 'none', marginBottom: 24 }}>
              <ArrowLeft size={13} /> Back to login
            </Link>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,200,150,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Hash size={22} color="#00C896" />
            </div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 400, color: '#E8EDF5', marginBottom: 8 }}>
              Enter your code
            </p>
            <p style={{ fontSize: 14, color: '#6B8AAA', marginBottom: 28, lineHeight: 1.6 }}>
              We sent a 6-digit code to <strong style={{ color: '#8FA8C0' }}>{email}</strong>. Enter it below to continue.
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(244,123,123,0.08)', border: '1px solid rgba(244,123,123,0.2)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--coral)' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#6B8AAA', display: 'block', marginBottom: 6 }}>
                  6-DIGIT CODE
                </label>
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoComplete="one-time-code"
                  style={{ letterSpacing: '0.3em', fontSize: 18, textAlign: 'center' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading || code.length !== 6} style={{ width: '100%', opacity: (loading || code.length !== 6) ? 0.6 : 1 }}>
                {loading ? 'Verifying…' : 'Verify Code'}
                {!loading && <ArrowRight size={16} />}
              </button>
              <button
                type="button"
                onClick={() => { setOtpStage('email'); setCode(''); setError('') }}
                style={{ background: 'none', border: 'none', color: '#6B8AAA', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}
              >
                Use a different email
              </button>
            </form>
          </div>

        ) : (
          /* ── MAIN FORM (tabs) ── */
          <>
            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1A2333' }}>
              <button style={tabStyle(tab === 'link')} onClick={() => switchTab('link')}>
                Reset Link
              </button>
              <button style={tabStyle(tab === 'otp')} onClick={() => switchTab('otp')}>
                OTP Code
              </button>
            </div>

            <div style={{ padding: '32px 40px 40px' }}>
              <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B8AAA', textDecoration: 'none', marginBottom: 24 }}>
                <ArrowLeft size={13} /> Back to login
              </Link>

              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,200,150,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                {tab === 'link' ? <Mail size={22} color="#00C896" /> : <Hash size={22} color="#00C896" />}
              </div>

              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 400, color: '#E8EDF5', marginBottom: 8 }}>
                {heading}
              </h1>
              <p style={{ fontSize: 14, color: '#6B8AAA', marginBottom: 28, lineHeight: 1.6 }}>
                {tab === 'link'
                  ? "We'll email you a secure link. Click it to set a new password."
                  : "We'll send a 6-digit code to your email. Enter it to verify, then set a new password."}
              </p>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(244,123,123,0.08)', border: '1px solid rgba(244,123,123,0.2)', borderRadius: 10, marginBottom: 16, fontSize: 13, color: 'var(--coral)' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <form onSubmit={tab === 'link' ? handleSendLink : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#6B8AAA', display: 'block', marginBottom: 6 }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? (tab === 'link' ? 'Sending link…' : 'Sending code…')
                    : (tab === 'link' ? 'Send Reset Link' : 'Send OTP Code')}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <p style={{ marginTop: 24, fontSize: 11, color: '#6B8AAA', fontFamily: 'Courier New, monospace', letterSpacing: 1, textAlign: 'center' }}>
        SEBI RA · INH000026266 · Sahib Singh Hora
      </p>
    </div>
  )
}
