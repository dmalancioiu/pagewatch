import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Minus, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { Faq } from '@/components/landing/Faq'
import { Cta } from '@/components/landing/Cta'
import { COMPARISONS, buildComparisonRows, getComparison } from '@/lib/marketing/comparisons'
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdScriptProps,
} from '@/lib/marketing/seo'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return COMPARISONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const comparison = getComparison(slug)
  if (!comparison) return {}

  return buildMetadata({
    title: `${comparison.title} | PageWatch`,
    description: comparison.description,
    path: `/compare/${comparison.slug}`,
    ogTitle: comparison.title,
    ogEyebrow: comparison.eyebrow,
  })
}

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const comparison = getComparison(slug)
  if (!comparison) notFound()

  const rows = buildComparisonRows(comparison.name)
  const breadcrumb = breadcrumbJsonLd([
    { name: 'PageWatch', path: '' },
    { name: 'Compare', path: '/compare' },
    { name: comparison.name, path: `/compare/${comparison.slug}` },
  ])
  const faqJsonLd = faqPageJsonLd(comparison.faqs)

  return (
    <main className="bg-bg">
      <script {...jsonLdScriptProps(breadcrumb)} />
      <script {...jsonLdScriptProps(faqJsonLd)} />

      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ui text-text-muted transition-colors duration-120 hover:text-text"
          >
            <Monitor className="size-4" aria-hidden />
            PageWatch
          </Link>

          <nav aria-label="Breadcrumb" className="mt-6 flex items-center gap-2 text-meta text-text-faint">
            <Link href="/compare" className="hover:text-text-muted">
              Compare
            </Link>
            <span aria-hidden>/</span>
            <span className="text-text-muted">{comparison.name}</span>
          </nav>

          <Badge tone="accent" size="sm" className="mt-4">
            {comparison.eyebrow}
          </Badge>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-text sm:text-display">
            {comparison.title}
          </h1>

          <p className="mt-6 max-w-2xl text-ui text-text-muted">{comparison.description}</p>
          <p className="mt-4 max-w-2xl text-ui text-text-faint">{comparison.category}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" iconRight={<ArrowRight className="size-4" aria-hidden />}>
              <Link href="/login">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Who this is for / who it isn't */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Who PageWatch fits best — and who it doesn&apos;t
          </h2>
          <p className="mt-3 max-w-2xl text-ui text-text-muted">
            Neither tool is right for everyone. This is meant to help you decide, not win the
            decision.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-panel p-6">
              <p className="text-ui-medium text-text">Reach for PageWatch when</p>
              <ul className="mt-4 flex flex-col gap-3">
                {comparison.whoPageWatchFitsBest.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ui text-text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-panel p-6">
              <p className="text-ui-medium text-text">
                {comparison.name} (or something simpler) may fit better when
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {comparison.whoItIsntFor.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ui text-text-muted">
                    <Minus className="mt-0.5 size-4 shrink-0 text-text-faint" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Noise suppression story */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Why the alerts here are trustworthy
          </h2>
          <p className="mt-4 max-w-2xl text-ui text-text-muted">
            A rotating hero image, a &quot;3 people viewing this&quot; widget, or a footer
            timestamp changes on every single check. Tools that alert on raw pixel difference
            teach you nothing — they just train you to ignore them.
          </p>
          <p className="mt-4 max-w-2xl text-ui text-text-muted">
            PageWatch filters that noise before it reaches you: known noisy regions and rotating
            content are suppressed, and Claude weighs the diff against what you said you actually
            care about — the page&apos;s watch description, and any per-zone instruction — before
            it decides to alert at all.
          </p>
        </div>
      </section>

      {/* Capability table */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Capability comparison
          </h2>
          <p className="mt-3 max-w-2xl text-ui text-text-muted">
            Every PageWatch figure below comes straight from our plan catalog. We can&apos;t
            verify {comparison.name}&apos;s current pricing or limits from here, so that column
            stays neutral — check their site directly.
          </p>
          <div className="mt-8">
            <ComparisonTable competitorName={comparison.name} rows={rows} />
          </div>
        </div>
      </section>

      {/* Switching */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Switching from {comparison.name}
          </h2>
          <div className="mt-8 flex flex-col gap-8">
            {comparison.switching.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle font-mono text-meta text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="text-ui-medium text-text">{step.title}</p>
                  <p className="mt-1.5 max-w-2xl text-ui text-text-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <Faq items={comparison.faqs} heading="FAQ" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <Cta
            title={`Try PageWatch instead of ${comparison.name}`}
            body="Two monitors, free, forever, no card required. Add the page you'd otherwise be checking by hand."
          />
          <p className="mt-6 text-meta text-text-faint">
            {comparison.name} and any other product names on this page are trademarks of their
            respective owners. Nothing here is sponsored by or affiliated with them.
          </p>
        </div>
      </section>
    </main>
  )
}
