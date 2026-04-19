import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import {
  ArrowLeft, Clock, AlertTriangle, CheckCircle2, ExternalLink,
} from 'lucide-react'
import { UrlDetailSettings } from './UrlDetailSettings'
import { UrlDetailClient } from './UrlDetailClient'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'

export const metadata = { title: 'URL Detail — PageWatch' }

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

  /* ── Sort raw data ── */
  const snapshots: any[] = (urlData.screenshot_snapshots ?? [])
    .sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())

  const alerts: any[] = (urlData.alerts ?? [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const openAlerts = alerts.filter((a: any) => a.status === 'open')

  /* ── Build snapshot lookup: id → raw snapshot ── */
  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  /* ── Collect all storage paths that need signed URLs ── */
  const allPaths: (string | null | undefined)[] = [
    ...snapshots.map((s: any) => s.storage_path),
    ...alerts.map((a: any)    => a.diff_storage_path),
  ]

  const signedUrlMap = await getSignedUrls(allPaths)

  /* ── Enrich alerts with URLs ── */
  const enrichedAlerts: AlertWithUrls[] = alerts.map((a: any) => {
    const prevSnap = snapshotById.get(a.previous_snapshot_id)
    const currSnap = snapshotById.get(a.current_snapshot_id)
    return {
      id:         a.id,
      diff_pct:   a.diff_pct,
      severity:   a.severity,
      status:     a.status,
      created_at: a.created_at,
      beforeUrl:  prevSnap ? (signedUrlMap.get(prevSnap.storage_path) ?? null) : null,
      afterUrl:   currSnap ? (signedUrlMap.get(currSnap.storage_path) ?? null) : null,
      diffUrl:    a.diff_storage_path ? (signedUrlMap.get(a.diff_storage_path) ?? null) : null,
    }
  })

  /* ── Build snapshot → alert map (for row enrichment) ── */
  const alertBySnapshotId: Record<string, AlertWithUrls> = {}
  for (const a of enrichedAlerts) {
    // current_snapshot_id is the "after" snapshot — that's what rows are keyed by
    const rawAlert = alerts.find((ra: any) => ra.id === a.id)
    if (rawAlert?.current_snapshot_id) {
      alertBySnapshotId[rawAlert.current_snapshot_id] = a
    }
  }

  /* ── Enrich snapshots with signed URLs ── */
  const enrichedSnapshots: SnapshotWithUrl[] = snapshots.map((s: any) => ({
    id:              s.id,
    storage_path:    s.storage_path,
    taken_at:        s.taken_at,
    file_size_bytes: s.file_size_bytes,
    signedUrl:       signedUrlMap.get(s.storage_path) ?? null,
  }))

  const openAlert = enrichedAlerts.find(a => a.status === 'open') ?? null

  /* ── Counts ── */
  const totalChecks       = snapshots.length
  const openAlertsCount   = openAlerts.length
  const acknowledgedCount = alerts.filter((a: any) => a.status === 'acknowledged').length

  return (
    <div className="space-y-7 max-w-4xl">
      {/* Back */}
      <Link
        href="/dashboard/urls"
        className="inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'rgba(255,255,255,0.38)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All URLs
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: openAlertsCount > 0 ? '#ff4444' : urlData.last_checked_at ? '#00ff88' : 'rgba(255,255,255,0.2)',
                boxShadow:  openAlertsCount > 0 ? '0 0 6px rgba(255,68,68,0.5)' : '0 0 6px rgba(0,255,136,0.4)',
              }}
            />
            <h1 className="text-2xl font-bold text-white tracking-tight truncate">{urlData.name}</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={urlData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {urlData.url}
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/20">·</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {FREQ_LABEL[urlData.check_frequency] ?? urlData.check_frequency} checks
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ≥{urlData.threshold_pct}% threshold
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Last checked {timeAgo(urlData.last_checked_at)}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Next: {nextCheckAt(urlData)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { icon: <Clock className="w-3.5 h-3.5" />,         label: `${totalChecks} total checks`,       accent: false },
          { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: `${openAlertsCount} open alerts`,    accent: openAlertsCount > 0 },
          { icon: <CheckCircle2 className="w-3.5 h-3.5" />,  label: `${acknowledgedCount} acknowledged`, accent: false },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{
              background: s.accent ? 'rgba(255,68,68,0.08)' : 'rgba(255,255,255,0.04)',
              border:     s.accent ? '1px solid rgba(255,68,68,0.18)' : '1px solid rgba(255,255,255,0.06)',
              color:      s.accent ? '#ff8080' : 'rgba(255,255,255,0.5)',
            }}
          >
            {s.icon}
            {s.label}
          </div>
        ))}
      </div>

      {/* Interactive section (alert preview + screenshot history) */}
      <UrlDetailClient
        openAlert={openAlert}
        snapshots={enrichedSnapshots}
        alertBySnapshotId={alertBySnapshotId}
        pageUrl={urlData.url}
      />

      {/* Settings panel */}
      <UrlDetailSettings
        url={urlData}
        latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null}
      />
    </div>
  )
}
