import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { Globe, ArrowRight, Pause } from 'lucide-react'

export const metadata = { title: 'URLs — PageWatch' }

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const FREQ_COLORS: Record<string, { color: string; bg: string }> = {
  hourly: { color: '#00ff88',  bg: 'rgba(0,255,136,0.08)'  },
  daily:  { color: '#aabbff',  bg: 'rgba(120,140,255,0.08)' },
  weekly: { color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.05)' },
}

export default async function UrlsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const urls = await getMonitoredUrls(workspace.id)

  const { data: alertCounts } = await supabase
    .from('alerts')
    .select('monitored_url_id')
    .eq('workspace_id', workspace.id)
    .eq('status', 'open')

  const countMap = new Map<string, number>()
  for (const a of alertCounts ?? []) {
    countMap.set(a.monitored_url_id, (countMap.get(a.monitored_url_id) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Monitored URLs</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {urls.filter((u: any) => u.is_active).length} active · {urls.filter((u: any) => !u.is_active).length} paused
          </p>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          Use the <span style={{ color: '#00ff88' }}>+ Add URL</span> button in the sidebar.
        </p>
      </div>

      {/* Empty state */}
      {urls.length === 0 ? (
        <div className="dash-card flex flex-col items-center py-28 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)' }}
          >
            <Globe className="w-6 h-6" style={{ color: '#00ff88' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Nothing to watch yet.</h2>
          <p className="text-sm max-w-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Add the pages you want to monitor. We&apos;ll take full-page screenshots on your schedule
            and alert you when something visually changes.
          </p>
          <p className="text-sm" style={{ color: 'rgba(0,255,136,0.8)' }}>
            Click &ldquo;+ Add URL&rdquo; in the sidebar to get started.
          </p>
        </div>
      ) : (
        /* URL table */
        <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
          {/* Table header */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: '1fr 80px 80px 80px 60px 40px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--border)',
            }}
          >
            {['Page', 'Schedule', 'Threshold', 'Last check', 'Alerts', ''].map((h) => (
              <span key={h} className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-dim)' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {urls.map((url: any) => {
            const openCount = countMap.get(url.id) ?? 0
            const freqStyle = FREQ_COLORS[url.check_frequency] ?? FREQ_COLORS.daily
            const isPaused  = !url.is_active

            let domain = url.url
            try { domain = new URL(url.url).hostname } catch {}

            return (
              <div
                key={url.id}
                className="grid items-center px-5 py-3.5 group transition-colors dash-row"
                style={{
                  gridTemplateColumns: '1fr 80px 80px 80px 60px 40px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  opacity: isPaused ? 0.65 : 1,
                }}
              >
                {/* Page name */}
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {isPaused ? (
                    <Pause className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                  ) : (
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: openCount > 0 ? '#ff4444' : url.last_checked_at ? '#00ff88' : 'var(--text-faint)',
                        boxShadow:  openCount > 0 ? '0 0 5px rgba(255,68,68,0.5)' : url.last_checked_at ? '0 0 5px rgba(0,255,136,0.4)' : 'none',
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/urls/${url.id}`}
                        className="text-sm font-medium hover:text-neon truncate block transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {url.name}
                      </Link>
                      {isPaused && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ color: 'var(--text-dim)', background: 'var(--border)', border: '1px solid var(--border)' }}
                        >
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono truncate" style={{ color: 'var(--text-dim)' }}>
                      {domain}
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <span
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg w-fit"
                  style={{
                    color:       isPaused ? 'var(--text-dim)' : freqStyle.color,
                    background:  isPaused ? 'var(--border)'   : freqStyle.bg,
                  }}
                >
                  {url.check_frequency.charAt(0).toUpperCase() + url.check_frequency.slice(1)}
                </span>

                {/* Threshold */}
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  ≥{url.threshold_pct}%
                </span>

                {/* Last check */}
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {timeAgo(url.last_checked_at)}
                </span>

                {/* Alert count / paused */}
                {isPaused ? (
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>—</span>
                ) : openCount > 0 ? (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-md w-fit"
                    style={{ color: '#ff7070', background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.2)' }}
                  >
                    {openCount}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>—</span>
                )}

                {/* Actions */}
                <Link
                  href={`/dashboard/urls/${url.id}`}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  style={{ background: 'var(--border)' }}
                >
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      {urls.length > 0 && (
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Screenshots run on each URL's check schedule.{' '}
          <Link href="/dashboard/schedules" className="underline hover:text-white/50 transition-colors">
            Trigger a manual run
          </Link>{' '}
          to check immediately.
        </p>
      )}
    </div>
  )
}
