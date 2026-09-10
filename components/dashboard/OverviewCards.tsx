import { cn } from '@/lib/utils'

interface MetricProps {
  label: string
  value: string | number
  tone?: 'warn' | 'critical'
}

function Metric({ label, value, tone }: MetricProps) {
  return (
    <span className="flex items-baseline gap-1.5 text-meta text-text-muted">
      <span
        className={cn(
          'tabular-nums text-ui-medium',
          tone === 'critical' ? 'text-critical' : tone === 'warn' ? 'text-warn' : 'text-text'
        )}
      >
        {value}
      </span>
      {label}
    </span>
  )
}

interface OverviewCardsProps {
  openAlerts: number
  failingMonitors: number
  activeMonitors: number
  checksToday: number
}

/**
 * Compact metric strip — deliberately not four big stat cards (design system:
 * the feed of what changed is the page, this is a one-line status readout
 * above it).
 */
export function OverviewCards({
  openAlerts,
  failingMonitors,
  activeMonitors,
  checksToday,
}: OverviewCardsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-md border border-border bg-panel px-3.5 py-2">
      <Metric label={openAlerts === 1 ? 'open alert' : 'open alerts'} value={openAlerts} tone={openAlerts > 0 ? 'critical' : undefined} />
      <Metric
        label={failingMonitors === 1 ? 'monitor failing' : 'monitors failing'}
        value={failingMonitors}
        tone={failingMonitors > 0 ? 'warn' : undefined}
      />
      <Metric label="active monitors" value={activeMonitors} />
      <Metric label="checks today" value={checksToday} />
    </div>
  )
}
