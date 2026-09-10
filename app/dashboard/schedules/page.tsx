import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getSchedules } from '@/lib/actions/schedules'
import { RunScheduleButton } from '@/components/schedules/RunScheduleButton'
import { Panel, PanelRow } from '@/components/ui/panel'
import { StatusDot } from '@/components/ui/status-dot'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Schedules — PageWatch',
}

function formatNextRun(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export default async function SchedulesPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/onboarding')

  const { schedules, triggerAvailable } = await getSchedules()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-page-title text-text">Schedules</h1>
        <p className="mt-1 text-ui text-text-muted">
          Automated tasks that keep your screenshot data fresh. Run any of them manually at any time.
        </p>
      </div>

      {!triggerAvailable && (
        <div className="flex items-start gap-2 rounded-md border border-warn/30 bg-warn-subtle px-3.5 py-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-ui-medium text-warn">TRIGGER_SECRET_KEY not configured</p>
            <p className="text-meta text-text-muted">
              Add <code className="rounded bg-bg-subtle px-1 font-mono">TRIGGER_SECRET_KEY</code> to your{' '}
              <code className="rounded bg-bg-subtle px-1 font-mono">.env.local</code> to enable manual runs and live
              schedule data.
            </p>
          </div>
        </div>
      )}

      <Panel>
        {schedules.map((s) => (
          <PanelRow key={s.id} className="h-auto flex-col items-stretch gap-2 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StatusDot tone={s.active ? 'ok' : 'neutral'} />
                <span className="text-ui-medium text-text">{s.label}</span>
              </div>
              <RunScheduleButton taskId={s.taskId} label={s.label} />
            </div>
            <p className="text-meta text-text-muted">{s.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <Badge tone="neutral" size="sm" className="font-mono normal-case">
                {s.cron}
              </Badge>
              <span className="text-meta text-text-faint">{s.cronDescription}</span>
              {s.nextRun && <span className="text-meta text-text-faint">Next: {formatNextRun(s.nextRun)}</span>}
            </div>
          </PanelRow>
        ))}
      </Panel>

      <p className="text-meta text-text-faint">
        Manual runs process all active monitors — same as the scheduled run. New alerts appear in{' '}
        <a href="/dashboard/alerts" className="underline hover:text-text-muted">
          Alerts
        </a>{' '}
        within ~60 seconds.
      </p>
    </div>
  )
}
