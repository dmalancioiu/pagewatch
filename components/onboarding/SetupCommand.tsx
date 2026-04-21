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
  emailEnabled:   boolean
}

/* ─── Steps (threshold removed — always use default of 5%) ─── */

const STEPS = [
  { id: 'welcome',  label: 'Welcome'  },
  { id: 'urls',     label: 'Add URLs' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'done',     label: 'All set'  },
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
    emailEnabled:   true,
  })

  const update = (p: Partial<FormData>) => setForm((f) => ({ ...f, ...p }))

  function handleUrlText(text: string) {
    setUrlText(text)
    update({ urls: parseUrlLines(text) })
  }

  const canNext = () => {
    if (step === 0) return form.siteName.length > 0 || form.domain.length > 2
    if (step === 1) return form.urls.length > 0
    return true
  }

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
              threshold_pct:   5,
            }))
          )
        }

        if (form.emailEnabled) {
          await saveNotificationChannel(workspace.id, userEmail, 'instant')
        }

        await completeOnboardingStep(workspace.id, 'review', {
          check_frequency: form.checkFrequency,
          threshold_pct:   5,
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
      style={{ background: '#F6F7F9' }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background:   '#FFFFFF',
          border:       '1px solid #E5E7EB',
          boxShadow:    '0 8px 40px rgba(0,0,0,0.08)',
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: '#16A34A' }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-8 pb-0">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: '#16A34A' }}
            >
              <Monitor className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} />
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: '#111827' }}>PageWatch</span>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="transition-all duration-300"
                style={{
                  width:        i === step ? '20px' : '6px',
                  height:       '6px',
                  borderRadius: '3px',
                  background:   i <= step ? '#16A34A' : '#E5E7EB',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-7 py-8" style={{ minHeight: '340px' }}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
                Getting started
              </p>
              <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#111827' }}>
                {userName ? `Welcome, ${userName.split(' ')[0]}.` : 'Welcome.'}
              </h2>
              <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
                Set up your workspace in 2 minutes. We'll watch your pages and alert you the moment something changes.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                         style={{ color: '#9CA3AF' }}>
                    Workspace name
                  </label>
                  <input
                    className="dash-input"
                    placeholder="Acme Inc."
                    value={form.siteName}
                    onChange={(e) => update({ siteName: e.target.value })}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                         style={{ color: '#9CA3AF' }}>
                    Primary domain{' '}
                    <span style={{ color: '#D1D5DB', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: '#D1D5DB' }}
                    />
                    <input
                      className="dash-input"
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

          {/* Step 1: URLs */}
          {step === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
                Step 2 of {STEPS.length}
              </p>
              <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#111827' }}>
                Pages to watch
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Paste the full URLs you want to monitor, one per line.
              </p>
              <textarea
                className="dash-input font-mono resize-none text-sm"
                rows={6}
                placeholder={`https://acme.com\nhttps://acme.com/pricing\nhttps://acme.com/features`}
                value={urlText}
                onChange={(e) => handleUrlText(e.target.value)}
                autoFocus
              />
              <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                {form.urls.length > 0
                  ? `${form.urls.length} URL${form.urls.length !== 1 ? 's' : ''} detected`
                  : 'Duplicates are removed automatically'}
              </p>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
                Step 3 of {STEPS.length}
              </p>
              <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#111827' }}>
                Check schedule
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                How often should we screenshot your pages?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'hourly' as CheckFrequency, label: 'Hourly',  desc: 'Every 60 min'  },
                  { id: 'daily'  as CheckFrequency, label: 'Daily',   desc: 'Every 24 h'    },
                  { id: 'weekly' as CheckFrequency, label: 'Weekly',  desc: 'Every 7 days'  },
                ].map((f) => {
                  const active = form.checkFrequency === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update({ checkFrequency: f.id })}
                      className="text-left p-4 rounded-xl transition-all"
                      style={{
                        background: active ? 'rgba(22,163,74,0.06)' : '#F9FAFB',
                        border:     active ? '1px solid rgba(22,163,74,0.3)' : '1px solid #E5E7EB',
                      }}
                    >
                      <p className="text-sm font-semibold mb-0.5"
                         style={{ color: active ? '#15803D' : '#374151' }}>
                        {f.label}
                      </p>
                      <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{f.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}
              >
                <Check className="w-7 h-7" style={{ color: '#16A34A' }} />
              </div>

              <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#111827' }}>
                You're all set.
              </h2>
              <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
                {form.siteName || 'Your workspace'} is ready.{' '}
                {form.urls.length > 0
                  ? `We'll start watching ${form.urls.length} page${form.urls.length !== 1 ? 's' : ''} right away.`
                  : 'Add your first monitor from the dashboard.'}
              </p>

              {/* Summary */}
              <div
                className="text-left rounded-xl p-4 mb-6 space-y-2"
                style={{ background: '#F8FAFC', border: '1px solid #F3F4F6' }}
              >
                {[
                  { label: 'Workspace', value: form.siteName || form.domain || 'My workspace' },
                  { label: 'Monitors',  value: form.urls.length > 0 ? `${form.urls.length} page${form.urls.length !== 1 ? 's' : ''}` : 'None yet' },
                  { label: 'Schedule',  value: { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly' }[form.checkFrequency] ?? form.checkFrequency },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span style={{ color: '#9CA3AF' }}>{row.label}</span>
                    <span className="font-medium" style={{ color: '#111827' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div
                  className="flex items-start gap-3 p-4 rounded-xl mb-4 text-left"
                  style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.18)' }}
                >
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                  <p className="text-sm" style={{ color: '#B91C1C' }}>{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-7 pb-7 pt-0"
          style={{ borderTop: step > 0 ? '1px solid #F3F4F6' : 'none', paddingTop: step > 0 ? '1.25rem' : undefined }}
        >
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 rounded-lg"
            style={{
              color:         step === 0 ? 'transparent' : '#6B7280',
              pointerEvents: step === 0 ? 'none' : undefined,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="text-sm font-medium px-4 py-2 transition-colors"
                style={{ color: '#9CA3AF' }}
              >
                Skip
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#16A34A', color: '#FFFFFF' }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-60"
                style={{ background: '#16A34A', color: '#FFFFFF' }}
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Setting up…</>
                ) : (
                  <><Rocket className="w-4 h-4" /> Go to dashboard</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
