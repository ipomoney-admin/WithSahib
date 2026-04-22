import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { validateModification, formatSignalMessage, formatTelegramMessage } from '@/lib/signal-utils'

type Params = { params: { id: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  const supabase = createServiceRoleClient()

  if (!user) {
    const { data } = await supabase
      .from('signals')
      .select('id, segment, scrip, status, published_at')
      .eq('id', id)
      .single()
    if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data })
  }

  const { data: signal } = await supabase
    .from('signals')
    .select('*')
    .eq('id', id)
    .single()

  if (!signal) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: signal })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = params
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data: signal } = await supabase
    .from('signals')
    .select('*')
    .eq('id', id)
    .single()

  if (!signal) return NextResponse.json({ success: false, error: 'Signal not found' }, { status: 404 })

  const body = await req.json()
  const { stop_loss, target_1, target_2, target_3, reason, entry_low, entry_high } = body

  if (entry_low !== undefined || entry_high !== undefined) {
    return NextResponse.json({ success: false, error: 'Entry range is locked after publication.' }, { status: 400 })
  }

  const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString(), is_modified: true }
  const modifications: Array<{
    signal_id: string
    modification_type: string
    field_changed: string
    old_value: string
    new_value: string
    reason: string
    modified_by: string
  }> = []

  if (stop_loss !== undefined) {
    const check = validateModification('stop_loss', signal.stop_loss, Number(stop_loss))
    if (!check.valid) return NextResponse.json({ success: false, error: check.reason }, { status: 400 })
    updateFields.stop_loss = Number(stop_loss)
    modifications.push({
      signal_id: id,
      modification_type: 'sl_tightened',
      field_changed: 'stop_loss',
      old_value: String(signal.stop_loss),
      new_value: String(stop_loss),
      reason: reason ?? 'Risk management',
      modified_by: user.id,
    })
  }

  if (target_1 !== undefined) {
    const check = validateModification('target_1', signal.target_1, Number(target_1))
    if (!check.valid) return NextResponse.json({ success: false, error: check.reason }, { status: 400 })
    updateFields.target_1 = Number(target_1)
    modifications.push({
      signal_id: id,
      modification_type: 'target_raised',
      field_changed: 'target_1',
      old_value: String(signal.target_1),
      new_value: String(target_1),
      reason: reason ?? 'Target revision',
      modified_by: user.id,
    })
  }

  if (target_2 !== undefined) {
    updateFields.target_2 = Number(target_2)
    modifications.push({
      signal_id: id,
      modification_type: 'target_raised',
      field_changed: 'target_2',
      old_value: String(signal.target_2),
      new_value: String(target_2),
      reason: reason ?? 'Target revision',
      modified_by: user.id,
    })
  }

  if (target_3 !== undefined) {
    updateFields.target_3 = Number(target_3)
    modifications.push({
      signal_id: id,
      modification_type: 'target_raised',
      field_changed: 'target_3',
      old_value: String(signal.target_3),
      new_value: String(target_3),
      reason: reason ?? 'Target revision',
      modified_by: user.id,
    })
  }

  if (modifications.length === 0) {
    return NextResponse.json({ success: false, error: 'No valid modification fields provided' }, { status: 400 })
  }

  // Warn if modifying within 5 min of publish
  const publishedAt = new Date(signal.published_at)
  const minutesSincePublish = (Date.now() - publishedAt.getTime()) / 60000

  await supabase.from('signals').update(updateFields).eq('id', id)
  await supabase.from('signal_modifications').insert(modifications)

  await supabase.from('signal_audit_log').insert({
    signal_id: id,
    action: 'signal_modified',
    performed_by: user.id,
    old_values: { stop_loss: signal.stop_loss, target_1: signal.target_1 },
    new_values: updateFields,
    notes: reason ?? '',
  })

  const updatedSignal = { ...signal, ...updateFields }
  const tgMsg = formatTelegramMessage(
    updatedSignal as Parameters<typeof formatTelegramMessage>[0],
    'modification'
  )

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

  if (minutesSincePublish < 5) {
    await supabase.from('admin_alerts').insert({
      type: 'new_signal',
      message: `⚠️ Signal modified within 5 minutes of publication: ${signal.scrip}`,
      data: { signal_id: id, minutes_since_publish: minutesSincePublish.toFixed(1) },
    })
  }

  return NextResponse.json({
    success: true,
    data: { signal_id: id, modifications: modifications.length, early_warning: minutesSincePublish < 5 },
  })
}
