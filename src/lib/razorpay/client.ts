// ─── RAZORPAY CLIENT UTILITIES ────────────────────────────────────────────────
// Used in client components to initiate payment

export const RAZORPAY_PLANS = {
  basic_monthly:  process.env.NEXT_PUBLIC_RAZORPAY_PLAN_BASIC_MONTHLY  ?? '',
  basic_yearly:   process.env.NEXT_PUBLIC_RAZORPAY_PLAN_BASIC_YEARLY   ?? '',
  pro_monthly:    process.env.NEXT_PUBLIC_RAZORPAY_PLAN_PRO_MONTHLY    ?? '',
  pro_yearly:     process.env.NEXT_PUBLIC_RAZORPAY_PLAN_PRO_YEARLY     ?? '',
  elite_monthly:  process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ELITE_MONTHLY  ?? '',
  elite_yearly:   process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ELITE_YEARLY   ?? '',
}

export const PLAN_PRICES = {
  basic:  { monthly: 99900,  yearly: 79900  },  // in paise
  pro:    { monthly: 249900, yearly: 199900 },
  elite:  { monthly: 599900, yearly: 479900 },
}

export interface RazorpayOptions {
  key: string
  subscription_id: string
  name: string
  description: string
  prefill: { name: string; email: string; contact?: string }
  theme: { color: string }
  handler: (response: RazorpayResponse) => void
  modal: { ondismiss: () => void }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_subscription_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, any>) => {
      open(): void
      on(event: string, handler: (response: any) => void): void
    }
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(false); return }
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiateSubscription({
  tier,
  billing,
  user,
  onSuccess,
  onDismiss,
}: {
  tier: 'basic' | 'pro' | 'elite'
  billing: 'monthly' | 'yearly'
  user: { name: string; email: string; phone?: string }
  onSuccess: (response: RazorpayResponse, subscriptionId: string) => void
  onDismiss: () => void
}) {
  const loaded = await loadRazorpayScript()
  if (!loaded) throw new Error('Razorpay failed to load')

  // Create subscription via API
  const res = await fetch('/api/subscriptions/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, billing }),
  })
  const { subscription_id, error } = await res.json()
  if (error) throw new Error(error)

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    subscription_id,
    name: 'withSahib',
    description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan — ${billing}`,
    prefill: { name: user.name, email: user.email, contact: user.phone },
    theme: { color: '#00C896' },
    handler: (response) => onSuccess(response, subscription_id),
    modal: { ondismiss: onDismiss },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}
