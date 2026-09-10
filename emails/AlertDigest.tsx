import * as React from 'react'
import {
  colors,
  EmailShell,
  Heading,
  Paragraph,
  PrimaryButton,
  SeverityBadge,
  MonoLabel,
} from './components'
import { renderEmailToHtml, normalizePlainText, type RenderedEmail } from './render'

const h = React.createElement

export interface DigestAlertItem {
  id: string
  title: string
  summary: string
  severity: string
  diffPct: number | null
  pageLabel: string
}

export interface AlertDigestProps {
  recipientName: string | null
  domain: string
  /** Already capped to what should actually render (send-alert-digest.ts caps at 10). */
  alerts: DigestAlertItem[]
  /** Total open alerts for the period, which may exceed `alerts.length`. */
  totalCount: number
  criticalCount: number
  highCount: number
  appUrl: string
  manageUrl: string
}

function alertsUrl(appUrl: string): string {
  return `${appUrl}/dashboard/alerts`
}

export function AlertDigestEmail(props: AlertDigestProps): React.ReactElement {
  const { recipientName, domain, alerts, totalCount, criticalCount, appUrl, manageUrl } = props
  const hiddenCount = totalCount - alerts.length

  return h(
    EmailShell,
    {
      title: 'PageWatch — Visual Change Digest',
      preheader: `${totalCount} page change alert${totalCount === 1 ? '' : 's'} in the last 24 hours${domain ? ` for ${domain}` : ''}.`,
      eyebrow: 'Visual Change Digest',
      appUrl,
      manageUrl,
    },
    h(Paragraph, null, `Hi ${recipientName ?? 'there'},`),
    h(
      Paragraph,
      null,
      `You have `,
      h('strong', null, `${totalCount} page change alert${totalCount === 1 ? '' : 's'}`),
      ` in the last 24 hours`,
      criticalCount > 0
        ? [' — including ', h('strong', { key: 'c', style: { color: colors.critical } }, `${criticalCount} critical`), '.']
        : '.'
    ),
    h(
      'table',
      {
        role: 'presentation',
        width: '100%',
        cellPadding: 0,
        cellSpacing: 0,
        style: { border: `1px solid ${colors.border}`, borderRadius: '6px', borderCollapse: 'separate', overflow: 'hidden' },
      },
      h(
        'tbody',
        null,
        h(
          'tr',
          null,
          h(
            'td',
            { style: { padding: '10px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: colors.textMuted, backgroundColor: colors.bgSubtle } },
            'Change'
          ),
          h(
            'td',
            { width: 110, style: { padding: '10px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: colors.textMuted, backgroundColor: colors.bgSubtle, textAlign: 'center' } },
            'Severity'
          )
        ),
        ...alerts.map((alert) =>
          h(
            'tr',
            { key: alert.id },
            h(
              'td',
              { style: { padding: '12px 16px', borderTop: `1px solid ${colors.border}`, verticalAlign: 'top' } },
              h('div', { style: { fontWeight: 600, color: colors.text, fontSize: '14px' } }, alert.title),
              h('div', { style: { color: colors.textMuted, fontSize: '13px', marginTop: '2px' } }, alert.summary),
              alert.pageLabel ? h(MonoLabel, null, alert.pageLabel) : null
            ),
            h(
              'td',
              { style: { padding: '12px 16px', borderTop: `1px solid ${colors.border}`, textAlign: 'center', verticalAlign: 'top', whiteSpace: 'nowrap' } },
              h(SeverityBadge, { severity: alert.severity }),
              alert.diffPct !== null
                ? h('div', { style: { color: colors.textFaint, fontSize: '11px', marginTop: '4px' } }, `${alert.diffPct.toFixed(1)}% changed`)
                : null
            )
          )
        )
      )
    ),
    hiddenCount > 0
      ? h(Paragraph, { muted: true, style: { marginTop: '12px', fontSize: '13px' } }, `+${hiddenCount} more in your dashboard.`)
      : null,
    h(PrimaryButton, { href: alertsUrl(appUrl) }, 'View all alerts →')
  )
}

export function alertDigestText(props: AlertDigestProps): string {
  const { recipientName, domain, alerts, totalCount, criticalCount, appUrl, manageUrl } = props
  const lines = [
    `PageWatch — Visual Change Digest`,
    ``,
    `Hi ${recipientName ?? 'there'},`,
    ``,
    `You have ${totalCount} page change alert${totalCount === 1 ? '' : 's'} in the last 24 hours` +
      (criticalCount > 0 ? ` — including ${criticalCount} critical.` : '.') +
      (domain ? ` (monitoring ${domain})` : ''),
    ``,
    ...alerts.map(
      (a) =>
        `- [${a.severity.toUpperCase()}] ${a.title}${a.pageLabel ? ` (${a.pageLabel})` : ''} — ${a.summary}` +
        (a.diffPct !== null ? ` (${a.diffPct.toFixed(1)}% changed)` : '')
    ),
    ``,
    `View all alerts: ${appUrl}/dashboard/alerts`,
    ``,
    `Manage notification settings: ${manageUrl}`,
  ]
  return normalizePlainText(lines.join('\n'))
}

export function renderAlertDigestEmail(props: AlertDigestProps): RenderedEmail {
  return {
    html: renderEmailToHtml(AlertDigestEmail(props)),
    text: alertDigestText(props),
  }
}
