import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Sahib Singh Hora — SEBI RA INH000026266 | withSahib',
  description:
    'Meet Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266). 14+ years of market experience, systematic approach to equity research, intraday calls, and options advisory.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: 'https://www.withsahib.com/about',
    title: 'About Sahib Singh Hora — SEBI RA INH000026266 | withSahib',
    description:
      'SEBI Registered Research Analyst with 14+ years experience. Systematic equity research, documented methodology, full accountability on every recommendation.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
