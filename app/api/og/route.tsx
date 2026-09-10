import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/**
 * Dynamic Open Graph image for every marketing route. Takes a title and an
 * optional eyebrow via query params (`?title=...&eyebrow=...`) — see
 * `lib/marketing/seo.ts#ogImageUrl`, which every page's metadata builds this
 * URL through rather than linking here directly.
 *
 * Edge-safe on purpose: no filesystem reads, no external fetches, no custom
 * font loading. Satori (which `ImageResponse` renders through) doesn't
 * resolve CSS custom properties, so the colours below are the literal dark-
 * theme hex values from docs/DESIGN_SYSTEM.md §2 rather than Tailwind
 * classes or `var(--token)` — that's the one place in this codebase raw hex
 * is correct, because this file never goes through the app's CSS/theme
 * pipeline at all; it's a standalone image renderer.
 */

const COLORS = {
  bg: '#0B0C0E',
  panel: '#131518',
  border: '#23262C',
  text: '#E9EBEE',
  textMuted: '#9AA1AC',
  textFaint: '#6C7480',
  accent: '#7C6BF5',
  accentSubtleBg: 'rgba(124, 107, 245, 0.14)',
  diff: '#FF3D8A',
}

function clamp(value: string | null, max: number, fallback: string): string {
  if (!value) return fallback
  const trimmed = value.trim()
  if (!trimmed) return fallback
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = clamp(searchParams.get('title'), 120, 'PageWatch')
  const eyebrow = clamp(searchParams.get('eyebrow'), 60, '')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: COLORS.bg,
          padding: '64px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: COLORS.accent,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                border: `2.5px solid ${COLORS.bg}`,
              }}
            />
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, color: COLORS.text }}>
            PageWatch
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {eyebrow && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                alignItems: 'center',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.accent,
                backgroundColor: COLORS.accentSubtleBg,
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? 44 : 56,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: COLORS.text,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 20, color: COLORS.textMuted }}>
            Visual change intelligence
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 28, height: 6, borderRadius: 999, backgroundColor: COLORS.diff }} />
            <div
              style={{ width: 28, height: 6, borderRadius: 999, backgroundColor: COLORS.textFaint }}
            />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
