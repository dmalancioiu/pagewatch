import { notFound, redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import { WorkspaceTopBar } from '@/components/dashboard/WorkspaceTopBar'
import { UrlDetailClient } from './UrlDetailClient'
import { UrlDetailSettings } from './UrlDetailSettings'
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

  const snapshots: any[] = (urlData.screenshot_snapshots ?? []).sort(
    (a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
  )
  const alerts: any[] = (urlData.alerts ?? []).sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const openAlerts = alerts.filter((a: any) => a.status === 'open')

  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  const allPaths = [
    ...snapshots.map((s: any) => s.storage_path),
    ...alerts.map((a: any) => a.diff_storage_path),
  ]
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

  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((s: any) => ({
    id: s.id,
    storage_path: s.storage_path,
    taken_at: s.taken_at,
    file_size_bytes: s.file_size_bytes,
    signedUrl: signedUrlMap.get(s.storage_path) ?? null,
  }))

  const openAlert = enrichedAlerts.find((a) => a.status === 'open') ?? null

  const isPaused = !urlData.is_active
  const isArchive = urlData.mode === 'archive'

  const statusVariant = isPaused
    ? 'paused'
    : openAlerts.length > 0
      ? 'alert'
      : isArchive
        ? 'archive'
        : 'healthy'

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9' }}>
      <WorkspaceTopBar
        name={urlData.name}
        url={urlData.url}
        statusVariant={statusVariant}
        lastChecked={timeAgo(urlData.last_checked_at)}
        nextRun={nextCheckAt(urlData)}
        urlId={urlData.id}
        isPaused={isPaused}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', alignItems: 'start', minHeight: 'calc(100vh - 52px)' }}>
        <div className="canvas-dot-bg" style={{ padding: '20px 24px', minHeight: 'calc(100vh - 52px)' }}>
          <UrlDetailClient
            openAlert={openAlert}
            snapshots={enrichedSnapshots}
            alertBySnapshotId={alertBySnapshotId}
            pageUrl={urlData.url}
            urlId={urlData.id}
            zones={urlData.zones ?? []}
          />
        </div>

        <aside className="inspector-panel" style={{ position: 'sticky', top: 52, maxHeight: 'calc(100vh - 52px)' }}>
          <UrlDetailSettings
            url={urlData}
            latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null}
          />
        </aside>
      </div>
    </div>
  )
}
