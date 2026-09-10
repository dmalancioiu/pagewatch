# PageWatch — Launch Readout

Assessment against commit `950c4dd`, 10 September 2026.
12,768 lines TS/TSX · 4 migrations · 0 tests.

> **One-line read:** you have a strong engine and no business machinery.
> Almost nothing below asks you to rebuild the engine.

---

## 1. The asset

Most screenshot-monitoring projects die on false positives. `trigger/lib/take-screenshot.ts`
already solves that with more care than most shipped competitors:

- 24 blocked ad/analytics domains at the network layer
- 13 consent-vendor click targets + ~50 CSS hide selectors (chat widgets, popups)
- animations frozen to `0.001ms`, scrollbars suppressed
- context pinned to `en-US` / `UTC` / `colorScheme: 'light'`

On top: zone-scoped diffing with per-zone sensitivity (`low` 5% / `normal` 1% / `high` 0.2%),
a log-scaled `alert_score` with multi-zone lift, and a Claude vision pass that can **veto**
an alert outright.

**That veto is the product.** Pixel diffing is a commodity; deciding a change doesn't
matter is not.

Also real: Trigger.dev v4 + Playwright build extension actually deploying Chromium,
Supabase RLS on every table, signed storage URLs, a 5-step onboarding wizard, two landing
pages, four programmatic SEO pages with a sitemap.

---

## 2. Ship blockers

Each one either loses revenue silently, gives the product away free, or makes the app
stop monitoring without telling anyone.

### 01 — Paid upgrades silently fail to apply
`supabase/migrations/pagewatch_init.sql` · `app/api/stripe/webhook/route.ts:34,57`

DB constrains plans to `('free','pro','agency')`. The webhook writes `'starter'` on
upgrade and `'trial'` on cancellation. Both violate the check constraint. The update
throws, the error is swallowed by the `try/catch`, and the endpoint still returns `200`
so Stripe never retries. The card is charged and the plan never changes.

**Fix:** pick one taxonomy (`free / pro / agency`) and enforce it in the migration,
`lib/types.ts`, `database.types.ts`, the checkout route and the pricing page in one
commit. Make the webhook return non-200 on write failure.

### 02 — Every account is unlimited and free
`app/dashboard/layout.tsx:55-58` · `lib/actions/websites.ts:36`

`plan="free"` and `monitorLimit={3}` are hardcoded props. `profiles.plan` is never read
anywhere in the app. `addMonitoredUrls` inserts with no count, frequency or plan check.
A free user can add 500 URLs on hourly checks.

**Fix:** a server-side `lib/plans.ts` mapping plan →
`{ maxMonitors, minFrequency, retentionDays, aiEnabled }`, enforced inside the server
action before insert — not in the UI.

### 03 — Customers cannot cancel; failed payments are invisible
`app/api/stripe/` — no billing portal route exists

Only two webhook events handled. No `customer.subscription.updated` (downgrades,
reactivations, `cancel_at_period_end` never land), no `invoice.payment_failed` (dunning
customers keep full access), no portal route. Checkout passes `customer_email` instead of
reusing `stripe_customer_id`, so returning customers create duplicate Stripe customers.

**Fix:** add `/api/stripe/portal`; handle `subscription.updated`, `payment_failed`,
`invoice.paid`; reuse the customer ID; store `status` + `current_period_end`; add a
`stripe_events` table keyed on event ID for idempotency.

### 04 — Promises "the moment", delivers "tomorrow at 8am"
`trigger/tasks/send-alert-digest.ts:8` · `README.md:3`

Only delivery path is a daily digest on `0 8 * * *`. A critical change at 08:05 UTC waits
23h55m. Worse: the digest only emails workspaces with a `notification_channels` row,
written exclusively by `saveNotificationChannel` in the onboarding wizard. **Anyone who
skipped onboarding receives no alerts, ever**, with no error and no UI indication.

**Fix:** instant email from the capture task on `severity >= high`; keep the digest for
the rest; default a channel row at workspace creation; show delivery status in Settings.

### 05 — When monitoring breaks, nobody is told
`trigger/tasks/screenshot-monitor.ts:76-80`

A failed capture is caught, logged to Trigger.dev, and skipped. `last_checked_at` is never
updated, no error is persisted, and `monitored_urls` has no status column. The dashboard
shows a healthy monitor that hasn't run in three weeks. For a monitoring product this is
the worst failure mode: the customer trusts silence.

**Fix:** add `consecutive_failures`, `last_error`, `last_success_at`. Surface a "check
failing" state, email after 3 consecutive failures, auto-pause after 10.

### 06 — Delete destroys history and leaks storage
`lib/actions/websites.ts:150` · `supabase/migrations/003_deleted_at.sql`

Migration 003 exists to make deletion soft; `deleteMonitoredUrl` calls `.delete()` anyway.
The cascade wipes snapshots, diffs and alerts while the PNG objects stay in the bucket
forever, orphaned.

**Fix:** set `deleted_at` (queries already filter it), purge objects on a retention job.

### 07 — Invited teammates can't see any screenshots
`supabase/migrations/pagewatch_init.sql` — storage policy

Every table policy uses `is_workspace_member()`. The storage policy alone checks
`workspaces.owner_user_id = auth.uid()`. Non-owner members get a working dashboard with
broken images — which kills the agency/team story on the Agency tier. There is also no
invite flow at all.

**Fix:** rewrite the storage `select` policy to use `is_workspace_member()`.

### Not code, but blocking
No terms of service, privacy policy or acceptable-use page exists anywhere in `app/`.
This product loads third-party websites on a schedule from your infrastructure. You need
an AUP forbidding use against sites the user has no right to monitor, a robots/rate
posture you can point to, and an abuse contact — before someone points it at a site with
lawyers, or your egress IPs get blocklisted.

---

## 3. The scale ceiling — roughly 30 customers

`screenshot-monitor` is a single hourly task with `maxDuration: 600` that loops over every
due URL sequentially, launching a fresh Chromium each time.

Per URL: browser launch → `goto` with `waitUntil: 'networkidle'` (30s ceiling) → 1s settle
→ up to 13 × `isVisible({ timeout: 400 })` consent probes → two 500ms waits → full-page
screenshot → upload → download previous PNG → `pixelmatch` over several million pixels
with PNG decode/encode both sides → usually a Claude vision call.

Realistic mean 15–20s; slow site 40s.

| Load | URLs due/hour | Task budget |
|---|---|---|
| Capacity | **~33** | 600s ÷ ~18s |
| 10 customers × 8 hourly monitors | 80 | 2.4× over |
| 50 customers | 400 | 12× over |
| 200 customers | 1,600 | 48× over |

Past the ceiling the task hits `maxDuration` and the tail of the list is dropped silently,
every hour, with no alert to you or to them.

**Fix (small, structural):** make the scheduler a *dispatcher* — query due URLs, then
`batchTrigger` the existing `run-single-url` task, one run per URL. Trigger.dev then
supplies parallelism, per-run retries with backoff, per-run timeouts and isolation. Add a
per-workspace concurrency key so one customer can't starve the queue. Reuse one browser
across a batch. Replace `networkidle` (never settles on sites with polling or live chat,
burning the full 30s) with `domcontentloaded` + a bounded settle.

---

## 4. Unit economics

### Storage grows forever
Snapshots are `type: 'png'`, full-page — a 1280px-wide marketing page runs 3,000–6,000px
tall, ~1.5–3 MB per capture. **Nothing in the repo ever deletes a snapshot, a diff, or a
storage object.** No retention job, no `.remove()` call, no lifecycle rule.

One Pro customer at 25 monitors hourly writes ~600 screenshots/day ≈ 1 GB/day ≈ 30 GB/month,
permanently, compounding. Meanwhile the pricing page sells 7-day / 90-day / 1-year history
as tier differentiators that are not implemented in any form.

**Fix:** capture WebP at q≈80 (60–80% smaller, no impact on diffing once both sides decode
to RGBA). Nightly retention task enforcing the tier window, deleting rows *and* objects.
Pin alert-linked snapshots so evidence survives when routine history rolls off.

### Inference fires on almost every check
The gate is `diffPct >= 0.05` (five hundredths of one percent) when no zones are set. On
any real site with a rotating hero, a relative timestamp or a variable-height element,
essentially every check clears it: ~18,000 vision calls/month for a single $29 seat, each
carrying two full-page images.

**Fix:** downscale to ~1024px wide before encoding; cheaply reject changes confined to
known-noisy bands; pass the extracted *text* diff first and fall back to images only when
text can't explain the change.

**Pricing consequence:** never sell "Unlimited URLs" against a per-unit COGS, which is
exactly what the Agency tier does today.

---

## 5. The reframe — sell change intelligence, not change detection

"Screenshot a page, diff it, email me" is solved, crowded and cheap (Visualping, Distill,
Hexowatch, ChangeTower — most under $15/mo with free tiers). Your pricing page competes
there directly on features they already have.

What you have that they largely don't: a model that looks at before/after **with the
user's stated intent** (`watch_description`, per-zone `instruction`) and decides whether it
matters.

### Capture structure, not just pixels — highest leverage change here
Alongside the PNG, extract rendered text, DOM outline, JSON-LD, meta tags, prices. A change
stops being *"4.2% of pixels differ"* and becomes *"Pro moved from $29 to $39/month; the
14-day trial line was removed; a new Enterprise tier appeared."*

That gives you: structured history you can chart, alert rules people can actually write, a
much cheaper AI path, and a data asset no pixel-diff competitor has. Existing zones become
the extraction targets.

### Pick a wedge and price to it
- **Competitive pricing & positioning intel** — PMM/growth teams, $99–499/mo. Best fit for
  the AI layer you built. **This is the one I'd choose.**
- **Compliance & regulatory monitoring** — long retention and a tamper-evident audit trail
  become the feature rather than a cost problem. Highest willingness to pay.
- **Agency client-site QA** — lowest lift from here, lowest ceiling.

Narrow the landing page, wizard and SEO surface to whichever you choose. The engine stays
general; the story does not.

---

## 6. Build order

**Now**
- **Natural-language monitors** — "tell me if Linear changes its free-plan seat limit."
  An agent resolves URL, zones, frequency and alert rule; user confirms. Replaces the
  highest-friction screen in the funnel (a form asking people to reason about threshold
  percentages, a concept they don't have).
- **Typed changes, routed** — classify every change (`price`, `copy`, `layout`, `legal`,
  `new-feature`, `broken`, `outage`) and route by type. Type is what makes filtering,
  digests and charts possible.
- **Slack, done properly** — Settings already advertises it; nothing implements it. Inline
  before/after thumbnails, working Acknowledge / Snooze / Mute buttons.

**Next**
- **Authenticated & multi-step capture** — stored auth state, scripted flows. Playwright
  already does this. Clearest premium justification, hard for cheap competitors to match.
- **The weekly briefing** — a written cross-monitor summary, not a list. The artifact
  people forward to their boss, which is your cheapest acquisition channel.
- **API, webhooks, and an MCP server** — unlocks agency/enterprise. MCP means customers'
  own agents can query your data from inside Claude or their editor; in 2026 that's a
  distribution channel, not a checkbox.
- **Deploy-triggered regression** — GitHub Action / Vercel hook diffing preview vs prod
  before merge. Same engine, different trigger, puts you inside the customer's workflow.
- **Public change archives** — free indexed history of well-known pages. Byproduct of
  storage you already pay for, feeds the SEO infrastructure you already built, every
  shared permalink is a demo. Respect robots, honour takedowns.

---

## 7. Pricing

Today three sources disagree: the pricing component says Free/Pro/Agency at $29/$79,
`.env.example` comments say $49/$99, checkout takes `starter | agency`, and the DB allows
`free | pro | agency`.

| Plan | Price | Monitors | Frequency | Retention | The tier's job |
|---|---|---|---|---|---|
| Free | $0 | 2 | Daily | 14 days | Prove the alert is right once — that's the conversion event |
| Pro | $39/mo | 15 | Hourly | 90 days | AI summaries, typed changes, instant email, Slack |
| Business | $129/mo | 60 | 15 min | 1 year | Structured extraction, API, webhooks, briefing, seats |
| Agency | $399+/mo | Metered | 5 min | Custom | White-label, sub-workspaces, SSO, authenticated capture |

Three rules: monitors stay the headline unit (customers understand it) but enforce a
checks-per-month ceiling underneath; retention is the cheapest lever and the one compliance
buyers care about; no tier says "unlimited" anywhere.

---

## 8. Ninety days

A dependency chain, not a wish list. Don't reorder it to build the interesting parts first.

**Week 1–2 · Make money arrive correctly**
Unify plan taxonomy across migration/types/checkout/pricing. Add `lib/plans.ts` and enforce
quotas server-side. Ship billing portal, missing webhook events, idempotency. Read the real
plan in the dashboard layout.
*Gate: a test card upgrades, downgrades and cancels — and the app reflects all three.*

**Week 2–3 · Make failure visible**
Monitor health columns surfaced in UI. Instant alerts for high/critical. Default the
notification channel at workspace creation. Soft-delete. Fix storage RLS. Wire error
tracking.
*Gate: point a monitor at a dead host — you and the user both find out within an hour.*

**Week 3–5 · Make it survive customers**
Scheduler → dispatcher via `batchTrigger` with per-workspace concurrency key. WebP capture.
Nightly retention job. AI prefilter + downscaling. Drop `networkidle`.
*Gate: 1,000 monitors on hourly checks complete inside the hour, with per-URL retries.*

**Week 5–7 · Publish the boring, mandatory things**
ToS, privacy, AUP, subprocessors, abuse contact. Delete the dead code below. Rewrite README
and `docs/file-structure.md` (both currently describe a different application). CI running
`typecheck` + `lint`, plus tests around diff and quota logic.
*Gate: a stranger can read the site, sign up, pay and cancel without contacting you.*

**Week 7–10 · Become intelligence, not detection**
Text + structured capture beside the PNG. Change classification and routing.
Natural-language monitor creation. Slack with action buttons. Narrow landing page and
wizard to the chosen wedge.
*Gate: an alert names what changed in the customer's vocabulary, not a percentage.*

**Week 10–13 · Open the surface**
API keys, REST, outbound webhooks. MCP server on top. Weekly briefing. Authenticated
capture. Start the public change archive.
*Gate: someone integrates without asking you a question.*

---

## 9. Cut list

Roughly a quarter of the codebase is dead, duplicated or actively fragile. Clearing it
costs a day.

- **The `*Sync.tsx` components** — `MonitorPauseResumeSync`, `MonitorSettingsRailSync`,
  `MonitorTimelineSync` find controls via `document.querySelector('.md-topbar')` and match
  button *text content* (`text.includes('pause')`), then attach handlers to whatever they
  find. A copy edit or class rename silently disables pause, resume and settings, with no
  error anywhere. **Most dangerous code in the repo.** Rebuild as ordinary React props.
- **Two of three detail clients** — only `MonitorDetailDesignClientResponsive` is imported;
  `MonitorDetailDesignClient` and `...Fixed` are ~370 dead lines.
- **`app/light/page.tsx`** — 1,734 lines duplicating the landing page in a second theme.
  One page, themed by tokens.
- **`docs/file-structure.md`** — describes `vibe-agent-saas` with research agents and
  Firecrawl providers, a completely different app. README points at migration filenames
  that don't exist. Both actively mislead anyone you hire.
- **Redirect-only routes and the empty `pagewatch/` directory** — `dashboard/keywords` and
  `dashboard/competitors` exist only to redirect; nothing links there.
- **`tsconfig.tsbuildinfo`** — committed at 1.7 MB. Add to `.gitignore`.

---

## Bottom line

Nothing in the blocker list is architecturally hard. They're small, boring and currently
invisible — which is why they've survived: none of them break a screen you look at while
building. They break the moment a stranger's card is charged.

Weeks 1–5 turn a working app into a business that can take money and keep a promise.
Weeks 7 onward stop it competing on price against products that will always undercut you.

The capture engine is the part most people never get right, and it's already behind you.
