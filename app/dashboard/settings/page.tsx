import { redirect } from 'next/navigation'
import { getWorkspace } from '@/lib/actions/workspace'
import { createServerClient } from '@/lib/supabase/server'
import { User, Bell, CreditCard, AlertTriangle, Building2, CheckCircle2, Slack, ArrowUpRight, Copy, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Settings — PageWatch' }

function Section({ icon, eyebrow, title, description, children, danger }: { icon: React.ReactNode; eyebrow?: string; title: string; description?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <section style={{ background: '#FFFFFF', border: `1px solid ${danger ? 'rgba(220,38,38,0.18)' : 'rgba(15,23,42,0.08)'}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 36px rgba(15,23,42,0.045)' }}>
      <div style={{ padding: '16px 18px', borderBottom: `1px solid ${danger ? 'rgba(220,38,38,0.12)' : '#EEF2F7'}`, background: danger ? 'linear-gradient(180deg, #FFF7F7, #FFFFFF)' : 'linear-gradient(180deg, #FFFFFF, #FBFCFF)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: danger ? 'rgba(220,38,38,0.07)' : 'rgba(37,99,235,0.08)', border: danger ? '1px solid rgba(220,38,38,0.15)' : '1px solid rgba(37,99,235,0.15)', color: danger ? '#DC2626' : '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          {eyebrow && <p style={{ margin: 0, marginBottom: 2, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: danger ? '#F87171' : '#94A3B8' }}>{eyebrow}</p>}
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: danger ? '#991B1B' : '#0F172A', letterSpacing: '-0.02em' }}>{title}</h2>
          {description && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#94A3B8', lineHeight: 1.45 }}>{description}</p>}
        </div>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </section>
  )
}

function Field({ label, value, hint, mono = false }: { label: string; value: string; hint?: string; mono?: boolean }) {
  return (
    <div>
      <p style={{ margin: '0 0 7px', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <div style={{ minHeight: 42, borderRadius: 12, background: '#FBFCFF', border: '1px solid #E2E8F0', padding: '11px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontSize: 13, color: '#0F172A', fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : undefined, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        {mono && <Copy size={13} style={{ color: '#CBD5E1', flexShrink: 0 }} />}
      </div>
      {hint && <p style={{ margin: '7px 0 0', fontSize: 11, color: '#94A3B8', lineHeight: 1.45 }}>{hint}</p>}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div style={{ padding: 14, borderRadius: 14, background: '#FBFCFF', border: '1px solid #E2E8F0' }}><p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p><p style={{ margin: 0, fontSize: 22, lineHeight: 1, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.04em' }}>{value}</p></div>
}

function StatusPill({ active }: { active: boolean }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 9px', color: active ? '#15803D' : '#64748B', background: active ? 'rgba(22,163,74,0.08)' : '#F1F5F9', border: active ? '1px solid rgba(22,163,74,0.18)' : '1px solid #E2E8F0', fontSize: 11, fontWeight: 800 }}>{active && <CheckCircle2 size={12} />} {active ? 'Active' : 'Inactive'}</span>
}

export default async function SettingsPage() {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const supabase = await createServerClient()
  const [{ data: channels }, { data: { user } }] = await Promise.all([
    supabase.from('notification_channels').select('*').eq('workspace_id', workspace.id),
    supabase.auth.getUser(),
  ])

  const emailChannel = channels?.find((c: any) => c.channel_type === 'email')
  const emailAddr = (emailChannel?.config as any)?.email ?? user?.email ?? '—'
  const emailFreq = (emailChannel?.config as any)?.frequency ?? 'daily'

  return (
    <div className="canvas-dot-bg" style={{ minHeight: '100vh', padding: '26px 32px 48px' }}>
      <div style={{ maxWidth: 980 }}>
        <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 850, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Settings</p>
            <h1 style={{ margin: 0, fontSize: 26, lineHeight: 1.08, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.045em' }}>Workspace control center</h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748B' }}>Manage workspace identity, alerts, billing, and account details.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15,23,42,0.045)' }}><ShieldCheck size={14} style={{ color: '#2563EB' }} /><span style={{ fontSize: 12, fontWeight: 750, color: '#475569' }}>Free workspace</span></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.9fr)', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Section icon={<Building2 size={16} />} title="Workspace" description="Public labels and support identifiers for this workspace.">
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Workspace name" value={workspace.name ?? '—'} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Domain label" value={workspace.domain ?? '—'} hint="Contact support to change this label." />
                  <Field label="Workspace ID" value={workspace.id} hint="Use this ID when contacting support." mono />
                </div>
              </div>
            </Section>

            <Section icon={<Bell size={16} />} title="Notifications" description="Where PageWatch sends monitor changes and alert digests.">
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 14, background: '#FBFCFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div><p style={{ margin: 0, fontSize: 13, fontWeight: 780, color: '#0F172A' }}>Email alerts</p><p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>{emailChannel ? `Sending to ${emailAddr}` : 'Not configured'}</p></div>
                  <StatusPill active={Boolean(emailChannel?.is_active)} />
                </div>
                <Field label="Alert frequency" value={`${emailFreq.charAt(0).toUpperCase() + emailFreq.slice(1)} digest`} />
                <div style={{ padding: 14, borderRadius: 14, background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 11, background: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Slack size={15} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}><p style={{ margin: 0, fontSize: 13, fontWeight: 750, color: '#64748B' }}>Slack notifications</p><p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>Available on the Pro plan.</p></div>
                  <a href="/#pricing" style={{ height: 32, padding: '0 11px', borderRadius: 9, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', color: '#2563EB', fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>Upgrade <ArrowUpRight size={12} /></a>
                </div>
              </div>
            </Section>

            <Section icon={<User size={16} />} title="Account" description="Signed-in user details for this workspace.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Email address" value={user?.email ?? '—'} />
                <Field label="User ID" value={user?.id ?? '—'} hint="Used for support requests." mono />
              </div>
            </Section>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Section icon={<CreditCard size={16} />} title="Plan & billing" description="Current plan limits and upgrade options.">
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ padding: 15, borderRadius: 15, background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div><p style={{ margin: 0, fontSize: 15, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.025em' }}>Free plan</p><p style={{ margin: '4px 0 0', fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>3 monitors · Daily checks · Email alerts</p></div>
                    <a href="/#pricing" style={{ height: 33, padding: '0 12px', borderRadius: 10, background: '#2563EB', color: '#FFFFFF', fontSize: 12, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 18px rgba(37,99,235,0.2)' }}>Upgrade <ArrowUpRight size={12} /></a>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <StatCard label="Monitors" value="3/3" />
                  <StatCard label="Checks/mo" value="90/90" />
                  <StatCard label="Retention" value="30d" />
                </div>
              </div>
            </Section>

            <Section icon={<AlertTriangle size={16} />} title="Danger zone" description="Permanent workspace-level actions." danger>
              <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Deleting your workspace permanently removes monitored URLs, screenshots, and alert history. This action cannot be undone.</p>
              <button disabled style={{ height: 36, padding: '0 13px', borderRadius: 10, border: '1px solid rgba(220,38,38,0.18)', background: 'rgba(220,38,38,0.06)', color: '#B91C1C', fontSize: 12, fontWeight: 800, opacity: 0.45, cursor: 'not-allowed' }}>Delete workspace</button>
              <p style={{ margin: '11px 0 0', fontSize: 11, color: '#94A3B8', lineHeight: 1.45 }}>Contact <a href="mailto:support@pagewatch.dev" style={{ color: '#64748B', textDecoration: 'underline' }}>support@pagewatch.dev</a> to request account deletion.</p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
