-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Change classification and routing (backlog D2)
--
-- D1 (migration 008) gave every capture a structured `ContentChange[]` — what
-- changed. This migration gives every alert a `change_type` — what KIND of
-- change it is (`lib/change-types.ts#ChangeType`: price, plan_structure,
-- copy, offer, legal, availability, layout, broken, other) — and gives every
-- monitor a `change_routing` map saying what should happen per type. Without
-- a type, a price rise, a footer year, a legal update and a broken hero all
-- arrive looking identical; without routing, every one of them either alerts
-- or doesn't, with no room for "tell me about prices, just log the rest".
--
-- `trigger/lib/classify-change.ts` computes the type deterministically
-- wherever it can (most changes are obvious — see that file's doc comment)
-- and falls through to the existing Claude call in
-- `trigger/lib/analyze-diff-with-ai.ts` (extended with a `change_type` field,
-- not a second call) only when genuinely ambiguous and the plan has
-- `aiSummaries`. `trigger/lib/take-screenshot.ts` stores the result here and
-- reads `change_routing` back to decide whether the alert it just wrote
-- notifies instantly, waits for the daily digest, or is recorded silently.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── alerts.change_type ───────────────────────────────────────────────────────
-- Nullable, no default: every alert going forward gets a type, but nothing
-- retroactively classifies historical rows — same reasoning `content_hash`
-- in 008 used for existing snapshots. `null` reads as "not yet classified"
-- (unclassified history, or an alert-writing path predating this feature),
-- never as a real category, so no code should treat null the same as
-- `'other'` when filtering or charting.

alter table public.alerts
  add column if not exists change_type text
    check (
      change_type is null
      or change_type in ('price', 'plan_structure', 'copy', 'offer', 'legal', 'availability', 'layout', 'broken', 'other')
    );

comment on column public.alerts.change_type is
  'ChangeType from lib/change-types.ts, set by trigger/lib/classify-change.ts (deterministic) or trigger/lib/analyze-diff-with-ai.ts (model, only when the deterministic pass was ambiguous and the plan has aiSummaries). Null means unclassified history, not the "other" category.';

-- Filtering by type is the whole point of this feature (per-type digests,
-- per-type rules, charts) — every one of those queries is scoped to a
-- workspace first, matching the composite-index pattern already used by
-- `idx_workspace_usage_lookup` (005) and
-- `idx_screenshot_snapshots_monitor_content_hash` (008), rather than a bare
-- index on `change_type` alone.
create index if not exists idx_alerts_workspace_change_type
  on public.alerts (workspace_id, change_type);

-- ─── monitored_urls.change_routing ────────────────────────────────────────────
-- Per-monitor map of ChangeType -> 'alert' | 'digest_only' | 'ignore'
-- (`lib/change-types.ts#ChangeRoutingMap`). Stored as jsonb rather than
-- normalized rows for the same reason `zones` and `extract` are jsonb: the
-- shape is keyed on an evolving taxonomy, not a fixed set of columns, and a
-- monitor with no opinion on a given type simply omits that key.
--
-- Default null, meaning "every type routes to 'alert'" — today's behaviour
-- exactly. An existing monitor with no `change_routing` row, or a routing map
-- missing a specific type's key, or a malformed/corrupt value all resolve to
-- 'alert' via `resolveRouting()` (lib/change-types.ts), never to a throw or a
-- silent drop.
--
-- 'ignore' still WRITES the alert row (history is the product) but the
-- worker inserts it with status = 'dismissed' rather than 'open' — the same
-- column `acknowledgeAlert`/`dismissAlert` (lib/actions/alerts.ts) already
-- write, so it never enters the digest's `.eq('status', 'open')` query or an
-- instant-alert send, without this migration touching
-- `trigger/tasks/send-alert-digest.ts` or `trigger/lib/notify.ts` at all. It
-- still appears in `getAlerts()` (no status filter) and the URL detail
-- history feed, which is the "still writes it, just doesn't notify"
-- requirement.
alter table public.monitored_urls
  add column if not exists change_routing jsonb;

comment on column public.monitored_urls.change_routing is
  'Per-monitor map of ChangeType -> "alert" | "digest_only" | "ignore" (lib/change-types.ts#ChangeRoutingMap), read via resolveRouting(). Null (or a missing key) means "alert" — existing monitors are unaffected. Applied in trigger/lib/take-screenshot.ts: "ignore" writes the alert row with status=dismissed instead of open and skips triggerInstantAlert entirely; "digest_only" skips triggerInstantAlert but keeps status=open so the daily digest still picks it up; "alert" is unchanged from pre-D2 behaviour.';

-- No RLS changes: both columns live on tables (`alerts`, `monitored_urls`)
-- that already carry a workspace-membership policy covering select/update —
-- same note migration 009 made for its two `monitored_urls` columns.
