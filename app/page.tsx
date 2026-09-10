import Link from 'next/link'
import {
  Monitor,
  ArrowRight,
  Camera,
  ScanSearch,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { PricingSection } from '@/components/landing/PricingSection'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const metadata = {
  title: 'PageWatch — Know the moment anything changes',
  description:
    'PageWatch monitors your pages on a schedule, compares screenshots pixel by pixel, and has Claude decide whether the change is worth telling you about.',
}

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

const STEPS = [
  {
    icon: Camera,
    title: 'Capture',
    body: 'A real Chromium browser loads the page on your schedule — hourly, daily, or weekly — and takes a full screenshot, cookie banner and all.',
  },
  {
    icon: ScanSearch,
    title: 'Diff',
    body: 'pixelmatch compares it against the last capture pixel by pixel and marks exactly which region moved.',
  },
  {
    icon: Sparkles,
    title: 'Decide',
    body: "Claude reads the diff, the region that changed, and the plain-language description you gave it — then decides whether it's worth an alert, and writes the summary.",
  },
]

const NOISE_ITEMS: { label: string; flagged?: boolean }[] = [
  { label: 'Cookie consent banner' },
  { label: 'Rotating hero image' },
  { label: '"Updated 3 minutes ago" timestamp' },
  { label: 'Pricing card changed', flagged: true },
  { label: 'CTA button text changed', flagged: true },
]

const FAQS = [
  {
    q: 'Do you need access to my code, CMS, or hosting?',
    a: 'No. PageWatch visits the public URL the same way a visitor would, on the schedule you set. Nothing to install, no credentials, no deploy hook.',
  },
  {
    q: "What counts as a 'meaningful' change?",
    a: 'A pixel threshold decides whether a diff is worth looking at, but the alert itself is written by Claude, weighing the region that changed against the plain-language description you gave it — "tell me if the price or the free-trial length changes" — so the summary says what changed, not just how much.',
  },
  {
    q: 'Can I monitor pages behind a login?',
    a: 'Authenticated capture — signing in and running a short scripted flow before the shot — is available on Business and Agency. Public pages work on every plan.',
  },
  {
    q: 'How is this different from an uptime monitor?',
    a: 'An uptime monitor tells you the server responded. PageWatch tells you what the page actually looks like now versus last time — a page can return 200 and still be visually broken, or quietly say something different.',
  },
  {
    q: 'What do I get on the free plan?',
    a: '2 monitors, weekly or daily checks, and 14 days of snapshot history — free, no card required.',
  },
  {
    q: 'Do you keep a history of what changed?',
    a: "Yes. Every capture is kept for your plan's retention window, so you can go back and see exactly what a page looked like on any check.",
  },
]

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-accent text-accent-fg">
            <Monitor className="size-3.5" aria-hidden />
          </span>
          <span className="text-ui-medium text-text">PageWatch</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ui text-text-muted transition-colors duration-120 hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroDiffMock() {
  return (
    <div
      data-animate
      className="translate-y-2 opacity-0 transition duration-150 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none data-[visible]:translate-y-0 data-[visible]:opacity-100"
    >
      <div className="overflow-hidden rounded-md border border-border bg-panel shadow-popover">
        <div className="flex h-8 items-center gap-1.5 border-b border-border bg-bg-subtle px-3">
          <span className="size-2 rounded-full bg-critical/70" aria-hidden />
          <span className="size-2 rounded-full bg-warn/70" aria-hidden />
          <span className="size-2 rounded-full bg-ok/70" aria-hidden />
          <span className="ml-2 truncate font-mono text-meta text-text-faint">
            acme.com/pricing
          </span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-4">
            <p className="mb-2 text-label uppercase text-text-faint">Before · Mon 9am</p>
            <div className="rounded border border-border bg-bg-subtle p-3">
              <div className="h-2 w-14 rounded-full bg-border-strong" />
              <p className="mt-3 text-lg font-semibold text-text">
                $49<span className="text-meta font-normal text-text-faint">/mo</span>
              </p>
              <p className="mt-1 text-meta text-text-muted">14-day free trial</p>
              <div className="mt-3 h-6 w-20 rounded bg-border-strong" />
            </div>
          </div>
          <div className="p-4">
            <p className="mb-2 text-label uppercase text-text-faint">After · Tue 9am</p>
            <div className="rounded border border-border bg-bg-subtle p-3">
              <div className="h-2 w-14 rounded-full bg-border-strong" />
              <p className="mt-3 inline-block rounded bg-diff-subtle px-1 text-lg font-semibold text-text ring-1 ring-diff">
                $79<span className="text-meta font-normal text-text-faint">/mo</span>
              </p>
              <p className="mt-1 inline-block rounded bg-diff-subtle px-1 text-meta text-text ring-1 ring-diff">
                7-day free trial
              </p>
              <div className="mt-3 h-6 w-20 rounded bg-border-strong" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-border p-4">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-diff-subtle text-diff">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-ui-medium text-text">Pricing changed</p>
              <Badge tone="warn" size="sm">
                High
              </Badge>
            </div>
            <p className="mt-1 text-meta text-text-muted">
              The monthly price moved from $49 to $79 and the free trial shortened from 14
              days to 7. 22% of the page changed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="text-label uppercase tracking-[0.06em] text-text-faint">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-ui text-text-muted transition-colors duration-120 hover:text-text"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function LandingPage() {
  const year = new Date().getFullYear()

  return (
    <main className="bg-bg">
      <ScrollReveal />
      <LandingNav />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_460px] lg:items-center lg:gap-16">
          <div>
            <Badge tone="accent" size="sm">
              Visual change monitoring
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-text sm:text-display">
              Know the moment your page stops saying what you think it says.
            </h1>
            <p className="mt-5 max-w-lg text-ui text-text-muted">
              PageWatch screenshots the pages you care about on a schedule, diffs them pixel
              by pixel, and has Claude decide whether the change is worth telling you about
              — in plain English, not a percentage.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                <Link href="/login">Start monitoring free</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-meta text-text-faint">
              No credit card. 2 monitors free, forever.
            </p>
          </div>

          <HeroDiffMock />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl">
            <p className="text-label uppercase tracking-[0.06em] text-accent">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-text sm:text-display">
              Three steps, no dashboard to babysit.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-md border border-border bg-panel p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded bg-accent-subtle text-accent">
                    <step.icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-mono text-meta text-text-faint">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-section-title text-text">{step.title}</h3>
                <p className="mt-2 text-ui text-text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Noise suppression */}
      <section className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-label uppercase tracking-[0.06em] text-accent">
                Why the alerts here are trustworthy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-text sm:text-display">
                Most visual diff tools cry wolf. This one doesn&apos;t.
              </h2>
              <p className="mt-5 text-ui text-text-muted">
                A rotating hero image, a &quot;3 people viewing this&quot; widget, or a
                timestamp in the footer changes on every single check. Tools that alert on
                raw pixel difference teach you nothing — they just train you to ignore them.
              </p>
              <p className="mt-4 text-ui text-text-muted">
                PageWatch filters that noise before it reaches you: known noisy regions,
                cookie banners and rotating content are suppressed, and Claude weighs the
                diff against what you said you actually care about before it decides to
                alert at all.
              </p>
            </div>

            <div className="rounded-md border border-border bg-panel p-6">
              <p className="text-label uppercase text-text-faint">On a typical page check</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {NOISE_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded border border-border bg-bg-subtle px-3 py-2.5"
                  >
                    <span className="text-ui text-text">{item.label}</span>
                    <Badge tone={item.flagged ? 'warn' : 'neutral'} size="sm">
                      {item.flagged ? 'Alerted' : 'Suppressed'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — renders from lib/plans.ts, no hardcoded numbers */}
      <PricingSection />

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-center text-label uppercase tracking-[0.06em] text-accent">FAQ</p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-[-0.02em] text-text sm:text-display">
            Questions people actually ask.
          </h2>

          <div className="mt-12 flex flex-col gap-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-md border border-border bg-panel px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-ui-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown
                    className="size-4 shrink-0 text-text-faint transition-transform duration-150 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-ui text-text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded bg-accent text-accent-fg">
                  <Monitor className="size-3.5" aria-hidden />
                </span>
                <span className="text-ui-medium text-text">PageWatch</span>
              </Link>
              <p className="mt-3 max-w-[220px] text-meta text-text-muted">
                Visual change intelligence for the pages you can&apos;t watch yourself.
              </p>
            </div>

            <FooterCol
              title="Product"
              links={[
                { href: '#how-it-works', label: 'How it works' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#faq', label: 'FAQ' },
                { href: '/login', label: 'Sign in' },
              ]}
            />
            <FooterCol
              title="Use cases"
              links={[
                { href: '/visual-website-monitoring', label: 'Visual monitoring' },
                { href: '/website-change-detection', label: 'Change detection' },
                { href: '/competitor-website-monitoring', label: 'Competitor tracking' },
                { href: '/website-change-history', label: 'Change history' },
                { href: '/website-monitoring-for-agencies', label: 'For agencies' },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { href: '/terms', label: 'Terms' },
                { href: '/privacy', label: 'Privacy' },
                { href: '/acceptable-use', label: 'Acceptable use' },
                { href: '/subprocessors', label: 'Subprocessors' },
              ]}
            />
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-meta text-text-faint sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} PageWatch.</p>
            <p>
              Abuse or security concerns:{' '}
              <a
                className="text-text-muted underline-offset-4 hover:underline"
                href="mailto:abuse@pagewatch.dev"
              >
                abuse@pagewatch.dev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
