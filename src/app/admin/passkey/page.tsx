'use client'

import { useState } from 'react'
import { Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function PasskeySetupPage() {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSetup() {
    setState('loading')
    setErrorMsg('')

    try {
      // 1. Get registration options
      const optionsRes = await fetch('/api/admin/passkey/register-options')
      if (!optionsRes.ok) throw new Error('Failed to get registration options')
      const options = await optionsRes.json()

      // 2. Trigger browser biometric prompt
      const { startRegistration } = await import('@simplewebauthn/browser')
      const registration = await startRegistration(options)

      // 3. Determine device name
      const ua = navigator.userAgent
      const deviceName = ua.includes('iPhone') ? 'iPhone'
        : ua.includes('iPad') ? 'iPad'
        : ua.includes('Mac') ? 'Mac'
        : 'Device'

      // 4. Verify with server
      const verifyRes = await fetch('/api/admin/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration, deviceName }),
      })

      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        throw new Error(data.error ?? 'Verification failed')
      }

      setState('success')
      setTimeout(() => { window.location.href = '/admin/signals' }, 1200)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setErrorMsg('Touch ID was cancelled. Try again.')
      } else if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Something went wrong. Please try again.')
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
        width: '100%', maxWidth: 420,
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
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
          background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {state === 'success'
            ? <ShieldCheck size={32} color="#00C896" />
            : <Fingerprint size={32} color="#00C896" />
          }
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 22, fontWeight: 700, color: 'var(--text)',
          fontFamily: 'var(--font-body)', margin: '0 0 10px',
        }}>
          {state === 'success' ? 'All set!' : 'Set up Touch ID / Face ID'}
        </h1>

        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: '0 0 32px' }}>
          {state === 'success'
            ? 'Passkey registered. Redirecting to admin…'
            : 'Protect your admin panel with biometric authentication. Your fingerprint or face never leaves your device.'
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

        {/* Button */}
        {state !== 'success' && (
          <button
            onClick={handleSetup}
            disabled={state === 'loading'}
            style={{
              width: '100%', padding: '14px 24px', borderRadius: 12,
              background: state === 'loading' ? 'rgba(0,200,150,0.4)' : '#00C896',
              border: 'none', color: '#000', fontSize: 15, fontWeight: 700,
              cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'opacity 0.15s',
            }}
          >
            <Fingerprint size={18} />
            {state === 'loading' ? 'Waiting for Touch ID…' : 'Set Up Touch ID / Face ID'}
          </button>
        )}

        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 20, lineHeight: 1.5 }}>
          Uses your device Secure Enclave. Biometric data never leaves your device.
        </p>
      </div>
    </div>
  )
}
