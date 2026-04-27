import type { Metadata } from 'next'
import { SeoPage } from '@/components/landing/SeoPage'

export const metadata: Metadata = {
    title: 'Website Change History and Visual Audit Trail | PageWatch',
    description:
        'Keep a visual history of website changes with scheduled screenshots and searchable records. Build an audit trail for client work, compliance, and internal review.',
}

export default function WebsiteChangeHistoryPage() {
    return (
        <SeoPage
            eyebrow="Website change history"
            title="A visual website change history for teams that need proof, not guesses"
            description="PageWatch keeps a screenshot history of monitored pages so you can review what changed, when it changed, and how the page looked over time."
            intro="Sometimes the goal is not immediate alerting. Sometimes you need a clean visual record. That is useful for client work, compliance reviews, internal audits, launch retrospectives, and any situation where someone will eventually ask, “What did this page look like last week?”"
            problemTitle="Most teams have no reliable record of page history"
            problemBody="Without a visual archive, teams rely on memory, scattered screenshots, or the Wayback Machine. That breaks fast when pages change often or when you need a consistent record of your own properties and client sites."
            features={[
                'Keep screenshot snapshots over time',
                'Review page history visually instead of guessing',
                'Use archive mode when you want records without alert noise',
                'Useful for audits, compliance, client reporting, and retrospectives',
                'Compare older and newer versions of the same page',
                'Build an internal record of launches, edits, and regressions',
            ]}
            sections={[
                {
                    title: 'What a website change history is good for',
                    body: 'A website change history is useful when you need accountability and context. Agencies use it to prove what changed on client sites. Internal teams use it to investigate regressions. Compliance teams use it to keep a record of public-facing pages. Founders use it to review how messaging evolved over time.',
                },
                {
                    title: 'Archive mode vs alert mode',
                    body: 'PageWatch supports both change monitoring and archive-style tracking. In alert mode, it compares snapshots and warns you when diffs pass a threshold. In archive mode, it focuses on collecting screenshots over time without generating change alerts. That gives you a visual audit trail with less operational noise.',
                },
                {
                    title: 'Why screenshots beat ad hoc records',
                    body: 'Ad hoc screenshots are inconsistent and easy to lose. A scheduled screenshot archive creates a repeatable historical record. That makes it much easier to answer client questions, support investigations, legal reviews, or launch postmortems.',
                },
            ]}
            faqs={[
                {
                    question: 'Does PageWatch support screenshot history without alerts?',
                    answer: 'Yes. The product includes an archive mode intended for screenshot collection without alerting.',
                },
                {
                    question: 'Is this useful for compliance and audits?',
                    answer: 'Yes. A visual record of public pages can be useful whenever teams need proof of what was live at a given time.',
                },
                {
                    question: 'Can I compare snapshots over time?',
                    answer: 'Yes. Snapshot history is part of the product workflow and is used for diffs and review.',
                },
            ]}
            ctaTitle="Build a visual audit trail for your important pages"
            ctaBody="Track page history over time, keep a cleaner record of what changed, and stop relying on scattered screenshots or memory."
        />
    )
}