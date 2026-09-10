import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Monitor } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Cta } from '@/components/landing/Cta'
import { COMPARISONS } from '@/lib/marketing/comparisons'
import { breadcrumbJsonLd, buildMetadata, jsonLdScriptProps } from '@/lib/marketing/seo'

export const metadata: Metadata = buildMetadata({
  title: 'PageWatch vs the other visual monitoring tools',
  description:
    'Honest comparisons between PageWatch and the other page-change monitoring tools — what each is built for, and where AI relevance filtering changes the day-to-day experience.',
  path: '/compare',
  ogEyebrow: 'Comparisons',
})

const BREADCRUMB = breadcrumbJsonLd([
  { name: 'PageWatch', path: '' },
  { name: 'Compare', path: '/compare' },
])

export default function ComparePage() {
  return (
    <main className="bg-bg">
      <script {...jsonLdScriptProps(BREADCRUMB)} />

      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ui text-text-muted transition-colors duration-120 hover:text-text"
          >
            <Monitor className="size-4" aria-hidden />
            PageWatch
          </Link>

          <Badge tone="accent" size="sm" className="mt-8">
            Comparisons
          </Badge>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-text sm:text-display">
            PageWatch vs the other visual monitoring tools
          </h1>

          <p className="mt-6 max-w-2xl text-ui text-text-muted">
            &quot;Screenshot a page, diff it, email me&quot; is a solved, crowded problem — most
            tools here do that part well. What PageWatch adds is a model that looks at
            before/after with the intent you stated and decides whether it actually matters.
          </p>
          <p className="mt-4 max-w-2xl text-ui text-text-faint">
            Every page below is written so you can make the call yourself — including when the
            other tool is the better fit. All trademarks belong to their respective owners.
          </p>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COMPARISONS.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group flex items-center justify-between gap-4 rounded-md border border-border bg-panel p-5 transition-colors duration-120 hover:bg-panel-raised"
              >
                <div>
                  <p className="text-ui-medium text-text">PageWatch vs {comparison.name}</p>
                  <p className="mt-1 text-meta text-text-muted">{comparison.category}</p>
                </div>
                <ArrowRight
                  className="size-4 shrink-0 text-text-faint transition-transform duration-120 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <Cta
            title="See it catch something real"
            body="Two monitors, free, forever. Add a page you already care about and get a baseline screenshot right away."
            primaryLabel="Start free"
          />
        </div>
      </section>
    </main>
  )
}
