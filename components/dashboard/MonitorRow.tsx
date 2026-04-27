import Link from 'next/link'
import { Clock, Archive, Eye, ChevronRight, AlertTriangle } from 'lucide-react'

interface MonitorRowData {
  id: string
  name: string
  url: string
  is_active: boolean
  mode: 'watch' | 'archive'
  check_frequency: 'hourly' | 'daily' | 'weekly'
  last_checked_at: string | null
  openAlertCount: number
  lastAlertDiffPct?: number | null
  lastAlertSummary?: string | null
}

interface MonitorRowProps {
  url: MonitorRowData
  isLast?: boolean
  showLastChange?: boolean
}

function timeAgo(ts: string | null) {
  if (!ts) return 'Never'
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

const FREQ_LABEL: Record<string, string> = {
  hourly: 'Hourly',
  daily:  'Daily',
  weekly: 'Weekly',
}

export function MonitorRow({ url, isLast, showLastChange = true }: MonitorRowProps) {
  const domain = getDomain(url.url)
  const isStale = url.last_checked_at
    ? Date.now() - new Date(url.last_checked_at).getTime() > 25 * 60 * 60 * 1000
    : false

  let dotColor = '#22C55E'
  if (!url.is_active) dotColor = '#D1D5DB'
  else if (url.openAlertCount > 0) dotColor = '#EF4444'
  else if (isStale) dotColor = '#F59E0B'

  return (
    <Link
      href={`/dashboard/urls/${url.id}`}
      className="monitor-row"
      style={{
        display: 'grid',
        gridTemplateColumns: showLastChange
          ? '24px 1fr 80px 80px 80px 140px 28px'
          : '24px 1fr 80px 80px 80px 28px',
        alignItems: 'center',
        gap: 0,
        padding: '9px 14px',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background 0.1s',
      }}
    >
      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          boxShadow: url.openAlertCount > 0
            ? '0 0 0 3px rgba(239,68,68,0.15)'
            : undefined,
        }} />
      </div>

      {/* Name + domain */}
      <div style={{ minWidth: 0, paddingRight: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
          {url.name}
        </p>
        <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'ui-monospace,monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>
          {domain}
        </p>
      </div>

      {/* Mode badge */}
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 10, fontWeight: 600,
          padding: '2px 6px', borderRadius: 4,
          ...(url.mode === 'archive'
            ? { color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB' }
            : { color: '#7C3AED', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }),
        }}>
          {url.mode === 'archive' ? <Archive size={9} /> : <Eye size={9} />}
          {url.mode === 'archive' ? 'Archive' : 'Watch'}
        </span>
      </div>

      {/* Schedule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7280' }}>
        <Clock size={10} />
        <span style={{ fontSize: 11 }}>{FREQ_LABEL[url.check_frequency] ?? url.check_frequency}</span>
      </div>

      {/* Last check */}
      <div>
        <span style={{
          fontSize: 11,
          color: isStale ? '#F59E0B' : '#6B7280',
          fontWeight: isStale ? 600 : 400,
        }}>
          {timeAgo(url.last_checked_at)}
        </span>
      </div>

      {/* Last change (optional) */}
      {showLastChange && (
        <div style={{ minWidth: 0, paddingRight: 8 }}>
          {url.openAlertCount > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={10} style={{ color: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: '#EF4444' }}>
                {url.openAlertCount} open
              </span>
              {url.lastAlertDiffPct != null && (
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                  · {Number(url.lastAlertDiffPct).toFixed(1)}%
                </span>
              )}
            </div>
          ) : url.lastAlertSummary ? (
            <span style={{
              fontSize: 10, color: '#9CA3AF',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {url.lastAlertSummary}
            </span>
          ) : (
            <span style={{ fontSize: 10, color: '#D1D5DB' }}>No changes yet</span>
          )}
        </div>
      )}

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ChevronRight size={13} style={{ color: '#D1D5DB' }} />
      </div>
    </Link>
  )
}
