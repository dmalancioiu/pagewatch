'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Monitor, LayoutDashboard, Bell, Globe, Settings, Plus, LogOut, Zap, Sun, Moon } from 'lucide-react'
import { useDashboard } from './DashboardShell'

const NAV = [
  { href: '/dashboard',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/alerts',   label: 'Alerts',    icon: Bell },
  { href: '/dashboard/urls',     label: 'URLs',      icon: Globe },
  { href: '/dashboard/settings', label: 'Settings',  icon: Settings },
]

interface SidebarProps {
  domain:    string
  userEmail: string
  plan?:     'free' | 'pro' | 'agency'
}

export function Sidebar({ domain, userEmail, plan = 'free' }: SidebarProps) {
  const pathname                       = usePathname()
  const { openAddUrl, theme, toggleTheme } = useDashboard()
  const isLight = theme === 'light'

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside
      className="fixed inset-y-0 left-0 w-56 flex flex-col z-40 select-none"
      style={{
        background:  isLight ? '#ffffff' : '#0c0c0c',
        borderRight: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="h-14 flex items-center gap-2.5 px-4 flex-shrink-0"
        style={{ borderBottom: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.055)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#00ff88' }}
        >
          <Monitor className="w-4 h-4" style={{ color: '#0a0a0a' }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight leading-none" style={{ color: 'var(--text-primary, white)' }}>PageWatch</p>
          {domain && (
            <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-dim, rgba(255,255,255,0.3))' }}>
              {domain}
            </p>
          )}
        </div>
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{
            background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)',
            color:      isLight ? 'rgba(0,0,0,0.5)'  : 'rgba(255,255,255,0.45)',
          }}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Add URL button */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={openAddUrl}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: '#00ff88',
            color: '#0a0a0a',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2dffaa'
            e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#00ff88'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add URL
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
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
              {label === 'Alerts' && (
                /* alert count badge — server passes count via DOM, no prop needed */
                <span id="sidebar-alert-count" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      {plan === 'free' && (
        <div
          className="mx-3 mb-3 p-3 rounded-xl"
          style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5" style={{ color: '#00ff88' }} />
            <span className="text-xs font-semibold" style={{ color: '#00ff88' }}>Free plan</span>
          </div>
          <p className="text-[11px] mb-2.5" style={{ color: 'var(--text-muted)' }}>
            3 URLs · daily checks
          </p>
          <Link
            href="/dashboard/settings#billing"
            className="block text-center text-[11px] font-semibold py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88' }}
          >
            Upgrade to Pro →
          </Link>
        </div>
      )}

      {/* User */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.055)' }}
      >
        <div
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg group transition-colors"
          style={{ ['--hover-bg' as any]: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
            style={{
              background: 'rgba(0,255,136,0.15)',
              color: '#00ff88',
              border: '1px solid rgba(0,255,136,0.2)',
            }}
          >
            {initials}
          </div>
          <p className="flex-1 text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {userEmail}
          </p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              title="Sign out"
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-dim)' }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
