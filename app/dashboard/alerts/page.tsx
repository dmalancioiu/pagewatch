import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getAlerts } from '@/lib/actions/alerts'
import { ArrowRight, CheckCircle2, Bell } from 'lucide-react'

export const metadata = { title: 'Alerts — PageWatch' }

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
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

function fallbackSummary(pct: number | null): string {
  if (!pct) return 'Change detected on this page.'
  if (pct >= 50) return 'Major layout change. Page structure significantly altered.'
  if (pct >= 25) return 'Significant visual change. Multiple elements appear to have shifted.'
  if (pct >= 10) return 'Moderate change. Some content or styling was updated.'
  return 'Minor change. Small text or styling update detected.'
}

function AlertCard({ alert, status }: { alert: any; status: string }) {
  const { color, bg, border } = severityStyle(alert.diff_pct)
  const urlName = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? 'Unknown'
  const urlRaw  = alert.monitored_urls?.url ?? ''
  const diffPct = alert.diff_pct != null ? `${Number(alert.diff_pct).toFixed(1)}%` : '—'
  const age     = timeAgo(alert.created_at)
  const ack     = alert.status !== 'open'

  return (
    <div
      className="dash-card p-5 flex gap-5"
      style={{
        opacity: ack ? 0.5 : 1,
        transition: 'border-color 0.15s',
      }}
    >
      {/* Diff thumb */}
      <div
        className="diff-thumb w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ opacity: ack ? 0.6 : 1 }}
        aria-hidden
      >
        <span className="text-2xl" style={{ color, position: 'relative', zIndex: 1 }}>⚡</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Link
                href={`/dashboard/urls/${alert.monitored_url_id}`}
                className="text-sm font-semibold text-white hover:underline truncate"
              >
                {urlName}
              </Link>
              {ack && (
                <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                  {alert.status}
                </span>
              )}
            </div>
            <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {urlRaw}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span
              className="text-sm font-bold px-2.5 py-1 rounded-lg"
              style={{ color, background: bg, border: `1px solid ${border}` }}
            >
              {diffPct}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {age}
            </span>
          </div>
        </div>

        {/* AI summary */}
        <div
          className="rounded-xl px-3 py-2.5 mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1 h-1 rounded-full" style={{ background: '#00ff88' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(0,255,136,0.6)' }}>
              AI Summary
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {alert.ai_summary || fallbackSummary(alert.diff_pct)}
          </p>
        </div>

        {/* Actions */}
        {!ack && (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/urls/${alert.monitored_url_id}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.18)' }}
            >
              View diff <ArrowRight className="w-3 h-3" />
            </Link>
            <form action={`/api/alerts/${alert.id}/acknowledge`} method="post">
              <button
                type="submit"
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                Acknowledge
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

type FilterTab = 'open' | 'acknowledged' | 'all'

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const params = await searchParams
  const filter = (params.filter ?? 'open') as FilterTab

  const statusMap: Record<FilterTab, string | undefined> = {
    open: 'open', acknowledged: 'acknowledged', all: undefined,
  }

  const alerts = await getAlerts(workspace.id, statusMap[filter])

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'open',         label: 'Open'         },
    { id: 'acknowledged', label: 'Acknowledged'  },
    { id: 'all',          label: 'All'           },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Alerts</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {alerts.length} {filter === 'all' ? 'total' : filter} alert{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/alerts?filter=${tab.id}`}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background:  filter === tab.id ? '#111'                    : 'transparent',
              color:       filter === tab.id ? 'white'                   : 'rgba(255,255,255,0.4)',
              border:      filter === tab.id ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length === 0 ? (
        <div className="dash-card flex flex-col items-center py-24 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.14)' }}
          >
            {filter === 'open'
              ? <CheckCircle2 className="w-6 h-6" style={{ color: '#00ff88' }} />
              : <Bell        className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.3)' }} />
            }
          </div>
          <p className="text-base font-semibold text-white mb-2">
            {filter === 'open' ? 'No open alerts.' : 'No alerts here.'}
          </p>
          <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {filter === 'open'
              ? "All your pages look the same as last check. We'll alert you the moment something changes."
              : 'Nothing to show for this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(alerts as any[]).map((a: any) => (
            <AlertCard key={a.id} alert={a} status={filter} />
          ))}
        </div>
      )}
    </div>
  )
}
