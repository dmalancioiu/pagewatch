'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarClock,
  ChevronsUpDown,
  Eye,
  LayoutGrid,
  LogOut,
  Plus,
  Settings,
  Users,
  Webhook,
  Zap,
} from 'lucide-react'
import { useDashboard } from './DashboardShell'

const WORKSPACE = [
  { href: '/dashboard/settings#team', label: 'Team', icon: Users },
  { href: '/dashboard/settings#integrations', label: 'Integrations', icon: Webhook },
  { href: '/dashboard/settings#reports', label: 'Reports', icon: CalendarClock },
]

interface SidebarProps {
  domain: string
  userEmail: string
  plan?: 'free' | 'pro' | 'agency'
  activeMonitorCount?: number
  totalMonitorCount?: number
  monitorLimit?: number
}

function NavItem({ href, label, icon: Icon, active, badge, badgeTone }: {
  href: string
  label: string
  icon: any
  active: boolean
  badge?: string | number
  badgeTone?: string
}) {
  return (
    <Link
      href={href}
      className="pw-side-nav-item"
      style={{
        background: active ? '#EFF6FF' : 'transparent',
        color: active ? '#2563EB' : '#6B7280',
        fontWeight: active ? 650 : 500,
      }}
    >
      {active && <span className="pw-side-active-bar" />}
      <Icon size={14} strokeWidth={1.9} style={{ color: active ? '#2563EB' : undefined, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {badge !== undefined && badge !== null && <span className={`pw-side-badge ${badgeTone === 'red' ? 'red' : 'gray'}`}>{badge}</span>}
    </Link>
  )
}

export function Sidebar({
  domain,
  userEmail,
  plan = 'free',
  activeMonitorCount = 0,
  totalMonitorCount = 0,
  monitorLimit = 3,
}: SidebarProps) {
  const pathname = usePathname()
  const { openAddUrl } = useDashboard()
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const displayEmail = userEmail || 'Account'
  const activeLabel = `${activeMonitorCount} monitor${activeMonitorCount === 1 ? '' : 's'} active`

  const nav = [
    { href: '/dashboard', label: 'Feed', icon: Zap, exact: true },
    { href: '/dashboard/urls', label: 'Monitors', icon: LayoutGrid, badge: totalMonitorCount, badgeTone: 'gray' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="pw-side">
      <div className="pw-side-logo">
        <div className="pw-side-logo-icon"><Eye size={14} style={{ color: 'white' }} strokeWidth={2.3} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 760, color: '#111827', letterSpacing: '-0.025em', lineHeight: 1, margin: 0 }}>PageWatch</p>
          <p style={{ fontSize: 9.5, color: '#9CA3AF', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayEmail}</p>
        </div>
        <button className="pw-side-signout" type="button" title={domain || 'Workspace'}><ChevronsUpDown size={12} /></button>
      </div>

      <div className="pw-side-cta">
        <button className="pw-side-primary" onClick={openAddUrl}><Plus size={13} strokeWidth={2.4} /> Add monitor</button>
      </div>

      <nav className="pw-side-nav">
        {nav.map(({ href, label, icon, exact, badge, badgeTone }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return <NavItem key={href} href={href} label={label} icon={icon} active={active} badge={badge} badgeTone={badgeTone} />
        })}
        <p className="pw-side-section-label">Workspace</p>
        {WORKSPACE.map(({ href, label, icon }) => <NavItem key={href} href={href} label={label} icon={icon} active={pathname === href} />)}
      </nav>

      <div className="pw-side-bottom">
        <div className="pw-side-status">
          <span className="pw-live-dot" />
          <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{activeLabel}</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9CA3AF' }}>{activeMonitorCount > 0 ? 'Live' : 'Idle'}</span>
        </div>
        <div className="pw-side-account">
          <div className="pw-side-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11.5, fontWeight: 550, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{plan === 'free' ? 'Free plan' : `${plan} plan`}</p>
            <p style={{ fontSize: 9.5, color: '#9CA3AF', margin: 0 }}>{totalMonitorCount} / {monitorLimit} monitors used</p>
          </div>
          {plan === 'free' ? <Link href="/dashboard/settings#billing" className="pw-side-upgrade">Upgrade</Link> : null}
          <form action="/api/auth/signout" method="post" style={{ flexShrink: 0 }}>
            <button type="submit" className="pw-side-signout" title="Sign out"><LogOut size={12} /></button>
          </form>
        </div>
      </div>
    </aside>
  )
}
