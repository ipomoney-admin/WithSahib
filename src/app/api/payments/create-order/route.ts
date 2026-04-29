import { NextRequest, NextResponse } from 'next/server'

// Amounts in paise (INR × 100)
const PLAN_PRICES: Record<string, number> = {
  positional: 399900,
  pro: 699900,
  elite: 1249900,
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json() as { plan: string }

    const amount = PLAN_PRICES[plan]
    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan. Must be positional, pro, or elite.' }, { status: 400 })
    }

    // TODO: Initialize Razorpay once keys are available
    // import Razorpay from 'razorpay'
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // })
    // const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `order_${Date.now()}` })
    // return NextResponse.json({ orderId: order.id, amount, currency: 'INR', plan })

    return NextResponse.json({
      message: 'Payment integration coming soon. Contact connect@withsahib.com to subscribe.',
      plan,
      amount,
      currency: 'INR',
      TODO: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables',
    })
  } catch (error) {
    console.error('Payment order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
