'use client'

import { useState, useTransition } from 'react'
import { X, ArrowRight, Check, Clock, Eye, Archive, Globe } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import type { CheckFrequency, MonitoredUrlMode } from '@/lib/types/database.types'

interface AddUrlModalProps {
  workspaceId: string
  onClose:     () => void
  onCreated?:  (urlId: string) => void
}

function deriveName(raw: string): string {
  try {
    const full = raw.startsWith('http') ? raw : `https://${raw}`
    const { hostname, pathname } = new URL(full)
    const path = pathname.replace(/\/$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch { return raw }
}

function getDomain(raw: string): string {
  try {
    const full = raw.startsWith('http') ? raw : `https://${raw}`
    return new URL(full).hostname
  } catch { return '' }
}

function faviconUrl(raw: string): string {
  const domain = getDomain(raw)
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`
}

const SCHEDULES: { id: CheckFrequency; label: string; sub: string }[] = [
  { id: 'hourly', label: 'Hourly',  sub: 'Every 60 min — for critical pages like checkout' },
  { id: 'daily',  label: 'Daily',   sub: 'Once a day — good default for most pages'        },
  { id: 'weekly', label: 'Weekly',  sub: 'Once a week — for stable or low-traffic pages'   },
]

function hourLabel(h: number): string {
  if (h === 0)  return '12:00 AM (midnight)'
  if (h === 12) return '12:00 PM (noon)'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

export function AddUrlModal({ workspaceId, onClose, onCreated }: AddUrlModalProps) {
  const [url,         setUrl]         = useState('')
  const [mode,        setMode]        = useState<MonitoredUrlMode>('watch')
  const [freq,        setFreq]        = useState<CheckFrequency>('daily')
  const [checkHour,   setCheckHour]   = useState<number>(9)
  const [description, setDescription] = useState('')
  const [fullPage,    setFullPage]    = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [isPending,   start]          = useTransition()

  const domain      = getDomain(url)
  const favicon     = url.trim() ? faviconUrl(url) : ''
  const derivedName = url ? deriveName(url) : ''
  const isWatch     = mode === 'watch'
  const showTimePicker = freq === 'daily' || freq === 'weekly'

  function handleSubmit() {
    if (!url.trim()) return
    setError(null)
    start(async () => {
      try {
        const results = await addMonitoredUrls(workspaceId, [{
          url,
          name:              derivedName,
          check_frequency:   freq,
          check_hour:        showTimePicker ? checkHour : null,
          threshold_pct:     5,
          watch_description: isWatch && description.trim() ? description.trim() : null,
          full_page:         fullPage,
          mode,
        }])
        const newId = results[0]?.id
        if (newId && onCreated) {
          onCreated(newId)
        } else {
          onClose()
        }
      } catch (err: any) {
        setError(err?.message ?? 'Failed to add URL')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: '#FFFFFF',
          border:     '1px solid #E5E7EB',
          boxShadow:  '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #F3F4F6' }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#111827' }}>Add a monitor</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              We'll screenshot this page on a schedule and alert you when it changes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[74vh] overflow-y-auto">

          {/* Step 1: URL + mode */}
          <div className="space-y-3">
            {/* URL input */}
            <div className="relative">
              {favicon && (
                <img
                  src={favicon}
                  alt=""
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="https://acme.com/pricing"
                autoFocus
                className="dash-input font-mono"
                style={{ paddingLeft: favicon ? '2.25rem' : undefined }}
              />
            </div>
            {domain && (
              <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                Monitoring <span style={{ color: '#15803D' }}>{domain}</span>
              </p>
            )}

            {/* Watch / Archive toggle */}
            <div
              className="flex rounded-xl overflow-hidden p-1 gap-1"
              style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}
            >
              <ModeButton
                active={mode === 'watch'}
                icon={<Eye className="w-3.5 h-3.5" />}
                label="Watch for changes"
                onClick={() => setMode('watch')}
              />
              <ModeButton
                active={mode === 'archive'}
                icon={<Archive className="w-3.5 h-3.5" />}
                label="Archive only"
                onClick={() => setMode('archive')}
              />
            </div>
            {mode === 'archive' && (
              <p className="text-xs px-1" style={{ color: '#9CA3AF' }}>
                Screenshots will be saved on schedule but no diff or alert will be generated.
              </p>
            )}
          </div>

          {/* Step 2: Schedule */}
          <div>
            <SectionLabel>Schedule</SectionLabel>
            <div className="space-y-2">
              {SCHEDULES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFreq(s.id)}
                  className={`schedule-card w-full text-left flex items-center justify-between${freq === s.id ? ' selected' : ''}`}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: freq === s.id ? '#15803D' : '#374151' }}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                      {s.sub}
                    </p>
                  </div>
                  {freq === s.id && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#16A34A' }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: '#FFFFFF' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {showTimePicker && (
              <div
                className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.18)' }}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#15803D' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#15803D' }}>
                    Run at (UTC)
                  </p>
                  <select
                    value={checkHour}
                    onChange={(e) => setCheckHour(Number(e.target.value))}
                    className="w-full text-sm rounded-lg px-3 py-1.5 outline-none"
                    style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827' }}
                  >
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={h}>{hourLabel(h)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Alert focus (watch mode only) */}
          {isWatch && (
            <div>
              <SectionLabel optional>What matters on this page?</SectionLabel>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Describe what you want to be alerted about. Leave blank to alert on any visual change.\n\nExamples: "Alert me if the pricing changes" · "Notify me if the hero headline is different"`}
                className="dash-input resize-none leading-relaxed"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-[11px] mt-1.5 px-0.5" style={{ color: '#9CA3AF' }}>
                Our AI will use your description to filter out irrelevant changes and only alert you when it matters.
              </p>
            </div>
          )}

          {/* Full-page toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>
                  {fullPage ? 'Full page' : 'Visible area only'}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
                  {fullPage ? 'Captures the entire scrollable page' : 'Captures only the viewport (above the fold)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={fullPage}
              onClick={() => setFullPage((v) => !v)}
              className="relative h-5 w-9 rounded-full transition-colors flex-shrink-0"
              style={{ background: fullPage ? '#16A34A' : '#D1D5DB' }}
            >
              <span
                className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow-sm"
                style={{ left: fullPage ? '1.125rem' : '0.125rem' }}
              />
            </button>
          </div>

          {error && (
            <p
              className="text-xs px-3 py-2.5 rounded-xl"
              style={{ color: '#B91C1C', background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.18)' }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid #F3F4F6' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url.trim() || isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#16A34A', color: '#FFFFFF' }}
            onMouseEnter={(e) => { if (!isPending && url.trim()) e.currentTarget.style.background = '#15803D' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#16A34A' }}
          >
            {isPending ? 'Adding…' : (
              <>{mode === 'archive' ? 'Start archiving' : 'Start watching'} <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Small helpers ─── */

function SectionLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5"
           style={{ color: '#9CA3AF' }}>
      {children}
      {optional && (
        <span style={{ color: '#D1D5DB', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '0.35rem' }}>
          (optional)
        </span>
      )}
    </label>
  )
}

function ModeButton({
  active, icon, label, onClick,
}: {
  active: boolean; icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? '#FFFFFF' : 'transparent',
        color:      active ? '#15803D' : '#6B7280',
        border:     active ? '1px solid rgba(22,163,74,0.25)' : '1px solid transparent',
        boxShadow:  active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
