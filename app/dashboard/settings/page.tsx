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
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border:     danger ? '1px solid rgba(255,68,68,0.15)' : '1px solid rgba(255,255,255,0.07)',
        background: danger ? 'rgba(255,50,50,0.02)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <div
        className="flex items-center gap-2.5 px-6 py-4"
        style={{
          borderBottom: danger ? '1px solid rgba(255,68,68,0.1)' : '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        <span style={{ color: danger ? '#ff7070' : 'rgba(255,255,255,0.4)' }}>{icon}</span>
        <span
          className="text-sm font-semibold"
          style={{ color: danger ? '#ff7070' : 'white' }}
        >
          {title}
        </span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ─── Read-only field ─── */
function Field({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
             style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      <div
        className="w-full px-4 py-3 rounded-xl text-sm font-mono"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border:     '1px solid rgba(255,255,255,0.07)',
          color:      'rgba(255,255,255,0.7)',
        }}
      >
        {value}
      </div>
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>{hint}</p>
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
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
          Workspace, notifications, and account preferences.
        </p>
      </div>

      {/* ── Workspace ───────────────────────────────────── */}
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

      {/* ── Notifications ───────────────────────────────── */}
      <Section icon={<Bell className="w-4 h-4" />} title="Notifications">
        <div className="space-y-5">
          {/* Email status */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="text-sm font-medium text-white">Email alerts</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {emailChannel ? `Sending to ${emailAddr}` : 'Not configured'}
              </p>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={
                emailChannel?.is_active
                  ? { color: '#00ff88', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.18)' }
                  : { color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {emailChannel?.is_active ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              ) : 'Inactive'}
            </span>
          </div>

          {/* Frequency */}
          {emailChannel && (
            <Field
              label="Alert frequency"
              value={`${emailFreq.charAt(0).toUpperCase() + emailFreq.slice(1)} digest`}
            />
          )}

          {/* Slack */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <Slack className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Slack notifications
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Available on the Pro plan
              </p>
            </div>
            <a
              href="/dashboard/billing"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#00ff88', background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.14)' }}
            >
              Upgrade →
            </a>
          </div>
        </div>
      </Section>

      {/* ── Plan & billing ─────────────────────────────── */}
      <Section icon={<CreditCard className="w-4 h-4" />} title="Plan &amp; billing">
        <div className="space-y-4">
          {/* Current plan */}
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="text-sm font-medium text-white">Free plan</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Up to 3 URLs · Daily checks · Email alerts
              </p>
            </div>
            <a
              href="/#pricing"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(0,255,136,0.08)',
                color:      '#00ff88',
                border:     '1px solid rgba(0,255,136,0.2)',
                boxShadow:  '0 0 12px rgba(0,255,136,0.08)',
              }}
            >
              Upgrade to Pro →
            </a>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'URLs',       used: 3, max: 3  },
              { label: 'Checks/mo',  used: 90, max: 90 },
              { label: 'Retention',  used: null, display: '30 days' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                   style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {item.label}
                </p>
                <p className="text-lg font-bold text-white leading-none">
                  {item.display ?? `${item.used}/${item.max}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Account ─────────────────────────────────────── */}
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

      {/* ── Danger zone ─────────────────────────────────── */}
      <Section icon={<AlertTriangle className="w-4 h-4" />} title="Danger zone" danger>
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Deleting your workspace permanently removes all monitored URLs, screenshots, and alert
            history. This action cannot be undone.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all opacity-40 cursor-not-allowed"
            style={{
              background: 'rgba(255,68,68,0.08)',
              color:      '#ff7070',
              border:     '1px solid rgba(255,68,68,0.18)',
            }}
          >
            Delete workspace
          </button>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Contact <a href="mailto:support@pagewatch.dev" className="underline">support@pagewatch.dev</a> to request account deletion.
          </p>
        </div>
      </Section>
    </div>
  )
}
