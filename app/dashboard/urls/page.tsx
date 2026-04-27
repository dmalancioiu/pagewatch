import { redirect } from 'next/navigation'
import { Globe, Pause, Archive, Eye, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { AddMonitorButton } from '@/components/dashboard/AddMonitorButton'
import { MonitorRow } from '@/components/dashboard/MonitorRow'

export const metadata = { title: 'Monitors — PageWatch' }

function Surface({ children }: { children: React.ReactNode }) {
  return <section style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 36px rgba(15,23,42,0.045)' }}>{children}</section>
}

function MetricCard({ label, value, accent, danger }: { label: string; value: number; accent?: boolean; danger?: boolean }) {
  return <div style={{ padding: 14, borderRadius: 14, background: '#FFFFFF', border: `1px solid ${danger ? 'rgba(220,38,38,0.18)' : accent ? 'rgba(37,99,235,0.16)' : 'rgba(15,23,42,0.08)'}`, boxShadow: '0 10px 28px rgba(15,23,42,0.04)' }}><p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p><p style={{ margin: 0, fontSize: 24, lineHeight: 1, fontWeight: 850, color: danger ? '#DC2626' : accent ? '#2563EB' : '#0F172A', letterSpacing: '-0.045em' }}>{value}</p></div>
}

export default async function UrlsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const urls = await getMonitoredUrls(workspace.id)

  const [{ data: openAlertRows }, { data: lastAlertRows }] = await Promise.all([
    supabase.from('alerts').select('monitored_url_id').eq('workspace_id', workspace.id).eq('status', 'open'),
    supabase.from('alerts').select('monitored_url_id, diff_pct, ai_summary, created_at').eq('workspace_id', workspace.id).order('created_at', { ascending: false }).limit(500),
  ])

  const openCountMap = new Map<string, number>()
  for (const a of openAlertRows ?? []) openCountMap.set(a.monitored_url_id, (openCountMap.get(a.monitored_url_id) ?? 0) + 1)

  const lastAlertMap = new Map<string, any>()
  for (const a of lastAlertRows ?? []) if (!lastAlertMap.has(a.monitored_url_id)) lastAlertMap.set(a.monitored_url_id, a)

  const activeCount = urls.filter((u: any) => u.is_active).length
  const pausedCount = urls.filter((u: any) => !u.is_active).length
  const archiveCount = urls.filter((u: any) => u.mode === 'archive').length
  const alertingCount = urls.filter((u: any) => (openCountMap.get(u.id) ?? 0) > 0).length

  return (
    <div className="canvas-dot-bg" style={{ minHeight: '100vh', padding: '30px 36px 56px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monitors</p>
            <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.08, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.045em' }}>Watched pages</h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: alertingCount > 0 ? '#DC2626' : '#64748B' }}>{alertingCount > 0 ? `${alertingCount} monitor${alertingCount !== 1 ? 's' : ''} need review.` : `${activeCount} active · ${pausedCount} paused · all clear.`}</p>
          </div>
          <AddMonitorButton />
        </div>

        {urls.length === 0 ? (
          <Surface><div style={{ padding: '72px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Globe size={22} /></div><h2 style={{ fontSize: 18, fontWeight: 850, color: '#0F172A', margin: '0 0 7px', letterSpacing: '-0.03em' }}>No monitors yet</h2><p style={{ fontSize: 13, color: '#64748B', maxWidth: 390, lineHeight: 1.65, margin: '0 0 22px' }}>Add public URLs to watch. PageWatch will screenshot them on your schedule and explain meaningful visual changes.</p><div style={{ display: 'grid', gap: 9, marginBottom: 24, textAlign: 'left' }}>{[{ icon: <Eye size={12} style={{ color: '#7C3AED' }} />, text: 'Watch mode creates diffs and alerts' }, { icon: <Archive size={12} style={{ color: '#64748B' }} />, text: 'Archive mode stores clean captures' }, { icon: <Sparkles size={12} style={{ color: '#2563EB' }} />, text: 'AI explains changes in plain English' }].map((item, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span><span style={{ fontSize: 12, color: '#64748B' }}>{item.text}</span></div>)}</div><AddMonitorButton /></div></Surface>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 18 }}>
              <MetricCard label="Active" value={activeCount} accent />
              <MetricCard label="Paused" value={pausedCount} />
              <MetricCard label="Archive" value={archiveCount} />
              <MetricCard label="Need review" value={alertingCount} danger={alertingCount > 0} />
            </div>

            <Surface>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #EEF2F7', background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={16} /></div><div><h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Monitor inventory</h2><p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8' }}>{urls.length} watched page{urls.length !== 1 ? 's' : ''}, sorted by current workspace state.</p></div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 80px 80px 140px 28px', padding: '8px 14px', background: '#FBFCFF', borderBottom: '1px solid #EEF2F7' }}>{['', 'Monitor', 'Mode', 'Schedule', 'Last Check', 'Last Change', ''].map((h, i) => <span key={i} style={{ fontSize: 9, fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>)}</div>
              {urls.map((url: any, idx: number) => {
                const openCount = openCountMap.get(url.id) ?? 0
                const lastAlert = lastAlertMap.get(url.id)
                return <MonitorRow key={url.id} isLast={idx === urls.length - 1} showLastChange url={{ id: url.id, name: url.name, url: url.url, is_active: url.is_active, mode: url.mode, check_frequency: url.check_frequency, last_checked_at: url.last_checked_at, openAlertCount: openCount, lastAlertDiffPct: lastAlert?.diff_pct ?? null, lastAlertSummary: lastAlert?.ai_summary ?? null }} />
              })}
            </Surface>
          </>
        )}
      </div>
    </div>
  )
}
