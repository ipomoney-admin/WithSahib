import type { Metadata } from 'next'
import { WhoContent } from '@/components/sections/WhoContent'

export const metadata: Metadata = {
  title: 'Who Is withSahib Research For? | Retail, HNI & Institutional',
  description:
    'withSahib equity research is built for serious retail traders, active investors, HNIs, family offices, and institutional participants who want SEBI-registered, accountable research — not anonymous tips.',
  alternates: { canonical: 'https://www.withsahib.com/who-its-for' },
  openGraph: {
    url: 'https://www.withsahib.com/who-its-for',
    title: 'Who Is withSahib Research For? | Retail, HNI & Institutional',
    description:
      'Serious retail traders, HNIs, family offices — SEBI-registered equity research for investors who demand accountability.',
  },
}

export default function WhoItsForPage() {
  return <WhoContent />
}
