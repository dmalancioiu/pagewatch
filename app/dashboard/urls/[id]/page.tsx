import { notFound, redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import { MonitorDetailDesignClientFixed } from '@/components/dashboard/MonitorDetailDesignClientFixed'
import { MonitorPauseResumeSync } from '@/components/dashboard/MonitorPauseResumeSync'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'
import { MonitorDetailDesignClientResponsive } from '@/components/dashboard/MonitorDetailDesignClientResponsive'
import { MonitorSettingsRailSync } from '@/components/dashboard/MonitorSettingsRailSync'

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

  const snapshots: any[] = (urlData.screenshot_snapshots ?? []).sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
  const alerts: any[] = (urlData.alerts ?? []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const snapshotById = new Map<string, any>()
  for (const snapshot of snapshots) snapshotById.set(snapshot.id, snapshot)

  const allPaths = [...snapshots.map((s: any) => s.storage_path), ...alerts.map((a: any) => a.diff_storage_path)].filter(Boolean)
  const signedUrlMap = await getSignedUrls(allPaths)

  const enrichedAlerts: AlertWithUrls[] = alerts.map((alert: any) => {
    const prevSnap = snapshotById.get(alert.previous_snapshot_id)
    const currSnap = snapshotById.get(alert.current_snapshot_id)
    return {
      id: alert.id,
      diff_pct: alert.diff_pct,
      severity: alert.severity,
      status: alert.status,
      created_at: alert.created_at,
      ai_summary: alert.ai_summary,
      metadata: alert.metadata ?? null,
      beforeUrl: prevSnap ? signedUrlMap.get(prevSnap.storage_path) ?? null : null,
      afterUrl: currSnap ? signedUrlMap.get(currSnap.storage_path) ?? null : null,
      diffUrl: alert.diff_storage_path ? signedUrlMap.get(alert.diff_storage_path) ?? null : null,
    }
  })

  const alertBySnapshotId: Record<string, AlertWithUrls> = {}
  for (const enriched of enrichedAlerts) {
    const raw = alerts.find((alert: any) => alert.id === enriched.id)
    if (raw?.current_snapshot_id) alertBySnapshotId[raw.current_snapshot_id] = enriched
  }

  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((snapshot: any) => ({
    id: snapshot.id,
    storage_path: snapshot.storage_path,
    taken_at: snapshot.taken_at,
    file_size_bytes: snapshot.file_size_bytes,
    signedUrl: signedUrlMap.get(snapshot.storage_path) ?? null,
  }))

  const openAlert = enrichedAlerts.find((alert) => alert.status === 'open') ?? null

  return (
    <>
      <MonitorDetailDesignClientResponsive
        monitor={urlData}
        openAlert={openAlert}
        snapshots={enrichedSnapshots}
        alerts={enrichedAlerts}
        alertBySnapshotId={alertBySnapshotId}
        zones={urlData.zones ?? []}
        lastChecked={timeAgo(urlData.last_checked_at)}
        nextRun={nextCheckAt(urlData)}
      />
      <MonitorSettingsRailSync
        monitorId={urlData.id}
        initialCheckFrequency={urlData.check_frequency ?? 'daily'}
        initialCheckHour={urlData.check_hour ?? 10}
        initialFullPage={urlData.full_page !== false}
        initialWatchDescription={urlData.watch_description ?? null}
        initialZones={urlData.zones ?? []}
      />
    </>
  )
}
