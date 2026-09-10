import { redirect } from 'next/navigation'
import { Bell } from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getAlerts } from '@/lib/actions/alerts'
import { flattenToOne } from '@/lib/supabase/relations'
import { Panel } from '@/components/ui/panel'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertCard } from '@/components/alerts/AlertCard'
import type { Alert } from '@/lib/types/database.types'

export const metadata = { title: 'Alerts — PageWatch' }

function dayTitle(iso: string | null | undefined): string {
  if (!iso) return 'Earlier'
  const d = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  if (start.getTime() === today.getTime()) return 'Today'
  if (start.getTime() === yesterday.getTime()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' })
}

export default async function AlertsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const raw = await getAlerts(workspace.id)
  const alerts = flattenToOne(raw, 'monitored_urls') as Alert[]
  const openCount = alerts.filter((a) => a.status === 'open').length

  const groups: { label: string; items: Alert[] }[] = []
  const indexByLabel = new Map<string, number>()
  for (const alert of alerts) {
    const label = dayTitle(alert.created_at)
    let idx = indexByLabel.get(label)
    if (idx === undefined) {
      idx = groups.length
      indexByLabel.set(label, idx)
      groups.push({ label, items: [] })
    }
    groups[idx].items.push(alert)
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-page-title text-text">Alerts</h1>
        {alerts.length > 0 && (
          <span className="text-meta text-text-muted">
            {openCount} open · {alerts.length} total
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-4" />}
          title="No alerts yet"
          description="When PageWatch detects a meaningful visual change, it will appear here with a plain-English summary and severity."
        />
      ) : (
        groups.map(({ label, items }) => (
          <section key={label} className="flex flex-col gap-2">
            <p className="text-label uppercase text-text-faint">{label}</p>
            <Panel>
              {items.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </Panel>
          </section>
        ))
      )}
    </div>
  )
}
