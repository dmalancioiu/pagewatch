import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { Globe, ArrowRight, Pause, Clock, Archive, Eye, Sparkles, AlertTriangle, CheckCircle2, Plus } from 'lucide-react'
import { AddMonitorButton } from '@/components/dashboard/AddMonitorButton'

export const metadata = { title: 'Monitors — PageWatch' }

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
    if (!lastAlertMap.has(a.monitored_url_id)) {
      lastAlertMap.set(a.monitored_url_id, a)
    }
  }

  const activeCount = urls.filter((u: any) => u.is_active).length
  const pausedCount = urls.filter((u: any) => !u.is_active).length
  const archiveCount = urls.filter((u: any) => u.mode === 'archive').length
  const alertingCount = urls.filter((u: any) => (openCountMap.get(u.id) ?? 0) > 0).length

  return (
    <div style={{ fontFamily: SF, display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 48 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.025em', lineHeight: 1 }}>
            Monitors
          </h1>
          <p style={{ fontSize: 13, color: alertingCount > 0 ? '#FF3B30' : '#6E6E73', marginTop: 6, letterSpacing: '-0.01em' }}>
            {urls.length === 0
              ? 'No monitors yet.'
              : alertingCount > 0
              ? `${alertingCount} monitor${alertingCount !== 1 ? 's' : ''} need${alertingCount === 1 ? 's' : ''} review.`
              : `${activeCount} active, ${pausedCount} paused. All clear.`}
          </p>
        </div>
        <AddMonitorButton />
      </div>

      {/* ── Stat Pills ── */}
      {urls.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <StatPill label={`${activeCount} Active`} color="#16A34A" bg="rgba(22,163,74,0.08)" dot />
          {pausedCount > 0 && <StatPill label={`${pausedCount} Paused`} color="#8E8E93" bg="#F0F0F5" icon={<Pause style={{ width: 10, height: 10 }} />} />}
          {alertingCount > 0 && <StatPill label={`${alertingCount} Need review`} color="#FF3B30" bg="rgba(255,59,48,0.08)" icon={<AlertTriangle style={{ width: 10, height: 10 }} />} />}
          {archiveCount > 0 && <StatPill label={`${archiveCount} Archive`} color="#8E8E93" bg="#F0F0F5" icon={<Archive style={{ width: 10, height: 10 }} />} />}
        </div>
      )}

      {/* ── Empty State ── */}
      {urls.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 20, border: '0.5px dashed rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '72px 24px', textAlign: 'center',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(22,163,74,0.08)', border: '0.5px solid rgba(22,163,74,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Globe style={{ width: 24, height: 24, color: '#16A34A' }} />
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', marginBottom: 8 }}>No monitors yet</h2>
          <p style={{ fontSize: 13, color: '#6E6E73', maxWidth: 320, lineHeight: 1.65, marginBottom: 24 }}>
            Add public URLs to watch. We'll screenshot on your schedule and use AI to explain any visual changes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28, textAlign: 'left' }}>
            {[
              { icon: <Eye style={{ width: 12, height: 12, color: '#5856D6' }} />, text: 'Watch mode — diff + alert on any change' },
              { icon: <Archive style={{ width: 12, height: 12, color: '#8E8E93' }} />, text: 'Archive mode — screenshot only, no alerts' },
              { icon: <Sparkles style={{ width: 12, height: 12, color: '#16A34A' }} />, text: 'AI explains every change in plain English' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.icon}
                <span style={{ fontSize: 12, color: '#6E6E73' }}>{item.text}</span>
              </div>
            ))}
          </div>
          <AddMonitorButton />
        </div>
      ) : (
        /* ── Monitor List ── */
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>

          {/* Column Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 180px 60px', padding: '9px 20px', background: '#FAFAFA', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            {['Monitor', 'Mode', 'Schedule', 'Last Check', 'Last Change', ''].map(h => (
              <span key={h} style={{ fontSize: 9, fontWeight: 700, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
            ))}
          </div>

          {urls.map((url: any, idx: number) => {
            const isPaused = !url.is_active
            const isArchive = url.mode === 'archive'
            const openCount = openCountMap.get(url.id) ?? 0
            const lastAlert = lastAlertMap.get(url.id)
            const stale = isStale(url)
            const sv = lastAlert ? severity(lastAlert.diff_pct) : null
            let domain = url.url
            try { domain = new URL(url.url).hostname } catch {}

            return (
              <Link
                key={url.id}
                href={`/dashboard/urls/${url.id}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px 100px 180px 60px',
                  alignItems: 'center',
                  padding: '13px 20px',
                  borderBottom: idx < urls.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none',
                  textDecoration: 'none',
                  background: 'white',
                  opacity: isPaused ? 0.55 : 1,
                }}
                className="dashboard-monitor-row"
              >
                {/* Monitor info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, paddingRight: 12 }}>
                  {/* Status dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: isPaused ? '#D1D1D6' : stale ? '#FF9500' : openCount > 0 ? '#FF3B30' : '#30D158',
                    boxShadow: openCount > 0 && !isPaused ? '0 0 0 3px rgba(255,59,48,0.12)'
                      : stale ? '0 0 0 3px rgba(255,149,0,0.12)' : 'none',
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.015em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                      {url.name}
                    </p>
                    <p style={{ fontSize: 11, fontFamily: 'ui-monospace, "SF Mono", monospace', color: '#AEAEB2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {domain}
                    </p>
                  </div>
                </div>

                {/* Mode */}
                {isArchive ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#8E8E93', background: '#F0F0F5', padding: '3px 8px', borderRadius: 5, width: 'fit-content', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Archive style={{ width: 9, height: 9 }} /> Archive
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#5856D6', background: 'rgba(88,86,214,0.08)', padding: '3px 8px', borderRadius: 5, width: 'fit-content', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye style={{ width: 9, height: 9 }} /> Watch
                  </span>
                )}

                {/* Schedule */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock style={{ width: 10, height: 10, color: '#D1D1D6', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#6E6E73', textTransform: 'capitalize', letterSpacing: '-0.01em' }}>
                    {url.check_frequency}
                  </span>
                </div>

                {/* Last check */}
                <div>
                  {isPaused ? (
                    <span style={{ fontSize: 11, color: '#D1D1D6', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Pause style={{ width: 9, height: 9 }} /> Paused
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: stale ? '#FF9500' : '#AEAEB2', fontWeight: stale ? 600 : 400, letterSpacing: '-0.01em' }}>
                      {timeAgo(url.last_checked_at)}
                    </span>
                  )}
                </div>

                {/* Last change */}
                <div style={{ minWidth: 0, paddingRight: 8 }}>
                  {lastAlert ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <div style={{ flexShrink: 0, marginTop: 1 }}>
                        {sv && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: sv.color, background: sv.bg, padding: '2px 6px', borderRadius: 4 }}>
                            {Number(lastAlert.diff_pct ?? 0).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: '#6E6E73', lineHeight: 1.45, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                        {lastAlert.ai_summary
                          ? lastAlert.ai_summary.split('.')[0] + '.'
                          : 'Visual change detected.'}
                      </p>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: '#D1D1D6' }}>No changes yet</span>
                  )}
                </div>

                {/* Open alert badge / arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                  {openCount > 0 && !isPaused ? (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#FF3B30', background: 'rgba(255,59,48,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                      {openCount}
                    </span>
                  ) : null}
                  <ArrowRight style={{ width: 13, height: 13, color: '#D1D1D6', flexShrink: 0 }} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatPill({ label, color, bg, dot, icon }: { label: string; color: string; bg: string; dot?: boolean; icon?: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: bg, fontSize: 11, fontWeight: 700, color, letterSpacing: '-0.01em' }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} /> : icon}
      {label}
    </span>
  )
}
