'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMonitoredUrl, deleteMonitoredUrl, pauseMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import {
  Trash2, Pause, Play, Save,
  AlertTriangle, Loader2, Play as RunIcon, Clock, Globe, Crosshair, Settings2,
} from 'lucide-react'
import type { CheckFrequency, Zone } from '@/lib/types/database.types'
import { ZoneSelector } from '@/components/dashboard/ZoneSelector'

const FREQ_OPTIONS: { id: CheckFrequency; label: string; desc: string }[] = [
  { id: 'hourly', label: 'Hourly',  desc: 'Every 60 min' },
  { id: 'daily',  label: 'Daily',   desc: 'Every 24 h'   },
  { id: 'weekly', label: 'Weekly',  desc: 'Every 7 d'    },
]

function hourLabel(h: number): string {
  if (h === 0)  return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

type RunState = 'idle' | 'confirming' | 'running' | 'done' | 'error'

interface Props {
  url:               any
  latestSnapshotUrl: string | null
}

export function UrlDetailSettings({ url, latestSnapshotUrl }: Props) {
  const router = useRouter()

  const [freq,        setFreq]        = useState<CheckFrequency>(url.check_frequency)
  const [checkHour,   setCheckHour]   = useState<number>(url.check_hour ?? 9)
  const [description, setDescription] = useState<string>(url.watch_description ?? '')
  const [fullPage,    setFullPage]    = useState<boolean>(url.full_page !== false)
  const [zones,       setZones]       = useState<Zone[]>(() => {
    if (!url.zones) return []
    if (Array.isArray(url.zones)) return url.zones as Zone[]
    return []
  })
  const [paused,      setPaused]      = useState(!url.is_active)
  const [saved,       setSaved]       = useState(false)
  const [showDelete,     setShowDelete]     = useState(false)
  const [deleteConfirm,  setDeleteConfirm]  = useState('')
  const [runState,       setRunState]       = useState<RunState>('idle')
  const [runError,       setRunError]       = useState<string | null>(null)
  const [settingsOpen,   setSettingsOpen]   = useState(false)

  const [isSaving,   startSave]   = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [isPausing,  startPause]  = useTransition()

  const showTimePicker = freq === 'daily' || freq === 'weekly'
  const isArchive      = url.mode === 'archive'

  function handleSave() {
    startSave(async () => {
      await updateMonitoredUrl(url.id, {
        check_frequency:   freq,
        check_hour:        showTimePicker ? checkHour : null,
        watch_description: description.trim() || null,
        full_page:         fullPage,
        zones:             zones.length > 0 ? zones : null,
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
        setTimeout(() => { setRunState('idle'); router.refresh() }, 3000)
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
    <div className="space-y-4">

      {/* ── Quick actions row ─── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Run now */}
        <div className="flex items-center gap-2">
          {runState === 'confirming' && (
            <button
              type="button"
              onClick={() => setRunState('idle')}
              className="text-xs px-3 py-2 rounded-lg transition-colors"
              style={{ color: '#6B7280' }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleRunNow}
            disabled={runState === 'running' || runState === 'done' || paused}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: runState === 'done'
                ? 'rgba(22,163,74,0.1)'
                : runState === 'confirming'
                ? '#16A34A'
                : '#F9FAFB',
              color:  runState === 'confirming' ? '#FFFFFF' : runState === 'done' ? '#15803D' : '#374151',
              border: runState === 'confirming'
                ? '1px solid #16A34A'
                : '1px solid #E5E7EB',
            }}
          >
            {runState === 'running' ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
            ) : runState === 'done' ? (
              <><RunIcon className="w-3.5 h-3.5" /> Queued!</>
            ) : runState === 'confirming' ? (
              <><RunIcon className="w-3.5 h-3.5" /> Confirm run</>
            ) : (
              <><RunIcon className="w-3.5 h-3.5" /> Run now</>
            )}
          </button>
          {(runState === 'done' || runState === 'error') && (
            <p className="text-xs" style={{ color: runState === 'error' ? '#B91C1C' : '#6B7280' }}>
              {runState === 'error' ? runError : 'Screenshot queued — history updates in ~30s'}
            </p>
          )}
        </div>

        {/* Pause / resume */}
        <button
          type="button"
          onClick={handlePause}
          disabled={isPausing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: '#F9FAFB', color: '#374151', border: '1px solid #E5E7EB' }}
        >
          {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          {paused ? 'Resume' : 'Pause'}
        </button>

        {/* Edit settings toggle */}
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-auto"
          style={{
            background: settingsOpen ? '#F3F4F6' : '#F9FAFB',
            color: '#374151',
            border: '1px solid #E5E7EB',
          }}
        >
          <Settings2 className="w-3.5 h-3.5" />
          {settingsOpen ? 'Close settings' : 'Edit settings'}
        </button>
      </div>

      {/* ── Expandable settings panel ─── */}
      {settingsOpen && (
        <div className="dash-card overflow-hidden">
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ borderBottom: '1px solid #F3F4F6', background: '#F8FAFC' }}
          >
            <Settings2 className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            <span className="text-sm font-semibold" style={{ color: '#374151' }}>Edit monitoring settings</span>
          </div>

          <div className="p-5 space-y-7">

            {/* Check frequency */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-3"
                     style={{ color: '#9CA3AF' }}>
                Check frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FREQ_OPTIONS.map((f) => {
                  const active = freq === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFreq(f.id)}
                      className="text-left p-3 rounded-xl transition-all"
                      style={{
                        background: active ? 'rgba(22,163,74,0.06)' : '#F9FAFB',
                        border:     active ? '1px solid rgba(22,163,74,0.3)' : '1px solid #E5E7EB',
                      }}
                    >
                      <p className="text-sm font-semibold"
                         style={{ color: active ? '#15803D' : '#374151' }}>
                        {f.label}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
                        {f.desc}
                      </p>
                    </button>
                  )
                })}
              </div>

              {showTimePicker && (
                <div
                  className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.18)' }}
                >
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#15803D' }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#15803D' }}>Run at (UTC)</p>
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

            {/* Tracking Zones (watch mode only) */}
            {!isArchive && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider"
                           style={{ color: '#9CA3AF' }}>
                      Focus zones
                    </label>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
                      {zones.length > 0
                        ? `${zones.length} zone${zones.length !== 1 ? 's' : ''} — only these areas are compared`
                        : 'Full page — draw zones to focus on specific areas'}
                    </p>
                  </div>
                  {zones.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setZones([])}
                      className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                      style={{ color: '#B91C1C', border: '1px solid rgba(185,28,28,0.2)', background: 'rgba(185,28,28,0.04)' }}
                    >
                      Clear zones
                    </button>
                  )}
                </div>

                {latestSnapshotUrl ? (
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    <ZoneSelector
                      imageUrl={latestSnapshotUrl}
                      zones={zones}
                      onChange={setZones}
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-xl flex flex-col items-center justify-center py-10 text-center"
                    style={{ border: '1px dashed #E5E7EB', background: '#F9FAFB' }}
                  >
                    <Crosshair className="w-5 h-5 mb-2" style={{ color: '#D1D5DB' }} />
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      No screenshot yet — run a check first, then zones can be edited here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Watch description (watch mode only) */}
            {!isArchive && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                       style={{ color: '#9CA3AF' }}>
                  Alert focus{' '}
                  <span style={{ color: '#D1D5DB', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Describe what to alert on — works alongside zones.\n\nExamples: "Alert me if the pricing changes" · "Watch for new product announcements"`}
                  className="dash-input resize-none leading-relaxed"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-[11px] mt-1.5" style={{ color: '#9CA3AF' }}>
                  Our AI reads this and only alerts you when something relevant changes.
                </p>
              </div>
            )}

            {/* Full page toggle */}
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

            {/* Save button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: saved ? 'rgba(22,163,74,0.1)' : '#16A34A',
                  color:      saved ? '#15803D' : '#FFFFFF',
                  border:     saved ? '1px solid rgba(22,163,74,0.3)' : '1px solid transparent',
                }}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>

            {/* Danger zone */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(185,28,28,0.03)', border: '1px solid rgba(185,28,28,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                <span className="text-sm font-semibold" style={{ color: '#B91C1C' }}>Danger zone</span>
              </div>
              <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
                Deleting this monitor removes all screenshots and alerts permanently.
              </p>

              {!showDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(185,28,28,0.06)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.2)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete monitor
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-medium" style={{ color: '#374151' }}>
                    Type <span className="font-mono font-bold" style={{ color: '#111827' }}>{url.name}</span> to confirm:
                  </p>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder={url.name}
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting || deleteConfirm.trim().toLowerCase() !== url.name.trim().toLowerCase()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
                      style={{ background: 'rgba(185,28,28,0.08)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.2)' }}
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      {isDeleting ? 'Deleting…' : 'Confirm delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                      className="text-sm font-medium px-4 py-2 rounded-lg"
                      style={{ color: '#6B7280' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
