import * as React from 'react'
import { colors, EmailShell, Heading, Paragraph, PrimaryButton } from './components'
import { renderEmailToHtml, normalizePlainText, type RenderedEmail } from './render'

const h = React.createElement

export interface MonitorFailingProps {
  monitorLabel: string
  reason: string
  failureThreshold: number
  pauseThreshold: number
  appUrl: string
  manageUrl: string
}

export function MonitorFailingEmail(props: MonitorFailingProps): React.ReactElement {
  const { monitorLabel, reason, failureThreshold, pauseThreshold, appUrl, manageUrl } = props

  return h(
    EmailShell,
    {
      title: 'PageWatch — Can’t reach a monitor',
      preheader: `We can't reach ${monitorLabel}. The last ${failureThreshold} checks in a row have failed.`,
      eyebrow: 'Monitor health',
      appUrl,
      manageUrl,
    },
    h(Heading, null, `We can't reach ${monitorLabel}`),
    h(
      Paragraph,
      null,
      `The last `,
      h('strong', null, `${failureThreshold} checks in a row`),
      ` have failed. Most recent reason: `,
      h('strong', null, reason),
      `.`
    ),
    h(
      Paragraph,
      { muted: true },
      `We'll keep retrying automatically. If this doesn't clear up, we'll pause monitoring after ${pauseThreshold} consecutive failures so it stops using your check quota.`
    ),
    h(PrimaryButton, { href: `${appUrl}/dashboard/urls` }, 'Open dashboard →')
  )
}

export function monitorFailingText(props: MonitorFailingProps): string {
  const { monitorLabel, reason, failureThreshold, pauseThreshold, appUrl, manageUrl } = props
  return normalizePlainText(
    [
      `PageWatch — Monitor health`,
      ``,
      `We can't reach ${monitorLabel}`,
      ``,
      `The last ${failureThreshold} checks in a row have failed. Most recent reason: ${reason}.`,
      `We'll keep retrying automatically. If this doesn't clear up, we'll pause monitoring after ${pauseThreshold} consecutive failures so it stops using your check quota.`,
      ``,
      `Open dashboard: ${appUrl}/dashboard/urls`,
      `Manage notification settings: ${manageUrl}`,
    ].join('\n')
  )
}

export function renderMonitorFailingEmail(props: MonitorFailingProps): RenderedEmail {
  return {
    html: renderEmailToHtml(MonitorFailingEmail(props)),
    text: monitorFailingText(props),
  }
}
