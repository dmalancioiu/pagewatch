'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createWorkspace } from '@/lib/actions/workspace'
import { addUrlsToMonitor, saveNotificationChannel, completeOnboardingStep } from '@/lib/actions/onboarding'
import type { CheckFrequency } from '@/lib/types/database.types'
import {
  ArrowRight, ArrowLeft, Check, Globe,
  Loader2, Monitor, Rocket, X,
} from 'lucide-react'

/* ─── Types ─── */

interface OnboardingProps {
  userEmail: string
  userName:  string
}

interface UrlRow {
  url:  string
  name: string
}

interface FormData {
  domain:         string
  siteName:       string
  urls:           UrlRow[]
  checkFrequency: CheckFrequency
  thresholdPct:   number
  emailEnabled:   boolean
}

/* ─── Steps ─── */

const STEPS = [
  { id: 'welcome',   label: 'Welcome'     },
  { id: 'urls',      label: 'Add URLs'    },
  { id: 'schedule',  label: 'Schedule'    },
  { id: 'threshold', label: 'Sensitivity' },
  { id: 'done',      label: 'All set'     },
]

/* ─── Helpers ─── */

function deriveName(raw: string): string {
  try {
    const full = raw.startsWith('http') ? raw : `https://${raw}`
    const { hostname, pathname } = new URL(full)
    const path = pathname.replace(/\/$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch {
    return raw
  }
}

function parseUrlLines(text: string): UrlRow[] {
  const seen = new Set<string>()
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((u) => { if (seen.has(u)) return false; seen.add(u); return true })
    .map((url) => ({ url, name: deriveName(url) }))
}

/* ─── Main ─── */

export function SetupCommand({ userEmail, userName }: OnboardingProps) {
  const router = useRouter()
  const [step, setStep]         = useState(0)
  const [error, setError]       = useState<string | null>(null)
  const [urlText, setUrlText]   = useState('')
  const [isPending, startTrans] = useTransition()

  const [form, setForm] = useState<FormData>({
    domain:         '',
    siteName:       '',
    urls:           [],
    checkFrequency: 'daily',
    thresholdPct:   5,
    emailEnabled:   true,
  })

  const update = (p: Partial<FormData>) => setForm((f) => ({ ...f, ...p }))

  /* URL textarea */
  function handleUrlText(text: string) {
    setUrlText(text)
    update({ urls: parseUrlLines(text) })
  }

  const canNext = () => {
    if (step === 0) return form.siteName.length > 0 || form.domain.length > 2
    if (step === 1) return form.urls.length > 0
    return true
  }

  /* Launch */
  function handleLaunch() {
    setError(null)
    startTrans(async () => {
      try {
        const domain = form.domain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace('www.', '') || 'workspace'
        const workspace = await createWorkspace(form.siteName || domain, domain)

        if (form.urls.length > 0) {
          await addUrlsToMonitor(
            workspace.id,
            form.urls.map((u) => ({
              url:             u.url.startsWith('http') ? u.url : `https://${u.url}`,
              name:            u.name,
              check_frequency: form.checkFrequency,
              threshold_pct:   form.thresholdPct,
            }))
          )
        }

        if (form.emailEnabled) {
          await saveNotificationChannel(workspace.id, userEmail, 'instant')
        }

        await completeOnboardingStep(workspace.id, 'review', {
          check_frequency: form.checkFrequency,
          threshold_pct:   form.thresholdPct,
        })

        router.push('/dashboard')
        router.refresh()
      } catch (err: any) {
        setError(err?.message ?? 'Something went wrong.')
      }
    })
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: '#060606' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 30%, rgba(0,255,136,0.04) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative w-full max-w-lg"
        style={{
          background: '#0d0d0d',
          border:     '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden rounded-t-[1.25rem]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00ff88, #00cc6a)',
              boxShadow:  '0 0 8px rgba(0,255,136,0.5)',
            }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-7 pt-8 pb-0"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.2)' }}
            >
              <Monitor className="w-3.5 h-3.5" style={{ color: '#00ff88' }} />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">PageWatch</span>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="transition-all duration-300"
                style={{
                  width:  i === step ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i < step ? '#00ff88' : i === step ? '#00ff88' : 'rgba(255,255,255,0.12)',
                  opacity:    i > step ? 0.5 : 1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-7 py-8" style={{ minHeight: '340px' }}>

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'rgba(0,255,136,0.7)' }}>
                Getting started
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                {userName ? `Welcome, ${userName.split(' ')[0]}.` : 'Welcome.'}
              </h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Set up your workspace in 2 minutes. We'll watch your pages and alert you the moment something changes.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                         style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Workspace name
                  </label>
                  <input
                    className="dash-input w-full"
                    placeholder="Acme Inc."
                    value={form.siteName}
                    onChange={(e) => update({ siteName: e.target.value })}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                         style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Primary domain <span className="normal-case font-normal text-white/25">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: 'rgba(255,255,255,0.25)' }}
                    />
                    <input
                      className="dash-input w-full"
                      placeholder="acme.com"
                      value={form.domain}
                      onChange={(e) => update({ domain: e.target.value })}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: URLs ── */}
          {step === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'rgba(0,255,136,0.7)' }}>
                Step 2 of 5
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Pages to watch
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Paste the full URLs you want to monitor, one per line.
              </p>
              <textarea
                className="dash-input w-full resize-none font-mono text-sm"
                rows={6}
                placeholder={`https://acme.com\nhttps://acme.com/pricing\nhttps://acme.com/features`}
                value={urlText}
                onChange={(e) => handleUrlText(e.target.value)}
                autoFocus
              />
              <p className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {form.urls.length > 0
                  ? `${form.urls.length} URL${form.urls.length !== 1 ? 's' : ''} detected`
                  : 'Duplicates are removed automatically'}
              </p>
            </div>
          )}

          {/* ── Step 2: Schedule ── */}
          {step === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'rgba(0,255,136,0.7)' }}>
                Step 3 of 5
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Check schedule
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                How often should we screenshot your pages?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'hourly' as CheckFrequency, label: 'Hourly',  desc: 'Every 60 min',   badge: 'Pro' },
                  { id: 'daily'  as CheckFrequency, label: 'Daily',   desc: 'Every 24 h',     badge: null  },
                  { id: 'weekly' as CheckFrequency, label: 'Weekly',  desc: 'Every 7 days',   badge: null  },
                ].map((f) => {
                  const active = form.checkFrequency === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update({ checkFrequency: f.id })}
                      className="text-left p-4 rounded-xl transition-all"
                      style={{
                        background: active ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.02)',
                        border:     active ? '1px solid rgba(0,255,136,0.25)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-sm font-semibold"
                           style={{ color: active ? '#00ff88' : 'rgba(255,255,255,0.7)' }}>
                          {f.label}
                        </p>
                        {f.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.18)' }}>
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{f.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Threshold ── */}
          {step === 3 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'rgba(0,255,136,0.7)' }}>
                Step 4 of 5
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Alert sensitivity
              </h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                How much pixel change triggers an alert?
              </p>

              <div className="space-y-3">
                {[
                  { value: 2,  label: 'Sensitive',  desc: 'Any small text or style tweak — alert on ≥ 2%' },
                  { value: 5,  label: 'Balanced',   desc: 'Meaningful changes only — alert on ≥ 5%' },
                  { value: 15, label: 'Tolerant',   desc: 'Major layout changes only — alert on ≥ 15%' },
                ].map((t) => {
                  const active = form.thresholdPct === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => update({ thresholdPct: t.value })}
                      className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-4"
                      style={{
                        background: active ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.02)',
                        border:     active ? '1px solid rgba(0,255,136,0.25)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          border:     active ? 'none' : '1px solid rgba(255,255,255,0.2)',
                          background: active ? '#00ff88' : 'transparent',
                        }}
                      >
                        {active && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold"
                           style={{ color: active ? '#00ff88' : 'rgba(255,255,255,0.7)' }}>
                          {t.label}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 4: Done ── */}
          {step === 4 && (
            <div className="text-center">
              {/* Animated check */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'rgba(0,255,136,0.08)',
                  border:     '1px solid rgba(0,255,136,0.2)',
                  boxShadow:  '0 0 32px rgba(0,255,136,0.12)',
                }}
              >
                <Check className="w-8 h-8" style={{ color: '#00ff88' }} />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                You're all set.
              </h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {form.siteName || 'Your workspace'} is ready.{' '}
                {form.urls.length > 0
                  ? `We'll start watching ${form.urls.length} page${form.urls.length !== 1 ? 's' : ''} right away.`
                  : 'Add your first URL from the dashboard.'}
              </p>

              {/* Summary */}
              <div
                className="text-left rounded-xl p-4 mb-6 space-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {[
                  { label: 'Workspace',  value: form.siteName || form.domain || 'My workspace'         },
                  { label: 'URLs',       value: form.urls.length > 0 ? `${form.urls.length} page${form.urls.length !== 1 ? 's' : ''}` : 'None yet' },
                  { label: 'Schedule',   value: { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly' }[form.checkFrequency] ?? form.checkFrequency },
                  { label: 'Threshold',  value: `≥ ${form.thresholdPct}% change`                      },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                    <span className="font-medium text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div
                  className="flex items-start gap-3 p-4 rounded-xl mb-4 text-left"
                  style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.18)' }}
                >
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-7 pb-7 pt-0"
        >
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg"
            style={{
              color:      step === 0 ? 'transparent' : 'rgba(255,255,255,0.35)',
              pointerEvents: step === 0 ? 'none' : undefined,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {/* Skip (step 1 only) */}
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Skip
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(0,255,136,0.1)',
                  color:      '#00ff88',
                  border:     '1px solid rgba(0,255,136,0.22)',
                  boxShadow:  '0 0 16px rgba(0,255,136,0.1)',
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                style={{
                  background: '#00ff88',
                  color:      '#000',
                  boxShadow:  '0 0 24px rgba(0,255,136,0.3)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Setting up…
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Go to dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
