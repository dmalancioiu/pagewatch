import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { getAlerts } from '@/lib/actions/alerts'
import { createServerClient } from '@/lib/supabase/server'
import { Globe, ArrowRight, CheckCircle2, Pause } from 'lucide-react'

/* ─── Helpers ─────────────────────────────────────────────────────────── */

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
  if (!pct || pct < 5)  return { color: '#ffcc44', bg: 'rgba(255,200,68,0.08)',  border: 'rgba(255,200,68,0.18)'  }
  if (pct < 15)         return { color: '#ff9944', bg: 'rgba(255,130,68,0.10)', border: 'rgba(255,130,68,0.2)'  }
  return                       { color: '#ff5555', bg: 'rgba(255,68,68,0.12)',  border: 'rgba(255,68,68,0.22)'   }
}

function fallbackSummary(pct: number | null, urlName: string): string {
  if (!pct) return `Change detected on ${urlName}`
  if (pct >= 50) return 'Major layout change. Page structure significantly altered.'
  if (pct >= 25) return 'Significant visual change. Multiple elements appear to have shifted.'
  if (pct >= 10) return 'Moderate change. Some content or styling was updated.'
  return 'Minor change. Small text or styling update detected.'
}

const FREQ_LABEL: Record<string, string> = {
  hourly: '1h', daily: '24h', weekly: '7d',
}

/* ─── Stat card ───────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, accent }: {
  label:   string
  value:   string | number
  sub?:    string
  accent?: boolean
}) {
  return (
    <div
      className="dash-card px-5 py-4"
      style={accent ? { borderColor: 'rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.03)' } : {}}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2"
         style={{ color: 'var(--text-dim)' }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold tracking-tight leading-none"
        style={{ color: accent ? '#00ff88' : 'var(--text-primary)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-dim)' }}>{sub}</p>
      )}
    </div>
  )
}

/* ─── Alert card ──────────────────────────────────────────────────────── */

function AlertCard({ alert }: { alert: any }) {
  const { color, bg, border } = severityStyle(alert.diff_pct)
  const urlName = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? 'Unknown'
  const urlRaw  = alert.monitored_urls?.url ?? ''
  const summary = alert.ai_summary || fallbackSummary(alert.diff_pct, urlName)
  const age     = timeAgo(alert.created_at)
  const diffPct = alert.diff_pct != null ? `${Number(alert.diff_pct).toFixed(1)}%` : '—'

  return (
    <div className="dash-card p-4 flex gap-4 transition-colors">
      {/* Diff thumbnail */}
      <div
        className="diff-thumb w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
        aria-hidden
      >
        <span className="text-xl" style={{ color, position: 'relative', zIndex: 1 }}>⚡</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{urlName}</p>
            <p className="text-[11px] font-mono truncate" style={{ color: 'var(--text-dim)' }}>
              {urlRaw}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-md"
              style={{ color, background: bg, border: `1px solid ${border}` }}
            >
              {diffPct}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              {age}
            </span>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
          {summary}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/alerts"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.18)' }}
          >
            View diff <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            href="/dashboard/alerts"
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Acknowledge
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── URL row ─────────────────────────────────────────────────────────── */

function UrlRow({ url }: { url: any }) {
  const freq     = FREQ_LABEL[url.check_frequency] ?? url.check_frequency
  const isPaused = !url.is_active
  let domain = url.url
  try { domain = new URL(url.url).hostname } catch {}

  return (
    <Link
      href={`/dashboard/urls/${url.id}`}
      className="dash-row flex items-center gap-3 px-4 py-3 transition-colors"
      style={{ borderBottom: '1px solid var(--border)', opacity: isPaused ? 0.6 : 1 }}
    >
      {isPaused ? (
        <Pause className="w-2 h-2 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: url.last_checked_at ? '#00ff88' : 'var(--text-faint)',
            boxShadow:  url.last_checked_at ? '0 0 5px rgba(0,255,136,0.5)' : 'none',
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{url.name}</p>
          {isPaused && (
            <span className="text-[9px] font-semibold px-1 py-0.5 rounded flex-shrink-0"
                  style={{ color: 'var(--text-dim)', background: 'var(--border)' }}>
              Paused
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono truncate" style={{ color: 'var(--text-dim)' }}>
          {domain}
        </p>
      </div>
      <span
        className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
        style={{ background: 'var(--border)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}
      >
        {freq}
      </span>
      <span className="text-[11px] flex-shrink-0 w-14 text-right" style={{ color: 'var(--text-dim)' }}>
        {timeAgo(url.last_checked_at)}
      </span>
    </Link>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────── */

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

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const hasAlerts = (alerts as any[]).length > 0
  const hasUrls   = urls.length > 0

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{greeting}.</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {hasAlerts
            ? `${alerts.length} open alert${alerts.length !== 1 ? 's' : ''} need${alerts.length === 1 ? 's' : ''} your attention.`
            : hasUrls
            ? 'All your pages look the same as last check.'
            : 'Add your first URL to start monitoring.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="URLs Monitored" value={urls.length}       sub="active pages"       />
        <StatCard label="Checks Today"   value={checksToday ?? 0}  sub="screenshots taken"  />
        <StatCard label="Open Alerts"    value={alerts.length}
                  sub={alerts.length > 0 ? 'require attention' : 'everything clean'}
                  accent={alerts.length > 0} />
      </div>

      {/* Content */}
      {!hasUrls ? (
        <div className="dash-card flex flex-col items-center justify-center py-28 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)' }}
          >
            <Globe className="w-6 h-6" style={{ color: '#00ff88' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Nothing to watch yet.</h2>
          <p className="text-sm max-w-xs mb-8" style={{ color: 'var(--text-muted)' }}>
            Add a URL and we'll screenshot it on a schedule, then alert you the moment something changes.
          </p>
          <Link href="/dashboard/urls" className="btn-neon flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            Add your first URL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">

          {/* Alert feed */}
          <div className="xl:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent alerts</h2>
              {hasAlerts && (
                <Link href="/dashboard/alerts"
                      className="text-xs font-medium flex items-center gap-1"
                      style={{ color: 'var(--text-muted)' }}>
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
              <div className="dash-card flex flex-col items-center py-16 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.14)' }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#00ff88' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>All clear.</p>
                <p className="text-xs max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                  No open alerts. We'll notify you the moment something changes.
                </p>
              </div>
            )}
          </div>

          {/* URL list */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monitored URLs</h2>
              <Link href="/dashboard/urls"
                    className="text-xs font-medium flex items-center gap-1"
                    style={{ color: 'var(--text-muted)' }}>
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
              {urls.map((u: any) => <UrlRow key={u.id} url={u} />)}
              <div className="px-4 py-3">
                <Link
                  href="/dashboard/urls"
                  className="text-xs font-medium flex items-center gap-1.5 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <span style={{ color: '#00ff88' }}>+</span>
                  Add another URL
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
