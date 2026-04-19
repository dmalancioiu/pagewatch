'use server'
import { createServerClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAlerts(workspaceId: string, status?: string) {
  const supabase = await createServerClient()
  let query = supabase
    .from('alerts')
    .select('*, monitored_urls(url, name, check_frequency)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function acknowledgeAlert(alertId: string) {
  const supabase = await createServerClient()
  const { error, data } = await supabase
    .from('alerts')
    .update({ status: 'acknowledged' })
    .eq('id', alertId)
    .select('monitored_url_id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/alerts')
  if (data?.monitored_url_id) {
    revalidatePath(`/dashboard/urls/${data.monitored_url_id}`)
  }
}

export async function dismissAlert(alertId: string) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('alerts')
    .update({ status: 'dismissed' })
    .eq('id', alertId)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/alerts')
}
