-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Stripe event log
--
-- Stripe retries a webhook on any non-2xx response, and at-least-once delivery
-- means the same event can arrive more than once regardless. Without a record
-- of what has been handled, a retry re-applies the change — which for a plan
-- update is usually harmless and for anything metered is not.
--
-- The insert IS the lock: a duplicate event id collides on the primary key, and
-- the handler acknowledges without repeating the work. A handler that fails
-- deletes its row on the way out, so the retry is allowed to run.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.stripe_events (
  id           text        primary key,   -- Stripe's own event id (evt_...)
  type         text        not null,
  received_at  timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- No policy on purpose: only the service role touches this table, and the
-- service role bypasses RLS. Enabling RLS with no policy denies everyone else.

create index if not exists idx_stripe_events_received
  on public.stripe_events(received_at desc);
