import type { Metadata } from 'next'
import { SeoPage } from '@/components/landing/SeoPage'

export const metadata: Metadata = {
    title: 'Competitor Website Monitoring Tool | Track Pricing and Page Changes | PageWatch',
    description:
        'Track competitor website changes automatically with screenshot monitoring, visual diffs, and alerts. Monitor pricing pages, offers, messaging, and launches.',
}

export default function CompetitorWebsiteMonitoringPage() {
    return (
        <SeoPage
            eyebrow="Competitor website monitoring"
            title="Competitor website monitoring without constant manual checking"
            description="Track competitor pages automatically with scheduled screenshots, visual diffs, and alerts when pricing, messaging, or offers change."
            intro="Most competitor research is reactive. Someone notices a new landing page, a pricing update, or a changed value prop after it has already been live for days. PageWatch gives you a repeatable way to monitor competitor pages over time and review what changed."
            problemTitle="Manual competitor tracking does not scale"
            problemBody="Refreshing competitor pages every few days is inconsistent, hard to delegate, and easy to forget. It also gives you no visual timeline of what changed and when. PageWatch solves that by capturing snapshots on a schedule and flagging meaningful changes automatically."
            features={[
                'Monitor competitor pricing pages automatically',
                'Track landing page messaging and positioning shifts',
                'Keep screenshot history for launches and redesigns',
                'Get visual diff alerts instead of relying on memory',
                'Use AI summaries to review changes faster',
                'Watch multiple competitor URLs on separate schedules',
            ]}
            sections={[
                {
                    title: 'What to monitor on competitor websites',
                    body: 'Most teams start with pricing pages, product pages, homepages, campaign landing pages, and comparison pages. These are usually the fastest places to spot changes in positioning, packaging, promotions, or conversion strategy.',
                },
                {
                    title: 'Why screenshot history matters for competitor tracking',
                    body: 'The value is not only knowing that a page changed. It is being able to compare before and after, show the shift to your team, and build a record over time. That makes discussions about pricing, messaging, and positioning much more concrete.',
                },
                {
                    title: 'How teams use competitor website monitoring',
                    body: 'Product marketing teams use it to watch value props and launch pages. Founders use it to track pricing moves. Agencies use it to keep clients informed about competitor changes in their market. Operations and growth teams use it to stay aware without creating more manual work.',
                },
            ]}
            faqs={[
                {
                    question: 'Can I monitor competitor pricing pages?',
                    answer: 'Yes. That is one of the strongest use cases for a screenshot-based monitoring tool like PageWatch.',
                },
                {
                    question: 'Why not just use change detection browser extensions?',
                    answer: 'Extensions are often fragile, manual, and tied to one person. PageWatch gives you a scheduled, repeatable workflow with screenshot history and alerts.',
                },
                {
                    question: 'Does this help with competitor launches?',
                    answer: 'Yes. It helps you catch visible updates to launch pages, homepage messaging, pricing, and promotional content.',
                },
            ]}
            ctaTitle="Keep an eye on competitor changes automatically"
            ctaBody="Monitor the pages that matter, get alerted to pricing or messaging shifts, and keep a visual record your team can actually use."
        />
    )
}