import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Privacy Policy | PageWatch',
  description: 'How PageWatch collects, uses, and stores data.',
}

export default function PrivacyPage() {
  return (
    <article>
      <Badge tone="warn" size="sm">
        Draft — for legal review
      </Badge>
      <p className="mt-3 text-meta text-text-faint">
        This page is a working draft written to be honest about what the product does. It
        has not been reviewed by a lawyer and should not be treated as final until it has.
      </p>

      <h1 className="mt-6 text-page-title text-text">Privacy Policy</h1>
      <p className="mt-2 text-meta text-text-faint">Last updated September 10, 2026</p>

      <Section title="1. What we collect">
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Account data: your name and email, from sign-in.</li>
          <li>
            Workspace data: the URLs you add to monitor, your notes on what to watch for
            each one, and your notification and billing settings.
          </li>
          <li>
            Monitoring data: screenshots we capture on your schedule, the pixel diffs
            computed between them, and any AI-written summaries of what changed.
          </li>
          <li>Billing data: handled by Stripe — we store a customer and subscription ID, not your card details.</li>
        </ul>
      </Section>

      <Section title="2. How we use it">
        We use this data to run the product: taking screenshots, computing diffs, deciding
        whether to alert you, sending that alert, and billing your subscription. We don&apos;t
        sell your data, and we don&apos;t use the pages you monitor to train models beyond
        what&apos;s needed to generate your alert summaries.
      </Section>

      <Section title="3. Screenshot content">
        A screenshot of a page you ask us to monitor may incidentally contain content from
        that page — including content a third party put there. We treat it the same as any
        other workspace data: retained for your plan&apos;s window, visible only to your
        workspace, then deleted.
      </Section>

      <Section title="4. Who we share it with">
        We use a small set of subprocessors to run PageWatch — hosting, database, background
        jobs, AI summaries, email, and payments. The full list is on the{' '}
        <a className="underline underline-offset-4" href="/subprocessors">
          Subprocessors
        </a>{' '}
        page. We don&apos;t share your data with anyone outside that list except where
        required by law.
      </Section>

      <Section title="5. Retention">
        Screenshots and diffs are kept for the retention window your plan allows, then
        deleted automatically. Account and workspace data is kept until you delete your
        workspace or close your account.
      </Section>

      <Section title="6. Your choices">
        You can delete a monitor (and its history) or your entire workspace at any time from
        the dashboard. To delete your account entirely, contact{' '}
        <a className="underline underline-offset-4" href="mailto:privacy@pagewatch.dev">
          privacy@pagewatch.dev
        </a>
        .
      </Section>

      <Section title="7. Security">
        Data is encrypted in transit and at rest through our infrastructure providers.
        Access to your workspace is restricted to accounts you invite.
      </Section>

      <Section title="8. Changes to this policy">
        We may update this policy as the product changes. Material changes will be
        communicated by email or in-app notice before they take effect.
      </Section>

      <Section title="9. Contact">
        Questions about this policy: <a className="underline underline-offset-4" href="mailto:privacy@pagewatch.dev">privacy@pagewatch.dev</a>.
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-section-title text-text">{title}</h2>
      <div className="mt-2 text-ui text-text-muted">{children}</div>
    </section>
  )
}
