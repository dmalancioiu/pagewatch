import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { getSchedules } from '@/lib/actions/schedules'
import { RunScheduleButton } from '@/components/schedules/RunScheduleButton'

export const metadata = {
  title: 'Schedules — PageWatch',
}

function formatNextRun(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })
}

function CronBadge({ cron }: { cron: string }) {
  return (
    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
      {cron}
    </code>
  )
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-300'}`} />
      <span className={`text-xs font-medium ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
        {active ? 'Active' : 'Paused'}
      </span>
    </span>
  )
}

export default async function SchedulesPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/onboarding')

  const { schedules, triggerAvailable } = await getSchedules()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Schedules</h1>
        <p className="text-slate-500 text-sm mt-1">
          Automated tasks that keep your screenshot data fresh. Run any of them manually at any time.
        </p>
      </div>

      {!triggerAvailable && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">TRIGGER_SECRET_KEY not configured</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add <code className="bg-amber-100 px-1 rounded">TRIGGER_SECRET_KEY</code> to your{' '}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable manual runs
              and live schedule data.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {schedules.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-slate-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-base font-semibold text-slate-900">{s.label}</h2>
                <StatusDot active={s.active} />
              </div>
              <p className="text-sm text-slate-500 mb-3">{s.description}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Schedule</span>
                  <CronBadge cron={s.cron} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Runs</span>
                  <span className="text-xs text-slate-600">{s.cronDescription}</span>
                </div>
                {s.nextRun && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Next run</span>
                    <span className="text-xs text-slate-600">{formatNextRun(s.nextRun)}</span>
                  </div>
                )}
                {s.liveId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wide">ID</span>
                    <code className="text-xs text-slate-400 font-mono">{s.liveId.slice(0, 12)}…</code>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <RunScheduleButton taskId={s.taskId} label={s.label} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Manual runs process all active monitored URLs — same as the scheduled run.
        New alerts appear in{' '}
        <a href="/dashboard/alerts" className="underline hover:text-slate-600">Alerts</a>{' '}
        within ~60 seconds.
      </p>
    </div>
  )
}
