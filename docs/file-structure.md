# File structure

PageWatch is a Next.js 14 App Router application with a Trigger.dev worker sharing
the same TypeScript sources. Anything under `lib/` that is pure (no `next/*`, no
`server-only`) is imported by both sides — that is deliberate, and it is what keeps
plan limits identical in the UI and in the worker.

```text
pagewatch/
├─ app/
│  ├─ layout.tsx                  Root layout: fonts, theme, providers
│  ├─ globals.css                 Design tokens + base layer
│  ├─ page.tsx                    Landing page
│  ├─ login/page.tsx
│  ├─ onboarding/page.tsx
│  ├─ api/
│  │  ├─ auth/callback/route.ts   Supabase OAuth callback
│  │  ├─ health/route.ts
│  │  └─ stripe/{checkout,webhook}/route.ts
│  ├─ dashboard/
│  │  ├─ layout.tsx               Auth guard + entitlement resolution
│  │  ├─ page.tsx                 Feed: recent changes across all monitors
│  │  ├─ alerts/page.tsx
│  │  ├─ schedules/page.tsx
│  │  ├─ settings/page.tsx
│  │  └─ urls/
│  │     ├─ page.tsx              Monitor list
│  │     └─ [id]/page.tsx         Monitor detail: captures, alerts, settings
│  └─ (seo pages)                 competitor-website-monitoring, etc.
│
├─ components/
│  ├─ ui/                         Design-system primitives (see UI_PRIMITIVES.md)
│  ├─ theme/                      ThemeProvider + toggle
│  ├─ dashboard/                  App surfaces
│  ├─ landing/                    Marketing sections
│  ├─ onboarding/                 First-run flow
│  └─ alerts/
│
├─ lib/
│  ├─ plans.ts                    ★ Plan catalog — tiers, limits, feature flags.
│  │                                Pure and isomorphic; imported by the worker too.
│  ├─ entitlements.ts             Server-side resolution + assertions. Throws
│  │                                EntitlementError carrying an upgrade target.
│  ├─ url.ts                      Normalization + the non-public-host guard (SSRF)
│  ├─ severity.ts                 The single severity → colour-tone mapping
│  ├─ actions/                    Server actions (all 'use server')
│  │  ├─ websites.ts              Monitor CRUD, quota-enforced
│  │  ├─ alerts.ts, screenshots.ts, run-now.ts
│  │  └─ workspace.ts, onboarding.ts, schedules.ts, auth-actions.ts
│  ├─ supabase/
│  │  ├─ server.ts                Session-scoped client — RLS applies. Always await.
│  │  ├─ browser.ts / client.ts   Client components
│  │  ├─ admin.ts                 Service role. Background jobs and webhooks only.
│  │  ├─ storage.ts               Signed URL helpers
│  │  └─ relations.ts             Normalizes PostgREST to-one embeds
│  ├─ types/database.types.ts     Row interfaces
│  ├─ stripe.ts, env.ts, auth.ts, utils.ts
│
├─ middleware.ts                  Supabase session refresh
│
├─ trigger/                       Trigger.dev v4 worker
│  ├─ index.ts                    Task exports
│  ├─ tasks/
│  │  ├─ screenshot-monitor.ts    Hourly dispatcher — fans out one run per monitor
│  │  ├─ run-single-url.ts        One capture: the unit of work
│  │  ├─ enforce-retention.ts     Nightly, per-plan retention
│  │  ├─ send-alert-digest.ts     Daily digest
│  │  └─ send-instant-alert.ts    High/critical, immediately
│  └─ lib/
│     ├─ take-screenshot.ts       Capture → diff → alert pipeline
│     ├─ analyze-diff-with-ai.ts  Claude vision pass + relevance veto
│     ├─ image.ts                 sharp encode/decode helpers
│     ├─ entitlements.ts          Worker-side plan resolution + usage metering
│     ├─ notify.ts                Email delivery
│     └─ supabase.ts
│
├─ supabase/migrations/           Run in numeric order
│  ├─ pagewatch_init.sql          Base schema, RLS, storage bucket
│  ├─ 002_smart_upgrade.sql       watch_description, full_page, mode, ai_summary
│  ├─ 003_deleted_at.sql          Soft delete
│  ├─ 004_zones.sql               Tracking zones
│  ├─ 005_entitlements.sql        Plan on workspace, usage meter, storage RLS fix
│  └─ 006_monitor_health.sql      Failure tracking
│
└─ docs/
   ├─ DESIGN_SYSTEM.md            ★ The UI specification
   ├─ UI_PRIMITIVES.md            Primitive API reference
   ├─ LAUNCH_STRATEGY.md          Product and launch assessment
   ├─ BACKLOG.md                  Prioritised work items
   └─ file-structure.md           This file
```

## Where things live

**Plan limits** are defined once in `lib/plans.ts`. Never hardcode a limit anywhere
else. `lib/entitlements.ts` turns the catalog into per-workspace answers for the app;
`trigger/lib/entitlements.ts` does the same for the worker.

**Enforcement is server-side.** The UI reads entitlements to disable and explain
controls, but the assertion that actually refuses work lives in the server action.

**Two Supabase clients.** `lib/supabase/server.ts` carries the caller's session, so
RLS applies — use it for anything user-initiated. `admin.ts` is the service role and
bypasses RLS; every query made with it must filter by `workspace_id` explicitly.

**Storage paths** all live in the one `screenshots` bucket:
`screenshots/{workspace}/{monitor}/{ts}.webp`, `diffs/{...}`, `thumbs/{...}`.
Segment 2 is always the workspace id, which is what the RLS policy keys on.
