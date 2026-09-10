import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Closing call-to-action block — same visual pattern as the landing page and
 * `SeoPage`'s final section, extracted so `/compare` and `/for` pages don't
 * each re-type it.
 */
export function Cta({
  title,
  body,
  primaryHref = '/login',
  primaryLabel = 'Start free',
  secondaryHref = '/',
  secondaryLabel = 'Back to homepage',
}: {
  title: string
  body: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <div className="rounded-md border border-accent bg-accent-subtle p-8">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">{title}</h2>
      <p className="mt-4 max-w-xl text-ui text-text-muted">{body}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
    </div>
  )
}
