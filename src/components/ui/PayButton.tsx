'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRazorpay } from '@/hooks/useRazorpay'
import { createClient } from '@/lib/supabase/client'

interface PayButtonProps {
  planName: string
  planDisplayName: string
  amountPaise: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onPaymentSuccess?: (paymentId: string) => void
  couponCode?: string
}

export function PayButton({ planName, planDisplayName, amountPaise, className, style, children, onPaymentSuccess, couponCode }: PayButtonProps) {
  const { initiatePayment, loading } = useRazorpay()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handlePay = async () => {
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('PayButton clicked, user:', user?.email, 'amount:', amountPaise)
      if (!user) { router.push('/auth/login?redirect=/pricing'); return }

      await initiatePayment({
        amount: amountPaise,
        planName: planName.toLowerCase().trim(),
        planDisplayName,
        userName: user.user_metadata?.full_name || user.email || '',
        userEmail: user.email || '',
        couponCode: couponCode || undefined,
        onSuccess: (paymentId: string) => {
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentId)
          } else {
            router.push(`/dashboard?payment=success&plan=${planName}`)
          }
        },
        onFailure: (err) => {
          if (err !== 'Payment cancelled') setError(err)
        },
      })
    } catch (err: any) {
      setError(err?.message || 'Payment failed to initialize')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className={className}
        style={{ ...style, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Processing...' : (children || 'Subscribe Now')}
      </button>
      {error && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>{error}</p>
      )}
    </div>
  )
}
