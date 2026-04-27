'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function PasskeyVerifyPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/admin/signals'

  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Auto-trigger on mount for smoother UX
  useEffect(() => {
    handleVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleVerify() {
    setState('loading')
    setErrorMsg('')

    try {
      // 1. Get authentication options
      const optionsRes = await fetch('/api/admin/passkey/auth-options')
      if (!optionsRes.ok) throw new Error('Failed to get authentication options')
      const options = await optionsRes.json()

      // 2. Trigger browser biometric prompt
      const { startAuthentication } = await import('@simplewebauthn/browser')
      const authentication = await startAuthentication(options)

      // 3. Verify with server
      const verifyRes = await fetch('/api/admin/passkey/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authentication }),
      })

      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        throw new Error(data.error ?? 'Verification failed')
      }

      setState('success')
      setTimeout(() => { window.location.href = redirectTo }, 800)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setErrorMsg('Touch ID was cancelled or timed out.')
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Verification failed. Please try again.')
      }
      setState('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '48px 40px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#00C896', letterSpacing: 1, marginBottom: 32, textTransform: 'uppercase' }}>
          withSahib Admin
        </div>

        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
          background: state === 'success'
            ? 'rgba(0,200,150,0.1)'
            : state === 'loading'
            ? 'rgba(0,200,150,0.05)'
            : 'rgba(0,200,150,0.08)',
          border: `1px solid ${state === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(0,200,150,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
        }}>
          {state === 'success'
            ? <ShieldCheck size={36} color="#00C896" />
            : <Fingerprint
                size={36}
                color={state === 'error' ? '#EF4444' : '#00C896'}
                style={{
                  opacity: state === 'loading' ? 0.6 : 1,
                  animation: state === 'loading' ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              />
          }
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 24, fontWeight: 700, color: 'var(--text)',
          fontFamily: 'var(--font-body)', margin: '0 0 10px',
        }}>
          {state === 'success' ? 'Verified!' : "Verify it's you"}
        </h1>

        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: '0 0 28px' }}>
          {state === 'success'
            ? 'Identity confirmed. Entering admin panel…'
            : state === 'loading'
            ? 'Waiting for Touch ID or Face ID…'
            : 'Touch ID or Face ID required to access admin panel.'
          }
        </p>

        {/* Error */}
        {state === 'error' && errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20, textAlign: 'left',
          }}>
            <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#EF4444', lineHeight: 1.5 }}>{errorMsg}</span>
          </div>
        )}

        {/* Button — show only when not loading/success */}
        {(state === 'idle' || state === 'error') && (
          <button
            onClick={handleVerify}
            style={{
              width: '100%', padding: '14px 24px', borderRadius: 12,
              background: '#00C896', border: 'none',
              color: '#000', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <Fingerprint size={18} />
            {state === 'error' ? 'Try Again' : 'Authenticate'}
          </button>
        )}

        {state === 'loading' && (
          <div style={{
            width: '100%', padding: '14px 24px', borderRadius: 12,
            background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
            color: '#00C896', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Fingerprint size={16} />
            Waiting for biometric…
          </div>
        )}

        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 20 }}>
          Session valid for 8 hours after verification.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
