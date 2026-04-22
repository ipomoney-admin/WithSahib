import { NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { RP_ID, RP_NAME } from '@/lib/webauthn'

export const dynamic = 'force-dynamic'

export async function GET() {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServiceRoleClient()

  // Fetch existing credentials to exclude them
  const { data: existing } = await supabase
    .from('admin_passkeys')
    .select('credential_id')
    .eq('user_id', user.id)

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: Buffer.from(user.id),
    userName: user.email!,
    attestationType: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'required',
    },
    excludeCredentials: (existing ?? []).map((c) => ({ id: c.credential_id })),
  })

  // Store challenge — delete any old one first, then insert
  await supabase.from('admin_passkey_challenges').delete().eq('user_id', user.id)
  await supabase.from('admin_passkey_challenges').insert({
    user_id: user.id,
    challenge: options.challenge,
  })

  return NextResponse.json(options)
}
