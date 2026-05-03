import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
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

  const today = new Date().toISOString().split('T')[0]

  const [
    { count: running },
    { count: doneToday },
    { count: pendingApprovals },
    { data: tokenRows },
  ] = await Promise.all([
    db.from('agents').select('*', { count: 'exact', head: true }).eq('status', 'running'),
    db.from('agent_tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', today),
    db.from('approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('token_usage').select('tokens_in, tokens_out').eq('date', today),
  ])

  const tokensToday = (tokenRows ?? []).reduce(
    (sum, r) => sum + (r.tokens_in ?? 0) + (r.tokens_out ?? 0),
    0
  )

  return NextResponse.json({
    running: running ?? 0,
    doneToday: doneToday ?? 0,
    pendingApprovals: pendingApprovals ?? 0,
    tokensToday,
    tokenLimit: 1_000_000,
    tokenPct: Math.min(100, Math.round((tokensToday / 1_000_000) * 100)),
  })
}
