'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Monitor, LayoutDashboard, Bell, Globe, Settings, Plus, LogOut,
  ArrowUpRight, CircleHelp, BookOpen, CreditCard,
} from 'lucide-react'
import { useDashboard } from './DashboardShell'

const NAV = [
  { href: '/dashboard',          label: 'Overview',  icon: LayoutDashboard, exact: true },
  { href: '/dashboard/alerts',   label: 'Alerts',    icon: Bell },
  { href: '/dashboard/urls',     label: 'Monitors',  icon: Globe },
  { href: '/dashboard/settings', label: 'Settings',  icon: Settings },
]

const SECONDARY = [
  { href: '/dashboard/settings#billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings#help', label: 'Education', icon: BookOpen },
  { href: '/dashboard/settings#support', label: 'Help', icon: CircleHelp },
]

interface SidebarProps {
  domain:    string
  userEmail: string
  plan?:     'free' | 'pro' | 'agency'
}

function NavItem({ href, label, icon: Icon, active }: {
  href: string
  label: string
  icon: any
  active: boolean
}) {
  return (
    <Link
      href={href}
      style={{
        height: 31,
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '0 9px', borderRadius: 8,
        textDecoration: 'none', position: 'relative',
        color: active ? '#0F172A' : '#667085',
        background: active ? '#EEF4FF' : 'transparent',
        fontSize: 12, fontWeight: active ? 650 : 500,
        letterSpacing: '-0.005em',
      }}
    >
      {active && (
        <span aria-hidden style={{ position: 'absolute', left: -8, top: 7, bottom: 7, width: 3, borderRadius: 99, background: '#2563EB' }} />
      )}
      <Icon size={15} strokeWidth={active ? 2.1 : 1.85} style={{ color: active ? '#2563EB' : '#667085', flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </Link>
  )
}

export function Sidebar({ domain, userEmail, plan = 'free' }: SidebarProps) {
  const pathname = usePathname()
  const { openAddUrl } = useDashboard()

  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const displayEmail = userEmail || 'Account'

  return (
    <aside
      className="fixed inset-y-0 left-0 flex flex-col z-40 select-none"
      style={{
        width: 216,
        background: '#FBFCFF',
        borderRight: '1px solid #E6EAF0',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.9)',
      }}
    >
      <div style={{ height: 58, padding: '10px 12px 8px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 31, height: 31, borderRadius: 9,
          background: 'linear-gradient(180deg, #2F6DF6 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 8px 18px rgba(37,99,235,0.2)',
        }}>
          <Monitor size={16} style={{ color: '#FFFFFF' }} strokeWidth={2.2} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', lineHeight: 1, letterSpacing: '-0.018em', margin: 0 }}>
            PageWatch
          </p>
          <p style={{ fontSize: 10, fontWeight: 500, color: '#98A2B3', marginTop: 3, lineHeight: 1 }}>
            workspace
          </p>
        </div>
      </div>

      <div style={{ padding: '0 12px 12px', flexShrink: 0 }}>
        <button
          onClick={openAddUrl}
          style={{
            height: 36,
            width: '100%',
            border: 'none', borderRadius: 10,
            background: 'linear-gradient(180deg, #2F6DF6 0%, #2563EB 100%)',
            color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer',
            boxShadow: '0 8px 18px rgba(37,99,235,0.22), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <Plus size={14} strokeWidth={2.35} />
          Add monitor
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(({ href, label, icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return <NavItem key={href} href={href} label={label} icon={icon} active={active} />
          })}
        </nav>

        <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #EEF2F7' }}>
          <p style={{ padding: '0 9px 7px', fontSize: 9, fontWeight: 700, color: '#B7C0CE', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Account
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {SECONDARY.map(({ href, label, icon }) => (
              <NavItem key={href} href={href} label={label} icon={icon} active={pathname === href} />
            ))}
          </nav>
        </div>
      </div>

      {plan === 'free' && (
        <div style={{ padding: '0 12px 10px', flexShrink: 0 }}>
          <div style={{
            borderRadius: 13,
            border: '1px solid #E6EAF0',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            padding: 12,
            boxShadow: '0 6px 18px rgba(15,23,42,0.035)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#344054', margin: 0 }}>Free plan</p>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 0 4px rgba(37,99,235,0.1)' }} />
            </div>
            <p style={{ fontSize: 10, color: '#98A2B3', lineHeight: 1.45, margin: '0 0 10px' }}>
              3 monitors · daily checks
            </p>
            <Link
              href="/dashboard/settings#billing"
              style={{
                height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                borderRadius: 8,
                background: '#EFF6FF',
                border: '1px solid rgba(37,99,235,0.16)',
                color: '#2563EB', textDecoration: 'none',
                fontSize: 11, fontWeight: 700,
              }}
            >
              Upgrade
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      )}

      <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #EEF2F7', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 25, height: 25, borderRadius: '50%',
            background: '#EFF6FF', border: '1px solid rgba(37,99,235,0.16)',
            color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#475467', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayEmail}
            </p>
            {domain && <p style={{ fontSize: 9, color: '#B7C0CE', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{domain}</p>}
          </div>
          <form action="/api/auth/signout" method="post" style={{ flexShrink: 0 }}>
            <button
              type="submit"
              title="Sign out"
              style={{
                width: 24, height: 24, border: 'none', borderRadius: 7,
                background: 'transparent', color: '#98A2B3', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <LogOut size={13} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
