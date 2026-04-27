import type { Metadata } from 'next'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.withsahib.com/blog' },
  ],
}

export const metadata: Metadata = {
  title: 'Market Research & Trading Education Blog | withSahib',
  description:
    'In-depth articles on equity research, options trading, intraday strategies, and market education from SEBI RA Sahib Singh Hora (INH000026266).',
  alternates: { canonical: '/blog' },
  openGraph: {
    url: 'https://www.withsahib.com/blog',
    title: 'Market Research & Trading Education Blog | withSahib',
    description:
      'Market analysis, trading education, and research insights from SEBI RA INH000026266.',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  )
}
