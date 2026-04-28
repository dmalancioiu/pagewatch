import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  Layers3,
  Monitor,
  MousePointer2,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const metadata = {
  title: 'PageWatch | Visual Website Monitoring with Focus Zones',
  description:
    'Monitor public webpages with scheduled screenshots, focus zones, visual diffs, and AI summaries. Track pricing pages, checkout flows, competitor pages, and critical website changes without manual checking.',
  keywords: [
    'visual website monitoring',
    'website change detection',
    'page change detection',
    'website monitoring tool',
    'visual regression monitoring',
    'screenshot monitoring',
    'competitor price monitoring',
    'webpage monitoring',
    'visual diff tool',
    'AI website monitoring',
  ],
  openGraph: {
    title: 'PageWatch | Visual Website Monitoring with Focus Zones',
    description:
      'Select the parts of a webpage that matter. PageWatch watches those zones and alerts you when meaningful visual changes happen.',
    type: 'website',
  },
}

const BG = '#F7F9FC'
const BG_SOFT = '#FBFCFF'
const SURFACE = '#FFFFFF'
const SURFACE_SOFT = '#F8FAFC'
const INK = '#0F172A'
const MUTED = '#64748B'
const FAINT = '#94A3B8'
const BORDER = '#E2E8F0'
const BLUE = '#2563EB'
const BLUE_2 = '#3B82F6'
const BLUE_SOFT = 'rgba(37,99,235,0.08)'
const BLUE_MID = 'rgba(37,99,235,0.18)'
const RED = '#DC2626'
const RED_SOFT = 'rgba(220,38,38,0.08)'
const GREEN = '#16A34A'
const GREEN_SOFT = 'rgba(22,163,74,0.08)'
const AMBER = '#D97706'
const AMBER_SOFT = 'rgba(217,119,6,0.08)'
const PURPLE = '#7C3AED'
const PURPLE_SOFT = 'rgba(124,58,237,0.08)'
const SHADOW = '0 18px 48px rgba(15,23,42,0.06)'
const SHADOW_LG = '0 34px 90px rgba(15,23,42,0.12)'

const useCases = [
  {
    label: 'Revenue',
    title: 'Pricing and checkout pages',
    body: 'Watch plan cards, checkout CTAs, form states, payment copy, and launch pages before silent changes cost conversions.',
    color: RED,
    bg: RED_SOFT,
  },
  {
    label: 'Agencies',
    title: 'Client website monitoring',
    body: 'Keep a visual audit trail across client pages and know exactly what changed before the client asks.',
    color: BLUE,
    bg: BLUE_SOFT,
  },
  {
    label: 'Intel',
    title: 'Competitor page tracking',
    body: 'Track public pricing, positioning, offers, and launch pages without refreshing competitor sites manually.',
    color: PURPLE,
    bg: PURPLE_SOFT,
  },
  {
    label: 'Ops',
    title: 'Public page archives',
    body: 'Create scheduled screenshot history for compliance, legal review, internal approvals, and public evidence.',
    color: AMBER,
    bg: AMBER_SOFT,
  },
]

const workflow = [
  {
    step: '01',
    title: 'Capture',
    body: 'Add a public URL and capture a clean baseline screenshot.',
    icon: ScanLine,
  },
  {
    step: '02',
    title: 'Focus',
    body: 'Draw zones around the exact page areas that matter.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Instruct',
    body: 'Tell PageWatch what should count as important inside each zone.',
    icon: Sparkles,
  },
  {
    step: '04',
    title: 'Review',
    body: 'Open the diff, read the summary, resolve the alert, keep history clean.',
    icon: Eye,
  },
]

const featureRows = [
  {
    title: 'Zone-first monitoring',
    body: 'Whole-page screenshots are useful, but whole-page alerts are noisy. PageWatch lets you watch the exact regions that matter.',
    icon: Target,
  },
  {
    title: 'Instructions per zone',
    body: 'A pricing card, CTA, and stock status should not use the same rules. Each zone gets its own watch instruction.',
    icon: Sparkles,
  },
  {
    title: 'History that explains itself',
    body: 'Every check becomes a clean capture in history. Important changes become alerts with visual diffs and AI summaries.',
    icon: Activity,
  },
]

const faqs = [
  {
    q: 'What is visual website monitoring?',
    a: 'Visual website monitoring checks how a webpage actually looks over time using screenshots and visual comparison, not only uptime checks or HTML changes.',
  },
  {
    q: 'Can PageWatch monitor only part of a page?',
    a: 'Yes. PageWatch is built around focus zones, so you can watch pricing cards, CTAs, forms, tables, status blocks, or any specific region of a public page.',
  },
  {
    q: 'What are watch instructions?',
    a: 'Watch instructions tell PageWatch what matters inside a zone. For example: alert only if the price changes, if the CTA disappears, or if a status changes.',
  },
  {
    q: 'Can I monitor competitor pages?',
    a: 'Yes, as long as the page is public. PageWatch is useful for tracking competitor pricing, positioning, launch pages, product pages, and offer changes.',
  },
  {
    q: 'Do I need to install code?',
    a: 'No. Add a public URL, capture a baseline screenshot, choose your zones, and PageWatch handles scheduled checks.',
  },
]

function GlobalStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-card {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes float-soft {
            0%, 100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(0,-7px,0); }
          }

          @keyframes scan-zone {
            0% { transform: translateY(-90%); opacity: 0; }
            18% { opacity: 1; }
            82% { opacity: 1; }
            100% { transform: translateY(145%); opacity: 0; }
          }

          @keyframes pulse-ring {
            0%, 100% { box-shadow: 0 0 0 4px rgba(37,99,235,0.10); }
            50% { box-shadow: 0 0 0 8px rgba(37,99,235,0.04); }
          }

          @keyframes draw-line {
            from { stroke-dashoffset: 520; }
            to { stroke-dashoffset: 0; }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
            }
          }

          .pw-landing-link:hover {
            color: ${INK} !important;
          }

          .pw-card-lift {
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          }

          .pw-card-lift:hover {
            transform: translateY(-3px);
            box-shadow: 0 22px 58px rgba(15,23,42,0.09) !important;
            border-color: rgba(37,99,235,0.22) !important;
          }

          .pw-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 20px 44px rgba(37,99,235,0.28) !important;
          }

          .pw-secondary:hover {
            transform: translateY(-1px);
            background: white !important;
          }

          .pw-details summary::-webkit-details-marker {
            display: none;
          }
        `,
      }}
    />
  )
}

function DotBackdrop() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.105) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        maskImage: 'linear-gradient(180deg, black 0%, rgba(0,0,0,0.32) 58%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(180deg, black 0%, rgba(0,0,0,0.32) 58%, transparent 100%)',
      }}
    />
  )
}

function Badge({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'red' | 'green' }) {
  const color = tone === 'red' ? RED : tone === 'green' ? GREEN : BLUE
  const bg = tone === 'red' ? RED_SOFT : tone === 'green' ? GREEN_SOFT : BLUE_SOFT

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 999,
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 0 4px ${bg}`,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 850,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color,
        }}
      >
        {children}
      </span>
    </div>
  )
}

function SectionHeading({
  label,
  title,
  body,
  center = false,
}: {
  label: string
  title: string
  body?: string
  center?: boolean
}) {
  return (
    <div
      data-animate
      style={{
        maxWidth: center ? 780 : 720,
        margin: center ? '0 auto' : 0,
        textAlign: center ? 'center' : 'left',
      }}
    >
      <Badge>{label}</Badge>
      <h2
        style={{
          margin: '18px 0 0',
          fontSize: 'clamp(2.15rem, 4.8vw, 4rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.065em',
          fontWeight: 950,
          color: INK,
        }}
      >
        {title}
      </h2>
      {body && (
        <p
          style={{
            margin: '18px 0 0',
            fontSize: 17,
            lineHeight: 1.75,
            color: MUTED,
          }}
        >
          {body}
        </p>
      )}
    </div>
  )
}

function Nav() {
  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: 'rgba(251,252,255,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link href="/light" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${BLUE_2}, ${BLUE})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(37,99,235,0.22)',
            }}
          >
            <Monitor size={16} color="white" />
          </div>
          <div>
            <div
              style={{
                color: INK,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              PageWatch
            </div>
            <div style={{ color: FAINT, fontSize: 10, marginTop: 3 }}>visual monitoring</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {[
            ['Product', '#product'],
            ['Workflow', '#workflow'],
            ['Use cases', '#use-cases'],
            ['Pricing', '#pricing'],
            ['FAQ', '#faq'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="pw-landing-link"
              style={{
                textDecoration: 'none',
                color: MUTED,
                fontSize: 13,
                fontWeight: 750,
                transition: 'color 150ms ease',
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/login"
            className="hidden sm:inline-flex"
            style={{
              textDecoration: 'none',
              color: MUTED,
              fontSize: 13,
              fontWeight: 750,
            }}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="pw-primary"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              color: 'white',
              background: BLUE,
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 850,
              boxShadow: '0 14px 30px rgba(37,99,235,0.24)',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
            }}
          >
            Start free <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

function MiniBrowser() {
  return (
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: SHADOW_LG,
      }}
    >
      <div
        style={{
          height: 44,
          background: SURFACE_SOFT,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
            <span
              key={color}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            margin: '0 auto',
            width: 238,
            height: 24,
            borderRadius: 8,
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: FAINT,
            fontSize: 11,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          acme.com/pricing
        </div>
      </div>

      <div style={{ padding: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 14,
            alignItems: 'flex-start',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 900,
                color: BLUE,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Monitor workspace
            </p>
            <div
              style={{
                width: 220,
                height: 18,
                borderRadius: 8,
                background: '#E2E8F0',
                marginTop: 9,
              }}
            />
          </div>
          <span
            style={{
              color: RED,
              background: RED_SOFT,
              border: '1px solid rgba(220,38,38,0.18)',
              borderRadius: 999,
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 850,
            }}
          >
            Alert
          </span>
        </div>

        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: SHADOW,
          }}
        >
          <div
            style={{
              padding: 14,
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  background: BLUE_SOFT,
                  color: BLUE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={16} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: INK }}>
                  Watched Zones
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: FAINT }}>
                  Hover to preview. Click to lock focus.
                </p>
              </div>
            </div>
            <button
              style={{
                border: 'none',
                color: 'white',
                background: BLUE,
                borderRadius: 10,
                padding: '8px 11px',
                fontSize: 11,
                fontWeight: 850,
              }}
            >
              Edit zones
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px' }}>
            <div style={{ padding: 14, display: 'grid', gap: 10 }}>
              {[
                ['Price card', BLUE, 'Alert if Pro pricing changes.', 'Locked'],
                ['Checkout CTA', GREEN, 'Watch for missing or changed CTA.', 'Clean'],
              ].map(([label, color, body, state], index) => (
                <div
                  key={label}
                  style={{
                    position: 'relative',
                    minHeight: 90,
                    padding: 13,
                    borderRadius: 15,
                    border: `1px solid ${index === 0 ? color : BORDER}`,
                    background:
                      index === 0
                        ? `linear-gradient(180deg, ${BLUE_SOFT}, #FFFFFF)`
                        : SURFACE,
                    boxShadow:
                      index === 0 ? '0 14px 32px rgba(37,99,235,0.12)' : 'none',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 14,
                      bottom: 14,
                      width: 3,
                      borderRadius: 99,
                      background: color,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 10,
                      paddingLeft: 8,
                    }}
                  >
                    <p style={{ margin: 0, color: INK, fontSize: 13, fontWeight: 900 }}>
                      {label}
                    </p>
                    <span
                      style={{
                        color: index === 0 ? BLUE : GREEN,
                        background: index === 0 ? BLUE_SOFT : GREEN_SOFT,
                        border: `1px solid ${index === 0 ? BLUE_MID : 'rgba(22,163,74,0.18)'}`,
                        borderRadius: 999,
                        padding: '3px 7px',
                        fontSize: 10,
                        fontWeight: 850,
                      }}
                    >
                      {state}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '8px 0 0',
                      paddingLeft: 8,
                      color: MUTED,
                      fontSize: 11,
                      lineHeight: 1.5,
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: 14, borderLeft: `1px solid ${BORDER}`, background: SURFACE_SOFT }}>
              <div
                style={{
                  height: 166,
                  borderRadius: 15,
                  overflow: 'hidden',
                  border: `1px solid ${BORDER}`,
                  background: '#EAF0F8',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 12,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.86)',
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 28,
                    width: 88,
                    height: 64,
                    border: `2px solid ${BLUE}`,
                    background: 'rgba(37,99,235,0.16)',
                    borderRadius: 7,
                    boxShadow: '0 0 0 999px rgba(15,23,42,0.18)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 28,
                    width: 88,
                    height: 64,
                    overflow: 'hidden',
                    borderRadius: 7,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 28,
                      background:
                        'linear-gradient(180deg, transparent, rgba(37,99,235,0.28), transparent)',
                      animation: 'scan-zone 3.2s ease-in-out infinite',
                    }}
                  />
                </div>

                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    bottom: 10,
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 900,
                  }}
                >
                  Focused · Price card
                </span>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                {[
                  ['Checks', '11'],
                  ['Changes', '4'],
                  ['Clean rate', '64%'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: FAINT, fontWeight: 900, textTransform: 'uppercase' }}>
                      {label}
                    </span>
                    <b style={{ color: label === 'Changes' ? RED : INK }}>{value}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-4 top-24 rounded-2xl p-4 hidden sm:block"
        style={{
          width: 252,
          background: 'rgba(255,255,255,0.96)',
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW_LG,
          animation: 'float-card 5s ease-in-out infinite',
        }}
      >
        <div style={{ display: 'flex', gap: 11 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: RED_SOFT,
              color: RED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={17} />
          </div>
          <div>
            <p style={{ margin: 0, color: INK, fontSize: 13, fontWeight: 900 }}>
              Change detected
            </p>
            <p style={{ margin: '3px 0 0', color: MUTED, fontSize: 12 }}>
              Price card changed 7.7%
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute -left-5 bottom-9 rounded-2xl p-4 hidden md:block"
        style={{
          width: 272,
          background: 'rgba(255,255,255,0.96)',
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW,
          animation: 'float-soft 6s ease-in-out infinite',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 11,
              background: BLUE_SOFT,
              color: BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={15} />
          </div>
          <p style={{ margin: 0, color: MUTED, fontSize: 12, lineHeight: 1.55 }}>
            “Price increased inside the selected zone. No layout issue detected.”
          </p>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 82% 12%, rgba(37,99,235,0.14), transparent 32%),
          radial-gradient(circle at 18% 22%, rgba(124,58,237,0.08), transparent 28%),
          linear-gradient(180deg, ${BG_SOFT} 0%, ${BG} 100%)
        `,
      }}
    >
      <DotBackdrop />

      <div className="relative max-w-[1180px] mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-14 items-center">
          <div data-animate>
            <Badge>Zone-first website monitoring</Badge>

            <h1
              style={{
                margin: '22px 0 0',
                fontSize: 'clamp(3.1rem, 6vw, 5.7rem)',
                lineHeight: 1.01,
                letterSpacing: '-0.075em',
                color: INK,
                fontWeight: 950,
              }}
            >
              Watch the parts of a page that actually matter.
            </h1>

            <p
              style={{
                margin: '24px 0 0',
                fontSize: 19,
                lineHeight: 1.72,
                color: MUTED,
                maxWidth: 620,
              }}
            >
              PageWatch captures public webpages on a schedule, lets you select focus zones, and alerts
              you when meaningful visual changes happen inside those zones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <Link
                href="/login"
                className="pw-primary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '15px 22px',
                  borderRadius: 16,
                  color: 'white',
                  background: BLUE,
                  fontWeight: 900,
                  boxShadow: '0 18px 40px rgba(37,99,235,0.24)',
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                }}
              >
                Start watching free <ArrowRight size={16} />
              </Link>

              <a
                href="#product"
                className="pw-secondary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '15px 22px',
                  borderRadius: 16,
                  color: INK,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  fontWeight: 800,
                  transition: 'transform 160ms ease, background 160ms ease',
                }}
              >
                See product loop <ChevronRight size={16} />
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
              {['Focus zones', 'Per-zone instructions', 'AI summaries', 'No code'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: 999,
                      background: BLUE_SOFT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={13} color={BLUE} />
                  </span>
                  <span style={{ fontSize: 13, color: MUTED, fontWeight: 750 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-animate data-delay-1 className="relative">
            <div
              className="absolute -inset-10 rounded-[44px]"
              style={{
                background: 'radial-gradient(circle, rgba(37,99,235,0.18), transparent 62%)',
                filter: 'blur(20px)',
              }}
            />
            <MiniBrowser />
          </div>
        </div>
      </div>
    </section>
  )
}

function SignalSection() {
  return (
    <section
      id="product"
      className="py-24 lg:py-32"
      style={{
        background: BG,
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-14 items-center">
          <div>
            <SectionHeading
              label="Product loop"
              title="Less page noise. More useful signal."
              body="Most website monitoring either watches too little or alerts on everything. PageWatch sits in the middle: screenshot the page, focus on what matters, and explain the change."
            />
          </div>

          <div data-animate className="relative">
            <div
              style={{
                position: 'absolute',
                inset: '10% 8%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.14), transparent 62%)',
                filter: 'blur(18px)',
              }}
            />

            <div
              style={{
                position: 'relative',
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 28,
                padding: 22,
                boxShadow: SHADOW_LG,
                overflow: 'hidden',
              }}
            >
              <svg
                viewBox="0 0 640 250"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <path
                  d="M80 126 C190 36, 285 210, 392 112 S545 70, 588 142"
                  fill="none"
                  stroke="rgba(37,99,235,0.18)"
                  strokeWidth="2"
                  strokeDasharray="520"
                  strokeDashoffset="520"
                  style={{ animation: 'draw-line 5s ease-in-out infinite alternate' }}
                />
              </svg>

              <div className="grid sm:grid-cols-4 gap-3 relative">
                {workflow.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.step}
                      className="pw-card-lift"
                      style={{
                        background: index === 1 ? 'linear-gradient(180deg, #FFFFFF, #F3F7FF)' : SURFACE,
                        border: `1px solid ${index === 1 ? BLUE_MID : BORDER}`,
                        borderRadius: 20,
                        padding: 18,
                        minHeight: 170,
                        boxShadow: index === 1 ? '0 16px 44px rgba(37,99,235,0.10)' : SHADOW,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 13,
                          background: index === 1 ? BLUE_SOFT : SURFACE_SOFT,
                          color: index === 1 ? BLUE : MUTED,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 18,
                          animation: index === 1 ? 'pulse-ring 2.6s ease-in-out infinite' : undefined,
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <p
                        style={{
                          margin: '0 0 8px',
                          color: index === 1 ? BLUE : FAINT,
                          fontSize: 11,
                          fontWeight: 950,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item.step}
                      </p>
                      <h3 style={{ margin: 0, color: INK, fontSize: 16, fontWeight: 900 }}>
                        {item.title}
                      </h3>
                      <p style={{ margin: '8px 0 0', color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
                        {item.body}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-14 items-center">
          <div data-animate>
            <div
              style={{
                position: 'relative',
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 30,
                padding: 18,
                boxShadow: SHADOW_LG,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  borderRadius: 22,
                  background: '#EAF0F8',
                  border: `1px solid ${BORDER}`,
                  overflow: 'hidden',
                  minHeight: 360,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 20,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 14,
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      style={{
                        borderRadius: 18,
                        background: 'rgba(255,255,255,0.82)',
                        border: `1px solid ${BORDER}`,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '8%',
                    top: '18%',
                    width: '29%',
                    height: '32%',
                    borderRadius: 12,
                    border: `2px solid ${BLUE}`,
                    background: 'rgba(37,99,235,0.14)',
                    boxShadow: '0 0 0 999px rgba(15,23,42,0.18)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: -30,
                      background: BLUE,
                      color: 'white',
                      borderRadius: 9,
                      padding: '6px 8px',
                      fontSize: 10,
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <MousePointer2 size={11} />
                    Selected zone
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    right: 18,
                    bottom: 18,
                    width: 260,
                    background: 'rgba(255,255,255,0.96)',
                    border: `1px solid ${BORDER}`,
                    borderRadius: 18,
                    padding: 14,
                    boxShadow: SHADOW,
                  }}
                >
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        background: BLUE_SOFT,
                        color: BLUE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: INK, fontSize: 13, fontWeight: 900 }}>
                        Watch instruction
                      </p>
                      <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 12, lineHeight: 1.5 }}>
                        Alert when the price changes or the plan card disappears.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              label="Focus zones"
              title="Stop treating the whole page as the signal."
              body="Most pages are noisy. Headers change, ads rotate, cookie banners appear, carousels move. PageWatch lets you draw the important region and leave the rest alone."
            />

            <div style={{ display: 'grid', gap: 12, marginTop: 28 }}>
              {[
                ['Ignore noise', 'Do not alert because the header, footer, or random page chrome changed.'],
                ['Watch intent', 'Each zone can have its own instruction and sensitivity.'],
                ['Review faster', 'Open the exact region that changed instead of scanning the full screenshot.'],
              ].map(([title, body]) => (
                <div
                  key={title}
                  data-animate
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    padding: 14,
                    borderRadius: 16,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 10,
                      background: BLUE_SOFT,
                      color: BLUE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: INK, fontSize: 13, fontWeight: 900 }}>{title}</p>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 13, lineHeight: 1.55 }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  return (
    <section id="use-cases" className="py-24 lg:py-32" style={{ background: BG }}>
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHeading
          label="Use cases"
          title="For pages where a silent change has a cost."
          body="PageWatch is not for every page. It is for the public pages your team should never discover too late."
        />

        <div className="mt-14" style={{ display: 'grid', gap: 14 }}>
          {useCases.map((item, index) => (
            <div
              key={item.title}
              data-animate
              className="pw-card-lift"
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr auto',
                gap: 22,
                alignItems: 'center',
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 24,
                padding: 18,
                boxShadow: index === 0 ? SHADOW : '0 8px 24px rgba(15,23,42,0.035)',
              }}
            >
              <div
                style={{
                  height: 96,
                  borderRadius: 18,
                  background: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Layers3 size={26} />
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at top right, rgba(255,255,255,0.55), transparent 55%)',
                  }}
                />
              </div>

              <div>
                <p
                  style={{
                    margin: '0 0 7px',
                    color: item.color,
                    fontSize: 11,
                    fontWeight: 950,
                    textTransform: 'uppercase',
                    letterSpacing: '0.11em',
                  }}
                >
                  {item.label}
                </p>
                <h3 style={{ margin: 0, color: INK, fontSize: 22, fontWeight: 950 }}>
                  {item.title}
                </h3>
                <p style={{ margin: '8px 0 0', color: MUTED, fontSize: 14, lineHeight: 1.65 }}>
                  {item.body}
                </p>
              </div>

              <ChevronRight className="hidden md:block" size={20} color={FAINT} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="workflow" className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionHeading
          label="Why PageWatch"
          title="A monitoring surface, not another noisy inbox."
          center
          body="The dashboard is built around the same idea as the product: show the objects that matter, keep the noise quiet, and make the next action obvious."
        />

        <div
          className="mt-14"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 16,
          }}
        >
          {featureRows.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                data-animate
                className="pw-card-lift"
                style={{
                  minHeight: index === 1 ? 310 : 260,
                  transform: index === 1 ? 'translateY(-18px)' : undefined,
                  background: SURFACE,
                  border: `1px solid ${index === 1 ? BLUE_MID : BORDER}`,
                  borderRadius: 28,
                  padding: 24,
                  boxShadow: index === 1 ? SHADOW_LG : SHADOW,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -45,
                    top: -45,
                    width: 140,
                    height: 140,
                    borderRadius: 999,
                    background:
                      index === 1
                        ? 'rgba(37,99,235,0.10)'
                        : 'rgba(15,23,42,0.035)',
                  }}
                />

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: index === 1 ? BLUE_SOFT : SURFACE_SOFT,
                    color: index === 1 ? BLUE : MUTED,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    position: 'relative',
                  }}
                >
                  <Icon size={20} />
                </div>

                <h3 style={{ margin: 0, color: INK, fontSize: 22, lineHeight: 1.15, fontWeight: 950 }}>
                  {item.title}
                </h3>
                <p style={{ margin: '12px 0 0', color: MUTED, fontSize: 14, lineHeight: 1.7 }}>
                  {item.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32" style={{ background: BG }}>
      <div className="max-w-[980px] mx-auto px-6">
        <SectionHeading
          label="Pricing"
          title="Start small. Upgrade when monitoring becomes operational."
          center
        />

        <div
          data-animate
          style={{
            marginTop: 46,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 30,
            padding: 12,
            boxShadow: SHADOW_LG,
          }}
        >
          <div
            style={{
              borderRadius: 22,
              background: 'linear-gradient(135deg, #FFFFFF, #F3F7FF)',
              padding: 28,
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 24,
              alignItems: 'center',
              border: `1px solid ${BORDER}`,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: GREEN,
                  background: GREEN_SOFT,
                  border: '1px solid rgba(22,163,74,0.18)',
                  padding: '5px 9px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 900,
                  marginBottom: 12,
                }}
              >
                <Zap size={13} />
                Free to start
              </div>

              <h3
                style={{
                  margin: 0,
                  color: INK,
                  fontSize: 30,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: '-0.04em',
                }}
              >
                3 monitors. Daily checks. Email alerts.
              </h3>

              <div className="grid sm:grid-cols-3 gap-3 mt-22" style={{ marginTop: 22 }}>
                {['Focus zones', 'Screenshot history', 'AI change summaries'].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      color: MUTED,
                      fontSize: 13,
                      fontWeight: 750,
                    }}
                  >
                    <Check size={14} color={GREEN} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              className="pw-primary"
              style={{
                background: BLUE,
                color: 'white',
                padding: '14px 18px',
                borderRadius: 15,
                fontSize: 15,
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-flex',
                gap: 8,
                alignItems: 'center',
                boxShadow: '0 18px 40px rgba(37,99,235,0.24)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              Start free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeading label="FAQ" title="Questions before you watch your first page?" center />

        <div style={{ marginTop: 42, display: 'grid', gap: 10 }}>
          {faqs.map((item) => (
            <details
              data-animate
              key={item.q}
              className="pw-details"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
                padding: '18px 20px',
                boxShadow: '0 8px 24px rgba(15,23,42,0.03)',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 900,
                  color: INK,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                {item.q}
                <ChevronRight size={16} color={FAINT} />
              </summary>
              <p style={{ margin: '12px 0 0', color: MUTED, fontSize: 14, lineHeight: 1.7 }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section
      className="py-24 lg:py-32"
      style={{
        background: `
          radial-gradient(circle at center, rgba(37,99,235,0.12), transparent 40%),
          linear-gradient(180deg, ${BG_SOFT}, #EEF4FF)
        `,
      }}
    >
      <div data-animate className="max-w-[920px] mx-auto px-6 text-center">
        <Badge>Ready when the page changes</Badge>

        <h2
          style={{
            margin: '20px 0 0',
            fontSize: 'clamp(2.4rem, 5vw, 4.4rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.065em',
            fontWeight: 950,
            color: INK,
          }}
        >
          Stop checking important pages manually.
        </h2>

        <p
          style={{
            margin: '18px auto 0',
            maxWidth: 640,
            color: MUTED,
            fontSize: 17,
            lineHeight: 1.7,
          }}
        >
          Add a URL, capture a baseline, choose zones, and let PageWatch tell you when something
          meaningful changes.
        </p>

        <Link
          href="/login"
          className="pw-primary"
          style={{
            marginTop: 30,
            background: BLUE,
            color: 'white',
            padding: '15px 22px',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 900,
            textDecoration: 'none',
            display: 'inline-flex',
            gap: 8,
            alignItems: 'center',
            boxShadow: '0 18px 40px rgba(37,99,235,0.24)',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
          }}
        >
          Start watching free <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-[1180px] mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: BLUE,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Monitor size={14} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 900, color: INK }}>PageWatch</span>
        </div>

        <p style={{ margin: 0, color: FAINT, fontSize: 12 }}>
          © {new Date().getFullYear()} PageWatch. Visual monitoring for public pages.
        </p>
      </div>
    </footer>
  )
}

export default function LightLandingPage() {
  return (
    <main style={{ background: BG, minHeight: '100vh' }}>
      <GlobalStyles />
      <Nav />
      <Hero />
      <SignalSection />
      <ComparisonSection />
      <UseCases />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <ScrollReveal />
    </main>
  )
}