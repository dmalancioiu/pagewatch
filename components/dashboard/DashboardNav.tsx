'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, BellRing, Calendar, Globe, LogOut, Monitor, Settings } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: BarChart2 },
  { href: '/dashboard/alerts', label: 'Alerts', icon: BellRing },
  { href: '/dashboard/urls', label: 'URLs', icon: Globe },
  { href: '/dashboard/schedules', label: 'Schedules', icon: Calendar },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface DashboardNavProps {
  domain: string
  userEmail: string
}

/**
 * A plain nav column, kept token-driven. Not currently mounted anywhere
 * (`Sidebar` is what `DashboardShell` renders) — see report for context.
 */
export function DashboardNav({ domain, userEmail }: DashboardNavProps) {
  const pathname = usePathname()
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'

  return (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border px-4">
        <div className="flex size-6 items-center justify-center rounded bg-accent text-accent-fg">
          <Monitor className="size-3.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-ui-medium leading-none text-text">PageWatch</p>
          <p className="mt-0.5 truncate text-meta leading-none text-text-faint">{domain}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex h-8 items-center gap-2 rounded px-2 text-ui transition-colors duration-120',
                isActive ? 'bg-accent-subtle font-medium text-accent' : 'text-text-muted hover:bg-panel-raised hover:text-text'
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2 rounded px-2 py-1.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-bg-subtle">
            <span className="text-[10px] font-medium text-text-muted">{initials}</span>
          </div>
          <p className="flex-1 truncate text-meta text-text-muted">{userEmail}</p>
          <form action="/api/auth/signout" method="post">
            <IconButton aria-label="Sign out" type="submit" size="sm">
              <LogOut className="size-3.5" />
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  )
}
