# PageWatch — Build Backlog

55 items across five tracks. Companion to `docs/LAUNCH_STRATEGY.md`.

**Priority is about launch, not ambition.** P0 blocks taking money or keeps the app
lying to users. P1 is needed within the first months. P2 earns its place once people
are paying.

**Sizes:** S = under a day · M = one to three days · L = a week or more.

Status: **7 / 55 shipped** · **16 / 23 P0 remaining**

---

## Track A — Access rights & data model (7 shipped / 11)

| # | Item | Pri | Size | Where |
|---|---|---|---|---|
| A1 | ✅ Plan catalog + entitlements resolver | P0 | — | `lib/plans.ts`, `lib/entitlements.ts` |
| A2 | ✅ Server-side quota enforcement | P0 | — | `lib/actions/websites.ts`, `run-now.ts` |
| A3 | ✅ Plan on workspace + usage meter | P0 | — | `migrations/005_entitlements.sql` |
| A4 | ✅ Storage policy by membership | P0 | — | `migrations/005_entitlements.sql` |
| A5 | ✅ Soft delete instead of cascade | P0 | — | `lib/actions/websites.ts` |
| A6 | ✅ Reject non-public hosts (SSRF) | P0 | — | `lib/url.ts` |
| A7 | Entitlement refusals → upgrade prompts | P0 | S | `ToastProvider`, new `UpgradeDialog` |
| A8 | Team invites and roles | P1 | M | `lib/actions/workspace.ts`, new migration |
| A9 | Downgrade reconciliation | P1 | M | new `trigger/tasks/reconcile-plans.ts` |
| A10 | Supabase CLI migrations + generated types | P1 | M | `supabase/`, `database.types.ts` |
| A11 | Finish Stripe (portal, events, idempotency) | P1 | M | `app/api/stripe/` |

**A7** — `EntitlementError` already carries a code and target plan. Wire it to a real
"Pro raises this to 15 monitors" prompt.
**A8** — `workspace_members` only ever receives the owner row; seats are unsellable.
**A9** — On downgrade, existing monitors keep running hourly and over the ceiling.
Clamp to `tightestFrequency()`, pause the excess, tell the user which.
**A10** — Hand-maintained types are how the plan taxonomy drifted in the first place.

---

## Track B — Throughput, cost, truthfulness (1 shipped / 11)

| # | Item | Pri | Size | Where |
|---|---|---|---|---|
| B1 | ✅ Scheduler fans out instead of looping | P0 | — | `trigger/tasks/screenshot-monitor.ts` |
| B2 | Capture WebP, not full-page PNG | P0 | M | `trigger/lib/take-screenshot.ts` |
| B3 | Retention job | P0 | M | new `trigger/tasks/enforce-retention.ts` |
| B4 | Stop firing the model on every check | P0 | M | `take-screenshot.ts`, `analyze-diff-with-ai.ts` |
| B5 | Monitor health, surfaced | P0 | M | new migration, `run-single-url.ts` |
| B6 | Instant alerts on high/critical | P0 | S | new `send-instant-alert.ts` |
| B7 | Default notification channel at signup | P0 | S | `lib/actions/workspace.ts` |
| B8 | Session-refresh middleware | P0 | S | new `middleware.ts` |
| B9 | Reuse browser, drop `networkidle` | P1 | S | `trigger/lib/take-screenshot.ts` |
| B10 | Error tracking + structured logs | P1 | S | `app/`, `trigger/` |
| B11 | React Email templates | P2 | S | `trigger/tasks/send-alert-digest.ts` |

**B2** — q≈80 cuts 60–80% with no effect on diffing. `sharp` also replaces the slow
`pngjs` round-trip in the diff path.
**B3** — Nothing in the repo deletes a snapshot, diff, or storage object. Pin
alert-linked snapshots so evidence outlives routine history.
**B4** — Gate is `diffPct >= 0.05` (0.05%), which almost every real page clears.
Downscale to ~1024px, reject known-noisy bands, try the text diff before images.
**B5** — Failed captures are logged and skipped: no status column, `last_checked_at`
untouched. The dashboard shows a healthy monitor that hasn't run in weeks.
**B7** — The digest only emails workspaces with a `notification_channels` row, written
only by the onboarding wizard. Everyone who skipped it gets no alerts, ever.
**B8** — No `middleware.ts` exists. Server components can't write cookies, so refreshed
tokens have nowhere to land and users get logged out mid-session.

---

## Track C — Frontend (0 / 15)

| # | Item | Pri | Size | Where |
|---|---|---|---|---|
| C1 | Delete the `*Sync.tsx` components | P0 | L | `MonitorPauseResumeSync`, `MonitorSettingsRailSync`, `MonitorTimelineSync` |
| C2 | Delete the two unused detail clients | P0 | S | `MonitorDetailDesignClient{,Fixed}.tsx` |
| C3 | Typed server-action wrapper | P0 | M | new `lib/actions/action.ts` |
| C4 | Inline styles → design tokens | P1 | L | `app/dashboard/**`, `components/dashboard/**` |
| C5 | Upgrade Next.js and React | P1 | M | `package.json` |
| C6 | `useActionState` / `useOptimistic` for forms | P1 | M | settings rail, add-URL forms |
| C7 | Real dialog primitives for the 4 modals | P1 | M | `components/dashboard/*Modal.tsx` |
| C8 | Merge the duplicated landing page | P1 | M | `app/page.tsx`, `app/light/page.tsx` |
| C9 | Loading / error / empty states | P1 | S | `app/dashboard/**` |
| C10 | Responsive shell + mobile nav | P1 | M | `Sidebar.tsx`, `DashboardShell.tsx` |
| C11 | Accessibility pass | P1 | M | `components/**` |
| C12 | Token-driven dark mode | P1 | M | `app/globals.css` |
| C13 | Virtualize the snapshot timeline | P2 | M | detail client |
| C14 | Change-history charts | P2 | M | new `ChangeChart.tsx` |
| C15 | Optimize screenshot delivery | P2 | S | `lib/supabase/storage.ts` |

**C1** — These locate controls with `document.querySelector('.md-topbar')` and match
button text (`text.includes('pause')`), then attach handlers to whatever they find. A
copy edit silently disables pause, resume and settings with no error. Most dangerous
code in the repo.
**C3** — One wrapper composing zod input + session + entitlements + typed errors makes
every future action correct by construction, and lets the client render
`EntitlementError` properly.
**C4** — The settings page is 100% inline `style={{}}`; hex colours repeat across dozens
of files.
**C9** — No `loading.tsx`, `error.tsx` or `not-found.tsx` exists anywhere.
**C10** — Sidebar is a fixed 208px. Below ~860px the dashboard is unusable — and alerts
are exactly what people check on a phone.

---

## Track D — Product: detection → intelligence (0 / 10)

| # | Item | Pri | Size | Where |
|---|---|---|---|---|
| D1 | **Extract structure, not just pixels** | ★ keystone | L | new `trigger/lib/extract-content.ts` |
| D2 | Classify and route every change | P1 | M | `analyze-diff-with-ai.ts`, new migration |
| D3 | Monitors from a sentence | P1 | M | new `lib/actions/compose-monitor.ts` |
| D4 | Slack, actually implemented | P1 | M | new `app/api/slack/` |
| D5 | The weekly briefing | P2 | M | new `send-weekly-briefing.ts` |
| D6 | API keys, REST, outbound webhooks | P2 | L | new `app/api/v1/` |
| D7 | MCP server over the API | P2 | M | new `app/api/mcp/` |
| D8 | Authenticated / multi-step capture | P2 | L | `take-screenshot.ts` + credential storage |
| D9 | Deploy-triggered regression | P2 | M | `app/api/v1/runs` + a published action |
| D10 | Public change archives | P2 | L | new `app/changes/[host]/[...path]` |

**D1** — Capture rendered text, DOM outline, JSON-LD, meta tags and prices alongside the
PNG. A change stops being "4.2% of pixels differ" and becomes "Pro moved $29 → $39, the
trial line was removed". Gives chartable history, writable alert rules, a far cheaper
model path, and a data asset no pixel-differ has. Most of this track depends on it.
**D3** — Replaces the worst screen in the funnel: a form asking people to reason about
threshold percentages, a concept they do not have.
**D4** — Settings advertises Slack and the channel type is in the schema; nothing
implements it.

---

## Track E — Quality & launch hygiene (0 / 8)

| # | Item | Pri | Size | Where |
|---|---|---|---|---|
| E1 | Configure ESLint | P0 | S | new `eslint.config.mjs` |
| E2 | Tests for money/alert logic | P0 | M | `*.test.ts` beside each module |
| E3 | CI on every push | P0 | S | new `.github/workflows/ci.yml` |
| E4 | Legal pages | P0 | M | new `app/(legal)/` |
| E5 | Rewrite the misleading docs | P0 | S | `README.md`, `docs/file-structure.md` |
| E6 | End-to-end tests | P1 | M | new `e2e/` |
| E7 | Sweep the dead routes | P1 | S | `dashboard/keywords`, `dashboard/competitors`, `pagewatch/` |
| E8 | A status page | P2 | S | `app/api/health/route.ts` |

**E1** — There is no ESLint config; `npm run lint` drops into the interactive first-run
setup prompt, meaning it has never run in this project.
**E2** — Start where a silent bug is most expensive: `isDue()` scheduling, entitlement
assertions, zone scoring maths, the private-host guard.
**E3** — The plan-taxonomy mismatch that would have broken every upgrade was a
compile-time-visible bug that nothing was compiling.
**E4** — This product loads third-party sites on a schedule from your infrastructure.
The AUP is what you point at when someone aims it somewhere with lawyers.
**E5** — `docs/file-structure.md` documents `vibe-agent-saas` with research agents and
Firecrawl providers. The README points at migration filenames that don't exist.
