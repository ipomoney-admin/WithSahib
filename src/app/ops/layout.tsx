import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agent Command Center — withSahib',
  robots: { index: false, follow: false },
}

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) redirect('/auth/login')

  const db = createServiceRoleClient()
  const { data: adminRole } = await db
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (!adminRole) redirect('/dashboard')

  return <>{children}</>
}
