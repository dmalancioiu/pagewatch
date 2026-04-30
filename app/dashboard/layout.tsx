import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getWorkspace } from '@/lib/actions/workspace'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { SetupCommand } from '@/components/onboarding/SetupCommand'

export const metadata = {
  title: 'Dashboard — PageWatch',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const workspace = await getWorkspace()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const userEmail = profile?.email ?? user.email ?? ''
  const userName  = profile?.full_name ?? ''

  if (!workspace) {
    return (
      <div className="min-h-screen" style={{ background: '#F6F7F9' }}>
        <SetupCommand userEmail={userEmail} userName={userName} />
      </div>
    )
  }

  const [{ count: totalMonitorCount }, { count: activeMonitorCount }] = await Promise.all([
    supabase
      .from('monitored_urls')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .is('deleted_at', null),
    supabase
      .from('monitored_urls')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id)
      .is('deleted_at', null)
      .eq('is_active', true),
  ])

  return (
    <DashboardShell
      workspaceId={workspace.id}
      domain={workspace.domain ?? ''}
      userEmail={userEmail}
      plan="free"
      activeMonitorCount={activeMonitorCount ?? 0}
      totalMonitorCount={totalMonitorCount ?? 0}
      monitorLimit={3}
    >
      {children}
    </DashboardShell>
  )
}
