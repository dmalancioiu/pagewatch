import type { Metadata } from 'next'
import { SeoPage } from '@/components/landing/SeoPage'
import {
    breadcrumbJsonLd,
    buildMetadata,
    faqPageJsonLd,
    jsonLdScriptProps,
} from '@/lib/marketing/seo'

const PATH = '/website-change-detection'
const EYEBROW = 'Website change detection'

export const metadata: Metadata = buildMetadata({
    title: 'Website Change Detection Tool | Screenshot-Based Alerts | PageWatch',
    description:
        'Detect website changes automatically with scheduled screenshots, pixel-by-pixel diffs, and instant alerts. PageWatch helps teams catch visual changes before customers do.',
    path: PATH,
    ogEyebrow: EYEBROW,
})

const FAQS = [
    {
        question: 'Is website change detection the same as uptime monitoring?',
        answer: 'No. Uptime monitoring tells you if a page responds. Website change detection tells you if the page looks different from before. Both matter, but they solve different problems.',
    },
    {
        question: 'Can I control how sensitive alerts are?',
        answer: 'Yes. PageWatch uses thresholds so you can decide whether to catch subtle changes or only major visual updates.',
    },
    {
        question: 'Does PageWatch work for public URLs only?',
        answer: 'Based on the current product description, the core flow is built around adding public URLs and monitoring them on a schedule.',
    },
]

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
    { name: 'PageWatch', path: '' },
    { name: EYEBROW, path: PATH },
])
const FAQ_JSON_LD = faqPageJsonLd(FAQS)

export default function WebsiteChangeDetectionPage() {
    return (
        <>
        <script {...jsonLdScriptProps(BREADCRUMB_JSON_LD)} />
        <script {...jsonLdScriptProps(FAQ_JSON_LD)} />
        <SeoPage
            eyebrow="Website change detection"
            title="Website change detection that catches the changes humans actually notice"
            description="PageWatch checks any public URL on a schedule, compares screenshots pixel by pixel, and alerts you when something important changes."
            intro="Most monitoring tools tell you when a page goes down. That matters, but it misses a huge category of real problems: wrong pricing, broken checkout states, missing buttons, swapped hero sections, hidden forms, and visual regressions that still return a 200 status code."
            problemTitle="Why website change detection matters"
            problemBody="A page can be technically online and still be broken. Traditional monitoring misses that. PageWatch focuses on visible page changes by capturing screenshots over time, comparing them, and surfacing meaningful diffs when your page no longer looks the way it should."
            features={[
                'Scheduled screenshots for any public URL',
                'Pixel-by-pixel image diffing to detect visible changes',
                'Alert thresholds so you control sensitivity',
                'AI summaries that explain what changed in plain English',
                'Hourly, daily, or weekly checks per URL',
                'Useful for product pages, landing pages, sign-up flows, and checkout pages',
            ]}
            sections={[
                {
                    title: 'How website change detection works',
                    body: 'You add a URL, choose how often it should be checked, and set a sensitivity threshold. PageWatch captures a fresh screenshot on that schedule, compares it with the previous snapshot, and alerts you if the visual difference crosses the threshold you chose. This gives you a before-and-after record instead of a vague “something changed” notification.',
                },
                {
                    title: 'Why screenshot-based detection beats code-only monitoring',
                    body: 'Code-based checks can miss layout shifts, styling bugs, CMS edits, pricing updates, hidden elements, or third-party script issues. Screenshot-based monitoring looks at the output your visitors actually see. That makes it useful for marketing pages, competitor tracking, client sites, and any flow where visual correctness matters.',
                },
                {
                    title: 'What teams monitor with PageWatch',
                    body: 'Teams use PageWatch to watch pricing pages, homepage hero sections, product detail pages, legal pages, forms, sign-up pages, and checkout steps. It is especially useful when multiple people can publish changes, when external tools inject content, or when client sites change without warning.',
                },
            ]}
            faqs={FAQS}
            ctaTitle="Catch website changes before your users do"
            ctaBody="Set up monitoring in minutes, keep a visual record of every important page, and get alerted when something shifts."
        />
        </>
    )
}