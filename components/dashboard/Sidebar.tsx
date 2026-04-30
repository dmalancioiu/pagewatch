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

const NAV = [
  { href: '/dashboard', label: 'Feed', icon: Zap, exact: true, badge: '3', badgeTone: 'red' },
  { href: '/dashboard/urls', label: 'Monitors', icon: LayoutGrid, badge: '6', badgeTone: 'gray' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const WORKSPACE = [
  { href: '/dashboard/settings#team', label: 'Team', icon: Users },
  { href: '/dashboard/settings#integrations', label: 'Integrations', icon: Webhook },
  { href: '/dashboard/settings#reports', label: 'Reports', icon: CalendarClock },
]

interface SidebarProps {
  domain: string
  userEmail: string
  plan?: 'free' | 'pro' | 'agency'
}

function NavItem({ href, label, icon: Icon, active, badge, badgeTone }: {
  href: string
  label: string
  icon: any
  active: boolean
  badge?: string
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
      {badge && <span className={`pw-side-badge ${badgeTone === 'red' ? 'red' : 'gray'}`}>{badge}</span>}
    </Link>
  )
}

export function Sidebar({ domain, userEmail, plan = 'free' }: SidebarProps) {
  const pathname = usePathname()
  const { openAddUrl } = useDashboard()
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const displayEmail = userEmail || 'Account'
  const activeCount = 6

  return (
    <aside className="pw-side">
      <style jsx global>{`
        .pw-side{position:fixed;top:0;left:0;bottom:0;width:208px;background:#fff;border-right:1px solid #E5E7EB;display:flex;flex-direction:column;z-index:50;user-select:none;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pw-side-logo{height:52px;padding:0 14px;display:flex;align-items:center;gap:9px;flex-shrink:0;border-bottom:1px solid #F3F4F6}.pw-side-logo-icon{width:28px;height:28px;border-radius:8px;background:#2563EB;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(37,99,235,.3)}.pw-side-cta{padding:10px 12px;flex-shrink:0}.pw-side-primary{width:100%;height:34px;border-radius:9px;border:0;background:#2563EB;color:#fff;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12px;font-weight:600;letter-spacing:-.01em;box-shadow:0 2px 10px rgba(37,99,235,.24),inset 0 1px 0 rgba(255,255,255,.14);cursor:pointer}.pw-side-primary:hover{background:#1D4ED8;box-shadow:0 4px 14px rgba(37,99,235,.32)}.pw-side-nav{flex:1;overflow-y:auto;padding:6px 8px 0;display:flex;flex-direction:column;gap:1px}.pw-side-nav-item{display:flex;align-items:center;gap:9px;height:32px;padding:0 8px;border-radius:8px;font-size:12.5px;text-decoration:none;position:relative;transition:background .1s,color .1s}.pw-side-nav-item:hover{background:#F9FAFB;color:#111827}.pw-side-active-bar{position:absolute;left:-8px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#2563EB}.pw-side-badge{margin-left:auto;min-width:18px;height:16px;border-radius:99px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 4px}.pw-side-badge.red{background:rgba(239,68,68,.1);color:#EF4444}.pw-side-badge.gray{background:#F3F4F6;color:#6B7280}.pw-side-section-label{padding:12px 8px 4px;font-size:9.5px;font-weight:800;color:#D1D5DB;text-transform:uppercase;letter-spacing:.1em;margin:0}@keyframes pwSidePulse{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,.45)}50%{box-shadow:0 0 0 4px rgba(22,163,74,0)}}.pw-live-dot{width:7px;height:7px;border-radius:50%;background:#16A34A;animation:pwSidePulse 2.5s ease infinite}.pw-side-bottom{flex-shrink:0;border-top:1px solid #F3F4F6}.pw-side-status{padding:10px 14px;display:flex;align-items:center;gap:7px;border-bottom:1px solid #F3F4F6}.pw-side-account{padding:10px 12px;display:flex;align-items:center;gap:8px}.pw-side-avatar{width:24px;height:24px;border-radius:99px;background:#EFF6FF;border:1px solid rgba(37,99,235,.18);color:#2563EB;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:780;flex-shrink:0}.pw-side-upgrade{font-size:10.5px;font-weight:700;color:#2563EB;background:#EFF6FF;padding:3px 8px;border-radius:99px;border:1px solid rgba(37,99,235,.16);text-decoration:none}.pw-side-signout{width:22px;height:22px;border:0;border-radius:5px;background:transparent;color:#9CA3AF;display:flex;align-items:center;justify-content:center;cursor:pointer}.pw-side-signout:hover{background:#F3F4F6}
      `}</style>
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
        {NAV.map(({ href, label, icon, exact, badge, badgeTone }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return <NavItem key={href} href={href} label={label} icon={icon} active={active} badge={badge} badgeTone={badgeTone} />
        })}
        <p className="pw-side-section-label">Workspace</p>
        {WORKSPACE.map(({ href, label, icon }) => <NavItem key={href} href={href} label={label} icon={icon} active={pathname === href} />)}
      </nav>

      <div className="pw-side-bottom">
        <div className="pw-side-status">
          <span className="pw-live-dot" />
          <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{activeCount} monitors active</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9CA3AF' }}>Live</span>
        </div>
        <div className="pw-side-account">
          <div className="pw-side-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11.5, fontWeight: 550, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{plan === 'free' ? 'Free plan' : `${plan} plan`}</p>
            <p style={{ fontSize: 9.5, color: '#9CA3AF', margin: 0 }}>3 / 3 monitors used</p>
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
