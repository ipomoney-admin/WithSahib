import type { Metadata } from 'next'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.withsahib.com/services' },
    { '@type': 'ListItem', position: 3, name: 'Intraday Research', item: 'https://www.withsahib.com/services/intraday' },
  ],
}

export const metadata: Metadata = {
  title: 'Intraday Research Picks — Daily NSE Equity | withSahib SEBI RA',
  description:
    'Daily intraday research picks for NSE equities by SEBI RA Sahib Singh Hora (INH000026266). Pre-market watchlist at 4 PM + 15-minute live alerts. Entry zone, two targets, stop-loss on every call.',
  alternates: { canonical: '/services/intraday' },
  openGraph: {
    url: 'https://www.withsahib.com/services/intraday',
    title: 'Intraday Research Picks — Daily NSE Equity | withSahib SEBI RA',
    description:
      'SEBI RA intraday research picks for Nifty 500 stocks. Published before 9 AM daily. Entry, targets, stop-loss, written rationale.',
  },
}

export default function IntradayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
