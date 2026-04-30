import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
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
      .select('id, monitored_url_id, created_at, status, diff_pct, ai_summary, metadata, monitored_urls(name, url, mode)')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('screenshot_snapshots')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .gte('taken_at', todayStart.toISOString()),
  ])

  return (
    <FeedPageClient
      alerts={alertsResult.data ?? []}
      monitors={monitors ?? []}
      checksToday={checksResult.count ?? 0}
    />
  )
}
