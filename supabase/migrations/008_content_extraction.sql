-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Structured content extraction
--
-- Today a change is `diff_pct: 4.2` and two screenshots — engineering detail,
-- not an answer. This migration gives each snapshot a place to hold what
-- `trigger/lib/extract-content.ts` pulls out of the rendered page (headings,
-- visible text, JSON-LD, prices with their nearest label, a DOM outline hash)
-- so `lib/content-diff.ts` can turn a pixel delta into "the Business tier
-- moved from $14 to $18/user/month" instead of a percentage.
--
-- `extract` is stored as jsonb rather than normalized columns because its
-- shape (`PageExtract` in lib/content-diff.ts) is still evolving with the
-- product — headings/prices/links are themselves arrays, and forcing that
-- into relational columns now would mean a migration every time the extract
-- gains a field. jsonb also lets a snapshot with a failed extraction simply
-- store null, which is the common case for a site that blocks scripted
-- evaluation or throws mid-page.
--
-- `content_hash` is a hash of the normalized text alone (not the whole
-- extract — prices/headings/links move independently of body copy and would
-- make the hash change on every capture even when nothing a person would
-- describe actually did). It exists so "did anything change at all" can be a
-- single indexed equality check instead of downloading and diffing the
-- previous extract on every capture, mirroring why `workspace_usage` in 005
-- keeps a counter instead of re-deriving usage from `screenshot_snapshots`
-- every time.
--
-- No separate cleanup is needed: both columns live on `screenshot_snapshots`,
-- and the retention job already deletes those rows wholesale.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.screenshot_snapshots
  add column if not exists extract jsonb;

alter table public.screenshot_snapshots
  add column if not exists content_hash text;

-- Composite, not a bare index on content_hash: every lookup this feature does
-- is "the previous snapshot(s) for THIS monitor with THIS hash" (or "...with
-- a different hash"), scoped by monitored_url_id first, the same access
-- pattern `idx_workspace_usage_lookup` follows for (workspace_id, period).
create index if not exists idx_screenshot_snapshots_monitor_content_hash
  on public.screenshot_snapshots(monitored_url_id, content_hash);
