-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Entitlements
--
-- Moves the subscription plan from `profiles` (per-user) to `workspaces`
-- (per-tenant). Monitors, snapshots and alerts all hang off a workspace, so a
-- per-user plan can never answer "how many monitors is THIS tenant allowed?"
-- once a workspace has more than one member.
--
-- `profiles.plan` is left in place and backfilled from the workspace so nothing
-- reading it breaks mid-migration. It is no longer authoritative — application
-- code must read `workspaces.plan`. Drop it in a later migration once no
-- references remain.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── workspaces: plan + subscription state ───────────────────────────────────

alter table public.workspaces
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro', 'business', 'agency'));

-- Lifecycle of the subscription itself, independent of which plan it is for.
-- `trialing` grants full plan entitlements until trial_ends_at.
-- `past_due`  keeps read access but is treated as `free` for new work.
-- `canceled`  falls back to `free` entitlements entirely.
alter table public.workspaces
  add column if not exists plan_status text not null default 'active'
    check (plan_status in ('trialing', 'active', 'past_due', 'canceled'));

alter table public.workspaces
  add column if not exists trial_ends_at timestamptz;

-- End of the current billing period. Also the boundary for usage counters.
alter table public.workspaces
  add column if not exists current_period_end timestamptz;

-- Stripe linkage lives on the workspace too, so a user can own several
-- workspaces on different plans.
alter table public.workspaces
  add column if not exists stripe_customer_id text;

alter table public.workspaces
  add column if not exists stripe_subscription_id text;

create index if not exists idx_workspaces_stripe_customer
  on public.workspaces(stripe_customer_id);

-- ─── Backfill from the owner's profile ───────────────────────────────────────
-- The old taxonomy was inconsistent across the codebase ('trial'/'starter' in
-- TypeScript, 'free'/'pro'/'agency' in the profiles check constraint). Map
-- every historical value onto the new one explicitly rather than trusting it.

update public.workspaces w
set plan = case p.plan
             when 'pro'     then 'pro'
             when 'starter' then 'pro'       -- legacy TS-only value
             when 'agency'  then 'agency'
             else 'free'                     -- 'free', 'trial', anything else
           end
from public.profiles p
where p.id = w.owner_user_id
  and w.plan = 'free';

-- ─── profiles.plan: widen the constraint, keep it in sync ────────────────────
-- Widened so the legacy column can hold every value the new taxonomy uses.

alter table public.profiles drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'pro', 'business', 'agency'));

update public.profiles
set plan = 'free'
where plan not in ('free', 'pro', 'business', 'agency');

-- ─── workspace_usage ─────────────────────────────────────────────────────────
-- Metered consumption per workspace per billing period. One row per
-- (workspace, period_start); the period rolls forward on first write after
-- current_period_end passes.
--
-- Counting rows in screenshot_snapshots would also work but gets expensive at
-- retention scale, and snapshots are deleted by the retention job — which would
-- silently refund quota. A counter is cheap and survives deletion.

create table if not exists public.workspace_usage (
  id             uuid        primary key default gen_random_uuid(),
  workspace_id   uuid        not null references public.workspaces(id) on delete cascade,
  period_start   date        not null,
  checks_used    integer     not null default 0,
  ai_calls_used  integer     not null default 0,
  bytes_stored   bigint      not null default 0,
  updated_at     timestamptz not null default now(),
  unique (workspace_id, period_start)
);

alter table public.workspace_usage enable row level security;

-- Members may read their own usage. Only the service role writes it, via the
-- RPC below — there is no client-side insert or update policy on purpose.
create policy "workspace_usage_read"
  on public.workspace_usage for select
  using (is_workspace_member(workspace_id));

create index if not exists idx_workspace_usage_lookup
  on public.workspace_usage(workspace_id, period_start desc);

-- ─── record_usage() ──────────────────────────────────────────────────────────
-- Atomic increment. Called by the capture task after each check so concurrent
-- runs across a batch cannot lose writes to a read-modify-write race.

create or replace function public.record_usage(
  wsid          uuid,
  checks        integer default 0,
  ai_calls      integer default 0,
  bytes         bigint  default 0
)
returns void
language plpgsql
security definer
set search_path = public as $$
declare
  period date := date_trunc('month', now())::date;
begin
  insert into public.workspace_usage as u
    (workspace_id, period_start, checks_used, ai_calls_used, bytes_stored)
  values
    (wsid, period, checks, ai_calls, bytes)
  on conflict (workspace_id, period_start) do update
    set checks_used   = u.checks_used   + excluded.checks_used,
        ai_calls_used = u.ai_calls_used + excluded.ai_calls_used,
        bytes_stored  = u.bytes_stored  + excluded.bytes_stored,
        updated_at    = now();
end;
$$;

revoke all on function public.record_usage(uuid, integer, integer, bigint) from public, anon, authenticated;
grant execute on function public.record_usage(uuid, integer, integer, bigint) to service_role;

-- ─── Storage RLS: members, not just owners ───────────────────────────────────
-- The original policy checked workspaces.owner_user_id, so invited members got
-- a working dashboard with broken images. Every other policy in the schema uses
-- is_workspace_member(); this one now matches.
--
-- Paths are `screenshots/{workspace_id}/{monitor_id}/{ts}.png` and
-- `diffs/{workspace_id}/{monitor_id}/{ts}.png`, both inside the `screenshots`
-- bucket — so the workspace id is always segment 2.

drop policy if exists "screenshots_authenticated_read" on storage.objects;

create policy "screenshots_authenticated_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'screenshots'
    -- Guard the cast: a malformed path would raise instead of denying.
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and public.is_workspace_member(((storage.foldername(name))[2])::uuid)
  );
