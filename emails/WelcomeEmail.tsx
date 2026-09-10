import * as React from 'react'
import { colors, EmailShell, Heading, Paragraph, PrimaryButton } from './components'
import { renderEmailToHtml, normalizePlainText, type RenderedEmail } from './render'

const h = React.createElement

/**
 * Not wired to a send site yet — no task in `trigger/` or server action in
 * `lib/actions/` currently triggers a welcome email, and the natural call
 * site (`lib/actions/onboarding.ts` or `auth-actions.ts`) is outside the
 * files this task owns. Built so the moment that gets wired up, the
 * template, plain-text alternative, and unsubscribe link already exist and
 * match the rest of the fleet.
 */
export interface WelcomeEmailProps {
  recipientName: string | null
  appUrl: string
  manageUrl: string
}

export function WelcomeEmailBody(props: WelcomeEmailProps): React.ReactElement {
  const { recipientName, appUrl, manageUrl } = props

  return h(
    EmailShell,
    {
      title: 'Welcome to PageWatch',
      preheader: 'Your first monitor is on its way — here is what happens next.',
      eyebrow: 'Welcome',
      appUrl,
      manageUrl,
    },
    h(Heading, null, `Welcome to PageWatch, ${recipientName ?? 'there'}`),
    h(
      Paragraph,
      null,
      `PageWatch checks your pages on the schedule you set, compares screenshots pixel by pixel, and alerts you the instant something changes.`
    ),
    h(
      Paragraph,
      { muted: true },
      `Add a URL from your dashboard to get your first baseline screenshot — every check after that is compared against it.`
    ),
    h(PrimaryButton, { href: `${appUrl}/dashboard/urls` }, 'Add your first monitor →')
  )
}

export function welcomeEmailText(props: WelcomeEmailProps): string {
  const { recipientName, appUrl, manageUrl } = props
  return normalizePlainText(
    [
      `Welcome to PageWatch, ${recipientName ?? 'there'}`,
      ``,
      `PageWatch checks your pages on the schedule you set, compares screenshots pixel by pixel, and alerts you the instant something changes.`,
      `Add a URL from your dashboard to get your first baseline screenshot — every check after that is compared against it.`,
      ``,
      `Add your first monitor: ${appUrl}/dashboard/urls`,
      `Manage notification settings: ${manageUrl}`,
    ].join('\n')
  )
}

export function renderWelcomeEmail(props: WelcomeEmailProps): RenderedEmail {
  return {
    html: renderEmailToHtml(WelcomeEmailBody(props)),
    text: welcomeEmailText(props),
  }
}
