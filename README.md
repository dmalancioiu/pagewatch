# PageWatch

**Visual change alerts for websites — get notified the moment a page looks different.**

No dashboard babysitting. No waiting for user complaints. Alerts fire the instant a screenshot diff exceeds your threshold.

## Tech Stack

- **Next.js 14+** with App Router (TypeScript)
- **Tailwind CSS** for styling
- **Supabase** — Auth, Postgres, Storage, Row Level Security
- **Trigger.dev v4** — background screenshot tasks (scheduled, hourly)
- **Playwright** — headless Chromium for full-page screenshots
- **pixelmatch** — pixel-level image diffing
- **Resend** — email alert digests
- **Stripe** — billing (trial / starter / agency plans)

## Prerequisites

- Node.js 18+
- A Supabase project
- A Resend account (https://resend.com)
- A Trigger.dev project (https://trigger.dev)
- A Stripe account (for billing)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Run the app + Trigger.dev worker in parallel
npm run dev:full
```

## Running Migrations

Log into your Supabase project dashboard, open the SQL Editor, and run the migrations in order:

```
supabase/migrations/001_keyword_threat_monitor.sql   ← base schema
supabase/migrations/002_...sql                        ← any intermediate migrations
supabase/migrations/20260418_003_screenshot_monitor.sql  ← PageWatch schema
```

Migration 003 drops all legacy SEO tables and creates the screenshot monitoring schema:
`monitored_urls`, `screenshot_snapshots`, `screenshot_diffs`, `alerts`, `notification_events`.

## Supabase Storage

Create a public bucket named **`screenshots`** in your Supabase project:

1. Go to Storage → New bucket
2. Name: `screenshots`
3. Public: yes (or configure signed URLs if you prefer private)

Screenshots are stored at:
- `screenshots/{workspace_id}/{url_id}/{timestamp}.png`
- `diffs/{workspace_id}/{url_id}/{timestamp}.png`

## How Background Tasks Work

Two Trigger.dev scheduled tasks run automatically:

### `screenshot-monitor` (every hour)
1. Fetches all active monitored URLs from the database
2. Filters by check frequency — only processes URLs due for a check
3. Launches headless Chromium via Playwright, captures a full-page PNG
4. Uploads the screenshot to Supabase Storage
5. Downloads the previous screenshot and runs pixelmatch comparison
6. If `diff_pct >= threshold_pct`, creates an alert and stores a diff image

### `send-alert-digest` (daily at 8am UTC)
1. Fetches all open alerts from the past 24 hours
2. Groups by workspace
3. Sends a branded HTML digest email via Resend

## Trigger.dev Setup

1. Create a project at https://trigger.dev
2. Copy your project ref and secret key to `.env.local`
3. Update `trigger.config.ts` with your project ref if different
4. Run `npm run trigger:dev` to connect the local worker
5. Run `npm run trigger:deploy` to deploy tasks to production

The `trigger.config.ts` includes the `playwright()` build extension which bundles the Chromium binary into the Trigger.dev deployment automatically.

## Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy

### Trigger.dev Tasks
After deploying Next.js, run:
```bash
npm run trigger:deploy
```

This deploys the screenshot tasks to Trigger.dev's infrastructure. The `screenshot-monitor` task runs every hour automatically.

## User Flow

1. User signs up via `/login`
2. Redirected to `/onboarding` — 5-step wizard to set workspace, URLs, monitoring preferences, and alert settings
3. `createWorkspace` is called, creating the workspace + member + onboarding steps
4. User lands on `/dashboard` — overview of open alerts and monitoring stats
5. `screenshot-monitor` task runs hourly, taking screenshots and creating alerts when pages change
6. User receives email digest and can acknowledge/dismiss alerts from the dashboard
