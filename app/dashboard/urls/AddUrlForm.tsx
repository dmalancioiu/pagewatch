'use client'

import { useState, useTransition } from 'react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import { Plus } from 'lucide-react'
import type { CheckFrequency } from '@/lib/types/database.types'

interface AddUrlFormProps {
  workspaceId: string
}

export function AddUrlForm({ workspaceId }: AddUrlFormProps) {
  const [open, setOpen]       = useState(false)
  const [url, setUrl]         = useState('')
  const [name, setName]       = useState('')
  const [freq, setFreq]       = useState<CheckFrequency>('daily')
  const [threshold, setThreshold] = useState(5)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function deriveNameFromUrl(raw: string) {
    try {
      const full = raw.startsWith('http') ? raw : `https://${raw}`
      const { hostname, pathname } = new URL(full)
      const path = pathname.replace(/\/$/, '')
      return path ? `${hostname}${path}` : hostname
    } catch {
      return ''
    }
  }

  function handleUrlChange(value: string) {
    setUrl(value)
    if (!name) setName(deriveNameFromUrl(value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setError(null)

    startTransition(async () => {
      try {
        await addMonitoredUrls(workspaceId, [{
          url,
          name:            name || deriveNameFromUrl(url),
          check_frequency: freq,
          threshold_pct:   threshold,
        }])
        setUrl('')
        setName('')
        setFreq('daily')
        setThreshold(5)
        setOpen(false)
      } catch (err: any) {
        setError(err?.message ?? 'Failed to add URL')
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white w-fit"
      >
        <Plus className="w-4 h-4" />
        Add URL
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold text-white/80">Add a URL to monitor</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">URL</label>
          <input
            type="text"
            placeholder="https://example.com/pricing"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            required
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Display name</label>
          <input
            type="text"
            placeholder="Pricing page"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Check frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value as CheckFrequency)}
            className="w-full rounded-lg border border-white/[0.1] bg-[#0d111a] px-3 py-2.5 text-sm text-white outline-none focus:border-accent-500/50"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Change threshold — {threshold}%
          </label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full rounded-lg border border-white/[0.1] bg-[#0d111a] px-3 py-2.5 text-sm text-white outline-none focus:border-accent-500/50"
          >
            <option value={2}>Sensitive — 2%</option>
            <option value={5}>Balanced — 5%</option>
            <option value={15}>Tolerant — 15%</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending || !url.trim()}
          className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Adding…' : 'Add URL'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null) }}
          disabled={isPending}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
