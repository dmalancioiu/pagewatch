'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, Plus } from 'lucide-react'
import { useDashboard } from './DashboardShell'
import { MonitorRow, type MonitorRowData } from './MonitorRow'
import { Panel, PanelFooter } from '@/components/ui/panel'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Status = 'attention' | 'healthy' | 'paused'
type Filter = 'all' | Status

function classify(monitor: MonitorRowData): Status {
  if (!monitor.is_active) return 'paused'
  if ((monitor.consecutive_failures ?? 0) > 0 || monitor.openAlertCount > 0) return 'attention'
  return 'healthy'
}

interface Props {
  monitors: MonitorRowData[]
}

export function MonitorsPageClient({ monitors }: Props) {
  const { openAddUrl, atMonitorLimit, entitlements } = useDashboard()
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(() => {
    const c = { attention: 0, healthy: 0, paused: 0 }
    for (const m of monitors) c[classify(m)]++
    return c
  }, [monitors])

  const filtered = filter === 'all' ? monitors : monitors.filter((m) => classify(m) === filter)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-page-title text-text">Monitors</h1>
          <span className="text-meta text-text-faint">{monitors.length}</span>
        </div>
        {atMonitorLimit ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" iconLeft={<Plus className="size-3.5" />} disabled>
                  Add monitor
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {entitlements.planName} includes {entitlements.limits.maxMonitors} monitors — Upgrade
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button size="sm" iconLeft={<Plus className="size-3.5" />} onClick={() => openAddUrl()}>
            Add monitor
          </Button>
        )}
      </div>

      {monitors.length > 0 && (
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All {monitors.length}</TabsTrigger>
            <TabsTrigger value="attention">Needs attention {counts.attention}</TabsTrigger>
            <TabsTrigger value="healthy">Healthy {counts.healthy}</TabsTrigger>
            <TabsTrigger value="paused">Paused {counts.paused}</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {monitors.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid className="size-4" />}
          title="No monitors yet"
          description="Add a URL and PageWatch takes a baseline screenshot right away."
          action={
            <Button size="sm" onClick={() => openAddUrl()}>
              Add monitor
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing here" description="No monitors match this filter." />
      ) : (
        <Panel>
          {filtered.map((monitor) => (
            <MonitorRow key={monitor.id} monitor={monitor} />
          ))}
          <PanelFooter>{filtered.length} monitor{filtered.length === 1 ? '' : 's'}</PanelFooter>
        </Panel>
      )}
    </div>
  )
}
