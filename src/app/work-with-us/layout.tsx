import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work With Us — Careers at withSahib | withSahib',
  description:
    'Join the withSahib team. We are looking for driven people passionate about financial markets, technology, and building institutional-grade research products for Indian investors.',
  alternates: { canonical: '/work-with-us' },
  openGraph: {
    url: 'https://www.withsahib.com/work-with-us',
    title: 'Work With Us | withSahib',
    description:
      'Careers at withSahib — build the future of SEBI-regulated equity research in India.',
  },
}

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return children
}
