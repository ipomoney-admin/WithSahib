'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PLAN_LABELS: Record<string, string> = {
  positional: 'Positional',
  pro: 'Pro',
  elite: 'Elite',
  appointment_15: '15-Min Session',
  appointment_30: '30-Min Session',
  hni: 'HNI',
  mentorship: 'Mentorship',
}

export function PaymentSuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [planLabel, setPlanLabel] = useState('')

  useEffect(() => {
    const payment = searchParams.get('payment')
    const plan = searchParams.get('plan')
    if (payment === 'success' && plan) {
      setPlanLabel(PLAN_LABELS[plan] || plan)
      setShow(true)
      router.replace('/dashboard')
      const t = setTimeout(() => setShow(false), 6000)
      return () => clearTimeout(t)
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
      background: '#1A7A4A', color: '#FFFFFF',
      padding: '16px 22px', borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(26,122,74,0.35)',
      fontSize: '14px', fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: '10px',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '360px',
    }}>
      <span style={{ fontSize: '20px' }}>🎉</span>
      <div>
        <div style={{ fontWeight: 700, marginBottom: '2px' }}>Payment successful!</div>
        <div style={{ opacity: 0.9 }}>Your {planLabel} plan is now active.</div>
      </div>
      <button
        onClick={() => setShow(false)}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '18px', marginLeft: 'auto', padding: '0 0 0 8px' }}
      >
        ×
      </button>
    </div>
  )
}
