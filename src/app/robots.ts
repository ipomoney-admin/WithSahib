import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.withsahib.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/settings/', '/auth/callback', '/admin/'],
      },
      // OpenAI ChatGPT
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      // Anthropic Claude
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'anthropic-ai', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      // Perplexity
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      // Google
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'GoogleOther', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'Googlebot-Image', allow: '/' },
      // Bing / Microsoft
      { userAgent: 'Bingbot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      { userAgent: 'BingPreview', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
      // Meta / Facebook
      { userAgent: 'facebookexternalhit', allow: '/' },
      // Apple
      { userAgent: 'Applebot', allow: '/', disallow: ['/api/', '/dashboard/', '/admin/'] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
