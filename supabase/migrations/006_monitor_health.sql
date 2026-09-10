-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Monitor health
--
-- Today a failed capture is invisible. `run-single-url` calls `processUrl`,
-- `processUrl` throws (site down, TLS error, timeout, bot wall), Trigger.dev
-- logs the attempt and retries it — and if every retry also fails, the only
-- trace is a line in the Trigger.dev run log that nobody is watching.
-- `last_checked_at` is never touched because the code that would touch it
-- never runs, and there is nowhere on `monitored_urls` to record that
-- anything went wrong at all. The dashboard keeps showing a monitor that
-- looks exactly like one which is working, for as long as the site stays
-- unreachable — which, for a product whose entire premise is "we watch this
-- so you don't have to", is the one failure mode that must never be silent.
--
-- This migration adds the columns that let a capture record its own health,
-- and the two RPCs that write them atomically. Everything here is written by
-- the service-role worker only — there is no client mutation path, matching
-- `record_usage` in 005.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── monitored_urls: health columns ───────────────────────────────────────────

-- Consecutive failed captures, reset to 0 on the next success. Read by the
-- worker to decide when to notify (3) and when to give up and pause (10), and
-- by the dashboard to render a "hasn't run" badge — a stale `last_checked_at`
-- alone can't distinguish "quiet site" from "broken monitor".
alter table public.monitored_urls
  add column if not exists consecutive_failures integer not null default 0;

-- Short, human-readable reason for the most recent failure — "Timed out after
-- 30s", "DNS lookup failed", "HTTP 403". Deliberately never a raw error object
-- or stack trace: this string is shown to the customer in the dashboard and in
-- the "can't reach this page" email, and logged nowhere more private than
-- those two places, so it must never carry a hostname with embedded
-- credentials, an internal error message, or anything else not meant to
-- leave the worker.
alter table public.monitored_urls
  add column if not exists last_error text;

alter table public.monitored_urls
  add column if not exists last_error_at timestamptz;

-- Last time a capture actually completed, independent of `last_checked_at`
-- (which historically meant "we attempted a check", including ones that then
-- failed downstream of it). Kept separate so "healthy as of" can be answered
-- precisely even while `last_checked_at` semantics elsewhere stay unchanged.
alter table public.monitored_urls
  add column if not exists last_success_at timestamptz;

-- ─── Partial index: failing monitors ──────────────────────────────────────────
-- The dashboard's "monitors that need attention" query filters to exactly
-- this shape — a workspace's non-deleted monitors that are currently
-- failing — and nothing else. A partial index keeps it tiny and fast
-- regardless of how large `monitored_urls` grows, since the overwhelming
-- majority of rows at any time are healthy and never enter it.
create index if not exists idx_monitored_urls_failing
  on public.monitored_urls (workspace_id, consecutive_failures desc)
  where deleted_at is null and consecutive_failures > 0;

-- ─── record_monitor_failure() ─────────────────────────────────────────────────
-- Atomic increment, mirroring `record_usage()` in 005 for the same reason:
-- Trigger.dev's retry means a single logical failure can call this more than
-- once, and a read-modify-write from the worker would race itself and could
-- under-count. Returning the post-increment count lets the caller make a
-- single, race-free decision about crossing the 3- and 10-failure
-- thresholds — the worker fires a notification only when this function
-- itself reports it just reached the threshold, so a retried call that lands
-- on failure 4 can never re-send the failure-3 email.
create or replace function public.record_monitor_failure(
  monitor_id uuid,
  reason     text
)
returns integer
language plpgsql
security definer
set search_path = public as $$
declare
  new_count integer;
begin
  update public.monitored_urls
  set consecutive_failures = consecutive_failures + 1,
      last_error            = reason,
      last_error_at         = now()
  where id = monitor_id
  returning consecutive_failures into new_count;

  return new_count;
end;
$$;

revoke all on function public.record_monitor_failure(uuid, text) from public, anon, authenticated;
grant execute on function public.record_monitor_failure(uuid, text) to service_role;

-- ─── record_monitor_success() ─────────────────────────────────────────────────
-- Clears the failure streak in one write. Called after a capture completes
-- without throwing, so a monitor that was flapping shows a clean bill of
-- health the moment it recovers rather than carrying a stale `last_error`
-- forward next to a fresh `last_success_at`.
create or replace function public.record_monitor_success(
  monitor_id uuid
)
returns void
language plpgsql
security definer
set search_path = public as $$
begin
  update public.monitored_urls
  set consecutive_failures = 0,
      last_success_at      = now(),
      last_error            = null,
      last_error_at         = null
  where id = monitor_id;
end;
$$;

revoke all on function public.record_monitor_success(uuid) from public, anon, authenticated;
grant execute on function public.record_monitor_success(uuid) to service_role;

-- ─── notification_events.alert_id: allow health notifications ────────────────
-- `notification_events` was defined with `alert_id not null` because the only
-- thing that ever sent email was the alert digest. The "can't reach this
-- page" and "monitoring paused" emails this migration enables have no alert
-- behind them — they are about the monitor itself — so the column must accept
-- null. `channel_type` plus `metadata` still say what was sent and why.
alter table public.notification_events
  alter column alert_id drop not null;
