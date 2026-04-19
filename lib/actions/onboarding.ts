'use server'
import { createServerClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { addMonitoredUrls, type UrlInput } from './websites'

export async function completeOnboardingStep(
  workspaceId: string,
  stepKey: string,
  data?: Record<string, unknown>
) {
  const supabase = await createServerClient()
  await supabase.from('onboarding_state').upsert(
    {
      workspace_id: workspaceId,
      step_key:     stepKey,
      completed:    true,
      data:         data ?? {},
      updated_at:   new Date().toISOString(),
    },
    { onConflict: 'workspace_id,step_key' }
  )
  revalidatePath('/onboarding')
}

export async function getOnboardingState(workspaceId: string) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('onboarding_state')
    .select('*')
    .eq('workspace_id', workspaceId)
  return data ?? []
}

export async function addUrlsToMonitor(workspaceId: string, urls: UrlInput[]) {
  return addMonitoredUrls(workspaceId, urls)
}

export async function saveNotificationChannel(
  workspaceId: string,
  email: string,
  frequency: string
) {
  const supabase = await createServerClient()
  await supabase.from('notification_channels').upsert(
    {
      workspace_id: workspaceId,
      channel_type: 'email',
      config:       { email, frequency },
      is_active:    true,
    },
    { onConflict: 'workspace_id,channel_type' }
  )
}
