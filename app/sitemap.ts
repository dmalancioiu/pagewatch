import type { MetadataRoute } from 'next'
import { COMPARISONS } from '@/lib/marketing/comparisons'
import { USE_CASES } from '@/lib/marketing/use-cases'

const BASE_URL = 'https://pagewatch.app'

/** Static top-level marketing/legal routes plus the existing SEO surfaces. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/website-change-detection', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/visual-website-monitoring', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/competitor-website-monitoring', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/website-change-history', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/website-monitoring-for-agencies', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/login', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/terms', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/privacy', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/acceptable-use', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/subprocessors', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/compare', changeFrequency: 'weekly', priority: 0.8 },
]

export default function sitemap(): MetadataRoute.Sitemap {
    const comparisonRoutes = COMPARISONS.map((c) => ({
        path: `/compare/${c.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Use-case pages are where real intent lands (per the launch brief) —
    // priority sits just under the homepage and comparison index.
    const useCaseRoutes = USE_CASES.map((u) => ({
        path: `/for/${u.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }))

    return [...STATIC_ROUTES, ...comparisonRoutes, ...useCaseRoutes].map((route) => ({
        url: `${BASE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}
