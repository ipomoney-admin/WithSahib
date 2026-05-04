import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-check'

async function authCheck() {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user || !(await isSuperAdmin(user.id))) return null
  return user
}

export async function GET(_req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('post_tracker')
    .select('*')
    .order('post_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const { post_date, symbol, entry_price, source, x_post_url, caption } = body

  if (!post_date || !symbol || entry_price == null || !source) {
    return NextResponse.json({ error: 'post_date, symbol, entry_price, and source are required' }, { status: 400 })
  }

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('post_tracker')
    .insert({
      post_date,
      symbol: (symbol as string).toUpperCase(),
      entry_price: parseFloat(entry_price),
      source,
      x_post_url: x_post_url || null,
      caption: caption || null,
      outcome: 'Ongoing',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const user = await authCheck()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await req.json()
  const { id, current_price, outcome, notes } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (current_price != null) {
    patch.current_price = parseFloat(current_price)
    patch.price_updated_at = new Date().toISOString()
  }
  if (outcome !== undefined) patch.outcome = outcome || null
  if (notes !== undefined) patch.notes = notes || null

  const db = createServiceRoleClient()
  const { data, error } = await db
    .from('post_tracker')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
