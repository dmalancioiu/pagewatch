import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

/** Returns the signed-in user, redirecting to /login when there isn't one. */
export async function requireUser() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/login')
  }

  return data.user
}
