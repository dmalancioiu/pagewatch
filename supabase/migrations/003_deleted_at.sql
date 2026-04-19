-- ─────────────────────────────────────────────────────────────────────────────
-- Add deleted_at to monitored_urls so "deleted" and "paused" are distinct.
-- is_active = false  →  paused  (still visible in UI)
-- deleted_at IS NOT NULL  →  deleted  (hidden from all queries)
--
-- Existing rows with is_active = false were soft-deleted before this migration.
-- We preserve them as hard-deleted by setting deleted_at = updated_at.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.monitored_urls
  add column if not exists deleted_at timestamptz default null;

-- Mark previously soft-deleted rows as properly deleted
update public.monitored_urls
  set deleted_at = updated_at
  where is_active = false;

-- Restore is_active = true on those rows (they are now hidden via deleted_at,
-- not via is_active, so the field reflects actual monitoring intent)
update public.monitored_urls
  set is_active = true
  where deleted_at is not null;
