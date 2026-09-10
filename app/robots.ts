import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // The OG image endpoint and the authenticated dashboard/API surface
            // aren't pages — nothing to index there, and no reason to spend
            // crawl budget on them. Every marketing route (including /compare
            // and /for) stays under the blanket allow above.
            disallow: ['/api/', '/dashboard/'],
        },
        sitemap: 'https://pagewatch.app/sitemap.xml',
    }
}