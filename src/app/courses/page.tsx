import type { Metadata } from 'next'
import { CoursesContent } from '@/components/sections/CoursesContent'

const courseSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Market Foundations (Equity Focus)',
    description: 'Structured equity market education with 3-month live 1-on-1 mentorship by SEBI RA Sahib Singh Hora.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '24999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Beginner',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Options Positioning System',
    description: 'Specialised F&O training — OI analysis, IV rank, PCR, expiry-week strategies with 3-month live handholding.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '34999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Intermediate',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Research Framework (Pro)',
    description: 'Advanced research methodology — how to research, screen, and evaluate trades the way a SEBI RA does.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '44999', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    courseMode: 'online',
    educationalLevel: 'Advanced',
    url: 'https://www.withsahib.com/courses',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Flagship Mentorship',
    description: 'Complete 3-month personalised 1-on-1 mentorship with SEBI RA Sahib Singh Hora. One mentee per batch.',
    provider: { '@type': 'Person', name: 'Sahib Singh Hora', identifier: 'INH000026266', url: 'https://www.withsahib.com/about' },
    offers: { '@type': 'Offer', price: '74999', priceCurrency: 'INR', availability: 'https://schema.org/LimitedAvailability' },
    courseMode: 'online',
    educationalLevel: 'All Levels',
    url: 'https://www.withsahib.com/courses',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://www.withsahib.com/courses' },
  ],
}

export const metadata: Metadata = {
  title: 'Live 1-on-1 Market Education | withSahib Courses',
  description:
    'Personalised, live one-on-one sessions with SEBI RA Sahib Singh Hora (INH000026266). Market Foundations ₹24,999 | Options System ₹34,999 | Research Framework ₹44,999 | Flagship Mentorship ₹74,999.',
  alternates: { canonical: 'https://www.withsahib.com/courses' },
  openGraph: {
    title: 'Live 1-on-1 Market Education | withSahib Courses',
    description: 'Not pre-recorded. Not YouTube. Live 1-on-1 sessions built around your portfolio — by SEBI RA Sahib Singh Hora (INH000026266).',
    url: 'https://www.withsahib.com/courses',
  },
}

export default function CoursesPage() {
  return (
    <>
      {courseSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CoursesContent />
    </>
  )
}
