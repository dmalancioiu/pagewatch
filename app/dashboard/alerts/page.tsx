import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { BellRing, CheckCircle2, Clock, ShieldAlert, Sparkles, ArrowRight, Activity } from 'lucide-react'

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

function fallbackSummary(pct: number | null, urlName: string): string {
  if (!pct) return `Visual change detected on ${urlName}.`
  if (pct >= 50) return 'Major layout change — page structure significantly altered.'
  if (pct >= 25) return 'Significant visual change — multiple elements shifted.'
  if (pct >= 10) return 'Moderate change — content or styling was updated.'
  return 'Minor change — small text or styling update.'
}

function AlertRow({ alert }: { alert: any }) {
  const urlName = alert.monitored_urls?.name ?? alert.monitored_urls?.url ?? 'Unknown'
  const urlRaw = alert.monitored_urls?.url ?? ''
  const summary = alert.ai_summary || fallbackSummary(alert.diff_pct, urlName)
  const age = timeAgo(alert.created_at)
  const isOpen = alert.status === 'open'

  let domain = urlRaw
  try { domain = new URL(urlRaw).hostname } catch {}

  return (
    <Link
      href={`/dashboard/urls/${alert.monitored_url_id}`}
      style={{ display: 'block', textDecoration: 'none' }}
      className="alert-row-link"
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '13px 20px', borderBottom: '1px solid #F3F4F6',
        transition: 'background 0.1s',
        opacity: isOpen ? 1 : 0.75,
      }}
        className={isOpen ? 'alert-row-open' : 'alert-row-ack'}
      >
        {/* Status col */}
        <div style={{ paddingTop: 3, flexShrink: 0 }}>
          {isOpen ? (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 99,
              background: '#FEE2E2', color: '#DC2626',
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              whiteSpace: 'nowrap'
            }}>
              <ShieldAlert style={{ width: 9, height: 9 }} /> Open
            </span>
          ) : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 99,
              background: '#F3F4F6', color: '#9CA3AF',
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              whiteSpace: 'nowrap'
            }}>
              <CheckCircle2 style={{ width: 9, height: 9 }} /> Done
            </span>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{urlName}</span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#9CA3AF' }}>{domain}</span>
            {alert.diff_pct != null && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: isOpen ? '#DC2626' : '#9CA3AF',
                background: isOpen ? '#FEF2F2' : '#F3F4F6',
                padding: '1px 6px', borderRadius: 4,
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                {Number(alert.diff_pct).toFixed(1)}% diff
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <Sparkles style={{ width: 10, height: 10, color: isOpen ? '#FCA5A5' : '#D1D5DB', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: isOpen ? '#374151' : '#9CA3AF', lineHeight: 1.55 }}>
              {summary}
            </p>
          </div>
        </div>

        {/* Right col: time + arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock style={{ width: 10, height: 10, color: '#D1D5DB' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{age}</span>
          </div>
          <ArrowRight style={{ width: 13, height: 13, color: '#E5E7EB' }} />
        </div>
      </div>
    </Link>
  )
}

export default async function AlertsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()

  const { data: alerts } = await supabase
    .from('alerts')
    .select('*, monitored_urls(name, url)')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  const safeAlerts = alerts ?? []
  const openAlerts = safeAlerts.filter((a: any) => a.status === 'open')
  const resolvedAlerts = safeAlerts.filter((a: any) => a.status !== 'open')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 13, paddingBottom: 48 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>Alerts</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
            Visual change history across all your monitors.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', background: 'white', borderRadius: 8,
            border: '1px solid #E5E7EB', fontSize: 12, fontWeight: 600, color: '#6B7280'
          }}>
            <BellRing style={{ width: 13, height: 13, color: '#9CA3AF' }} />
            {safeAlerts.length} total
          </div>
          {openAlerts.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: '#FEF2F2', borderRadius: 8,
              border: '1px solid rgba(220,38,38,0.2)', fontSize: 12, fontWeight: 700, color: '#DC2626'
            }}>
              <ShieldAlert style={{ width: 13, height: 13 }} />
              {openAlerts.length} open
            </div>
          )}
        </div>
      </div>

      {/* ── Empty State ── */}
      {safeAlerts.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '72px 24px', textAlign: 'center'
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#F3F4F6', border: '1px solid #E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Activity style={{ width: 18, height: 18, color: '#D1D5DB' }} />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>No alerts yet</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF', maxWidth: 280, lineHeight: 1.6 }}>
            Once a monitored page has a visual change, the AI analysis and diff will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Open alerts */}
          {openAlerts.length > 0 && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(220,38,38,0.2)', overflow: 'hidden' }}>
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid #FEE2E2',
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(254,242,242,0.5)'
              }}>
                <ShieldAlert style={{ width: 13, height: 13, color: '#DC2626' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>Requires Attention</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: '#DC2626',
                  background: '#FEE2E2', padding: '1px 7px', borderRadius: 99
                }}>{openAlerts.length}</span>
              </div>
              {openAlerts.map((alert: any) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          )}

          {/* Resolved alerts */}
          {resolvedAlerts.length > 0 && (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <div style={{
                padding: '12px 20px', borderBottom: '1px solid #F3F4F6',
                display: 'flex', alignItems: 'center', gap: 8, background: '#FAFAFA'
              }}>
                <CheckCircle2 style={{ width: 13, height: 13, color: '#9CA3AF' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Acknowledged</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: '#9CA3AF',
                  background: '#F3F4F6', padding: '1px 7px', borderRadius: 99
                }}>{resolvedAlerts.length}</span>
              </div>
              {resolvedAlerts.map((alert: any) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
