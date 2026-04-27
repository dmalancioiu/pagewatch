import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { getAlerts } from '@/lib/actions/alerts'
import { createServerClient } from '@/lib/supabase/server'
import {
  Globe, ArrowRight, CheckCircle2, Plus,
  ShieldAlert, Sparkles, Clock, Activity,
  AlertTriangle, Archive, Eye, TrendingUp,
} from 'lucide-react'

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

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

function fallbackSummary(pct: number | null): string {
  if (!pct) return 'Visual change detected across the page.'
  if (pct >= 50) return 'Major layout change — page structure significantly altered.'
  if (pct >= 25) return 'Significant visual change — multiple sections shifted.'
  if (pct >= 10) return 'Moderate change — content or styling was updated.'
  return 'Minor change — small text or styling update detected.'
}

function severity(pct: number | null): { label: string; color: string; bg: string } {
  if (!pct || pct < 5) return { label: 'Minor', color: '#6E6E73', bg: '#F0F0F5' }
  if (pct < 15) return { label: 'Moderate', color: '#FF9500', bg: 'rgba(255,149,0,0.1)' }
  if (pct < 30) return { label: 'Significant', color: '#FF6B00', bg: 'rgba(255,107,0,0.1)' }
  return { label: 'Critical', color: '#FF3B30', bg: 'rgba(255,59,48,0.1)' }
}

function isStale(url: any): boolean {
  if (!url.is_active || !url.last_checked_at) return false
  const elapsed = Date.now() - new Date(url.last_checked_at).getTime()
  const threshold =
    url.check_frequency === 'hourly' ? 3 * 3600000
    : url.check_frequency === 'weekly' ? 9 * 86400000
    : 28 * 3600000
  return elapsed > threshold
}

function smartSubtitle(openCount: number, staleCount: number, recentCount: number, hasUrls: boolean): string {
  if (!hasUrls) return 'No monitors yet.'
  if (openCount > 0 && staleCount > 0) return `${openCount} open alert${openCount !== 1 ? 's' : ''} and ${staleCount} stale monitor${staleCount !== 1 ? 's' : ''} need attention.`
  if (openCount > 0) return `${openCount} open alert${openCount !== 1 ? 's' : ''} need${openCount === 1 ? 's' : ''} your attention.`
  if (staleCount > 0) return `${staleCount} monitor${staleCount !== 1 ? 's' : ''} haven't been checked recently.`
  if (recentCount > 0) return `${recentCount} change${recentCount !== 1 ? 's' : ''} detected recently. All monitors healthy.`
  return 'All systems healthy. Monitoring is active.'
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
    { count: totalChecks },
    { count: totalChanges },
    { data: recentAlertsRaw },
  ] = await Promise.all([
    supabase.from('screenshot_snapshots').select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id).gte('taken_at', todayStart.toISOString()),
    supabase.from('screenshot_snapshots').select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id),
    supabase.from('alerts').select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id),
    supabase.from('alerts')
      .select('id, diff_pct, ai_summary, created_at, status, monitored_url_id, monitored_urls(name, url, mode)')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const recentAlerts = recentAlertsRaw ?? []

  const alertCountMap = new Map<string, number>()
  for (const a of openAlerts as any[]) {
    alertCountMap.set(a.monitored_url_id, (alertCountMap.get(a.monitored_url_id) ?? 0) + 1)
  }

  const activeMonitors = urls.filter((u: any) => u.is_active).length
  const pausedMonitors = urls.filter((u: any) => !u.is_active).length
  const archiveMonitors = urls.filter((u: any) => u.mode === 'archive').length
  const openAlertCount = (openAlerts as any[]).length
  const staleMonitors = urls.filter(isStale)
  const hasUrls = urls.length > 0

  // Featured alert = highest diff_pct open alert
  const sortedOpen = [...(openAlerts as any[])].sort((a, b) => (b.diff_pct ?? 0) - (a.diff_pct ?? 0))
  const featuredAlert = sortedOpen[0] ?? null
  const remainingAlerts = sortedOpen.slice(1)

  const { data: oldest } = await supabase
    .from('screenshot_snapshots').select('taken_at')
    .eq('workspace_id', workspace.id).order('taken_at', { ascending: true }).limit(1)
  const daysSince = oldest?.[0]?.taken_at
    ? Math.max(1, Math.floor((Date.now() - new Date(oldest[0].taken_at).getTime()) / 86400000))
    : 0

  const subtitle = smartSubtitle(openAlertCount, staleMonitors.length, recentAlerts.filter((a: any) => a.status === 'open').length, hasUrls)

  return (
    <div style={{ fontFamily: SF, display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 48 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.025em', lineHeight: 1 }}>
            Overview
          </h1>
          <p style={{ fontSize: 13, color: openAlertCount > 0 ? '#FF3B30' : '#6E6E73', marginTop: 6, letterSpacing: '-0.01em' }}>
            {subtitle}
          </p>
        </div>
        {hasUrls && (
          <Link href="/dashboard/urls" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', background: '#16A34A', color: 'white',
            borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)', letterSpacing: '-0.01em',
          }}>
            <Plus style={{ width: 14, height: 14 }} /> Add Monitor
          </Link>
        )}
      </div>

      {/* ── Needs Attention Panel ── */}
      {featuredAlert && (() => {
        const sv = severity(featuredAlert.diff_pct)
        const urlName = featuredAlert.monitored_urls?.name ?? 'Unknown'
        const urlDomain = (() => { try { return new URL(featuredAlert.monitored_urls?.url ?? '').hostname } catch { return featuredAlert.monitored_urls?.url ?? '' } })()
        const summary = featuredAlert.ai_summary || fallbackSummary(featuredAlert.diff_pct)
        return (
          <div style={{
            background: 'rgba(255,59,48,0.03)', border: '0.5px solid rgba(255,59,48,0.22)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '11px 20px', borderBottom: '0.5px solid rgba(255,59,48,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,59,48,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle style={{ width: 13, height: 13, color: '#FF3B30' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#FF3B30', letterSpacing: '-0.01em' }}>
                  Needs Attention
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', background: 'rgba(255,59,48,0.12)', padding: '2px 7px', borderRadius: 99 }}>
                  {openAlertCount}
                </span>
              </div>
              <Link href="/dashboard/alerts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#AEAEB2', textDecoration: 'none' }}>
                All alerts <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>

            {/* Featured alert body */}
            <div style={{ padding: '18px 20px' }}>
              {openAlertCount > 1 && (
                <p style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                  Most critical
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Monitor name + meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em' }}>
                      {urlName}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sv.color, background: sv.bg, padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>
                      {sv.label}
                    </span>
                    {featuredAlert.diff_pct != null && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', background: 'rgba(255,59,48,0.08)', padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>
                        {Number(featuredAlert.diff_pct).toFixed(1)}% changed
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: '#C7C7CC', letterSpacing: '-0.01em' }}>
                      {timeAgo(featuredAlert.created_at)}
                    </span>
                  </div>
                  {/* Domain */}
                  <p style={{ fontSize: 11, fontFamily: 'ui-monospace, "SF Mono", monospace', color: '#AEAEB2', marginBottom: 10 }}>
                    {urlDomain}
                  </p>
                  {/* AI summary */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <Sparkles style={{ width: 11, height: 11, color: '#16A34A', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#3D3D3F', lineHeight: 1.6, letterSpacing: '-0.01em', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {summary}
                    </p>
                  </div>
                </div>
                {/* CTA */}
                <Link href={`/dashboard/urls/${featuredAlert.monitored_url_id}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  padding: '9px 16px', background: '#FF3B30', color: 'white',
                  borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(255,59,48,0.25)', letterSpacing: '-0.01em',
                  alignSelf: 'flex-start',
                }}>
                  Inspect Change <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
              </div>
            </div>

            {/* Remaining alerts footer */}
            {remainingAlerts.length > 0 && (
              <div style={{ padding: '10px 20px', borderTop: '0.5px solid rgba(255,59,48,0.08)', background: 'rgba(255,59,48,0.02)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {remainingAlerts.slice(0, 3).map((a: any) => {
                    const sv2 = severity(a.diff_pct)
                    return (
                      <Link key={a.id} href={`/dashboard/urls/${a.monitored_url_id}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', background: 'white', border: '0.5px solid rgba(255,59,48,0.15)',
                        borderRadius: 7, textDecoration: 'none',
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF3B30', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>
                          {a.monitored_urls?.name ?? 'Unknown'}
                        </span>
                        {a.diff_pct != null && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: sv2.color }}>{Number(a.diff_pct).toFixed(1)}%</span>
                        )}
                      </Link>
                    )
                  })}
                  {remainingAlerts.length > 3 && (
                    <span style={{ fontSize: 11, color: '#AEAEB2', alignSelf: 'center' }}>
                      +{remainingAlerts.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ── Stat Strip ── */}
      {hasUrls && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[
            {
              label: 'Open Alerts', value: openAlertCount,
              caption: openAlertCount > 0 ? 'need review' : 'all clear',
              hue: openAlertCount > 0 ? 'red' : 'green',
            },
            {
              label: 'Active Monitors', value: activeMonitors,
              caption: pausedMonitors > 0 ? `${pausedMonitors} paused` : 'all running',
              hue: 'neutral',
            },
            {
              label: 'Archive Mode', value: archiveMonitors,
              caption: archiveMonitors > 0 ? 'no alerting' : 'none set',
              hue: 'neutral',
            },
            {
              label: 'Checks Today', value: checksToday ?? 0,
              caption: 'screenshots taken', hue: 'neutral',
            },
            {
              label: 'Total Changes', value: totalChanges ?? 0,
              caption: daysSince > 0 ? `over ${daysSince}d` : 'detected',
              hue: 'neutral',
            },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 14,
              border: s.hue === 'red' ? '0.5px solid rgba(255,59,48,0.2)' : '0.5px solid rgba(0,0,0,0.07)',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: '14px 16px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{s.label}</p>
              <p style={{
                fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4,
                color: s.hue === 'red' ? '#FF3B30' : s.hue === 'green' ? '#16A34A' : '#1D1D1F',
              }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#C7C7CC', letterSpacing: '-0.01em' }}>{s.caption}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!hasUrls ? (
        <div style={{
          background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '80px 24px', textAlign: 'center',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(22,163,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Globe style={{ width: 22, height: 22, color: '#16A34A' }} />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', marginBottom: 8 }}>Start monitoring</h2>
          <p style={{ fontSize: 13, color: '#6E6E73', maxWidth: 300, lineHeight: 1.65, marginBottom: 20 }}>
            Add a URL and we'll take pixel-perfect screenshots on your schedule, then use AI to explain any visual changes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, textAlign: 'left', maxWidth: 300 }}>
            {[
              { icon: <Eye style={{ width: 12, height: 12 }} />, text: 'Watch mode — diff + alert on any change' },
              { icon: <Archive style={{ width: 12, height: 12 }} />, text: 'Archive mode — screenshot only, no alerts' },
              { icon: <Sparkles style={{ width: 12, height: 12 }} />, text: 'AI explains every change in plain English' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#16A34A' }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: '#6E6E73' }}>{item.text}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/urls" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#16A34A', color: 'white', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Plus style={{ width: 14, height: 14 }} /> Add First Monitor
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Recent Activity Feed ── */}
          {recentAlerts.length > 0 && (
            <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '13px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity style={{ width: 13, height: 13, color: '#AEAEB2' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.015em' }}>Recent Activity</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6E6E73', background: '#F5F5F7', padding: '2px 7px', borderRadius: 99 }}>
                    {recentAlerts.length}
                  </span>
                </div>
                <Link href="/dashboard/alerts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#AEAEB2', textDecoration: 'none', letterSpacing: '-0.01em' }}>
                  All alerts <ArrowRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>
              <div>
                {recentAlerts.map((alert: any, idx: number) => {
                  const urlName = alert.monitored_urls?.name ?? 'Unknown'
                  const isOpen = alert.status === 'open'
                  const sv = severity(alert.diff_pct)
                  const summary = alert.ai_summary || fallbackSummary(alert.diff_pct)
                  const isArchive = alert.monitored_urls?.mode === 'archive'
                  const isLast = idx === recentAlerts.length - 1
                  return (
                    <Link
                      key={alert.id}
                      href={`/dashboard/urls/${alert.monitored_url_id}`}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                        padding: '13px 20px',
                        borderBottom: isLast ? 'none' : '0.5px solid rgba(0,0,0,0.05)',
                        textDecoration: 'none', background: 'white',
                      }}
                      className="alert-feed-row"
                    >
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                        background: isOpen ? '#FF3B30' : '#D1D1D6',
                        boxShadow: isOpen ? '0 0 0 3px rgba(255,59,48,0.12)' : 'none',
                      }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {urlName}
                            </span>
                            {/* Mode badge */}
                            {isArchive ? (
                              <span style={{ fontSize: 9, fontWeight: 700, color: '#8E8E93', background: '#F0F0F5', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                                Archive
                              </span>
                            ) : (
                              <span style={{ fontSize: 9, fontWeight: 700, color: '#5856D6', background: 'rgba(88,86,214,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                                Watch
                              </span>
                            )}
                            {/* Severity */}
                            {isOpen && alert.diff_pct != null && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: sv.color, background: sv.bg, padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                                {sv.label}
                              </span>
                            )}
                            {alert.diff_pct != null && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: isOpen ? '#FF3B30' : '#AEAEB2', background: isOpen ? 'rgba(255,59,48,0.08)' : '#F5F5F7', padding: '2px 6px', borderRadius: 5, flexShrink: 0 }}>
                                {Number(alert.diff_pct).toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: 10, color: '#C7C7CC', flexShrink: 0, marginLeft: 12, letterSpacing: '-0.01em' }}>
                            {timeAgo(alert.created_at)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                          <Sparkles style={{ width: 10, height: 10, color: '#16A34A', marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontSize: 12, color: '#6E6E73', lineHeight: 1.55, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                            {summary}
                          </p>
                        </div>
                      </div>

                      <ArrowRight style={{ width: 12, height: 12, color: '#D1D1D6', flexShrink: 0, marginTop: 4 }} />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Main 2-col: Monitors + Health/Alerts ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, alignItems: 'start' }}>

            {/* Monitor List */}
            <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '12px 18px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe style={{ width: 13, height: 13, color: '#AEAEB2' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.015em' }}>Monitors</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6E6E73', background: '#F0F0F0', padding: '2px 7px', borderRadius: 99 }}>{urls.length}</span>
                </div>
                <Link href="/dashboard/urls" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#AEAEB2', textDecoration: 'none' }}>
                  Manage <ArrowRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>
              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px 90px 52px', padding: '8px 18px', background: '#FAFAFA', borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}>
                {['Monitor', 'Mode', 'Schedule', 'Last check', ''].map(h => (
                  <span key={h} style={{ fontSize: 9, fontWeight: 700, color: '#D1D1D6', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
                ))}
              </div>
              {urls.slice(0, 12).map((url: any, idx: number) => {
                const isPaused = !url.is_active
                const isArchive = url.mode === 'archive'
                const openCount = alertCountMap.get(url.id) ?? 0
                const stale = isStale(url)
                let domain = url.url
                try { domain = new URL(url.url).hostname } catch {}
                return (
                  <Link key={url.id} href={`/dashboard/urls/${url.id}`}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px 90px 52px', alignItems: 'center', padding: '9px 18px', borderBottom: idx < urls.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none', textDecoration: 'none', opacity: isPaused ? 0.55 : 1 }}
                    className="dashboard-monitor-row"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, paddingRight: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: isPaused ? '#D1D1D6' : stale ? '#FF9500' : openCount > 0 ? '#FF3B30' : '#30D158', boxShadow: openCount > 0 ? '0 0 0 3px rgba(255,59,48,0.12)' : stale ? '0 0 0 3px rgba(255,149,0,0.12)' : 'none' }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.name}</p>
                        <p style={{ fontSize: 10, fontFamily: 'ui-monospace, "SF Mono", monospace', color: '#AEAEB2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{domain}</p>
                      </div>
                    </div>
                    {/* Mode badge */}
                    {isArchive ? (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#8E8E93', background: '#F0F0F5', padding: '3px 7px', borderRadius: 5, width: 'fit-content' }}>Archive</span>
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#5856D6', background: 'rgba(88,86,214,0.08)', padding: '3px 7px', borderRadius: 5, width: 'fit-content' }}>Watch</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock style={{ width: 10, height: 10, color: '#D1D1D6', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#6E6E73', textTransform: 'capitalize', letterSpacing: '-0.01em' }}>{url.check_frequency}</span>
                    </div>
                    <span style={{ fontSize: 11, color: stale ? '#FF9500' : '#AEAEB2', fontWeight: stale ? 600 : 400, letterSpacing: '-0.01em' }}>{timeAgo(url.last_checked_at)}</span>
                    {openCount > 0 ? (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', background: 'rgba(255,59,48,0.08)', padding: '2px 7px', borderRadius: 6, width: 'fit-content' }}>{openCount}</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#E5E5EA' }}>—</span>
                    )}
                  </Link>
                )
              })}
              {urls.length > 12 && (
                <div style={{ padding: '10px 18px', borderTop: '0.5px solid rgba(0,0,0,0.04)', textAlign: 'center' }}>
                  <Link href="/dashboard/urls" style={{ fontSize: 11, fontWeight: 600, color: '#AEAEB2', textDecoration: 'none' }}>+ {urls.length - 12} more monitors</Link>
                </div>
              )}
            </div>

            {/* Right panel: Health signals or Open Alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Monitor Health */}
              <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '12px 18px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp style={{ width: 13, height: 13, color: '#AEAEB2' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.015em' }}>Monitor Health</span>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {staleMonitors.length === 0 && archiveMonitors === 0 && openAlertCount === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(48,209,88,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle2 style={{ width: 16, height: 16, color: '#30D158' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 2, letterSpacing: '-0.01em' }}>All monitors healthy</p>
                        <p style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.5 }}>No stale checks or issues detected.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {staleMonitors.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,149,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Clock style={{ width: 14, height: 14, color: '#FF9500' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 2, letterSpacing: '-0.01em' }}>
                              {staleMonitors.length} stale monitor{staleMonitors.length !== 1 ? 's' : ''}
                            </p>
                            <p style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.5 }}>
                              Haven't been checked within their expected window.
                            </p>
                          </div>
                        </div>
                      )}
                      {archiveMonitors > 0 && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(142,142,147,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Archive style={{ width: 14, height: 14, color: '#8E8E93' }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 2, letterSpacing: '-0.01em' }}>
                              {archiveMonitors} in archive mode
                            </p>
                            <p style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.5 }}>
                              Screenshots only — no diff alerts sent.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {/* Coverage signal */}
                  {activeMonitors > 0 && (
                    <div style={{ paddingTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Checks Today</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#1D1D1F' }}>{checksToday ?? 0}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: '#F0F0F5', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 99, background: '#16A34A',
                          width: `${Math.min(100, ((checksToday ?? 0) / Math.max(1, activeMonitors)) * 100)}%`,
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <p style={{ fontSize: 10, color: '#C7C7CC', marginTop: 5 }}>
                        {checksToday ?? 0} of {activeMonitors} active monitor{activeMonitors !== 1 ? 's' : ''} checked
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Open Alerts compact (only when no featured alert panel, or show remaining) */}
              {openAlertCount === 0 && (
                <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldAlert style={{ width: 13, height: 13, color: '#AEAEB2' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.015em' }}>Open Alerts</span>
                  </div>
                  <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 99, background: 'rgba(48,209,88,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <CheckCircle2 style={{ width: 16, height: 16, color: '#30D158' }} />
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', marginBottom: 4, letterSpacing: '-0.01em' }}>All clear</p>
                    <p style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.6, maxWidth: 160, margin: '0 auto' }}>No visual changes detected.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
