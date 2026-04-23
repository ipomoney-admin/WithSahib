import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = 'withsahib2026indexnow'
const BASE_URL = 'https://www.withsahib.com'

const URLS_TO_SUBMIT = [
  BASE_URL,
  `${BASE_URL}/services/intraday`,
  `${BASE_URL}/services/stock-options`,
  `${BASE_URL}/services/index-options`,
  `${BASE_URL}/services/swing`,
  `${BASE_URL}/pricing`,
  `${BASE_URL}/reports`,
  `${BASE_URL}/faq`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/about`,
  `${BASE_URL}/appointments`,
]

export async function GET(req: NextRequest) {
  // Allow cron secret or no-auth (Bing IndexNow is public by design)
  const secret = req.nextUrl.searchParams.get('secret')
  if (process.env.CRON_SECRET && secret && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Batch submit via IndexNow JSON API (supports multiple URLs in one call)
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'www.withsahib.com',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: URLS_TO_SUBMIT,
      }),
    })

    return NextResponse.json({
      success: res.ok,
      status: res.status,
      urls: URLS_TO_SUBMIT.length,
      submittedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}
