import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerComponentClient } from '@/lib/supabase/server'

const PLAN_PRICES: Record<string, number> = {
  positional: 399900,
  pro: 699900,
  elite: 1249900,
  hni: 999900,
  appointment_15: 199900,
  appointment_30: 299900,
  course_foundations: 2499900,
  course_options: 3499900,
  course_research: 4499900,
  mentorship: 7499900,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount, currency = 'INR', receipt, plan_name } = await req.json() as {
      amount: number
      currency?: string
      receipt?: string
      plan_name: string
    }

    const normalizedPlan = (plan_name as string ?? '').toLowerCase().trim()
    if (!normalizedPlan || !PLAN_PRICES[normalizedPlan]) {
      return NextResponse.json({ error: `Invalid plan: "${plan_name}". Valid plans: ${Object.keys(PLAN_PRICES).join(', ')}` }, { status: 400 })
    }

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Invalid amount. Must be at least 100 paise.' }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        plan_name: normalizedPlan,
        user_id: session.user.id,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Payment order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
