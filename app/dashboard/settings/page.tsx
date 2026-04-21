import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { User, Bell, CreditCard, AlertTriangle, Building2, CheckCircle2, Slack } from 'lucide-react'

export const metadata = { title: 'Settings — PageWatch' }

/* ─── Section wrapper ─── */
function Section({
  icon,
  title,
  children,
  danger,
}: {
  icon:     React.ReactNode
  title:    string
  children: React.ReactNode
  danger?:  boolean
}) {
  return (
    <div
      className="dash-card overflow-hidden"
      style={danger ? { borderColor: 'rgba(185,28,28,0.25)', background: 'rgba(185,28,28,0.02)' } : {}}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{
          borderBottom: danger ? '1px solid rgba(185,28,28,0.12)' : '1px solid #F3F4F6',
          background: danger ? 'rgba(185,28,28,0.03)' : '#F8FAFC',
        }}
      >
        <span style={{ color: danger ? '#DC2626' : '#9CA3AF' }}>{icon}</span>
        <span
          className="text-sm font-semibold"
          style={{ color: danger ? '#B91C1C' : '#374151' }}
        >
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

/* ─── Read-only field ─── */
function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: '#9CA3AF' }}
      >
        {label}
      </label>
      <div
        className="w-full px-4 py-2.5 rounded-lg text-sm font-mono"
        style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', color: '#374151' }}
      >
        {value}
      </div>
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: '#9CA3AF' }}>{hint}</p>
      )}
    </div>
  )
}

/* ─── Page ─── */

export default async function SettingsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()

  const [{ data: channels }, { data: { user } }] = await Promise.all([
    supabase
      .from('notification_channels')
      .select('*')
      .eq('workspace_id', workspace.id),
    supabase.auth.getUser(),
  ])

  const emailChannel = channels?.find((c: any) => c.channel_type === 'email')
  const emailAddr    = (emailChannel?.config as any)?.email ?? user?.email ?? '—'
  const emailFreq    = (emailChannel?.config as any)?.frequency ?? 'daily'

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#111827' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          Workspace, notifications, and account preferences.
        </p>
      </div>

      {/* Workspace */}
      <Section icon={<Building2 className="w-4 h-4" />} title="Workspace">
        <div className="space-y-4">
          <Field label="Workspace name" value={workspace.name ?? '—'} />
          <Field
            label="Domain label"
            value={workspace.domain ?? '—'}
            hint="Contact support to change your domain label."
          />
          <Field
            label="Workspace ID"
            value={workspace.id}
            hint="Use this ID when contacting support."
          />
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell className="w-4 h-4" />} title="Notifications">
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: '#374151' }}>Email alerts</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                {emailChannel ? `Sending to ${emailAddr}` : 'Not configured'}
              </p>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5"
              style={
                emailChannel?.is_active
                  ? { color: '#15803D', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }
                  : { color: '#9CA3AF', background: '#F3F4F6', border: '1px solid #E5E7EB' }
              }
            >
              {emailChannel?.is_active ? (
                <><CheckCircle2 className="w-3 h-3" /> Active</>
              ) : 'Inactive'}
            </span>
          </div>

          {emailChannel && (
            <Field
              label="Alert frequency"
              value={`${emailFreq.charAt(0).toUpperCase() + emailFreq.slice(1)} digest`}
            />
          )}

          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: '#F9FAFB', border: '1px dashed #E5E7EB' }}
          >
            <Slack className="w-4 h-4 flex-shrink-0" style={{ color: '#D1D5DB' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Slack notifications</p>
              <p className="text-xs mt-0.5" style={{ color: '#D1D5DB' }}>Available on the Pro plan</p>
            </div>
            <a
              href="/dashboard/billing"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#15803D', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
            >
              Upgrade →
            </a>
          </div>
        </div>
      </Section>

      {/* Plan & billing */}
      <Section icon={<CreditCard className="w-4 h-4" />} title="Plan &amp; billing">
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: '#374151' }}>Free plan</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                Up to 3 monitors · Daily checks · Email alerts
              </p>
            </div>
            <a
              href="/#pricing"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: '#16A34A', color: '#FFFFFF' }}
            >
              Upgrade to Pro →
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Monitors',   used: 3,  max: 3,  display: null      },
              { label: 'Checks/mo',  used: 90, max: 90, display: null      },
              { label: 'Retention',  used: null, max: null, display: '30 days' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                  style={{ color: '#9CA3AF' }}
                >
                  {item.label}
                </p>
                <p className="text-lg font-bold leading-none" style={{ color: '#111827' }}>
                  {item.display ?? `${item.used}/${item.max}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Account */}
      <Section icon={<User className="w-4 h-4" />} title="Account">
        <div className="space-y-4">
          <Field label="Email address" value={user?.email ?? '—'} />
          <Field
            label="User ID"
            value={user?.id ?? '—'}
            hint="Used for support requests."
          />
        </div>
      </Section>

      {/* Danger zone */}
      <Section icon={<AlertTriangle className="w-4 h-4" />} title="Danger zone" danger>
        <div className="space-y-4">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Deleting your workspace permanently removes all monitored URLs, screenshots, and alert
            history. This action cannot be undone.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium opacity-40 cursor-not-allowed"
            style={{ background: 'rgba(185,28,28,0.06)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.2)' }}
          >
            Delete workspace
          </button>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Contact <a href="mailto:support@pagewatch.dev" className="underline">support@pagewatch.dev</a> to request account deletion.
          </p>
        </div>
      </Section>
    </div>
  )
}
