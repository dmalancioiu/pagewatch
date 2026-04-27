type Variant =
  | 'healthy' | 'paused' | 'alert' | 'archive'
  | 'open' | 'acknowledged' | 'dismissed'
  | 'critical' | 'high' | 'medium' | 'low'

interface StatusBadgeProps {
  variant: Variant
  label?: string
  size?: 'sm' | 'md'
}

const CONFIG: Record<Variant, { text: string; color: string; bg: string; border: string }> = {
  healthy:      { text: 'Healthy',      color: '#16A34A', bg: 'rgba(22,163,74,0.09)',    border: 'rgba(22,163,74,0.2)' },
  paused:       { text: 'Paused',       color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.18)' },
  alert:        { text: 'Alert',        color: '#DC2626', bg: 'rgba(220,38,38,0.08)',    border: 'rgba(220,38,38,0.18)' },
  archive:      { text: 'Archive',      color: '#2563EB', bg: 'rgba(37,99,235,0.07)',    border: 'rgba(37,99,235,0.18)' },
  open:         { text: 'Open',         color: '#DC2626', bg: 'rgba(220,38,38,0.08)',    border: 'rgba(220,38,38,0.18)' },
  acknowledged: { text: 'Done',         color: '#6B7280', bg: 'rgba(107,114,128,0.07)', border: 'rgba(107,114,128,0.15)' },
  dismissed:    { text: 'Dismissed',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.07)', border: 'rgba(156,163,175,0.15)' },
  critical:     { text: 'Critical',     color: '#B91C1C', bg: 'rgba(185,28,28,0.08)',   border: 'rgba(185,28,28,0.2)' },
  high:         { text: 'High',         color: '#C2410C', bg: 'rgba(194,65,12,0.08)',   border: 'rgba(194,65,12,0.18)' },
  medium:       { text: 'Medium',       color: '#B45309', bg: 'rgba(180,83,9,0.08)',    border: 'rgba(180,83,9,0.18)' },
  low:          { text: 'Low',          color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.15)' },
}

export function StatusBadge({ variant, label, size = 'sm' }: StatusBadgeProps) {
  const cfg = CONFIG[variant]
  const text = label ?? cfg.text
  const fontSize = size === 'md' ? 12 : 10
  const padding = size === 'md' ? '3px 9px' : '2px 7px'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize,
      fontWeight: 600,
      lineHeight: 1,
      padding,
      borderRadius: 5,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    }}>
      {text}
    </span>
  )
}
