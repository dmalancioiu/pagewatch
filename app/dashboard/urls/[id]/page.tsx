import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Layers3,
  Pause,
  ScanSearch,
  Sparkles,
} from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import { UrlDetailClient } from './UrlDetailClient'
import { UrlDetailSettings } from './UrlDetailSettings'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'

export const metadata = { title: 'Monitor — PageWatch' }

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const FREQ_LABEL: Record<string, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
}

function nextCheckAt(url: any): string {
  const freq: string = url.check_frequency
  const last: string | null = url.last_checked_at
  const checkHour: number | null = url.check_hour ?? null

  if (!last) return 'Soon, first run pending'

  const now = new Date()
  const lastD = new Date(last)

  if (freq === 'hourly') {
    const next = new Date(lastD.getTime() + 60 * 60 * 1000)
    if (next <= now) return 'Next hourly run'
    const mins = Math.round((next.getTime() - now.getTime()) / 60000)
    return `In ~${mins}m`
  }

  if (checkHour != null) {
    const next = new Date()
    next.setUTCHours(checkHour, 0, 0, 0)

    if (freq === 'weekly') {
      const minNext = new Date(lastD.getTime() + 7 * 24 * 60 * 60 * 1000)
      while (next < minNext) next.setUTCDate(next.getUTCDate() + 1)
    } else if (next <= now) {
      next.setUTCDate(next.getUTCDate() + 1)
    }

    return next.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  }

  const ms = freq === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const next = new Date(lastD.getTime() + ms)
  if (next <= now) return freq === 'weekly' ? 'Next weekly run' : 'Next daily run'
  const hours = Math.round((next.getTime() - now.getTime()) / 3600000)
  return `In ~${hours}h`
}

function statusTone(urlData: any, openAlertsCount: number) {
  const isPaused = !urlData.is_active
  const isArchive = urlData.mode === 'archive'

  if (isPaused) {
    return {
      label: 'Paused',
      description: 'Checks are disabled until you resume this monitor.',
      icon: <Pause className="h-3.5 w-3.5" />,
      pillStyle: {
        background: '#F3F4F6',
        color: '#6B7280',
        border: '1px solid #E5E7EB',
      },
      panelStyle: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
        border: '1px solid #E5E7EB',
      },
    }
  }

  if (openAlertsCount > 0) {
    return {
      label: `${openAlertsCount} open alert${openAlertsCount === 1 ? '' : 's'}`,
      description: 'Recent visual changes need review before you can trust this page again.',
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      pillStyle: {
        background: 'rgba(185,28,28,0.08)',
        color: '#B91C1C',
        border: '1px solid rgba(185,28,28,0.18)',
      },
      panelStyle: {
        background: 'linear-gradient(180deg, rgba(254,242,242,0.9) 0%, #FFFFFF 100%)',
        border: '1px solid rgba(185,28,28,0.14)',
      },
    }
  }

  if (isArchive) {
    return {
      label: 'Archive mode',
      description: 'This monitor stores screenshots for reference and skips change alerts.',
      icon: <Layers3 className="h-3.5 w-3.5" />,
      pillStyle: {
        background: '#F3F4F6',
        color: '#4B5563',
        border: '1px solid #E5E7EB',
      },
      panelStyle: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        border: '1px solid #E5E7EB',
      },
    }
  }

  return {
    label: 'Healthy',
    description: 'Checks are running normally and no active visual changes are open.',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    pillStyle: {
      background: 'rgba(22,163,74,0.08)',
      color: '#15803D',
      border: '1px solid rgba(22,163,74,0.2)',
    },
    panelStyle: {
      background: 'linear-gradient(180deg, rgba(240,253,244,0.9) 0%, #FFFFFF 100%)',
      border: '1px solid rgba(22,163,74,0.14)',
    },
  }
}

function MonitoringSetupCard({ url }: { url: any }) {
  const isArchive = url.mode === 'archive'
  const isFullPage = url.full_page !== false
  const zones: any[] = Array.isArray(url.zones) ? url.zones : []
  const hasZones = zones.length > 0
  const description = url.watch_description?.trim() || null
  const checkHour = url.check_hour ?? null

  let scheduleLabel = FREQ_LABEL[url.check_frequency] ?? url.check_frequency
  if ((url.check_frequency === 'daily' || url.check_frequency === 'weekly') && checkHour != null) {
    const ampm = checkHour < 12 ? 'AM' : 'PM'
    const label = checkHour === 0 ? '12' : checkHour <= 12 ? String(checkHour) : String(checkHour - 12)
    scheduleLabel += ` at ${label}:00 ${ampm} UTC`
  }

  const rows: { icon: ReactNode; label: string; value: string }[] = [
    {
      icon: isArchive ? <Layers3 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />,
      label: 'Mode',
      value: isArchive ? 'Archive only, screenshots are saved without alerting' : 'Watch mode, visual changes can create alerts',
    },
    {
      icon: <Globe2 className="h-4 w-4" />,
      label: 'Capture',
      value: isFullPage ? 'Full page capture across the full scroll depth' : 'Visible viewport only, above-the-fold monitoring',
    },
    {
      icon: <ScanSearch className="h-4 w-4" />,
      label: 'Focus zones',
      value: hasZones
        ? `${zones.length} zone${zones.length === 1 ? '' : 's'} selected, diffing ignores the rest of the page`
        : 'No zones selected, the entire capture is compared',
    },
    {
      icon: <Clock3 className="h-4 w-4" />,
      label: 'Schedule',
      value: scheduleLabel,
    },
  ]

  if (description && !isArchive) {
    rows.splice(3, 0, {
      icon: <Sparkles className="h-4 w-4" />,
      label: 'Alert focus',
      value: description,
    })
  }

  return (
    <div className="dash-card overflow-hidden">
      <div className="border-b px-5 py-4" style={{ borderColor: '#F3F4F6', background: '#FCFCFD' }}>
        <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: '#9CA3AF' }}>Configuration</p>
        <h2 className="mt-1 text-sm font-semibold" style={{ color: '#111827' }}>Monitoring setup</h2>
      </div>

      <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3 px-5 py-4">
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{ background: '#F8FAFC', color: '#6B7280', border: '1px solid #EEF2F7' }}
            >
              {row.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>{row.label}</p>
              <p className="mt-1 text-sm leading-6" style={{ color: '#374151' }}>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="dash-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight" style={{ color: '#111827' }}>{value}</p>
      <p className="mt-1 text-xs leading-5" style={{ color: '#6B7280' }}>{hint}</p>
    </div>
  )
}

export default async function UrlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const { id } = await params
  let urlData: any

  try {
    urlData = await getMonitoredUrlById(id)
  } catch {
    notFound()
  }

  if (!urlData || urlData.workspace_id !== workspace.id) notFound()

  const snapshots: any[] = (urlData.screenshot_snapshots ?? []).sort(
    (a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime(),
  )

  const alerts: any[] = (urlData.alerts ?? []).sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const openAlerts = alerts.filter((a: any) => a.status === 'open')
  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  const allPaths: (string | null | undefined)[] = [
    ...snapshots.map((s: any) => s.storage_path),
    ...alerts.map((a: any) => a.diff_storage_path),
  ]

  const signedUrlMap = await getSignedUrls(allPaths)

  const enrichedAlerts: AlertWithUrls[] = alerts.map((a: any) => {
    const prevSnap = snapshotById.get(a.previous_snapshot_id)
    const currSnap = snapshotById.get(a.current_snapshot_id)

    return {
      id: a.id,
      diff_pct: a.diff_pct,
      severity: a.severity,
      status: a.status,
      created_at: a.created_at,
      ai_summary: a.ai_summary,
      beforeUrl: prevSnap ? signedUrlMap.get(prevSnap.storage_path) ?? null : null,
      afterUrl: currSnap ? signedUrlMap.get(currSnap.storage_path) ?? null : null,
      diffUrl: a.diff_storage_path ? signedUrlMap.get(a.diff_storage_path) ?? null : null,
    }
  })

  const alertBySnapshotId: Record<string, AlertWithUrls> = {}
  for (const a of enrichedAlerts) {
    const rawAlert = alerts.find((ra: any) => ra.id === a.id)
    if (rawAlert?.current_snapshot_id) alertBySnapshotId[rawAlert.current_snapshot_id] = a
  }

  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((s: any) => ({
    id: s.id,
    storage_path: s.storage_path,
    taken_at: s.taken_at,
    file_size_bytes: s.file_size_bytes,
    signedUrl: signedUrlMap.get(s.storage_path) ?? null,
  }))

  const openAlert = enrichedAlerts.find((a) => a.status === 'open') ?? null
  const openAlertsCount = openAlerts.length
  const totalChecks = snapshots.length
  const status = statusTone(urlData, openAlertsCount)
  const latestDiff = openAlert?.diff_pct != null ? `${Number(openAlert.diff_pct).toFixed(1)}% changed` : 'No active diff'

  let hostname = urlData.url
  try {
    hostname = new URL(urlData.url).hostname
  } catch {}

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard/urls"
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
          style={{ color: '#6B7280', background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to monitors
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-8">
          <section className="dash-card overflow-hidden" style={status.panelStyle}>
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                      style={status.pillStyle}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: '#FFFFFF', color: '#6B7280', border: '1px solid #E5E7EB' }}
                    >
                      <Globe2 className="h-3.5 w-3.5" />
                      {hostname}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: '#111827' }}>
                    {urlData.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]" style={{ color: '#4B5563' }}>
                    {status.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                    <a
                      href={urlData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 transition-colors"
                      style={{ background: '#FFFFFF', color: '#111827', border: '1px solid #E5E7EB' }}
                    >
                      <span className="truncate">{urlData.url}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    <span style={{ color: '#9CA3AF' }}>Last checked {timeAgo(urlData.last_checked_at)}</span>
                    <span style={{ color: '#D1D5DB' }}>•</span>
                    <span style={{ color: '#9CA3AF' }}>Next run {nextCheckAt(urlData)}</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:w-[320px] xl:grid-cols-1">
                  <div className="rounded-2xl bg-white/80 p-4 backdrop-blur" style={{ border: '1px solid #E5E7EB' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>Open changes</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: '#111827' }}>{openAlertsCount}</p>
                    <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>{latestDiff}</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 backdrop-blur" style={{ border: '1px solid #E5E7EB' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>Checks captured</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: '#111827' }}>{totalChecks}</p>
                    <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>Historical screenshots available</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 backdrop-blur" style={{ border: '1px solid #E5E7EB' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>Schedule</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight capitalize" style={{ color: '#111827' }}>{FREQ_LABEL[urlData.check_frequency] ?? urlData.check_frequency}</p>
                    <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>{nextCheckAt(urlData)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Current state" value={status.label} hint={status.description} />
            <StatCard label="Mode" value={urlData.mode === 'archive' ? 'Archive' : 'Watch'} hint={urlData.mode === 'archive' ? 'Screenshot history only' : 'AI-backed visual change alerts'} />
            <StatCard label="Last check" value={timeAgo(urlData.last_checked_at)} hint="Most recent successful screenshot run" />
            <StatCard label="Next run" value={nextCheckAt(urlData)} hint="Estimated from the current schedule" />
          </section>

          <UrlDetailClient
            openAlert={openAlert}
            snapshots={enrichedSnapshots}
            alertBySnapshotId={alertBySnapshotId}
            pageUrl={urlData.url}
          />

          <UrlDetailSettings
            url={urlData}
            latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null}
          />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <MonitoringSetupCard url={urlData} />

          <div className="dash-card p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: '#9CA3AF' }}>Operational summary</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>Latest active diff</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: '#6B7280' }}>Useful for triaging whether the page changed materially or only cosmetically.</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={status.pillStyle}
                >
                  {latestDiff}
                </span>
              </div>

              <div className="h-px" style={{ background: '#F3F4F6' }} />

              <div>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>What this page gives you</p>
                <ul className="mt-2 space-y-2 text-sm leading-6" style={{ color: '#6B7280' }}>
                  <li>Fast triage when a page changes</li>
                  <li>Historical screenshots for every run</li>
                  <li>Editable monitoring rules without leaving context</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
