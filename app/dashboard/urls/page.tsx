import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { MonitorsPageClient } from '@/components/dashboard/MonitorsPageClient'

export const metadata = { title: 'Monitors — PageWatch' }

export default async function UrlsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const urls = await getMonitoredUrls(workspace.id)

  const [{ data: openAlerts }, { data: lastAlertRows }] = await Promise.all([
    supabase
      .from('alerts')
      .select('id, monitored_url_id, created_at, diff_pct, ai_summary, monitored_urls(name, url)')
      .eq('workspace_id', workspace.id)
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
    supabase
      .from('alerts')
      .select('monitored_url_id, diff_pct, ai_summary, created_at')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const openCountMap = new Map<string, number>()
  const openAlertMap = new Map<string, any>()

  for (const alert of openAlerts ?? []) {
    openCountMap.set(alert.monitored_url_id, (openCountMap.get(alert.monitored_url_id) ?? 0) + 1)
    if (!openAlertMap.has(alert.monitored_url_id)) openAlertMap.set(alert.monitored_url_id, alert)
  }

  const lastAlertMap = new Map<string, any>()
  for (const alert of lastAlertRows ?? []) {
    if (!lastAlertMap.has(alert.monitored_url_id)) lastAlertMap.set(alert.monitored_url_id, alert)
  }

  const monitors = urls.map((url: any) => {
    const activeAlert = openAlertMap.get(url.id)
    const latestAlert = lastAlertMap.get(url.id)
    const scoreAlert = activeAlert ?? latestAlert

    return {
      id: url.id,
      name: url.name,
      url: url.url,
      is_active: url.is_active,
      mode: url.mode,
      check_frequency: url.check_frequency,
      last_checked_at: url.last_checked_at,
      zones: url.zones,
      openAlertCount: openCountMap.get(url.id) ?? 0,
      lastAlertDiffPct: scoreAlert?.diff_pct ?? null,
      lastAlertSummary: scoreAlert?.ai_summary ?? null,
      lastAlertCreatedAt: scoreAlert?.created_at ?? null,
    }
  })

  return <MonitorsPageClient monitors={monitors} alerts={openAlerts ?? []} />
}
