'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createWorkspace } from '@/lib/actions/workspace'
import { addUrlsToMonitor, saveNotificationChannel, completeOnboardingStep } from '@/lib/actions/onboarding'
import type { CheckFrequency } from '@/lib/types/database.types'

interface OnboardingWizardProps {
  userEmail: string
  userName: string
}

interface UrlRow {
  url:  string
  name: string
}

interface FormData {
  domain:           string
  siteName:         string
  siteType:         string
  niche:            string
  urls:             UrlRow[]
  checkFrequency:   CheckFrequency
  thresholdPct:     number
  emailEnabled:     boolean
  emailFrequency:   string
}

const STEPS = [
  {
    key:         'domain',
    label:       'Domain',
    title:       'Name your workspace',
    description: 'This is how your workspace is labelled in the dashboard. It does not have to match a domain exactly.',
  },
  {
    key:         'business_context',
    label:       'Context',
    title:       'Give us a bit of context',
    description: 'Optional — helps keep the dashboard copy relevant to your situation.',
  },
  {
    key:         'urls',
    label:       'URLs',
    title:       'Which pages do you want to watch?',
    description: 'Paste full URLs, one per line. We\'ll take screenshots on your chosen schedule and alert you when something changes.',
  },
  {
    key:         'monitoring_prefs',
    label:       'Monitoring',
    title:       'How closely should we watch?',
    description: 'Set how often we check each page and how much change triggers an alert.',
  },
  {
    key:         'alert_preferences',
    label:       'Alerts',
    title:       'How do you want to be notified?',
    description: 'Set your notification cadence. You can change this any time from Settings.',
  },
  {
    key:         'review',
    label:       'Review',
    title:       'Review and start monitoring',
    description: 'Quick check, then we create the workspace and begin watching.',
  },
] as const

const SITE_TYPE_OPTIONS = [
  { value: 'blog',      label: 'Blog / Content site' },
  { value: 'saas',      label: 'SaaS / Software' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'local',     label: 'Local business' },
  { value: 'agency',    label: 'Agency' },
  { value: 'other',     label: 'Other' },
]

const FREQUENCY_OPTIONS: { value: CheckFrequency; label: string; description: string }[] = [
  { value: 'hourly', label: 'Hourly',  description: 'Check every hour. Best for high-traffic pages or frequent deployments.' },
  { value: 'daily',  label: 'Daily',   description: 'Check once a day. Good default for most pages.' },
  { value: 'weekly', label: 'Weekly',  description: 'Check once a week. Good for stable marketing or docs pages.' },
]

const THRESHOLD_OPTIONS = [
  { value: 2,  label: 'Sensitive',  description: 'Alert on small changes — 2% of pixels or more.' },
  { value: 5,  label: 'Balanced',   description: 'Alert on meaningful changes — 5% of pixels or more.' },
  { value: 15, label: 'Tolerant',   description: 'Alert only on large changes — 15% of pixels or more.' },
]

const NOTIFICATION_OPTIONS = [
  { value: 'weekly',  label: 'Weekly digest',   description: 'One summary email each week.' },
  { value: 'daily',   label: 'Daily digest',    description: 'A daily summary when something changed.' },
  { value: 'instant', label: 'Instant alerts',  description: 'Email as soon as a change is detected.' },
]

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

function deriveName(url: string): string {
  try {
    const { hostname, pathname } = new URL(url.startsWith('http') ? url : `https://${url}`)
    const path = pathname.replace(/\/$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch {
    return url
  }
}

function parseUrls(text: string): UrlRow[] {
  const seen = new Set<string>()
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((url) => {
      if (seen.has(url)) return false
      seen.add(url)
      return true
    })
    .map((url) => ({ url, name: deriveName(url) }))
}

function ModalStepPill({
  index, active, completed, label, onClick,
}: {
  index: number; active: boolean; completed: boolean; label: string; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : completed
          ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
          : 'border-slate-200 bg-white text-slate-400'
      }`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
        active ? 'bg-white text-slate-900' : completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
      }`}>
        {completed ? '✓' : index + 1}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1.5 text-sm font-semibold capitalize text-slate-900">{value}</div>
    </div>
  )
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[30px] font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

function ChoiceCard({
  title, description, selected, onClick,
}: {
  title: string; description: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className={`mt-1.5 text-sm leading-6 ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
            {description}
          </div>
        </div>
        <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border ${
          selected ? 'border-white bg-white' : 'border-slate-300 bg-white'
        }`}>
          {selected && <div className="m-1 h-3 w-3 rounded-full bg-slate-900" />}
        </div>
      </div>
    </button>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="max-w-[60%] text-right text-sm font-semibold capitalize text-slate-900">{value}</div>
    </div>
  )
}

export function OnboardingWizard({ userEmail, userName }: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [urlText, setUrlText] = useState('')

  const [form, setForm] = useState<FormData>({
    domain:         '',
    siteName:       '',
    siteType:       'saas',
    niche:          '',
    urls:           [],
    checkFrequency: 'daily',
    thresholdPct:   5,
    emailEnabled:   true,
    emailFrequency: 'daily',
  })

  const currentStep = STEPS[step]
  const progress    = ((step + 1) / STEPS.length) * 100

  function updateForm(updates: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  function handleUrlTextChange(text: string) {
    setUrlText(text)
    const parsed = parseUrls(text)
    // preserve any custom names the user may have already typed
    const existingNames = new Map(form.urls.map((u) => [u.url, u.name]))
    updateForm({
      urls: parsed.map((row) => ({
        url:  row.url,
        name: existingNames.get(row.url) ?? row.name,
      })),
    })
  }

  function updateUrlName(index: number, name: string) {
    const updated = [...form.urls]
    updated[index] = { ...updated[index], name }
    updateForm({ urls: updated })
  }

  async function handleLaunch() {
    setLoading(true)
    setError(null)

    try {
      const normalizedDomain = normalizeDomain(form.domain) || 'workspace'
      const workspace = await createWorkspace(form.siteName || normalizedDomain, normalizedDomain)
      const wsId = workspace.id

      if (form.urls.length > 0) {
        await addUrlsToMonitor(
          wsId,
          form.urls.map((u) => ({
            url:             u.url.startsWith('http') ? u.url : `https://${u.url}`,
            name:            u.name,
            check_frequency: form.checkFrequency,
            threshold_pct:   form.thresholdPct,
          }))
        )
      }

      if (form.emailEnabled) {
        await saveNotificationChannel(wsId, userEmail, form.emailFrequency)
      }

      await completeOnboardingStep(wsId, 'review', {
        site_type:       form.siteType,
        niche:           form.niche,
        check_frequency: form.checkFrequency,
        threshold_pct:   form.thresholdPct,
      })

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong while setting up your workspace.')
    } finally {
      setLoading(false)
    }
  }

  function canProceed() {
    if (step === 0) return normalizeDomain(form.domain).length > 2 || form.siteName.length > 1
    if (step === 2) return form.urls.length > 0
    return true
  }

  function nextStep() {
    if (!canProceed()) return
    if (step < STEPS.length - 1) setStep((prev) => prev + 1)
  }

  function prevStep() {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const thresholdLabel = THRESHOLD_OPTIONS.find((t) => t.value === form.thresholdPct)?.label ?? 'Balanced'
  const frequencyLabel = FREQUENCY_OPTIONS.find((f) => f.value === form.checkFrequency)?.label ?? 'Daily'

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/28 backdrop-blur-[3px]">
      <div className="flex min-h-screen items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-[1080px] overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.20)]">

          {/* Header */}
          <div className="border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">PageWatch</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">
                    Welcome{userName ? `, ${userName}` : ''}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Set up your workspace while the dashboard waits behind this panel.
                  </div>
                </div>
                <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
                  {step + 1} of {STEPS.length}
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {STEPS.map((item, index) => (
                  <ModalStepPill
                    key={item.key}
                    index={index}
                    active={index === step}
                    completed={index < step}
                    label={item.label}
                    onClick={() => { if (index < step) setStep(index) }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid min-h-[650px] gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-8">

              {/* ── Step 0: Domain / Workspace name ── */}
              {step === 0 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Site or company name</label>
                      <input
                        type="text"
                        placeholder="Acme"
                        value={form.siteName}
                        onChange={(e) => updateForm({ siteName: e.target.value })}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Primary domain <span className="text-slate-400 font-normal">(used as workspace label)</span></label>
                      <input
                        type="text"
                        placeholder="acme.com"
                        value={form.domain}
                        onChange={(e) => updateForm({ domain: normalizeDomain(e.target.value) })}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
                      />
                      <p className="mt-2 text-xs text-slate-500">No protocol, no www. Used as a label only — you monitor individual URLs in step 3.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Business context ── */}
              {step === 1 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-slate-700">Site type</label>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {SITE_TYPE_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.value}
                            selected={form.siteType === option.value}
                            title={option.label}
                            description="Used to set sensible defaults."
                            onClick={() => updateForm({ siteType: option.value })}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Describe your product or use case <span className="text-slate-400 font-normal">(optional)</span></label>
                      <textarea
                        rows={3}
                        placeholder="E.g. SaaS pricing page for a B2B analytics tool"
                        value={form.niche}
                        onChange={(e) => updateForm({ niche: e.target.value })}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: URLs ── */}
              {step === 2 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">URLs to monitor</label>
                    <textarea
                      rows={10}
                      placeholder={`https://acme.com\nhttps://acme.com/pricing\nhttps://acme.com/features`}
                      value={urlText}
                      onChange={(e) => handleUrlTextChange(e.target.value)}
                      className="w-full rounded-[24px] border border-slate-300 px-4 py-4 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{form.urls.length} URL{form.urls.length !== 1 ? 's' : ''} detected</span>
                      <span>Duplicates removed automatically</span>
                    </div>

                    {form.urls.length > 0 && (
                      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
                        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          <div>URL</div>
                          <div>Display name</div>
                        </div>
                        <div className="max-h-[320px] overflow-auto">
                          {form.urls.map((row, i) => (
                            <div
                              key={`${row.url}-${i}`}
                              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                            >
                              <div className="truncate text-xs font-mono text-slate-500">{row.url}</div>
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => updateUrlName(i, e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 3: Monitoring preferences ── */}
              {step === 3 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div className="space-y-8">
                    <div>
                      <div className="mb-3 text-sm font-medium text-slate-700">Check frequency</div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {FREQUENCY_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.value}
                            title={option.label}
                            description={option.description}
                            selected={form.checkFrequency === option.value}
                            onClick={() => updateForm({ checkFrequency: option.value })}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-3 text-sm font-medium text-slate-700">Change sensitivity</div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {THRESHOLD_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.value}
                            title={option.label}
                            description={option.description}
                            selected={form.thresholdPct === option.value}
                            onClick={() => updateForm({ thresholdPct: option.value })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Alert preferences ── */}
              {step === 4 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div className="space-y-8">
                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Email notifications</div>
                          <div className="mt-1 text-sm leading-6 text-slate-500">
                            Alerts go to {userEmail || 'your email address'}.
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-pressed={form.emailEnabled}
                          onClick={() => updateForm({ emailEnabled: !form.emailEnabled })}
                          className={`relative h-7 w-12 rounded-full transition ${form.emailEnabled ? 'bg-slate-900' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${form.emailEnabled ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 text-sm font-medium text-slate-700">Email frequency</div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {NOTIFICATION_OPTIONS.map((option) => (
                          <ChoiceCard
                            key={option.value}
                            title={option.label}
                            description={option.description}
                            selected={form.emailFrequency === option.value}
                            onClick={() => updateForm({ emailFrequency: option.value })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: Review ── */}
              {step === 5 && (
                <div>
                  <SectionIntro title={currentStep.title} description={currentStep.description} />
                  <div className="space-y-3">
                    <ReviewRow label="Workspace"          value={form.siteName || normalizeDomain(form.domain) || 'Not set'} />
                    <ReviewRow label="Domain"             value={normalizeDomain(form.domain) || 'Not set'} />
                    <ReviewRow label="Site type"          value={SITE_TYPE_OPTIONS.find((o) => o.value === form.siteType)?.label || form.siteType} />
                    <ReviewRow label="URLs to monitor"    value={`${form.urls.length} page${form.urls.length !== 1 ? 's' : ''}`} />
                    <ReviewRow label="Check frequency"    value={frequencyLabel} />
                    <ReviewRow label="Change sensitivity" value={thresholdLabel} />
                    <ReviewRow label="Email alerts"       value={form.emailEnabled ? form.emailFrequency : 'Disabled'} />
                  </div>

                  {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar summary */}
            <aside className="border-t border-slate-100 bg-slate-50/70 px-5 py-6 sm:px-7 lg:border-l lg:border-t-0 lg:px-6">
              <div className="sticky top-0 space-y-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Live setup</div>
                  <div className="mt-2 text-sm leading-6 text-slate-500">
                    Updates as you fill things in.
                  </div>
                </div>

                <StatCard label="Workspace"    value={form.siteName || normalizeDomain(form.domain) || 'Not set'} />
                <StatCard label="Domain"       value={normalizeDomain(form.domain) || 'Not set'} />
                <StatCard label="URLs"         value={`${form.urls.length}`} />
                <StatCard label="Frequency"    value={frequencyLabel} />
                <StatCard label="Sensitivity"  value={thresholdLabel} />
                <StatCard label="Alerts"       value={form.emailEnabled ? form.emailFrequency : 'off'} />

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Notifications</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{userEmail}</div>
                  <div className="mt-1 text-sm text-slate-500">{form.emailEnabled ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            </aside>
          </div>

          {/* Footer nav */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0 || loading}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {step === 2 && (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Skip for now
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed() || loading}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunch}
                  disabled={loading}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? 'Creating workspace…' : 'Start monitoring'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
