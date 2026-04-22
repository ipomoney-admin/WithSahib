import type { NextResponse } from 'next/server'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const RP_ID = new URL(
  process.env.NEXT_PUBLIC_APP_URL || 'https://www.withsahib.com'
).hostname

export const RP_NAME = 'withSahib Admin'

export const PASSKEY_SESSION_COOKIE = 'ws_passkey_verified'

export const PASSKEY_SESSION_MAX_AGE = 8 * 60 * 60 // 8 hours in seconds

export function isPasskeySessionValid(cookieStore: ReadonlyRequestCookies): boolean {
  const cookie = cookieStore.get(PASSKEY_SESSION_COOKIE)
  if (!cookie?.value) return false
  const timestamp = parseInt(cookie.value, 10)
  if (isNaN(timestamp)) return false
  return Date.now() - timestamp < PASSKEY_SESSION_MAX_AGE * 1000
}

export function setPasskeySessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(PASSKEY_SESSION_COOKIE, Date.now().toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: PASSKEY_SESSION_MAX_AGE,
    path: '/admin',
  })
  return response
}
