'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, Eye, MoreHorizontal, Play, Settings, Trash2 } from 'lucide-react'
import { StatusDot } from '@/components/ui/status-dot'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/ToastProvider'
import { pauseMonitoredUrl, deleteMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import { PanelRow } from '@/components/ui/panel'
import type { CheckFrequency, MonitoredUrlMode } from '@/lib/types/database.types'

export interface MonitorRowData {
  id: string
  name: string
  url: string
  is_active: boolean
  mode: MonitoredUrlMode
  check_frequency: CheckFrequency
  last_checked_at: string | null
  openAlertCount: number
  consecutive_failures?: number | null
  last_error?: string | null
  last_error_at?: string | null
  last_success_at?: string | null
}

const FREQ_LABEL: Record<CheckFrequency, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
}

function timeAgo(ts: string | null | undefined): string {
  if (!ts) return 'Never'
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * Health at a glance. A failing monitor must never read the same as a
 * healthy one just because nothing has visibly changed — see migration 006
 * and docs/DESIGN_SYSTEM.md's note on stale monitors reading as healthy.
 */
function monitorHealth(monitor: MonitorRowData): {
  tone: 'neutral' | 'warn' | 'critical' | 'ok'
  label: string
  tooltip?: string
  pulse?: boolean
} {
  if (!monitor.is_active) {
    return { tone: 'neutral', label: 'Paused' }
  }
  const failures = monitor.consecutive_failures ?? 0
  if (failures > 0) {
    return {
      tone: 'warn',
      label: `Failing (${failures})`,
      tooltip: monitor.last_error
        ? `Failed ${failures} time${failures === 1 ? '' : 's'} in a row — ${monitor.last_error}`
        : `Failed ${failures} time${failures === 1 ? '' : 's'} in a row.`,
    }
  }
  if (monitor.openAlertCount > 0) {
    return { tone: 'critical', label: `${monitor.openAlertCount} open`, pulse: true }
  }
  return { tone: 'ok', label: 'Healthy', pulse: true }
}

interface MonitorRowProps {
  monitor: MonitorRowData
}

export function MonitorRow({ monitor }: MonitorRowProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const health = monitorHealth(monitor)
  const domain = getDomain(monitor.url)

  function runNow() {
    startTransition(async () => {
      const res = await triggerManualRun({ id: monitor.id })
      if (!res.ok) {
        toast({
          title: 'Could not run check',
          description: res.message,
          tone: 'error',
          action:
            res.kind === 'entitlement' && res.upgradeTo
              ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings#billing' }
              : undefined,
        })
        return
      }
      toast({ title: 'Check queued', description: `Running a check for ${monitor.name}.`, tone: 'success' })
      router.refresh()
    })
  }

  function togglePause() {
    startTransition(async () => {
      const res = await pauseMonitoredUrl({ id: monitor.id, paused: monitor.is_active })
      if (!res.ok) {
        toast({ title: 'Could not update monitor', description: res.message, tone: 'error' })
        return
      }
      toast({ title: monitor.is_active ? 'Monitor paused' : 'Monitor resumed', tone: 'success' })
      router.refresh()
    })
  }

  function remove() {
    if (!window.confirm(`Delete ${monitor.name}? This removes its screenshots and alert history.`)) return
    startTransition(async () => {
      const res = await deleteMonitoredUrl({ id: monitor.id })
      if (!res.ok) {
        toast({ title: 'Could not delete monitor', description: res.message, tone: 'error' })
        return
      }
      toast({ title: 'Monitor deleted', tone: 'success' })
      router.refresh()
    })
  }

  return (
    <PanelRow className="gap-3 px-3">
      {health.tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="shrink-0">
              <StatusDot tone={health.tone} pulse={health.pulse} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{health.tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        <StatusDot tone={health.tone} pulse={health.pulse} className="shrink-0" />
      )}

      <Link href={`/dashboard/urls/${monitor.id}`} className="min-w-0 flex-1">
        <p className="truncate text-ui-medium text-text">{monitor.name}</p>
        <p className="truncate font-mono text-meta text-text-faint">{domain}</p>
      </Link>

      <span className="hidden shrink-0 items-center gap-1 text-meta text-text-muted sm:inline-flex">
        {monitor.mode === 'archive' ? <Archive className="size-3" /> : <Eye className="size-3" />}
        {FREQ_LABEL[monitor.check_frequency] ?? monitor.check_frequency}
      </span>

      <span className="hidden shrink-0 text-meta text-text-muted md:inline">
        {timeAgo(monitor.last_checked_at)}
      </span>

      <span className="hidden shrink-0 lg:inline">
        {monitor.openAlertCount > 0 ? (
          <Badge tone="critical" size="sm">
            {monitor.openAlertCount} open
          </Badge>
        ) : (
          <span className="text-meta text-text-faint">No changes</span>
        )}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label={`Actions for ${monitor.name}`} size="sm" disabled={isPending}>
            <MoreHorizontal className="size-4" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={runNow} disabled={!monitor.is_active}>
            <Play className="size-3.5" /> Run now
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={togglePause}>
            {monitor.is_active ? 'Pause' : 'Resume'}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/urls/${monitor.id}`}>
              <Settings className="size-3.5" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="danger" onSelect={remove}>
            <Trash2 className="size-3.5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PanelRow>
  )
}
