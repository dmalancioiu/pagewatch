import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Monitor, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { Faq } from '@/components/landing/Faq'
import { Cta } from '@/components/landing/Cta'
import { FEATURE_LABELS } from '@/lib/plans'
import { USE_CASES, getUseCase, recommendedPlanFor } from '@/lib/marketing/use-cases'
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdScriptProps,
} from '@/lib/marketing/seo'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return USE_CASES.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const useCase = getUseCase(slug)
  if (!useCase) return {}

  return buildMetadata({
    title: `${useCase.title} | PageWatch`,
    description: useCase.description,
    path: `/for/${useCase.slug}`,
    ogTitle: useCase.title,
    ogEyebrow: useCase.eyebrow,
  })
}

export default async function UseCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const useCase = getUseCase(slug)
  if (!useCase) notFound()

  const plan = recommendedPlanFor(useCase)
  const breadcrumb = breadcrumbJsonLd([
    { name: 'PageWatch', path: '' },
    { name: useCase.eyebrow, path: `/for/${useCase.slug}` },
  ])
  const faqJsonLd = faqPageJsonLd(useCase.faqs)

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
            <span aria-hidden>For</span>
            <span aria-hidden>/</span>
            <span className="text-text-muted">{useCase.eyebrow}</span>
          </nav>

          <Badge tone="accent" size="sm" className="mt-4">
            {useCase.eyebrow}
          </Badge>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-text sm:text-display">
            {useCase.title}
          </h1>

          <p className="mt-6 max-w-2xl text-ui text-text-muted">{useCase.description}</p>
          <p className="mt-4 max-w-2xl text-ui text-text-faint">{useCase.intro}</p>

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

      {/* What to monitor + example alert */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
                What you&apos;d monitor
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {useCase.whatToMonitor.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ui text-text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
                What an alert looks like
              </h2>
              <div className="mt-6 overflow-hidden rounded-md border border-border bg-panel">
                <div className="flex items-start gap-3 p-5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-diff-subtle text-diff">
                    <Sparkles className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-ui-medium text-text">{useCase.alertExample.title}</p>
                      <SeverityBadge severity={useCase.alertExample.severity} size="sm" />
                    </div>
                    <p className="mt-1.5 text-ui text-text-muted">
                      {useCase.alertExample.summary}
                    </p>
                    <p className="mt-2 text-meta text-text-faint">{useCase.alertExample.meta}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it saves you */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            What it saves you
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {useCase.whatItSaves.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-md border border-border bg-panel p-4"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
                <p className="text-ui text-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant features + recommended plan */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Built on top of
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {useCase.relevantFeatures.map((feature) => (
              <Badge key={feature} tone="neutral" size="md">
                {FEATURE_LABELS[feature]}
              </Badge>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-ui text-text-muted">
            This typically starts to make sense on <strong className="text-text">{plan.name}</strong>
            {' — '}
            {plan.tagline.toLowerCase()}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <Faq items={useCase.faqs} heading="FAQ" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <Cta
            title="Start watching the pages that matter"
            body="Two monitors, free, forever, no card required. Add a page and PageWatch takes a baseline screenshot right away."
          />
        </div>
      </section>
    </main>
  )
}
