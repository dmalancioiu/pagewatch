import type { Metadata } from 'next'
import { SeoPage } from '@/components/landing/SeoPage'
import {
    breadcrumbJsonLd,
    buildMetadata,
    faqPageJsonLd,
    jsonLdScriptProps,
} from '@/lib/marketing/seo'

const PATH = '/website-monitoring-for-agencies'
const EYEBROW = 'Website monitoring for agencies'

export const metadata: Metadata = buildMetadata({
    title: 'Website Monitoring for Agencies | Client Site Change Tracking | PageWatch',
    description:
        'Website monitoring for agencies that manage multiple client sites. Track page changes, catch issues early, and keep screenshot history for proof and reporting.',
    path: PATH,
    ogEyebrow: EYEBROW,
})

const FAQS = [
    {
        question: 'Is PageWatch a good fit for agencies managing multiple sites?',
        answer: 'Yes. The product is well aligned with agency workflows because it monitors URLs on schedules and keeps visual history over time.',
    },
    {
        question: 'Can this reduce support surprises?',
        answer: 'Yes. It helps agencies catch visible issues earlier instead of learning about them from end users or clients.',
    },
    {
        question: 'What pages should agencies monitor first?',
        answer: 'Start with high-impact pages like homepages, pricing pages, forms, landing pages, and checkout or sign-up flows.',
    },
]

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
    { name: 'PageWatch', path: '' },
    { name: EYEBROW, path: PATH },
])
const FAQ_JSON_LD = faqPageJsonLd(FAQS)

export default function WebsiteMonitoringForAgenciesPage() {
    return (
        <>
        <script {...jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
        <script {...jsonLdScriptProps(FAQ_JSON_LD)} />
        <SeoPage
            eyebrow="Website monitoring for agencies"
            title="Website monitoring for agencies that need to know before the client does"
            description="PageWatch helps agencies monitor client sites with scheduled screenshots, visual diffs, alert thresholds, and screenshot history."
            intro="Agencies are usually held responsible for website issues even when the change came from a CMS edit, a third-party app, a client update, or a rushed deployment. That is why agencies need visibility, not just analytics after the fact."
            problemTitle="Client sites change when you are not looking"
            problemBody="The hard part is not only building and launching. It is staying aware after launch, across multiple sites, stakeholders, and update paths. When a page shifts, agencies need to catch it quickly, prove what changed, and communicate clearly."
            features={[
                'Monitor multiple client URLs on separate schedules',
                'Catch visible regressions before clients report them',
                'Keep screenshot history for proof and reporting',
                'Use diff views to explain changes clearly',
                'Set thresholds per URL based on page importance',
                'Useful for retainers, maintenance plans, and post-launch support',
            ]}
            sections={[
                {
                    title: 'Why agencies need visual monitoring',
                    body: 'Agencies operate in high-blame environments. A broken page, missing CTA, or pricing issue quickly becomes your problem whether you caused it or not. Visual monitoring helps agencies catch problems earlier and respond with evidence instead of guesswork.',
                },
                {
                    title: 'How agencies use PageWatch',
                    body: 'Agencies use PageWatch to monitor homepage sections, pricing pages, lead-gen pages, forms, service pages, and client campaign pages. It is especially useful after launches, migrations, redesigns, and CMS handoffs when unexpected changes are more likely.',
                },
                {
                    title: 'Why screenshot history matters for agency-client relationships',
                    body: 'Clients want clarity. A screenshot history lets you show what changed and when. That makes issue review faster and gives account managers, developers, and clients a shared reference point instead of subjective recollection.',
                },
            ]}
            faqs={FAQS}
            ctaTitle="Stay ahead of client-side website issues"
            ctaBody="Monitor the pages clients care about most, keep proof of what changed, and spot visual regressions before they become awkward calls."
        />
        </>
    )
}