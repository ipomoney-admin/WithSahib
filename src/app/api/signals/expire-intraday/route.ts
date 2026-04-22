import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { formatTelegramMessage } from '@/lib/signal-utils'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

export async function GET(req: NextRequest) {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: intradaySignals } = await supabase
    .from('signals')
    .select('*')
    .eq('status', 'open')
    .eq('segment', 'intraday')

  if (!intradaySignals || intradaySignals.length === 0) {
    return NextResponse.json({ success: true, data: { expired: 0 } })
  }

  const expired: string[] = []

  await Promise.all(
    intradaySignals.map(async (signal) => {
      await supabase
        .from('signals')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', signal.id)

      await supabase
        .from('signal_features')
        .update({ outcome: 'neutral' })
        .eq('signal_id', signal.id)

      await supabase.from('signal_audit_log').insert({
        signal_id: signal.id,
        action: 'status_changed',
        old_values: { status: 'open' },
        new_values: { status: 'expired' },
        notes: 'Intraday expiry at market close',
      })

      const tgMsg = formatTelegramMessage({ ...signal, status: 'expired' }, 'outcome')
      const freeChannelId = process.env.TELEGRAM_FREE_CHANNEL_ID
      if (freeChannelId) {
        await supabase.from('signal_push_queue').insert({
          signal_id: signal.id,
          channel: 'telegram_free',
          recipient_id: freeChannelId,
          message_content: tgMsg,
          status: 'queued',
        })
      }

      expired.push(signal.id)
    })
  )

  return NextResponse.json({ success: true, data: { expired: expired.length, ids: expired } })
}
