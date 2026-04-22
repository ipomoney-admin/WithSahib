import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-check'
import { isFyersConnected } from '@/lib/fyers-client'
import { formatSignalMessage, formatTelegramMessage } from '@/lib/signal-utils'

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = params
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isSuperAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Super admin access required' }, { status: 403 })
  }

  const connected = await isFyersConnected()
  if (!connected) {
    return NextResponse.json({
      success: false,
      error: 'Fyers is disconnected. Cannot push — live price data unavailable.',
    }, { status: 503 })
  }

  const body = await req.json()
  const channel: string = body.channel ?? 'all'

  const supabase = createServiceRoleClient()
  const { data: signal } = await supabase
    .from('signals')
    .select('*')
    .eq('id', id)
    .single()

  if (!signal) return NextResponse.json({ success: false, error: 'Signal not found' }, { status: 404 })

  const waMsg = formatSignalMessage(signal, 'new')
  const tgMsg = formatTelegramMessage(signal, 'new')

  const queueItems: Array<{
    signal_id: string
    channel: 'whatsapp' | 'telegram_paid' | 'telegram_free'
    recipient_id: string
    user_id?: string
    message_content: string
    status: 'queued'
  }> = []

  if (channel === 'whatsapp' || channel === 'all') {
    const { data: eliteContacts } = await supabase
      .from('subscriber_contacts')
      .select('user_id, phone, subscriptions!inner(plan, status, current_period_end)')
      .eq('whatsapp_opted_in', true)

    const eliteUsers = (eliteContacts ?? []).filter((c) => {
      const sub = (c.subscriptions as unknown as Array<{ plan: string; status: string; current_period_end: string }>)?.[0]
      return sub?.plan === 'elite' && sub?.status === 'active' && new Date(sub.current_period_end) > new Date()
    })

    eliteUsers.forEach((c) => {
      if (c.phone) {
        queueItems.push({
          signal_id: id,
          channel: 'whatsapp',
          recipient_id: c.phone,
          user_id: c.user_id,
          message_content: waMsg,
          status: 'queued',
        })
      }
    })
  }

  if (channel === 'telegram_paid' || channel === 'all') {
    const paidChannelId = process.env.TELEGRAM_PAID_CHANNEL_ID
    if (paidChannelId) {
      queueItems.push({
        signal_id: id,
        channel: 'telegram_paid',
        recipient_id: paidChannelId,
        message_content: tgMsg,
        status: 'queued',
      })
    }
  }

  if (channel === 'telegram_free' || channel === 'all') {
    const freeChannelId = process.env.TELEGRAM_FREE_CHANNEL_ID
    if (freeChannelId) {
      queueItems.push({
        signal_id: id,
        channel: 'telegram_free',
        recipient_id: freeChannelId,
        message_content: tgMsg,
        status: 'queued',
      })
    }
  }

  if (queueItems.length > 0) {
    await supabase.from('signal_push_queue').insert(queueItems)
  }

  const auditAction =
    channel === 'whatsapp' ? 'pushed_whatsapp' :
    channel.startsWith('telegram') ? 'pushed_telegram' :
    'pushed_whatsapp'

  await supabase.from('signal_audit_log').insert({
    signal_id: id,
    action: auditAction,
    performed_by: user.id,
    new_values: { channel, queued_count: queueItems.length },
  })

  return NextResponse.json({
    success: true,
    data: { queued_count: queueItems.length, channel },
  })
}
