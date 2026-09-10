import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

/**
 * Native `<details>`-based FAQ list, no client JS — same pattern as the
 * landing page's own FAQ section. Pair with `faqPageJsonLd` from
 * `lib/marketing/seo.ts` on any page that renders this.
 */
export function Faq({ items, heading }: { items: FaqItem[]; heading?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {heading && (
        <h2 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-text">{heading}</h2>
      )}
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-md border border-border bg-panel px-5 py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-ui-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="size-4 shrink-0 text-text-faint transition-transform duration-150 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="mt-3 text-ui text-text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
