'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  PLAN_ORDER,
  PLANS,
  FEATURE_LABELS,
  FREQUENCY_LABELS,
  type FeatureKey,
} from '@/lib/plans'

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as FeatureKey[]

// Annual savings are derived from the catalog, not typed in twice — Pro is
// the representative self-serve tier for the "save X%" badge.
const ANNUAL_SAVINGS_PCT = Math.round(
  (1 - PLANS.pro.annualUsd! / PLANS.pro.monthlyUsd!) * 100
)

function formatPrice(usd: number | null) {
  if (usd === null) return 'Custom'
  if (usd === 0) return 'Free'
  return `$${usd}`
}

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-label uppercase tracking-[0.06em] text-accent">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-text sm:text-display">
            Priced for what you actually watch.
          </h2>
          <p className="mt-4 text-ui text-text-muted">
            Every plan reads from the same limits the product enforces — what you see here is
            what you get, nothing negotiated only in an email.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={annual ? 'text-ui text-text-muted' : 'text-ui-medium text-text'}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
          <span className={annual ? 'text-ui-medium text-text' : 'text-ui text-text-muted'}>
            Annual
          </span>
          <Badge tone="accent" size="sm">
            Save {ANNUAL_SAVINGS_PCT}%
          </Badge>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_ORDER.map((id) => {
            const plan = PLANS[id]
            const price = annual ? plan.annualUsd : plan.monthlyUsd
            const isHighlight = id === 'pro'

            return (
              <div
                key={id}
                className={
                  isHighlight
                    ? 'relative flex flex-col rounded-md border-2 border-accent bg-panel p-6 shadow-card'
                    : 'relative flex flex-col rounded-md border border-border bg-panel p-6 shadow-card'
                }
              >
                {isHighlight && (
                  <Badge tone="accent" className="absolute -top-2.5 left-6">
                    Most popular
                  </Badge>
                )}

                <h3 className="text-section-title text-text">{plan.name}</h3>
                <p className="mt-1 min-h-[34px] text-meta text-text-muted">{plan.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-[-0.02em] text-text">
                    {formatPrice(price)}
                  </span>
                  {price !== null && price > 0 && (
                    <span className="text-meta text-text-faint">/mo</span>
                  )}
                  {annual && plan.monthlyUsd !== null && plan.monthlyUsd > 0 && (
                    <span className="text-meta text-text-faint line-through">
                      ${plan.monthlyUsd}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  {plan.selfServe ? (
                    <Button asChild variant={isHighlight ? 'primary' : 'secondary'} className="w-full">
                      <Link href={`/login?plan=${id}`}>
                        {plan.monthlyUsd === 0 ? 'Start for free' : `Start with ${plan.name}`}
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="secondary" className="w-full">
                      <a href="mailto:sales@pagewatch.dev?subject=Agency%20plan">Talk to sales</a>
                    </Button>
                  )}
                </div>

                <ul className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                  <li className="flex items-center gap-2 text-ui text-text">
                    <Check className="size-3.5 shrink-0 text-ok" aria-hidden />
                    {plan.limits.maxMonitors} monitors
                  </li>
                  <li className="flex items-center gap-2 text-ui text-text">
                    <Check className="size-3.5 shrink-0 text-ok" aria-hidden />
                    {plan.limits.allowedFrequencies.map((f) => FREQUENCY_LABELS[f]).join(' · ')} checks
                  </li>
                  <li className="flex items-center gap-2 text-ui text-text">
                    <Check className="size-3.5 shrink-0 text-ok" aria-hidden />
                    {plan.limits.retentionDays}-day snapshot history
                  </li>
                </ul>

                <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  {FEATURE_KEYS.map((key) => {
                    const included = plan.features[key]
                    return (
                      <li
                        key={key}
                        className={
                          included
                            ? 'flex items-center gap-2 text-ui text-text'
                            : 'flex items-center gap-2 text-ui text-text-faint opacity-60'
                        }
                      >
                        {included ? (
                          <Check className="size-3.5 shrink-0 text-ok" aria-hidden />
                        ) : (
                          <Minus className="size-3.5 shrink-0 text-text-faint" aria-hidden />
                        )}
                        {FEATURE_LABELS[key]}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-meta text-text-faint">
          No credit card required on Free. Every plan enforces its limits the moment you hit
          them — an upgrade prompt names the plan that lifts it, never a dead end.
        </p>
      </div>
    </section>
  )
}
