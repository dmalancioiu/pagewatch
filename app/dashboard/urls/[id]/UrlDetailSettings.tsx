'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMonitoredUrl, deleteMonitoredUrl, pauseMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import {
  Settings2, Trash2, Pause, Play, Save,
  AlertTriangle, Loader2, Play as RunIcon, Clock, Zap, Globe, Crosshair,
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

  const [isSaving,   startSave]   = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [isPausing,  startPause]  = useTransition()

  const showTimePicker = freq === 'daily' || freq === 'weekly'
  const isArchive      = url.mode === 'archive'

  /* ── Save settings ─────────────────────────────────── */
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

  /* ── Pause / resume ───────────────────────────────── */
  function handlePause() {
    startPause(async () => {
      const newPaused = !paused
      await pauseMonitoredUrl(url.id, newPaused)
      setPaused(newPaused)
      router.refresh()
    })
  }

  /* ── Run now ──────────────────────────────────────── */
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

  /* ── Delete ──────────────────────────────────────── */
  function handleDelete() {
    if (deleteConfirm.trim().toLowerCase() !== url.name.trim().toLowerCase()) return
    startDelete(async () => {
      await deleteMonitoredUrl(url.id)
      router.push('/dashboard/urls')
    })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
      >
        <Settings2 className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
        <span className="text-sm font-semibold text-white">Settings</span>
      </div>

      <div className="p-6 space-y-8">

        {/* ── Run Now ──────────────────────────────────── */}
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)' }}
        >
          <div>
            <p className="text-sm font-semibold text-white">Run Now</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {runState === 'confirming'
                ? 'This uses 1 screenshot credit from your monthly quota.'
                : runState === 'done'
                ? 'Screenshot queued — history will update in ~30 seconds.'
                : runState === 'error'
                ? runError
                : 'Take a screenshot immediately, outside your normal schedule.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {runState === 'confirming' && (
              <button
                type="button"
                onClick={() => setRunState('idle')}
                className="text-xs px-3 py-2 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleRunNow}
              disabled={runState === 'running' || runState === 'done' || paused}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: runState === 'done'
                  ? 'rgba(0,255,136,0.15)'
                  : runState === 'confirming'
                  ? '#00ff88'
                  : 'rgba(0,255,136,0.1)',
                color:     runState === 'confirming' ? '#000' : '#00ff88',
                border:    '1px solid rgba(0,255,136,0.25)',
                boxShadow: runState === 'confirming' ? '0 0 16px rgba(0,255,136,0.3)' : 'none',
              }}
            >
              {runState === 'running' ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
              ) : runState === 'done' ? (
                <><Zap className="w-3.5 h-3.5" /> Queued!</>
              ) : runState === 'confirming' ? (
                <><RunIcon className="w-3.5 h-3.5" /> Confirm run</>
              ) : (
                <><RunIcon className="w-3.5 h-3.5" /> Run now</>
              )}
            </button>
          </div>
        </div>

        {/* ── Check frequency ───────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-3"
                 style={{ color: 'rgba(255,255,255,0.35)' }}>
            Check frequency
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {FREQ_OPTIONS.map((f) => {
              const active = freq === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFreq(f.id)}
                  className="text-left p-3.5 rounded-xl transition-all"
                  style={{
                    background: active ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.02)',
                    border:     active ? '1px solid rgba(0,255,136,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-sm font-semibold"
                     style={{ color: active ? '#00ff88' : 'rgba(255,255,255,0.7)' }}>
                    {f.label}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {f.desc}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Time picker */}
          {showTimePicker && (
            <div
              className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.14)' }}
            >
              <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(0,255,136,0.7)' }} />
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'rgba(0,255,136,0.8)' }}>
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
                <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Your report will be ready at this time every {freq === 'weekly' ? 'week' : 'day'}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Tracking Zones (watch mode only) ─────────── */}
        {!isArchive && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider"
                       style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Tracking Zones
                </label>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {zones.length > 0
                    ? `AI analyses only these ${zones.length} zone${zones.length !== 1 ? 's' : ''} for changes`
                    : 'AI analyses the full page — draw zones to focus on specific areas'}
                </p>
              </div>
              {zones.length > 0 && (
                <button
                  type="button"
                  onClick={() => setZones([])}
                  className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                  style={{ color: 'rgba(255,68,68,0.7)', border: '1px solid rgba(255,68,68,0.18)' }}
                >
                  Clear all
                </button>
              )}
            </div>

            {latestSnapshotUrl ? (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
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
                style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
              >
                <Crosshair className="w-5 h-5 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  No screenshot yet — run a check first, then zones can be edited here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Watch description (watch mode only) ──────── */}
        {!isArchive && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                   style={{ color: 'rgba(255,255,255,0.35)' }}>
              Alert focus{' '}
              <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe what to alert on — works alongside zones if defined.\n\nExamples: "Alert me if the pricing changes" · "Watch for new product announcements"`}
              className="w-full text-sm rounded-xl px-3.5 py-3 outline-none resize-none leading-relaxed"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border:     '1px solid rgba(255,255,255,0.08)',
                color:      'rgba(255,255,255,0.75)',
              }}
            />
            <p className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Our AI reads this and filters out irrelevant changes — only alerting when it matters to you.
            </p>
          </div>
        )}

        {/* ── Full page toggle ──────────────────────────── */}
        <div
          className="flex items-center justify-between px-4 py-3.5 rounded-xl"
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

        {/* ── Save + Pause row ─────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: saved ? 'rgba(0,255,136,0.12)' : 'rgba(0,255,136,0.08)',
              color:      '#00ff88',
              border:     saved ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(0,255,136,0.18)',
              boxShadow:  saved ? '0 0 12px rgba(0,255,136,0.15)' : 'none',
            }}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : isSaving ? 'Saving…' : 'Save changes'}
          </button>

          <button
            type="button"
            onClick={handlePause}
            disabled={isPausing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color:      paused ? 'rgba(0,255,136,0.8)' : 'rgba(255,255,255,0.45)',
              border:     '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {paused ? 'Resume monitoring' : 'Pause monitoring'}
          </button>
        </div>

        {/* ── Danger zone ──────────────────────────────── */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(255,50,50,0.03)', border: '1px solid rgba(255,68,68,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#ff7070' }} />
            <span className="text-sm font-semibold" style={{ color: '#ff7070' }}>Danger zone</span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Deleting this URL removes all snapshots and alerts permanently.
          </p>

          {!showDelete ? (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'rgba(255,68,68,0.08)', color: '#ff7070', border: '1px solid rgba(255,68,68,0.18)' }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete this URL
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Type <span className="font-mono font-bold text-white">{url.name}</span> to confirm:
              </p>
              <input
                type="text"
                className="dash-input w-full"
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
                  style={{ background: 'rgba(255,68,68,0.12)', color: '#ff7070', border: '1px solid rgba(255,68,68,0.22)' }}
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {isDeleting ? 'Deleting…' : 'Confirm delete'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                  className="text-sm font-medium px-4 py-2 rounded-lg"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
