import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

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

  const { command, target_agent_id, target_department } = await req.json()
  if (!command?.trim()) return NextResponse.json({ error: 'Command is required' }, { status: 400 })

  const { error } = await db.from('agent_commands').insert({
    issued_by: user.id,
    target_agent_id: target_agent_id ?? null,
    target_department: target_department ?? null,
    command: command.trim(),
    status: 'queued',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
