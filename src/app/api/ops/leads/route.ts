import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceRoleClient()
  const { data: role } = await db
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: leads, error } = await db
    .from('leads')
    .select('intent_label, nurture_stage')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = leads ?? []
  const stages = ['new', 'contacted', 'engaged', 'trial', 'converted']

  const summary = {
    total: rows.length,
    hot: rows.filter((l) => l.intent_label === 'hot').length,
    warm: rows.filter((l) => l.intent_label === 'warm').length,
    cold: rows.filter((l) => l.intent_label === 'cold').length,
    converted: rows.filter((l) => l.nurture_stage === 'converted').length,
    by_stage: Object.fromEntries(
      stages.map((s) => [s, rows.filter((l) => l.nurture_stage === s).length])
    ),
  }

  return NextResponse.json(summary)
}
