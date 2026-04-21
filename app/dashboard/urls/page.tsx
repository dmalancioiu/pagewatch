import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { Globe, ArrowRight, Pause, AlertCircle, Clock, Archive } from 'lucide-react'

export const metadata = { title: 'Monitors — PageWatch' }

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

  const activeCount = urls.filter((u: any) => u.is_active).length
  const pausedCount = urls.filter((u: any) => !u.is_active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#111827' }}>Monitors</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            {activeCount} active{pausedCount > 0 ? ` · ${pausedCount} paused` : ''}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {urls.length === 0 ? (
        <div className="dash-card flex flex-col items-center py-24 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <Globe className="w-5 h-5" style={{ color: '#16A34A' }} />
          </div>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#111827' }}>No monitors yet</h2>
          <p className="text-sm max-w-sm mb-6" style={{ color: '#6B7280' }}>
            Add the pages you want to watch. We'll take screenshots on your schedule
            and alert you when something visually changes.
          </p>
          <p className="text-sm font-medium" style={{ color: '#16A34A' }}>
            Click "Add monitor" in the sidebar to get started.
          </p>
        </div>
      ) : (
        /* Monitor table */
        <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
          {/* Table header */}
          <div
            className="grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: '1fr 90px 100px 80px 36px',
              borderBottom: '1px solid #F3F4F6',
              background: '#F8FAFC',
            }}
          >
            {['Page', 'Schedule', 'Last check', 'Alerts', ''].map((h) => (
              <span
                key={h}
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: '#9CA3AF' }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {urls.map((url: any) => {
            const openCount = countMap.get(url.id) ?? 0
            const isPaused  = !url.is_active
            const isArchive = url.mode === 'archive'

            let domain = url.url
            try { domain = new URL(url.url).hostname } catch {}

            return (
              <div
                key={url.id}
                className="grid items-center px-5 py-3.5 group dash-row transition-colors"
                style={{
                  gridTemplateColumns: '1fr 90px 100px 80px 36px',
                  borderBottom: '1px solid #F3F4F6',
                  opacity: isPaused ? 0.6 : 1,
                }}
              >
                {/* Page name + status */}
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {isPaused ? (
                    <Pause className="w-2.5 h-2.5 flex-shrink-0" style={{ color: '#D1D5DB' }} />
                  ) : openCount > 0 ? (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 status-alert" />
                  ) : (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 status-ok" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/urls/${url.id}`}
                        className="text-sm font-medium truncate block transition-colors hover:underline"
                        style={{ color: '#111827' }}
                      >
                        {url.name}
                      </Link>
                      {isPaused && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ color: '#9CA3AF', background: '#F3F4F6', border: '1px solid #E5E7EB' }}
                        >
                          Paused
                        </span>
                      )}
                      {isArchive && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 flex items-center gap-1"
                          style={{ color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB' }}
                        >
                          <Archive className="w-2.5 h-2.5" />
                          Archive
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono truncate" style={{ color: '#9CA3AF' }}>
                      {domain}
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 flex-shrink-0" style={{ color: '#D1D5DB' }} />
                  <span className="text-xs capitalize" style={{ color: '#6B7280' }}>
                    {url.check_frequency}
                  </span>
                </div>

                {/* Last check */}
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  {timeAgo(url.last_checked_at)}
                </span>

                {/* Alert count */}
                {isPaused || isArchive ? (
                  <span className="text-xs" style={{ color: '#D1D5DB' }}>—</span>
                ) : openCount > 0 ? (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md w-fit"
                    style={{ color: '#B91C1C', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.2)' }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {openCount}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: '#D1D5DB' }}>—</span>
                )}

                {/* Arrow */}
                <Link
                  href={`/dashboard/urls/${url.id}`}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  style={{ background: '#F3F4F6' }}
                >
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: '#6B7280' }} />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
