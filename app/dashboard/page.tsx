import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { getAlerts } from '@/lib/actions/alerts'
import { createServerClient } from '@/lib/supabase/server'
import {
  Globe, ArrowRight, AlertTriangle, Activity, Archive, Eye, Sparkles,
} from 'lucide-react'
import { AddMonitorButton } from '@/components/dashboard/AddMonitorButton'
import { MonitorRow } from '@/components/dashboard/MonitorRow'

export const metadata = { title: 'Overview — PageWatch' }

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

export default async function DashboardPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()

  const [urls, openAlerts] = await Promise.all([
    getMonitoredUrls(workspace.id),
    getAlerts(workspace.id, 'open'),
  ])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { count: checksToday },
    { data: recentAlertsRaw },
  ] = await Promise.all([
    supabase.from('screenshot_snapshots').select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id).gte('taken_at', todayStart.toISOString()),
    supabase.from('alerts')
      .select('id, diff_pct, ai_summary, created_at, status, monitored_url_id, monitored_urls(name, url, mode)')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const recentAlerts = recentAlertsRaw ?? []

  const alertCountMap = new Map<string, number>()
  for (const a of openAlerts as any[]) {
    alertCountMap.set(a.monitored_url_id, (alertCountMap.get(a.monitored_url_id) ?? 0) + 1)
  }

  const lastAlertMap = new Map<string, any>()
  for (const a of recentAlerts) {
    if (!lastAlertMap.has((a as any).monitored_url_id)) {
      lastAlertMap.set((a as any).monitored_url_id, a)
    }
  }

  const activeMonitors = urls.filter((u: any) => u.is_active).length
  const openAlertCount = (openAlerts as any[]).length
  const hasUrls = urls.length > 0

  const sortedOpen = [...(openAlerts as any[])].sort((a, b) => (b.diff_pct ?? 0) - (a.diff_pct ?? 0))

  return (
    <div className="dash-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
          Overview
        </h1>
        {hasUrls && <AddMonitorButton />}
      </div>

      {/* Metric pills */}
      {hasUrls && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <MetricPill label="Monitors" value={urls.length} />
          <MetricPill label="Active" value={activeMonitors} accent />
          <MetricPill label="Open Alerts" value={openAlertCount} danger={openAlertCount > 0} />
          <MetricPill label="Checks Today" value={checksToday ?? 0} />
        </div>
      )}

      {/* Open alerts banner */}
      {openAlertCount > 0 && (
        <div style={{
          background: 'rgba(254,242,242,0.6)',
          border: '1px solid rgba(220,38,38,0.18)',
          borderRadius: 8, padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <AlertTriangle size={13} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>
              {openAlertCount} open alert{openAlertCount !== 1 ? 's' : ''} need attention
            </span>
            <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
              {sortedOpen.slice(0, 3).map((a: any) => (
                <Link key={a.id} href={`/dashboard/urls/${a.monitored_url_id}`} style={{
                  fontSize: 11, fontWeight: 600, color: '#DC2626',
                  background: 'white', border: '1px solid rgba(220,38,38,0.15)',
                  padding: '2px 8px', borderRadius: 5, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444' }} />
                  {a.monitored_urls?.name ?? 'Unknown'}
                  {a.diff_pct != null && (
                    <span style={{ fontWeight: 400, opacity: 0.7 }}>· {Number(a.diff_pct).toFixed(1)}%</span>
                  )}
                </Link>
              ))}
              {openAlertCount > 3 && (
                <Link href="/dashboard/alerts" style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'none', alignSelf: 'center' }}>
                  +{openAlertCount - 3} more
                </Link>
              )}
            </div>
          </div>
          <Link href="/dashboard/alerts" style={{
            fontSize: 11, fontWeight: 600, color: '#6B7280', whiteSpace: 'nowrap',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
          }}>
            All alerts <ArrowRight size={10} />
          </Link>
        </div>
      )}

      {/* Empty state */}
      {!hasUrls ? (
        <div style={{
          background: 'white', borderRadius: 10, border: '1px dashed #E5E7EB',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Globe size={20} style={{ color: '#2563EB' }} />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
            Start monitoring
          </h2>
          <p style={{ fontSize: 12, color: '#6B7280', maxWidth: 300, lineHeight: 1.65, marginBottom: 20 }}>
            Add a URL and we'll take pixel-perfect screenshots on your schedule, then use AI to explain any visual changes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, textAlign: 'left' }}>
            {[
              { icon: <Eye size={11} style={{ color: '#7C3AED' }} />, text: 'Watch mode — diff + alert on any change' },
              { icon: <Archive size={11} style={{ color: '#6B7280' }} />, text: 'Archive mode — screenshot only, no alerts' },
              { icon: <Sparkles size={11} style={{ color: '#2563EB' }} />, text: 'AI explains every change in plain English' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {item.icon}
                <span style={{ fontSize: 11, color: '#6B7280' }}>{item.text}</span>
              </div>
            ))}
          </div>
          <AddMonitorButton />
        </div>
      ) : (
        <>
          {/* Monitor list */}
          <div style={{
            background: 'white', border: '1px solid #E5E7EB',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 14px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Globe size={12} style={{ color: '#9CA3AF' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Monitors</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#6B7280',
                  background: '#F0F0F0', padding: '1px 6px', borderRadius: 99,
                }}>
                  {urls.length}
                </span>
              </div>
              <Link href="/dashboard/urls" style={{
                fontSize: 11, fontWeight: 600, color: '#6B7280', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                Manage <ArrowRight size={10} />
              </Link>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 80px 80px 80px 140px 28px',
              padding: '7px 14px',
              background: '#FAFAFA',
              borderBottom: '1px solid #F3F4F6',
            }}>
              {['', 'Monitor', 'Mode', 'Schedule', 'Last Check', 'Last Change', ''].map((h, i) => (
                <span key={i} style={{
                  fontSize: 9, fontWeight: 700, color: '#D1D5DB',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {urls.slice(0, 10).map((url: any, idx: number) => {
              const lastAlert = lastAlertMap.get(url.id)
              return (
                <MonitorRow
                  key={url.id}
                  isLast={idx === Math.min(urls.length, 10) - 1}
                  showLastChange
                  url={{
                    id: url.id,
                    name: url.name,
                    url: url.url,
                    is_active: url.is_active,
                    mode: url.mode,
                    check_frequency: url.check_frequency,
                    last_checked_at: url.last_checked_at,
                    openAlertCount: alertCountMap.get(url.id) ?? 0,
                    lastAlertDiffPct: lastAlert?.diff_pct ?? null,
                    lastAlertSummary: lastAlert?.ai_summary ?? null,
                  }}
                />
              )
            })}

            {urls.length > 10 && (
              <div style={{ padding: '9px 14px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
                <Link href="/dashboard/urls" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textDecoration: 'none' }}>
                  +{urls.length - 10} more monitors
                </Link>
              </div>
            )}
          </div>

          {/* Recent activity */}
          {recentAlerts.length > 0 && (
            <div style={{
              background: 'white', border: '1px solid #E5E7EB',
              borderRadius: 8, overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 14px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Activity size={12} style={{ color: '#9CA3AF' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Recent Activity</span>
                </div>
                <Link href="/dashboard/alerts" style={{
                  fontSize: 11, fontWeight: 600, color: '#6B7280', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  All alerts <ArrowRight size={10} />
                </Link>
              </div>

              {recentAlerts.map((alert: any, idx: number) => {
                const isOpen = alert.status === 'open'
                const isLast = idx === recentAlerts.length - 1
                return (
                  <Link
                    key={alert.id}
                    href={`/dashboard/urls/${alert.monitored_url_id}`}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '9px 14px',
                      borderBottom: isLast ? 'none' : '1px solid #F9FAFB',
                      textDecoration: 'none', background: 'white',
                      transition: 'background 0.1s',
                    }}
                    className="monitor-row"
                  >
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                      background: isOpen ? '#EF4444' : '#D1D5DB',
                      boxShadow: isOpen ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: '#374151',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {alert.monitored_urls?.name ?? 'Unknown'}
                          </span>
                          {alert.diff_pct != null && (
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: isOpen ? '#EF4444' : '#9CA3AF',
                              background: isOpen ? 'rgba(239,68,68,0.08)' : '#F3F4F6',
                              padding: '1px 5px', borderRadius: 4,
                            }}>
                              {Number(alert.diff_pct).toFixed(1)}%
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: '#D1D5DB', flexShrink: 0, marginLeft: 10 }}>
                          {timeAgo(alert.created_at)}
                        </span>
                      </div>
                      {alert.ai_summary && (
                        <p style={{
                          fontSize: 11, color: '#6B7280', lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden', margin: 0,
                        }}>
                          {alert.ai_summary}
                        </p>
                      )}
                    </div>

                    <ArrowRight size={11} style={{ color: '#D1D5DB', flexShrink: 0, marginTop: 2 }} />
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MetricPill({ label, value, accent, danger }: {
  label: string; value: number; accent?: boolean; danger?: boolean
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px',
      background: danger ? 'rgba(220,38,38,0.06)' : accent ? '#EFF6FF' : '#F9FAFB',
      border: `1px solid ${danger ? 'rgba(220,38,38,0.18)' : accent ? 'rgba(37,99,235,0.18)' : '#E5E7EB'}`,
      borderRadius: 6, fontSize: 12, fontWeight: 600,
      color: danger ? '#DC2626' : accent ? '#2563EB' : '#374151',
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.75 }}>{label}</span>
    </div>
  )
}
