import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://pagewatch.app'

    return [
        '',
        '/website-change-detection',
        '/visual-website-monitoring',
        '/competitor-website-monitoring',
        '/website-change-history',
        '/website-monitoring-for-agencies',
        '/login',
        '/terms',
        '/privacy',
        '/acceptable-use',
        '/subprocessors',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))
}