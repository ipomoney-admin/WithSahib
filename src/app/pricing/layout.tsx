import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Research Advisory Plans | withSahib',
  description:
    'Choose from Basic ₹3,999, Pro ₹6,999, or Elite ₹12,499 monthly plans. SEBI Registered Research Analyst Sahib Singh Hora (INH000026266) — intraday calls, options signals, swing picks & research reports.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    url: 'https://www.withsahib.com/pricing',
    title: 'Pricing — Research Advisory Plans | withSahib',
    description:
      'Basic ₹3,999 · Pro ₹6,999 · Elite ₹12,499 · SEBI RA INH000026266. Institutional-grade equity research for Indian investors.',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
