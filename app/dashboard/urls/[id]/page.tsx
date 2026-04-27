import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Pause,
  Layers3,
  ExternalLink,
  Activity
} from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getMonitoredUrlById } from '@/lib/actions/websites'
import { getSignedUrls } from '@/lib/supabase/storage'
import { UrlDetailClient } from './UrlDetailClient'
import { UrlDetailSettings } from './UrlDetailSettings'
import type { AlertWithUrls, SnapshotWithUrl } from './UrlDetailClient'

export const metadata = { title: 'Monitor — PageWatch' }

// --- Utility Functions ---
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

function nextCheckAt(url: any): string {
  // Keeping existing robust date logic...
  const freq: string = url.check_frequency
  const last: string | null = url.last_checked_at
  const checkHour: number | null = url.check_hour ?? null

  if (!last) return 'Pending...'
  const now = new Date()
  const lastD = new Date(last)

  if (freq === 'hourly') {
    const next = new Date(lastD.getTime() + 60 * 60 * 1000)
    if (next <= now) return 'Imminent'
    return `~${Math.round((next.getTime() - now.getTime()) / 60000)}m`
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
    return next.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const ms = freq === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const next = new Date(lastD.getTime() + ms)
  if (next <= now) return 'Imminent'
  return `~${Math.round((next.getTime() - now.getTime()) / 3600000)}h`
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

  // Data processing...
  const snapshots: any[] = (urlData.screenshot_snapshots ?? []).sort((a: any, b: any) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
  const alerts: any[] = (urlData.alerts ?? []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const openAlerts = alerts.filter((a: any) => a.status === 'open')
  const snapshotById = new Map<string, any>()
  for (const s of snapshots) snapshotById.set(s.id, s)

  const allPaths: (string | null | undefined)[] = [...snapshots.map((s: any) => s.storage_path), ...alerts.map((a: any) => a.diff_storage_path)]
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

  // Status logic
  const isPaused = !urlData.is_active
  const isArchive = urlData.mode === 'archive'
  let StatusIcon = CheckCircle2
  let statusText = 'Healthy'

  if (isPaused) {
    StatusIcon = Pause
    statusText = 'Paused'
  } else if (openAlerts.length > 0) {
    StatusIcon = AlertTriangle
    statusText = `${openAlerts.length} Needs Review`
  } else if (isArchive) {
    StatusIcon = Layers3
    statusText = 'Archive Mode'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F5F5F7', display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Page Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(246,246,248,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52, gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <Link
            href="/dashboard/urls"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: 7,
              color: '#6E6E73', border: '0.5px solid rgba(0,0,0,0.1)', flexShrink: 0,
              textDecoration: 'none', background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
            }}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <h1 style={{
              fontSize: 14, fontWeight: 700, color: '#1D1D1F',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.02em',
            }}>
              {urlData.name}
            </h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700,
              flexShrink: 0, letterSpacing: '-0.01em',
              ...(isPaused
                ? { background: 'rgba(0,0,0,0.05)', color: '#6E6E73' }
                : openAlerts.length > 0
                  ? { background: 'rgba(255,59,48,0.1)', color: '#FF3B30' }
                  : isArchive
                    ? { background: 'rgba(22,163,74,0.1)', color: '#16A34A' }
                    : { background: 'rgba(48,209,88,0.1)', color: '#30D158' }
              )
            }}>
              <StatusIcon style={{ width: 10, height: 10 }} />
              {statusText}
            </span>
            <a
              href={urlData.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, color: '#AEAEB2', textDecoration: 'none',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 260, letterSpacing: '-0.01em',
              }}
            >
              <ExternalLink style={{ width: 10, height: 10, flexShrink: 0 }} />
              {urlData.url}
            </a>
          </div>
        </div>

        {/* Timing metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Last Check</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.02em' }}>{timeAgo(urlData.last_checked_at)}</span>
          </div>
          <div style={{ width: 0.5, height: 26, background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Next Run</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Activity style={{ width: 11, height: 11, color: '#16A34A' }} />
              {nextCheckAt(urlData)}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main style={{
        flex: 1, maxWidth: 1560, width: '100%', margin: '0 auto',
        padding: '20px 24px',
        display: 'grid', gridTemplateColumns: '1fr 356px',
        gap: 16, alignItems: 'start',
      }}>
        <div style={{ minWidth: 0 }}>
          <UrlDetailClient
            openAlert={openAlert}
            snapshots={enrichedSnapshots}
            alertBySnapshotId={alertBySnapshotId}
            pageUrl={urlData.url}
          />
        </div>

        <aside style={{ position: 'sticky', top: 68 }}>
          <UrlDetailSettings
            url={urlData}
            latestSnapshotUrl={enrichedSnapshots[0]?.signedUrl ?? null}
          />
        </aside>
      </main>
    </div>
  )
}