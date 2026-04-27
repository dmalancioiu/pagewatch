'use client'

import { useState, useTransition } from 'react'
import { X, ArrowRight, Check, Clock, Eye, Archive, Globe, Sparkles } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import type { CheckFrequency, MonitoredUrlMode } from '@/lib/types/database.types'

interface AddUrlModalProps {
  workspaceId: string
  onClose: () => void
  onCreated?: (urlId: string) => void
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
  { id: 'hourly', label: 'Hourly', sub: 'Every 60 min — for critical pages' },
  { id: 'daily', label: 'Daily', sub: 'Once a day — good default' },
  { id: 'weekly', label: 'Weekly', sub: 'Once a week — for stable pages' },
]

function hourLabel(h: number): string {
  if (h === 0) return '12:00 AM (midnight)'
  if (h === 12) return '12:00 PM (noon)'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

export function AddUrlModal({ workspaceId, onClose, onCreated }: AddUrlModalProps) {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<MonitoredUrlMode>('watch')
  const [freq, setFreq] = useState<CheckFrequency>('daily')
  const [checkHour, setCheckHour] = useState<number>(9)
  const [description, setDescription] = useState('')
  const [fullPage, setFullPage] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, start] = useTransition()

  const domain = getDomain(url)
  const favicon = url.trim() ? faviconUrl(url) : ''
  const derivedName = url ? deriveName(url) : ''
  const isWatch = mode === 'watch'
  const showTimePicker = freq === 'daily' || freq === 'weekly'

  function handleSubmit() {
    if (!url.trim()) return
    setError(null)
    start(async () => {
      try {
        const results = await addMonitoredUrls(workspaceId, [{
          url,
          name: derivedName,
          check_frequency: freq,
          check_hour: showTimePicker ? checkHour : null,
          threshold_pct: 5,
          watch_description: isWatch && description.trim() ? description.trim() : null,
          full_page: fullPage,
          mode,
        }])
        const newId = results[0]?.id
        if (newId && onCreated) onCreated(newId)
        else onClose()
      } catch (err: any) {
        setError(err?.message ?? 'Failed to add URL')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl ring-1 ring-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Initialize Monitor</h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">Define tracking parameters for a new target.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-6 space-y-8 overflow-y-auto">

          {/* Target Configuration */}
          <section className="space-y-4">
            <div className="relative group">
              {favicon && (
                <img src={favicon} alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm shadow-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="https://example.com/pricing"
                autoFocus
                className={`w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-mono ${favicon ? 'pl-12' : 'pl-4'}`}
              />
            </div>

            <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200/60">
              <button
                type="button"
                onClick={() => setMode('watch')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${mode === 'watch' ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <Eye className="w-4 h-4" /> Watch for Changes
              </button>
              <button
                type="button"
                onClick={() => setMode('archive')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${mode === 'archive' ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <Archive className="w-4 h-4" /> Archive Only
              </button>
            </div>
          </section>

          {/* Schedule Configuration */}
          <section>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Schedule</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCHEDULES.map((s) => {
                const isActive = freq === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFreq(s.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${isActive ? 'bg-zinc-50 border-zinc-900 ring-1 ring-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isActive ? 'text-zinc-900' : 'text-zinc-700'}`}>{s.label}</span>
                      {isActive && <Check className="w-4 h-4 text-zinc-900" />}
                    </div>
                    <span className="text-[10px] text-zinc-500 leading-tight block">{s.sub}</span>
                  </button>
                )
              })}
            </div>

            {showTimePicker && (
              <div className="mt-4 flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <Clock className="w-4 h-4 text-zinc-400" /> Run Check At (UTC)
                </div>
                <select
                  value={checkHour}
                  onChange={(e) => setCheckHour(Number(e.target.value))}
                  className="bg-white border border-zinc-200 text-zinc-900 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer shadow-sm"
                >
                  {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
                </select>
              </div>
            )}
          </section>

          {/* AI Focus Configuration */}
          {isWatch && (
            <section>
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> AI Alert Instructions <span className="font-medium normal-case text-zinc-400">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='E.g., "Alert me if the pricing changes" or "Notify me if the hero headline is different"'
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
              />
            </section>
          )}

          {/* Capture Depth Settings */}
          <section>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{fullPage ? 'Full Page Depth' : 'Viewport Only'}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{fullPage ? 'Captures entire scrollable document' : 'Captures only what is visible above the fold'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFullPage(!fullPage)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${fullPage ? 'bg-zinc-900' : 'bg-zinc-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm ${fullPage ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url.trim() || isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Deploying...' : <>{mode === 'archive' ? 'Start Archiving' : 'Deploy Monitor'} <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

      </div>
    </div>
  )
}