'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'

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

  const scrollCards = [
    // Card 1 — Signal example
    <div key="signal" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(0,217,126,0.15)', color: '#00D97E', padding: '3px 8px', borderRadius: '4px', letterSpacing: '1px' }}>BUY · INTRADAY</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier New, monospace' }}>NSE · 9:14 AM</span>
      </div>
      <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'Courier New, monospace' }}>RELIANCE</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { l: 'ENTRY', v: '₹2,840–2,860', c: '#fff' },
          { l: 'TARGET 1', v: '₹2,920 (+2.8%)', c: '#00D97E' },
          { l: 'TARGET 2', v: '₹2,960 (+3.5%)', c: '#00D97E' },
          { l: 'STOP LOSS', v: '₹2,800 (–1.4%)', c: '#F87171' },
        ].map((p) => (
          <div key={p.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', marginBottom: '3px' }}>{p.l}</p>
            <p style={{ fontSize: '11px', fontWeight: 700, color: p.c, fontFamily: 'Courier New, monospace' }}>{p.v}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '12px', lineHeight: 1.5 }}>Breakout above 20-day resistance on elevated volume. RSI divergence confirms. Entry on pullback to breakout zone.</p>
    </div>,

    // Card 2 — How it works
    <div key="how" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#00D97E', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Research Process</p>
      {[
        { n: '01', t: 'Pre-market analysis by 8:30 AM', d: 'Global cues, FII/DII data, and 1500+ stock scans before the market opens.' },
        { n: '02', t: 'Only highest-conviction setups', d: '1–3 calls per session maximum. Quality over quantity, every trading day.' },
        { n: '03', t: 'Full rationale with every call', d: 'Entry range, two targets, stop-loss, and written reasoning. You understand the trade before you take it.' },
      ].map((s) => (
        <div key={s.n} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', color: 'rgba(0,217,126,0.25)', lineHeight: 1, flexShrink: 0, width: '28px' }}>{s.n}</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>{s.t}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{s.d}</p>
          </div>
        </div>
      ))}
    </div>,

    // Card 3 — Pro plan features
    <div key="plan" style={{ background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Pro Plan</p>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#00D97E', fontFamily: 'Courier New, monospace' }}>₹2,499/mo</span>
      </div>
      {['Daily intraday picks — published before 9 AM', 'Nifty & Bank Nifty options signals', 'Swing trading research 3–5/week', 'In-depth research reports', 'SEBI RA INH000026266 — fully compliant'].map((f) => (
        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: '#00D97E', fontWeight: 700, fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>✓</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{f}</span>
        </div>
      ))}
    </div>,

    // Card 4 — Founder quote
    <div key="founder" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,217,126,0.15)', border: '1px solid rgba(0,217,126,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={18} color="#00D97E" />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Sahib Singh Hora</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier New, monospace' }}>SEBI RA · INH000026266</p>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontStyle: 'italic' }}>
        &ldquo;Every recommendation published under INH000026266 is individually named, publicly verifiable, and legally accountable. That is the structural difference between a registered research house and an anonymous channel.&rdquo;
      </p>
    </div>,

    // Card 5 — Track record rows
    <div key="track" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Performance Disclosure · May 2026+</p>
      {[
        { s: 'HDFC BANK', r: 'T1 HIT', g: '+2.3%', c: '#00D97E' },
        { s: 'INFY', r: 'T2 HIT', g: '+4.1%', c: '#00D97E' },
        { s: 'TATA MOTORS', r: 'SL HIT', g: '–1.2%', c: '#F87171' },
        { s: 'WIPRO', r: 'T1 HIT', g: '+1.8%', c: '#00D97E' },
      ].map((row) => (
        <div key={row.s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: 'Courier New, monospace' }}>{row.s}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>{row.r}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: row.c, fontFamily: 'Courier New, monospace' }}>{row.g}</span>
        </div>
      ))}
    </div>,
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* LEFT — Login form (fixed 480px) */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          flexShrink: 0,
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '40px' }}>
            <span style={{ fontSize: '22px' }}>
              <span style={{ fontWeight: 300, color: 'var(--text)' }}>with</span>
              <span style={{ fontWeight: 700, color: 'var(--emerald)' }}>Sahib</span>
              <span style={{ fontWeight: 300, color: 'var(--text)' }}>.com</span>
            </span>
          </Link>

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
                background: 'rgba(220,38,38,0.06)',
                border: '1px solid rgba(220,38,38,0.18)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text3)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
              Sign up free
            </Link>
          </p>

          <p style={{ marginTop: '32px', fontSize: '11px', color: 'var(--text4)', fontFamily: 'Courier New, monospace', letterSpacing: '1px', textAlign: 'center' }}>
            SEBI RA · INH000026266 · Sahib Singh Hora
          </p>
        </div>
      </div>

      {/* RIGHT — Animated showcase panel (desktop only) */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          background: 'var(--navy)',
          overflow: 'hidden',
          position: 'relative',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top + bottom fade masks */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, var(--navy), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, var(--navy), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        {/* Header overlay */}
        <div style={{ position: 'absolute', top: '28px', left: '32px', right: '32px', zIndex: 3 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '6px' }}>Systematic Equity Research</p>
          <p style={{ fontSize: '20px', fontFamily: 'DM Serif Display, serif', color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>Where rigour meets the market.</p>
        </div>

        {/* Scrolling cards — infinite loop */}
        <div style={{ padding: '120px 32px 120px', height: '100%' }}>
          <div className="scroll-panel">
            {[...scrollCards, ...scrollCards]}
          </div>
        </div>
      </div>

    </div>
  )
}
