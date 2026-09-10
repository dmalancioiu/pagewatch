export type ZoneSensitivity = 'low' | 'normal' | 'high'

export interface Zone {
  id:           string
  x:            number          // 0–1 relative to screenshot width
  y:            number          // 0–1 relative to screenshot height
  width:        number          // 0–1
  height:       number          // 0–1
  label?:       string
  instruction?: string          // per-zone watch instruction for Claude
  sensitivity?: ZoneSensitivity // diff sensitivity override for this zone
}

export type AlertType     = 'visual_change'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus   = 'open' | 'acknowledged' | 'dismissed'
export type CheckFrequency = 'hourly' | 'daily' | 'weekly'

/**
 * Subscription tier. The catalog of what each tier allows lives in
 * `lib/plans.ts` — this is only the stored identifier.
 */
export type PlanId = 'free' | 'pro' | 'business' | 'agency'

/** Lifecycle of the subscription, independent of which plan it points at. */
export type PlanStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  /** @deprecated Plans live on the workspace. Kept only for backfill. */
  plan: PlanId
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  owner_user_id: string
  name: string
  domain: string
  plan: PlanId
  plan_status: PlanStatus
  trial_ends_at: string | null
  current_period_end: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

/** Metered consumption for one workspace in one billing period. */
export interface WorkspaceUsage {
  id: string
  workspace_id: string
  period_start: string
  checks_used: number
  ai_calls_used: number
  bytes_stored: number
  updated_at: string
}

export type MonitoredUrlMode = 'watch' | 'archive'

export interface MonitoredUrl {
  id: string
  workspace_id: string
  url: string
  name: string
  check_frequency: CheckFrequency
  check_hour: number | null   // 0–23 UTC; null = use elapsed-time logic
  threshold_pct: number
  is_active: boolean
  last_checked_at: string | null
  // Smart upgrade fields
  watch_description: string | null  // Claude's alert context
  full_page: boolean                // full-page vs visible-area screenshot
  mode: MonitoredUrlMode            // 'watch' | 'archive'
  zones: Zone[] | null              // tracked regions; null = whole page
  deleted_at: string | null         // soft delete; non-null rows are hidden
  created_at: string
  updated_at: string
}

export interface ScreenshotSnapshot {
  id: string
  workspace_id: string
  monitored_url_id: string
  storage_path: string
  taken_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ScreenshotDiff {
  id: string
  workspace_id: string
  monitored_url_id: string
  previous_snapshot_id: string | null
  current_snapshot_id: string
  diff_pct: number
  diff_storage_path: string | null
  created_at: string
}

export interface Alert {
  id: string
  workspace_id: string
  monitored_url_id: string
  alert_type: AlertType
  severity: AlertSeverity
  status: AlertStatus
  title: string
  summary: string
  ai_summary: string | null   // Claude's plain-English change description
  diff_pct: number | null
  diff_storage_path: string | null
  current_snapshot_id: string | null
  previous_snapshot_id: string | null
  metadata: Record<string, unknown> | null
  triggered_at: string
  created_at: string
  monitored_urls?: MonitoredUrl
}

export interface NotificationChannel {
  id: string
  workspace_id: string
  channel_type: 'email' | 'slack'
  config: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export interface OnboardingState {
  id: string
  workspace_id: string
  step_key: string
  completed: boolean
  data: Record<string, unknown> | null
  updated_at: string
}
