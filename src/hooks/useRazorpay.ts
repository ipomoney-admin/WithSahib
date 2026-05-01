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
    if (typeof (window as any).Razorpay !== 'undefined') {
      resolve(true)
      return
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true))
      existingScript.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      console.log('[Razorpay] checkout.js loaded successfully')
      resolve(true)
    }
    script.onerror = (e) => {
      console.error('[Razorpay] checkout.js failed to load:', e)
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false)

  const initiatePayment = useCallback(async (options: RazorpayOptions) => {
    setLoading(true)
    try {
      console.log('[Razorpay] initiatePayment called:', { amount: options.amount, plan: options.planName })
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
          planName: options.planName,
        }),
      })

      console.log('[Razorpay] order response status:', orderRes.status)
      const orderData = await orderRes.json()
      console.log('[Razorpay] order data:', orderData)

      if (!orderRes.ok) {
        options.onFailure(orderData.error || 'Order creation failed')
        setLoading(false)
        return
      }

      const { order_id, amount, currency } = orderData

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id,
        name: 'withSahib',
        description: options.planDisplayName,
        image: 'https://withsahib.com/logo.png',
        method: undefined,
        prefill: {
          name: options.userName,
          email: options.userEmail,
          contact: options.userPhone || '',
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi' }],
              },
            },
            sequence: ['block.utib'],
            preferences: { show_default_blocks: true },
          },
        },
        theme: { color: '#FF6B00' },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setLoading(false)
            options.onFailure('Payment cancelled')
          },
        },
        retry: { enabled: true, max_count: 3 },
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
