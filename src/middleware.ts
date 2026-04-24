import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Forward pathname as a header so server components (e.g. admin layout) can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Cron-protected API routes — check CRON_SECRET header (bypass session checks)
  const cronPaths = [
    '/api/screener/',
    '/api/signals/check-status',
    '/api/signals/expire-intraday',
    '/api/fyers/refresh-token',
    '/api/ml/train',
    '/api/ml/generate-predictions',
    '/api/intelligence/weekly-report',
    '/api/distribution/process-queue',
    '/api/distribution/daily-recap',
  ]
  const isCronPath = cronPaths.some((p) => pathname.startsWith(p))
  if (isCronPath) {
    const cronSecret = request.headers.get('x-cron-secret')
    if (cronSecret === process.env.CRON_SECRET) {
      return response // Authorized by cron secret
    }
    // Fall through to session-based auth check below (admins can also call these)
  }

  // Admin API routes
  const adminApiPaths = ['/api/admin/']
  const isAdminApiPath = adminApiPaths.some((p) => pathname.startsWith(p))
  if (isAdminApiPath && !session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // Signal mutation routes (POST/PATCH/DELETE)
  const signalMutationPath = pathname.startsWith('/api/signals')
  const isWriteMethod = ['POST', 'PATCH', 'DELETE'].includes(request.method)
  if (signalMutationPath && isWriteMethod && !session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // ML routes — require cron or admin
  const mlPaths = ['/api/ml/']
  const isMlPath = mlPaths.some((p) => pathname.startsWith(p))
  if (isMlPath && !session) {
    const cronSecret = request.headers.get('x-cron-secret')
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Fyers API routes — require cron or admin
  const fyersPaths = ['/api/fyers/']
  const isFyersPath = fyersPaths.some((p) => pathname.startsWith(p))
  if (isFyersPath && !session) {
    const cronSecret = request.headers.get('x-cron-secret')
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Admin dashboard routes — UI redirect
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    // Admin role check is done in each page/API handler via isAdmin()
  }

  // Member-protected routes — only dashboard requires login
  const protectedPaths = [
    '/dashboard',
  ]

  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password']

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && session) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js).*)',
  ],
}
