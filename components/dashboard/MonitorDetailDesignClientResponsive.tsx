'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useOptimistic, useState, useTransition } from 'react'
import { AlertTriangle, ArrowLeft, ChevronRight, ExternalLink, Maximize2, Pause, Play } from 'lucide-react'
import { StatusDot } from '@/components/ui/status-dot'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/ToastProvider'
import { pauseMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { buildPriceSeries } from '@/lib/history'
import type { Zone } from '@/lib/types/database.types'
import { ResizableInspectorLayout } from '@/app/dashboard/urls/[id]/ResizableInspectorLayout'
import { UrlDetailClient, type AlertWithUrls, type SnapshotWithUrl } from '@/app/dashboard/urls/[id]/UrlDetailClient'
import { UrlDetailSettings } from '@/app/dashboard/urls/[id]/UrlDetailSettings'
import { FullscreenMonitorViewer } from '@/components/dashboard/FullscreenMonitorViewer'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import { ChangeChart } from '@/components/dashboard/ChangeChart'
import { ChangeTimeline } from '@/components/dashboard/ChangeTimeline'

interface MonitorFields {
  id: string
  url: string
  name: string
  check_frequency: 'hourly' | 'daily' | 'weekly'
  check_hour: number | null
  threshold_pct: number
  full_page: boolean
  watch_description: string | null
  is_active: boolean
  consecutive_failures: number
  last_error: string | null
  last_error_at: string | null
  last_success_at: string | null
}

interface Props {
  monitor: MonitorFields
  zones: Zone[]
  snapshots: SnapshotWithUrl[]
  alerts: AlertWithUrls[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  openAlert: AlertWithUrls | null
  lastChecked: string
  nextRun: string
}

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

type StatusKind = 'paused' | 'failing' | 'alert' | 'healthy'

const STATUS_LABEL: Record<StatusKind, string> = {
  paused: 'Paused',
  failing: 'Failing',
  alert: 'Alert',
  healthy: 'Healthy',
}
const STATUS_TONE: Record<StatusKind, 'neutral' | 'warn' | 'critical' | 'ok'> = {
  paused: 'neutral',
  failing: 'warn',
  alert: 'critical',
  healthy: 'ok',
}

export function MonitorDetailDesignClientResponsive({
  monitor,
  zones: initialZones,
  snapshots,
  alerts,
  alertBySnapshotId,
  openAlert,
  lastChecked,
  nextRun,
}: Props) {
  const router = useRouter()
  const toast = useToast()

  const [isActive, setOptimisticActive] = useOptimistic(monitor.is_active, (_state, next: boolean) => next)
  const [isPausePending, startPause] = useTransition()
  const [isRunPending, startRun] = useTransition()
  const [isResolvePending, startResolve] = useTransition()

  const [zones, setZones] = useState<Zone[]>(initialZones)
  const [selectedId, setSelectedId] = useState<string | null>(snapshots[0]?.id ?? null)
  const [dismissedAlertId, setDismissedAlertId] = useState<string | null>(null)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [fullscreenTab, setFullscreenTab] = useState<'diff' | 'current'>('diff')
  const [diffModalOpen, setDiffModalOpen] = useState(false)

  const activeAlert = openAlert && openAlert.id !== dismissedAlertId ? openAlert : null

  const selectedIndex = Math.max(0, snapshots.findIndex((s) => s.id === selectedId))
  const selected = snapshots[selectedIndex] ?? snapshots[0] ?? null
  const previous = snapshots[selectedIndex + 1] ?? null
  const selectedAlert = selected ? alertBySnapshotId[selected.id] ?? null : null
  const afterUrl = selectedAlert?.afterUrl ?? selected?.signedUrl ?? null
  const beforeUrl = selectedAlert?.beforeUrl ?? previous?.signedUrl ?? null
  const diffUrl = selectedAlert?.diffUrl ?? null
  const triggeredRegion = (selectedAlert?.metadata?.zone_scores as any[] | undefined)?.find((z) => z.passes_threshold)?.label

  const statusKind: StatusKind = !isActive ? 'paused' : monitor.consecutive_failures > 0 ? 'failing' : activeAlert ? 'alert' : 'healthy'

  // Price history — pure transform, recomputed only when the underlying
  // captures or alerts change. See lib/history.ts for the label-matching and
  // gap-handling rules.
  const priceSeries = useMemo(() => buildPriceSeries(snapshots, alertBySnapshotId), [snapshots, alertBySnapshotId])

  function handleTogglePause() {
    const next = !isActive
    startPause(async () => {
      setOptimisticActive(next)
      const res = await pauseMonitoredUrl({ id: monitor.id, paused: !next })
      if (!res.ok) {
        toast.error('Could not update monitor', res.message)
        return
      }
      toast.success(next ? 'Monitor resumed' : 'Monitor paused')
      router.refresh()
    })
  }

  function handleRunNow() {
    startRun(async () => {
      const res = await triggerManualRun({ id: monitor.id })
      if (!res.ok) {
        if (res.kind === 'entitlement') {
          toast.toast({
            title: 'Could not start manual check',
            description: res.message,
            tone: 'error',
            action: res.upgradeTo ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings/billing' } : undefined,
          })
        } else {
          toast.error('Could not start manual check', res.message)
        }
        return
      }
      toast.success('Manual check started', 'Refresh in a moment to see the latest capture.')
      router.refresh()
    })
  }

  function handleResolveAlert() {
    if (!activeAlert) return
    const id = activeAlert.id
    startResolve(async () => {
      try {
        await acknowledgeAlert(id)
        setDismissedAlertId(id)
        toast.success('Alert resolved')
        router.refresh()
      } catch (error) {
        toast.error('Could not resolve alert', error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      }
    })
  }

  function openFullscreen() {
    setFullscreenTab(beforeUrl && afterUrl ? 'diff' : 'current')
    setFullscreenOpen(true)
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-3 sm:px-5 sm:py-4">
      <header className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <Link
          href="/dashboard/urls"
          aria-label="Back to monitors"
          className="flex size-7 shrink-0 items-center justify-center rounded border border-border text-text-muted transition-colors duration-120 hover:bg-panel-raised hover:text-text"
        >
          <ArrowLeft className="size-3.5" />
        </Link>

        <div className="flex min-w-0 items-center gap-1.5 text-meta">
          <Link href="/dashboard/urls" className="whitespace-nowrap text-text-faint hover:text-text">
            Monitors
          </Link>
          <ChevronRight className="size-3 shrink-0 text-text-faint" />
          <span className="truncate text-ui-medium text-text">{monitor.name}</span>
        </div>

        <span className="inline-flex items-center gap-1.5">
          <StatusDot tone={STATUS_TONE[statusKind]} pulse={statusKind === 'healthy'} />
          <Badge tone={statusKind === 'healthy' ? 'ok' : statusKind === 'alert' ? 'critical' : statusKind === 'failing' ? 'warn' : 'neutral'} size="sm">
            {STATUS_LABEL[statusKind]}
          </Badge>
        </span>

        <a
          href={monitor.url}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1 truncate font-mono text-meta text-text-faint hover:text-text sm:inline-flex"
        >
          {host(monitor.url)}
          <ExternalLink className="size-3" />
        </a>

        <div className="flex-1" />

        <span className="hidden text-meta text-text-faint md:inline">
          Last check <span className="text-text-muted">{lastChecked}</span>
        </span>
        <span className="hidden text-meta text-text-faint md:inline">
          Next run <span className="text-text-muted">{nextRun}</span>
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleRunNow}
          loading={isRunPending}
          disabled={!isActive}
          title={isActive ? 'Run this monitor now' : 'Resume this monitor before running it manually'}
        >
          Run now
        </Button>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={isActive ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          onClick={handleTogglePause}
          loading={isPausePending}
        >
          {isActive ? 'Pause' : 'Resume'}
        </Button>
      </header>

      {statusKind === 'failing' && monitor.last_error && (
        <div className="flex items-center gap-2 rounded-md border border-warn/30 bg-warn-subtle px-3 py-2 text-meta text-warn">
          <AlertTriangle className="size-3.5 shrink-0" />
          <span className="min-w-0 truncate">{monitor.last_error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price history</CardTitle>
            <CardDescription>
              Prices PageWatch has detected on this page over time — the single most useful
              thing to screenshot into a team chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeChart series={priceSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What changed</CardTitle>
            <CardDescription>Every structured change PageWatch found, newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeTimeline alerts={alerts} />
          </CardContent>
        </Card>
      </div>

      <ResizableInspectorLayout
        main={
          <UrlDetailClient
            snapshots={snapshots}
            alertBySnapshotId={alertBySnapshotId}
            openAlert={activeAlert}
            onResolveAlert={handleResolveAlert}
            isResolvingAlert={isResolvePending}
            selectedId={selected?.id ?? null}
            onSelectSnapshot={setSelectedId}
            onOpenFullscreen={openFullscreen}
          />
        }
        inspector={
          <UrlDetailSettings
            monitor={monitor}
            zones={zones}
            onZonesChange={setZones}
            latestSnapshotUrl={snapshots[0]?.signedUrl ?? null}
            selectedAlert={selectedAlert}
            selectedCapture={selected ? { taken_at: selected.taken_at, file_size_bytes: selected.file_size_bytes } : null}
            isActive={isActive}
            isPausePending={isPausePending}
            onTogglePause={handleTogglePause}
            isRunPending={isRunPending}
            onRunNow={handleRunNow}
          />
        }
      />

      <FullscreenMonitorViewer
        open={fullscreenOpen}
        onOpenChange={setFullscreenOpen}
        tab={fullscreenTab}
        onTabChange={setFullscreenTab}
        monitorName={monitor.name}
        beforeUrl={beforeUrl}
        afterUrl={afterUrl}
        currentUrl={selected?.signedUrl ?? afterUrl}
        region={triggeredRegion ?? zones[0]?.label ?? 'Full page'}
        aiSummary={selectedAlert?.ai_summary ?? null}
        diffPct={selectedAlert?.diff_pct ?? null}
        capturedAt={selected?.taken_at ?? null}
      />

      <DiffViewerModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        beforeUrl={beforeUrl}
        afterUrl={afterUrl}
        diffUrl={diffUrl}
        defaultTab={diffUrl ? 'diff' : beforeUrl ? 'compare' : 'after'}
        metadata={{
          diffPct: selectedAlert?.diff_pct,
          severity: selectedAlert?.severity,
          timestamp: selected?.taken_at,
          pageUrl: monitor.url,
        }}
      />

      <button type="button" className="hidden" aria-hidden onClick={() => setDiffModalOpen(true)} />
    </div>
  )
}
