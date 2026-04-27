# PageWatch — Codebase Reference

## What this app is

Visual monitoring SaaS. Users add URLs → Playwright screenshots on a schedule → pixelmatch diff → alert if above threshold → AI (Claude) writes a plain-English summary. Stack: Next.js 14 App Router + Supabase + Trigger.dev + Stripe + Resend.

---

## Tech Stack

| Layer                     | Choice                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Framework                 | Next.js 14 App Router (server + client components mixed)                            |
| Database / Auth / Storage | Supabase (Postgres, SSR cookie auth, Storage buckets)                               |
| Background jobs           | Trigger.dev v4 (`@trigger.dev/sdk`)                                                 |
| Screenshot capture        | Playwright + Chromium-BDI                                                           |
| Image diffing             | `pixelmatch` + `pngjs`                                                              |
| AI summaries              | `@anthropic-ai/sdk` (Claude)                                                        |
| Payments                  | Stripe (checkout + webhooks)                                                        |
| Email                     | Resend                                                                              |
| Styling                   | Tailwind CSS + **heavy inline `style={{}}`** (no CSS modules, no styled-components) |
| Icons                     | `lucide-react`                                                                      |
| Forms                     | `react-hook-form` + `zod`                                                           |

---

## Folder Structure

```
app/
  page.tsx                  # Landing page (dark, route /)
  light/page.tsx            # Landing page (light theme, route /light)
  globals.css               # All CSS — landing + dashboard + CSS variables
  layout.tsx                # Root layout
  login/page.tsx
  onboarding/page.tsx
  api/
    auth/callback/route.ts
    stripe/checkout + webhook
  dashboard/
    layout.tsx              # Auth guard + mounts DashboardShell
    page.tsx                # Overview: stats + alert feed + URL list widget
    alerts/page.tsx
    urls/
      page.tsx              # URL table (shows active + paused)
      AddUrlForm.tsx
      [id]/
        page.tsx            # Server: loads snapshots + alerts, signs storage URLs
        UrlDetailClient.tsx # Client: screenshot history grid + AlertDiffPreview
        UrlDetailSettings.tsx # Client: pause/resume/delete/schedule settings

components/
  dashboard/
    DashboardShell.tsx      # Root layout wrapper + DashboardCtx (openAddUrl, theme, toggleTheme)
    Sidebar.tsx             # Left nav + theme toggle (sun/moon)
    AddUrlModal.tsx
    FirstScreenshotModal.tsx  # Polls for baseline screenshot after URL creation
    DiffViewerModal.tsx     # Fullscreen before/after slider + download button
  landing/
    PricingSection.tsx      # Client — monthly/annual toggle
    ScrollReveal.tsx        # IntersectionObserver scroll animations
  ui/                       # shadcn-style primitives (button, card, input, badge)

lib/
  types/database.types.ts   # All TS interfaces (MonitoredUrl, Alert, Snapshot, etc.)
  types.ts
  actions/
    websites.ts             # addMonitoredUrls, getMonitoredUrls, pauseMonitoredUrl, deleteMonitoredUrl, updateMonitoredUrl
    alerts.ts               # getAlerts, acknowledgeAlert
    screenshots.ts
    run-now.ts              # triggerManualRun
    schedules.ts, workspace.ts, onboarding.ts, auth-actions.ts
  supabase/
    server.ts               # createServerClient() — use in server components + actions
    browser.ts / client.ts  # use in client components
    admin.ts                # service-role client
    storage.ts              # signUrl helpers

trigger/                    # Trigger.dev background task definitions
supabase/                   # DB migrations + config
```

---

## Key Database Tables

```
monitored_urls      id, workspace_id, url, name, check_frequency, check_hour,
                    threshold_pct, is_active, last_checked_at, watch_description,
                    full_page, mode ('watch'|'archive'), created_at, updated_at

screenshot_snapshots  id, workspace_id, monitored_url_id, storage_path,
                      taken_at, file_size_bytes, metadata, created_at

alerts              id, workspace_id, monitored_url_id, alert_type, severity,
                    status ('open'|'acknowledged'|'dismissed'), title, summary,
                    ai_summary, diff_pct, diff_storage_path,
                    current_snapshot_id, previous_snapshot_id, created_at

profiles            id, full_name, email, plan ('trial'|'starter'|'agency'),
                    stripe_customer_id, stripe_subscription_id

workspaces          id, owner_user_id, name, domain
```

`check_frequency`: `'hourly' | 'daily' | 'weekly'`
`mode`: `'watch'` (diff + alert) | `'archive'` (screenshot only, no alerting)

---
