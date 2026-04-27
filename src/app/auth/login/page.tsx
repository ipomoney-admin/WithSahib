'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'

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
    <>
      <style>{`
        @keyframes loginBarIn {
          0%   { transform: scaleY(0); opacity: 0; }
          70%  { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes loginBarPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes loginDotPop {
          0%   { transform: scale(0); opacity: 0; }
          65%  { transform: scale(1.35); opacity: 1; }
          82%  { transform: scale(0.88); }
          100% { transform: scale(1); opacity: 1; }
        }
        .login-bar {
          transform-origin: bottom center;
          animation: loginBarIn 0.5s cubic-bezier(0.22,1,0.36,1) both,
                     loginBarPulse 3s ease-in-out 1s infinite;
        }
        .login-bar-1 { animation-delay: 0s, 1.0s; }
        .login-bar-2 { animation-delay: 0.15s, 1.4s; }
        .login-bar-3 { animation-delay: 0.30s, 1.8s; }
        .login-dot { animation: loginDotPop 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.65s both; }
        @media (max-width: 768px) {
          .login-left-col { display: none !important; }
          .login-right-col { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>

      <div style={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — Orange brand column */}
        <div
          className="login-left-col"
          style={{
            flex: '0 0 50%',
            background: '#FF6B00',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background texture dots */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
            {/* Animated logo mark */}
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'center' }}>
              <LoopLogoMark />
            </div>

            {/* Wordmark */}
            <div style={{ fontSize: '44px', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', color: 'rgba(255,255,255,0.85)', fontWeight: 300 }}>with</span>
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FFFFFF' }}>Sahib</span>
            </div>

            {/* Tagline */}
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontSize: '20px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4, marginBottom: '40px' }}>
              Real research. Every trading day.
            </p>

            {/* Trust chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              {[
                'Daily calls before 9:00 AM',
                'Entry · Target · Stop-loss · Rationale',
                'SEBI Registered Analyst',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, system-ui, sans-serif' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom SEBI text */}
          <p style={{ position: 'absolute', bottom: '28px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '1px' }}>
            SEBI RA · INH000026266
          </p>
        </div>

        {/* RIGHT — Form column */}
        <div
          className="login-right-col"
          style={{
            flex: '0 0 50%',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 40px',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px' }}>
            {/* Mobile logo (only shows when left col is hidden) */}
            <div className="show-mobile" style={{ marginBottom: '32px' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogoMark size={24} animated={false} />
                <span style={{ fontSize: '20px' }}>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', color: 'var(--text)', fontWeight: 400 }}>with</span>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
                </span>
              </Link>
            </div>

            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '30px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
              Sign in
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Access your research dashboard
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: '#DC2626' }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', letterSpacing: '.5px', display: 'block', marginBottom: '6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', letterSpacing: '.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    PASSWORD
                  </label>
                  <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: '#FF6B00', textDecoration: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}>
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
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  marginTop: '8px',
                  background: loading ? '#374151' : '#0A0A0A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#FF6B00' }}
                onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#0A0A0A' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, system-ui, sans-serif' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border2)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 600 }}>
                Start free →
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

function LoopLogoMark() {
  const size = 64
  const barW = Math.round(size * 0.18)
  const gap = Math.round(size * 0.12)
  const dotR = Math.round(size * 0.12)
  const heights = [size * 0.38, size * 0.60, size * 0.88]
  const totalBarsW = barW * 3 + gap * 2
  const svgW = totalBarsW + dotR * 2 + gap

  return (
    <svg
      width={svgW}
      height={size}
      viewBox={`0 0 ${svgW} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <rect
        className="login-bar login-bar-1"
        x={0}
        y={size - (heights[0] ?? 0)}
        width={barW}
        height={heights[0] ?? 0}
        rx={barW * 0.35}
        fill="rgba(255,255,255,0.45)"
      />
      <rect
        className="login-bar login-bar-2"
        x={barW + gap}
        y={size - (heights[1] ?? 0)}
        width={barW}
        height={heights[1] ?? 0}
        rx={barW * 0.35}
        fill="rgba(255,255,255,0.72)"
      />
      <rect
        className="login-bar login-bar-3"
        x={(barW + gap) * 2}
        y={size - (heights[2] ?? 0)}
        width={barW}
        height={heights[2] ?? 0}
        rx={barW * 0.35}
        fill="#FFFFFF"
      />
      <circle
        className="login-dot"
        cx={totalBarsW + gap + dotR}
        cy={size * 0.12}
        r={dotR}
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  )
}
