import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrls } from '@/lib/actions/websites'
import { createServerClient } from '@/lib/supabase/server'
import { MonitorsPageClient } from '@/components/dashboard/MonitorsPageClient'
import type { MonitorRowData } from '@/components/dashboard/MonitorRow'

export const metadata = { title: 'Monitors — PageWatch' }

export default async function UrlsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const urls = await getMonitoredUrls(workspace.id)

  const { data: openAlerts } = await supabase
    .from('alerts')
    .select('id, monitored_url_id')
    .eq('workspace_id', workspace.id)
    .eq('status', 'open')

  const openCountMap = new Map<string, number>()
  for (const alert of openAlerts ?? []) {
    openCountMap.set(alert.monitored_url_id, (openCountMap.get(alert.monitored_url_id) ?? 0) + 1)
  }

  const monitors: MonitorRowData[] = urls.map((url) => ({
    id: url.id,
    name: url.name,
    url: url.url,
    is_active: url.is_active,
    mode: url.mode,
    check_frequency: url.check_frequency,
    last_checked_at: url.last_checked_at,
    openAlertCount: openCountMap.get(url.id) ?? 0,
    consecutive_failures: url.consecutive_failures,
    last_error: url.last_error,
    last_error_at: url.last_error_at,
    last_success_at: url.last_success_at,
  }))

  return <MonitorsPageClient monitors={monitors} />
}
