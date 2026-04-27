import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { Bell, Activity, ChevronRight, Gauge, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
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

function diffColor(pct: number | null): { color: string; bg: string; border: string } {
  if (!pct || pct < 10) return { color: '#16A34A', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.16)' }
  if (pct < 25) return { color: '#B45309', bg: 'rgba(180,83,9,0.08)', border: 'rgba(180,83,9,0.16)' }
  if (pct < 50) return { color: '#C2410C', bg: 'rgba(194,65,12,0.08)', border: 'rgba(194,65,12,0.16)' }
  return { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.16)' }
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

function domainFrom(url: string | null | undefined) {
  try { return new URL(url ?? '').hostname } catch { return url ?? 'Unknown' }
}

export default async function AlertsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const { data: alerts } = await supabase.from('alerts').select('*, monitored_urls(name, url)').eq('workspace_id', workspace.id).order('created_at', { ascending: false })

  const safeAlerts = sortedAlerts(alerts ?? [])
  const openAlerts = safeAlerts.filter((a: any) => a.status === 'open')
  const resolvedAlerts = safeAlerts.filter((a: any) => a.status !== 'open')
  const topScore = safeAlerts.reduce((max: number, a: any) => Math.max(max, alertScore(a)), 0)
  const averageDiff = safeAlerts.length ? safeAlerts.reduce((sum: number, a: any) => sum + Number(a.diff_pct ?? 0), 0) / safeAlerts.length : 0

  return (
    <div className="canvas-dot-bg" style={{ minHeight: '100vh', padding: '30px 36px 56px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Alerts</p>
            <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.08, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.045em' }}>Change inbox</h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: openAlerts.length > 0 ? '#DC2626' : '#64748B' }}>{openAlerts.length > 0 ? `${openAlerts.length} open change${openAlerts.length !== 1 ? 's' : ''} waiting for review.` : 'No open changes need attention.'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.045)' }}><Bell size={14} style={{ color: '#2563EB' }} /><span style={{ fontSize: 12, fontWeight: 750, color: '#475569' }}>{safeAlerts.length} total alerts</span></div>
        </div>

        {safeAlerts.length === 0 ? (
          <section style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 36px rgba(15,23,42,0.045)' }}>
            <div style={{ padding: '72px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Activity size={22} /></div>
              <h2 style={{ fontSize: 18, fontWeight: 850, color: '#0F172A', margin: '0 0 7px', letterSpacing: '-0.03em' }}>No alerts yet</h2>
              <p style={{ fontSize: 13, color: '#64748B', maxWidth: 390, lineHeight: 1.65, margin: 0 }}>When PageWatch detects a meaningful visual change, it will appear here with a diff, score, and AI summary.</p>
            </div>
          </section>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 286px', gap: 18, alignItems: 'start' }}>
            <section style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 36px rgba(15,23,42,0.045)' }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #EEF2F7', background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: openAlerts.length > 0 ? 'rgba(220,38,38,0.07)' : 'rgba(37,99,235,0.08)', border: openAlerts.length > 0 ? '1px solid rgba(220,38,38,0.15)' : '1px solid rgba(37,99,235,0.15)', color: openAlerts.length > 0 ? '#DC2626' : '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{openAlerts.length > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</div><div><h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>{openAlerts.length > 0 ? 'Needs review' : 'All clear'}</h2><p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>Open changes appear first, sorted by relevance score.</p></div></div>
                <span style={{ fontSize: 11, fontWeight: 800, color: openAlerts.length > 0 ? '#B91C1C' : '#15803D', background: openAlerts.length > 0 ? 'rgba(220,38,38,0.07)' : 'rgba(22,163,74,0.08)', border: openAlerts.length > 0 ? '1px solid rgba(220,38,38,0.14)' : '1px solid rgba(22,163,74,0.14)', borderRadius: 999, padding: '5px 9px' }}>{openAlerts.length} open</span>
              </div>
              <div style={{ padding: 14, display: 'grid', gap: 10 }}>
                {safeAlerts.map((alert: any) => <AlertCard key={alert.id} alert={alert} />)}
              </div>
            </section>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InsightCard icon={<Zap size={15} />} label="Open" value={openAlerts.length} tone={openAlerts.length > 0 ? 'danger' : 'default'} description="Changes still waiting for review." />
              <InsightCard icon={<Gauge size={15} />} label="Top score" value={topScore.toFixed(0)} tone="blue" description="Highest AI relevance score." />
              <InsightCard icon={<Activity size={15} />} label="Avg diff" value={`${averageDiff.toFixed(1)}%`} tone="default" description="Mean visual difference across alerts." />
              <InsightCard icon={<CheckCircle2 size={15} />} label="Resolved" value={resolvedAlerts.length} tone="green" description="Acknowledged historical changes." />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function InsightCard({ icon, label, value, description, tone }: { icon: React.ReactNode; label: string; value: string | number; description: string; tone: 'danger' | 'blue' | 'green' | 'default' }) {
  const color = tone === 'danger' ? '#DC2626' : tone === 'blue' ? '#2563EB' : tone === 'green' ? '#16A34A' : '#0F172A'
  const bg = tone === 'danger' ? 'rgba(220,38,38,0.07)' : tone === 'blue' ? 'rgba(37,99,235,0.08)' : tone === 'green' ? 'rgba(22,163,74,0.08)' : '#F8FAFC'
  return <div style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, padding: 14, boxShadow: '0 10px 28px rgba(15,23,42,0.035)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}><div style={{ width: 30, height: 30, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div><p style={{ margin: 0, fontSize: 10, fontWeight: 850, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p></div><p style={{ margin: 0, fontSize: 25, fontWeight: 850, color, letterSpacing: '-0.045em', lineHeight: 1 }}>{value}</p><p style={{ margin: '7px 0 0', fontSize: 11, lineHeight: 1.45, color: '#94A3B8' }}>{description}</p></div>
}

function AlertCard({ alert }: { alert: any }) {
  const isOpen = alert.status === 'open'
  const dc = diffColor(alert.diff_pct)
  const score = alertScore(alert)
  const sc = scoreColor(score)
  const zone = topZone(alert)
  const passedCount = Number(alert.metadata?.passed_zone_count ?? 0)
  const domain = domainFrom(alert.monitored_urls?.url)

  return (
    <Link href={`/dashboard/urls/${alert.monitored_url_id}`} className="monitor-row" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(190px, 0.82fr) minmax(240px, 1fr) auto', gap: 14, alignItems: 'center', padding: '13px 14px', borderRadius: 14, border: `1px solid ${isOpen ? 'rgba(220,38,38,0.16)' : '#E2E8F0'}`, background: isOpen ? 'linear-gradient(90deg, #FFFFFF, rgba(254,242,242,0.38))' : '#FFFFFF', textDecoration: 'none', boxShadow: isOpen ? '0 10px 24px rgba(220,38,38,0.04)' : '0 1px 2px rgba(15,23,42,0.025)' }}>
      <span style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, borderRadius: 999, background: isOpen ? '#EF4444' : '#CBD5E1' }} />
      <div style={{ minWidth: 0, paddingLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: isOpen ? '#EF4444' : '#CBD5E1', boxShadow: isOpen ? '0 0 0 4px rgba(239,68,68,0.12)' : '0 0 0 4px rgba(203,213,225,0.18)' }} /><p style={{ margin: 0, fontSize: 13, fontWeight: 850, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.monitored_urls?.name ?? 'Unknown'}</p></div>
        <p style={{ margin: 0, fontSize: 10, color: '#94A3B8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{domain}</p>
        {zone && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Top zone: <strong style={{ color: '#0F172A' }}>{zone.label ?? 'Zone'}</strong>{passedCount > 1 ? ` + ${passedCount - 1} more` : ''}</p>}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, color: isOpen ? '#334155' : '#94A3B8', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{alert.ai_summary || (zone ? `${zone.label ?? 'Zone'} changed ${Number(zone.diff_pct ?? 0).toFixed(1)}%.` : 'Visual change detected.')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, flexWrap: 'wrap' }}>
          <StatusBadge variant={isOpen ? 'open' : 'acknowledged'} />
          {score > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, padding: '2px 7px', borderRadius: 999 }}>Score {score.toFixed(0)}</span>}
          {alert.diff_pct != null && <span style={{ fontSize: 10, fontWeight: 800, color: dc.color, background: dc.bg, border: `1px solid ${dc.border}`, padding: '2px 7px', borderRadius: 999 }}>{Number(alert.diff_pct).toFixed(1)}% diff</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94A3B8' }}><span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{timeAgo(alert.created_at)}</span><ChevronRight size={13} style={{ color: '#CBD5E1' }} /></div>
    </Link>
  )
}
