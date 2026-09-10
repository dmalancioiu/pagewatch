import { DollarSign, Heading as HeadingIcon, History, Layers, Tag, Type } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { SeverityBadge } from '@/components/ui/severity-badge'
import type { ContentChange } from '@/lib/content-diff'
import type { AlertWithUrls } from '@/app/dashboard/urls/[id]/UrlDetailClient'

interface Props {
  /** Newest-first is assumed if already sorted; this component sorts defensively either way. */
  alerts: AlertWithUrls[]
}

/** Price changes lead — they're the single most valuable line in this list. */
const KIND_WEIGHT: Record<ContentChange['kind'], number> = {
  price: 0,
  price_added: 1,
  price_removed: 1,
  heading_changed: 2,
  heading_added: 2,
  heading_removed: 2,
  meta_changed: 3,
  structure_changed: 4,
  text_added: 5,
  text_removed: 5,
}

function truncate(text: string, max = 96): string {
  const trimmed = text.trim()
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed
}

const META_FIELD_LABEL = {
  title: 'Page title',
  description: 'Meta description',
  canonical: 'Canonical URL',
} as const

export function iconFor(kind: ContentChange['kind']) {
  switch (kind) {
    case 'price':
    case 'price_added':
    case 'price_removed':
      return DollarSign
    case 'heading_added':
    case 'heading_removed':
    case 'heading_changed':
      return HeadingIcon
    case 'structure_changed':
      return Layers
    case 'meta_changed':
      return Tag
    default:
      return Type
  }
}

/** One typed, user-legible line per change — this is what makes an alert legible without opening the image diff. Exported for `UrlDetailSettings`' per-capture summary. */
export function describeChange(change: ContentChange): string {
  switch (change.kind) {
    case 'price':
      return `${change.label || 'Price'}: ${change.from} → ${change.to}`
    case 'price_added':
      return `Added: ${change.label ? `${change.label} ` : ''}${change.value}`
    case 'price_removed':
      return `Removed: ${change.label ? `${change.label} ` : ''}${change.value}`
    case 'heading_added':
      return `New heading: "${truncate(change.text)}"`
    case 'heading_removed':
      return `Removed heading: "${truncate(change.text)}"`
    case 'heading_changed':
      return `Heading changed: "${truncate(change.from)}" → "${truncate(change.to)}"`
    case 'text_added':
      return `Added: "${truncate(change.text)}"`
    case 'text_removed':
      return `Removed: "${truncate(change.text)}"`
    case 'meta_changed':
      return `${META_FIELD_LABEL[change.field]} changed`
    case 'structure_changed':
      return 'Page structure changed'
    default:
      return 'Something changed'
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Shared with `UrlDetailSettings`' per-capture "What changed" summary — one place that knows how `content_changes` is shaped inside `metadata`. */
export function contentChangesOf(alert: AlertWithUrls): ContentChange[] {
  const raw = (alert.metadata as { content_changes?: unknown } | null | undefined)?.content_changes
  return Array.isArray(raw) ? (raw as ContentChange[]) : []
}

const MAX_CHANGES_SHOWN = 8

/**
 * A typed list of what changed, grouped by capture, newest first. Percentages
 * stay secondary metadata (design system §7) — the typed changes are the
 * headline, `diff_pct` is a small mono figure off to the side.
 */
export function ChangeTimeline({ alerts }: Props) {
  const groups = alerts
    .map((alert) => ({ alert, changes: contentChangesOf(alert) }))
    .filter((g) => g.changes.length > 0)
    .sort((a, b) => new Date(b.alert.created_at).getTime() - new Date(a.alert.created_at).getTime())

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<History className="size-4" aria-hidden />}
        title="No changes recorded yet"
        description="Once an alert finds a structured change — a price, a heading, a line of copy — it shows up here."
      />
    )
  }

  return (
    <ol className="flex flex-col divide-y divide-border">
      {groups.map(({ alert, changes }) => {
        const sorted = [...changes].sort((a, b) => (KIND_WEIGHT[a.kind] ?? 9) - (KIND_WEIGHT[b.kind] ?? 9))
        const visible = sorted.slice(0, MAX_CHANGES_SHOWN)
        const hiddenCount = sorted.length - visible.length

        return (
          <li key={alert.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-ui-medium text-text">{fmtDate(alert.created_at)}</span>
              {alert.severity && <SeverityBadge severity={alert.severity} size="sm" />}
              {alert.diff_pct != null && (
                <span className="ml-auto font-mono text-meta text-text-faint tabular-nums">
                  {Number(alert.diff_pct).toFixed(1)}%
                </span>
              )}
            </div>

            <ul className="flex flex-col gap-1.5">
              {visible.map((change, i) => {
                const Icon = iconFor(change.kind)
                return (
                  <li key={i} className="flex items-start gap-2 text-ui text-text">
                    <Icon className="mt-0.5 size-3.5 shrink-0 text-text-faint" aria-hidden />
                    <span className="min-w-0">{describeChange(change)}</span>
                  </li>
                )
              })}
            </ul>

            {hiddenCount > 0 && (
              <p className="pl-5 text-meta text-text-faint">+{hiddenCount} more change{hiddenCount === 1 ? '' : 's'}</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
