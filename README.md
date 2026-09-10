# PageWatch

**Visual change monitoring for websites.** Screenshot a page on a schedule, diff it
against the last capture, and let Claude decide whether the change is worth an alert.

The last part is the product. Pixel diffing is a commodity; *suppressing* the
thousand irrelevant changes — a rotating hero, a cookie banner, a relative timestamp —
is what makes the alerts trustworthy.

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 14 App Router, React 18, TypeScript |
| Data / auth / storage | Supabase (Postgres + RLS, SSR cookie auth, Storage) |
| Background jobs | Trigger.dev v4 |
| Capture | Playwright (Chromium) |
| Diffing | pixelmatch on raw RGBA, sharp for encode/decode |
| Change analysis | Claude via `@anthropic-ai/sdk` |
| Email | Resend |
| Billing | Stripe |
| UI | Tailwind + Radix primitives, Geist, dark-first |

## Setup

```bash
npm install
cp .env.example .env.local     # fill in every value
npm run dev:full               # Next.js + the Trigger.dev worker together
```

### Database

Run the migrations in `supabase/migrations/` **in numeric order** against a fresh
Supabase project — SQL Editor, or `supabase db push` if you use the CLI.
`pagewatch_init.sql` is the base schema and also creates the private `screenshots`
storage bucket with its RLS policies. Do not create the bucket by hand.

### Trigger.dev

```bash
npm run trigger:dev       # connect a local worker
npm run trigger:deploy    # deploy tasks
```

`trigger.config.ts` includes the `playwright()` build extension, which bundles
Chromium into the deployment. Set the `project` field to your own project ref.

## How it works

**`screenshot-monitor`** (hourly) is a dispatcher, not a worker. It selects the
monitors due this hour and `batchTrigger`s one `run-single-url` run per monitor, with
a per-workspace concurrency key. Each capture therefore gets its own timeout and its
own retries, and one hanging site cannot delay anyone else's checks.

**`run-single-url`** resolves the workspace's plan, checks the metered quota, and runs
the capture pipeline:

1. Launch Chromium with locale, timezone and colour-scheme pinned, so the same page
   renders identically every run.
2. Block known ad and analytics domains at the network layer; dismiss consent
   banners; hide chat widgets and popups; freeze animations.
3. Capture, convert to WebP, upload, and write a `screenshot_snapshots` row.
4. Decode both sides to raw RGBA and diff with pixelmatch — whole-page, or per
   tracking zone with per-zone sensitivity.
5. If the change clears the prefilter, ask Claude what changed and whether it matters
   given the user's watch instructions. Claude can veto the alert outright.
6. Raise an alert with a plain-English summary, and meter the usage.

**`enforce-retention`** (nightly) deletes captures past the plan's retention window —
storage objects first, then rows — keeping anything an alert references.

**`send-instant-alert`** fires immediately for high and critical severities;
**`send-alert-digest`** sends everything else once a day.

## Plans and limits

`lib/plans.ts` is the single source of truth for tiers, limits and feature flags. It
is pure and isomorphic: the app, the worker and the pricing page all read the same
object, so what the UI shows and what the server enforces cannot drift apart.

Limits are asserted in the server action, never only in the UI. See
`lib/entitlements.ts`.

## Deploying

Push to GitHub, import in Vercel, add every variable from `.env.example`, deploy.
Then `npm run trigger:deploy` for the worker. The Stripe webhook needs its endpoint
registered at `/api/stripe/webhook`.

## Documentation

- `docs/DESIGN_SYSTEM.md` — the UI specification. Read before touching any screen.
- `docs/UI_PRIMITIVES.md` — component API reference.
- `docs/file-structure.md` — where everything lives and why.
- `docs/LAUNCH_STRATEGY.md` — product assessment and positioning.
- `docs/BACKLOG.md` — prioritised work, with file references.
