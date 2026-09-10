/**
 * Shared SEO plumbing for every marketing route: canonical/OpenGraph/Twitter
 * metadata, and JSON-LD builders.
 *
 * Pure data in, pure objects out — no JSX here (this is a `.ts` file, and
 * `lib/` outside `lib/marketing` is off-limits anyway). Pages render the
 * JSON-LD themselves via:
 *
 *   <script {...jsonLdScriptProps(someJsonLd())} />
 *
 * which is `dangerouslySetInnerHTML` + `JSON.stringify` under the hood, per
 * the launch brief — never hand-concatenated markup.
 *
 * IMPORTANT: nothing in this file may emit `aggregateRating` or a review
 * count. There are no real reviews yet; fabricating one is a manual penalty
 * risk and a trust problem. If that ever needs to change, it needs a human
 * decision, not a default in a shared builder.
 */

import type { Metadata } from 'next'
import { PLAN_ORDER, PLANS } from '@/lib/plans'

export const SITE_URL = 'https://pagewatch.app'
export const SITE_NAME = 'PageWatch'

/** Builds the absolute OG image URL served by `app/api/og/route.tsx`. */
export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title })
  if (eyebrow) params.set('eyebrow', eyebrow)
  return `${SITE_URL}/api/og?${params.toString()}`
}

export interface BuildMetadataInput {
  /** Page `<title>`. Keep it the same string used for the OG image unless `ogTitle` overrides it. */
  title: string
  description: string
  /** Route path starting with `/`, e.g. `/compare/visualping`. `''` for the homepage. */
  path: string
  /** Shorter/alternate title for the OG card, if the page title is too long to render well at 1200x630. */
  ogTitle?: string
  /** Small eyebrow line shown above the title on the OG image. */
  ogEyebrow?: string
}

/**
 * The one place every marketing route builds its `metadata` export from —
 * title, description, canonical, and OpenGraph/Twitter cards pointing at the
 * dynamic OG route. Every new marketing page should use this rather than
 * hand-rolling a `Metadata` object.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  ogEyebrow,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`
  const resolvedOgTitle = ogTitle ?? title
  const image = ogImageUrl(resolvedOgTitle, ogEyebrow)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedOgTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: resolvedOgTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedOgTitle,
      description,
      images: [image],
    },
  }
}

/**
 * Spreads onto a `<script>` tag: `<script {...jsonLdScriptProps(data)} />`.
 * The only sanctioned way to emit JSON-LD in this codebase — always
 * `JSON.stringify`, never a hand-built string.
 */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const
}

/**
 * `SoftwareApplication` JSON-LD for the landing page. Offers are built
 * straight from `lib/plans.ts` — never a number typed in here — and
 * deliberately carry no `aggregateRating` or `review` field. Do not add one
 * until there are real reviews to report.
 */
export function softwareApplicationJsonLd() {
  const offers = PLAN_ORDER.filter((id) => PLANS[id].selfServe && PLANS[id].monthlyUsd !== null).map(
    (id) => {
      const plan = PLANS[id]
      return {
        '@type': 'Offer',
        name: plan.name,
        price: String(plan.monthlyUsd),
        priceCurrency: 'USD',
        url: `${SITE_URL}/#pricing`,
      }
    }
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'PageWatch screenshots the pages you care about on a schedule, diffs them pixel by pixel, and has Claude decide whether the change is worth telling you about.',
    offers,
  }
}

export interface FaqEntry {
  question: string
  answer: string
}

/** `FAQPage` JSON-LD for any page that renders a visible FAQ list. */
export function faqPageJsonLd(faqs: readonly FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export interface BreadcrumbEntry {
  name: string
  /** Path starting with `/`, or `''` for the homepage. */
  path: string
}

/** `BreadcrumbList` JSON-LD for any nested (non-homepage) marketing page. */
export function breadcrumbJsonLd(items: readonly BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
