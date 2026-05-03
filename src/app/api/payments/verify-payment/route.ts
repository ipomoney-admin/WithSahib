import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerComponentClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_name,
      amount_paise,
      coupon_code,
    } = await req.json() as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      plan_name: string
      amount_paise: number
      coupon_code?: string | null
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan_name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = createServerComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const serviceClient = createServiceRoleClient()
    const { error: insertError } = await serviceClient.from('payments').insert({
      user_id: session.user.id,
      plan_name,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount_paise: amount_paise ?? 0,
      status: 'verified',
    })

    if (insertError) {
      console.error('Payment insert error:', insertError)
      return NextResponse.json({ success: false, error: 'Failed to record payment' }, { status: 500 })
    }

    // Record coupon use if a coupon was applied
    if (coupon_code) {
      await serviceClient.from('coupon_uses').insert({
        coupon_code: coupon_code.toUpperCase().trim(),
        user_id: session.user.id,
        payment_id: razorpay_payment_id,
      })
    }

    return NextResponse.json({ success: true, payment_id: razorpay_payment_id })
  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
