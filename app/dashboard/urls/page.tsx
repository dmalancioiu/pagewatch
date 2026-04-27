import { redirect } from 'next/navigation'
import { Globe, Pause, Archive, Eye, Sparkles, AlertTriangle } from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { AddMonitorButton } from '@/components/dashboard/AddMonitorButton'
import { MonitorRow } from '@/components/dashboard/MonitorRow'

export const metadata = { title: 'Monitors — PageWatch' }


export default async function UrlsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const urls = await getMonitoredUrls(workspace.id)

  const [{ data: openAlertRows }, { data: lastAlertRows }] = await Promise.all([
    supabase
      .from('alerts')
      .select('monitored_url_id')
      .eq('workspace_id', workspace.id)
      .eq('status', 'open'),
    supabase
      .from('alerts')
      .select('monitored_url_id, diff_pct, ai_summary, created_at')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const openCountMap = new Map<string, number>()
  for (const a of openAlertRows ?? []) {
    openCountMap.set(a.monitored_url_id, (openCountMap.get(a.monitored_url_id) ?? 0) + 1)
  }

  const lastAlertMap = new Map<string, any>()
  for (const a of lastAlertRows ?? []) {
    if (!lastAlertMap.has(a.monitored_url_id)) lastAlertMap.set(a.monitored_url_id, a)
  }

  const activeCount = urls.filter((u: any) => u.is_active).length
  const pausedCount = urls.filter((u: any) => !u.is_active).length
  const archiveCount = urls.filter((u: any) => u.mode === 'archive').length
  const alertingCount = urls.filter((u: any) => (openCountMap.get(u.id) ?? 0) > 0).length

  return (
    <div className="dash-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
            Monitors
          </h1>
          {urls.length > 0 && (
            <p style={{ fontSize: 11, color: alertingCount > 0 ? '#EF4444' : '#6B7280', marginTop: 2 }}>
              {alertingCount > 0
                ? `${alertingCount} monitor${alertingCount !== 1 ? 's' : ''} need${alertingCount === 1 ? 's' : ''} review`
                : `${activeCount} active · ${pausedCount} paused · all clear`}
            </p>
          )}
        </div>
        <AddMonitorButton />
      </div>

      {/* Stat pills */}
      {urls.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <StatPill label={`${activeCount} Active`} color="#16A34A" bg="rgba(22,163,74,0.08)" border="rgba(22,163,74,0.18)" dot />
          {pausedCount > 0 && (
            <StatPill label={`${pausedCount} Paused`} color="#6B7280" bg="rgba(107,114,128,0.07)" border="rgba(107,114,128,0.15)"
              icon={<Pause size={9} />} />
          )}
          {alertingCount > 0 && (
            <StatPill label={`${alertingCount} Need review`} color="#EF4444" bg="rgba(239,68,68,0.07)" border="rgba(239,68,68,0.18)"
              icon={<AlertTriangle size={9} />} />
          )}
          {archiveCount > 0 && (
            <StatPill label={`${archiveCount} Archive`} color="#6B7280" bg="rgba(107,114,128,0.07)" border="rgba(107,114,128,0.15)"
              icon={<Archive size={9} />} />
          )}
        </div>
      )}

      {/* Empty state */}
      {urls.length === 0 ? (
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
            No monitors yet
          </h2>
          <p style={{ fontSize: 12, color: '#6B7280', maxWidth: 300, lineHeight: 1.65, marginBottom: 20 }}>
            Add public URLs to watch. We'll screenshot on your schedule and use AI to explain any visual changes.
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
        /* Monitor list */
        <div style={{
          background: 'white', border: '1px solid #E5E7EB',
          borderRadius: 8, overflow: 'hidden',
        }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '24px 1fr 80px 80px 80px 140px 28px',
            padding: '8px 14px',
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

          {urls.map((url: any, idx: number) => {
            const openCount = openCountMap.get(url.id) ?? 0
            const lastAlert = lastAlertMap.get(url.id)
            return (
              <MonitorRow
                key={url.id}
                isLast={idx === urls.length - 1}
                showLastChange
                url={{
                  id: url.id,
                  name: url.name,
                  url: url.url,
                  is_active: url.is_active,
                  mode: url.mode,
                  check_frequency: url.check_frequency,
                  last_checked_at: url.last_checked_at,
                  openAlertCount: openCount,
                  lastAlertDiffPct: lastAlert?.diff_pct ?? null,
                  lastAlertSummary: lastAlert?.ai_summary ?? null,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, color, bg, border, dot, icon }: {
  label: string; color: string; bg: string; border: string; dot?: boolean; icon?: React.ReactNode
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 9px', borderRadius: 6,
      background: bg, border: `1px solid ${border}`,
      fontSize: 11, fontWeight: 600, color,
    }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} /> : icon}
      {label}
    </span>
  )
}
