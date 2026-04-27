import type { Metadata } from 'next'
import { SeoPage } from '@/components/landing/SeoPage'

export const metadata: Metadata = {
    title: 'Visual Website Monitoring Software | Pixel Diff Alerts | PageWatch',
    description:
        'Visual website monitoring for teams that care about what users actually see. Monitor pages with screenshots, pixel diffs, and AI summaries.',
}

export default function VisualWebsiteMonitoringPage() {
    return (
        <SeoPage
            eyebrow="Visual website monitoring"
            title="Visual website monitoring built for real page changes, not just server checks"
            description="PageWatch monitors websites visually by taking screenshots on a schedule and comparing them pixel by pixel."
            intro="Visual monitoring is different from technical monitoring. It focuses on the rendered page, the output your visitors see, not just response codes or DOM checks. That matters when styling breaks, content shifts, CTAs disappear, or pricing changes quietly."
            problemTitle="Most website monitoring stops too early"
            problemBody="A page can load successfully and still damage conversions. If a CTA disappears, a pricing card changes, a consent banner covers key content, or a deployment shifts the layout, your uptime monitor stays green. Visual website monitoring closes that gap."
            features={[
                'Screenshot-based checks using a real browser flow',
                'Pixel-by-pixel comparison between snapshots',
                'Plain-English AI summaries of detected changes',
                'Before-and-after screenshot history',
                'Per-URL schedules with hourly, daily, or weekly checks',
                'Useful for marketing, ecommerce, SaaS, and client websites',
            ]}
            sections={[
                {
                    title: 'What visual website monitoring means',
                    body: 'Visual website monitoring means checking what a page actually looks like over time. Instead of asking “did the server respond,” it asks “did this page visually change in a meaningful way.” PageWatch does that through scheduled screenshots and image diffs.',
                },
                {
                    title: 'When visual monitoring is better than synthetic checks alone',
                    body: 'Synthetic checks are useful for flow validation, but they do not always explain what changed visually. PageWatch is strong when you need an audit trail, when non-technical teams need to understand changes quickly, or when you care about the exact page appearance across time.',
                },
                {
                    title: 'Where visual website monitoring helps most',
                    body: 'Use it for pricing pages, feature pages, product launches, forms, onboarding pages, client websites, and regulated pages where visual proof matters. It is also useful when marketing, product, engineering, and operations all touch the same public surface area.',
                },
            ]}
            faqs={[
                {
                    question: 'What makes visual monitoring different?',
                    answer: 'It focuses on the rendered page instead of only server health or raw HTML changes.',
                },
                {
                    question: 'Does PageWatch keep screenshot history?',
                    answer: 'Yes. The product stores snapshots over time and uses them for diffs and review.',
                },
                {
                    question: 'Can PageWatch explain what changed?',
                    answer: 'Yes. The product includes AI-written summaries alongside visual diff detection.',
                },
            ]}
            ctaTitle="See changes the way your visitors do"
            ctaBody="Monitor public pages visually, review diffs over time, and turn page changes into something your team can act on fast."
        />
    )
}