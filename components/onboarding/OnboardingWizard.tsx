'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createWorkspace } from '@/lib/actions/workspace'
import {
  addUrlsToMonitor,
  saveNotificationChannel,
  completeOnboardingStep,
} from '@/lib/actions/onboarding'
import { PLANS, PLAN_ORDER, FREQUENCY_LABELS } from '@/lib/plans'
import type { CheckFrequency } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ArrowRight, Check, Monitor, AlertCircle } from 'lucide-react'

interface OnboardingWizardProps {
  userEmail: string
  userName: string
}

const STEP_LABELS = ['What to watch', 'How often', 'Confirm'] as const

const FREQUENCY_OPTIONS: { value: CheckFrequency; blurb: string }[] = [
  { value: 'weekly', blurb: 'A check once a week. Good for stable pages.' },
  { value: 'daily', blurb: 'A check once a day. The right default for most pages.' },
  { value: 'hourly', blurb: 'A check every hour. For pages that move fast.' },
]

/**
 * New workspaces are created on the free plan (the `plan` column's DB
 * default) — nothing has been paid for yet at this point in the funnel, so
 * that is the correct allowance to gate against here. `lib/entitlements.ts`
 * re-checks the real workspace plan server-side regardless; this only
 * decides what the wizard shows as available up front.
 */
const STARTING_PLAN = PLANS.free

function cheapestPlanNaming(frequency: CheckFrequency): string | null {
  for (const id of PLAN_ORDER) {
    const plan = PLANS[id]
    if (plan.limits.allowedFrequencies.includes(frequency)) return plan.name
  }
  return null
}

function deriveWorkspaceName(rawUrl: string): { name: string; domain: string } {
  try {
    const full = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
    const hostname = new URL(full).hostname.replace(/^www\./, '')
    return { name: hostname, domain: hostname }
  } catch {
    return { name: 'My workspace', domain: 'workspace' }
  }
}

export function OnboardingWizard({ userEmail, userName }: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')
  const [watchDescription, setWatchDescription] = useState('')
  const [frequency, setFrequency] = useState<CheckFrequency>('daily')
  const [urlError, setUrlError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canContinueFromStep0 = url.trim().length > 2

  function goNext() {
    if (step === 0 && !canContinueFromStep0) {
      setUrlError('Enter the URL you want to watch.')
      return
    }
    setUrlError(null)
    setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1))
  }

  function goBack() {
    setFormError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  function handleLaunch() {
    setFormError(null)
    startTransition(async () => {
      const fullUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
      const { name, domain } = deriveWorkspaceName(fullUrl)

      let workspace: { id: string }
      try {
        workspace = await createWorkspace(name, domain)
      } catch {
        setFormError('We could not create your workspace. Try again in a moment.')
        return
      }

      const res = await addUrlsToMonitor(workspace.id, [
        {
          url: fullUrl,
          check_frequency: frequency,
          watch_description: watchDescription.trim() || null,
        },
      ])

      if (!res.ok) {
        if (res.kind === 'validation' && res.fieldErrors?.urls?.[0]) {
          setUrlError(res.fieldErrors.urls[0])
          setStep(0)
        } else {
          setFormError(res.message)
        }
        return
      }

      // Best-effort — the workspace and monitor already exist either way, so
      // a hiccup here shouldn't strand the user on the wizard.
      try {
        if (userEmail) await saveNotificationChannel(workspace.id, userEmail, 'daily')
        await completeOnboardingStep(workspace.id, 'review', { check_frequency: frequency })
      } catch {
        // non-fatal
      }

      router.push('/dashboard')
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-lg overflow-hidden rounded-md border border-border bg-panel shadow-popover">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded bg-accent text-accent-fg">
                <Monitor className="size-3.5" aria-hidden />
              </span>
              <span className="text-ui-medium text-text">
                {userName ? `Welcome, ${userName.split(' ')[0]}` : 'Welcome'}
              </span>
            </div>
            <span className="text-meta text-text-faint">
              Step {step + 1} of {STEP_LABELS.length}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-bg-subtle">
            <div
              className="h-full rounded-full bg-accent transition-all duration-150 ease-out"
              style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[320px] px-6 py-7">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-page-title text-text">What do you want to watch?</h1>
                <p className="mt-1.5 text-ui text-text-muted">
                  Add the page you want us to keep an eye on, and tell us what matters in
                  plain language — we pass that straight to the AI that writes your alerts.
                </p>
              </div>

              <Field label="Page URL" htmlFor="onboarding-url" error={urlError ?? undefined} required>
                <Input
                  id="onboarding-url"
                  prefix="https://"
                  placeholder="acme.com/pricing"
                  value={url.replace(/^https?:\/\//, '')}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (urlError) setUrlError(null)
                  }}
                  autoFocus
                />
              </Field>

              <Field
                label="What matters to you"
                htmlFor="onboarding-watch-desc"
                description="Optional, but this is what makes the alert useful — Claude reads it before deciding whether to notify you."
              >
                <Textarea
                  id="onboarding-watch-desc"
                  autoGrow
                  maxRows={4}
                  placeholder="Tell me if the price or the free-trial length changes"
                  value={watchDescription}
                  onChange={(e) => setWatchDescription(e.target.value)}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-page-title text-text">How often should we check?</h1>
                <p className="mt-1.5 text-ui text-text-muted">
                  You&apos;re starting on the {STARTING_PLAN.name} plan. You can change this
                  any time from monitor settings.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {FREQUENCY_OPTIONS.map((option) => {
                  const allowed = STARTING_PLAN.limits.allowedFrequencies.includes(option.value)
                  const active = frequency === option.value
                  const unlockedBy = !allowed ? cheapestPlanNaming(option.value) : null

                  const card = (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!allowed}
                      onClick={() => allowed && setFrequency(option.value)}
                      title={!allowed && unlockedBy ? `${unlockedBy} unlocks this` : undefined}
                      className={
                        active
                          ? 'w-full rounded-md border-2 border-accent bg-accent-subtle p-4 text-left transition-colors duration-120'
                          : 'w-full rounded-md border border-border-strong bg-panel p-4 text-left transition-colors duration-120 hover:bg-panel-raised disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-panel'
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-ui-medium text-text">
                          {FREQUENCY_LABELS[option.value]}
                        </span>
                        {active && <Check className="size-4 text-accent" aria-hidden />}
                      </div>
                      <p className="mt-1 text-meta text-text-muted">{option.blurb}</p>
                    </button>
                  )

                  if (allowed) return card

                  return (
                    <Tooltip key={option.value}>
                      <TooltipTrigger asChild>
                        <span tabIndex={0} className="block">
                          {card}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {unlockedBy
                          ? `${unlockedBy} unlocks ${FREQUENCY_LABELS[option.value].toLowerCase()} checks.`
                          : 'Not available on your plan.'}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-page-title text-text">Ready to start watching.</h1>
                <p className="mt-1.5 text-ui text-text-muted">
                  We&apos;ll take a first screenshot right away as your baseline. Alerts start
                  once there&apos;s something to compare it against — your next check.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-md border border-border bg-bg-subtle p-4">
                <SummaryRow label="Monitor" value={url.replace(/^https?:\/\//, '') || '—'} />
                <Separator />
                <SummaryRow
                  label="Watching for"
                  value={watchDescription.trim() || 'Any meaningful visual change'}
                />
                <Separator />
                <SummaryRow label="Check frequency" value={FREQUENCY_LABELS[frequency]} />
                <Separator />
                <SummaryRow
                  label="Alerts"
                  value={userEmail ? `Email — ${userEmail}` : 'Email not set'}
                />
              </div>

              {formError && (
                <div className="flex items-start gap-2 rounded-md border border-critical/30 bg-critical-subtle p-3 text-ui text-critical">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            disabled={step === 0}
            iconLeft={<ArrowLeft className="size-3.5" aria-hidden />}
            className={step === 0 ? 'invisible' : undefined}
          >
            Back
          </Button>

          {step < STEP_LABELS.length - 1 ? (
            <Button onClick={goNext} iconRight={<ArrowRight className="size-3.5" aria-hidden />}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleLaunch} loading={isPending}>
              {isPending ? 'Setting up…' : 'Start monitoring'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-meta text-text-muted">{label}</span>
      <span className="max-w-[65%] truncate text-right text-ui-medium text-text">{value}</span>
    </div>
  )
}
