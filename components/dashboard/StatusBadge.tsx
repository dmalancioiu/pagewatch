import { Badge, type BadgeProps } from '@/components/ui/badge'

/**
 * Structural status states used across the dashboard (monitor health, alert
 * lifecycle) plus the four `AlertSeverity` values. Kept as one component with
 * a stable `variant` prop because `app/dashboard/urls/[id]/UrlDetailClient.tsx`
 * (owned by another agent) renders `<StatusBadge variant={alert.severity ?? 'alert'} />`
 * directly — the prop name and the variant strings below are a public API.
 */
type Variant =
  | 'healthy' | 'paused' | 'alert' | 'archive'
  | 'open' | 'acknowledged' | 'dismissed'
  | 'critical' | 'high' | 'medium' | 'low'

interface StatusBadgeProps {
  variant: Variant
  label?: string
  size?: 'sm' | 'md'
}

/** Every tone here is one of Badge's own tones — no raw hex, ever. */
const CONFIG: Record<Variant, { text: string; tone: BadgeProps['tone'] }> = {
  healthy: { text: 'Healthy', tone: 'ok' },
  paused: { text: 'Paused', tone: 'neutral' },
  alert: { text: 'Alert', tone: 'critical' },
  archive: { text: 'Archive', tone: 'accent' },
  open: { text: 'Open', tone: 'critical' },
  acknowledged: { text: 'Done', tone: 'neutral' },
  dismissed: { text: 'Dismissed', tone: 'neutral' },
  critical: { text: 'Critical', tone: 'critical' },
  high: { text: 'High', tone: 'warn' },
  medium: { text: 'Medium', tone: 'info' },
  low: { text: 'Low', tone: 'neutral' },
}

export function StatusBadge({ variant, label, size = 'sm' }: StatusBadgeProps) {
  const cfg = CONFIG[variant]
  return (
    <Badge tone={cfg.tone} size={size}>
      {label ?? cfg.text}
    </Badge>
  )
}
