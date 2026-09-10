'use client'

import { useState, useTransition } from 'react'
import { Archive, Eye, Sparkles } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
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
  } catch {
    return raw
  }
}

function hourLabel(h: number): string {
  if (h === 0) return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

const MODES: { id: MonitoredUrlMode; label: string; description: string; icon: typeof Eye }[] = [
  { id: 'watch', label: 'Watch changes', description: 'Alert on meaningful diffs', icon: Eye },
  { id: 'archive', label: 'Archive only', description: 'Keep snapshots, no alerts', icon: Archive },
]

export function AddUrlModal({ onClose, onCreated }: AddUrlModalProps) {
  const { toast } = useToast()
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<MonitoredUrlMode>('watch')
  const [freq, setFreq] = useState<CheckFrequency>('daily')
  const [checkHour, setCheckHour] = useState<number>(9)
  const [description, setDescription] = useState('')
  const [fullPage, setFullPage] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, start] = useTransition()

  const isWatch = mode === 'watch'
  const showTimePicker = freq === 'daily' || freq === 'weekly'

  function handleSubmit() {
    if (!url.trim()) return
    setError(null)
    start(async () => {
      const res = await addMonitoredUrls({
        urls: [
          {
            url,
            name: deriveName(url),
            check_frequency: freq,
            check_hour: showTimePicker ? checkHour : null,
            threshold_pct: 5,
            watch_description: isWatch && description.trim() ? description.trim() : null,
            full_page: fullPage,
            mode,
          },
        ],
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
          onClose()
          return
        }
        setError(res.message)
        return
      }

      const newId = res.data[0]?.id
      toast({ title: 'Monitor added', description: 'Taking the first screenshot now.', tone: 'success' })
      if (newId && onCreated) onCreated(newId)
      else onClose()
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add monitor</DialogTitle>
          <DialogDescription>Choose what to watch. We&rsquo;ll capture a baseline next.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <Field label="Target URL" htmlFor="add-url-target">
            <Input
              id="add-url-target"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="https://example.com/pricing"
              autoFocus
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <span className="text-label uppercase text-text-faint">Mode</span>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(({ id, label, description: desc, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors duration-120',
                    mode === id ? 'border-accent bg-accent-subtle' : 'border-border hover:bg-panel-raised'
                  )}
                >
                  <Icon className={cn('size-4 shrink-0', mode === id ? 'text-accent' : 'text-text-faint')} />
                  <div className="min-w-0">
                    <p className="text-ui-medium text-text">{label}</p>
                    <p className="text-meta text-text-muted">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-label uppercase text-text-faint">Schedule</span>
            <div className="flex items-center gap-2">
              <Select value={freq} onValueChange={(v) => setFreq(v as CheckFrequency)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              {showTimePicker && (
                <Select value={String(checkHour)} onValueChange={(v) => setCheckHour(Number(v))}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, h) => (
                      <SelectItem key={h} value={String(h)}>
                        {hourLabel(h)} UTC
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {isWatch && (
            <Field
              label="Watch instruction"
              htmlFor="add-url-instruction"
              description="Optional — tells Claude what to look for."
            >
              <Textarea
                id="add-url-instruction"
                autoGrow
                maxRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Alert me if pricing changes, availability changes, or the headline updates."
              />
            </Field>
          )}

          <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-3.5 text-text-faint" />
              <div>
                <p className="text-ui text-text">{fullPage ? 'Full page capture' : 'Viewport capture'}</p>
                <p className="text-meta text-text-muted">
                  {fullPage ? 'Capture the full scrollable page.' : 'Capture only the visible viewport.'}
                </p>
              </div>
            </div>
            <Switch checked={fullPage} onCheckedChange={setFullPage} />
          </div>

          {error && <p className="text-meta text-critical">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isPending} disabled={!url.trim()}>
            {mode === 'archive' ? 'Start archive' : 'Add monitor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
