'use client'
import { useState, useCallback } from 'react'

interface RazorpayOptions {
  amount: number
  planName: string
  planDisplayName: string
  userName: string
  userEmail: string
  userPhone?: string
  onSuccess: (paymentId: string) => void
  onFailure: (error: string) => void
}

const loadScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false)

  const initiatePayment = useCallback(async (options: RazorpayOptions) => {
    setLoading(true)
    try {
      console.log('Razorpay key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'present' : 'MISSING')
      const loaded = await loadScript()
      if (!loaded) {
        options.onFailure('Payment gateway failed to load. Check internet connection.')
        setLoading(false)
        return
      }

      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: options.amount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          plan_name: options.planName,
        }),
      })

      if (!orderRes.ok) {
        const e = await orderRes.json()
        options.onFailure(e.error || 'Order creation failed')
        setLoading(false)
        return
      }

      const { order_id, amount, currency } = await orderRes.json()

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id,
        name: 'withSahib',
        description: options.planDisplayName,
        image: 'https://withsahib.com/logo.png',
        prefill: {
          name: options.userName,
          email: options.userEmail,
          contact: options.userPhone || '',
        },
        theme: { color: '#FF6B00' },
        modal: {
          ondismiss: () => {
            setLoading(false)
            options.onFailure('Payment cancelled')
          },
        },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan_name: options.planName,
              amount_paise: options.amount,
            }),
          })
          const result = await verifyRes.json()
          setLoading(false)
          if (result.success) {
            options.onSuccess(response.razorpay_payment_id)
          } else {
            options.onFailure('Payment verification failed. Contact support.')
          }
        },
      })

      rzp.on('payment.failed', (response: any) => {
        setLoading(false)
        options.onFailure(response.error?.description || 'Payment failed')
      })

      rzp.open()
    } catch {
      setLoading(false)
      options.onFailure('Unexpected error. Please try again.')
    }
  }, [])

  return { initiatePayment, loading }
}
