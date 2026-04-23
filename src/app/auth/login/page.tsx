'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
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
        <h1
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: '28px',
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: '6px',
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '32px' }}>
          Sign in to your withSahib account
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', letterSpacing: '.5px', display: 'block', marginBottom: '6px' }}>
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text3)', letterSpacing: '.5px' }}>
                PASSWORD
              </label>
              <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: 'var(--emerald)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text3)' }}>
          Don't have an account?{' '}
          <Link href="/auth/register" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
            Sign up free
          </Link>
        </p>
      </div>

      <p
        style={{
          marginTop: '24px', fontSize: '11px', color: 'var(--text3)',
          fontFamily: 'Courier New, monospace', letterSpacing: '1px', textAlign: 'center',
        }}
      >
        SEBI RA · INH000026266 · Sahib Singh Hora
      </p>
      <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text4)', textAlign: 'center', maxWidth: '320px' }}>
        withSahib.com is operated by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk.
      </p>
    </div>
  )
}
