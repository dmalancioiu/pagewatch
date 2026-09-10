# PageWatch Design System

> Supersedes `docs/DESIGN_IDENTITY.md`, which described a light-only workflow-builder
> look. The density, hairline-border and small-type principles from that document
> survive; the light-only default does not.

Every UI surface — dashboard, landing, onboarding — is built from this file.
If something you need isn't here, add it here first, then use it.

---

## 1. Identity

**Dark-first, both themes fully designed.** Dark is the default and the one that
appears in marketing. Light is a first-class theme, not an afterthought.

The register: **precise, dense, quiet, fast.** Closer to Linear, Vercel and Raycast
than to Stripe or Notion. Specifically:

- Hairline borders do the structural work. Shadows are almost absent in dark, and
  minimal in light.
- Small type everywhere. 13px is the body size. There are no giant dashboard headings.
- Dense controls, generous canvas. Rows are 36–40px, not 56px.
- One accent, used sparingly. Colour means something or it isn't there.
- Motion is 120–160ms and functional. No decorative animation, no gradients on
  buttons, no glass, no glow.

**Never**: gradient buttons, glassmorphism, large colourful stat cards, emoji as
iconography, `rounded-2xl` on everything, drop shadows as decoration, more than one
accent hue on a screen.

### Why this accent

`--accent` is an indigo-violet (`#7C6BF5` dark / `#5B4BE0` light). It reads as
software-infrastructure rather than finance-blue, and it's far enough from the
semantic colours that an accent button never gets mistaken for a warning.

`--diff` is a magenta (`#FF3D8A`) reserved **exclusively** for change overlays,
diff heatmaps and the "what changed" highlight. This is not decoration: `pixelmatch`
renders changed pixels in that part of the spectrum, so the colour on screen means
the same thing as the colour in the pipeline. **Never use `--diff` for a button, a
link, or a badge that isn't about a detected change.**

---

## 2. Tokens

Defined as CSS custom properties on `:root` (light) and `.dark` (dark), consumed
through Tailwind. **Never write a raw hex in a component.** If you're reaching for
one, the token is missing — add it.

### Surfaces

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0B0C0E` | `#FAFAFB` | App ground, behind everything |
| `--bg-subtle` | `#0F1113` | `#F4F5F7` | Inset wells, table stripes, code blocks |
| `--panel` | `#131518` | `#FFFFFF` | Cards, sidebar, table surface |
| `--panel-raised` | `#191C21` | `#FFFFFF` | Modals, popovers, dropdowns, hover |
| `--border` | `#23262C` | `#E6E8EC` | Default hairline |
| `--border-strong` | `#31353D` | `#D2D6DD` | Input borders, focused edges, dividers that must read |

### Text

| Token | Dark | Light | Use |
|---|---|---|---|
| `--text` | `#E9EBEE` | `#14161A` | Primary content |
| `--text-muted` | `#9AA1AC` | `#5A6270` | Secondary, descriptions, metadata |
| `--text-faint` | `#6C7480` | `#878E9A` | Labels, timestamps, placeholders |

### Accent & semantic

| Token | Dark | Light | Use |
|---|---|---|---|
| `--accent` | `#7C6BF5` | `#5B4BE0` | Primary action, active nav, focus ring |
| `--accent-hover` | `#8E80F7` | `#4C3DD0` | Hover state of the above |
| `--accent-fg` | `#FFFFFF` | `#FFFFFF` | Text on an accent fill |
| `--accent-subtle` | `rgb(124 107 245 / .14)` | `rgb(91 75 224 / .10)` | Active nav background, selected row |
| `--diff` | `#FF3D8A` | `#E0176E` | **Change overlays only** |
| `--diff-subtle` | `rgb(255 61 138 / .16)` | `rgb(224 23 110 / .10)` | Diff region wash |
| `--critical` | `#F2555A` | `#D92D3B` | Critical severity, destructive actions |
| `--warn` | `#F0A93B` | `#B87708` | High severity, quota warnings |
| `--ok` | `#35C793` | `#0E8A5F` | Healthy, resolved, success |
| `--info` | `#48A9F8` | `#1E7FD4` | Neutral informational |

Each semantic colour also gets a `-subtle` variant at ~12% alpha for badge fills.

**Severity maps to colour exactly once**, in a shared helper — never re-derived
per component:
`critical → --critical`, `high → --warn`, `medium → --info`, `low → --text-muted`.

### Radii

`--radius-sm: 4px` · `--radius: 6px` (default: buttons, inputs, badges) ·
`--radius-md: 8px` (cards, panels) · `--radius-lg: 12px` (modals) · `--radius-full: 999px`

### Elevation

Dark: no shadows on cards. `--shadow-popover: 0 8px 24px rgb(0 0 0 / .5)` on
floating layers only.
Light: `--shadow-card: 0 1px 2px rgb(16 20 28 / .05)`, `--shadow-popover:
0 8px 24px rgb(16 20 28 / .12)`.

---

## 3. Typography

**Geist Sans** for everything, **Geist Mono** for URLs, storage paths, diff
percentages, timestamps and any figure that lines up in a column. Both ship via the
installed `geist` package — `import { GeistSans } from 'geist/font/sans'` in
`app/layout.tsx`. No Google Fonts, no network request.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Label | 11px | 600 | uppercase, `tracking-[0.06em]`, `--text-faint` |
| Meta | 12px | 400 | timestamps, counts, helper text |
| Body / UI | **13px** | 400 | the default for the whole product UI |
| Body emphasis | 13px | 500 | row titles, active nav |
| Section title | 15px | 600 | card headers, settings sections |
| Page title | 20px | 600 | `tracking-[-0.02em]` |
| Display | 32–56px | 600–700 | **landing pages only**, `tracking-[-0.03em]` |

Line height 1.45 for body, 1.2 for titles. Any column of numbers gets
`font-variant-numeric: tabular-nums`.

---

## 4. Density & spacing

4px base unit. Use 6, 8, 10, 12, 16, 20, 24, 32, 48.

| Element | Height |
|---|---|
| Sidebar width | 224px |
| Top bar | 48px |
| Table / list row | 40px |
| Button sm / md / lg | 28 / 32 / 36px |
| Input, select | 32px |
| Badge | 20px |

Card padding 16px; modal padding 20px; page gutter 24px (16px under 640px).

---

## 5. Interaction

- **Focus**: `:focus-visible` shows a 2px `--accent` ring at 2px offset. Never
  remove it, never rely on hover alone.
- **Motion**: 120ms `ease-out` for colour/background, 160ms for transform, 200ms for
  modal enter. Wrap everything in `@media (prefers-reduced-motion: reduce)`.
- **Hover**: rows and nav items go to `--panel-raised`. Buttons go to their
  `-hover` token.
- **Disabled**: 45% opacity, `cursor: not-allowed`, and always a `title` or tooltip
  saying *why* — especially for plan-gated controls.
- **Keyboard**: every interactive element is reachable and operable. Modals trap
  focus, close on Escape, and restore focus on close (Radix gives all of this —
  use it, don't hand-roll).

---

## 6. Primitives

All in `components/ui/`, all client-safe, all styled from tokens via
`class-variance-authority` + the existing `cn()` in `lib/utils.ts`.

```
Button        variant: primary | secondary | ghost | danger | link
              size: sm | md | lg ; props: loading, iconLeft, iconRight, asChild
IconButton    square Button; REQUIRES an aria-label
Input         + invalid state, prefix/suffix slot
Textarea      auto-grow optional
Select        Radix Select, token-styled
Switch        Radix Switch
Checkbox      Radix Checkbox
Field         label + description + error wrapper; owns the htmlFor wiring
Card          Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter
Panel         flat bordered surface, no padding — for tables and lists
Badge         tone: neutral | accent | ok | warn | critical | info ; size: sm | md
SeverityBadge takes AlertSeverity, maps via the single shared helper
StatusDot     tone + optional pulse (live monitors)
Dialog        Radix Dialog: Dialog/Trigger/Content/Header/Title/Description/Footer
Sheet         Radix Dialog in a side-panel position (mobile nav, inspector)
DropdownMenu  Radix DropdownMenu
Tooltip       Radix Tooltip + a single TooltipProvider in the root layout
Tabs          Radix Tabs, underline style — no pills
Skeleton      shimmer block honouring prefers-reduced-motion
EmptyState    icon + title + description + optional action
Toast         reworked from the existing ToastProvider; adds an action slot so an
              EntitlementError can render "Upgrade" inline
Kbd           keyboard hint chip
Avatar        initials fallback
Separator     horizontal / vertical
Meter         labelled usage bar (monitors used, checks this period)
```

### Toast must carry actions

`EntitlementError` (see `lib/entitlements.ts`) carries `code` and `upgradeTo`.
The toast API must accept `{ title, description, tone, action?: { label, href } }`
so a refused action renders **"Pro raises this to 15 monitors — Upgrade"** rather
than a dead-end error.

---

## 7. Product vocabulary

Write from the user's side of the screen. Never leak schema names into the UI.

| Say | Not |
|---|---|
| Monitor | monitored_url, URL row |
| Check | run, capture, job |
| Change / What changed | diff, diff_pct, delta |
| Alert | notification event |
| Zone | tracked region, bbox |
| Paused | inactive, is_active false |
| Snapshot / capture | screenshot_snapshot |

Percentages are for engineers. A user-facing alert says **what changed**, and shows
the percentage only as secondary metadata.

Buttons say what happens (`Add monitor`, then a toast saying `Monitor added`).
Errors say what went wrong and how to fix it — no apologies, no vagueness.

---

## 8. Rules that are easy to break by accident

1. **No raw hex in components.** Tokens only.
2. **No `style={{}}`** except for a genuinely computed value (a diff overlay's
   position, a meter's width). The current codebase is full of inline styles; the
   redesign does not carry them forward.
3. **`--diff` is only for change overlays.**
4. **Both themes, every time.** If you add a colour, add it to `:root` *and*
   `.dark`. A colour defined in only one place is the classic unreadable-UI bug.
5. **Server components by default.** `'use client'` only where interactivity
   genuinely requires it — and then as low in the tree as possible.
6. **Every list has an empty state, a loading state and an error state.** All three
   ship with the screen, not later.
7. **Test at 390px.** The dashboard is currently unusable on a phone, and alerts are
   exactly what people check on a phone.
