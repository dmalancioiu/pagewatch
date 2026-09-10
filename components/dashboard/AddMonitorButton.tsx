'use client'

import { Plus } from 'lucide-react'
import { useDashboard } from './DashboardShell'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/** Standalone "Add monitor" trigger — plan-gated with a Tooltip, never silently hidden. */
export function AddMonitorButton() {
  const { openAddUrl, atMonitorLimit, entitlements } = useDashboard()

  if (!atMonitorLimit) {
    return (
      <Button size="sm" iconLeft={<Plus className="size-3.5" />} onClick={() => openAddUrl()}>
        Add monitor
      </Button>
    )
  }

  return (
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
  )
}
