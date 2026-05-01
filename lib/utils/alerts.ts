import type { AlertSeverity, AlertType } from '../types/database.types'

/** Badge classes — dark-mode palette */
export function getSeverityClasses(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'high':     return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    case 'medium':   return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'low':      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  }
}

/** Left-border accent on alert cards */
export function getSeverityBorderColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical': return 'border-l-red-500'
    case 'high':     return 'border-l-orange-500'
    case 'medium':   return 'border-l-yellow-500'
    case 'low':      return 'border-l-emerald-500'
  }
}

/** Dot indicator color */
export function getSeverityDotColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
    case 'high':     return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
    case 'medium':   return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
    case 'low':      return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  }
}

export function getAlertTypeLabel(type: AlertType): string {
  switch (type) {
    case 'visual_change': return 'Relevant Change'
  }
}

export function getAlertTypeIcon(type: AlertType): string {
  switch (type) {
    case 'visual_change': return '◉'
  }
}

/** Technical-only diff label for details/tooltips, not primary alert copy. */
export function formatTechnicalDiffPct(pct: number | null): string {
  if (pct === null) return 'No pixel diff recorded'
  return `${pct.toFixed(1)}% of watched pixels changed`
}

/** Colour for technical diff details */
export function getDiffPctColor(pct: number | null): string {
  if (pct === null) return 'text-white/30'
  if (pct >= 50) return 'text-red-400'
  if (pct >= 25) return 'text-orange-400'
  if (pct >= 10) return 'text-yellow-400'
  return 'text-white/35'
}
