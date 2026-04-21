import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import {
  ArrowLeft, Clock, AlertTriangle, CheckCircle2, ExternalLink,
  Eye, Archive, Layers, AlignLeft, ScanSearch, Pause,
} from 'lucide-react'
import { UrlDetailSettings } from './UrlDetailSettings'
import { UrlDetailClient } from './UrlDetailClient'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'

export const metadata = { title: 'Monitor — PageWatch' }

/* ─── Helpers ─── */

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const FREQ_LABEL: Record<string, string> = {
  hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly',
}

function nextCheckAt(url: any): string {
  const freq: string        = url.check_frequency
  const last: string | null = url.last_checked_at
  const checkHour: number | null = url.check_hour ?? null

  if (!last) return 'Soon — first run pending'

  const now   = new Date()
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
    } else {
      if (next <= now) next.setUTCDate(next.getUTCDate() + 1)
    }
    return next.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
    })
  }

  const ms   = freq === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const next = new Date(lastD.getTime() + ms)
  if (next <= now) return freq === 'weekly' ? 'Next weekly run' : 'Next daily run'
  const hours = Math.round((next.getTime() - now.getTime()) / 3600000)
  return `In ~${hours}h`
}

/* ─── Monitoring setup card (read-only summary) ─── */

function MonitoringSetupCard({ url }: { url: any }) {
  const isArchive   = url.mode === 'archive'
  const isFullPage  = url.full_page !== false
  const zones: any[] = Array.isArray(url.zones) ? url.zones : []
  const hasZones    = zones.length > 0
  const description = url.watch_description?.trim() || null
  const checkHour   = url.check_hour ?? null

  let scheduleLabel = FREQ_LABEL[url.check_frequency] ?? url.check_frequency
  if ((url.check_frequency === 'daily' || url.check_frequency === 'weekly') && checkHour != null) {
    const h = checkHour
    const ampm = h < 12 ? 'AM' : 'PM'
    const label = h === 0 ? '12' : h <= 12 ? String(h) : String(h - 12)
    scheduleLabel += ` at ${label}:00 ${ampm} UTC`
  }

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: isArchive
        ? <Archive className="w-3.5 h-3.5" />
        : <Eye className="w-3.5 h-3.5" />,
      label: 'Mode',
      value: isArchive ? 'Archive only — screenshots saved, no alerts' : 'Watch for changes',
    },
    {
      icon: <Layers className="w-3.5 h-3.5" />,
      label: 'Capture',
      value: isFullPage ? 'Full page (entire scrollable content)' : 'Visible area (above the fold only)',
    },
    {
      icon: <ScanSearch className="w-3.5 h-3.5" />,
      label: 'Focus zones',
      value: hasZones
        ? `${zones.length} zone${zones.length !== 1 ? 's' : ''} defined — changes elsewhere are ignored`
        : 'Full page — all visual changes are compared',
    },
    ...(description && !isArchive ? [{
      icon: <AlignLeft className="w-3.5 h-3.5" />,
      label: 'Alert focus',
      value: description,
    }] : []),
    {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Schedule',
      value: scheduleLabel,
    },
  ]

  return (
    <div className="dash-card overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid #F3F4F6', background: '#F8FAFC' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: '#374151' }}>Monitoring setup</h2>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-md"
          style={{ background: isArchive ? '#F3F4F6' : 'rgba(22,163,74,0.08)', color: isArchive ? '#6B7280' : '#15803D', border: isArchive ? '1px solid #E5E7EB' : '1px solid rgba(22,163,74,0.2)' }}
        >
          {isArchive ? 'Archive' : 'Watch'}
        </span>
      </div>

      <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-4 px-5 py-3">
            <div className="flex-shrink-0 mt-0.5" style={{ color: '#9CA3AF' }}>
              {row.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium mb-0.5" style={{ color: '#9CA3AF' }}>{row.label}</p>
              <p className="text-sm" style={{ color: '#374151' }}>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Page ─── */

export default async function UrlDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  const snapshots: any[] = (urlData.screenshot_snapshots ?? [])
    .sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())

  const alerts: any[] = (urlData.alerts ?? [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const openAlerts = alerts.filter((a: any) => a.status === 'open')

  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  const allPaths: (string | null | undefined)[] = [
    ...snapshots.map((s: any) => s.storage_path),
    ...alerts.map((a: any)    => a.diff_storage_path),
  ]

  const signedUrlMap = await getSignedUrls(allPaths)

  const enrichedAlerts: AlertWithUrls[] = alerts.map((a: any) => {
    const prevSnap = snapshotById.get(a.previous_snapshot_id)
    const currSnap = snapshotById.get(a.current_snapshot_id)
    return {
      id:         a.id,
      diff_pct:   a.diff_pct,
      severity:   a.severity,
      status:     a.status,
      created_at: a.created_at,
      ai_summary: a.ai_summary,
      beforeUrl:  prevSnap ? (signedUrlMap.get(prevSnap.storage_path) ?? null) : null,
      afterUrl:   currSnap ? (signedUrlMap.get(currSnap.storage_path) ?? null) : null,
      diffUrl:    a.diff_storage_path ? (signedUrlMap.get(a.diff_storage_path) ?? null) : null,
    }
  })

  const alertBySnapshotId: Record<string, AlertWithUrls> = {}
  for (const a of enrichedAlerts) {
    const rawAlert = alerts.find((ra: any) => ra.id === a.id)
    if (rawAlert?.current_snapshot_id) {
      alertBySnapshotId[rawAlert.current_snapshot_id] = a
    }
  }

  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((s: any) => ({
    id:              s.id,
    storage_path:    s.storage_path,
    taken_at:        s.taken_at,
    file_size_bytes: s.file_size_bytes,
    signedUrl:       signedUrlMap.get(s.storage_path) ?? null,
  }))

  const openAlert       = enrichedAlerts.find(a => a.status === 'open') ?? null
  const totalChecks     = snapshots.length
  const openAlertsCount = openAlerts.length
  const isPaused        = !urlData.is_active

  let hostname = urlData.url
  try { hostname = new URL(urlData.url).hostname } catch {}

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/dashboard/urls"
        className="inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: '#9CA3AF' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Monitors
      </Link>

      {/* Header card */}
      <div className="dash-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Status + name */}
            <div className="flex items-center gap-2.5 mb-1.5">
              {isPaused ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                  <Pause className="w-3 h-3" /> Paused
                </span>
              ) : openAlertsCount > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(185,28,28,0.08)', color: '#B91C1C', border: '1px solid rgba(185,28,28,0.2)' }}>
                  <AlertTriangle className="w-3 h-3" />
                  {openAlertsCount} open alert{openAlertsCount !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(22,163,74,0.08)', color: '#15803D', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
            </div>

            <h1 className="text-xl font-semibold tracking-tight mb-2" style={{ color: '#111827' }}>
              {urlData.name}
            </h1>

            <a
              href={urlData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-mono transition-colors"
              style={{ color: '#9CA3AF' }}
            >
              {urlData.url}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Meta row */}
        <div
          className="flex items-center gap-4 flex-wrap mt-4 pt-4"
          style={{ borderTop: '1px solid #F3F4F6' }}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: '#D1D5DB' }} />
            <span className="text-xs" style={{ color: '#6B7280' }}>
              Last checked {timeAgo(urlData.last_checked_at)}
            </span>
          </div>
          <span style={{ color: '#E5E7EB' }}>·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: '#6B7280' }}>
              Next: {nextCheckAt(urlData)}
            </span>
          </div>
          <span style={{ color: '#E5E7EB' }}>·</span>
          <span className="text-xs" style={{ color: '#6B7280' }}>
            {totalChecks} screenshot{totalChecks !== 1 ? 's' : ''} taken
          </span>
        </div>
      </div>

      {/* Monitoring setup — at a glance */}
      <MonitoringSetupCard url={urlData} />

      {/* Interactive section (alert preview + screenshot history) */}
      <UrlDetailClient
        openAlert={openAlert}
        snapshots={enrichedSnapshots}
        alertBySnapshotId={alertBySnapshotId}
        pageUrl={urlData.url}
      />

      {/* Settings (edit + danger) */}
      <UrlDetailSettings
        url={urlData}
        latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null}
      />
    </div>
  )
}
