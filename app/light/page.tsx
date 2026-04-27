import Link from 'next/link'
import {
  Monitor,
  ArrowRight,
  Check,
  Eye,
  Bell,
  Sparkles,
  Clock3,
  Shield,
  Briefcase,
  Search,
  ScrollText,
  Layers3,
  Camera,
  Activity,
  ChevronRight,
} from 'lucide-react'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const metadata = {
  title: 'PageWatch | Visual Website Monitoring & Page Change Detection',
  description:
    'Monitor any public webpage with scheduled screenshots, visual diffs, and AI summaries. Catch pricing, layout, content, and checkout changes before your users do.',
}

const BG = '#f6f4ef'
const BG_SOFT = '#fbfaf7'
const SURFACE = '#ffffff'
const SURFACE_ALT = '#f1eee6'
const SURFACE_SOFT = '#faf8f3'
const TEXT = '#111827'
const TEXT_SOFT = 'rgba(17,24,39,0.72)'
const TEXT_DIM = 'rgba(17,24,39,0.48)'
const BORDER = 'rgba(17,24,39,0.09)'
const ACCENT = '#0e9f6e'
const ACCENT_SOFT = 'rgba(14,159,110,0.10)'
const ACCENT_MID = 'rgba(14,159,110,0.18)'
const RED = '#dc4c3f'
const RED_SOFT = 'rgba(220,76,63,0.08)'
const RED_MID = 'rgba(220,76,63,0.18)'
const SHADOW = '0 30px 90px rgba(17,24,39,0.10)'
const SHADOW_LG = '0 40px 120px rgba(17,24,39,0.14)'

const useCases = [
  {
    eyebrow: 'Revenue & growth',
    title: 'Catch broken checkout, pricing, and sign-up changes before they cost conversions.',
    body: 'Monitor your highest-leverage pages with tight thresholds and faster schedules, so layout shifts, missing elements, and silent content changes do not sit unnoticed for hours.',
    bullets: ['Pricing and plan pages', 'Checkout and sign-up flows', 'Campaign landing pages'],
    metric: '23.4% diff detected',
    accent: RED,
  },
  {
    eyebrow: 'Agencies',
    title: 'Watch every client site from one workspace and prove exactly what changed.',
    body: 'Stop being the last to know when a client page breaks, disappears, or quietly changes. Keep screenshot history, send diff alerts, and maintain a clean visual audit trail.',
    bullets: ['Multi-client monitoring', 'Proof for client conversations', 'Screenshot history over time'],
    metric: '18 monitored client pages',
    accent: ACCENT,
  },
  {
    eyebrow: 'Competitive intelligence',
    title: 'Track competitor pricing, positioning, and page changes without checking manually.',
    body: 'When a competitor updates pricing, swaps messaging, or launches a new offer, you should not discover it from a stale deck or a random screenshot in Slack.',
    bullets: ['Pricing page monitoring', 'Messaging and offer shifts', 'New product page changes'],
    metric: 'Competitor page updated',
    accent: '#7c5cff',
  },
  {
    eyebrow: 'Archive & compliance',
    title: 'Keep a visual record of important pages, even when you do not want active alerting.',
    body: 'Use archive mode to preserve scheduled page screenshots over time, creating evidence you can point to later for audits, legal reviews, and internal accountability.',
    bullets: ['Visual audit trail', 'Quiet screenshot archiving', 'Historical page evidence'],
    metric: 'Archive mode enabled',
    accent: '#c08b2c',
  },
]

const differentiators = [
  {
    icon: Eye,
    title: 'Visual, not just technical',
    body: 'PageWatch detects what people actually see on the page, not only HTML or uptime events.',
  },
  {
    icon: Activity,
    title: 'Threshold-based alerts',
    body: 'Control how sensitive monitoring should be, from subtle shifts to major layout changes.',
  },
  {
    icon: Sparkles,
    title: 'AI summaries included',
    body: 'Get a plain-English summary of what changed so you can triage faster.',
  },
  {
    icon: ScrollText,
    title: 'Watch or archive mode',
    body: 'Choose active alerting or quiet screenshot history depending on the use case.',
  },
  {
    icon: Clock3,
    title: 'Per-page schedules',
    body: 'Run checks hourly, daily, or weekly, page by page.',
  },
  {
    icon: Briefcase,
    title: 'Built for operational teams',
    body: 'Strong fit for agencies, growth, ops, QA, competitive monitoring, and audit-heavy workflows.',
  },
]

const faqs = [
  {
    q: 'What is visual website monitoring?',
    a: 'Visual website monitoring means checking how a page actually looks over time, using screenshots and image comparison, rather than relying only on code, uptime, or DOM-level signals.',
  },
  {
    q: 'How does PageWatch detect page changes?',
    a: 'PageWatch captures scheduled screenshots of a public URL, compares them visually, measures the difference, and alerts you when the change exceeds your chosen threshold.',
  },
  {
    q: 'Can I monitor a competitor pricing page?',
    a: 'Yes. PageWatch is useful for tracking public competitor pages such as pricing, feature, positioning, or campaign pages, so you can catch changes without checking manually.',
  },
  {
    q: 'Can I keep a screenshot history of a page?',
    a: 'Yes. Archive mode lets you preserve scheduled screenshots over time, creating a visual record of what the page looked like at different moments.',
  },
  {
    q: 'What kinds of changes can it catch?',
    a: 'It can catch visual changes such as pricing updates, moved sections, broken layouts, missing UI elements, changed headlines, revised CTAs, and other visible differences.',
  },
  {
    q: 'How often can PageWatch check a page?',
    a: 'You can choose hourly, daily, or weekly monitoring depending on how critical the page is.',
  },
  {
    q: 'Do I need code or installation?',
    a: 'No. You add a public URL, choose a schedule and threshold, and PageWatch handles the screenshot capture, diffing, and alerts for you.',
  },
  {
    q: 'What is the difference between watch mode and archive mode?',
    a: 'Watch mode is for active monitoring with alerts when important changes happen. Archive mode is for quietly collecting screenshots over time without treating each change as an incident.',
  },
]

function SectionHeading({
  label,
  title,
  body,
  align = 'left',
}: {
  label: string
  title: string
  body?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      style={{
        maxWidth: align === 'center' ? 1000 : 800,
        margin: align === 'center' ? '0 auto' : '0',
        textAlign: align,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          borderRadius: 999,
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 10px 30px rgba(17,24,39,0.04)',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            background: ACCENT,
            boxShadow: `0 0 0 6px ${ACCENT_SOFT}`,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          {label}
        </span>
      </div>

      <h2
        style={{
          fontSize: 'clamp(2rem, 4.5vw, 4rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.05em',
          fontWeight: 700,
          color: TEXT,
          marginBottom: body ? 18 : 0,
        }}
      >
        {title}
      </h2>

      {body && (
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.75,
            color: TEXT_SOFT,
            maxWidth: align === 'center' ? 800 : 720,
            margin: align === 'center' ? '0 auto' : '0',
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
        background: 'rgba(246,244,239,0.78)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
        <Link href="/light" className="flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 24px rgba(14,159,110,0.20)',
            }}
          >
            <Monitor className="w-4 h-4" style={{ color: 'white' }} />
          </div>
          <div className="leading-none">
            <div
              style={{
                color: TEXT,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              PageWatch
            </div>
            <div
              style={{
                color: TEXT_DIM,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Visual monitoring
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {[
            ['Product', '#product'],
            ['Use cases', '#use-cases'],
            ['Why PageWatch', '#why-pagewatch'],
            ['Pricing', '#pricing'],
            ['FAQ', '#faq'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="transition-all"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: TEXT_SOFT,
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl"
            style={{
              color: TEXT_SOFT,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)',
              boxShadow: '0 16px 36px rgba(14,159,110,0.22)',
            }}
          >
            Start free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

function CleanHeroVisual() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto lg:ml-auto">
      {/* Background ambient glows */}
      <div
        className="absolute -inset-10 rounded-[40px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14,159,110,0.15) 0%, transparent 60%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220,76,63,0.12), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Main Browser Window */}
      <div
        className="relative rounded-[24px] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW_LG,
        }}
      >
        {/* Browser Header */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{
            borderBottom: `1px solid ${BORDER}`,
            background: SURFACE_SOFT,
          }}
        >
          <div className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <div
            className="w-full max-w-[240px] mx-auto rounded-md px-3 py-1.5 flex items-center justify-center gap-2"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: TEXT_DIM,
              }}
            >
              https://acme.com/pricing
            </span>
          </div>
        </div>

        {/* Browser Body (Wireframe) */}
        <div className="p-8 relative" style={{ background: '#fdfdfc' }}>
          {/* Subtle scanning animation over the zone */}
          <div
            className="absolute left-6 right-1/2 h-[140px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(14,159,110,0.03) 50%, transparent 100%)',
              animation: 'scanPulse 4s ease-in-out infinite',
            }}
          />

          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-4 rounded-full mb-3" style={{ background: 'rgba(17,24,39,0.1)' }} />
            <div className="w-48 h-3 rounded-full" style={{ background: 'rgba(17,24,39,0.05)' }} />
          </div>

          <div className="grid grid-cols-2 gap-5 relative z-0">
            {/* Monitored Zone Wireframe */}
            <div className="relative">
              {/* Zone Selection Box */}
              <div
                className="absolute -inset-2 rounded-xl z-10 pointer-events-none"
                style={{
                  border: `2px solid ${ACCENT}`,
                  background: 'rgba(14,159,110,0.02)',
                }}
              >
                <div
                  className="absolute -top-3 -right-2 px-2 py-1 rounded-md flex items-center gap-1.5"
                  style={{
                    background: ACCENT,
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(14,159,110,0.25)',
                  }}
                >
                  <Eye className="w-3 h-3" />
                  <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Monitored Zone
                  </span>
                </div>
                {/* Corner anchors to make it look like a selection tool */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#0e9f6e]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#0e9f6e]" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#0e9f6e]" />
              </div>

              <div
                className="rounded-2xl p-5 relative z-0"
                style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
              >
                <div className="w-16 h-3 rounded-full mb-4" style={{ background: 'rgba(17,24,39,0.08)' }} />
                <div className="w-20 h-6 rounded-md mb-6" style={{ background: 'rgba(17,24,39,0.12)' }} />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-2 rounded-full" style={{ background: 'rgba(17,24,39,0.04)' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Unmonitored Plan Wireframe */}
            <div
              className="rounded-2xl p-5 opacity-60"
              style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
            >
              <div className="w-16 h-3 rounded-full mb-4" style={{ background: 'rgba(17,24,39,0.06)' }} />
              <div className="w-20 h-6 rounded-md mb-6" style={{ background: 'rgba(17,24,39,0.08)' }} />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-2 rounded-full" style={{ background: 'rgba(17,24,39,0.03)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alert Card */}
      <div
        className="absolute -right-6 top-16 sm:-right-12 sm:top-24 rounded-[20px] p-4 w-64 z-20"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW_LG,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: RED_SOFT, border: `1px solid ${RED_MID}` }}
          >
            <Bell className="w-5 h-5" style={{ color: RED }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>Change Detected</div>
            <div style={{ fontSize: 12, color: TEXT_SOFT, marginTop: 2 }}>acme.com/pricing</div>
            <div
              className="mt-2 inline-flex items-center gap-2 px-2 py-1.5 rounded-md"
              style={{ background: SURFACE_SOFT, border: `1px solid ${BORDER}` }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: TEXT_DIM, textDecoration: 'line-through' }}>$29</span>
              <ArrowRight className="w-3 h-3" style={{ color: TEXT_DIM }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: RED }}>$39</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Report Card */}
      <div
        className="absolute -left-6 -bottom-6 sm:-left-10 sm:-bottom-8 rounded-[20px] p-4 w-72 z-20"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW_LG,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: SURFACE_SOFT, border: `1px solid ${BORDER}` }}
          >
            <ScrollText className="w-4 h-4" style={{ color: TEXT }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Check Report
            </div>
            <div style={{ fontSize: 13, color: TEXT_SOFT, marginTop: 4, lineHeight: 1.5 }}>
              "Price increased within the selected zone. No structural or layout changes detected."
            </div>
          </div>
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
          radial-gradient(circle at top center, rgba(14,159,110,0.08), transparent 40%),
          linear-gradient(180deg, ${BG_SOFT} 0%, ${BG} 55%, ${BG_SOFT} 100%)
        `,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(17,24,39,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(180deg, black 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-8 items-center">

          {/* Left Text Column */}
          <div data-animate className="max-w-[700px] lg:pr-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: `1px solid ${BORDER}`,
                boxShadow: '0 8px 24px rgba(17,24,39,0.03)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 0 4px ${ACCENT_SOFT}` }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: ACCENT,
                  fontWeight: 700,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}
              >
                Targeted Website Monitoring
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.05em',
                color: TEXT,
                fontWeight: 800,
              }}
            >
              Catch page changes
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0d8f63 0%, #14b87a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                before they get expensive.
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
                lineHeight: 1.7,
                color: TEXT_SOFT,
                marginTop: 24,
              }}
            >
              Select critical zones on any public page or give our agent exact instructions on what to watch. Catch pricing updates, checkout issues, and competitor messaging shifts without wading through false alarms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl transition-transform hover:-translate-y-0.5"
                style={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 15,
                  background: 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)',
                  boxShadow: '0 18px 40px rgba(14,159,110,0.24)',
                }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#product"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl transition-colors hover:bg-white"
                style={{
                  color: TEXT,
                  fontWeight: 600,
                  fontSize: 15,
                  background: 'rgba(255,255,255,0.6)',
                  border: `1px solid ${BORDER}`,
                }}
              >
                See how it works
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
              {['Select specific zones', 'Custom agent instructions', 'No code required'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ACCENT_SOFT }}>
                    <Check className="w-3 h-3" style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_SOFT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Column */}
          <div data-animate data-delay-1 className="mt-12 lg:mt-0">
            <CleanHeroVisual />
          </div>

        </div>
      </div>
    </section>
  )
}


function ProofStrip() {
  return (
    <section
      style={{
        background: 'rgba(255,255,255,0.54)',
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-7">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-center">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex -space-x-2.5">
              {['JD', 'SA', 'MK', 'RO', 'LP'].map((t, i) => (
                <div
                  key={t}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: ['#dbf5e7', '#e1ecff', '#fde5dd', '#efe4ff', '#f7eccf'][i],
                    border: `2px solid ${BG_SOFT}`,
                    color: ['#0e9f6e', '#5b7bff', '#d26b45', '#7c5cff', '#b27a1a'][i],
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>
                Built for agencies, growth, ops, and audit-heavy teams
              </div>
              <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 6 }}>
                Monitor critical pages. Catch silent changes. Keep a visual record.
              </div>
            </div>
          </div>

          <div className="lg:text-right">
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: TEXT_SOFT,
                fontStyle: 'italic',
              }}
            >
              “The most useful part was not just the alert. It was seeing the actual diff and
              knowing what changed immediately.”
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
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="Use cases"
            title="Built for the pages you cannot afford to miss."
            body="The same product loop works across several high-value jobs. What changes is the page you watch, the threshold you choose, and the reason you need to know first."
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-14">
          {useCases.map((item, i) => (
            <div key={item.title} data-animate {...(i % 2 === 1 ? { 'data-delay-1': '' } : {})}>
              <div
                className="rounded-[30px] p-7 h-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))',
                  border: `1px solid ${BORDER}`,
                  boxShadow: '0 22px 60px rgba(17,24,39,0.05)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: item.accent,
                        marginBottom: 14,
                      }}
                    >
                      {item.eyebrow}
                    </div>
                    <h3
                      style={{
                        fontSize: 28,
                        lineHeight: 1.15,
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        color: TEXT,
                        maxWidth: 520,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div
                    className="hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center"
                    style={{
                      background:
                        i === 0
                          ? RED_SOFT
                          : i === 1
                            ? ACCENT_SOFT
                            : i === 2
                              ? 'rgba(124,92,255,0.10)'
                              : 'rgba(192,139,44,0.10)',
                      border: `1px solid ${i === 0
                        ? RED_MID
                        : i === 1
                          ? ACCENT_MID
                          : i === 2
                            ? 'rgba(124,92,255,0.18)'
                            : 'rgba(192,139,44,0.18)'
                        }`,
                    }}
                  >
                    {i === 0 && <Bell className="w-5 h-5" style={{ color: RED }} />}
                    {i === 1 && <Briefcase className="w-5 h-5" style={{ color: ACCENT }} />}
                    {i === 2 && <Search className="w-5 h-5" style={{ color: '#7c5cff' }} />}
                    {i === 3 && <Shield className="w-5 h-5" style={{ color: '#b27a1a' }} />}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: TEXT_SOFT,
                    marginTop: 18,
                    maxWidth: 590,
                  }}
                >
                  {item.body}
                </p>

                <div className="grid sm:grid-cols-[1fr_auto] gap-5 mt-8 items-end">
                  <div className="space-y-3">
                    {item.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: SURFACE_ALT, border: `1px solid ${BORDER}` }}
                        >
                          <Check className="w-4 h-4" style={{ color: item.accent }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="rounded-[22px] p-4 min-w-[180px]"
                    style={{
                      background: SURFACE_SOFT,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: TEXT_DIM, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.12em' }}>
                      Live state
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: TEXT,
                        marginTop: 10,
                      }}
                    >
                      {item.metric}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductFlow() {
  const steps = [
    {
      icon: Camera,
      title: 'Capture a baseline',
      body: 'Add any public URL and PageWatch captures the visual starting point.',
    },
    {
      icon: Clock3,
      title: 'Run on a schedule',
      body: 'Choose hourly, daily, or weekly checks depending on page importance.',
    },
    {
      icon: Layers3,
      title: 'Compare screenshots',
      body: 'Each new capture is compared visually against the previous state.',
    },
    {
      icon: Bell,
      title: 'Alert on real change',
      body: 'When the diff exceeds your threshold, the page is treated like an actual event.',
    },
    {
      icon: Sparkles,
      title: 'Explain with AI',
      body: 'An AI summary helps you understand what changed, faster.',
    },
    {
      icon: ScrollText,
      title: 'Keep the history',
      body: 'Maintain screenshot evidence over time in watch mode or archive mode.',
    },
  ]

  return (
    <section id="product" className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="Product flow"
            title="Capture. Compare. Explain. Alert. Archive."
            body="The whole point of PageWatch is that the workflow is automatic. You do not need to manually check pages, diff screenshots, or interpret every change from scratch."
          />
        </div>

        <div className="mt-14 grid lg:grid-cols-[0.78fr_1.22fr] gap-6 items-start">
          <div data-animate>
            <div
              className="rounded-[32px] p-7 lg:sticky lg:top-24"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))',
                border: `1px solid ${BORDER}`,
                boxShadow: SHADOW,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: ACCENT,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                What the buyer understands here
              </div>

              <h3
                style={{
                  fontSize: 32,
                  lineHeight: 1.1,
                  letterSpacing: '-0.05em',
                  fontWeight: 700,
                  color: TEXT,
                }}
              >
                You are not buying another dashboard.
              </h3>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: TEXT_SOFT,
                  marginTop: 18,
                }}
              >
                You are buying earlier awareness, clearer context, and a visual audit trail for
                pages that matter. That is what makes PageWatch more useful than manual checking,
                generic uptime tools, or brittle custom scripts.
              </p>

              <div
                className="rounded-[26px] p-5 mt-7"
                style={{ background: SURFACE_SOFT, border: `1px solid ${BORDER}` }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Typical monitored pages
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    'Pricing',
                    'Checkout',
                    'Sign-up',
                    'Client pages',
                    'Competitor offers',
                    'Legal / policy pages',
                  ].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 rounded-xl"
                      style={{
                        background: SURFACE,
                        border: `1px solid ${BORDER}`,
                        fontSize: 13,
                        fontWeight: 700,
                        color: TEXT,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              const delay =
                i % 3 === 1 ? { 'data-delay-1': '' } : i % 3 === 2 ? { 'data-delay-2': '' } : {}
              return (
                <div key={step.title} data-animate {...delay}>
                  <div
                    className="rounded-[28px] p-6 h-full"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))',
                      border: `1px solid ${BORDER}`,
                      boxShadow: '0 18px 44px rgba(17,24,39,0.05)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: i === 3 ? RED_SOFT : ACCENT_SOFT,
                        border: `1px solid ${i === 3 ? RED_MID : ACCENT_MID}`,
                        marginBottom: 18,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: i === 3 ? RED : ACCENT }} />
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_DIM,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 12,
                      }}
                    >
                      Step {String(i + 1).padStart(2, '0')}
                    </div>

                    <h3
                      style={{
                        fontSize: 22,
                        lineHeight: 1.15,
                        letterSpacing: '-0.04em',
                        color: TEXT,
                        fontWeight: 700,
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 15,
                        lineHeight: 1.8,
                        color: TEXT_SOFT,
                        marginTop: 14,
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyPageWatch() {
  return (
    <section id="why-pagewatch" className="py-24 lg:py-32" style={{ background: BG }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="Why PageWatch"
            title="Everything you need to know what changed, not just that something changed."
            body="This is where most monitoring products fall short. They might tell you an event happened. PageWatch is designed to show the visual difference, explain it, and keep the evidence."
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-14">
          {differentiators.map((item, i) => {
            const Icon = item.icon
            const delay =
              i % 3 === 1 ? { 'data-delay-1': '' } : i % 3 === 2 ? { 'data-delay-2': '' } : {}
            return (
              <div key={item.title} data-animate {...delay}>
                <div
                  className="rounded-[28px] p-6 h-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.72))',
                    border: `1px solid ${BORDER}`,
                    boxShadow: '0 18px 44px rgba(17,24,39,0.05)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: ACCENT_SOFT, border: `1px solid ${ACCENT_MID}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                  </div>

                  <h3
                    style={{
                      fontSize: 22,
                      lineHeight: 1.15,
                      letterSpacing: '-0.04em',
                      color: TEXT,
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: TEXT_SOFT,
                      marginTop: 14,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Comparison() {
  const rows = [
    ['Visual screenshot diffs', 'No', 'Limited', 'Yes'],
    ['AI summary of changes', 'No', 'No', 'Yes'],
    ['Historical screenshot archive', 'Manual', 'Rare', 'Yes'],
    ['Per-page threshold control', 'No', 'Sometimes', 'Yes'],
    ['No-code setup', 'Yes', 'Mixed', 'Yes'],
    ['Useful for competitor monitoring', 'Manual', 'Weak', 'Yes'],
    ['Useful for agencies and client pages', 'Weak', 'Mixed', 'Yes'],
  ]

  return (
    <section className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="Comparison"
            title="Better than manual checks, lighter than custom monitoring stacks."
            body="A good landing page should make the alternative obvious. PageWatch wins when the problem is visual change detection, faster awareness, and a clean record of what changed over time."
          />
        </div>

        <div data-animate data-delay-1>
          <div
            className="rounded-[32px] overflow-hidden mt-14"
            style={{
              background: 'rgba(255,255,255,0.82)',
              border: `1px solid ${BORDER}`,
              boxShadow: SHADOW,
            }}
          >
            <div className="grid grid-cols-4" style={{ background: SURFACE_SOFT, borderBottom: `1px solid ${BORDER}` }}>
              {['Capability', 'Manual checks', 'Basic monitors', 'PageWatch'].map((label, i) => (
                <div
                  key={label}
                  className="p-4 sm:p-5"
                  style={{
                    color: i === 3 ? ACCENT : TEXT,
                    fontSize: 14,
                    fontWeight: 800,
                    borderLeft: i > 0 ? `1px solid ${BORDER}` : undefined,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {rows.map((row, r) => (
              <div
                key={row[0]}
                className="grid grid-cols-4"
                style={{
                  borderBottom: r < rows.length - 1 ? `1px solid ${BORDER}` : undefined,
                }}
              >
                {row.map((cell, i) => (
                  <div
                    key={cell + i}
                    className="p-4 sm:p-5"
                    style={{
                      borderLeft: i > 0 ? `1px solid ${BORDER}` : undefined,
                      color: i === 0 ? TEXT : i === 3 ? ACCENT : TEXT_SOFT,
                      fontSize: 14,
                      fontWeight: i === 0 || i === 3 ? 700 : 600,
                      background: i === 3 ? 'rgba(14,159,110,0.03)' : 'transparent',
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32" style={{ background: BG }}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="Pricing"
            title="Start small. Monitor what matters first."
            body="The best first setup is not every page you own. It is the handful that would hurt the most if they changed without you noticing."
            align="center"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-14">
          {[
            {
              name: 'Free',
              price: '$0',
              subtitle: 'For getting started',
              featured: false,
              bullets: [
                'Monitor up to 3 URLs',
                'Visual diff alerts',
                'Basic screenshot history',
                'Good for first workflows',
              ],
            },
            {
              name: 'Starter',
              price: '$29',
              subtitle: 'For real production monitoring',
              featured: true,
              bullets: [
                'More monitored URLs',
                'Hourly, daily, weekly checks',
                'Threshold-based alerts',
                'AI change summaries',
              ],
            },
            {
              name: 'Agency',
              price: '$99',
              subtitle: 'For multiple clients or larger teams',
              featured: false,
              bullets: [
                'Higher monitoring volume',
                'Workspace-oriented setup',
                'Client and competitor tracking',
                'Archive-heavy workflows',
              ],
            },
          ].map((plan, i) => {
            const delay =
              i === 1 ? { 'data-delay-1': '' } : i === 2 ? { 'data-delay-2': '' } : {}
            return (
              <div key={plan.name} data-animate {...delay}>
                <div
                  className="rounded-[30px] p-7 h-full"
                  style={{
                    background: plan.featured
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(246,255,251,0.92))'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.74))',
                    border: `1px solid ${plan.featured ? ACCENT_MID : BORDER}`,
                    boxShadow: plan.featured ? '0 24px 70px rgba(14,159,110,0.12)' : '0 18px 44px rgba(17,24,39,0.05)',
                    position: 'relative',
                  }}
                >
                  {plan.featured && (
                    <div
                      className="absolute top-5 right-5 px-3 py-1.5 rounded-full"
                      style={{
                        background: ACCENT_SOFT,
                        border: `1px solid ${ACCENT_MID}`,
                        color: ACCENT,
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Most popular
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: plan.featured ? ACCENT : TEXT_DIM,
                      marginBottom: 16,
                    }}
                  >
                    {plan.name}
                  </div>

                  <div
                    style={{
                      fontSize: 52,
                      lineHeight: 1,
                      letterSpacing: '-0.06em',
                      color: TEXT,
                      fontWeight: 750,
                    }}
                  >
                    {plan.price}
                    <span
                      style={{
                        fontSize: 16,
                        color: TEXT_DIM,
                        fontWeight: 700,
                        marginLeft: 6,
                      }}
                    >
                      /mo
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      color: TEXT_SOFT,
                      marginTop: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {plan.subtitle}
                  </div>

                  <div className="space-y-3 mt-8">
                    {plan.bullets.map((b) => (
                      <div key={b} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{
                            background: plan.featured ? ACCENT_SOFT : SURFACE_ALT,
                            border: `1px solid ${plan.featured ? ACCENT_MID : BORDER}`,
                          }}
                        >
                          <Check
                            className="w-4 h-4"
                            style={{ color: plan.featured ? ACCENT : TEXT_SOFT }}
                          />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/login"
                    className="mt-9 inline-flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl"
                    style={{
                      color: plan.featured ? 'white' : TEXT,
                      background: plan.featured
                        ? 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)'
                        : 'rgba(255,255,255,0.78)',
                      border: `1px solid ${plan.featured ? 'transparent' : BORDER}`,
                      fontWeight: 800,
                      boxShadow: plan.featured ? '0 18px 40px rgba(14,159,110,0.22)' : 'none',
                      marginTop: 34,
                    }}
                  >
                    Start free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32" style={{ background: BG_SOFT }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <SectionHeading
            label="FAQ"
            title="Questions buyers ask before they commit."
            body="These also help search engines understand what PageWatch does, what kinds of pages it monitors, and why a visual monitoring workflow is different from generic monitoring."
            align="center"
          />
        </div>

        <div className="space-y-4 mt-14">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              data-animate
              {...(i % 2 === 1 ? { 'data-delay-1': '' } : {})}
            >
              <div
                className="rounded-[26px] p-6"
                style={{
                  background: 'rgba(255,255,255,0.84)',
                  border: `1px solid ${BORDER}`,
                  boxShadow: '0 16px 40px rgba(17,24,39,0.04)',
                }}
              >
                <h3
                  style={{
                    fontSize: 22,
                    lineHeight: 1.2,
                    letterSpacing: '-0.03em',
                    color: TEXT,
                    fontWeight: 700,
                  }}
                >
                  {item.q}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: TEXT_SOFT,
                    marginTop: 14,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-24 lg:py-32" style={{ background: BG }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div data-animate>
          <div
            className="rounded-[36px] overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at top center, rgba(14,159,110,0.16), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,246,241,0.92))',
              border: `1px solid ${BORDER}`,
              boxShadow: SHADOW_LG,
            }}
          >
            <div className="px-8 py-12 sm:px-12 sm:py-16 text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  border: `1px solid ${BORDER}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: ACCENT, boxShadow: `0 0 0 6px ${ACCENT_SOFT}` }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  Launch faster
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.06em',
                  color: TEXT,
                  fontWeight: 750,
                  marginTop: 20,
                }}
              >
                Be the first to know
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0d8f63 0%, #14b87a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  when the web changes.
                </span>
              </h2>

              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.8,
                  color: TEXT_SOFT,
                  maxWidth: 760,
                  margin: '22px auto 0',
                }}
              >
                Start with the handful of pages that matter most. Pricing. Checkout. Client
                deliverables. Competitor pages. Legal and policy pages. PageWatch keeps watch, so
                your team does not have to.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl"
                  style={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: 15,
                    background: 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)',
                    boxShadow: '0 18px 40px rgba(14,159,110,0.24)',
                  }}
                >
                  Start free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl"
                  style={{
                    color: TEXT,
                    fontWeight: 700,
                    fontSize: 15,
                    background: 'rgba(255,255,255,0.78)',
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  See pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(255,255,255,0.54)',
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #14b87a 0%, #0e9f6e 100%)',
            }}
          >
            <Monitor className="w-4 h-4" style={{ color: 'white' }} />
          </div>
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 800 }}>PageWatch</div>
        </div>

        <div className="flex items-center gap-6">
          {[
            ['Product', '#product'],
            ['Use cases', '#use-cases'],
            ['Pricing', '#pricing'],
            ['FAQ', '#faq'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 14,
                color: TEXT_SOFT,
                fontWeight: 600,
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{ fontSize: 13, color: TEXT_DIM }}>
          Visual website monitoring for pages that matter.
        </div>
      </div>
    </footer>
  )
}

export default function LightLandingPage() {
  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes heroSheen {
          0% { transform: translateX(-35%); opacity: 0; }
          10% { opacity: 1; }
          55% { transform: translateX(65%); opacity: 1; }
          100% { transform: translateX(85%); opacity: 0; }
        }

        @keyframes scanPulse {
          0% { transform: translateY(-18px); opacity: 0.45; }
          50% { transform: translateY(10px); opacity: 1; }
          100% { transform: translateY(-18px); opacity: 0.45; }
        }

        .light-page a {
          text-decoration: none;
        }

        .light-page * {
          box-sizing: border-box;
        }

        [data-animate] {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 700ms ease,
            transform 700ms ease;
          will-change: opacity, transform;
        }

        [data-animate][data-visible] {
          opacity: 1;
          transform: translateY(0);
        }

        [data-animate][data-delay-1] {
          transition-delay: 90ms;
        }

        [data-animate][data-delay-2] {
          transition-delay: 180ms;
        }

        [data-animate][data-delay-3] {
          transition-delay: 270ms;
        }
      `}</style>

      <div className="light-page" style={{ background: BG, overflow: 'hidden' }}>
        <ScrollReveal />
        <Nav />
        <Hero />
        <ProofStrip />
        <UseCases />
        <ProductFlow />
        <WhyPageWatch />
        <Comparison />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  )
}