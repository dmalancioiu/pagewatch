import { BellRing, Clock, Globe, ShieldAlert } from 'lucide-react'

interface StatCardProps {
  label:    string
  value:    string | number
  sublabel?: string
  icon:     React.ReactNode
  variant?: 'default' | 'critical'
}

function StatCard({ label, value, sublabel, icon, variant = 'default' }: StatCardProps) {
  const isCritical = variant === 'critical'

  return (
    <div
      className={`rounded-xl border p-5 relative overflow-hidden transition-colors ${
        isCritical
          ? 'border-red-500/20 bg-red-500/[0.04]'
          : 'border-white/[0.06] bg-white/[0.015]'
      }`}
    >
      {isCritical && (
        <div className="absolute inset-0 bg-red-500/[0.04] pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <p className={`text-sm font-medium ${isCritical ? 'text-red-400/80' : 'text-white/45'}`}>
          {label}
        </p>
        <div className={`${isCritical ? 'text-red-500' : 'text-white/20'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <p className={`text-3xl font-semibold tracking-tight ${isCritical ? 'text-white' : 'text-white/90'}`}>
          {value}
        </p>
        {sublabel && (
          <p className={`text-xs ${isCritical ? 'text-red-400/60' : 'text-white/30'}`}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}

interface OverviewCardsProps {
  openAlerts:    number
  criticalAlerts: number
  urlsTracked:   number
  lastChecked:   string | null
}

export function OverviewCards({
  openAlerts,
  criticalAlerts,
  urlsTracked,
  lastChecked,
}: OverviewCardsProps) {
  const lastCheckedLabel = lastChecked
    ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        Math.round((new Date(lastChecked).getTime() - Date.now()) / (1000 * 60 * 60)),
        'hour',
      )
    : 'Never'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Open Alerts"
        value={openAlerts}
        sublabel="unresolved"
        icon={<BellRing className="w-4 h-4" />}
        variant={openAlerts > 0 ? 'critical' : 'default'}
      />
      <StatCard
        label="Critical"
        value={criticalAlerts}
        sublabel="high priority"
        icon={<ShieldAlert className="w-4 h-4" />}
        variant={criticalAlerts > 0 ? 'critical' : 'default'}
      />
      <StatCard
        label="URLs Monitored"
        value={urlsTracked}
        sublabel="active"
        icon={<Globe className="w-4 h-4" />}
      />
      <StatCard
        label="Last Checked"
        value={lastCheckedLabel}
        sublabel="screenshot"
        icon={<Clock className="w-4 h-4" />}
      />
    </div>
  )
}
