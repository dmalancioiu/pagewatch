import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Panel, PanelHeader, PanelRow } from '@/components/ui/panel'

export const metadata: Metadata = {
  title: 'Subprocessors | PageWatch',
  description: 'Third parties PageWatch uses to run the product.',
}

const SUBPROCESSORS = [
  {
    name: 'Supabase',
    purpose: 'Database, authentication, and file storage for screenshots',
  },
  {
    name: 'Trigger.dev',
    purpose: 'Background job scheduling — runs the capture and diff pipeline on schedule',
  },
  {
    name: 'Anthropic',
    purpose: 'Generates the plain-English change summaries attached to alerts',
  },
  {
    name: 'Resend',
    purpose: 'Delivers alert and account emails',
  },
  {
    name: 'Stripe',
    purpose: 'Payment processing and subscription billing',
  },
  {
    name: 'Vercel',
    purpose: 'Application hosting',
  },
]

export default function SubprocessorsPage() {
  return (
    <article>
      <Badge tone="warn" size="sm">
        Draft — for legal review
      </Badge>
      <p className="mt-3 text-meta text-text-faint">
        This page is a working draft written to be honest about what the product does. It
        has not been reviewed by a lawyer and should not be treated as final until it has.
      </p>

      <h1 className="mt-6 text-page-title text-text">Subprocessors</h1>
      <p className="mt-2 text-meta text-text-faint">Last updated September 10, 2026</p>

      <p className="mt-6 text-ui text-text-muted">
        This is the complete list of third parties PageWatch relies on to run the product.
        Each one has access only to the data it needs to perform its role.
      </p>

      <div className="mt-6">
        <Panel>
          <PanelHeader>Subprocessor</PanelHeader>
          {SUBPROCESSORS.map((s) => (
            <PanelRow key={s.name} className="h-auto flex-col items-start gap-0.5 py-3">
              <span className="text-ui-medium text-text">{s.name}</span>
              <span className="text-meta text-text-muted">{s.purpose}</span>
            </PanelRow>
          ))}
        </Panel>
      </div>

      <p className="mt-6 text-ui text-text-muted">
        We&apos;ll update this page when that list changes. Questions:{' '}
        <a className="underline underline-offset-4" href="mailto:privacy@pagewatch.dev">
          privacy@pagewatch.dev
        </a>
        .
      </p>
    </article>
  )
}
