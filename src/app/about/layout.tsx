import type { Metadata } from 'next'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sahib Singh Hora',
  jobTitle: 'SEBI Registered Research Analyst',
  identifier: 'INH000026266',
  url: 'https://www.withsahib.com/about',
  worksFor: { '@type': 'Organization', name: 'withSahib', url: 'https://www.withsahib.com' },
  knowsAbout: ['Equity Research', 'Options Trading', 'Technical Analysis', 'Indian Stock Market', 'Swing Trading', 'Intraday Trading'],
  hasCredential: 'SEBI Research Analyst Registration INH000026266',
  sameAs: [
    'https://x.com/WithSahib_',
    'https://www.instagram.com/withsahib_/',
    'https://www.linkedin.com/in/sahibsinghhora/',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.withsahib.com/about' },
  ],
}

export const metadata: Metadata = {
  title: 'Sahib Singh Hora — SEBI RA INH000026266 | withSahib',
  description:
    'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266), NISM certified, with 14+ years of market experience. Founder of withSahib, based in Jabalpur, Madhya Pradesh.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: 'https://www.withsahib.com/about',
    title: 'Sahib Singh Hora — SEBI RA INH000026266 | withSahib',
    description:
      'SEBI Registered Research Analyst with 14+ years experience. Systematic equity research, documented methodology, full accountability on every recommendation.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
