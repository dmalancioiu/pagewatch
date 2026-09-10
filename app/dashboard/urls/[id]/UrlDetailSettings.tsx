'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  AlertTriangle,
  Camera,
  Clock,
  MessageSquareText,
  Pause,
  Play,
  Save,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/ToastProvider'
import { useDashboard } from '@/components/dashboard/DashboardShell'
import { ZoneSelectorModal } from '@/components/dashboard/ZoneSelectorModal'
import { contentChangesOf, describeChange, iconFor } from '@/components/dashboard/ChangeTimeline'
import { updateMonitoredUrl, deleteMonitoredUrl } from '@/lib/actions/websites'
import type { CheckFrequency, Zone } from '@/lib/types/database.types'
import type { AlertWithUrls } from './UrlDetailClient'

const FREQ_OPTIONS: { id: CheckFrequency; label: string }[] = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
]

interface MonitorFields {
  id: string
  name: string
  check_frequency: CheckFrequency
  check_hour: number | null
  threshold_pct: number
  full_page: boolean
  watch_description: string | null
  consecutive_failures: number
  last_error: string | null
  last_error_at: string | null
  last_success_at: string | null
}

interface Props {
  monitor: MonitorFields
  zones: Zone[]
  onZonesChange: (zones: Zone[]) => void
  latestSnapshotUrl: string | null
  selectedAlert: AlertWithUrls | null
  selectedCapture: { taken_at: string; file_size_bytes: number | null } | null
  isActive: boolean
  isPausePending: boolean
  onTogglePause: () => void
  isRunPending: boolean
  onRunNow: () => void
}

function fmtDate(iso: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function fmtBytes(n: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-meta text-text-muted">{label}</span>
      <span className={mono ? 'font-mono text-ui text-text tabular-nums' : 'text-ui-medium text-text'}>{value}</span>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="p-4">
      <div className="mb-2.5 flex items-center gap-1.5 text-label uppercase text-text-faint">
        {icon}
        {title}
      </div>
      {children}
    </section>
  )
}

export function UrlDetailSettings({
  monitor,
  zones,
  onZonesChange,
  latestSnapshotUrl,
  selectedAlert,
  selectedCapture,
  isActive,
  isPausePending,
  onTogglePause,
  isRunPending,
  onRunNow,
}: Props) {
  const router = useRouter()
  const toast = useToast()
  const { can, entitlements } = useDashboard()

  const [name, setName] = useState(monitor.name)
  const [freq, setFreq] = useState<CheckFrequency>(monitor.check_frequency)
  const [checkHour, setCheckHour] = useState<number>(monitor.check_hour ?? 9)
  const [threshold, setThreshold] = useState<number>(monitor.threshold_pct)
  const [fullPage, setFullPage] = useState<boolean>(monitor.full_page)
  const [watchDescription, setWatchDescription] = useState<string>(monitor.watch_description ?? '')
  const [isSaving, startSave] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)

  const canUseZones = can('zones')
  const maxZones = entitlements.limits.maxZonesPerMonitor

  function handleSave() {
    startSave(async () => {
      const res = await updateMonitoredUrl({
        id: monitor.id,
        name: name.trim() || monitor.name,
        check_frequency: freq,
        check_hour: freq !== 'hourly' ? checkHour : null,
        threshold_pct: threshold,
        full_page: fullPage,
        watch_description: watchDescription.trim() || null,
      })

      if (!res.ok) {
        // Roll back to the last known-good server values — nothing here
        // should keep showing a draft the server refused.
        setName(monitor.name)
        setFreq(monitor.check_frequency)
        setCheckHour(monitor.check_hour ?? 9)
        setThreshold(monitor.threshold_pct)
        setFullPage(monitor.full_page)
        setWatchDescription(monitor.watch_description ?? '')

        if (res.kind === 'entitlement') {
          toast.toast({
            title: 'Could not save settings',
            description: res.message,
            tone: 'error',
            action: res.upgradeTo ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings/billing' } : undefined,
          })
        } else {
          toast.error('Could not save settings', res.message)
        }
        return
      }

      toast.success('Settings saved')
      router.refresh()
    })
  }

  function handleZonesSaved(next: Zone[]) {
    startSave(async () => {
      const res = await updateMonitoredUrl({ id: monitor.id, zones: next.length ? next : null })
      if (!res.ok) {
        if (res.kind === 'entitlement') {
          toast.toast({
            title: 'Could not save zones',
            description: res.message,
            tone: 'error',
            action: res.upgradeTo ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings/billing' } : undefined,
          })
        } else {
          toast.error('Could not save zones', res.message)
        }
        return
      }
      onZonesChange(next)
      router.refresh()
    })
  }

  function handleDelete() {
    startDelete(async () => {
      const res = await deleteMonitoredUrl({ id: monitor.id })
      if (!res.ok) {
        toast.error('Could not delete monitor', res.message)
        return
      }
      toast.success('Monitor deleted')
      router.push('/dashboard/urls')
    })
  }

  const triggeredZone = selectedAlert?.metadata?.zone_scores?.find((z: any) => z.passes_threshold)?.label
  const selectedCaptureChanges = selectedAlert ? contentChangesOf(selectedAlert) : []

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex h-11 shrink-0 items-center justify-between border-b border-border bg-panel px-4">
        <div className="min-w-0">
          <p className="truncate text-ui-medium text-text">Monitor settings</p>
        </div>
        <Button size="sm" onClick={handleSave} loading={isSaving} iconLeft={<Save className="size-3.5" />}>
          Save
        </Button>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {(monitor.consecutive_failures > 0 || monitor.last_error) && (
          <div className="flex items-start gap-2 bg-warn-subtle p-3">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warn" />
            <div className="min-w-0">
              <p className="text-ui-medium text-warn">
                {monitor.consecutive_failures} failed check{monitor.consecutive_failures === 1 ? '' : 's'} in a row
              </p>
              {monitor.last_error && <p className="mt-0.5 text-meta text-text-muted">{monitor.last_error}</p>}
              <p className="mt-0.5 text-meta text-text-faint">Last attempt {fmtDate(monitor.last_error_at)}</p>
            </div>
          </div>
        )}

        <Section title="What changed" icon={<Sparkles className="size-3" />}>
          {selectedAlert ? (
            <div className="flex flex-col gap-2">
              <p className="text-ui text-text">{selectedAlert.ai_summary || 'A visual change was detected.'}</p>
              <div className="flex flex-wrap items-center gap-2">
                {selectedAlert.severity && <SeverityBadge severity={selectedAlert.severity} size="sm" />}
                <span className="font-mono text-meta text-text-muted tabular-nums">
                  {selectedAlert.diff_pct != null ? `${Number(selectedAlert.diff_pct).toFixed(1)}% changed` : ''}
                </span>
                {triggeredZone && <Badge size="sm">{triggeredZone}</Badge>}
              </div>
              {selectedCaptureChanges.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1.5 border-t border-border pt-2">
                  {selectedCaptureChanges.map((change, i) => {
                    const Icon = iconFor(change.kind)
                    return (
                      <li key={i} className="flex items-start gap-2 text-ui text-text">
                        <Icon className="mt-0.5 size-3.5 shrink-0 text-text-faint" aria-hidden />
                        <span className="min-w-0">{describeChange(change)}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-ui text-text-muted">No change detected on this capture.</p>
          )}
        </Section>

        <Section title="Selected capture" icon={<Activity className="size-3" />}>
          <Row label="Captured" value={selectedCapture ? fmtDate(selectedCapture.taken_at) : '—'} />
          <Row label="File size" value={selectedCapture ? fmtBytes(selectedCapture.file_size_bytes) : '—'} mono />
          <Row label="Last successful check" value={fmtDate(monitor.last_success_at)} />
        </Section>

        <Section title="Schedule" icon={<Clock className="size-3" />}>
          <div className="mb-2.5 flex rounded-md bg-bg-subtle p-0.5">
            {FREQ_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFreq(f.id)}
                className={`flex-1 rounded px-0 py-1.5 text-ui transition-colors duration-120 ${
                  freq === f.id ? 'bg-panel text-text shadow-card' : 'text-text-muted hover:text-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {freq !== 'hourly' && (
            <Field label="Run at (UTC)" htmlFor="check-hour">
              <Select value={String(checkHour)} onValueChange={(v) => setCheckHour(Number(v))}>
                <SelectTrigger id="check-hour">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </Section>

        <Section title="Capture" icon={<Camera className="size-3" />}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-ui text-text">Full-page scroll</p>
              <p className="text-meta text-text-muted">Capture the entire page height</p>
            </div>
            <Switch checked={fullPage} onCheckedChange={setFullPage} />
          </div>
          <Field label="Alert threshold" htmlFor="threshold" description="% of the page that must change to fire an alert." className="mt-3">
            <Input id="threshold" type="number" min={1} max={100} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} suffix="%" />
          </Field>
          <Field label="Monitor name" htmlFor="monitor-name" className="mt-3">
            <Input id="monitor-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </Section>

        <Section title="Zones" icon={<Target className="size-3" />}>
          <p className="mb-2.5 text-ui text-text-muted">
            {zones.length > 0
              ? `${zones.length} zone${zones.length === 1 ? '' : 's'} configured.`
              : 'No zones yet — the whole page is compared.'}
          </p>
          {!canUseZones ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button variant="secondary" size="sm" disabled className="w-full justify-center">
                    Zones require an upgrade
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Tracking zones are not included in {entitlements.planName}. Upgrade to unlock.</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              disabled={!latestSnapshotUrl}
              onClick={() => setZoneModalOpen(true)}
            >
              {zones.length > 0 ? 'Manage zones' : 'Create zones'}
            </Button>
          )}
        </Section>

        <Section title="AI instruction" icon={<MessageSquareText className="size-3" />}>
          <Textarea
            value={watchDescription}
            onChange={(e) => setWatchDescription(e.target.value)}
            placeholder="Tell PageWatch what to look for — e.g. alert me if pricing or the main CTA changes. Ignore cookie banners and timestamps."
            autoGrow
            maxRows={8}
          />
        </Section>
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-border p-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            iconLeft={<Play className="size-3.5" />}
            onClick={onRunNow}
            loading={isRunPending}
            disabled={!isActive}
            title={isActive ? 'Run this monitor now' : 'Resume this monitor before running it manually'}
          >
            Run now
          </Button>
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            iconLeft={isActive ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            onClick={onTogglePause}
            loading={isPausePending}
          >
            {isActive ? 'Pause' : 'Resume'}
          </Button>
        </div>
        <Button
          variant="danger"
          className="justify-center"
          iconLeft={<Trash2 className="size-3.5" />}
          onClick={() => setConfirmOpen(true)}
        >
          Delete monitor
        </Button>
      </div>

      {latestSnapshotUrl && (
        <ZoneSelectorModal
          isOpen={zoneModalOpen}
          onClose={() => setZoneModalOpen(false)}
          imageUrl={latestSnapshotUrl}
          zones={zones}
          onChange={handleZonesSaved}
          maxZones={canUseZones ? maxZones : 0}
        />
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this monitor?</DialogTitle>
            <DialogDescription>
              This stops all future checks and hides its history. PageWatch keeps the data briefly in case you change your mind.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
              Delete monitor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
