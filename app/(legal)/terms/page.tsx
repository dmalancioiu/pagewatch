import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Terms of Service | PageWatch',
  description: 'Terms of Service for PageWatch, a visual website-monitoring product.',
}

export default function TermsPage() {
  return (
    <article>
      <Badge tone="warn" size="sm">
        Draft — for legal review
      </Badge>
      <p className="mt-3 text-meta text-text-faint">
        This page is a working draft written to be honest about what the product does. It
        has not been reviewed by a lawyer and should not be treated as final until it has.
      </p>

      <h1 className="mt-6 text-page-title text-text">Terms of Service</h1>
      <p className="mt-2 text-meta text-text-faint">Last updated September 10, 2026</p>

      <Section title="1. What PageWatch does">
        PageWatch (&quot;we&quot;, &quot;us&quot;) takes scheduled screenshots of URLs you
        submit, compares them against previous captures, and sends you alerts — optionally
        with an AI-written summary — when something changes. You provide the URLs; you are
        responsible for having the right to monitor them (see our{' '}
        <a className="underline underline-offset-4" href="/acceptable-use">
          Acceptable Use Policy
        </a>
        ).
      </Section>

      <Section title="2. Your account and workspace">
        You need an account to use PageWatch. You&apos;re responsible for keeping your
        credentials secure and for activity that happens under your workspace, including
        monitors added by anyone you invite to it.
      </Section>

      <Section title="3. Plans, billing, and cancellation">
        Paid plans are billed in advance through Stripe on the cadence you choose (monthly
        or annual). You can cancel at any time; your workspace keeps its data and degrades to
        the Free plan&apos;s limits at the end of the current billing period rather than
        losing access outright. Fees are non-refundable except where required by law.
      </Section>

      <Section title="4. Acceptable use">
        You agree to use PageWatch only to monitor pages you own, operate, or otherwise have
        a legitimate right to check on a schedule from our infrastructure. Full rules are in
        the{' '}
        <a className="underline underline-offset-4" href="/acceptable-use">
          Acceptable Use Policy
        </a>
        , which is part of these Terms.
      </Section>

      <Section title="5. Data and screenshots">
        Screenshots and diffs we capture on your behalf are yours. We keep them for the
        retention window your plan allows, then delete them. See our{' '}
        <a className="underline underline-offset-4" href="/privacy">
          Privacy Policy
        </a>{' '}
        for how we handle personal data, and{' '}
        <a className="underline underline-offset-4" href="/subprocessors">
          Subprocessors
        </a>{' '}
        for who else touches it.
      </Section>

      <Section title="6. Service availability">
        We aim to run checks on the schedule you set, but scheduling jitter, target-site
        outages, rate limiting, and maintenance windows can delay or skip an individual
        check. PageWatch is provided without uptime guarantees unless a separate written
        agreement says otherwise.
      </Section>

      <Section title="7. Termination">
        You may stop using PageWatch and delete your workspace at any time. We may suspend
        or terminate a workspace that violates the Acceptable Use Policy, with notice where
        practical.
      </Section>

      <Section title="8. Disclaimers and liability">
        PageWatch is provided &quot;as is.&quot; AI-written summaries are generated
        automatically and may be wrong or incomplete — they are a starting point for your
        own judgment, not a guarantee. To the extent permitted by law, we are not liable for
        indirect or consequential damages arising from use of the product.
      </Section>

      <Section title="9. Changes to these terms">
        We may update these Terms as the product changes. Material changes will be
        communicated by email or in-app notice before they take effect.
      </Section>

      <Section title="10. Contact">
        Questions about these Terms: <a className="underline underline-offset-4" href="mailto:legal@pagewatch.dev">legal@pagewatch.dev</a>.
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-section-title text-text">{title}</h2>
      <p className="mt-2 text-ui text-text-muted">{children}</p>
    </section>
  )
}
