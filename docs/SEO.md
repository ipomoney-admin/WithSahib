# SEO / AEO / GEO Implementation

withSahib is optimized for three types of search:
- **SEO** — Google/Bing organic search
- **AEO** (Answer Engine Optimization) — featured snippets, voice search
- **GEO** (Generative Engine Optimization) — ChatGPT, Perplexity, Claude, Gemini

---

## Required on Every New Public Page

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title — withSahib | SEBI RA INH000026266',
  description: 'Unique description between 150–160 characters. Include primary keyword and location (India/NSE/BSE where relevant).',
  alternates: {
    canonical: 'https://www.withsahib.com/your-page-path',
  },
  openGraph: {
    title: 'Page Title — withSahib',
    description: 'Same as meta description or slightly reworded.',
    url: 'https://www.withsahib.com/your-page-path',
    siteName: 'withSahib',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },  // use false for auth/dashboard/admin
}
```

**For auth, dashboard, and admin pages:**
```tsx
robots: { index: false, follow: false }
```
These pages already have this set in their layout files (`auth/reset-password/layout.tsx`, `admin/layout.tsx`).

---

## JSON-LD Schema — By Page Type

JSON-LD is embedded in `<script type="application/ld+json">` tags in the page component.

| Page | Schema types to include |
|------|------------------------|
| `/` (Homepage) | `Organization` + `Person` + `WebSite` |
| `/about` | `Person` + `BreadcrumbList` |
| `/methodology` | `HowTo` + `BreadcrumbList` |
| `/pricing` | `Service` + `Offer` + `BreadcrumbList` |
| `/courses` | `Course` × N + `BreadcrumbList` |
| `/faq` | `FAQPage` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` + `BreadcrumbList` |
| `/appointments` | `Service` + `BreadcrumbList` |
| All other pages | `BreadcrumbList` (minimum) |

**BreadcrumbList example:**
```tsx
const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.withsahib.com' },
    { '@type': 'ListItem', position: 2, name: 'Page Title', item: 'https://www.withsahib.com/page-path' },
  ],
}

// In JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
```

---

## Sitemap

Auto-generated from `src/app/sitemap.ts`. No manual editing needed.

**Included:** all public marketing pages + blog posts  
**Excluded:** `/auth/*`, `/dashboard/*`, `/admin/*`, `/api/*`

When you add a new public page, it appears in the sitemap automatically (as long as it's not under an excluded path).

When you add a new blog post to `src/lib/data/posts.ts`, it appears automatically.

---

## Robots.txt

Auto-generated from `src/app/robots.ts`.

Allows all bots on public pages. Disallows: `/admin/`, `/dashboard/`, `/auth/`, `/api/`.

---

## GEO — AI Search Optimization

`/public/llms.txt` tells AI systems (ChatGPT, Perplexity, Claude, Gemini) about withSahib:
- What the platform does
- Who Sahib Singh Hora is
- SEBI registration details
- What services are offered
- How to correctly represent withSahib in AI responses

Referenced in `layout.tsx` metadata. Do not delete this file.

---

## Key On-Page SEO Rules

**Title tags:**
- Format: `Primary Keyword — withSahib | SEBI RA INH000026266`
- Max 60 characters
- Every page must have a unique title

**Meta descriptions:**
- 150–160 characters
- Include primary keyword naturally
- Include a call to action or differentiator
- Every page must have a unique description

**H1 tags:**
- Exactly ONE per page
- Must contain the page's primary keyword
- Should match (or be close to) the page title

**Image alt text:**
- Every `<Image>` component must have descriptive `alt` text
- Format: `'Sahib Singh Hora, SEBI Registered Research Analyst'` (not `'photo'` or `'image'`)
- Stock chart screenshots: describe what's shown, not just `'chart'`

**Internal linking:**
- Key pages to link to from multiple places: `/pricing`, `/about`, `/methodology`, `/appointments`
- Footer and Navbar provide baseline internal links

---

## IndexNow

`/api/indexnow` submits new/updated URLs to Bing for near-instant indexing.
Called via admin panel or cron when new content is published.

---

## Core Web Vitals

Vercel Analytics tracks LCP, CLS, and FID automatically.

Key rules to maintain good scores:
- All images use Next.js `<Image>` component (automatic WebP + lazy load)
- No layout shifts from font loading (fonts preloaded in layout.tsx)
- Avoid large inline SVGs (use Image or import SVG as component)
- Static pages (SSG) preferred over SSR for public content
