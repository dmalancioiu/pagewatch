/**
 * Shared building blocks for every template in `emails/`.
 *
 * Plain React components built with `React.createElement` (no JSX syntax —
 * see `render.ts`'s header comment for why), table-based layout, inline
 * styles only. See `render.ts` for the inline-styles-only exception this
 * directory operates under.
 *
 * Colors are literal hex, not the app's CSS custom properties — email
 * clients don't evaluate `var()` — mirroring the dark palette in
 * `docs/DESIGN_SYSTEM.md` §2 (PageWatch is dark-first; these are the exact
 * values from that palette's `.dark` column). If the design system's tokens
 * change, update the literals here to match.
 */
import * as React from 'react'

const h = React.createElement

export const colors = {
  bg: '#0B0C0E',
  bgSubtle: '#0F1113',
  panel: '#131518',
  panelRaised: '#191C21',
  border: '#23262C',
  borderStrong: '#31353D',
  text: '#E9EBEE',
  textMuted: '#9AA1AC',
  textFaint: '#6C7480',
  accent: '#7C6BF5',
  accentHover: '#8E80F7',
  accentFg: '#FFFFFF',
  diff: '#FF3D8A',
  critical: '#F2555A',
  criticalSubtle: '#3A2224',
  warn: '#F0A93B',
  warnSubtle: '#3A311F',
  ok: '#35C793',
  okSubtle: '#1B3129',
  info: '#48A9F8',
  infoSubtle: '#1E2C3A',
} as const

export type Severity = 'low' | 'medium' | 'high' | 'critical'

/**
 * Severity maps to colour exactly once (docs/DESIGN_SYSTEM.md §2's rule) —
 * this is that one place for the email surface, since templates here can't
 * import the app's shared `components/ui` severity helper (it's styled from
 * Tailwind + CSS tokens, neither of which survives an email client).
 */
export function severityColors(severity: Severity | string): { fg: string; bg: string } {
  switch (severity) {
    case 'critical':
      return { fg: colors.critical, bg: colors.criticalSubtle }
    case 'high':
      return { fg: colors.warn, bg: colors.warnSubtle }
    case 'medium':
      return { fg: colors.info, bg: colors.infoSubtle }
    default:
      return { fg: colors.textMuted, bg: colors.bgSubtle }
  }
}

export const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

/** Full HTML document shell: doctype-adjacent `<html>`/`<head>`/`<body>`, a centered 600px table, brand header, and a manage-notifications footer. Every template renders through this. */
export function EmailShell(props: {
  title: string
  preheader?: string
  appUrl: string
  manageUrl: string
  eyebrow?: string
  children?: React.ReactNode
}): React.ReactElement {
  const { title, preheader, appUrl, manageUrl, eyebrow, children } = props

  return h(
    'html',
    { lang: 'en' },
    h(
      'head',
      null,
      h('meta', { charSet: 'utf-8' }),
      h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
      h('title', null, title)
    ),
    h(
      'body',
      { style: { margin: 0, padding: 0, backgroundColor: colors.bg, fontFamily: FONT_STACK } },
      preheader
        ? h(
            'div',
            {
              style: {
                display: 'none',
                overflow: 'hidden',
                lineHeight: '1px',
                opacity: 0,
                maxHeight: 0,
                maxWidth: 0,
              },
            },
            preheader
          )
        : null,
      h(
        'table',
        { role: 'presentation', width: '100%', cellPadding: 0, cellSpacing: 0, style: { backgroundColor: colors.bg } },
        h(
          'tbody',
          null,
          h(
            'tr',
            null,
            h(
              'td',
              { align: 'center', style: { padding: '32px 16px' } },
              h(
                'table',
                {
                  role: 'presentation',
                  width: '600',
                  cellPadding: 0,
                  cellSpacing: 0,
                  style: {
                    width: '600px',
                    maxWidth: '600px',
                    backgroundColor: colors.panel,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `1px solid ${colors.border}`,
                  },
                },
                h(
                  'tbody',
                  null,
                  h(
                    'tr',
                    null,
                    h(
                      'td',
                      { style: { padding: '24px 32px', backgroundColor: colors.panelRaised, borderBottom: `1px solid ${colors.border}` } },
                      h(
                        'div',
                        { style: { color: colors.text, fontSize: '18px', fontWeight: 700 } },
                        'PageWatch'
                      ),
                      eyebrow
                        ? h(
                            'div',
                            { style: { color: colors.textMuted, fontSize: '13px', marginTop: '4px' } },
                            eyebrow
                          )
                        : null
                    )
                  ),
                  h('tr', null, h('td', { style: { padding: '32px' } }, children)),
                  h(
                    'tr',
                    null,
                    h(
                      'td',
                      { style: { padding: '16px 32px', borderTop: `1px solid ${colors.border}` } },
                      h(
                        'p',
                        { style: { color: colors.textFaint, fontSize: '12px', margin: 0, lineHeight: 1.6 } },
                        'PageWatch · ',
                        h(
                          'a',
                          { href: manageUrl, style: { color: colors.textFaint, textDecoration: 'underline' } },
                          'Manage notification settings'
                        ),
                        ' · ',
                        h(
                          'a',
                          { href: appUrl, style: { color: colors.textFaint, textDecoration: 'underline' } },
                          'Open dashboard'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
}

export function Heading(props: { children?: React.ReactNode }): React.ReactElement {
  return h(
    'h1',
    { style: { color: colors.text, fontSize: '19px', fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 } },
    props.children
  )
}

export function Paragraph(props: { children?: React.ReactNode; muted?: boolean; style?: React.CSSProperties }): React.ReactElement {
  return h(
    'p',
    {
      style: {
        color: props.muted ? colors.textMuted : colors.text,
        fontSize: '14px',
        lineHeight: 1.6,
        margin: '0 0 12px',
        ...props.style,
      },
    },
    props.children
  )
}

export function PrimaryButton(props: { href: string; children?: React.ReactNode }): React.ReactElement {
  return h(
    'table',
    { role: 'presentation', cellPadding: 0, cellSpacing: 0, style: { marginTop: '8px' } },
    h(
      'tbody',
      null,
      h(
        'tr',
        null,
        h(
          'td',
          { style: { borderRadius: '6px', backgroundColor: colors.accent } },
          h(
            'a',
            {
              href: props.href,
              style: {
                display: 'inline-block',
                padding: '11px 22px',
                fontSize: '14px',
                fontWeight: 600,
                color: colors.accentFg,
                textDecoration: 'none',
                borderRadius: '6px',
              },
            },
            props.children
          )
        )
      )
    )
  )
}

export function SeverityBadge(props: { severity: Severity | string }): React.ReactElement {
  const { fg, bg } = severityColors(props.severity)
  return h(
    'span',
    {
      style: {
        display: 'inline-block',
        backgroundColor: bg,
        color: fg,
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
      },
    },
    String(props.severity).toUpperCase()
  )
}

export function Divider(): React.ReactElement {
  return h('hr', { style: { border: 'none', borderTop: `1px solid ${colors.border}`, margin: '20px 0' } })
}

export function MonoLabel(props: { children?: React.ReactNode }): React.ReactElement {
  return h(
    'div',
    {
      style: {
        color: colors.textFaint,
        fontSize: '12px',
        fontFamily: "ui-monospace,SFMono-Regular,Consolas,monospace",
        marginTop: '4px',
      },
    },
    props.children
  )
}
