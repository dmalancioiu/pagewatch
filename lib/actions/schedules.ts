'use server'

import { revalidatePath } from 'next/cache'

export type ScheduleInfo = {
  id:              string
  taskId:          string
  label:           string
  description:     string
  cron:            string
  cronDescription: string
  timezone:        string
  active:          boolean
  nextRun:         string | null
  liveId:          string | null
}

const KNOWN_TASKS: Omit<ScheduleInfo, 'active' | 'nextRun' | 'liveId'>[] = [
  {
    id:              'screenshot-monitor',
    taskId:          'screenshot-monitor',
    label:           'Screenshot Monitor',
    description:     'Takes screenshots of all monitored URLs that are due, diffs against the previous screenshot, and fires alerts when visual changes exceed the configured threshold.',
    cron:            '0 * * * *',
    cronDescription: 'Every hour',
    timezone:        'UTC',
  },
  {
    id:              'send-alert-digest',
    taskId:          'send-alert-digest',
    label:           'Alert Digest Email',
    description:     'Sends a daily email digest of open visual change alerts grouped by workspace to each workspace owner.',
    cron:            '0 8 * * *',
    cronDescription: 'Every day at 8:00 AM UTC',
    timezone:        'UTC',
  },
]

export async function getSchedules(): Promise<{
  schedules: ScheduleInfo[]
  triggerAvailable: boolean
}> {
  const base = KNOWN_TASKS.map((t) => ({
    ...t,
    active:  true,
    nextRun: null,
    liveId:  null,
  }))

  if (!process.env.TRIGGER_SECRET_KEY) {
    return { schedules: base, triggerAvailable: false }
  }

  try {
    const { schedules } = await import('@trigger.dev/sdk/v3')
    const result = await schedules.list()
    const liveMap = new Map<string, (typeof result.data)[number]>()
    for (const s of result.data ?? []) {
      liveMap.set(s.task, s)
    }
    const merged = base.map((t) => {
      const live = liveMap.get(t.taskId)
      if (!live) return t
      return {
        ...t,
        active:  live.active ?? true,
        nextRun: live.nextRun ? new Date(live.nextRun).toISOString() : null,
        liveId:  live.id,
      }
    })
    return { schedules: merged, triggerAvailable: true }
  } catch (err) {
    console.error('[schedules] Failed to fetch live schedule data:', err)
    return { schedules: base, triggerAvailable: true }
  }
}

export async function triggerTaskNow(taskId: string): Promise<{
  ok: boolean
  message: string
  runId?: string
}> {
  if (!process.env.TRIGGER_SECRET_KEY) {
    return {
      ok:      false,
      message: 'TRIGGER_SECRET_KEY is not configured. Add it to your .env to enable manual runs.',
    }
  }

  try {
    const { tasks } = await import('@trigger.dev/sdk/v3')
    const run = await tasks.trigger(taskId, { triggerSource: 'manual_dashboard' })
    revalidatePath('/dashboard/schedules')
    return { ok: true, message: 'Task queued — it will run shortly.', runId: run.id }
  } catch (err) {
    console.error(`[schedules] Failed to trigger task "${taskId}":`, err)
    throw new Error(`Failed to trigger "${taskId}". Check TRIGGER_SECRET_KEY and task ID.`)
  }
}
