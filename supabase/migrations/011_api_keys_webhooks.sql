-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Public REST API: keys, rate limiting, and outbound webhooks
--
-- Three concerns, three table groups:
--
--  1. `api_keys` — never stores a usable secret. `key_hash` is the SHA-256
--     digest of the full key (see `lib/api-keys.ts`); `key_prefix` is a short,
--     non-secret slice kept only so the settings UI can show "which key is
--     this" without ever storing or re-deriving the plaintext. There is no
--     column a "reveal" endpoint could read from — the plaintext is not here.
--
--  2. `api_rate_limit_counters` — a Postgres-backed per-key-per-minute counter
--     (there is no Redis in this stack). Written only through
--     `increment_api_rate_limit()`, the same atomic-upsert shape as
--     `record_usage()` in 005_entitlements.sql, for the same reason: concurrent
--     requests against one key must not lose increments to a read-modify-write
--     race.
--
--  3. `webhook_endpoints` / `webhook_deliveries` — per-workspace outbound
--     webhook targets and a durable log of every delivery attempt. Unlike an
--     API key, `webhook_endpoints.secret` IS stored in the clear: the worker
--     must read it back on every delivery to sign the request (see
--     `lib/webhooks.ts`, `trigger/lib/webhook-delivery.ts`), and the customer
--     must be able to read it back from the dashboard to verify deliveries on
--     their end. It is still never logged and never sent anywhere but the
--     signing function and the settings page that owns it.
--
-- All four new tables are read/written exclusively through:
--   - `lib/actions/api-keys.ts` / `lib/actions/webhooks.ts` (session-scoped,
--     RLS-protected, for the dashboard), and
--   - `app/api/v1/**` / `trigger/tasks/deliver-webhook.ts` (service-role,
--     because a v1 request carries no Supabase session — see
--     `lib/api-auth.ts` for why every query there filters explicitly by the
--     workspace id resolved from the key instead of relying on RLS).
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── api_keys ────────────────────────────────────────────────────────────────

create table public.api_keys (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references public.workspaces(id) on delete cascade,
  name          text        not null,
  key_prefix    text        not null,
  key_hash      text        not null,
  scope         text        not null default 'read' check (scope in ('read', 'read_write')),
  created_by    uuid        references auth.users(id) on delete set null,
  last_used_at  timestamptz,
  revoked_at    timestamptz,
  created_at    timestamptz not null default now(),
  unique (key_hash)
);

comment on column public.api_keys.key_hash is
  'SHA-256 hex digest of the full plaintext key (lib/api-keys.ts#hashApiKey). The plaintext itself is never stored anywhere — this is the only durable form of the secret.';
comment on column public.api_keys.key_prefix is
  'First few characters of the plaintext key (e.g. pw_live_a1b2c3d4), kept only so the settings UI can tell keys apart. Carries none of the entropy.';

alter table public.api_keys enable row level security;

-- Dashboard reads/writes (create, list, revoke) go through
-- lib/actions/api-keys.ts using the session-scoped client, which is how this
-- policy gets exercised. app/api/v1/** never touches this table through RLS
-- at all — it authenticates with the service-role client precisely because
-- a v1 request has no session for RLS to key off of.
create policy "api_keys_access"
  on public.api_keys for all
  using (is_workspace_member(workspace_id));

create index idx_api_keys_workspace on public.api_keys(workspace_id) where revoked_at is null;

-- ─── api_rate_limit_counters ─────────────────────────────────────────────────
-- One row per (key, minute window). No client-facing policy at all — the
-- only writer is increment_api_rate_limit() via the service-role client in
-- lib/api-auth.ts, the same "no client insert/update policy on purpose"
-- shape workspace_usage uses in 005_entitlements.sql.

create table public.api_rate_limit_counters (
  api_key_id    uuid        not null references public.api_keys(id) on delete cascade,
  window_start  timestamptz not null,
  request_count integer     not null default 0,
  primary key (api_key_id, window_start)
);

alter table public.api_rate_limit_counters enable row level security;

create or replace function public.increment_api_rate_limit(
  key_id uuid,
  window_ts timestamptz
)
returns integer
language plpgsql
security definer
set search_path = public as $$
declare
  new_count integer;
begin
  insert into public.api_rate_limit_counters as c (api_key_id, window_start, request_count)
  values (key_id, window_ts, 1)
  on conflict (api_key_id, window_start) do update
    set request_count = c.request_count + 1
  returning request_count into new_count;

  return new_count;
end;
$$;

revoke all on function public.increment_api_rate_limit(uuid, timestamptz) from public, anon, authenticated;
grant execute on function public.increment_api_rate_limit(uuid, timestamptz) to service_role;

-- Old windows are cheap to accumulate (one row per key per minute actually
-- used) but unbounded over years — a future retention pass can delete rows
-- older than a couple of hours; not required for correctness today.

-- ─── webhook_endpoints ────────────────────────────────────────────────────────

create table public.webhook_endpoints (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  url          text        not null,
  description  text,
  secret       text        not null,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on column public.webhook_endpoints.secret is
  'HMAC-SHA256 signing secret, stored in the clear on purpose — the worker must read it back to sign every delivery, and the customer must be able to read it back to verify one. See lib/webhooks.ts.';

alter table public.webhook_endpoints enable row level security;
create policy "webhook_endpoints_access"
  on public.webhook_endpoints for all
  using (is_workspace_member(workspace_id));

create trigger set_webhook_endpoints_updated_at
  before update on public.webhook_endpoints
  for each row execute function public.set_updated_at();

create index idx_webhook_endpoints_workspace on public.webhook_endpoints(workspace_id);

-- ─── webhook_deliveries ───────────────────────────────────────────────────────
-- One row per delivery *attempt* (not per event) so the settings UI can show
-- a real attempt history including retries, matching how notification_events
-- already records email/Slack sends in pagewatch_init.sql. Written only by
-- trigger/tasks/deliver-webhook.ts via the service-role client — deliveries
-- happen from the worker, never from a request handler.

create table public.webhook_deliveries (
  id                uuid        primary key default gen_random_uuid(),
  workspace_id      uuid        not null references public.workspaces(id) on delete cascade,
  endpoint_id       uuid        not null references public.webhook_endpoints(id) on delete cascade,
  event_type        text        not null,
  alert_id          uuid        references public.alerts(id) on delete set null,
  attempt_number    integer     not null default 1,
  status            text        not null check (status in ('success', 'failed')),
  response_status   integer,
  error             text,
  created_at        timestamptz not null default now()
);

alter table public.webhook_deliveries enable row level security;
create policy "webhook_deliveries_read"
  on public.webhook_deliveries for select
  using (is_workspace_member(workspace_id));

create index idx_webhook_deliveries_endpoint on public.webhook_deliveries(endpoint_id, created_at desc);
