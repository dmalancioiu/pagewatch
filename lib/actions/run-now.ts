'use server'
import { tasks } from '@trigger.dev/sdk/v3'
import { createServerClient } from '../supabase/server'
import { getWorkspace } from './workspace'
import type { runSingleUrlTask } from '@/trigger/tasks/run-single-url'

export async function triggerManualRun(urlId: string): Promise<{ runId: string }> {
  const supabase   = await createServerClient()
  const workspace  = await getWorkspace()

  if (!workspace) throw new Error('No workspace found')

  // Verify the URL belongs to this workspace
  const { data: url, error } = await supabase
    .from('monitored_urls')
    .select('id, is_active')
    .eq('id', urlId)
    .eq('workspace_id', workspace.id)
    .single()

  if (error || !url) throw new Error('URL not found')
  if (!url.is_active)  throw new Error('URL is paused — resume it before running')

  const handle = await tasks.trigger<typeof runSingleUrlTask>(
    'run-single-url',
    { urlId }
  )

  return { runId: handle.id }
}
