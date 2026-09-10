import * as React from 'react'
import { colors, EmailShell, Heading, Paragraph, PrimaryButton } from './components'
import { renderEmailToHtml, normalizePlainText, type RenderedEmail } from './render'

const h = React.createElement

export interface MonitorPausedProps {
  monitorLabel: string
  reason: string
  pauseThreshold: number
  appUrl: string
  manageUrl: string
}

export function MonitorPausedEmail(props: MonitorPausedProps): React.ReactElement {
  const { monitorLabel, reason, pauseThreshold, appUrl, manageUrl } = props

  return h(
    EmailShell,
    {
      title: 'PageWatch — Monitoring paused',
      preheader: `We've paused monitoring for ${monitorLabel} after ${pauseThreshold} consecutive failures.`,
      eyebrow: 'Monitor health',
      appUrl,
      manageUrl,
    },
    h(Heading, null, `We've paused monitoring for ${monitorLabel}`),
    h(
      Paragraph,
      null,
      `${pauseThreshold} checks in a row could not reach this page (most recently: `,
      h('strong', null, reason),
      `), so we stopped trying rather than keep spending your check quota on a target that isn't responding.`
    ),
    h(Paragraph, { muted: true }, `Fix the URL or the site, then resume monitoring from the dashboard whenever it's ready.`),
    h(PrimaryButton, { href: `${appUrl}/dashboard/urls` }, 'Open dashboard →')
  )
}

export function monitorPausedText(props: MonitorPausedProps): string {
  const { monitorLabel, reason, pauseThreshold, appUrl, manageUrl } = props
  return normalizePlainText(
    [
      `PageWatch — Monitoring paused`,
      ``,
      `We've paused monitoring for ${monitorLabel}`,
      ``,
      `${pauseThreshold} checks in a row could not reach this page (most recently: ${reason}), so we stopped trying rather than keep spending your check quota on a target that isn't responding.`,
      `Fix the URL or the site, then resume monitoring from the dashboard whenever it's ready.`,
      ``,
      `Open dashboard: ${appUrl}/dashboard/urls`,
      `Manage notification settings: ${manageUrl}`,
    ].join('\n')
  )
}

export function renderMonitorPausedEmail(props: MonitorPausedProps): RenderedEmail {
  return {
    html: renderEmailToHtml(MonitorPausedEmail(props)),
    text: monitorPausedText(props),
  }
}
