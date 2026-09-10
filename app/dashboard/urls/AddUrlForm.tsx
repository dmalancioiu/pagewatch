'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CheckFrequency } from '@/lib/types/database.types'

/**
 * A standalone inline add-URL form. Not currently rendered anywhere —
 * `app/dashboard/urls/page.tsx` opens `AddUrlModal` via `useDashboard().openAddUrl`
 * instead. Kept token-driven and on the current action API in case a screen
 * needs an inline (non-modal) version later.
 */
interface AddUrlFormProps {
  workspaceId: string
}

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

export function AddUrlForm(props: AddUrlFormProps) {
  void props // kept for API compatibility — this form derives its workspace server-side.
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [freq, setFreq] = useState<CheckFrequency>('daily')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleUrlChange(value: string) {
    setUrl(value)
    if (!name) setName(deriveNameFromUrl(value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setError(null)

    startTransition(async () => {
      const res = await addMonitoredUrls({
        urls: [{ url, name: name || deriveNameFromUrl(url), check_frequency: freq }],
      })
      if (!res.ok) {
        if (res.kind === 'entitlement') {
          toast({
            title: 'Monitor limit reached',
            description: res.message,
            tone: 'error',
            action: res.upgradeTo
              ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings#billing' }
              : undefined,
          })
          return
        }
        setError(res.message)
        return
      }
      toast({ title: 'Monitor added', tone: 'success' })
      setUrl('')
      setName('')
      setFreq('daily')
      setOpen(false)
    })
  }

  if (!open) {
    return (
      <Button size="sm" iconLeft={<Plus className="size-3.5" />} onClick={() => setOpen(true)}>
        Add monitor
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-md border border-border bg-panel p-4">
      <Field label="Target URL" htmlFor="add-url-form-url">
        <Input
          id="add-url-form-url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          required
        />
      </Field>
      <Field label="Display name" htmlFor="add-url-form-name">
        <Input id="add-url-form-name" placeholder="e.g. Pricing page" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Check frequency" htmlFor="add-url-form-freq">
        <Select value={freq} onValueChange={(v) => setFreq(v as CheckFrequency)}>
          <SelectTrigger id="add-url-form-freq">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {error && <p className="text-meta text-critical">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" loading={isPending} disabled={!url.trim()}>
          Add monitor
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); setError(null) }} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
