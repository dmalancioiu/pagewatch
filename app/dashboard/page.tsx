import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { getAlerts } from '@/lib/actions/alerts'
import { createServerClient } from '@/lib/supabase/server'
import {
  Globe, ArrowRight, AlertTriangle, Activity, Archive, Eye, Sparkles, ShieldCheck, Clock3, Flame,
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

function Surface({ children }: { children: React.ReactNode }) {
  return <section style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 36px rgba(15,23,42,0.045)' }}>{children}</section>
}

function SurfaceHeader({ icon, title, description, action }: { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return <div style={{ padding: '16px 18px', borderBottom: '1px solid #EEF2F7', background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div><div><h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>{title}</h2>{description && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>{description}</p>}</div></div>{action}</div>
}

function nextRunAt(url: any): Date | null {
  if (!url.is_active) return null
  const freq: string = url.check_frequency
  const last: string | null = url.last_checked_at
  const checkHour: number | null = url.check_hour ?? null
  const now = new Date()

  if (!last) return now
  const lastD = new Date(last)

  if (freq === 'hourly') {
    const next = new Date(lastD.getTime() + 60 * 60 * 1000)
    return next > now ? next : now
  }

  if (checkHour != null) {
    const next = new Date()
    next.setUTCHours(checkHour, 0, 0, 0)
    if (freq === 'weekly') {
      const minNext = new Date(lastD.getTime() + 7 * 24 * 60 * 60 * 1000)
      while (next < minNext) next.setUTCDate(next.getUTCDate() + 1)
    } else if (next <= now) {
      next.setUTCDate(next.getUTCDate() + 1)
    }
    return next
  }

  const ms = freq === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const next = new Date(lastD.getTime() + ms)
  return next > now ? next : now
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function heatColor(count: number): string {
  if (count >= 5) return '#991B1B'
  if (count >= 3) return '#DC2626'
  if (count >= 1) return '#FCA5A5'
  return '#F1F5F9'
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
  const heatmapStart = new Date()
  heatmapStart.setHours(0, 0, 0, 0)
  heatmapStart.setDate(heatmapStart.getDate() - 34)

  const [{ count: checksToday }, { data: recentAlertsRaw }, { data: heatmapAlertsRaw }] = await Promise.all([
    supabase.from('screenshot_snapshots').select('*', { count: 'exact', head: true }).eq('workspace_id', workspace.id).gte('taken_at', todayStart.toISOString()),
    supabase.from('alerts').select('id, diff_pct, ai_summary, created_at, status, monitored_url_id, monitored_urls(name, url, mode)').eq('workspace_id', workspace.id).order('created_at', { ascending: false }).limit(8),
    supabase.from('alerts').select('id, created_at').eq('workspace_id', workspace.id).gte('created_at', heatmapStart.toISOString()),
  ])

  const recentAlerts = recentAlertsRaw ?? []
  const alertCountMap = new Map<string, number>()
  for (const a of openAlerts as any[]) alertCountMap.set(a.monitored_url_id, (alertCountMap.get(a.monitored_url_id) ?? 0) + 1)

  const lastAlertMap = new Map<string, any>()
  for (const a of recentAlerts) if (!lastAlertMap.has((a as any).monitored_url_id)) lastAlertMap.set((a as any).monitored_url_id, a)

  const activeMonitors = urls.filter((u: any) => u.is_active).length
  const openAlertCount = (openAlerts as any[]).length
  const hasUrls = urls.length > 0
  const sortedOpen = [...(openAlerts as any[])].sort((a, b) => (b.diff_pct ?? 0) - (a.diff_pct ?? 0))
  const nextRuns = urls.map((url: any) => ({ url, at: nextRunAt(url) })).filter((item: any) => item.at).sort((a: any, b: any) => a.at.getTime() - b.at.getTime()).slice(0, 5)
  const alertCountsByDay = new Map<string, number>()
  for (const alert of heatmapAlertsRaw ?? []) {
    const key = dayKey(new Date((alert as any).created_at))
    alertCountsByDay.set(key, (alertCountsByDay.get(key) ?? 0) + 1)
  }
  const heatmapDays = Array.from({ length: 35 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (34 - index))
    const key = dayKey(date)
    return { key, label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count: alertCountsByDay.get(key) ?? 0 }
  })
  const volatileDays = heatmapDays.filter(day => day.count > 0).length

  return (
    <div className="canvas-dot-bg" style={{ minHeight: '100vh', padding: '30px 36px 56px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overview</p>
            <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.08, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.045em' }}>Workspace health</h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748B' }}>Track monitors, captures, and recent changes across your workspace.</p>
          </div>
          {hasUrls ? <AddMonitorButton /> : <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.045)' }}><ShieldCheck size={14} style={{ color: '#2563EB' }} /><span style={{ fontSize: 12, fontWeight: 750, color: '#475569' }}>Ready to monitor</span></div>}
        </div>

        {!hasUrls ? (
          <Surface>
            <div style={{ padding: '72px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Globe size={22} /></div>
              <h2 style={{ fontSize: 18, fontWeight: 850, color: '#0F172A', margin: '0 0 7px', letterSpacing: '-0.03em' }}>Start monitoring your first page</h2>
              <p style={{ fontSize: 13, color: '#64748B', maxWidth: 390, lineHeight: 1.65, margin: '0 0 22px' }}>Add a URL, capture a baseline, then select the zones that matter. PageWatch ignores the noise and alerts you on meaningful changes.</p>
              <div style={{ display: 'grid', gap: 9, marginBottom: 24, textAlign: 'left' }}>
                {[{ icon: <Eye size={12} style={{ color: '#7C3AED' }} />, text: 'Watch mode tracks visual diffs and creates alerts' }, { icon: <Archive size={12} style={{ color: '#64748B' }} />, text: 'Archive mode stores clean screenshots over time' }, { icon: <Sparkles size={12} style={{ color: '#2563EB' }} />, text: 'AI explains every important change in plain English' }].map((item, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span><span style={{ fontSize: 12, color: '#64748B' }}>{item.text}</span></div>)}
              </div>
              <AddMonitorButton />
            </div>
          </Surface>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 0.85fr)', gap: 18, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                <MetricCard label="Monitors" value={urls.length} />
                <MetricCard label="Active" value={activeMonitors} accent />
                <MetricCard label="Open alerts" value={openAlertCount} danger={openAlertCount > 0} />
                <MetricCard label="Checks today" value={checksToday ?? 0} />
              </div>

              {openAlertCount > 0 && (
                <section style={{ background: 'linear-gradient(90deg, rgba(254,242,242,0.92), #FFFFFF)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 16, padding: 16, boxShadow: '0 12px 36px rgba(220,38,38,0.045)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(220,38,38,0.08)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={16} /></div><div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 14, fontWeight: 850, color: '#991B1B', letterSpacing: '-0.02em' }}>{openAlertCount} open alert{openAlertCount !== 1 ? 's' : ''} need attention</p><div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>{sortedOpen.slice(0, 3).map((a: any) => <Link key={a.id} href={`/dashboard/urls/${a.monitored_url_id}`} style={{ fontSize: 11, fontWeight: 750, color: '#B91C1C', background: '#FFFFFF', border: '1px solid rgba(220,38,38,0.15)', padding: '4px 8px', borderRadius: 999, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />{a.monitored_urls?.name ?? 'Unknown'}{a.diff_pct != null && <span style={{ opacity: 0.7 }}>· {Number(a.diff_pct).toFixed(1)}%</span>}</Link>)}</div></div><Link href="/dashboard/alerts" style={{ fontSize: 12, fontWeight: 750, color: '#991B1B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Review <ArrowRight size={12} /></Link></div>
                </section>
              )}

              <Surface>
                <SurfaceHeader icon={<Globe size={16} />} title="Monitors" description={`${urls.length} watched page${urls.length !== 1 ? 's' : ''} in this workspace.`} action={<Link href="/dashboard/urls" style={{ fontSize: 12, fontWeight: 750, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Manage <ArrowRight size={12} /></Link>} />
                <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 80px 80px 140px 28px', padding: '8px 14px', background: '#FBFCFF', borderBottom: '1px solid #EEF2F7' }}>{['', 'Monitor', 'Mode', 'Schedule', 'Last Check', 'Last Change', ''].map((h, i) => <span key={i} style={{ fontSize: 9, fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>)}</div>
                {urls.slice(0, 8).map((url: any, idx: number) => { const lastAlert = lastAlertMap.get(url.id); return <MonitorRow key={url.id} isLast={idx === Math.min(urls.length, 8) - 1} showLastChange url={{ id: url.id, name: url.name, url: url.url, is_active: url.is_active, mode: url.mode, check_frequency: url.check_frequency, last_checked_at: url.last_checked_at, openAlertCount: alertCountMap.get(url.id) ?? 0, lastAlertDiffPct: lastAlert?.diff_pct ?? null, lastAlertSummary: lastAlert?.ai_summary ?? null }} /> })}
              </Surface>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Surface>
                <SurfaceHeader icon={<Clock3 size={16} />} title="Next scheduled runs" description="The next checks across active monitors." />
                <div>{nextRuns.length === 0 ? <div style={{ padding: 22, color: '#94A3B8', fontSize: 12 }}>No active checks scheduled.</div> : nextRuns.map((item: any, idx: number) => <Link key={item.url.id} href={`/dashboard/urls/${item.url.id}`} className="monitor-row" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: idx === nextRuns.length - 1 ? 'none' : '1px solid #F1F5F9', textDecoration: 'none' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 0 3px rgba(37,99,235,0.1)', flexShrink: 0 }} /><div style={{ flex: 1, minWidth: 0 }}><p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url.name}</p><p style={{ margin: '3px 0 0', fontSize: 10, color: '#94A3B8' }}>{item.url.check_frequency} check</p></div><span style={{ fontSize: 11, fontWeight: 800, color: '#475569', flexShrink: 0 }}>{item.at.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span></Link>)}</div>
              </Surface>

              <Surface>
                <SurfaceHeader icon={<Flame size={16} />} title="Change heatmap" description={`${volatileDays} volatile day${volatileDays === 1 ? '' : 's'} in the last 5 weeks.`} />
                <div style={{ padding: '14px 16px 16px' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>{heatmapDays.map(day => <div key={day.key} title={`${day.label}: ${day.count} change${day.count === 1 ? '' : 's'}`} style={{ height: 19, borderRadius: 5, background: heatColor(day.count), border: '1px solid rgba(15,23,42,0.04)' }} />)}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}><span style={{ fontSize: 10, color: '#94A3B8' }}>Fewer</span><div style={{ display: 'flex', gap: 4 }}>{[0, 1, 3, 5].map(value => <span key={value} style={{ width: 13, height: 13, borderRadius: 4, background: heatColor(value), border: '1px solid rgba(15,23,42,0.04)' }} />)}</div><span style={{ fontSize: 10, color: '#94A3B8' }}>More</span></div></div>
              </Surface>

              <Surface>
                <SurfaceHeader icon={<Activity size={16} />} title="Recent activity" description="Newest detected changes and AI summaries." action={<Link href="/dashboard/alerts" style={{ fontSize: 12, fontWeight: 750, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>All alerts <ArrowRight size={12} /></Link>} />
                <div>{recentAlerts.length === 0 ? <div style={{ padding: 28, color: '#94A3B8', fontSize: 12 }}>No recent changes yet.</div> : recentAlerts.map((alert: any, idx: number) => <Link key={alert.id} href={`/dashboard/urls/${alert.monitored_url_id}`} className="monitor-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderBottom: idx === recentAlerts.length - 1 ? 'none' : '1px solid #F1F5F9', textDecoration: 'none' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: alert.status === 'open' ? '#EF4444' : '#CBD5E1', marginTop: 5, boxShadow: alert.status === 'open' ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none', flexShrink: 0 }} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><span style={{ fontSize: 12, fontWeight: 780, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.monitored_urls?.name ?? 'Unknown'}</span><span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>{timeAgo(alert.created_at)}</span></div>{alert.ai_summary && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748B', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{alert.ai_summary}</p>}</div><ArrowRight size={12} style={{ color: '#CBD5E1', marginTop: 3 }} /></Link>)}</div>
              </Surface>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, accent, danger }: { label: string; value: number; accent?: boolean; danger?: boolean }) {
  return <div style={{ padding: 14, borderRadius: 14, background: '#FFFFFF', border: `1px solid ${danger ? 'rgba(220,38,38,0.18)' : accent ? 'rgba(37,99,235,0.16)' : 'rgba(15,23,42,0.08)'}`, boxShadow: '0 10px 28px rgba(15,23,42,0.04)' }}><p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p><p style={{ margin: 0, fontSize: 24, lineHeight: 1, fontWeight: 850, color: danger ? '#DC2626' : accent ? '#2563EB' : '#0F172A', letterSpacing: '-0.045em' }}>{value}</p></div>
}
