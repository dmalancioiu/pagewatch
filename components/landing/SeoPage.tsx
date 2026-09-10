import Link from 'next/link'
import { ArrowRight, Check, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Section = {
  title: string
  body: string
}

type Faq = {
  question: string
  answer: string
}

type SeoPageProps = {
  eyebrow: string
  title: string
  description: string
  intro: string
  problemTitle: string
  problemBody: string
  features: string[]
  sections: Section[]
  faqs: Faq[]
  ctaTitle: string
  ctaBody: string
}

/**
 * Shared shell for the SEO landing surfaces. Same visual system as the main
 * landing page (tokens + primitives only) so an organic visitor lands
 * somewhere that already looks like the product they're about to sign up
 * for. Route files under app/*-monitoring etc. supply the copy and keep
 * their existing metadata/slugs — only this shell changed.
 */
export function SeoPage({
  eyebrow,
  title,
  description,
  intro,
  problemTitle,
  problemBody,
  features,
  sections,
  faqs,
  ctaTitle,
  ctaBody,
}: SeoPageProps) {
  return (
    <main className="bg-bg">
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
            {eyebrow}
          </Badge>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-text sm:text-display">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-ui text-text-muted">{description}</p>
          <p className="mt-4 max-w-2xl text-ui text-text-faint">{intro}</p>

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

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="rounded-md border border-border bg-panel p-8 shadow-card">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
              {problemTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-ui text-text-muted">{problemBody}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
            Why teams use PageWatch
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-md border border-border bg-panel p-4"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
                <p className="text-ui text-text">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-2xl text-ui text-text-muted">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">FAQ</h2>
          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-md border border-border bg-panel p-5">
                <h3 className="text-ui-medium text-text">{faq.question}</h3>
                <p className="mt-2 text-ui text-text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <div className="rounded-md border border-accent bg-accent-subtle p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text">{ctaTitle}</h2>
            <p className="mt-4 max-w-xl text-ui text-text-muted">{ctaBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/login">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
