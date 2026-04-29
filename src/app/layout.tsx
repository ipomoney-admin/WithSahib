import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

const BASE_URL = 'https://www.withsahib.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'withSahib — SEBI Registered Research Analyst | Equity Research India',
    template: '%s | withSahib',
  },
  description:
    'Daily equity research from Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266). Intraday picks, swing trades, options research with entry, targets, stop-loss and written rationale.',
  keywords: [
    'SEBI registered research analyst India',
    'SEBI RA INH000026266',
    'Sahib Singh Hora research analyst',
    'best SEBI RA India 2026',
    'intraday stock calls SEBI registered',
    'NSE swing trade picks',
    'index options calls India',
    'SEBI RA model portfolio',
    'stock research report India',
    'research analyst appointment',
    'verified stock market analyst India',
    'SEBI research analyst Madhya Pradesh',
    'top SEBI RA intraday calls',
    'SEBI registered analyst options trading',
    'withsahib.com',
    'withSahib',
    'INH000026266',
    'NISM certified analyst India',
    'Bank Nifty options calls',
    'Nifty intraday analysis',
  ],
  authors: [{ name: 'Sahib Singh Hora', url: BASE_URL }],
  creator: 'Sahib Singh Hora',
  publisher: 'Sahib Singh Hora',
  category: 'Finance',
  classification: 'Financial Research & Advisory',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'withSahib',
    title: 'withSahib — Systematic Equity Research | SEBI RA INH000026266',
    description:
      'Systematic equity research by Sahib Singh Hora, SEBI RA INH000026266. Intraday calls, swing trades, index options, research reports — documented methodology, full written rationale on every recommendation.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'withSahib — SEBI Registered Equity Research | INH000026266',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WithSahib_',
    creator: '@WithSahib_',
    title: 'withSahib — SEBI Registered Research Analyst | Equity Research India',
    description:
      'Daily equity research from SEBI RA INH000026266 · Sahib Singh Hora · Intraday picks, swing trades, options research with entry, targets, stop-loss and written rationale.',
    images: ['/opengraph-image'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon', sizes: '32x32' }],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAFAF8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ─── STRUCTURED DATA ──────────────────────────────────────────────────────────
const structuredData = [
  // Organization
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'withSahib — Altitans Intelligence Private Limited',
    alternateName: 'withSahib',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icons/icon-192.png`,
      width: 192,
      height: 192,
    },
    description:
      'withSahib is a SEBI Registered Research Analyst platform operated by Sahib Singh Hora (INH000026266), providing institutional-grade intraday calls, options strategies, swing picks, and data-driven research reports for Indian retail investors.',
    legalName: 'Altitans Intelligence Private Limited',
    identifier: {
      '@type': 'PropertyValue',
      name: 'CIN',
      value: 'U62011MP2026PTC083080',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '86/2 Prem Nagar, Madan Mahal',
      addressLocality: 'Jabalpur',
      addressRegion: 'Madhya Pradesh',
      postalCode: '482001',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9981248888',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://x.com/WithSahib_',
      'https://www.instagram.com/withsahib_/',
      'https://www.linkedin.com/in/sahibsinghhora/',
      'https://www.facebook.com/sahib1313',
    ],
  },
  // Person
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'Sahib Singh Hora',
    url: BASE_URL,
    image: `${BASE_URL}/icons/icon-192.png`,
    jobTitle: 'SEBI Registered Research Analyst',
    description:
      'Sahib Singh Hora is a SEBI Registered Research Analyst (INH000026266) providing institutional-grade stock research, intraday calls, and options advisory for Indian markets.',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SEBI Registration Number',
      value: 'INH000026266',
    },
    knowsAbout: [
      'Technical Analysis',
      'Intraday Trading',
      'Options Trading',
      'Swing Trading',
      'Stock Market Research',
      'NSE Equities',
      'Nifty Options',
      'Bank Nifty Options',
      'Equity Research',
      'SEBI Regulations',
      'Portfolio Management',
      'Financial Literacy',
      'Volatility Contraction Pattern',
      'RSI Divergence',
      'Cup and Handle Pattern',
      'Order Blocks',
      'Fair Value Gaps',
      'Implied Volatility',
      'Open Interest Analysis',
      'Darvas Box',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'SEBI Registration',
      name: 'SEBI Registered Research Analyst',
      identifier: 'INH000026266',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Securities and Exchange Board of India',
        url: 'https://www.sebi.gov.in',
      },
    },
    sameAs: [
      'https://x.com/WithSahib_',
      'https://www.instagram.com/withsahib_/',
      'https://www.linkedin.com/in/sahibsinghhora/',
      'https://www.facebook.com/sahib1313',
    ],
    worksFor: { '@id': `${BASE_URL}/#organization` },
  },
  // WebSite
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'withSahib',
    url: BASE_URL,
    description:
      'SEBI Registered Research Analyst platform — intraday calls, swing trades, options picks, research reports, and 1-on-1 advisory by Sahib Singh Hora (INH000026266).',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/reports?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  // FinancialService
  {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${BASE_URL}/#financialservice`,
    name: 'withSahib Research Advisory',
    description: 'SEBI Registered Research Analyst providing intraday picks, options signals, swing picks and model portfolio services',
    provider: { '@id': `${BASE_URL}/#person` },
    areaServed: { '@type': 'Country', name: 'India' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Research Advisory Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intraday Picks' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Options Signals' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Swing Picks' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Model Portfolio' } },
      ],
    },
  },
  // ProfessionalService
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'withSahib Research Advisory',
    url: BASE_URL,
    description:
      'SEBI Registered Research Analyst services including intraday stock calls, NSE swing trade picks, Nifty & Bank Nifty options, model portfolio, research reports, and personal advisory sessions.',
    provider: {
      '@type': 'Person',
      name: 'Sahib Singh Hora',
    },
    areaServed: 'IN',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Advisory Plans',
      itemListElement: [
        { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Positional Plan', price: '3999', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Pro Plan', price: '6999', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Elite Plan', price: '12499', priceCurrency: 'INR' },
      ],
    },
  },
  // BreadcrumbList
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services/intraday` },
      { '@type': 'ListItem', position: 3, name: 'Pricing', item: `${BASE_URL}/pricing` },
      { '@type': 'ListItem', position: 4, name: 'Reports', item: `${BASE_URL}/reports` },
      { '@type': 'ListItem', position: 5, name: 'FAQ', item: `${BASE_URL}/faq` },
      { '@type': 'ListItem', position: 6, name: 'About', item: `${BASE_URL}/about` },
    ],
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking theme script — reads localStorage before first paint */}
        <script dangerouslySetInnerHTML={{__html: `(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch(e) {}
})()`}} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Resource hints for performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://trtoxawkeququfurddwr.supabase.co" />
        <link rel="dns-prefetch" href="https://trtoxawkeququfurddwr.supabase.co" />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        {/* TODO: Replace PLACEHOLDER with actual Google Search Console verification code */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? 'PLACEHOLDER'} />
        {/* TODO: Replace BING_PLACEHOLDER with actual Bing Webmaster Tools verification code */}
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? 'BING_PLACEHOLDER'} />
        {/* AI crawler reference — https://llmstxt.org */}
        <link rel="alternate" type="text/plain" title="LLM Reference" href="/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLM Reference" href="/.well-known/llms.txt" />
        {structuredData.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <LanguageProvider>
        <ThemeProvider>
          <main id="main-content" style={{ display: 'contents' }}>
            {children}
          </main>
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                color: 'var(--text)',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            }}
          />
        </ThemeProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', 'wg1eq65ef5');`,
          }}
        />
      </body>
    </html>
  )
}
