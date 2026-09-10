'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Eye, LayoutGrid, LogOut, Plus, Settings } from 'lucide-react'
import { useDashboard } from './DashboardShell'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Meter } from '@/components/ui/meter'
import { IconButton } from '@/components/ui/icon-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Feed', icon: Eye, exact: true },
  { href: '/dashboard/urls', label: 'Monitors', icon: LayoutGrid, exact: false },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

interface SidebarProps {
  domain: string
  userEmail: string
  /** Called after a nav link or the add-monitor action fires — closes the mobile Sheet. */
  onNavigate?: () => void
}

/**
 * Sidebar nav content. Rendered both as the static 224px column (≥860px) and
 * inside a `Sheet` for narrower viewports — see `DashboardShell`.
 */
export function Sidebar({ domain, userEmail, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { openAddUrl, entitlements, atMonitorLimit } = useDashboard()
  const { usage, limits, planName, planId } = entitlements

  function handleAddMonitor() {
    const opened = openAddUrl()
    if (opened) onNavigate?.()
  }

  return (
    <div className="flex h-full w-full flex-col bg-panel">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-accent text-accent-fg">
          <Eye className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-ui-medium leading-none text-text">PageWatch</p>
          <p className="mt-0.5 truncate text-meta leading-none text-text-faint">{domain || userEmail}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-3 pt-3">
        {atMonitorLimit ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="block">
                <Button className="w-full justify-center" size="sm" iconLeft={<Plus className="size-3.5" />} disabled>
                  Add monitor
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {planName} includes {limits.maxMonitors} monitors. Upgrade for more.
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            className="w-full justify-center"
            size="sm"
            iconLeft={<Plus className="size-3.5" />}
            onClick={handleAddMonitor}
          >
            Add monitor
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Dashboard">
        <ul className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-8 items-center gap-2 rounded px-2 text-ui transition-colors duration-120',
                    active
                      ? 'bg-accent-subtle font-medium text-accent'
                      : 'text-text-muted hover:bg-panel-raised hover:text-text'
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-border p-3">
        <Meter
          label="Monitors"
          value={usage.monitors}
          max={limits.maxMonitors}
          tone={atMonitorLimit ? 'warn' : 'accent'}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-meta text-text-muted">{planName} plan</span>
          {planId !== 'agency' && (
            <Link
              href="/dashboard/settings#billing"
              onClick={onNavigate}
              className="text-meta font-medium text-accent hover:underline"
            >
              Upgrade
            </Link>
          )}
        </div>
        <form action="/api/auth/signout" method="post" className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-meta text-text-faint">{userEmail || 'Account'}</span>
          <IconButton aria-label="Sign out" type="submit" size="sm">
            <LogOut className="size-3.5" />
          </IconButton>
        </form>
      </div>
    </div>
  )
}
