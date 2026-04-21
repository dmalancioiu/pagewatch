'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  Clock,
  Crosshair,
  Globe,
  Loader2,
  Pause,
  Play,
  Play as RunIcon,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { deleteMonitoredUrl, pauseMonitoredUrl, updateMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import { ZoneSelector } from '@/components/dashboard/ZoneSelector'
import type { CheckFrequency, Zone } from '@/lib/types/database.types'

const FREQ_OPTIONS: { id: CheckFrequency; label: string; desc: string }[] = [
  { id: 'hourly', label: 'Hourly', desc: 'Every 60 min' },
  { id: 'daily', label: 'Daily', desc: 'Every 24 h' },
  { id: 'weekly', label: 'Weekly', desc: 'Every 7 d' },
]

function hourLabel(h: number): string {
  if (h === 0) return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

type RunState = 'idle' | 'confirming' | 'running' | 'done' | 'error'

interface Props {
  url: any
  latestSnapshotUrl: string | null
}

export function UrlDetailSettings({ url, latestSnapshotUrl }: Props) {
  const router = useRouter()

  const [freq, setFreq] = useState<CheckFrequency>(url.check_frequency)
  const [checkHour, setCheckHour] = useState<number>(url.check_hour ?? 9)
  const [description, setDescription] = useState<string>(url.watch_description ?? '')
  const [fullPage, setFullPage] = useState<boolean>(url.full_page !== false)
  const [zones, setZones] = useState<Zone[]>(() => {
    if (!url.zones) return []
    if (Array.isArray(url.zones)) return url.zones as Zone[]
    return []
  })
  const [paused, setPaused] = useState(!url.is_active)
  const [saved, setSaved] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [runState, setRunState] = useState<RunState>('idle')
  const [runError, setRunError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [isSaving, startSave] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [isPausing, startPause] = useTransition()

  const showTimePicker = freq === 'daily' || freq === 'weekly'
  const isArchive = url.mode === 'archive'

  function handleSave() {
    startSave(async () => {
      await updateMonitoredUrl(url.id, {
        check_frequency: freq,
        check_hour: showTimePicker ? checkHour : null,
        watch_description: description.trim() || null,
        full_page: fullPage,
        zones: zones.length > 0 ? zones : null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    })
  }

  function handlePause() {
    startPause(async () => {
      const newPaused = !paused
      await pauseMonitoredUrl(url.id, newPaused)
      setPaused(newPaused)
      router.refresh()
    })
  }

  async function handleRunNow() {
    if (runState === 'confirming') {
      setRunState('running')
      setRunError(null)
      try {
        await triggerManualRun(url.id)
        setRunState('done')
        setTimeout(() => {
          setRunState('idle')
          router.refresh()
        }, 3000)
      } catch (err: any) {
        setRunError(err?.message ?? 'Failed to trigger run')
        setRunState('error')
        setTimeout(() => setRunState('idle'), 4000)
      }
    } else {
      setRunState('confirming')
    }
  }

  function handleDelete() {
    if (deleteConfirm.trim().toLowerCase() !== url.name.trim().toLowerCase()) return
    startDelete(async () => {
      await deleteMonitoredUrl(url.id)
      router.push('/dashboard/urls')
    })
  }

  return (
    <section className="dash-card overflow-hidden">
      <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: '#F3F4F6', background: '#FCFCFD' }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" style={{ color: '#9CA3AF' }} />
              <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: '#9CA3AF' }}>Controls</p>
            </div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight" style={{ color: '#111827' }}>Manage this monitor</h2>
            <p className="mt-1 text-sm leading-6" style={{ color: '#6B7280' }}>
              Trigger checks, tune monitoring rules, and manage lifecycle actions without leaving the detail page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
            style={{ background: settingsOpen ? '#111827' : '#FFFFFF', color: settingsOpen ? '#FFFFFF' : '#374151', border: settingsOpen ? '1px solid #111827' : '1px solid #E5E7EB' }}
          >
            <Settings2 className="h-4 w-4" />
            {settingsOpen ? 'Hide settings' : 'Edit settings'}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-3">
          <button
            type="button"
            onClick={handleRunNow}
            disabled={runState === 'running' || runState === 'done' || paused}
            className="rounded-2xl p-4 text-left transition-colors disabled:opacity-50"
            style={{ background: '#FFFFFF', border: runState === 'confirming' ? '1px solid #16A34A' : '1px solid #E5E7EB' }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: runState === 'confirming' ? 'rgba(22,163,74,0.1)' : '#F9FAFB', color: runState === 'confirming' ? '#15803D' : '#6B7280', border: '1px solid #E5E7EB' }}>
                {runState === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RunIcon className="h-4 w-4" />}
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>
                {runState === 'confirming' ? 'Confirm' : 'Action'}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: '#111827' }}>
              {runState === 'running' ? 'Queueing manual run…' : runState === 'done' ? 'Manual run queued' : runState === 'confirming' ? 'Click again to confirm' : 'Run a check now'}
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: runState === 'error' ? '#B91C1C' : '#6B7280' }}>
              {runState === 'error'
                ? runError
                : paused
                ? 'Resume the monitor first to trigger a manual check.'
                : 'Useful after a deploy or content update.'}
            </p>
          </button>

          <button
            type="button"
            onClick={handlePause}
            disabled={isPausing}
            className="rounded-2xl p-4 text-left transition-colors disabled:opacity-50"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                {isPausing ? <Loader2 className="h-4 w-4 animate-spin" /> : paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>Status</span>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: '#111827' }}>{paused ? 'Resume monitoring' : 'Pause monitoring'}</p>
            <p className="mt-1 text-xs leading-5" style={{ color: '#6B7280' }}>
              {paused ? 'Re-enable scheduled checks and future alerts.' : 'Stop future checks without deleting history.'}
            </p>
          </button>

          <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>State</span>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: '#111827' }}>{saved ? 'Changes saved' : settingsOpen ? 'Editing enabled' : 'Ready to edit'}</p>
            <p className="mt-1 text-xs leading-5" style={{ color: '#6B7280' }}>
              {saved ? 'Settings were persisted successfully.' : 'Open the editor below to change schedule, zones, and capture rules.'}
            </p>
          </div>
        </div>

        {settingsOpen && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                    <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Check frequency</h3>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                    Pick how often PageWatch captures a new screenshot for this monitor.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {FREQ_OPTIONS.map((f) => {
                      const active = freq === f.id
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFreq(f.id)}
                          className="rounded-2xl p-4 text-left transition-colors"
                          style={{
                            background: active ? 'rgba(22,163,74,0.06)' : '#FCFCFD',
                            border: active ? '1px solid rgba(22,163,74,0.26)' : '1px solid #E5E7EB',
                          }}
                        >
                          <p className="text-sm font-semibold" style={{ color: active ? '#15803D' : '#111827' }}>{f.label}</p>
                          <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>{f.desc}</p>
                        </button>
                      )
                    })}
                  </div>

                  {showTimePicker && (
                    <div className="mt-4 rounded-2xl p-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                      <label className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>Run at, UTC</label>
                      <select
                        value={checkHour}
                        onChange={(e) => setCheckHour(Number(e.target.value))}
                        className="mt-3 w-full rounded-xl px-3 py-2 text-sm outline-none"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827' }}
                      >
                        {Array.from({ length: 24 }, (_, h) => (
                          <option key={h} value={h}>{hourLabel(h)}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {!isArchive && (
                  <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crosshair className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                          <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Focus zones</h3>
                        </div>
                        <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                          Restrict comparisons to the areas that matter most on the page.
                        </p>
                      </div>
                      {zones.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setZones([])}
                          className="rounded-xl px-3 py-2 text-xs font-medium"
                          style={{ background: 'rgba(185,28,28,0.05)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.16)' }}
                        >
                          Clear zones
                        </button>
                      )}
                    </div>

                    <div className="mt-4">
                      {latestSnapshotUrl ? (
                        <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid #E5E7EB' }}>
                          <ZoneSelector imageUrl={latestSnapshotUrl} zones={zones} onChange={setZones} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl py-12 text-center" style={{ background: '#F9FAFB', border: '1px dashed #E5E7EB' }}>
                          <Crosshair className="h-5 w-5" style={{ color: '#D1D5DB' }} />
                          <p className="mt-2 text-xs" style={{ color: '#9CA3AF' }}>
                            No screenshot yet. Run a check first, then define focus zones here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {!isArchive && (
                  <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                      <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Alert focus</h3>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                      Guide AI toward the kinds of visual changes you actually care about.
                    </p>
                    <textarea
                      rows={7}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={'Examples: "Alert if pricing changes" or "Watch the hero section for new offers"'}
                      className="dash-input mt-4 resize-none leading-relaxed"
                      style={{ borderRadius: '16px' }}
                    />
                  </div>
                )}

                <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                    <h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Capture depth</h3>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                    Decide whether checks should capture the entire page or just the visible viewport.
                  </p>

                  <button
                    type="button"
                    aria-pressed={fullPage}
                    onClick={() => setFullPage((v) => !v)}
                    className="mt-4 flex w-full items-center justify-between rounded-2xl p-4 text-left"
                    style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{fullPage ? 'Full page capture' : 'Viewport only'}</p>
                      <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>
                        {fullPage ? 'Captures the full scrollable document.' : 'Captures only what is visible on first load.'}
                      </p>
                    </div>
                    <span className="relative h-6 w-11 rounded-full transition-colors" style={{ background: fullPage ? '#16A34A' : '#D1D5DB' }}>
                      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all" style={{ left: fullPage ? '1.35rem' : '0.125rem' }} />
                    </span>
                  </button>
                </div>

                <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                    style={{ background: saved ? 'rgba(22,163,74,0.1)' : '#111827', color: saved ? '#15803D' : '#FFFFFF', border: saved ? '1px solid rgba(22,163,74,0.22)' : '1px solid #111827' }}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saved ? 'Saved' : isSaving ? 'Saving…' : 'Save changes'}
                  </button>
                  <p className="mt-2 text-center text-xs" style={{ color: '#9CA3AF' }}>
                    Changes apply to future checks. Existing screenshots stay untouched.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(185,28,28,0.03)', border: '1px solid rgba(185,28,28,0.12)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" style={{ color: '#DC2626' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#B91C1C' }}>Danger zone</h3>
              </div>
              <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                Deleting this monitor permanently removes its screenshots, alerts, and history.
              </p>

              {!showDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
                  style={{ background: '#FFFFFF', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.18)' }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete monitor
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-sm" style={{ color: '#374151' }}>
                    Type <span className="font-mono font-semibold">{url.name}</span> to confirm deletion.
                  </p>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder={url.name}
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    autoFocus
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting || deleteConfirm.trim().toLowerCase() !== url.name.trim().toLowerCase()}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50"
                      style={{ background: '#FFFFFF', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.18)' }}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      {isDeleting ? 'Deleting…' : 'Confirm delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDelete(false)
                        setDeleteConfirm('')
                      }}
                      className="rounded-xl px-4 py-2 text-sm font-medium"
                      style={{ color: '#6B7280' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
