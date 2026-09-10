'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { AddUrlModal } from './AddUrlModal'
import { FirstScreenshotModal } from './FirstScreenshotModal'
import { IconButton } from '@/components/ui/icon-button'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { ClientEntitlements } from '@/lib/entitlements'
import type { FeatureKey } from '@/lib/plans'

/**
 * Dashboard shell — layout chrome plus the two pieces of state every dashboard
 * page needs: the "add monitor" flow, and the workspace's entitlements.
 *
 * Entitlements are resolved once on the server (in the dashboard layout) and
 * passed down here, so client components can gate UI without each one making
 * its own round trip. This is presentation only — the server actions enforce
 * the same limits independently.
 */

interface DashboardCtxValue {
  /** Opens the add-monitor modal, or returns false when the plan is full. */
  openAddUrl: () => boolean
  entitlements: ClientEntitlements
  /** True when the plan includes a given capability. */
  can: (feature: FeatureKey) => boolean
  /** True when adding another monitor would exceed the plan. */
  atMonitorLimit: boolean
}

const DashboardCtx = createContext<DashboardCtxValue | null>(null)

/**
 * Access the dashboard context. Throws outside the shell rather than handing
 * back a silent default that would make a gated feature look available.
 */
export function useDashboard(): DashboardCtxValue {
  const ctx = useContext(DashboardCtx)
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardShell>')
  return ctx
}

/** Convenience hook for components that only care about the plan. */
export function useEntitlements(): ClientEntitlements {
  return useDashboard().entitlements
}

interface DashboardShellProps {
  children: React.ReactNode
  workspaceId: string
  domain: string
  userEmail: string
  entitlements: ClientEntitlements
}

export function DashboardShell({
  children,
  workspaceId,
  domain,
  userEmail,
  entitlements,
}: DashboardShellProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [createdMonitor, setCreatedMonitor] = useState<{ id: string; name: string } | null>(
    null
  )

  const atMonitorLimit = entitlements.remaining.monitors <= 0

  const openAddUrl = useCallback(() => {
    if (atMonitorLimit) return false
    setAddOpen(true)
    return true
  }, [atMonitorLimit])

  const can = useCallback(
    (feature: FeatureKey) => entitlements.features[feature],
    [entitlements.features]
  )

  const value = useMemo<DashboardCtxValue>(
    () => ({ openAddUrl, entitlements, can, atMonitorLimit }),
    [openAddUrl, entitlements, can, atMonitorLimit]
  )

  function handleCreated(urlId: string, name = '') {
    setAddOpen(false)
    setCreatedMonitor({ id: urlId, name })
  }

  return (
    <DashboardCtx.Provider value={value}>
      <div className="flex min-h-screen bg-bg">
        {/* Static sidebar — design system §4: 224px, hairline right border. */}
        <aside className="hidden w-56 shrink-0 border-r border-border min-[860px]:flex">
          <Sidebar domain={domain} userEmail={userEmail} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar — the sidebar collapses below 860px into a Sheet. */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-panel px-3 min-[860px]:hidden">
            <IconButton aria-label="Open navigation" onClick={() => setNavOpen(true)}>
              <Menu className="size-4" />
            </IconButton>
            <span className="text-ui-medium text-text">PageWatch</span>
          </div>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="max-w-[224px] gap-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Dashboard navigation</SheetDescription>
          <Sidebar domain={domain} userEmail={userEmail} onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      {addOpen && (
        <AddUrlModal
          workspaceId={workspaceId}
          onClose={() => setAddOpen(false)}
          onCreated={(urlId) => handleCreated(urlId)}
        />
      )}

      {createdMonitor && (
        <FirstScreenshotModal
          urlId={createdMonitor.id}
          urlName={createdMonitor.name}
          onClose={() => setCreatedMonitor(null)}
          onAdjust={() => {
            setCreatedMonitor(null)
            setAddOpen(true)
          }}
        />
      )}
    </DashboardCtx.Provider>
  )
}
