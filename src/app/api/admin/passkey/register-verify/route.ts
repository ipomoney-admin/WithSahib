import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import type { RegistrationResponseJSON } from '@simplewebauthn/types'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { RP_ID } from '@/lib/webauthn'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { registration: RegistrationResponseJSON; deviceName?: string }
  const { registration, deviceName } = body

  const supabase = createServiceRoleClient()

  // Fetch stored challenge
  const { data: challengeRow } = await supabase
    .from('admin_passkey_challenges')
    .select('challenge')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!challengeRow) {
    return NextResponse.json({ error: 'No pending challenge' }, { status: 400 })
  }

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: registration,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ['https://www.withsahib.com', 'https://withsahib.com'],
      expectedRPID: RP_ID,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed', detail: String(err) }, { status: 400 })
  }

  const { verified, registrationInfo } = verification

  if (!verified || !registrationInfo) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  const { credentialID, credentialPublicKey, counter } = registrationInfo

  // Store credential — public key as base64url string
  const publicKeyBase64 = Buffer.from(credentialPublicKey).toString('base64url')

  const { error: insertError } = await supabase.from('admin_passkeys').insert({
    user_id: user.id,
    credential_id: credentialID,
    public_key: publicKeyBase64,
    counter,
    device_name: deviceName ?? null,
  })

  if (insertError) {
    return NextResponse.json({ error: 'Failed to store credential' }, { status: 500 })
  }

  // Clean up challenge
  await supabase.from('admin_passkey_challenges').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
