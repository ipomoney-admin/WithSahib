import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerComponentClient } from '@/lib/supabase/server'

const PLAN_AMOUNTS: Record<string, number> = {
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

    const body = await req.json()
    const planName = (body.plan_name || body.planName || '').toString().toLowerCase().trim()
    const currency = body.currency || 'INR'
    const receipt = body.receipt
    const amount = body.amount || PLAN_AMOUNTS[planName]

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Invalid plan or amount' }, { status: 400 })
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
        plan_name: planName,
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
