import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getAlerts } from '@/lib/actions/alerts'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

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
  if (!pct || pct < 5)  return { color: '#B45309', bg: 'rgba(180,83,9,0.07)',   border: 'rgba(180,83,9,0.18)'  }
  if (pct < 15)         return { color: '#C2410C', bg: 'rgba(194,65,12,0.07)',  border: 'rgba(194,65,12,0.18)' }
  return                       { color: '#B91C1C', bg: 'rgba(185,28,28,0.07)',  border: 'rgba(185,28,28,0.2)'  }
}

function fallbackSummary(pct: number | null): string {
  if (!pct) return 'A visual change was detected on this page.'
  if (pct >= 50) return 'Major layout change — the page structure was significantly altered.'
  if (pct >= 25) return 'Significant visual change — multiple elements appear to have shifted.'
  if (pct >= 10) return 'Moderate change — some content or styling was updated.'
  return 'Minor change — a small text or styling update was detected.'
}

function AlertRow({ alert, isAck }: { alert: any; isAck: boolean }) {
  const { color, bg, border } = severityStyle(alert.diff_pct)
  const urlName = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? 'Unknown'
  const urlRaw  = alert.monitored_urls?.url ?? ''
  const age     = timeAgo(alert.created_at)
  const summary = alert.ai_summary || fallbackSummary(alert.diff_pct)

  let domain = urlRaw
  try { domain = new URL(urlRaw).hostname } catch {}

  return (
    <div
      className="dash-card p-5"
      style={{ opacity: isAck ? 0.65 : 1 }}
    >
      <div className="flex items-start gap-4">
        {/* Severity indicator */}
        <div
          className="w-1 rounded-full flex-shrink-0 mt-1"
          style={{ background: color, height: '100%', minHeight: 48, opacity: 0.8 }}
        />

        <div className="flex-1 min-w-0">
          {/* Top row: monitor name + meta */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <Link
                  href={`/dashboard/urls/${alert.monitored_url_id}`}
                  className="text-sm font-semibold hover:underline truncate"
                  style={{ color: '#111827' }}
                >
                  {urlName}
                </Link>
                {isAck && (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB' }}
                  >
                    {alert.status}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono" style={{ color: '#9CA3AF' }}>
                {domain}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{age}</span>
            </div>
          </div>

          {/* AI summary */}
          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{ background: '#F8FAFC', border: '1px solid #F3F4F6' }}
          >
            <p className="text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>
              What changed
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
              {summary}
            </p>
          </div>

          {/* Actions */}
          {!isAck && (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/urls/${alert.monitored_url_id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                style={{ background: 'rgba(22,163,74,0.08)', color: '#15803D', border: '1px solid rgba(22,163,74,0.2)' }}
              >
                Review change <ArrowRight className="w-3 h-3" />
              </Link>
              <form action={`/api/alerts/${alert.id}/acknowledge`} method="post">
                <button
                  type="submit"
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}
                >
                  Acknowledge
                </button>
              </form>
            </div>
          )}
        </div>
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
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#111827' }}>Alerts</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
            {alerts.length} {filter === 'all' ? 'total' : filter} alert{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg w-fit"
        style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/alerts?filter=${tab.id}`}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background:  filter === tab.id ? '#FFFFFF'   : 'transparent',
              color:       filter === tab.id ? '#111827'   : '#6B7280',
              boxShadow:   filter === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length === 0 ? (
        <div className="dash-card flex flex-col items-center py-20 text-center">
          <CheckCircle2 className="w-10 h-10 mb-4" style={{ color: '#D1D5DB' }} />
          <p className="text-base font-semibold mb-1" style={{ color: '#374151' }}>
            {filter === 'open' ? 'No open alerts' : 'Nothing here'}
          </p>
          <p className="text-sm max-w-xs" style={{ color: '#9CA3AF' }}>
            {filter === 'open'
              ? "All your pages look the same as last check. We'll alert you the moment something changes."
              : 'Nothing to show for this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(alerts as any[]).map((a: any) => (
            <AlertRow key={a.id} alert={a} isAck={a.status !== 'open'} />
          ))}
        </div>
      )}
    </div>
  )
}
