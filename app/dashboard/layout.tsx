import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getWorkspace } from '@/lib/actions/workspace'
import { getEntitlements, toClientEntitlements } from '@/lib/entitlements'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { SetupCommand } from '@/components/onboarding/SetupCommand'

export const metadata = {
  title: 'Dashboard — PageWatch',
}

/**
 * Auth guard and entitlement resolution for every dashboard route.
 *
 * Entitlements are loaded once here and handed to the shell, so client
 * components read them from context instead of each fetching their own copy.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [workspace, profile] = await Promise.all([
    getWorkspace(),
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
  ])

  const userEmail = profile.data?.email ?? user.email ?? ''
  const userName = profile.data?.full_name ?? ''

  // No workspace yet — the user landed here before finishing onboarding.
  if (!workspace) {
    return (
      <div className="pw-setup-screen">
        <SetupCommand userEmail={userEmail} userName={userName} />
      </div>
    )
  }

  const entitlements = await getEntitlements()
  if (!entitlements) redirect('/onboarding')

  return (
    <DashboardShell
      workspaceId={workspace.id}
      domain={workspace.domain ?? ''}
      userEmail={userEmail}
      entitlements={toClientEntitlements(entitlements)}
    >
      {children}
    </DashboardShell>
  )
}
