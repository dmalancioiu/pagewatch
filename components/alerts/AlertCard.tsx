'use client'

import { useState } from 'react'
import type { Alert } from '@/lib/types/database.types'
import {
  getSeverityDotColor,
  getSeverityClasses,
  getAlertTypeLabel,
  formatTechnicalDiffPct,
  getDiffPctColor,
} from '@/lib/utils/alerts'
import { acknowledgeAlert, dismissAlert } from '@/lib/actions/alerts'
import { X } from 'lucide-react'

export function AlertCard({ alert }: { alert: Alert }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState(alert.status)

  if (status === 'dismissed') return null

  const dotColor   = getSeverityDotColor(alert.severity)
  const badgeClass = getSeverityClasses(alert.severity)
  const typeLabel  = getAlertTypeLabel(alert.alert_type)
  const diffColor  = getDiffPctColor(alert.diff_pct)

  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((new Date(alert.triggered_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day',
  )

  const pageUrl  = (alert as any).monitored_urls?.url  ?? null
  const pageName = (alert as any).monitored_urls?.name ?? null
  const technicalDiff = formatTechnicalDiffPct(alert.diff_pct)

  async function handleAcknowledge() {
    setLoading(true)
    await acknowledgeAlert(alert.id)
    setStatus('acknowledged')
    setLoading(false)
  }

  async function handleDismiss() {
    setLoading(true)
    await dismissAlert(alert.id)
    setStatus('dismissed')
    setLoading(false)
  }

  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.025] hover:border-white/10 transition-all p-5">
      <div className="flex items-start justify-between gap-4">

        {/* Left */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`} />

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className="text-[11px] text-white/35 font-medium bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                {typeLabel}
              </span>
              {status === 'acknowledged' && (
                <span className="text-[11px] text-white/25 font-medium">Acknowledged</span>
              )}
            </div>

            {/* Title + summary */}
            <h3 className="font-semibold text-white/90 text-sm leading-snug">{alert.title}</h3>
            <p className="text-white/45 text-sm mt-1 leading-relaxed">{alert.summary}</p>

            {/* Technical diff, kept as secondary evidence rather than the alert reason */}
            {alert.diff_pct !== null && (
              <p className={`text-xs mt-2 ${diffColor}`} title={technicalDiff}>
                Evidence available · View before/after
              </p>
            )}

            {/* Page URL */}
            {pageUrl && (
              <p className="text-xs text-white/25 mt-1.5 truncate font-mono">
                {pageName && pageName !== pageUrl
                  ? <><span className="text-white/40">{pageName}</span> · {pageUrl}</>
                  : pageUrl
                }
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className="text-xs text-white/25">{timeAgo}</span>
          {status === 'open' && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleAcknowledge}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white border border-white/[0.06] disabled:opacity-50 transition-colors"
              >
                Acknowledge
              </button>
              <button
                onClick={handleDismiss}
                disabled={loading}
                className="text-xs px-2 py-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] border border-white/[0.04] disabled:opacity-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
