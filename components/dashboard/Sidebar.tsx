'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Monitor, LayoutDashboard, Bell, Globe, Settings, Plus, LogOut, ArrowUpRight } from 'lucide-react'
import { useDashboard } from './DashboardShell'

const NAV = [
  { href: '/dashboard',          label: 'Overview',  icon: LayoutDashboard, exact: true },
  { href: '/dashboard/alerts',   label: 'Alerts',    icon: Bell },
  { href: '/dashboard/urls',     label: 'Monitors',  icon: Globe },
  { href: '/dashboard/settings', label: 'Settings',  icon: Settings },
]

interface SidebarProps {
  domain:    string
  userEmail: string
  plan?:     'free' | 'pro' | 'agency'
}

export function Sidebar({ domain, userEmail, plan = 'free' }: SidebarProps) {
  const pathname        = usePathname()
  const { openAddUrl }  = useDashboard()

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside
      className="fixed inset-y-0 left-0 flex flex-col z-40 select-none"
      style={{
        width: '220px',
        background: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
      }}
    >
      {/* Logo */}
      <div
        className="h-14 flex items-center gap-2.5 px-4 flex-shrink-0"
        style={{ borderBottom: '1px solid #F3F4F6' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#2563EB' }}
        >
          <Monitor className="w-4 h-4" style={{ color: '#FFFFFF' }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight leading-none" style={{ color: '#111827' }}>
            PageWatch
          </p>
          {domain && (
            <p className="text-[10px] mt-0.5 truncate" style={{ color: '#9CA3AF' }}>
              {domain}
            </p>
          )}
        </div>
      </div>

      {/* Add monitor button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={openAddUrl}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: '#2563EB',
            color: '#FFFFFF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1D4ED8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2563EB'
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add monitor
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`dash-nav-item${active ? ' active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade card */}
      {plan === 'free' && (
        <div
          className="mx-3 mb-3 p-3 rounded-xl"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
        >
          <p className="text-xs font-semibold mb-0.5" style={{ color: '#374151' }}>Free plan</p>
          <p className="text-[11px] mb-2.5" style={{ color: '#9CA3AF' }}>
            3 monitors · daily checks
          </p>
          <Link
            href="/dashboard/settings#billing"
            className="flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg transition-colors"
            style={{ background: '#2563EB', color: '#FFFFFF' }}
          >
            Upgrade
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* User */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: '1px solid #F3F4F6' }}
      >
        <div
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg group transition-colors cursor-default"
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
            style={{
              background: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid rgba(37,99,235,0.2)',
            }}
          >
            {initials}
          </div>
          <p className="flex-1 text-xs truncate" style={{ color: '#6B7280' }}>
            {userEmail}
          </p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              title="Sign out"
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#6B7280')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
