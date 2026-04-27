import { MetadataRoute } from 'next'
import { POSTS } from '@/lib/data/posts'

const base = 'https://www.withsahib.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const blogEntries: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [
    // Core pages
    { url: base,                                  lastModified: now, changeFrequency: 'daily',   priority: 1.00 },
    { url: `${base}/pricing`,                     lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/methodology`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/who-its-for`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${base}/courses`,                     lastModified: now, changeFrequency: 'weekly',  priority: 0.90 },
    { url: `${base}/blog`,                        lastModified: now, changeFrequency: 'daily',   priority: 0.85 },
    { url: `${base}/contact`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${base}/work-with-us`,                lastModified: now, changeFrequency: 'monthly', priority: 0.60 },
    { url: `${base}/appointments`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${base}/faq`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.85 },

    // Services
    { url: `${base}/services`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${base}/services/intraday`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${base}/services/stock-options`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/services/index-options`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/services/swing`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },

    // Statutory
    { url: `${base}/investor-charter`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.50 },
    { url: `${base}/complaints`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${base}/disclosure`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${base}/refund-policy`,               lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${base}/grievance-redressal`,         lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${base}/smart-odr`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${base}/mitc`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${base}/terminology`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${base}/privacy-policy`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.40 },
    { url: `${base}/terms-of-service`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.40 },
    { url: `${base}/disclaimer`,                  lastModified: now, changeFrequency: 'yearly',  priority: 0.40 },

    ...blogEntries,
  ]
}
