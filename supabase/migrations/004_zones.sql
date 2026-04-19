-- ─────────────────────────────────────────────────────────────────────────────
-- Add zones to monitored_urls.
-- zones is a JSONB array of { id, x, y, width, height, label? }
-- where x/y/width/height are 0–1 relative to the screenshot dimensions.
-- NULL means "watch the whole page" (legacy behaviour preserved).
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.monitored_urls
  add column if not exists zones jsonb default null;
