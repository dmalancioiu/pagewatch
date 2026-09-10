import type { AlertSeverity } from './types/database.types'

/**
 * The single shared severity → tone mapping.
 *
 * `AlertSeverity` is a product/schema concept (`critical | high | medium | low`).
 * `Tone` is a design-system concept — the same four-value scale every other
 * status indicator in the UI (Badge, StatusDot, Meter) already speaks. This
 * module is the only place the two are allowed to touch. No screen or
 * component should re-derive this mapping — import `severityTone` (or
 * `SeverityBadge`, which already does) instead.
 */

/** Design-system tone scale shared by Badge, StatusDot and friends. */
export type Tone = 'critical' | 'warn' | 'info' | 'muted'

const SEVERITY_TONE: Record<AlertSeverity, Tone> = {
  critical: 'critical',
  high: 'warn',
  medium: 'info',
  low: 'muted',
}

/** Human label for a severity, used next to the tone-mapped badge/dot. */
const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function severityTone(severity: AlertSeverity): Tone {
  return SEVERITY_TONE[severity]
}

export function severityLabel(severity: AlertSeverity): string {
  return SEVERITY_LABEL[severity]
}
