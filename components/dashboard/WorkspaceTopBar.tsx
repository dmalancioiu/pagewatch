'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ExternalLink, Activity, Pause, Play,
  Clock, Calendar,
} from 'lucide-react'
import { triggerManualRun } from '@/lib/actions/run-now'
import { pauseMonitoredUrl } from '@/lib/actions/websites'
import { StatusBadge } from './StatusBadge'

type StatusVariant = 'healthy' | 'paused' | 'alert' | 'archive'

interface WorkspaceTopBarProps {
  name: string
  url: string
  statusVariant: StatusVariant
  lastChecked: string
  nextRun: string
  urlId: string
  isPaused: boolean
}

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

export function WorkspaceTopBar({
  name,
  url,
  statusVariant,
  lastChecked,
  nextRun,
  urlId,
  isPaused,
}: WorkspaceTopBarProps) {
  const router = useRouter()
  const [runPending, startRun] = useTransition()
  const [pausePending, startPause] = useTransition()

  function handleRunNow() {
    startRun(async () => {
      await triggerManualRun({ id: urlId })
      router.refresh()
    })
  }

  function handlePauseToggle() {
    startPause(async () => {
      await pauseMonitoredUrl({ id: urlId, paused: !isPaused })
      router.refresh()
    })
  }

  return (
    <div
      style={{
        height: 52,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
      }}
    >
      {/* Back */}
      <Link
        href="/dashboard/urls"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: 6,
          border: '1px solid #E5E7EB', background: 'white',
          color: '#6B7280', flexShrink: 0,
          textDecoration: 'none',
          transition: 'background 0.1s, border-color 0.1s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#F9FAFB'
          e.currentTarget.style.borderColor = '#D1D5DB'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'white'
          e.currentTarget.style.borderColor = '#E5E7EB'
        }}
        title="Back to monitors"
      >
        <ArrowLeft size={12} />
      </Link>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: '#E5E7EB', flexShrink: 0 }} />

      {/* Name + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{
          fontSize: 13, fontWeight: 700, color: '#111827',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: 220,
        }}>
          {name}
        </span>
        <StatusBadge variant={statusVariant} />
      </div>

      {/* URL link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 10, color: '#9CA3AF', fontFamily: 'ui-monospace,monospace',
          textDecoration: 'none', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#6B7280')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
      >
        {getDomain(url)}
        <ExternalLink size={9} style={{ flexShrink: 0 }} />
      </a>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Last checked + next run */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 12px', borderLeft: '1px solid #E5E7EB',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={10} style={{ color: '#9CA3AF' }} />
          <div>
            <p style={{ fontSize: 9, color: '#9CA3AF', lineHeight: 1, marginBottom: 1 }}>Last check</p>
            <p style={{ fontSize: 11, color: '#374151', fontWeight: 600, lineHeight: 1 }}>{lastChecked}</p>
          </div>
        </div>
        <div style={{ width: 1, height: 20, background: '#E5E7EB' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={10} style={{ color: '#9CA3AF' }} />
          <div>
            <p style={{ fontSize: 9, color: '#9CA3AF', lineHeight: 1, marginBottom: 1 }}>Next run</p>
            <p style={{ fontSize: 11, color: '#374151', fontWeight: 600, lineHeight: 1 }}>{nextRun}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <button
          className="btn-dash-ghost"
          onClick={handleRunNow}
          disabled={isPaused || runPending}
          title="Run check now"
        >
          <Activity size={11} style={{ color: runPending ? '#9CA3AF' : '#2563EB' }} />
          {runPending ? 'Running…' : 'Run Now'}
        </button>

        <button
          className="btn-dash-ghost"
          onClick={handlePauseToggle}
          disabled={pausePending}
          title={isPaused ? 'Resume monitoring' : 'Pause monitoring'}
        >
          {isPaused
            ? <Play size={11} style={{ color: '#16A34A' }} />
            : <Pause size={11} style={{ color: '#6B7280' }} />
          }
          {pausePending ? '…' : isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  )
}
