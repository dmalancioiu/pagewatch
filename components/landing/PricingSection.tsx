'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Minus } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    desc: 'For personal projects and trying things out.',
    monthly: 0,
    annual: 0,
    cta: 'Start for free',
    highlight: false,
    features: [
      '3 monitored URLs',
      'Daily checks',
      '7-day screenshot history',
      'Email alerts',
    ],
    missing: [
      'Hourly checks',
      'AI change summaries',
    ],
  },
  {
    name: 'Pro',
    desc: 'For founders and teams who need real coverage.',
    monthly: 29,
    annual: 23,
    cta: 'Start 14-day trial',
    highlight: true,
    badge: 'Most popular',
    features: [
      '25 monitored URLs',
      'Hourly checks',
      '90-day screenshot history',
      'Email alerts',
      'AI change summaries',
      'Diff image in every alert',
    ],
    missing: [],
  },
  {
    name: 'Agency',
    desc: 'For agencies monitoring client properties at scale.',
    monthly: 79,
    annual: 63,
    cta: 'Start 14-day trial',
    highlight: false,
    features: [
      'Unlimited URLs',
      'Hourly checks',
      '1-year screenshot history',
      'Email alerts',
      'AI change summaries',
      'Diff image in every alert',
      'White-label reports',
      'Priority support',
    ],
    missing: [],
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-28 relative" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neon mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Priced for what you actually need.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            No seat fees. No overage surprises. Pay for URLs, get alerts.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12" data-animate data-delay-1>
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-white/40'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full border transition-colors ${
              annual ? 'bg-[#00ff88] border-[#00ff88]' : 'bg-white/10 border-white/10'
            }`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all ${
                annual ? 'translate-x-5 bg-[#0a0a0a]' : 'translate-x-0 bg-white/60'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${annual ? 'text-white' : 'text-white/40'}`}>
            Annual
            <span className="text-[11px] font-semibold text-neon bg-[#00ff88]/10 border border-[#00ff88]/25 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch" data-animate data-delay-2>
          {plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly
            if (plan.highlight) {
              return (
                <div key={plan.name} className="pro-card-neon shadow-[0_0_60px_rgba(0,255,136,0.08)]">
                  <div className="pro-card-neon-inner p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-lg">{plan.name}</h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] bg-[#00ff88] px-2.5 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white/45 mb-6">{plan.desc}</p>
                    <div className="flex items-baseline gap-1.5 mb-7">
                      <span className="text-4xl font-bold text-white">${price}</span>
                      <span className="text-white/40 text-sm">/month</span>
                      {annual && plan.monthly > 0 && (
                        <span className="text-white/25 text-xs line-through ml-1">${plan.monthly}</span>
                      )}
                    </div>
                    <Link
                      href="/login"
                      className="btn-neon block w-full py-3 rounded-xl text-sm text-center mb-8"
                    >
                      {plan.cta}
                    </Link>
                    <div className="space-y-3 mt-auto">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5">
                          <Check className="w-3.5 h-3.5 text-neon flex-shrink-0" />
                          <span className="text-sm text-white/75">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div
                key={plan.name}
                className="rounded-2xl border p-8 flex flex-col"
                style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <h3 className="font-semibold text-white text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-white/45 mb-6">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-7">
                  <span className="text-4xl font-bold text-white">
                    {price === 0 ? 'Free' : `$${price}`}
                  </span>
                  {price > 0 && <span className="text-white/40 text-sm">/month</span>}
                  {annual && plan.monthly > 0 && (
                    <span className="text-white/25 text-xs line-through ml-1">${plan.monthly}</span>
                  )}
                </div>
                <Link
                  href="/login"
                  className="btn-wire block w-full py-3 rounded-xl text-sm text-center mb-8"
                >
                  {plan.cta}
                </Link>
                <div className="space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-neon flex-shrink-0" />
                      <span className="text-sm text-white/75">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 opacity-35">
                      <Minus className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                      <span className="text-sm text-white/40">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-white/25 mt-8" data-animate data-delay-3>
          No credit card required for the free plan. Trial includes all Pro features.
        </p>
      </div>
    </section>
  )
}
