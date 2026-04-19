import { schedules, logger } from '@trigger.dev/sdk/v3'
import { createClient } from '@supabase/supabase-js'
import { processUrl } from '../lib/take-screenshot'

/**
 * Runs every hour. Checks every active monitored_url that is "due" based on
 * check_frequency + check_hour (UTC). Takes a screenshot, diffs it, alerts if needed.
 */
export const screenshotMonitorTask = schedules.task({
  id: 'screenshot-monitor',
  cron: '0 * * * *',
  maxDuration: 600,
  run: async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    logger.info('Screenshot monitor started')

    const { data: urls, error } = await supabase
      .from('monitored_urls')
      .select('*')
      .eq('is_active', true)

    if (error) throw new Error(`Failed to load monitored URLs: ${error.message}`)
    if (!urls?.length) { logger.info('No active URLs found'); return }

    const now         = new Date()
    const currentHour = now.getUTCHours()

    const dueUrls = urls.filter((u: any) => {
      // Hourly: always run each hour, ignore check_hour
      if (u.check_frequency === 'hourly') {
        if (!u.last_checked_at) return true
        return now.getTime() - new Date(u.last_checked_at).getTime() >= 60 * 60 * 1000
      }

      // Daily / weekly with a preferred hour: only run during that hour
      if (u.check_hour != null) {
        if (currentHour !== u.check_hour) return false
        // Also make sure we haven't already run this URL this hour
        if (u.last_checked_at) {
          const last = new Date(u.last_checked_at)
          const sameHour =
            last.getUTCFullYear() === now.getUTCFullYear() &&
            last.getUTCMonth()    === now.getUTCMonth()    &&
            last.getUTCDate()     === now.getUTCDate()     &&
            last.getUTCHours()    === now.getUTCHours()
          if (sameHour) return false
        }
        // For weekly: additionally check that 7 days have passed since last run
        if (u.check_frequency === 'weekly' && u.last_checked_at) {
          return now.getTime() - new Date(u.last_checked_at).getTime() >= 7 * 24 * 60 * 60 * 1000
        }
        return true
      }

      // No preferred hour — fall back to elapsed-time logic
      if (!u.last_checked_at) return true
      const elapsed = now.getTime() - new Date(u.last_checked_at).getTime()
      if (u.check_frequency === 'daily')  return elapsed >= 24 * 60 * 60 * 1000
      if (u.check_frequency === 'weekly') return elapsed >= 7 * 24 * 60 * 60 * 1000
      return false
    })

    if (!dueUrls.length) { logger.info('No URLs due for checking this hour'); return }

    logger.info(`${dueUrls.length} URL(s) due for screenshots`)

    for (const monUrl of dueUrls) {
      try {
        await processUrl(monUrl, supabase, now)
      } catch (err) {
        logger.error('Unhandled error processing URL', { url: monUrl.url, err })
      }
    }

    logger.info('Screenshot monitor complete')
  },
})
