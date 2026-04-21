import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

  // Verify signature
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (expected !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = createServiceRoleClient()

  const { event: eventType, payload } = event
  const subscription = payload?.subscription?.entity
  const payment = payload?.payment?.entity

  if (!subscription) return NextResponse.json({ ok: true })

  const notes = subscription.notes ?? {}
  const userId = notes.user_id
  const tier = notes.tier ?? 'free'

  try {
    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged': {
        await supabase.from('users').update({
          tier,
          subscription_status: 'active',
          razorpay_customer_id: subscription.customer_id,
          subscription_ends_at: new Date(subscription.current_end * 1000).toISOString(),
        }).eq('id', userId)

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          tier,
          status: 'active',
          razorpay_subscription_id: subscription.id,
          razorpay_customer_id: subscription.customer_id,
          plan_id: subscription.plan_id,
          price_paid: payment?.amount ?? 0,
          billing_cycle: notes.billing ?? 'monthly',
          current_period_start: new Date(subscription.current_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_end * 1000).toISOString(),
        }, { onConflict: 'razorpay_subscription_id' })

        // Notify user
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'system',
          title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} plan activated!`,
          message: `Your ${tier} subscription is now active. Welcome to withSahib!`,
        })
        break
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        await supabase.from('users').update({
          tier: 'free',
          subscription_status: 'cancelled',
        }).eq('id', userId)

        await supabase.from('subscriptions')
          .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
          .eq('razorpay_subscription_id', subscription.id)
        break
      }

      case 'subscription.halted':
      case 'payment.failed': {
        await supabase.from('users').update({ subscription_status: 'past_due' }).eq('id', userId)
        break
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
