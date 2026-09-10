'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ArrowLeft, Activity, ExternalLink, Pause, Play } from 'lucide-react'
import { triggerManualRun } from '@/lib/actions/run-now'
import { pauseMonitoredUrl } from '@/lib/actions/websites'
import { useToast } from '@/components/ui/ToastProvider'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from './StatusBadge'

type StatusVariant = 'healthy' | 'paused' | 'alert' | 'archive'

interface WorkspaceTopBarProps {
  name: string
  url: string
  statusVariant: StatusVariant
  lastChecked: string
  nextRun: string
  urlId: string
  isPaused: boolean
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * Sticky header for a monitor's detail page. Not currently wired into
 * `app/dashboard/urls/[id]/` (owned by another agent) — kept ready with the
 * same prop shape it always had, restyled onto tokens and the shared
 * primitives.
 */
export function WorkspaceTopBar({
  name,
  url,
  statusVariant,
  lastChecked,
  nextRun,
  urlId,
  isPaused,
}: WorkspaceTopBarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [runPending, startRun] = useTransition()
  const [pausePending, startPause] = useTransition()

  function handleRunNow() {
    startRun(async () => {
      const res = await triggerManualRun({ id: urlId })
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
      router.refresh()
    })
  }

  function handlePauseToggle() {
    startPause(async () => {
      const res = await pauseMonitoredUrl({ id: urlId, paused: !isPaused })
      if (!res.ok) {
        toast({ title: 'Could not update monitor', description: res.message, tone: 'error' })
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="sticky top-0 z-40 flex h-12 items-center gap-2.5 border-b border-border bg-panel px-4">
      <IconButton
        aria-label="Back to monitors"
        title="Back to monitors"
        size="sm"
        onClick={() => router.push('/dashboard/urls')}
      >
        <ArrowLeft className="size-3.5" />
      </IconButton>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex min-w-0 items-center gap-2">
        <span className="max-w-[220px] truncate text-ui-medium text-text">{name}</span>
        <StatusBadge variant={statusVariant} />
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex max-w-[200px] items-center gap-1 truncate font-mono text-meta text-text-faint hover:text-text-muted"
      >
        {getDomain(url)}
        <ExternalLink className="size-2.5 shrink-0" />
      </a>

      <div className="flex-1" />

      <div className="hidden items-center gap-3 border-l border-border pl-3 sm:flex">
        <div>
          <p className="text-meta leading-none text-text-faint">Last check</p>
          <p className="mt-0.5 text-ui-medium leading-none text-text">{lastChecked}</p>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div>
          <p className="text-meta leading-none text-text-faint">Next run</p>
          <p className="mt-0.5 text-ui-medium leading-none text-text">{nextRun}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Activity className="size-3" />}
          onClick={handleRunNow}
          disabled={isPaused || runPending}
        >
          {runPending ? 'Running…' : 'Run now'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
          onClick={handlePauseToggle}
          disabled={pausePending}
        >
          {pausePending ? '…' : isPaused ? 'Resume' : 'Pause'}
        </Button>
      </div>
    </div>
  )
}
