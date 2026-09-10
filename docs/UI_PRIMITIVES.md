# UI Primitives Reference

Every primitive lives in `components/ui/` (theme controls in `components/theme/`),
is styled from the tokens in `app/globals.css` via `class-variance-authority` +
`cn()` (`lib/utils.ts`), and forwards refs / spreads `className` and `...props`.
Read `docs/DESIGN_SYSTEM.md` first — this file is the API surface on top of it.

**Zero raw hex in any of these files.** Every colour is a Tailwind class backed
by a `--token` in `app/globals.css`. If you need a colour that isn't here, add
the token to `app/globals.css` (both `:root` and `.dark`) before using it.

---

## Button

`import { Button } from '@/components/ui/button'`

```ts
variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'   // default 'primary'
size?: 'sm' | 'md' | 'lg'                                          // default 'md'
asChild?: boolean        // render as your own element (e.g. Link) via Radix Slot
loading?: boolean        // shows a spinner in place of iconLeft, disables the button
iconLeft?: React.ReactNode
iconRight?: React.ReactNode
// ...plus every native <button> prop
```

```tsx
<Button variant="primary" size="md" onClick={addMonitor} loading={isPending}>
  Add monitor
</Button>

<Button variant="secondary" iconLeft={<Pause className="size-3.5" />} onClick={pause}>
  Pause
</Button>

<Button asChild variant="link">
  <Link href="/dashboard/urls/123">View monitor</Link>
</Button>
```

`asChild` renders plain (no icon/loading slots — Slot needs exactly one child).

---

## IconButton

`import { IconButton } from '@/components/ui/icon-button'`

```ts
variant?: 'primary' | 'secondary' | 'ghost' | 'danger'   // default 'ghost'
size?: 'sm' | 'md' | 'lg'                                 // default 'md'
"aria-label": string      // REQUIRED — icon-only, so it must always be named
```

```tsx
<IconButton aria-label="Open monitor menu" onClick={openMenu}>
  <MoreHorizontal className="size-4" />
</IconButton>
```

---

## Input

`import { Input } from '@/components/ui/input'`

```ts
invalid?: boolean
prefix?: React.ReactNode   // e.g. "https://" or an icon
suffix?: React.ReactNode   // e.g. a clear button, a unit
// ...plus every native <input> prop (note: `prefix` is NOT the native HTML attribute here)
```

```tsx
<Field label="Monitor URL" htmlFor="monitor-url" error={errors.url}>
  <Input id="monitor-url" prefix="https://" placeholder="example.com/pricing" />
</Field>
```

---

## Textarea

`import { Textarea } from '@/components/ui/textarea'`

```ts
invalid?: boolean
autoGrow?: boolean   // grows with content instead of scrolling internally
maxRows?: number      // caps autoGrow height
```

```tsx
<Field label="Watch instructions" htmlFor="watch-desc" description="Tells Claude what to look for.">
  <Textarea id="watch-desc" autoGrow maxRows={6} placeholder="Alert me if the price or CTA text changes…" />
</Field>
```

---

## Select

`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectSeparator } from '@/components/ui/select'`

Thin, token-styled Radix Select. Compose it exactly like Radix's own docs:

```tsx
<Select value={frequency} onValueChange={setFrequency}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Check frequency" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="hourly">Hourly</SelectItem>
    <SelectItem value="daily">Daily</SelectItem>
    <SelectItem value="weekly">Weekly</SelectItem>
  </SelectContent>
</Select>
```

---

## Switch

`import { Switch } from '@/components/ui/switch'`

Radix Switch, token-styled. Controlled/uncontrolled like any Radix Switch
(`checked` / `onCheckedChange` / `defaultChecked`).

```tsx
<div className="flex items-center justify-between">
  <span className="text-ui text-text">Full-page screenshots</span>
  <Switch checked={fullPage} onCheckedChange={setFullPage} />
</div>
```

---

## Checkbox

`import { Checkbox } from '@/components/ui/checkbox'`

**Not Radix** — `@radix-ui/react-checkbox` isn't an installed dependency and
adding one is out of scope for this pass (package.json is off-limits). This
wraps a native `<input type="checkbox">`, which is already fully keyboard- and
screen-reader-operable, so nothing is lost. Swap in Radix Checkbox later if the
package gets added — the props are plain native checkbox props, so the call
sites won't need to change.

```tsx
<label className="flex items-center gap-2 text-ui text-text">
  <Checkbox checked={selected} onChange={(e) => toggle(e.target.checked)} />
  acme.com/pricing
</label>
```

---

## Field

`import { Field } from '@/components/ui/field'`

```ts
label: string
htmlFor: string        // must match the control's `id`
description?: string
error?: string
required?: boolean
```

Owns the `htmlFor`/`id`/`aria-describedby`/`aria-invalid` wiring — it clones
its single child element with those props, so pass the same `id` you'd pass
anyway and Field does the rest.

```tsx
<Field label="Alert threshold" htmlFor="threshold" description="% of the page that must change to fire an alert." error={errors.threshold}>
  <Input id="threshold" type="number" min={1} max={100} />
</Field>
```

---

## Card / Panel

`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'`
`import { Panel, PanelHeader, PanelRow, PanelFooter } from '@/components/ui/panel'`

**Choosing between them:** `Card` is a padded, self-contained block — a
stat, a settings section, a summary panel. `Panel` is flat and unpadded,
built for rows that must run edge-to-edge — a monitor table, an alert list.
If you're about to put `divide-y` rows inside a `Card`, you want `Panel`.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Usage this period</CardTitle>
    <CardDescription>Resets on your next billing date.</CardDescription>
  </CardHeader>
  <CardContent>
    <Meter label="Checks used" value={usage.checksThisPeriod} max={limits.maxChecksPerMonth} />
  </CardContent>
</Card>

<Panel>
  <PanelHeader>Monitors</PanelHeader>
  {monitors.map((m) => (
    <PanelRow key={m.id}>
      <StatusDot tone={m.isActive ? 'ok' : 'neutral'} pulse={m.isActive} />
      <span className="flex-1 truncate">{m.name}</span>
      <SeverityBadge severity="high" />
    </PanelRow>
  ))}
  <PanelFooter>{monitors.length} monitors</PanelFooter>
</Panel>
```

`PanelHeader`/`PanelRow`/`PanelFooter` are additions beyond the design system's
one-line spec (`Panel — flat bordered surface, no padding`); they're the 40px
row-height building blocks that spec's density table calls for, kept in the
same file since a bare `Panel` div is rarely used without them.

---

## Badge / SeverityBadge

`import { Badge } from '@/components/ui/badge'`
`import { SeverityBadge } from '@/components/ui/severity-badge'`

```ts
// Badge
tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'critical' | 'info'   // default 'neutral'
size?: 'sm' | 'md'                                                   // default 'md'

// SeverityBadge — everything Badge takes except `tone` and `children`, plus:
severity: AlertSeverity   // from lib/types/database.types.ts
```

`SeverityBadge` is the **only** place that should ever turn an `AlertSeverity`
into a colour — it reads `lib/severity.ts`, which owns the mapping
(`critical → critical`, `high → warn`, `medium → info`, `low → muted`). Don't
re-derive this in a screen; import `SeverityBadge` (or `severityTone` /
`severityLabel` from `lib/severity.ts` if you need the tone without a badge).

```tsx
<Badge tone="accent">Watch mode</Badge>
<SeverityBadge severity={alert.severity} />
```

---

## StatusDot

`import { StatusDot } from '@/components/ui/status-dot'`

```ts
tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'critical' | 'info'   // default 'neutral'
pulse?: boolean   // ring-pulse animation, for a monitor actively capturing
```

```tsx
<StatusDot tone={monitor.isActive ? 'ok' : 'neutral'} pulse={monitor.isActive} />
```

---

## Dialog

`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'`

Radix Dialog — focus trap, Escape-to-close, scroll lock and focus restore all
come from Radix, styled to tokens. This is also the shape of the "plan-gated
control" recipe below.

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Add monitor</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a monitor</DialogTitle>
      <DialogDescription>PageWatch will capture a baseline screenshot right away.</DialogDescription>
    </DialogHeader>
    {/* form fields */}
    <DialogFooter>
      <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
      <Button type="submit">Add monitor</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Sheet

`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'`

Same Radix Dialog machinery as `Dialog`, styled as a side panel — mobile nav,
an inspector drawer. Pick a side on `SheetContent`:

```ts
side?: 'left' | 'right' | 'top' | 'bottom'   // default 'right'
```

```tsx
<Sheet open={navOpen} onOpenChange={setNavOpen}>
  <SheetContent side="left" className="max-w-[224px] p-0">
    {/* mobile nav content */}
  </SheetContent>
</Sheet>
```

---

## DropdownMenu

`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'`

`DropdownMenuItem` takes an extra `variant?: 'default' | 'danger'` for
destructive actions.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <IconButton aria-label="Monitor actions"><MoreHorizontal className="size-4" /></IconButton>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={() => pause(monitor.id)}>Pause</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="danger" onSelect={() => remove(monitor.id)}>Delete monitor</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Tooltip

`import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'`

`TooltipProvider` is already mounted once in `app/layout.tsx` — don't add
another one per screen.

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <IconButton aria-label="Pause monitor" disabled title="Free plan monitors can't be paused individually">
      <Pause className="size-4" />
    </IconButton>
  </TooltipTrigger>
  <TooltipContent>Free plan monitors can't be paused individually</TooltipContent>
</Tooltip>
```

---

## Tabs

`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'`

Underline style, no pills — per docs/DESIGN_SYSTEM.md §1.

```tsx
<Tabs defaultValue="diff">
  <TabsList>
    <TabsTrigger value="diff">What changed</TabsTrigger>
    <TabsTrigger value="current">Current</TabsTrigger>
    <TabsTrigger value="zones">Zones</TabsTrigger>
  </TabsList>
  <TabsContent value="diff">{/* diff viewer */}</TabsContent>
</Tabs>
```

---

## Skeleton

`import { Skeleton } from '@/components/ui/skeleton'`

Plain shimmer block — size it with `className`. Animation is neutralised
globally under `prefers-reduced-motion` (app/globals.css).

```tsx
<div className="flex flex-col gap-2">
  <Skeleton className="h-4 w-32" />
  <Skeleton className="h-24 w-full" />
</div>
```

---

## EmptyState

`import { EmptyState } from '@/components/ui/empty-state'`

```ts
icon?: React.ReactNode
title: string
description?: string
action?: React.ReactNode   // usually a <Button>
```

```tsx
<EmptyState
  icon={<Monitor className="size-4" />}
  title="No monitors yet"
  description="Add a URL and PageWatch takes a baseline screenshot right away."
  action={<Button onClick={openAddUrl}>Add monitor</Button>}
/>
```

---

## Toast

`import { useToast } from '@/components/ui/ToastProvider'`

```ts
useToast(): {
  toast(input: {
    title: string
    description?: string
    type?: 'success' | 'error' | 'info'   // original API — still works
    tone?: 'success' | 'error' | 'info'   // preferred alias; wins over `type` if both given
    action?: { label: string; href: string }
  }): void
  success(title: string, description?: string): void
  error(title: string, description?: string): void
  info(title: string, description?: string): void
}
```

See the plan-gated recipe below for the `action` slot — it's what turns an
`EntitlementError` into a real upgrade prompt instead of a dead-end error.

---

## Kbd

`import { Kbd } from '@/components/ui/kbd'`

```tsx
<span className="flex items-center gap-1 text-meta text-text-muted">
  <Kbd>⌘</Kbd><Kbd>K</Kbd> to search monitors
</span>
```

---

## Avatar

`import { Avatar } from '@/components/ui/avatar'`

```ts
src?: string | null
alt?: string
fallback: string   // shown if src is absent or fails to load — pass initials
size?: 'sm' | 'md' | 'lg'   // default 'md'
```

```tsx
<Avatar src={member.avatarUrl} alt={member.name} fallback={initials(member.name)} size="sm" />
```

---

## Separator

`import { Separator } from '@/components/ui/separator'`

```ts
orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
decorative?: boolean                       // default true (aria-hidden); false for a semantic divider
```

```tsx
<div className="flex items-center gap-3">
  <span>Free</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Pro</span>
</div>
```

---

## Meter

`import { Meter } from '@/components/ui/meter'`

```ts
label: string
value: number
max: number
valueLabel?: string   // overrides the default "{value} / {max}"
tone?: 'accent' | 'ok' | 'warn' | 'critical'   // default 'accent'
```

```tsx
<Meter
  label="Monitors"
  value={usage.monitors}
  max={limits.maxMonitors}
  tone={usage.monitors >= limits.maxMonitors ? 'warn' : 'accent'}
/>
```

---

## ThemeToggle

`import { ThemeToggle } from '@/components/theme/ThemeToggle'`

No props — reads/writes theme via `next-themes`. Renders a sun/moon
`IconButton` that opens a Light/Dark/System `DropdownMenu`. Place it in the
sidebar or topbar; `ThemeProvider` (mounted once in `app/layout.tsx`) is its
only dependency.

---

## Recipe: showing a plan-gated control

The pattern for anything `lib/entitlements.ts` can refuse
(`assertCanAddMonitors`, `assertFrequencyAllowed`, `assertFeature`, ...): try
the action, catch `EntitlementError`, and hand its `upgradeTo` straight to the
Toast action slot. Never hide the control silently — the disabled state always
says why (design system §5), and the refusal always offers the upgrade.

```tsx
'use client'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/button'
import { EntitlementError } from '@/lib/entitlements'

function AddMonitorButton({ addMonitor }: { addMonitor: () => Promise<void> }) {
  const { toast } = useToast()

  async function handleClick() {
    try {
      await addMonitor()
      toast({ title: 'Monitor added', tone: 'success' })
    } catch (err) {
      if (err instanceof EntitlementError) {
        toast({
          title: 'Monitor limit reached',
          description: err.message,
          tone: 'error',
          action: err.upgradeTo
            ? { label: `Upgrade to ${err.upgradeTo}`, href: '/dashboard/settings/billing' }
            : undefined,
        })
        return
      }
      throw err
    }
  }

  return <Button onClick={handleClick}>Add monitor</Button>
}
```

For a control that's disabled ahead of time (you already have entitlements
client-side via `ClientEntitlements`), wrap it in a `Tooltip` so the reason is
visible on hover/focus, per design system §5 ("Disabled" rule):

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <Button disabled={remaining.monitors <= 0}>Add monitor</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>
    {plan.name} includes {limits.maxMonitors} monitors. Upgrade for more.
  </TooltipContent>
</Tooltip>
```

---

## Not built in this pass

`@radix-ui/react-popover` and `@radix-ui/react-label` are installed
dependencies (per the design system's own list) but aren't named as
standalone primitives in DESIGN_SYSTEM.md §6, so no dedicated
`components/ui/popover.tsx` exists yet — `Field` already uses
`@radix-ui/react-label` internally. Add a `Popover` wrapper the same way as
`Tooltip`/`DropdownMenu` if a screen needs one.
