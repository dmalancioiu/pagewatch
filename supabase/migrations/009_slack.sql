-- ─────────────────────────────────────────────────────────────────────────────
-- PageWatch — Slack delivery (backlog D4)
--
-- `notification_channels.channel_type` has allowed 'slack' since the initial
-- schema (`pagewatch_init.sql`), and the settings page has advertised Slack
-- since before this migration. Nothing ever wrote or read a `slack` row.
--
-- This migration deliberately does NOT add columns to `notification_channels`
-- itself. Team id, team name, channel id, channel name and the bot token all
-- live in its existing `config` jsonb, keyed `team_id` / `team_name` /
-- `channel_id` / `channel_name` / `bot_token` — the same place the `email`
-- row already keeps its own config (`{ email, frequency }`, written by
-- `lib/actions/workspace.ts`). Giving Slack dedicated columns would just be a
-- second, redundant place to model the same shape `config` already handles,
-- for a row type this table may grow more of later (the channel_type check
-- constraint reads `in ('email', 'slack')` with room to add more). See
-- `lib/slack.ts#parseSlackConfig` for the one place that shape is validated,
-- and `trigger/lib/notify.ts` / `trigger/lib/slack-notify.ts` for the
-- email/Slack sends that read it.
--
-- What genuinely needs a first-class column is state that has nothing to do
-- with Slack as a channel, but that a Slack message's own action buttons need
-- to read and write per *monitor* — and that would be exactly as necessary if
-- this were email instead. Both are nullable/defaulted so every existing
-- monitor is unaffected until a button is actually pressed.
-- ─────────────────────────────────────────────────────────────────────────────

-- Set by the "Mute this monitor" Slack button
-- (`app/api/slack/interactions/route.ts`). Read by
-- `trigger/tasks/send-slack-alert.ts`, which skips posting while this is
-- true. Deliberately independent of `is_active`: muting alerts must not also
-- stop the monitor from capturing and diffing — someone still wants the
-- history, they just don't want to hear about it in Slack right now.
alter table public.monitored_urls
  add column if not exists alerts_muted boolean not null default false;

comment on column public.monitored_urls.alerts_muted is
  'Silences Slack alerts for this monitor. Set by the "Mute this monitor" button (app/api/slack/interactions/route.ts); read by trigger/tasks/send-slack-alert.ts before it posts. Capture and diffing are unaffected.';

-- Set by the "Snooze 24h" Slack button. `send-slack-alert` skips sending
-- while `now() < alerts_snoozed_until`, then resumes on its own once the
-- timestamp passes — no cron job or cleanup task needs to clear it.
alter table public.monitored_urls
  add column if not exists alerts_snoozed_until timestamptz;

comment on column public.monitored_urls.alerts_snoozed_until is
  'Slack alerts for this monitor are skipped while now() < this timestamp. Set 24h out by the "Snooze 24h" button; read by trigger/tasks/send-slack-alert.ts. Null means not snoozed.';

-- No RLS changes: both columns live on `monitored_urls`, which already has a
-- workspace-membership policy covering select/update. The one writer that
-- bypasses it on purpose is `app/api/slack/interactions/route.ts`, using the
-- service-role client — a Slack button click carries no PageWatch session to
-- check membership against, the same reason the Stripe webhook uses the
-- admin client instead of RLS.
