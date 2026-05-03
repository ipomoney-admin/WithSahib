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

  const { data: messages, error } = await db
    .from('agent_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = messages ?? []
  if (rows.length === 0) return NextResponse.json([])

  const allIds = [
    ...rows.map((m) => m.from_agent_id).filter(Boolean),
    ...rows.map((m) => m.to_agent_id).filter(Boolean),
  ]
  const agentIds = allIds.filter((id, i) => allIds.indexOf(id) === i)

  const { data: agentRows } = await db
    .from('agents')
    .select('id, name')
    .in('id', agentIds)

  const nameMap: Record<string, string> = Object.fromEntries(
    (agentRows ?? []).map((a) => [a.id, a.name])
  )

  const enriched = rows.map((m) => ({
    ...m,
    from_agent_name: nameMap[m.from_agent_id] ?? 'Unknown',
    to_agent_name: nameMap[m.to_agent_id] ?? 'Unknown',
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: NextRequest) {
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

  const body = await req.json()
  const { from_agent_id, to_agent_id, message } = body

  if (!from_agent_id || !to_agent_id || !message) {
    return NextResponse.json({ error: 'from_agent_id, to_agent_id, and message required' }, { status: 400 })
  }

  const { data, error } = await db
    .from('agent_messages')
    .insert({ from_agent_id, to_agent_id, message })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
