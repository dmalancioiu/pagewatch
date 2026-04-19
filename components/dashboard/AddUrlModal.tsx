'use client'

import { useState, useTransition } from 'react'
import { X, ArrowRight, Check, Clock, Eye, Archive, Globe } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import type { CheckFrequency, MonitoredUrlMode } from '@/lib/types/database.types'

interface AddUrlModalProps {
  workspaceId: string
  onClose:     () => void
  /** Called after URL is created — receives the new URL id so the first-screenshot flow can start */
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

function sensitivityLabel(pct: number): string {
  if (pct <= 2)  return 'Catches very subtle changes like text edits or small price updates'
  if (pct <= 5)  return 'Catches meaningful changes — a good default for most pages'
  if (pct <= 10) return 'Fires on noticeable content or layout changes'
  if (pct <= 19) return 'Only fires on significant visual changes'
  return 'Only fires on major page overhauls or full redesigns'
}

export function AddUrlModal({ workspaceId, onClose, onCreated }: AddUrlModalProps) {
  const [url,         setUrl]         = useState('')
  const [mode,        setMode]        = useState<MonitoredUrlMode>('watch')
  const [freq,        setFreq]        = useState<CheckFrequency>('daily')
  const [checkHour,   setCheckHour]   = useState<number>(9)
  const [description, setDescription] = useState('')
  const [threshold,   setThreshold]   = useState(5)
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
          threshold_pct:     isWatch ? threshold : 5,
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
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: '#0f0f0f',
          border:     '1px solid rgba(255,255,255,0.09)',
          boxShadow:  '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-base font-semibold text-white">Add a URL to watch</h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
              We'll screenshot it on schedule and alert you when it changes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[74vh] overflow-y-auto">

          {/* ── Step 1: URL + mode ── */}
          <div className="space-y-3">
            {/* URL input with favicon */}
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
                className="dash-input font-mono w-full"
                style={{ paddingLeft: favicon ? '2.25rem' : undefined }}
              />
            </div>
            {domain && (
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Monitoring <span style={{ color: '#00ff88' }}>{domain}</span>
              </p>
            )}

            {/* Watch / Archive toggle */}
            <div
              className="flex rounded-xl overflow-hidden p-1 gap-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
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
              <p className="text-xs px-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Screenshots will be saved on schedule but no diff or alert will be generated.
              </p>
            )}
          </div>

          {/* ── Step 2: Schedule ── */}
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
                    <p className="text-sm font-medium"
                       style={{ color: freq === s.id ? '#00ff88' : 'rgba(255,255,255,0.75)' }}>
                      {s.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {s.sub}
                    </p>
                  </div>
                  {freq === s.id && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: '#00ff88' }}>
                      <Check className="w-2.5 h-2.5" style={{ color: '#0a0a0a' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {showTimePicker && (
              <div
                className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.14)' }}
              >
                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(0,255,136,0.7)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(0,255,136,0.8)' }}>
                    Run at (UTC)
                  </p>
                  <select
                    value={checkHour}
                    onChange={(e) => setCheckHour(Number(e.target.value))}
                    className="w-full text-sm rounded-lg px-3 py-1.5 outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border:     '1px solid rgba(255,255,255,0.1)',
                      color:      'white',
                    }}
                  >
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={h}>{hourLabel(h)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ── Steps 3 & 4: Watch-mode only ── */}
          {isWatch && (
            <>
              {/* Step 3: What to watch */}
              <div>
                <SectionLabel optional>Optional: focus your alerts</SectionLabel>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Describe what you want to be alerted about. Leave blank to alert on any visual change.\n\nExamples: "Alert me if the pricing changes" · "Notify me if the hero headline is different"`}
                  className="w-full text-sm rounded-xl px-3.5 py-3 outline-none resize-none leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border:     '1px solid rgba(255,255,255,0.09)',
                    color:      'rgba(255,255,255,0.75)',
                  }}
                />
                <p className="text-[11px] mt-1.5 px-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Our AI will read your description and only alert you when something relevant changes.
                </p>
              </div>

              {/* Step 4: Sensitivity slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Sensitivity</SectionLabel>
                  <span
                    className="text-sm font-bold px-2.5 py-0.5 rounded-lg"
                    style={{ color: '#00ff88', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.18)' }}
                  >
                    ≥{threshold}%
                  </span>
                </div>
                <input
                  type="range"
                  className="neon-slider"
                  min={1} max={30} step={1}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.22)' }}>Low — subtle</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.22)' }}>High — major only</span>
                </div>
                <p className="text-xs mt-2 px-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {sensitivityLabel(threshold)}
                </p>
              </div>
            </>
          )}

          {/* Full-page toggle (always visible) */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div>
                <p className="text-sm font-medium text-white">{fullPage ? 'Full page' : 'Visible area only'}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  {fullPage ? 'Captures the entire scrollable page' : 'Captures only the viewport (above the fold)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={fullPage}
              onClick={() => setFullPage((v) => !v)}
              className="relative h-6 w-11 rounded-full transition-colors flex-shrink-0"
              style={{ background: fullPage ? '#00ff88' : 'rgba(255,255,255,0.12)' }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                style={{ left: fullPage ? '1.375rem' : '0.125rem' }}
              />
            </button>
          </div>

          {error && (
            <p className="text-xs px-3 py-2.5 rounded-xl"
               style={{ color: '#ff8080', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.18)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl transition-colors hover:text-white/70"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url.trim() || isPending}
            className="btn-neon flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
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

// ── Small helpers ──────────────────────────────────────────────────────────

function SectionLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5"
           style={{ color: 'rgba(255,255,255,0.38)' }}>
      {children}
      {optional && (
        <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '0.35rem' }}>
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
        background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
        color:      active ? '#00ff88' : 'rgba(255,255,255,0.4)',
        border:     active ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
