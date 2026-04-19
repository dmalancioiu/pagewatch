# PageWatch — Codebase Reference

## What this app is
Visual monitoring SaaS. Users add URLs → Playwright screenshots on a schedule → pixelmatch diff → alert if above threshold → AI (Claude) writes a plain-English summary. Stack: Next.js 14 App Router + Supabase + Trigger.dev + Stripe + Resend.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router (server + client components mixed) |
| Database / Auth / Storage | Supabase (Postgres, SSR cookie auth, Storage buckets) |
| Background jobs | Trigger.dev v4 (`@trigger.dev/sdk`) |
| Screenshot capture | Playwright + Chromium-BDI |
| Image diffing | `pixelmatch` + `pngjs` |
| AI summaries | `@anthropic-ai/sdk` (Claude) |
| Payments | Stripe (checkout + webhooks) |
| Email | Resend |
| Styling | Tailwind CSS + **heavy inline `style={{}}`** (no CSS modules, no styled-components) |
| Icons | `lucide-react` |
| Forms | `react-hook-form` + `zod` |

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

## Critical Architectural Decisions

### Styling: inline styles over CSS classes
Everything uses `style={{ color: '...', background: '...' }}` inline. **Do not refactor to Tailwind utilities** unless touching a whole component. CSS classes (`.dash-card`, `.dash-nav-item` etc.) live in `globals.css` and now use CSS variables for theme support.

### CSS Variables (light/dark theme)
Defined in `globals.css` under `:root` (dark) and `[data-theme="light"]`:
- `--bg-page`, `--bg-sidebar`, `--bg-card`, `--bg-card-alt`
- `--border`, `--border-light`
- `--text-primary`, `--text-muted`, `--text-dim`, `--text-faint`

Applied via `data-theme` attribute on the root div in `DashboardShell`. `.dash-card`, `.dash-nav-item`, `.dash-input` all reference these variables. Deep inline styles do NOT auto-adapt — only CSS-class-based styles do.

### Theme context
`DashboardCtx` (in `DashboardShell.tsx`) exposes:
```ts
{ openAddUrl: () => void, theme: 'dark'|'light', toggleTheme: () => void }
```
Toggle is a sun/moon button in the Sidebar header. Persists to `localStorage`.

### Server vs Client split
- **Pages** (`app/dashboard/**/page.tsx`) are **server components** — fetch data, sign storage URLs, pass props down
- **Client islands** (`UrlDetailClient.tsx`, `UrlDetailSettings.tsx`, `DiffViewerModal.tsx`, `DashboardShell.tsx`, `Sidebar.tsx`) handle interactivity
- **Server actions** (`lib/actions/*.ts`) use `'use server'` — called directly from both server and client components

### Storage URLs
Screenshots are stored in Supabase Storage. Bucket paths are stored in DB (`storage_path`). URLs are **signed** server-side in the page's server component before being passed to client components. Never sign URLs in client components.

---

## Common Patterns

### Server action (typical shape)
```ts
'use server'
import { createServerClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export async function doSomething(id: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from('table').update({...}).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/...')
}
```

### Signed URL (server component)
```ts
const { data } = await supabase.storage
  .from('screenshots')
  .createSignedUrl(snapshot.storage_path, 60 * 60) // 1hr expiry
const signedUrl = data?.signedUrl ?? null
```

### Download image (client)
```ts
async function downloadImage(url: string, filename: string) {
  const res  = await fetch(url)
  const blob = await res.blob()
  const href = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = href; a.download = filename; a.click()
  URL.revokeObjectURL(href)
}
```
This pattern exists in both `UrlDetailClient.tsx` and `DiffViewerModal.tsx`.

---

## Known State & Gotchas

- **`deleteMonitoredUrl`** = hard DELETE (SQL). Previously was soft-delete via `is_active: false` — that caused the pause bug. Do NOT change back to soft-delete.
- **`getMonitoredUrls`** returns ALL URLs (active + paused). Previously filtered `is_active: true`. Paused URLs show in the list with a "Paused" badge.
- **`pauseMonitoredUrl(id, paused: boolean)`** sets `is_active = !paused`. Paused = `is_active: false`.
- **`DiffViewerModal`** tab `'compare'` = slider, `'before'`/`'after'` = single image, `'diff'` = overlay. Download button downloads whichever tab is active.
- **`SnapshotRow`** is a `<div>` not a `<button>` (refactored to support independent download button without nested interactive elements).
- The landing page at `/` is dark-only. The page at `/light` is the light-theme version (self-contained, its own inline `LightPricing` component, does not use `PricingSection`).
- `DashboardShell` uses `useEffect` to read `localStorage` on mount for persisted theme — expect one render with default dark before hydration.
- `tailwind.config.ts` has `darkMode: ["class"]` but **no `dark:` utilities are used anywhere** — theming is done via CSS variables + `data-theme`.

---

## Auth Flow
Supabase SSR cookie-based auth. `app/dashboard/layout.tsx` checks for a session and redirects to `/login` if missing. After login, Supabase redirects to `/api/auth/callback` which exchanges the code and sets cookies, then redirects to `/dashboard` or `/onboarding`.

---

## Stripe Flow
`/api/stripe/checkout` creates a Checkout session. `/api/stripe/webhook` handles `checkout.session.completed` → updates `profiles.plan` and stores `stripe_subscription_id`.

---