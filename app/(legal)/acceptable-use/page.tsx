import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | PageWatch',
  description: 'What PageWatch may and may not be used to monitor.',
}

export default function AcceptableUsePage() {
  return (
    <article>
      <Badge tone="warn" size="sm">
        Draft — for legal review
      </Badge>
      <p className="mt-3 text-meta text-text-faint">
        This page is a working draft written to be honest about what the product does. It
        has not been reviewed by a lawyer and should not be treated as final until it has.
      </p>

      <h1 className="mt-6 text-page-title text-text">Acceptable Use Policy</h1>
      <p className="mt-2 text-meta text-text-faint">Last updated September 10, 2026</p>

      <p className="mt-6 text-ui text-text-muted">
        PageWatch loads pages you point it at on a recurring schedule, from our
        infrastructure, without a human watching each request. That&apos;s useful — it&apos;s
        also the reason this policy exists. It applies to every URL added to every workspace.
      </p>

      <Section title="1. Only monitor what you have the right to monitor">
        You may add a URL to PageWatch only if you own the site, operate it, or otherwise
        have clear authorization to check it on a recurring, automated basis. Do not use
        PageWatch to monitor a third party&apos;s site without their permission — including
        competitor sites you don&apos;t operate — regardless of the page being publicly
        reachable. Public reachability is not the same as consent to automated, repeated
        access.
      </Section>

      <Section title="2. We respect robots directives and rate limits">
        PageWatch honors `robots.txt` disallow rules and documented rate limits for the sites
        it captures. If a site&apos;s directives block automated access to a URL, we will not
        capture it, even if you&apos;ve added it as a monitor. Checks are spread out and
        capped per-workspace so no single monitor hammers a target site.
      </Section>

      <Section title="3. What you may not do with PageWatch">
        <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5">
          <li>Monitor sites you don&apos;t have the right to access on an automated, recurring basis.</li>
          <li>Use it to circumvent paywalls, authentication, rate limits, or anti-automation controls on a site you don&apos;t operate.</li>
          <li>Use captured screenshots or diffs to harass, defame, or impersonate anyone.</li>
          <li>Point monitors at pages designed to attack, exploit, or degrade the systems that serve them.</li>
          <li>Resell or expose PageWatch capture infrastructure as if it were your own scraping service.</li>
        </ul>
      </Section>

      <Section title="4. Authenticated capture">
        Capturing a page behind a login is only permitted for accounts and credentials you
        are authorized to use — typically your own site, or a client site under a written
        agreement that covers automated monitoring.
      </Section>

      <Section title="5. Enforcement">
        We may suspend or remove a monitor, or a workspace, that violates this policy, with
        notice where practical. Repeated or severe violations may result in account
        termination.
      </Section>

      <Section title="6. Reporting abuse">
        If PageWatch traffic is hitting your site and you believe it shouldn&apos;t be, or you
        believe a workspace is monitoring a site without authorization, contact{' '}
        <a className="underline underline-offset-4" href="mailto:abuse@pagewatch.dev">
          abuse@pagewatch.dev
        </a>
        . Include the URL and, if you can, the approximate time of the request — we
        investigate every report.
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
