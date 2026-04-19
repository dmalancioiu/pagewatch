'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2,
  BellRing,
  Calendar,
  Globe,
  LogOut,
  Monitor,
  Settings,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/dashboard',            label: 'Overview',   icon: BarChart2 },
  { href: '/dashboard/alerts',     label: 'Alerts',     icon: BellRing  },
  { href: '/dashboard/urls',       label: 'URLs',       icon: Globe     },
  { href: '/dashboard/schedules',  label: 'Schedules',  icon: Calendar  },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings  },
]

interface DashboardNavProps {
  domain:    string
  userEmail: string
}

export function DashboardNav({ domain, userEmail }: DashboardNavProps) {
  const pathname = usePathname()

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06] gap-3 shrink-0">
        <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-accent-600 to-accent-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
          <Monitor className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white tracking-tight leading-tight truncate">
            PageWatch
          </p>
          <p className="text-[11px] text-white/40 truncate mt-0.5">{domain}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-accent-400' : 'text-white/40 group-hover:text-white/70'
                }`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-white/70">{initials}</span>
          </div>
          <p className="flex-1 text-xs text-white/50 truncate">{userEmail}</p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-white/30 hover:text-white/80 transition-colors p-1"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
