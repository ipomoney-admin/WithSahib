import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-check'

export async function POST(req: NextRequest) {
  try {
    const authClient = createServerComponentClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || !(await isSuperAdmin(user.id))) {
      return NextResponse.json({ error: 'Unauthorized — super admin only' }, { status: 403 })
    }

    const { stock, exchange, action, entryMin, entryMax, target1, target2, stopLoss, service, rationale } = await req.json()

    if (!stock || !action || !entryMin || !target1 || !stopLoss || !service || !rationale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rationale.trim().length < 100) {
      return NextResponse.json({ error: 'Rationale must be at least 100 characters' }, { status: 400 })
    }

    const db = createServiceRoleClient()
    const { data, error } = await db.from('signals').insert({
      stock_symbol: stock.toUpperCase(),
      exchange: exchange ?? 'NSE',
      action: action.toUpperCase(),
      entry_min: parseFloat(entryMin),
      entry_max: parseFloat(entryMax),
      target1: parseFloat(target1),
      target2: target2 ? parseFloat(target2) : null,
      stop_loss: parseFloat(stopLoss),
      service,
      rationale: rationale.trim(),
      published_by: user.id,
      status: 'open',
      published_at: new Date().toISOString(),
    }).select('id').single()

    if (error) {
      console.error('Signal insert error:', error)
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 })
    }

    // Trigger WhatsApp delivery
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie: req.headers.get('cookie') ?? '' },
        body: JSON.stringify({
          message: `${action} ${stock} (${exchange})\nEntry: ₹${entryMin}–₹${entryMax}\nTarget 1: ₹${target1}${target2 ? `\nTarget 2: ₹${target2}` : ''}\nStop Loss: ₹${stopLoss}\n\n${rationale.slice(0, 300)}\n\nSEBI RA INH000026266 · Not investment advice`,
          recipients: [], // TODO: fetch active Pro/Elite subscriber phone numbers
        }),
      })
    } catch {
      // WhatsApp failure is non-blocking
    }

    return NextResponse.json({ success: true, id: data?.id, message: `Research note published — ${stock} ${action}` })
  } catch (error) {
    console.error('Publish research error:', error)
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
  }
}
