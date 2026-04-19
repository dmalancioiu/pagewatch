-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Smart Upgrade migration
-- Adds AI watch description, full-page toggle, archive mode, and AI summary
-- ─────────────────────────────────────────────────────────────────────────────

-- ── monitored_urls additions ──────────────────────────────────────────────────

-- What the user wants to be alerted about (Claude's context)
alter table public.monitored_urls
  add column if not exists watch_description text;

-- Full-page screenshot vs visible area only
alter table public.monitored_urls
  add column if not exists full_page boolean not null default true;

-- 'watch' = monitor for changes + alert, 'archive' = just take screenshots
alter table public.monitored_urls
  add column if not exists mode text not null default 'watch'
    check (mode in ('watch', 'archive'));

-- ── alerts additions ──────────────────────────────────────────────────────────

-- Claude's plain-English description of what changed (replaces fake client rule)
alter table public.alerts
  add column if not exists ai_summary text;
