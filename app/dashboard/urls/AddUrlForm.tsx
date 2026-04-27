'use client'

import { useState, useTransition } from 'react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import { Plus } from 'lucide-react'
import type { CheckFrequency } from '@/lib/types/database.types'

interface AddUrlFormProps {
  workspaceId: string
}

export function AddUrlForm({ workspaceId }: AddUrlFormProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [freq, setFreq] = useState<CheckFrequency>('daily')
  const [threshold, setThreshold] = useState(5)
  const [error, setError] = useState<string | null>(null)
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
          name: name || deriveNameFromUrl(url),
          check_frequency: freq,
          threshold_pct: threshold,
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
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit"
      >
        <Plus className="w-4 h-4" /> Add Monitor
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200 p-6 space-y-6"
    >
      <div className="border-b border-zinc-100 pb-4">
        <h3 className="text-lg font-bold text-zinc-900">Initialize Monitor</h3>
        <p className="text-sm text-zinc-500 mt-1">Configure tracking for a new URL target.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Target URL</label>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            required
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Display Name</label>
          <input
            type="text"
            placeholder="E.g., Pricing Page"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Schedule Frequency</label>
          <select
            value={freq}
            onChange={(e) => setFreq(e.target.value as CheckFrequency)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            <option value="hourly">Hourly checks</option>
            <option value="daily">Daily checks</option>
            <option value="weekly">Weekly checks</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
            Sensitivity Threshold ({threshold}%)
          </label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
          >
            <option value={2}>High Sensitivity — 2%</option>
            <option value={5}>Balanced — 5%</option>
            <option value={15}>Low Sensitivity — 15%</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || !url.trim()}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending ? 'Deploying...' : 'Deploy Monitor'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null) }}
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}