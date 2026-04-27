import type { Metadata } from 'next'

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'withSahib Equity Research Subscription',
  description: 'SEBI-registered equity research subscriptions for Indian investors. Daily intraday picks, options signals, swing trades, and 1-on-1 advisory.',
  provider: {
    '@type': 'Person',
    name: 'Sahib Singh Hora',
    identifier: 'INH000026266',
    url: 'https://www.withsahib.com/about',
  },
  offers: [
    { '@type': 'Offer', name: 'Basic', price: '3999', priceCurrency: 'INR', billingPeriod: 'P1M' },
    { '@type': 'Offer', name: 'Pro',   price: '6999', priceCurrency: 'INR', billingPeriod: 'P1M' },
    { '@type': 'Offer', name: 'Elite', price: '12499', priceCurrency: 'INR', billingPeriod: 'P1M' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.withsahib.com/pricing' },
  ],
}

export const metadata: Metadata = {
  title: 'Research Plans & Pricing | withSahib SEBI RA',
  description:
    'Transparent pricing for SEBI-registered equity research. Basic ₹3,999/mo, Pro ₹6,999/mo, Elite ₹12,499/mo. Cancel anytime. No lock-in.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    url: 'https://www.withsahib.com/pricing',
    title: 'Research Plans & Pricing | withSahib SEBI RA',
    description:
      'Basic ₹3,999 · Pro ₹6,999 · Elite ₹12,499 · SEBI RA INH000026266. Cancel anytime.',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
