import { notFound, redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import { WorkspaceTopBar } from '@/components/dashboard/WorkspaceTopBar'
import { UrlDetailClient } from './UrlDetailClient'
import { UrlDetailSettings } from './UrlDetailSettings'
import { ResizableInspectorLayout } from './ResizableInspectorLayout'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'

export const metadata = { title: 'Monitor — PageWatch' }

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

function nextCheckAt(url: any): string {
  const freq: string = url.check_frequency
  const last: string | null = url.last_checked_at
  const checkHour: number | null = url.check_hour ?? null

  if (!last) return 'Pending…'
  const now = new Date()
  const lastD = new Date(last)

  if (freq === 'hourly') {
    const next = new Date(lastD.getTime() + 60 * 60 * 1000)
    if (next <= now) return 'Imminent'
    return `~${Math.round((next.getTime() - now.getTime()) / 60000)}m`
  }

  if (checkHour != null) {
    const next = new Date()
    next.setUTCHours(checkHour, 0, 0, 0)
    if (freq === 'weekly') {
      const minNext = new Date(lastD.getTime() + 7 * 24 * 60 * 60 * 1000)
      while (next < minNext) next.setUTCDate(next.getUTCDate() + 1)
    } else if (next <= now) {
      next.setUTCDate(next.getUTCDate() + 1)
    }
    return next.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const ms = freq === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const next = new Date(lastD.getTime() + ms)
  if (next <= now) return 'Imminent'
  return `~${Math.round((next.getTime() - now.getTime()) / 3600000)}h`
}

function hostname(raw: string): string {
  try { return new URL(raw).hostname } catch { return raw }
}

export default async function UrlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const { id } = await params
  let urlData: any

  try {
    urlData = await getMonitoredUrlById(id)
  } catch {
    notFound()
  }

  if (!urlData || urlData.workspace_id !== workspace.id) notFound()

  const snapshots: any[] = (urlData.screenshot_snapshots ?? []).sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
  const alerts: any[] = (urlData.alerts ?? []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const openAlerts = alerts.filter((a: any) => a.status === 'open')

  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  const allPaths = [...snapshots.map((s: any) => s.storage_path), ...alerts.map((a: any) => a.diff_storage_path)]
  const signedUrlMap = await getSignedUrls(allPaths)

  const enrichedAlerts: AlertWithUrls[] = alerts.map((a: any) => {
    const prevSnap = snapshotById.get(a.previous_snapshot_id)
    const currSnap = snapshotById.get(a.current_snapshot_id)
    return {
      id: a.id,
      diff_pct: a.diff_pct,
      severity: a.severity,
      status: a.status,
      created_at: a.created_at,
      ai_summary: a.ai_summary,
      metadata: a.metadata ?? null,
      beforeUrl: prevSnap ? signedUrlMap.get(prevSnap.storage_path) ?? null : null,
      afterUrl: currSnap ? signedUrlMap.get(currSnap.storage_path) ?? null : null,
      diffUrl: a.diff_storage_path ? signedUrlMap.get(a.diff_storage_path) ?? null : null,
    }
  })

  const alertBySnapshotId: Record<string, AlertWithUrls> = {}
  for (const a of enrichedAlerts) {
    const rawAlert = alerts.find((ra: any) => ra.id === a.id)
    if (rawAlert?.current_snapshot_id) alertBySnapshotId[rawAlert.current_snapshot_id] = a
  }

  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((s: any) => ({ id: s.id, storage_path: s.storage_path, taken_at: s.taken_at, file_size_bytes: s.file_size_bytes, signedUrl: signedUrlMap.get(s.storage_path) ?? null }))
  const openAlert = enrichedAlerts.find((a) => a.status === 'open') ?? null

  const isPaused = !urlData.is_active
  const isArchive = urlData.mode === 'archive'
  const statusVariant = isPaused ? 'paused' : openAlerts.length > 0 ? 'alert' : isArchive ? 'archive' : 'healthy'

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9' }}>
      <WorkspaceTopBar name={urlData.name} url={urlData.url} statusVariant={statusVariant} lastChecked={timeAgo(urlData.last_checked_at)} nextRun={nextCheckAt(urlData)} urlId={urlData.id} isPaused={isPaused} />

      <ResizableInspectorLayout
        main={
          <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monitor workspace</p>
                <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.08, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.045em' }}>{urlData.name}</h1>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: openAlerts.length > 0 ? '#DC2626' : '#64748B' }}>{openAlerts.length > 0 ? `${openAlerts.length} open change${openAlerts.length !== 1 ? 's' : ''} waiting for review.` : `${hostname(urlData.url)} · ${urlData.zones?.length ?? 0} focus zone${(urlData.zones?.length ?? 0) !== 1 ? 's' : ''}.`}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.045)', flexShrink: 0 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: statusVariant === 'alert' ? '#EF4444' : statusVariant === 'paused' ? '#94A3B8' : '#16A34A', boxShadow: statusVariant === 'alert' ? '0 0 0 4px rgba(239,68,68,0.1)' : statusVariant === 'paused' ? '0 0 0 4px rgba(148,163,184,0.12)' : '0 0 0 4px rgba(22,163,74,0.1)' }} /><span style={{ fontSize: 12, fontWeight: 750, color: '#475569', textTransform: 'capitalize' }}>{statusVariant}</span></div>
            </div>
            <UrlDetailClient openAlert={openAlert} snapshots={enrichedSnapshots} alertBySnapshotId={alertBySnapshotId} pageUrl={urlData.url} urlId={urlData.id} zones={urlData.zones ?? []} />
          </div>
        }
        inspector={<UrlDetailSettings url={urlData} latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null} />}
      />
    </div>
  )
}
