-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — single clean init migration
-- Run this once on a fresh Supabase project.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─── set_updated_at (trigger helper) ─────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id                     uuid        primary key references auth.users(id) on delete cascade,
  email                  text,
  full_name              text        not null default '',
  avatar_url             text,
  plan                   text        not null default 'free' check (plan in ('free', 'pro', 'agency')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_own" on public.profiles for all using (id = auth.uid());

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── workspaces ──────────────────────────────────────────────────────────────
create table public.workspaces (
  id            uuid        primary key default gen_random_uuid(),
  owner_user_id uuid        not null references auth.users(id) on delete cascade,
  name          text        not null,
  domain        text        not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

-- ─── workspace_members ───────────────────────────────────────────────────────
create table public.workspace_members (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  role         text        not null default 'member',
  created_at   timestamptz not null default now(),
  unique(workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

-- ─── is_workspace_member (needs workspace_members to exist first) ─────────────
create or replace function public.is_workspace_member(wsid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = wsid and user_id = auth.uid()
  );
$$;

-- ─── All RLS policies that use is_workspace_member go here ───────────────────
create policy "workspaces_access"
  on public.workspaces for all
  using (owner_user_id = auth.uid() or is_workspace_member(id));

create policy "workspace_members_access"
  on public.workspace_members for all
  using (is_workspace_member(workspace_id) or user_id = auth.uid());

-- ─── notification_channels ───────────────────────────────────────────────────
create table public.notification_channels (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  channel_type text        not null check (channel_type in ('email', 'slack')),
  config       jsonb       not null default '{}',
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  unique(workspace_id, channel_type)
);

alter table public.notification_channels enable row level security;
create policy "notification_channels_access"
  on public.notification_channels for all
  using (is_workspace_member(workspace_id));

-- ─── onboarding_state ────────────────────────────────────────────────────────
create table public.onboarding_state (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  step_key     text        not null,
  completed    boolean     not null default false,
  data         jsonb,
  updated_at   timestamptz not null default now(),
  unique(workspace_id, step_key)
);

alter table public.onboarding_state enable row level security;
create policy "onboarding_state_access"
  on public.onboarding_state for all
  using (is_workspace_member(workspace_id));

-- ─── monitored_urls ──────────────────────────────────────────────────────────
create table public.monitored_urls (
  id              uuid        primary key default gen_random_uuid(),
  workspace_id    uuid        not null references public.workspaces(id) on delete cascade,
  url             text        not null,
  name            text        not null,
  check_frequency text        not null default 'daily'
                              check (check_frequency in ('hourly', 'daily', 'weekly')),
  check_hour      integer     check (check_hour between 0 and 23),  -- UTC hour to run; null = elapsed-time logic
  threshold_pct   float       not null default 5,
  is_active       boolean     not null default true,
  last_checked_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.monitored_urls enable row level security;
create policy "monitored_urls_access"
  on public.monitored_urls for all
  using (is_workspace_member(workspace_id));

create trigger set_monitored_urls_updated_at
  before update on public.monitored_urls
  for each row execute function public.set_updated_at();

-- ─── screenshot_snapshots ────────────────────────────────────────────────────
create table public.screenshot_snapshots (
  id               uuid        primary key default gen_random_uuid(),
  workspace_id     uuid        not null references public.workspaces(id) on delete cascade,
  monitored_url_id uuid        not null references public.monitored_urls(id) on delete cascade,
  storage_path     text        not null,
  taken_at         timestamptz not null default now(),
  file_size_bytes  bigint,
  metadata         jsonb       not null default '{}',
  created_at       timestamptz not null default now()
);

alter table public.screenshot_snapshots enable row level security;
create policy "screenshot_snapshots_access"
  on public.screenshot_snapshots for all
  using (is_workspace_member(workspace_id));

-- ─── screenshot_diffs ────────────────────────────────────────────────────────
create table public.screenshot_diffs (
  id                   uuid        primary key default gen_random_uuid(),
  workspace_id         uuid        not null references public.workspaces(id) on delete cascade,
  monitored_url_id     uuid        not null references public.monitored_urls(id) on delete cascade,
  previous_snapshot_id uuid        references public.screenshot_snapshots(id) on delete set null,
  current_snapshot_id  uuid        not null references public.screenshot_snapshots(id) on delete cascade,
  diff_pct             float       not null,
  diff_storage_path    text,
  created_at           timestamptz not null default now()
);

alter table public.screenshot_diffs enable row level security;
create policy "screenshot_diffs_access"
  on public.screenshot_diffs for all
  using (is_workspace_member(workspace_id));

-- ─── alerts ──────────────────────────────────────────────────────────────────
create table public.alerts (
  id                   uuid        primary key default gen_random_uuid(),
  workspace_id         uuid        not null references public.workspaces(id) on delete cascade,
  monitored_url_id     uuid        not null references public.monitored_urls(id) on delete cascade,
  alert_type           text        not null check (alert_type in ('visual_change')),
  severity             text        not null check (severity in ('low', 'medium', 'high', 'critical')),
  status               text        not null default 'open'
                                   check (status in ('open', 'acknowledged', 'dismissed')),
  title                text        not null,
  summary              text        not null,
  diff_pct             float,
  diff_storage_path    text,
  current_snapshot_id  uuid        references public.screenshot_snapshots(id) on delete set null,
  previous_snapshot_id uuid        references public.screenshot_snapshots(id) on delete set null,
  metadata             jsonb,
  triggered_at         timestamptz not null default now(),
  created_at           timestamptz not null default now()
);

alter table public.alerts enable row level security;
create policy "alerts_access"
  on public.alerts for all
  using (is_workspace_member(workspace_id));

-- ─── notification_events ─────────────────────────────────────────────────────
create table public.notification_events (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  alert_id     uuid        not null references public.alerts(id) on delete cascade,
  channel_type text        not null,
  sent_at      timestamptz,
  status       text        not null default 'pending',
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

alter table public.notification_events enable row level security;
create policy "notification_events_access"
  on public.notification_events for all
  using (is_workspace_member(workspace_id));

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index idx_workspaces_owner         on public.workspaces(owner_user_id);
create index idx_workspace_members_user   on public.workspace_members(user_id);
create index idx_monitored_urls_workspace on public.monitored_urls(workspace_id);
create index idx_monitored_urls_active    on public.monitored_urls(workspace_id, is_active);
create index idx_snapshots_url            on public.screenshot_snapshots(monitored_url_id);
create index idx_snapshots_taken_at       on public.screenshot_snapshots(taken_at);
create index idx_diffs_url                on public.screenshot_diffs(monitored_url_id);
create index idx_alerts_workspace         on public.alerts(workspace_id);
create index idx_alerts_status            on public.alerts(workspace_id, status);
create index idx_alerts_triggered_at      on public.alerts(triggered_at);
create index idx_notification_events_ws   on public.notification_events(workspace_id);


-- ─── Storage bucket for screenshots ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false);

-- Service role (used by Trigger.dev task) can do everything
create policy "screenshots_service_role_all"
  on storage.objects for all
  to service_role
  using (bucket_id = 'screenshots');

-- Authenticated users can read their own workspace's screenshots
create policy "screenshots_authenticated_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'screenshots'
    and (storage.foldername(name))[2] in (
      select id::text from public.workspaces
      where owner_user_id = auth.uid()
    )
  );

  alter table public.monitored_urls add column if not exists check_hour integer check (check_hour between 0 and 23);
