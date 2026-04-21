import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'

const PLAN_IDS = {
  basic_monthly:  process.env.RAZORPAY_PLAN_BASIC_MONTHLY  ?? '',
  basic_yearly:   process.env.RAZORPAY_PLAN_BASIC_YEARLY   ?? '',
  pro_monthly:    process.env.RAZORPAY_PLAN_PRO_MONTHLY    ?? '',
  pro_yearly:     process.env.RAZORPAY_PLAN_PRO_YEARLY     ?? '',
  elite_monthly:  process.env.RAZORPAY_PLAN_ELITE_MONTHLY  ?? '',
  elite_yearly:   process.env.RAZORPAY_PLAN_ELITE_YEARLY   ?? '',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { tier, billing } = await req.json()
    if (!tier || !billing) return NextResponse.json({ error: 'Missing tier or billing' }, { status: 400 })

    const planKey = `${tier}_${billing}` as keyof typeof PLAN_IDS
    const planId = PLAN_IDS[planKey]
    if (!planId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    // Create Razorpay subscription
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64')

    const rzRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: billing === 'yearly' ? 12 : 120,
        quantity: 1,
        customer_notify: 1,
        notes: {
          user_id: session.user.id,
          email: session.user.email,
          tier,
          billing,
        },
      }),
    })

    const subscription = await rzRes.json()
    if (subscription.error) return NextResponse.json({ error: subscription.error.description }, { status: 400 })

    return NextResponse.json({ subscription_id: subscription.id })
  } catch (err) {
    console.error('Subscription create error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
