import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-check'
import { formatTelegramMessage } from '@/lib/signal-utils'

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = params
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isSuperAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Super admin access required' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data: signal } = await supabase
    .from('signals')
    .select('*')
    .eq('id', id)
    .single()

  if (!signal) return NextResponse.json({ success: false, error: 'Signal not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const reason = body.reason ?? 'Cancelled by admin'

  await supabase.from('signals').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id)

  await supabase.from('signal_modifications').insert({
    signal_id: id,
    modification_type: 'cancelled',
    field_changed: 'status',
    old_value: signal.status,
    new_value: 'cancelled',
    reason,
    modified_by: user.id,
  })

  await supabase.from('signal_audit_log').insert({
    signal_id: id,
    action: 'signal_cancelled',
    performed_by: user.id,
    old_values: { status: signal.status },
    new_values: { status: 'cancelled' },
    notes: reason,
  })

  // Notify subscribers
  const cancelledSignal = { ...signal, status: 'cancelled' }
  const tgMsg = `❌ *withSahib Signal Cancelled*\n\n*${signal.scrip}${signal.strike ? ` ${signal.strike}` : ''}*\nThis signal has been cancelled by the analyst.\n\n_SEBI RA: INH000026266 | Not investment advice_`

  const { data: subscribers } = await supabase
    .from('subscriber_contacts')
    .select('telegram_user_id')
    .eq('telegram_opted_in', true)

  if (subscribers) {
    const queueItems = subscribers
      .filter((s) => s.telegram_user_id)
      .map((s) => ({
        signal_id: id,
        channel: 'telegram_free' as const,
        recipient_id: s.telegram_user_id!,
        message_content: tgMsg,
        status: 'queued' as const,
      }))
    if (queueItems.length > 0) await supabase.from('signal_push_queue').insert(queueItems)
  }

  const freeChannelId = process.env.TELEGRAM_FREE_CHANNEL_ID
  if (freeChannelId) {
    await supabase.from('signal_push_queue').insert({
      signal_id: id,
      channel: 'telegram_free',
      recipient_id: freeChannelId,
      message_content: tgMsg,
      status: 'queued',
    })
  }

  return NextResponse.json({ success: true, data: { signal_id: id, status: 'cancelled' } })
}
