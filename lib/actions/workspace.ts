'use server'
import { createServerClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWorkspace() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(*)')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  return (data?.workspaces as any) ?? null
}

export async function createWorkspace(name: string, domain: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace('www.', '')

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert({ owner_user_id: user.id, name, domain: cleanDomain })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('workspace_members').insert({
    workspace_id: workspace.id,
    user_id:      user.id,
    role:         'owner',
  })

  // The daily digest (and instant alerts) only ever email a workspace that
  // has an active `notification_channels` row — and until now, the only code
  // that wrote one was `saveNotificationChannel`, reached solely by finishing
  // the onboarding wizard. Anyone who skipped or abandoned onboarding got a
  // fully working monitor and silence forever after, with nothing in the UI
  // to say so. Seeding a default channel here means every workspace can be
  // notified from the moment it exists; `saveNotificationChannel` upserts on
  // `(workspace_id, channel_type)`, so the wizard still overwrites this with
  // whatever the user actually chooses.
  if (user.email) {
    await supabase.from('notification_channels').insert({
      workspace_id: workspace.id,
      channel_type: 'email',
      config:       { email: user.email, frequency: 'daily' },
      is_active:    true,
    })
  }

  // Onboarding steps for the screenshot-monitoring wizard
  const steps = ['domain', 'business_context', 'urls', 'monitoring_prefs', 'alert_preferences', 'review']
  await supabase.from('onboarding_state').insert(
    steps.map((step_key) => ({ workspace_id: workspace.id, step_key, completed: false }))
  )

  return workspace
}
