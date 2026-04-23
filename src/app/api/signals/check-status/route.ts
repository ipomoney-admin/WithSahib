import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { isMarketOpen } from '@/lib/market-hours'
import { fetchLivePrice } from '@/lib/fyers-client'
import { formatSignalMessage, formatTelegramMessage } from '@/lib/signal-utils'
import { logError } from '@/lib/logger'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

async function queueOutcomeNotification(
  supabase: ReturnType<typeof createServiceRoleClient>,
  signal: Record<string, unknown>,
  status: string
): Promise<void> {
  const updatedSignal = { ...signal, status }
  const waMsg = formatSignalMessage(updatedSignal as Parameters<typeof formatSignalMessage>[0], 'outcome')
  const tgMsg = formatTelegramMessage(updatedSignal as Parameters<typeof formatTelegramMessage>[0], 'outcome')

  // Fetch eligible subscribers
  const { data: eliteContacts } = await supabase
    .from('subscriber_contacts')
    .select('user_id, telegram_user_id, telegram_opted_in')
    .eq('telegram_opted_in', true)

  if (!eliteContacts) return

  const queueItems = eliteContacts.map((c) => ({
    signal_id: signal.id as string,
    channel: 'telegram_free' as const,
    recipient_id: c.telegram_user_id ?? '',
    user_id: c.user_id,
    message_content: tgMsg,
    status: 'queued' as const,
  })).filter((item) => item.recipient_id)

  if (queueItems.length > 0) {
    await supabase.from('signal_push_queue').insert(queueItems)
  }

  // Free channel broadcast
  const freeChannelId = process.env.TELEGRAM_FREE_CHANNEL_ID
  if (freeChannelId) {
    await supabase.from('signal_push_queue').insert({
      signal_id: signal.id as string,
      channel: 'telegram_free',
      recipient_id: freeChannelId,
      message_content: tgMsg,
      status: 'queued',
    })
  }

  // Suppress unused variable warning
  void waMsg
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const open = await isMarketOpen()
    if (!open) {
      return NextResponse.json({ success: true, data: { skipped: true, reason: 'market_closed' } })
    }

    const supabase = createServiceRoleClient()

    // Single batched query for all open signals
    const { data: openSignals } = await supabase
      .from('signals')
      .select('*')
      .eq('status', 'open')
      .limit(500)

    if (!openSignals || openSignals.length === 0) {
      return NextResponse.json({ success: true, data: { checked: 0 } })
    }

    const updates: Array<{ id: string; status: string }> = []

    // Parallel updates via Promise.all
    await Promise.all(
      openSignals.map(async (signal) => {
        try {
          const symbol = `NSE:${signal.scrip}-EQ`
          const price = await fetchLivePrice(symbol)
          if (!price?.ltp) return

          const ltp = price.ltp
          const isLong = ltp > signal.stop_loss // assume long if price is above SL
          let newStatus: string | null = null
          const now = new Date().toISOString()
          const updateFields: Record<string, unknown> = { updated_at: now }

          // SL check
          if (isLong && ltp <= signal.stop_loss) {
            newStatus = 'sl_hit'
            updateFields.status = 'sl_hit'
            updateFields.sl_hit_at = now
            updateFields.exit_price = ltp
            // Calculate actual RR
            const midEntry = (signal.entry_low + signal.entry_high) / 2
            const risk = Math.abs(midEntry - signal.original_stop_loss)
            const achieved = Math.abs(ltp - midEntry)
            updateFields.actual_rr_achieved = risk > 0 ? Number((achieved / risk).toFixed(2)) : 0
          } else if (!isLong && ltp >= signal.stop_loss) {
            newStatus = 'sl_hit'
            updateFields.status = 'sl_hit'
            updateFields.sl_hit_at = now
            updateFields.exit_price = ltp
          }

          // T1 check (only if not SL'd)
          if (!newStatus && !signal.t1_hit_at && signal.target_1 && ltp >= signal.target_1) {
            newStatus = 't1_hit'
            updateFields.status = 't1_hit'
            updateFields.t1_hit_at = now
            updateFields.stop_loss_type = 'trailing'
            const midEntry = (signal.entry_low + signal.entry_high) / 2
            const risk = Math.abs(midEntry - signal.original_stop_loss)
            const achieved = Math.abs(signal.target_1 - midEntry)
            updateFields.actual_rr_achieved = risk > 0 ? Number((achieved / risk).toFixed(2)) : 0
          }

          // T2 check
          if (!newStatus && signal.t1_hit_at && !signal.t2_hit_at && signal.target_2 && ltp >= signal.target_2) {
            newStatus = 't2_hit'
            updateFields.status = 't2_hit'
            updateFields.t2_hit_at = now
            const midEntry = (signal.entry_low + signal.entry_high) / 2
            const risk = Math.abs(midEntry - signal.original_stop_loss)
            const achieved = Math.abs(signal.target_2 - midEntry)
            updateFields.actual_rr_achieved = risk > 0 ? Number((achieved / risk).toFixed(2)) : 0
          }

          // T3 check
          if (!newStatus && signal.t2_hit_at && !signal.t3_hit_at && signal.target_3 && ltp >= signal.target_3) {
            newStatus = 't3_hit'
            updateFields.status = 't3_hit'
            updateFields.t3_hit_at = now
            const midEntry = (signal.entry_low + signal.entry_high) / 2
            const risk = Math.abs(midEntry - signal.original_stop_loss)
            const achieved = Math.abs(signal.target_3 - midEntry)
            updateFields.actual_rr_achieved = risk > 0 ? Number((achieved / risk).toFixed(2)) : 0
          }

          if (!newStatus) return

          await supabase.from('signals').update(updateFields).eq('id', signal.id)

          // Update signal_features outcome
          const outcome = newStatus === 'sl_hit' ? 'loss' : 'win'
          await supabase
            .from('signal_features')
            .update({ outcome })
            .eq('signal_id', signal.id)

          await supabase.from('signal_audit_log').insert({
            signal_id: signal.id,
            action: 'status_changed',
            old_values: { status: signal.status },
            new_values: { status: newStatus },
            notes: `Auto status update: ${signal.scrip} → ${newStatus}`,
          })

          await queueOutcomeNotification(supabase, signal, newStatus)

          if (newStatus === 'sl_hit') {
            // Trigger postmortem generation
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ml/generate-postmortem`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ signal_id: signal.id }),
            }).catch(() => {})
          }

          updates.push({ id: signal.id, status: newStatus })
        } catch (signalErr) {
          logError(`check-status signal ${signal.id}`, signalErr)
        }
      })
    )

    return NextResponse.json({ success: true, data: { checked: openSignals.length, updated: updates } })
  } catch (err) {
    logError('GET /api/signals/check-status', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
