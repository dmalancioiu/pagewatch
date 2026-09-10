import * as React from 'react'
import { colors, EmailShell, Heading, Paragraph, PrimaryButton, SeverityBadge, MonoLabel } from './components'
import { renderEmailToHtml, normalizePlainText, type RenderedEmail } from './render'

const h = React.createElement

export interface InstantAlertProps {
  title: string
  /** Prefers `ai_summary`, falls back to `summary` — same precedence the old inline builder used. */
  summary: string
  severity: string
  pageLabel: string
  pageUrl: string
  diffPct: number | null
  monitoredUrlId: string
  appUrl: string
  manageUrl: string
}

export function InstantAlertEmail(props: InstantAlertProps): React.ReactElement {
  const { title, summary, severity, pageLabel, pageUrl, diffPct, monitoredUrlId, appUrl, manageUrl } = props
  const showUrl = pageUrl && pageUrl !== pageLabel

  return h(
    EmailShell,
    {
      title: 'PageWatch — Instant Alert',
      preheader: title,
      eyebrow: 'Instant Alert',
      appUrl,
      manageUrl,
    },
    h(SeverityBadge, { severity }),
    h('div', { style: { marginTop: '16px' } }, h(Heading, null, title)),
    pageLabel
      ? h(MonoLabel, null, showUrl ? `${pageLabel} · ${pageUrl}` : pageLabel)
      : null,
    h(Paragraph, { style: { marginTop: '16px' } }, summary),
    diffPct !== null ? h(Paragraph, { muted: true, style: { fontSize: '13px' } }, `${diffPct.toFixed(1)}% of the page changed`) : null,
    h(PrimaryButton, { href: `${appUrl}/dashboard/urls/${monitoredUrlId}` }, 'View change →'),
    h(
      Paragraph,
      { muted: true, style: { marginTop: '20px', fontSize: '12px' } },
      `Sent instantly because this alert is ${severity}.`
    )
  )
}

export function instantAlertText(props: InstantAlertProps): string {
  const { title, summary, severity, pageLabel, pageUrl, diffPct, monitoredUrlId, appUrl, manageUrl } = props
  const lines = [
    `PageWatch — Instant Alert`,
    ``,
    `[${severity.toUpperCase()}] ${title}`,
    pageLabel ? (pageUrl && pageUrl !== pageLabel ? `${pageLabel} — ${pageUrl}` : pageLabel) : '',
    ``,
    summary,
    diffPct !== null ? `${diffPct.toFixed(1)}% of the page changed` : '',
    ``,
    `View change: ${appUrl}/dashboard/urls/${monitoredUrlId}`,
    ``,
    `Sent instantly because this alert is ${severity}.`,
    `Manage notification settings: ${manageUrl}`,
  ]
  return normalizePlainText(lines.join('\n'))
}

export function renderInstantAlertEmail(props: InstantAlertProps): RenderedEmail {
  return {
    html: renderEmailToHtml(InstantAlertEmail(props)),
    text: instantAlertText(props),
  }
}
