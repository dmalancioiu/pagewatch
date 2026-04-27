import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { Bell, Activity, ChevronRight, Gauge } from 'lucide-react'
import { StatusBadge } from '@/components/dashboard/StatusBadge'

export const metadata = { title: 'Alerts — PageWatch' }

type ZoneScore = {
  label?: string
  instruction?: string | null
  sensitivity?: 'low' | 'normal' | 'high'
  diff_pct?: number
  alert_score?: number
  passes_threshold?: boolean
}

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

function scoreColor(score: number): { color: string; bg: string; border: string } {
  if (score >= 85) return { color: '#B91C1C', bg: 'rgba(185,28,28,0.08)', border: 'rgba(185,28,28,0.2)' }
  if (score >= 65) return { color: '#C2410C', bg: 'rgba(194,65,12,0.08)', border: 'rgba(194,65,12,0.18)' }
  if (score >= 35) return { color: '#B45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.18)' }
  return { color: '#2563EB', bg: 'rgba(37,99,235,0.07)', border: 'rgba(37,99,235,0.18)' }
}

function alertScore(alert: any): number {
  return Number(alert.metadata?.alert_score ?? 0)
}

function zoneScores(alert: any): ZoneScore[] {
  return Array.isArray(alert.metadata?.zone_scores) ? alert.metadata.zone_scores : []
}

function topZone(alert: any): ZoneScore | null {
  const scores = zoneScores(alert)
  if (scores.length === 0) return null
  return [...scores].sort((a, b) => Number(b.alert_score ?? 0) - Number(a.alert_score ?? 0))[0] ?? null
}

function sortedAlerts(alerts: any[]): any[] {
  return [...alerts].sort((a, b) => {
    const aOpen = a.status === 'open' ? 1 : 0
    const bOpen = b.status === 'open' ? 1 : 0
    if (aOpen !== bOpen) return bOpen - aOpen

    const scoreDelta = alertScore(b) - alertScore(a)
    if (scoreDelta !== 0) return scoreDelta

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
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

  const safeAlerts = sortedAlerts(alerts ?? [])
  const openCount = safeAlerts.filter((a: any) => a.status === 'open').length
  const topScore = safeAlerts.reduce((max: number, a: any) => Math.max(max, alertScore(a)), 0)

  return (
    <div className="dash-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            Alerts
          </h1>
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>
            Ranked by relevance score, then newest first.
          </p>
        </div>
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
          {topScore > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', background: 'rgba(37,99,235,0.07)',
              border: '1px solid rgba(37,99,235,0.18)', borderRadius: 6,
              fontSize: 11, fontWeight: 700, color: '#2563EB',
            }}>
              <Gauge size={11} /> Top {topScore.toFixed(0)}
            </span>
          )}
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
        <div style={{
          background: 'white', border: '1px solid #E5E7EB',
          borderRadius: 8, overflow: 'hidden',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr 74px 66px minmax(220px, 360px) 70px 20px',
            padding: '8px 14px',
            background: '#FAFAFA',
            borderBottom: '1px solid #F3F4F6',
          }}>
            {['Status', 'Monitor', 'Score', 'Diff%', 'Summary', 'Time', ''].map((h, i) => (
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
            const score = alertScore(alert)
            const sc = scoreColor(score)
            const zone = topZone(alert)
            const passedCount = Number(alert.metadata?.passed_zone_count ?? 0)
            let domain = alert.monitored_urls?.url ?? ''
            try { domain = new URL(domain).hostname } catch {}

            return (
              <Link
                key={alert.id}
                href={`/dashboard/urls/${alert.monitored_url_id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr 74px 66px minmax(220px, 360px) 70px 20px',
                  alignItems: 'center',
                  padding: '10px 14px',
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
                <div style={{ minWidth: 0, paddingRight: 10 }}>
                  <p style={{
                    fontSize: 12, fontWeight: 600, color: '#374151',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 2,
                  }}>
                    {alert.monitored_urls?.name ?? 'Unknown'}
                  </p>
                  <p style={{
                    fontSize: 10, color: '#9CA3AF', fontFamily: 'ui-monospace,monospace',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: zone ? 3 : 0,
                  }}>
                    {domain}
                  </p>
                  {zone && (
                    <p style={{
                      fontSize: 10, color: '#6B7280',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      Top zone: <strong style={{ color: '#374151' }}>{zone.label ?? 'Zone'}</strong>
                      {passedCount > 1 ? ` + ${passedCount - 1} more` : ''}
                    </p>
                  )}
                </div>

                {/* Relevance score */}
                <div>
                  {score > 0 ? (
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      color: sc.color, background: sc.bg,
                      border: `1px solid ${sc.border}`,
                      padding: '2px 7px', borderRadius: 99,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {score.toFixed(0)}
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: '#D1D5DB' }}>—</span>
                  )}
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
                <div style={{ minWidth: 0, paddingRight: 10 }}>
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
                  ) : zone ? (
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                      {zone.label ?? 'Zone'} changed {Number(zone.diff_pct ?? 0).toFixed(1)}%
                    </span>
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
