import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { getAlerts } from '@/lib/actions/alerts'
import { createServerClient } from '@/lib/supabase/server'
import { Globe, ArrowRight, CheckCircle2, Pause, Plus } from 'lucide-react'

/* ─── Helpers ─── */

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

function severityStyle(pct: number | null) {
  if (!pct || pct < 5)  return { color: '#B45309', bg: 'rgba(180,83,9,0.07)',   border: 'rgba(180,83,9,0.18)'   }
  if (pct < 15)         return { color: '#C2410C', bg: 'rgba(194,65,12,0.07)',  border: 'rgba(194,65,12,0.18)'  }
  return                       { color: '#B91C1C', bg: 'rgba(185,28,28,0.07)',  border: 'rgba(185,28,28,0.2)'   }
}

function fallbackSummary(pct: number | null, urlName: string): string {
  if (!pct) return `Change detected on ${urlName}`
  if (pct >= 50) return 'Major layout change. Page structure significantly altered.'
  if (pct >= 25) return 'Significant visual change. Multiple elements appear to have shifted.'
  if (pct >= 10) return 'Moderate change. Some content or styling was updated.'
  return 'Minor change. Small text or styling update detected.'
}

const FREQ_LABEL: Record<string, string> = {
  hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly',
}

/* ─── Stat card ─── */

function StatCard({ label, value, sub, alert }: {
  label:   string
  value:   string | number
  sub?:    string
  alert?:  boolean
}) {
  return (
    <div
      className="dash-card px-5 py-4"
      style={alert ? { borderColor: 'rgba(185,28,28,0.25)', background: 'rgba(185,28,28,0.03)' } : {}}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold tracking-tight leading-none"
        style={{ color: alert ? '#B91C1C' : '#111827' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>{sub}</p>
      )}
    </div>
  )
}

/* ─── Alert card ─── */

function AlertCard({ alert }: { alert: any }) {
  const { color, bg, border } = severityStyle(alert.diff_pct)
  const urlName = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? 'Unknown'
  const urlRaw  = alert.monitored_urls?.url ?? ''
  const summary = alert.ai_summary || fallbackSummary(alert.diff_pct, urlName)
  const age     = timeAgo(alert.created_at)

  let domain = urlRaw
  try { domain = new URL(urlRaw).hostname } catch {}

  return (
    <div className="dash-card p-4 flex gap-4 dash-card-hover transition-all">
      {/* Severity stripe */}
      <div
        className="w-1 rounded-full flex-shrink-0 self-stretch"
        style={{ background: color, opacity: 0.7 }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#111827' }}>{urlName}</p>
            <p className="text-[11px] font-mono truncate" style={{ color: '#9CA3AF' }}>
              {domain}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{age}</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
          {summary}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/urls/${alert.monitored_url_id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            style={{ background: 'rgba(22,163,74,0.08)', color: '#15803D', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            Review <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Monitor row ─── */

function MonitorRow({ url }: { url: any }) {
  const freq     = FREQ_LABEL[url.check_frequency] ?? url.check_frequency
  const isPaused = !url.is_active
  let domain = url.url
  try { domain = new URL(url.url).hostname } catch {}

  return (
    <Link
      href={`/dashboard/urls/${url.id}`}
      className="dash-row flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        borderBottom: '1px solid #F3F4F6',
        opacity: isPaused ? 0.6 : 1,
      }}
    >
      {isPaused ? (
        <Pause className="w-2 h-2 flex-shrink-0" style={{ color: '#D1D5DB' }} />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0 status-ok"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{url.name}</p>
          {isPaused && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ color: '#9CA3AF', background: '#F3F4F6', border: '1px solid #E5E7EB' }}
            >
              Paused
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono truncate" style={{ color: '#9CA3AF' }}>
          {domain}
        </p>
      </div>
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0"
        style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}
      >
        {freq}
      </span>
      <span className="text-[11px] flex-shrink-0 w-16 text-right" style={{ color: '#9CA3AF' }}>
        {timeAgo(url.last_checked_at)}
      </span>
    </Link>
  )
}

/* ─── Page ─── */

export default async function DashboardPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()

  const [urls, alerts] = await Promise.all([
    getMonitoredUrls(workspace.id),
    getAlerts(workspace.id, 'open'),
  ])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const { count: checksToday } = await supabase
    .from('screenshot_snapshots')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)
    .gte('taken_at', todayStart.toISOString())

  const hasAlerts = (alerts as any[]).length > 0
  const hasUrls   = urls.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#111827' }}>Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            {hasAlerts
              ? `${alerts.length} open alert${alerts.length !== 1 ? 's' : ''} need${alerts.length === 1 ? 's' : ''} your attention.`
              : hasUrls
              ? 'All monitors are running normally.'
              : 'Add your first monitor to get started.'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Monitors"
          value={urls.filter((u: any) => u.is_active).length}
          sub={`${urls.filter((u: any) => !u.is_active).length} paused`}
        />
        <StatCard
          label="Checks today"
          value={checksToday ?? 0}
          sub="screenshots taken"
        />
        <StatCard
          label="Open alerts"
          value={alerts.length}
          sub={alerts.length > 0 ? 'require review' : 'everything clean'}
          alert={alerts.length > 0}
        />
      </div>

      {/* Empty state */}
      {!hasUrls ? (
        <div className="dash-card flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <Globe className="w-5 h-5" style={{ color: '#16A34A' }} />
          </div>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#111827' }}>No monitors yet</h2>
          <p className="text-sm max-w-xs mb-6" style={{ color: '#6B7280' }}>
            Add a page to monitor and we'll screenshot it on a schedule, alerting you when something changes.
          </p>
          <Link
            href="/dashboard/urls"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: '#16A34A', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add your first monitor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">

          {/* Alert feed */}
          <div className="xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: '#374151' }}>Recent alerts</h2>
              {hasAlerts && (
                <Link
                  href="/dashboard/alerts"
                  className="text-xs font-medium flex items-center gap-1 transition-colors"
                  style={{ color: '#6B7280' }}
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {hasAlerts ? (
              <div className="space-y-3">
                {(alerts as any[]).slice(0, 8).map((a: any) => (
                  <AlertCard key={a.id} alert={a} />
                ))}
              </div>
            ) : (
              <div className="dash-card flex flex-col items-center py-14 text-center">
                <CheckCircle2 className="w-8 h-8 mb-3" style={{ color: '#D1D5DB' }} />
                <p className="text-sm font-medium mb-1" style={{ color: '#374151' }}>All clear</p>
                <p className="text-xs max-w-[200px]" style={{ color: '#9CA3AF' }}>
                  No open alerts. We'll notify you the moment something changes.
                </p>
              </div>
            )}
          </div>

          {/* Monitor list */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: '#374151' }}>Monitors</h2>
              <Link
                href="/dashboard/urls"
                className="text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: '#6B7280' }}
              >
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
              {urls.map((u: any) => <MonitorRow key={u.id} url={u} />)}
              <div className="px-4 py-3">
                <button
                  className="text-xs font-medium flex items-center gap-1.5 transition-colors"
                  style={{ color: '#9CA3AF' }}
                >
                  <span style={{ color: '#16A34A' }}>+</span>
                  Add another monitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
