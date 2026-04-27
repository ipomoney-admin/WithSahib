import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Market Insights & Research Notes | withSahib',
  description:
    'In-depth market analysis, stock research notes, and trading education from SEBI Registered Research Analyst Sahib Singh Hora (INH000026266).',
  alternates: { canonical: '/blog' },
  openGraph: {
    url: 'https://www.withsahib.com/blog',
    title: 'Blog — Market Insights & Research Notes | withSahib',
    description:
      'Market analysis, trading education, and research insights from SEBI RA INH000026266.',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
