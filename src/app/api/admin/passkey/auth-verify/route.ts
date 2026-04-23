import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { RP_ID, setPasskeySessionCookie } from '@/lib/webauthn'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { authentication: AuthenticationResponseJSON }
  const { authentication } = body

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

  // Find matching credential by ID
  const { data: dbCredential } = await supabase
    .from('admin_passkeys')
    .select('credential_id, public_key, counter')
    .eq('credential_id', authentication.id)
    .eq('user_id', user.id)
    .single()

  if (!dbCredential) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 400 })
  }

  const credentialPublicKey = Buffer.from(dbCredential.public_key, 'base64url')

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response: authentication,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ['https://www.withsahib.com', 'https://withsahib.com'],
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: dbCredential.credential_id,
        credentialPublicKey,
        counter: dbCredential.counter,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed', detail: String(err) }, { status: 400 })
  }

  const { verified, authenticationInfo } = verification

  if (!verified) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  // Update counter and last_used_at
  await supabase
    .from('admin_passkeys')
    .update({
      counter: authenticationInfo.newCounter,
      last_used_at: new Date().toISOString(),
    })
    .eq('credential_id', dbCredential.credential_id)

  // Clean up challenge
  await supabase.from('admin_passkey_challenges').delete().eq('user_id', user.id)

  const response = NextResponse.json({ success: true })
  return setPasskeySessionCookie(response)
}
