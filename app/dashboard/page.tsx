import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { flattenToOne } from '@/lib/supabase/relations'
import { getSignedUrls } from '@/lib/supabase/storage'
import { FeedPageClient } from '@/components/dashboard/FeedPageClient'

export const metadata = { title: 'Feed — PageWatch' }

export default async function DashboardPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [monitors, alertsResult, checksResult] = await Promise.all([
    getMonitoredUrls(workspace.id),
    supabase
      .from('alerts')
      .select(
        'id, monitored_url_id, created_at, status, diff_pct, ai_summary, severity, current_snapshot_id, monitored_urls(name, url, mode)'
      )
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('screenshot_snapshots')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .gte('taken_at', todayStart.toISOString()),
  ])

  const alerts = flattenToOne(alertsResult.data, 'monitored_urls')

  // A 480px thumbnail is written per capture (metadata.thumb_path); fall back
  // to the full-size capture when a snapshot predates that.
  const snapshotIds = [...new Set(alerts.map((a) => a.current_snapshot_id).filter((id): id is string => Boolean(id)))]
  const thumbPathBySnapshotId = new Map<string, string>()
  if (snapshotIds.length > 0) {
    const { data: snapshots } = await supabase
      .from('screenshot_snapshots')
      .select('id, storage_path, metadata')
      .in('id', snapshotIds)
    for (const snap of snapshots ?? []) {
      const thumbPath = (snap.metadata as Record<string, unknown> | null)?.thumb_path
      thumbPathBySnapshotId.set(snap.id, typeof thumbPath === 'string' ? thumbPath : snap.storage_path)
    }
  }
  const signedByPath = await getSignedUrls([...thumbPathBySnapshotId.values()])

  const alertsWithThumbs = alerts.map((alert) => {
    const path = alert.current_snapshot_id ? thumbPathBySnapshotId.get(alert.current_snapshot_id) : undefined
    return { ...alert, thumbUrl: path ? signedByPath.get(path) ?? null : null }
  })

  return (
    <FeedPageClient
      alerts={alertsWithThumbs}
      monitors={monitors ?? []}
      checksToday={checksResult.count ?? 0}
    />
  )
}
