import Link from 'next/link'
import { Monitor, ArrowRight, Check } from 'lucide-react'
import { PricingSection } from '@/components/landing/PricingSection'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const metadata = {
  title: 'PageWatch — Know the moment anything changes',
  description:
    'PageWatch monitors your pages on a schedule, compares screenshots pixel by pixel, and alerts you the instant something changes.',
}

/* ─────────────────────────────────────────────────
   Shared constants
───────────────────────────────────────────────── */
const BG = '#0a0a0a'
const SURFACE = '#111111'
const BORDER = 'rgba(255,255,255,0.07)'

/* ─────────────────────────────────────────────────
   Nav
───────────────────────────────────────────────── */
function Nav() {
  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: '#00ff88' }}>
            <Monitor className="w-4 h-4" style={{ color: '#0a0a0a' }} />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">PageWatch</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {['Features', 'How it works', 'Pricing'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors text-white/50 hover:text-white"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="btn-neon px-4 py-2 rounded-lg text-sm"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────
   Hero diff mockup
───────────────────────────────────────────────── */
function HeroMockup() {
  return (
    <div className="relative hero-5">
      {/* Ambient glow behind the mockup */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(0,255,136,0.07) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative rounded-2xl overflow-hidden mockup-glow"
        style={{ border: '1px solid rgba(255,255,255,0.09)', background: '#0f0f0f' }}
      >
        {/* Scan line */}
        <div
          className="absolute inset-x-0 h-px pointer-events-none z-20 scan-line"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.25), transparent)',
          }}
        />

        {/* Browser chrome */}
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: '#0c0c0c', borderBottom: '1px solid rgba(255,255,255,0.055)' }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <div
            className="flex-1 flex items-center gap-2 mx-2 px-3 py-1 rounded-md"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00ff88' }} />
            <span className="text-[11px] font-mono truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
              acme.com/pricing
            </span>
          </div>
        </div>

        {/* Alert banner */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: 'rgba(255,50,50,0.08)',
            borderBottom: '1px solid rgba(255,50,50,0.18)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5555' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#ff4444' }} />
            </span>
            <span className="text-xs font-medium" style={{ color: '#ff7070' }}>
              Visual change detected
            </span>
          </div>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ color: '#ff7070', background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.2)' }}
          >
            23.4% changed
          </span>
        </div>

        {/* Simulated page */}
        <div style={{ background: '#0f0f0f' }}>
          {/* Nav skeleton */}
          <div
            className="flex items-center gap-5 px-5 py-2.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div className="w-16 h-2.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.18)' }} />
            <div className="flex gap-4 ml-auto">
              {[10, 14, 12, 10].map((w, i) => (
                <div key={i} className="h-2 rounded-sm" style={{ width: w * 4, background: 'rgba(255,255,255,0.08)' }} />
              ))}
              <div className="w-20 h-5 rounded-md" style={{ background: 'rgba(255,255,255,0.09)' }} />
            </div>
          </div>

          {/* Hero text skeleton */}
          <div className="px-5 pt-4 pb-3 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
            <div className="w-20 h-2 rounded-sm mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="w-52 h-4 rounded-sm mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.18)' }} />
            <div className="w-40 h-4 rounded-sm mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="w-60 h-2.5 rounded-sm mx-auto mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="w-48 h-2.5 rounded-sm mx-auto" style={{ background: 'rgba(255,255,255,0.045)' }} />
          </div>

          {/* Pricing cards — diff region */}
          <div className="relative px-5 py-4 diff-region">
            {/* Diff overlay */}
            <div
              className="absolute inset-y-0 inset-x-0 pointer-events-none"
              style={{ border: '1px solid rgba(255,68,68,0.15)' }}
            />

            <div className="grid grid-cols-3 gap-2.5">
              {/* Starter */}
              <div
                className="rounded-lg p-3"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-10 h-2 rounded-sm mb-2" style={{ background: 'rgba(255,255,255,0.18)' }} />
                <div className="w-8 h-3.5 rounded-sm mb-1" style={{ background: 'rgba(255,255,255,0.25)' }} />
                <div className="w-12 h-1.5 rounded-sm mb-2.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-1.5 rounded-sm mb-1.5" style={{ background: 'rgba(255,255,255,0.055)' }} />
                ))}
              </div>

              {/* Pro — CHANGED */}
              <div
                className="rounded-lg p-3 relative"
                style={{ border: '1px solid rgba(255,68,68,0.4)', background: 'rgba(255,50,50,0.07)' }}
              >
                <div
                  className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#ff4444', color: 'white' }}
                >
                  CHANGED
                </div>
                <div className="w-8 h-2 rounded-sm mb-2" style={{ background: 'rgba(255,255,255,0.18)' }} />
                {/* Changed price */}
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-10 h-3.5 rounded-sm" style={{ background: 'rgba(255,100,100,0.5)' }} />
                  <div
                    className="w-8 h-2 rounded-sm text-center text-[8px] leading-4"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.3)' }}
                  />
                </div>
                <div className="w-14 h-1.5 rounded-sm mb-2.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-1.5 rounded-sm mb-1.5" style={{ background: 'rgba(255,80,80,0.12)' }} />
                ))}
              </div>

              {/* Enterprise */}
              <div
                className="rounded-lg p-3"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-14 h-2 rounded-sm mb-2" style={{ background: 'rgba(255,255,255,0.18)' }} />
                <div className="w-10 h-3.5 rounded-sm mb-1" style={{ background: 'rgba(255,255,255,0.25)' }} />
                <div className="w-12 h-1.5 rounded-sm mb-2.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-1.5 rounded-sm mb-1.5" style={{ background: 'rgba(255,255,255,0.055)' }} />
                ))}
              </div>
            </div>

            {/* Diff stats strip */}
            <div
              className="mt-3 flex items-center justify-between px-2 py-1.5 rounded-md"
              style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.1)' }}
            >
              <span className="text-[10px]" style={{ color: 'rgba(255,120,120,0.7)' }}>
                23.4% pixels changed · Pro card price updated
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '23.4%', background: '#ff4444' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer skeleton */}
          <div
            className="flex items-center gap-5 px-5 py-2.5 opacity-40"
            style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div className="w-12 h-1.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex gap-4 ml-auto">
              {[3, 3, 3].map((_, i) => (
                <div key={i} className="w-10 h-1.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating alert card */}
      <div
        className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 alert-slide"
        style={{ zIndex: 10 }}
      >
        <div
          className="rounded-xl p-4 min-w-[210px] shadow-2xl"
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}
            >
              <span className="text-sm" style={{ color: '#ff7070' }}>⚡</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white mb-0.5">Alert sent</p>
              <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
                acme.com/pricing · now
              </p>
              {/* Diff bar */}
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="h-full rounded-full" style={{ width: '23.4%', background: '#ff4444' }} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: '#ff7070' }}>23.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Hero section
───────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col pt-14"
      style={{ background: BG }}
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 pointer-events-none" />

      {/* Radial spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-10 py-24 lg:py-32 flex-1">
        {/* Left: copy */}
        <div className="flex-1 max-w-xl">
          {/* Badge */}
          <div
            className="hero-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-8"
            style={{
              background: 'rgba(0,255,136,0.06)',
              border: '1px solid rgba(0,255,136,0.18)',
              color: '#00ff88',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#00ff88' }}
            />
            Monitoring 12,000+ pages
          </div>

          {/* Headline */}
          <h1
            className="hero-2 text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.04] tracking-[-0.03em] text-white mb-6"
          >
            Know the moment
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00ddaa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              anything changes.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="hero-3 text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            PageWatch monitors your pages on a schedule, compares screenshots
            pixel by pixel, and sends you a diff the instant something shifts.
          </p>

          {/* CTAs */}
          <div className="hero-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/login"
              className="btn-neon flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
            >
              Start watching free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-wire flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
            >
              See how it works
            </a>
          </div>

          {/* Proof micro-copy */}
          <p className="hero-4 text-xs mt-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Free forever on 3 URLs · No credit card · Setup in 60 seconds
          </p>
        </div>

        {/* Right: mockup */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <HeroMockup />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Social proof
───────────────────────────────────────────────── */
function SocialProof() {
  return (
    <div
      className="border-y"
      style={{
        background: 'rgba(255,255,255,0.01)',
        borderColor: 'rgba(255,255,255,0.055)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Avatars + count */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {['#3b5', '#6af', '#f96', '#a7f', '#fc6'].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2"
                style={{ background: c + '33', color: c, border: `2px solid ${BG}`, boxShadow: `0 0 0 2px ${BG}` }}
              >
                {['JD', 'SA', 'MK', 'LP', 'RO'][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">400+ teams trust PageWatch</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Agencies · Founders · Compliance teams
            </p>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="max-w-sm text-center sm:text-right">
          <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
            &ldquo;PageWatch caught a broken checkout on a client site within 40 minutes of it going
            live. I was the one who told them.&rdquo;
          </p>
          <cite className="text-xs not-italic mt-1 block" style={{ color: 'rgba(255,255,255,0.28)' }}>
            — Sarah A., Senior Dev, Pixel Studio
          </cite>
        </blockquote>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Problem section
───────────────────────────────────────────────── */
function Problem() {
  const pains = [
    {
      headline: 'You find out your site broke from a customer.',
      body: 'By the time someone files a support ticket, it\'s been broken for hours. You were the last to know.',
    },
    {
      headline: 'Your competitor quietly changed their pricing.',
      body: 'No announcement. No press release. You\'re still running a comparison deck with their old numbers.',
    },
    {
      headline: 'You have no record of what any page looked like.',
      body: 'Screenshots are the audit trail most teams don\'t know they need — until a client or auditor asks.',
    },
  ]

  return (
    <section className="py-28" style={{ background: BG }} id="features">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16" data-animate>
          <p
            className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
            style={{ color: '#00ff88' }}
          >
            The problem
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
            style={{ maxWidth: '520px' }}
          >
            You&apos;re the last to know.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" data-animate data-delay-1>
          {pains.map((p, i) => (
            <div
              key={i}
              className="p-8"
              style={{
                background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                borderLeft: i > 0 ? `1px solid ${BORDER}` : undefined,
              }}
            >
              <div
                className="text-xs font-bold mb-6 tabular-nums"
                style={{ color: 'rgba(255,255,255,0.18)' }}
              >
                0{i + 1}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 leading-snug">{p.headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   How it works
───────────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section
      className="py-28 border-t"
      id="how-it-works"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 text-neon">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Up and running in 90 seconds.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div data-animate data-delay-1>
            <div
              className="rounded-2xl p-6 mb-6 overflow-hidden"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              {/* Mini: URL input */}
              <p className="text-[11px] font-medium mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                ADD URL
              </p>
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,136,0.25)' }}
              >
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  https://
                </span>
                <span className="text-xs font-mono text-white">acme.com/pricing</span>
                <span
                  className="ml-auto w-1.5 h-4 rounded-sm animate-pulse"
                  style={{ background: '#00ff88' }}
                />
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  https://
                </span>
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  competitor.io/pricing
                </span>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00ff88' }}>
              01 — Add a URL
            </div>
            <h3 className="font-semibold text-white mb-2">Paste any public URL.</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              PageWatch derives a display name automatically. No configuration, no setup scripts,
              no API keys to generate.
            </p>
          </div>

          {/* Step 2 */}
          <div data-animate data-delay-2>
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <p className="text-[11px] font-medium mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                SCHEDULE
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Hourly', active: true },
                  { label: 'Daily', active: false },
                  { label: 'Weekly', active: false },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{
                      background: opt.active ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${opt.active ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: opt.active ? '#00ff88' : 'rgba(255,255,255,0.4)' }}
                    >
                      {opt.label}
                    </span>
                    {opt.active && (
                      <div className="w-2 h-2 rounded-full" style={{ background: '#00ff88' }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <p className="text-[11px] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  ALERT THRESHOLD
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: '33%', background: '#00ff88' }} />
                  </div>
                  <span className="text-xs font-mono text-white">5%</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00ff88' }}>
              02 — Set a schedule
            </div>
            <h3 className="font-semibold text-white mb-2">Choose when we check.</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Hourly, daily, or weekly — per URL. Set a sensitivity threshold: 2% catches subtle
              shifts, 15% only fires on major changes.
            </p>
          </div>

          {/* Step 3 */}
          <div data-animate data-delay-3>
            <div
              className="rounded-2xl p-6 mb-6 overflow-hidden"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              {/* Mini email */}
              <p className="text-[11px] font-medium mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                EMAIL ALERT
              </p>
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    From: alerts@pagewatch.app
                  </p>
                  <p className="text-[10px] font-medium text-white mt-0.5">
                    ⚡ acme.com/pricing changed (23.4%)
                  </p>
                </div>
                <div className="px-3 py-2.5">
                  <div className="w-full h-14 rounded-md mb-2 flex items-center justify-center" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)' }}>
                    <span className="text-[10px]" style={{ color: 'rgba(255,120,120,0.7)' }}>diff screenshot attached</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-6 rounded" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                      <p className="text-[9px] text-center leading-6" style={{ color: '#00ff88' }}>View diff →</p>
                    </div>
                    <div className="flex-1 h-6 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-[9px] text-center leading-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Acknowledge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00ff88' }}>
              03 — Get your diff
            </div>
            <h3 className="font-semibold text-white mb-2">An email with the diff attached.</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              The moment a change exceeds your threshold, you get an email with the diff screenshot.
              No dashboard required — the answer is in the email.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Features bento
───────────────────────────────────────────────── */
function Features() {
  return (
    <section
      className="py-28 border-t"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 text-neon">
            Features
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-lg">
            Everything you need to see what changed.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" data-animate data-delay-1>

          {/* 1. Pixel diffs — large card (4 cols) */}
          <div
            className="sm:col-span-2 lg:col-span-4 bento-card rounded-2xl p-6 overflow-hidden"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-semibold text-white mb-1.5">Pixel-perfect diffs</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Every pixel accounted for. The diff image shows exactly what moved — not just that
              something did.
            </p>
            {/* Before/After comparison */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#0d0d0d' }}
            >
              <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {/* Before */}
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    Before
                  </p>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.09)' }} />
                    <div className="h-2 w-4/5 rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div
                      className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        $49 <span style={{ color: 'rgba(255,255,255,0.22)' }}>/month</span>
                      </span>
                    </div>
                    <div className="h-7 w-24 rounded-lg mx-auto" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  </div>
                </div>

                {/* After */}
                <div className="p-4" style={{ background: 'rgba(255,50,50,0.04)' }}>
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    After
                  </p>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-sm" style={{ background: 'rgba(255,255,255,0.09)' }} />
                    <div className="h-2 w-4/5 rounded-sm" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div
                      className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
                      style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,68,68,0.35)' }}
                    >
                      <span className="text-[11px] font-mono" style={{ color: '#ff8080' }}>
                        $79 <span style={{ color: 'rgba(255,120,120,0.6)' }}>/month</span>
                      </span>
                      <span
                        className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: '#ff8080', background: 'rgba(255,68,68,0.15)' }}
                      >
                        +$30
                      </span>
                    </div>
                    <div className="h-7 w-24 rounded-lg mx-auto" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  23.4% of pixels changed
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: '23.4%', background: '#ff4444' }} />
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: '#ff7070' }}>23.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI summary (2 cols) */}
          <div
            className="lg:col-span-2 bento-card rounded-2xl p-6"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-semibold text-white mb-1.5">AI change summary</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Skip the visual hunting. Plain-English description of exactly what changed.
            </p>
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(0,255,136,0.03)',
                border: '1px solid rgba(0,255,136,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(0,255,136,0.6)' }}
                >
                  PageWatch AI
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                The Pro plan price changed from{' '}
                <span
                  className="font-mono px-1 rounded"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}
                >
                  $49
                </span>{' '}
                to{' '}
                <span
                  className="font-mono px-1 rounded"
                  style={{ background: 'rgba(255,68,68,0.12)', color: '#ff8080' }}
                >
                  $79
                </span>
                . The CTA text also changed from &ldquo;Start free&rdquo; to &ldquo;Start trial.&rdquo;
              </p>
            </div>
          </div>

          {/* 3. History (2 cols) */}
          <div
            className="lg:col-span-2 bento-card rounded-2xl p-6"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-semibold text-white mb-1.5">Screenshot history</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Every check is stored. Compare any two snapshots across time.
            </p>
            <div className="space-y-2">
              {[
                { time: 'Today  2:00 PM', change: true,  label: 'CHANGED' },
                { time: 'Today  1:00 PM', change: false, label: 'OK' },
                { time: 'Today 12:00 PM', change: false, label: 'OK' },
                { time: 'Yesterday',      change: false, label: 'OK' },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: row.change ? 'rgba(255,50,50,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${row.change ? 'rgba(255,68,68,0.18)' : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <div
                    className="w-10 h-7 rounded flex-shrink-0"
                    style={{ background: row.change ? 'rgba(255,68,68,0.18)' : 'rgba(255,255,255,0.07)' }}
                  />
                  <span className="text-xs font-mono flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {row.time}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      color:       row.change ? '#ff7070'                     : 'rgba(0,255,136,0.7)',
                      background:  row.change ? 'rgba(255,68,68,0.12)'        : 'rgba(0,255,136,0.07)',
                      border: `1px solid ${row.change ? 'rgba(255,68,68,0.18)' : 'rgba(0,255,136,0.15)'}`,
                    }}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Multi-URL (2 cols) */}
          <div
            className="lg:col-span-2 bento-card rounded-2xl p-6"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-semibold text-white mb-1.5">Monitor everything</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your pages, client sites, competitor pages — all in one workspace.
            </p>
            <div className="space-y-2.5">
              {[
                { url: 'acme.com/pricing',       alert: true,  freq: '1h' },
                { url: 'competitor.io/pricing',  alert: false, freq: '1h' },
                { url: 'client-site.com/',        alert: false, freq: '24h' },
                { url: 'docs.acme.com/api',       alert: false, freq: '7d' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.alert ? '#ff4444' : '#00ff88' }}
                  />
                  <span className="text-xs font-mono flex-1 truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item.url}
                  </span>
                  <span className="text-[11px] flex-shrink-0 font-mono" style={{ color: 'rgba(255,255,255,0.22)' }}>
                    {item.freq}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Scheduling (2 cols) */}
          <div
            className="lg:col-span-2 bento-card rounded-2xl p-6"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h3 className="font-semibold text-white mb-1.5">Flexible scheduling</h3>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Per-URL schedules. Hourly for critical pages, weekly for the rest.
            </p>
            <div className="space-y-2">
              {[
                { label: 'Hourly',  note: 'Critical pages',    active: true  },
                { label: 'Daily',   note: 'Standard coverage', active: false },
                { label: 'Weekly',  note: 'Low-change pages',  active: false },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{
                    background: opt.active ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${opt.active ? 'rgba(0,255,136,0.22)' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: opt.active ? '#00ff88' : 'rgba(255,255,255,0.55)' }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                      {opt.note}
                    </p>
                  </div>
                  {opt.active && (
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00ff88' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Use cases
───────────────────────────────────────────────── */
function UseCases() {
  const cases = [
    {
      label: 'Agencies',
      headline: 'Be the first to know when a client site breaks.',
      body: 'Monitor every site you manage from one workspace. You\'ll spot a broken checkout, a disappeared hero section, or a layout shift before your client does.',
      accent: '#00ff88',
    },
    {
      label: 'Founders',
      headline: 'Watch what your competitors are doing.',
      body: 'Your competitor\'s pricing page, homepage, and feature comparison are live documents. Know when they make a move. Update your pitch deck before your next call.',
      accent: '#00aaff',
    },
    {
      label: 'Compliance',
      headline: 'Build an audit trail automatically.',
      body: 'Timestamped screenshots of every state of every page. When an auditor asks what the site looked like on a given date, you have an answer — with proof.',
      accent: '#aa88ff',
    },
  ]

  return (
    <section
      className="py-28 border-t"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 text-neon">
            Use cases
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Built for anyone who needs to know.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <div
              key={i}
              data-animate
              {...(i === 1 ? { 'data-delay-1': '' } : i === 2 ? { 'data-delay-2': '' } : {})}
              className="bento-card rounded-2xl p-8"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <div
                className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-6"
                style={{ background: c.accent + '14', color: c.accent, border: `1px solid ${c.accent}22` }}
              >
                {c.label}
              </div>
              <h3 className="font-semibold text-white text-lg leading-snug mb-3">{c.headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Final CTA
───────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section
      className="py-32 border-t relative overflow-hidden"
      style={{ background: BG, borderColor: BORDER }}
    >
      {/* Gradient blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,255,136,0.05) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(0,255,136,0.3), transparent)' }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" data-animate>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-6 text-neon">
          Get started
        </p>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white mb-6 leading-none">
          Start watching.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>Stop wondering.</span>
        </h2>
        <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Free forever on 3 URLs. No credit card. Setup in 60 seconds.
        </p>
        <Link
          href="/login"
          className="btn-neon inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base"
        >
          Start for free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{ background: BG, borderColor: BORDER }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: '#00ff88' }}
          >
            <Monitor className="w-3.5 h-3.5" style={{ color: '#0a0a0a' }} />
          </div>
          <span className="text-sm font-semibold text-white">PageWatch</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Log in', href: '/login' },
            { label: 'Dashboard', href: '/dashboard' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          &copy; 2026 PageWatch Inc.
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────
   Page
───────────────────────────────────────────────── */
export default function MarketingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: BG, color: '#fff' }}>
      <ScrollReveal />
      <Nav />
      <Hero />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Features />
      <UseCases />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
