import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { Bell, Activity, ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/dashboard/StatusBadge'

export const metadata = { title: 'Alerts — PageWatch' }

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function diffColor(pct: number | null): { color: string; bg: string } {
  if (!pct || pct < 10) return { color: '#16A34A', bg: 'rgba(22,163,74,0.08)' }
  if (pct < 25) return { color: '#B45309', bg: 'rgba(180,83,9,0.08)' }
  if (pct < 50) return { color: '#C2410C', bg: 'rgba(194,65,12,0.08)' }
  return { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' }
}

export default async function AlertsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*, monitored_urls(name, url)')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  const safeAlerts = alerts ?? []
  const openCount = safeAlerts.filter((a: any) => a.status === 'open').length

  return (
    <div className="dash-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
          Alerts
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', background: 'white',
            border: '1px solid #E5E7EB', borderRadius: 6,
            fontSize: 11, fontWeight: 600, color: '#6B7280',
          }}>
            <Bell size={11} style={{ color: '#9CA3AF' }} />
            {safeAlerts.length} total
          </span>
          {openCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', background: '#FEF2F2',
              border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6,
              fontSize: 11, fontWeight: 700, color: '#DC2626',
            }}>
              {openCount} open
            </span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {safeAlerts.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 8, border: '1px solid #E5E7EB',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#F3F4F6', border: '1px solid #E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Activity size={16} style={{ color: '#D1D5DB' }} />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 5 }}>No alerts yet</h2>
          <p style={{ fontSize: 11, color: '#9CA3AF', maxWidth: 260, lineHeight: 1.6 }}>
            Once a monitored page has a visual change, the AI analysis and diff will appear here.
          </p>
        </div>
      ) : (
        /* Flat alerts table */
        <div style={{
          background: 'white', border: '1px solid #E5E7EB',
          borderRadius: 8, overflow: 'hidden',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr 60px 180px 70px 20px',
            padding: '8px 14px',
            background: '#FAFAFA',
            borderBottom: '1px solid #F3F4F6',
          }}>
            {['Status', 'Monitor', 'Diff%', 'Summary', 'Time', ''].map((h, i) => (
              <span key={i} style={{
                fontSize: 9, fontWeight: 700, color: '#D1D5DB',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {h}
              </span>
            ))}
          </div>

          {safeAlerts.map((alert: any, idx: number) => {
            const isOpen = alert.status === 'open'
            const isLast = idx === safeAlerts.length - 1
            const dc = diffColor(alert.diff_pct)
            let domain = alert.monitored_urls?.url ?? ''
            try { domain = new URL(domain).hostname } catch {}

            return (
              <Link
                key={alert.id}
                href={`/dashboard/urls/${alert.monitored_url_id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr 60px 180px 70px 20px',
                  alignItems: 'center',
                  padding: '9px 14px',
                  borderBottom: isLast ? 'none' : '1px solid #F9FAFB',
                  textDecoration: 'none',
                  transition: 'background 0.1s',
                  opacity: isOpen ? 1 : 0.65,
                }}
                className="monitor-row"
              >
                {/* Status */}
                <div>
                  <StatusBadge variant={isOpen ? 'open' : 'acknowledged'} />
                </div>

                {/* Monitor */}
                <div style={{ minWidth: 0, paddingRight: 8 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 600, color: '#374151',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 1,
                  }}>
                    {alert.monitored_urls?.name ?? 'Unknown'}
                  </p>
                  <p style={{
                    fontSize: 10, color: '#9CA3AF', fontFamily: 'ui-monospace,monospace',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {domain}
                  </p>
                </div>

                {/* Diff% */}
                <div>
                  {alert.diff_pct != null ? (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: dc.color, background: dc.bg,
                      padding: '2px 6px', borderRadius: 4,
                      display: 'inline-block',
                    }}>
                      {Number(alert.diff_pct).toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: '#D1D5DB' }}>—</span>
                  )}
                </div>

                {/* Summary */}
                <div style={{ minWidth: 0, paddingRight: 8 }}>
                  {alert.ai_summary ? (
                    <p style={{
                      fontSize: 11, color: isOpen ? '#374151' : '#9CA3AF', lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden', margin: 0,
                    }}>
                      {alert.ai_summary}
                    </p>
                  ) : (
                    <span style={{ fontSize: 10, color: '#D1D5DB' }}>Visual change detected</span>
                  )}
                </div>

                {/* Time */}
                <div>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>{timeAgo(alert.created_at)}</span>
                </div>

                {/* Arrow */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ChevronRight size={12} style={{ color: '#D1D5DB' }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
