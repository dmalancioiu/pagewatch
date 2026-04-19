// import Link from 'next/link'
// import { Monitor, ArrowRight, Check } from 'lucide-react'
// import { ScrollReveal } from '@/components/landing/ScrollReveal'

// export const metadata = {
//   title: 'PageWatch — Know the moment anything changes',
//   description:
//     'PageWatch monitors your pages on a schedule, compares screenshots pixel by pixel, and alerts you the instant something changes.',
// }

// /* ─────────────────────────────────────────────────
//    Light theme constants
// ───────────────────────────────────────────────── */
// const BG      = '#ffffff'
// const SURFACE = '#f5f7fa'
// const SURFACE2 = '#eef1f5'
// const BORDER  = 'rgba(0,0,0,0.08)'
// const TEXT     = '#0f172a'
// const MUTED    = 'rgba(15,23,42,0.55)'
// const DIM      = 'rgba(15,23,42,0.35)'
// const ACCENT   = '#00bb66'   // slightly darker green — readable on white

// /* ─────────────────────────────────────────────────
//    Nav
// ───────────────────────────────────────────────── */
// function Nav() {
//   return (
//     <nav
//       className="fixed top-0 w-full z-50"
//       style={{
//         background: 'rgba(255,255,255,0.9)',
//         backdropFilter: 'blur(16px)',
//         WebkitBackdropFilter: 'blur(16px)',
//         borderBottom: `1px solid ${BORDER}`,
//       }}
//     >
//       <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
//         {/* Logo */}
//         <Link href="/light" className="flex items-center gap-2 flex-shrink-0">
//           <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: ACCENT }}>
//             <Monitor className="w-4 h-4" style={{ color: '#fff' }} />
//           </div>
//           <span className="font-semibold text-sm tracking-tight" style={{ color: TEXT }}>PageWatch</span>
//         </Link>

//         {/* Links */}
//         <div className="hidden md:flex items-center gap-7">
//           {['Features', 'How it works', 'Pricing'].map((l) => (
//             <a
//               key={l}
//               href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
//               className="light-nav-link text-sm font-medium transition-colors"
//             >
//               {l}
//             </a>
//           ))}
//         </div>

//         {/* CTA */}
//         <div className="flex items-center gap-4">
//           <Link href="/login" className="hidden sm:block text-sm font-medium transition-colors" style={{ color: MUTED }}>
//             Log in
//           </Link>
//           <Link
//             href="/login"
//             className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
//             style={{ background: ACCENT }}
//           >
//             Start free
//           </Link>
//         </div>
//       </div>
//     </nav>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Hero diff mockup (light version)
// ───────────────────────────────────────────────── */
// function HeroMockup() {
//   return (
//     <div className="relative hero-5">
//       <div
//         className="absolute -inset-8 rounded-3xl pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,187,102,0.08) 0%, transparent 70%)' }}
//       />

//       <div
//         className="relative rounded-2xl overflow-hidden"
//         style={{ border: '1px solid rgba(0,0,0,0.1)', background: '#f8fafc', boxShadow: '0 20px 60px -12px rgba(0,0,0,0.15)' }}
//       >
//         {/* Browser chrome */}
//         <div
//           className="flex items-center gap-3 px-4 py-2.5"
//           style={{ background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
//         >
//           <div className="flex gap-1.5">
//             <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
//             <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
//             <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
//           </div>
//           <div
//             className="flex-1 flex items-center gap-2 mx-2 px-3 py-1 rounded-md"
//             style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
//           >
//             <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
//             <span className="text-[11px] font-mono truncate" style={{ color: DIM }}>acme.com/pricing</span>
//           </div>
//         </div>

//         {/* Alert banner */}
//         <div
//           className="flex items-center justify-between px-4 py-2"
//           style={{ background: 'rgba(255,50,50,0.06)', borderBottom: '1px solid rgba(255,50,50,0.15)' }}
//         >
//           <div className="flex items-center gap-2">
//             <span className="relative flex h-1.5 w-1.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5555' }} />
//               <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#ff4444' }} />
//             </span>
//             <span className="text-xs font-medium" style={{ color: '#cc3333' }}>Visual change detected</span>
//           </div>
//           <span
//             className="text-[11px] font-semibold px-2 py-0.5 rounded"
//             style={{ color: '#cc3333', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}
//           >
//             23.4% changed
//           </span>
//         </div>

//         {/* Simulated page */}
//         <div style={{ background: '#f8fafc' }}>
//           <div className="flex items-center gap-5 px-5 py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
//             <div className="w-16 h-2.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.1)' }} />
//             <div className="flex gap-4 ml-auto">
//               {[10, 14, 12, 10].map((w, i) => (
//                 <div key={i} className="h-2 rounded-sm" style={{ width: w * 4, background: 'rgba(0,0,0,0.06)' }} />
//               ))}
//               <div className="w-20 h-5 rounded-md" style={{ background: 'rgba(0,0,0,0.07)' }} />
//             </div>
//           </div>

//           <div className="px-5 pt-4 pb-3 text-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
//             <div className="w-20 h-2 rounded-sm mx-auto mb-3" style={{ background: 'rgba(0,0,0,0.08)' }} />
//             <div className="w-52 h-4 rounded-sm mx-auto mb-2" style={{ background: 'rgba(0,0,0,0.12)' }} />
//             <div className="w-40 h-4 rounded-sm mx-auto mb-4" style={{ background: 'rgba(0,0,0,0.08)' }} />
//           </div>

//           {/* Diff region */}
//           <div className="relative px-5 py-4" style={{ background: 'rgba(255,68,68,0.04)' }}>
//             <div className="absolute inset-0 pointer-events-none" style={{ border: '1px solid rgba(255,68,68,0.12)' }} />
//             <div className="grid grid-cols-3 gap-2.5">
//               {[0, 1, 2].map((i) => (
//                 <div
//                   key={i}
//                   className="rounded-lg p-3"
//                   style={{
//                     border:     i === 1 ? '1px solid rgba(255,68,68,0.35)' : '1px solid rgba(0,0,0,0.07)',
//                     background: i === 1 ? 'rgba(255,50,50,0.05)' : 'white',
//                   }}
//                 >
//                   <div className="w-10 h-2 rounded-sm mb-2" style={{ background: 'rgba(0,0,0,0.1)' }} />
//                   <div className="w-8 h-3.5 rounded-sm mb-1" style={{ background: i === 1 ? 'rgba(255,80,80,0.3)' : 'rgba(0,0,0,0.15)' }} />
//                   {[1, 2, 3].map((j) => (
//                     <div key={j} className="w-full h-1.5 rounded-sm mb-1.5" style={{ background: 'rgba(0,0,0,0.06)' }} />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating alert card */}
//       <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 alert-slide" style={{ zIndex: 10 }}>
//         <div
//           className="rounded-xl p-4 min-w-[210px]"
//           style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
//         >
//           <div className="flex items-start gap-3">
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
//               style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)' }}
//             >
//               <span className="text-sm" style={{ color: '#cc3333' }}>⚡</span>
//             </div>
//             <div className="min-w-0">
//               <p className="text-xs font-semibold mb-0.5" style={{ color: TEXT }}>Alert sent</p>
//               <p className="text-[11px] truncate" style={{ color: MUTED }}>acme.com/pricing · now</p>
//               <div className="flex items-center gap-2 mt-2">
//                 <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
//                   <div className="h-full rounded-full" style={{ width: '23.4%', background: '#ff4444' }} />
//                 </div>
//                 <span className="text-[10px] font-semibold" style={{ color: '#cc3333' }}>23.4%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Hero
// ───────────────────────────────────────────────── */
// function Hero() {
//   return (
//     <section className="relative min-h-screen flex flex-col pt-14" style={{ background: BG }}>
//       {/* Light dot grid */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
//           backgroundSize: '26px 26px',
//           maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
//           WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
//         }}
//       />
//       {/* Spotlight */}
//       <div
//         className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,187,102,0.07) 0%, transparent 60%)' }}
//       />

//       <div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-10 py-24 lg:py-32 flex-1">
//         <div className="flex-1 max-w-xl">
//           {/* Badge */}
//           <div
//             className="hero-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-8"
//             style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
//           >
//             <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
//             Monitoring 12,000+ pages
//           </div>

//           <h1 className="hero-2 text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.04] tracking-[-0.03em] mb-6" style={{ color: TEXT }}>
//             Know the moment
//             <br />
//             <span style={{
//               background: `linear-gradient(135deg, ${ACCENT} 0%, #009944 100%)`,
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}>
//               anything changes.
//             </span>
//           </h1>

//           <p className="hero-3 text-lg leading-relaxed mb-10" style={{ color: MUTED }}>
//             PageWatch monitors your pages on a schedule, compares screenshots
//             pixel by pixel, and sends you a diff the instant something shifts.
//           </p>

//           <div className="hero-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
//             <Link
//               href="/login"
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
//               style={{ background: ACCENT }}
//             >
//               Start watching free <ArrowRight className="w-4 h-4" />
//             </Link>
//             <a
//               href="#how-it-works"
//               className="light-btn-wire inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all border"
//             >
//               See how it works
//             </a>
//           </div>

//           <p className="hero-4 text-xs mt-5" style={{ color: DIM }}>
//             Free forever on 3 URLs · No credit card · Setup in 60 seconds
//           </p>
//         </div>

//         <div className="flex-1 w-full max-w-lg lg:max-w-none">
//           <HeroMockup />
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Social proof
// ───────────────────────────────────────────────── */
// function SocialProof() {
//   return (
//     <div className="border-y" style={{ background: SURFACE, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
//         <div className="flex items-center gap-4">
//           <div className="flex -space-x-2.5">
//             {['#3b5', '#6af', '#f96', '#a7f', '#fc6'].map((c, i) => (
//               <div
//                 key={i}
//                 className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
//                 style={{ background: c + '22', color: c, border: `2px solid ${BG}` }}
//               >
//                 {['JD', 'SA', 'MK', 'LP', 'RO'][i]}
//               </div>
//             ))}
//           </div>
//           <div>
//             <p className="text-sm font-semibold" style={{ color: TEXT }}>400+ teams trust PageWatch</p>
//             <p className="text-xs" style={{ color: MUTED }}>Agencies · Founders · Compliance teams</p>
//           </div>
//         </div>
//         <blockquote className="max-w-sm text-center sm:text-right">
//           <p className="text-sm italic" style={{ color: MUTED }}>
//             &ldquo;PageWatch caught a broken checkout on a client site within 40 minutes of it going live. I was the one who told them.&rdquo;
//           </p>
//           <cite className="text-xs not-italic mt-1 block" style={{ color: DIM }}>
//             — Sarah A., Senior Dev, Pixel Studio
//           </cite>
//         </blockquote>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Problem
// ───────────────────────────────────────────────── */
// function Problem() {
//   const pains = [
//     {
//       headline: 'You find out your site broke from a customer.',
//       body: "By the time someone files a support ticket, it's been broken for hours. You were the last to know.",
//     },
//     {
//       headline: 'Your competitor quietly changed their pricing.',
//       body: "No announcement. No press release. You're still running a comparison deck with their old numbers.",
//     },
//     {
//       headline: 'You have no record of what any page looked like.',
//       body: "Screenshots are the audit trail most teams don't know they need — until a client or auditor asks.",
//     },
//   ]

//   return (
//     <section className="py-28" style={{ background: BG }} id="features">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-16" data-animate>
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>
//             The problem
//           </p>
//           <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight" style={{ color: TEXT, maxWidth: 520 }}>
//             You&apos;re the last to know.
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-px" data-animate data-delay-1
//              style={{ background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
//           {pains.map((p, i) => (
//             <div key={i} className="p-8" style={{ background: BG }}>
//               <div className="text-xs font-bold mb-6 tabular-nums" style={{ color: DIM }}>0{i + 1}</div>
//               <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: TEXT }}>{p.headline}</h3>
//               <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{p.body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    How it works
// ───────────────────────────────────────────────── */
// function HowItWorks() {
//   return (
//     <section className="py-28 border-t" id="how-it-works" style={{ background: SURFACE, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-16" data-animate>
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>
//             How it works
//           </p>
//           <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
//             Up and running in 90 seconds.
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {[
//             {
//               step: '01', label: 'Add a URL', headline: 'Paste any public URL.',
//               body: "PageWatch derives a display name automatically. No configuration, no setup scripts, no API keys to generate.",
//               preview: (
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'white', border: `1px solid ${ACCENT}44` }}>
//                     <span className="text-xs font-mono" style={{ color: MUTED }}>https://</span>
//                     <span className="text-xs font-mono" style={{ color: TEXT }}>acme.com/pricing</span>
//                     <span className="ml-auto w-1.5 h-4 rounded-sm animate-pulse" style={{ background: ACCENT }} />
//                   </div>
//                   <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
//                     <span className="text-xs font-mono" style={{ color: DIM }}>https://competitor.io/pricing</span>
//                   </div>
//                 </div>
//               ),
//             },
//             {
//               step: '02', label: 'Set a schedule', headline: 'Choose when we check.',
//               body: "Hourly, daily, or weekly — per URL. Set a sensitivity threshold: 2% catches subtle shifts, 15% only fires on major changes.",
//               preview: (
//                 <div className="space-y-2">
//                   {[{ label: 'Hourly', active: true }, { label: 'Daily', active: false }, { label: 'Weekly', active: false }].map((opt) => (
//                     <div key={opt.label} className="flex items-center justify-between px-3 py-2 rounded-lg"
//                          style={{ background: opt.active ? `${ACCENT}0f` : 'white', border: `1px solid ${opt.active ? ACCENT + '33' : BORDER}` }}>
//                       <span className="text-xs font-medium" style={{ color: opt.active ? ACCENT : MUTED }}>{opt.label}</span>
//                       {opt.active && <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />}
//                     </div>
//                   ))}
//                 </div>
//               ),
//             },
//             {
//               step: '03', label: 'Get your diff', headline: 'An email with the diff attached.',
//               body: "The moment a change exceeds your threshold, you get an email with the diff screenshot. No dashboard required.",
//               preview: (
//                 <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
//                   <div className="px-3 py-2" style={{ background: SURFACE2, borderBottom: `1px solid ${BORDER}` }}>
//                     <p className="text-[10px]" style={{ color: DIM }}>From: alerts@pagewatch.app</p>
//                     <p className="text-[10px] font-medium mt-0.5" style={{ color: TEXT }}>⚡ acme.com/pricing changed (23.4%)</p>
//                   </div>
//                   <div className="px-3 py-2.5 bg-white">
//                     <div className="w-full h-12 rounded-md mb-2 flex items-center justify-center"
//                          style={{ background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.12)' }}>
//                       <span className="text-[10px]" style={{ color: '#cc3333' }}>diff screenshot attached</span>
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="flex-1 h-6 rounded flex items-center justify-center"
//                            style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}33` }}>
//                         <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>View diff →</span>
//                       </div>
//                       <div className="flex-1 h-6 rounded flex items-center justify-center"
//                            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
//                         <span className="text-[9px]" style={{ color: MUTED }}>Acknowledge</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ),
//             },
//           ].map(({ step, label, headline, body, preview }, i) => (
//             <div key={step} data-animate {...(i > 0 ? { [`data-delay-${i}`]: '' } : {})}>
//               <div className="rounded-2xl p-6 mb-6" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//                 <p className="text-[11px] font-medium mb-3" style={{ color: DIM }}>{label.toUpperCase()}</p>
//                 {preview}
//               </div>
//               <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
//                 {step} — {label}
//               </div>
//               <h3 className="font-semibold mb-2" style={{ color: TEXT }}>{headline}</h3>
//               <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Features bento
// ───────────────────────────────────────────────── */
// function Features() {
//   return (
//     <section className="py-28 border-t" style={{ background: BG, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-14" data-animate>
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Features</p>
//           <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-lg" style={{ color: TEXT }}>
//             Everything you need to see what changed.
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" data-animate data-delay-1>
//           {/* Pixel diffs */}
//           <div className="sm:col-span-2 lg:col-span-4 rounded-2xl p-6 overflow-hidden bento-card"
//                style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//             <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Pixel-perfect diffs</h3>
//             <p className="text-sm mb-5" style={{ color: MUTED }}>Every pixel accounted for. The diff image shows exactly what moved.</p>
//             <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, background: SURFACE }}>
//               <div className="grid grid-cols-2 divide-x" style={{ borderColor: BORDER }}>
//                 <div className="p-4">
//                   <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: DIM }}>Before</p>
//                   <div className="space-y-2">
//                     {[1, 0.7, 0.5].map((o, i) => (
//                       <div key={i} className="h-2 rounded-sm" style={{ width: ['100%','80%','60%'][i], background: `rgba(0,0,0,${o * 0.09})` }} />
//                     ))}
//                     <div className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
//                          style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//                       <span className="text-[11px] font-mono" style={{ color: MUTED }}>$49 <span style={{ color: DIM }}>/month</span></span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4" style={{ background: 'rgba(255,50,50,0.03)' }}>
//                   <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: DIM }}>After</p>
//                   <div className="space-y-2">
//                     {[1, 0.7, 0.5].map((o, i) => (
//                       <div key={i} className="h-2 rounded-sm" style={{ width: ['100%','80%','60%'][i], background: `rgba(0,0,0,${o * 0.09})` }} />
//                     ))}
//                     <div className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
//                          style={{ background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,68,68,0.3)' }}>
//                       <span className="text-[11px] font-mono" style={{ color: '#cc3333' }}>
//                         $79 <span style={{ color: '#cc333399' }}>/month</span>
//                       </span>
//                       <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded"
//                             style={{ color: '#cc3333', background: 'rgba(255,68,68,0.1)' }}>+$30</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: `1px solid ${BORDER}` }}>
//                 <span className="text-[11px]" style={{ color: DIM }}>23.4% of pixels changed</span>
//                 <span className="text-[11px] font-semibold" style={{ color: '#cc3333' }}>23.4%</span>
//               </div>
//             </div>
//           </div>

//           {/* AI summary */}
//           <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//             <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>AI change summary</h3>
//             <p className="text-sm mb-5" style={{ color: MUTED }}>Plain-English description of exactly what changed.</p>
//             <div className="rounded-xl p-4" style={{ background: `${ACCENT}09`, border: `1px solid ${ACCENT}22` }}>
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
//                 <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>PageWatch AI</span>
//               </div>
//               <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
//                 The Pro plan price changed from{' '}
//                 <span className="font-mono px-1 rounded" style={{ background: SURFACE2, color: TEXT }}>$49</span>{' '}
//                 to{' '}
//                 <span className="font-mono px-1 rounded" style={{ background: 'rgba(255,68,68,0.08)', color: '#cc3333' }}>$79</span>.
//                 The CTA text also changed from &ldquo;Start free&rdquo; to &ldquo;Start trial.&rdquo;
//               </p>
//             </div>
//           </div>

//           {/* History */}
//           <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//             <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Screenshot history</h3>
//             <p className="text-sm mb-5" style={{ color: MUTED }}>Every check is stored. Compare any two snapshots across time.</p>
//             <div className="space-y-2">
//               {[
//                 { time: 'Today  2:00 PM', change: true,  label: 'CHANGED' },
//                 { time: 'Today  1:00 PM', change: false, label: 'OK' },
//                 { time: 'Today 12:00 PM', change: false, label: 'OK' },
//                 { time: 'Yesterday',      change: false, label: 'OK' },
//               ].map((row, i) => (
//                 <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
//                      style={{
//                        background: row.change ? 'rgba(255,50,50,0.04)' : SURFACE,
//                        border:     `1px solid ${row.change ? 'rgba(255,68,68,0.15)' : BORDER}`,
//                      }}>
//                   <div className="w-10 h-7 rounded flex-shrink-0"
//                        style={{ background: row.change ? 'rgba(255,68,68,0.1)' : SURFACE2 }} />
//                   <span className="text-xs font-mono flex-1" style={{ color: MUTED }}>{row.time}</span>
//                   <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
//                         style={{
//                           color:      row.change ? '#cc3333' : ACCENT,
//                           background: row.change ? 'rgba(255,68,68,0.08)' : `${ACCENT}0f`,
//                           border:     `1px solid ${row.change ? 'rgba(255,68,68,0.15)' : ACCENT + '22'}`,
//                         }}>
//                     {row.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Monitor everything */}
//           <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
//             <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Monitor everything</h3>
//             <p className="text-sm mb-5" style={{ color: MUTED }}>Your pages, client sites, competitor pages — all in one workspace.</p>
//             <div className="space-y-2.5">
//               {[
//                 { url: 'acme.com/pricing',      alert: true  },
//                 { url: 'competitor.io/pricing', alert: false },
//                 { url: 'client-site.com/',       alert: false },
//                 { url: 'docs.acme.com/api',      alert: false },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center gap-2.5">
//                   <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//                         style={{ background: item.alert ? '#ff4444' : ACCENT }} />
//                   <span className="text-xs font-mono flex-1 truncate" style={{ color: MUTED }}>{item.url}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Use cases
// ───────────────────────────────────────────────── */
// function UseCases() {
//   const cases = [
//     {
//       label: 'Agencies',
//       headline: 'Be the first to know when a client site breaks.',
//       body: "Monitor every site you manage from one workspace. You'll spot a broken checkout, a disappeared hero section, or a layout shift before your client does.",
//       accent: ACCENT,
//     },
//     {
//       label: 'Founders',
//       headline: 'Watch what your competitors are doing.',
//       body: "Your competitor's pricing page, homepage, and feature comparison are live documents. Know when they make a move.",
//       accent: '#0088ee',
//     },
//     {
//       label: 'Compliance',
//       headline: 'Build an audit trail automatically.',
//       body: "Timestamped screenshots of every state of every page. When an auditor asks what the site looked like on a given date, you have an answer.",
//       accent: '#7755dd',
//     },
//   ]

//   return (
//     <section className="py-28 border-t" style={{ background: SURFACE, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-14" data-animate>
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Use cases</p>
//           <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
//             Built for anyone who needs to know.
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {cases.map((c, i) => (
//             <div
//               key={i}
//               data-animate
//               {...(i === 1 ? { 'data-delay-1': '' } : i === 2 ? { 'data-delay-2': '' } : {})}
//               className="bento-card rounded-2xl p-8"
//               style={{ background: 'white', border: `1px solid ${BORDER}` }}
//             >
//               <div
//                 className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-6"
//                 style={{ background: c.accent + '14', color: c.accent, border: `1px solid ${c.accent}22` }}
//               >
//                 {c.label}
//               </div>
//               <h3 className="font-semibold text-lg leading-snug mb-3" style={{ color: TEXT }}>{c.headline}</h3>
//               <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{c.body}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Pricing (inline — light-adapted)
// ───────────────────────────────────────────────── */
// function LightPricing() {
//   const plans = [
//     {
//       name: 'Free',
//       price: '$0',
//       period: '/month',
//       desc: 'For personal projects and trying things out.',
//       cta: 'Start for free',
//       highlight: false,
//       features: ['3 monitored URLs', 'Daily checks', '7-day screenshot history', 'Email alerts'],
//     },
//     {
//       name: 'Pro',
//       price: '$29',
//       period: '/month',
//       desc: 'For founders and teams who need real coverage.',
//       cta: 'Start 14-day trial',
//       highlight: true,
//       badge: 'Most popular',
//       features: ['25 monitored URLs', 'Hourly checks', '90-day screenshot history', 'Email alerts', 'AI change summaries', 'Diff image in every alert'],
//     },
//     {
//       name: 'Agency',
//       price: '$79',
//       period: '/month',
//       desc: 'For agencies monitoring client properties at scale.',
//       cta: 'Start 14-day trial',
//       highlight: false,
//       features: ['Unlimited URLs', 'Hourly checks', '365-day screenshot history', 'Email alerts', 'AI change summaries', 'Diff image in every alert', 'Priority support'],
//     },
//   ]

//   return (
//     <section className="py-28 border-t" id="pricing" style={{ background: BG, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-14 text-center" data-animate>
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Pricing</p>
//           <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
//             Simple, transparent pricing.
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <div
//               key={plan.name}
//               className="rounded-2xl p-8 flex flex-col"
//               style={{
//                 background: plan.highlight ? TEXT : 'white',
//                 border:     plan.highlight ? 'none' : `1px solid ${BORDER}`,
//                 boxShadow:  plan.highlight ? '0 20px 60px -12px rgba(15,23,42,0.25)' : 'none',
//               }}
//             >
//               {plan.badge && (
//                 <span
//                   className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 w-fit"
//                   style={{ background: ACCENT, color: 'white' }}
//                 >
//                   {plan.badge}
//                 </span>
//               )}
//               <h3 className="text-lg font-semibold mb-1" style={{ color: plan.highlight ? 'white' : TEXT }}>{plan.name}</h3>
//               <p className="text-sm mb-5" style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : MUTED }}>{plan.desc}</p>
//               <div className="mb-6">
//                 <span className="text-4xl font-bold" style={{ color: plan.highlight ? 'white' : TEXT }}>{plan.price}</span>
//                 <span className="text-sm ml-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.5)' : MUTED }}>{plan.period}</span>
//               </div>
//               <ul className="space-y-3 mb-8 flex-1">
//                 {plan.features.map((f) => (
//                   <li key={f} className="flex items-center gap-2.5">
//                     <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.highlight ? ACCENT : ACCENT }} />
//                     <span className="text-sm" style={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : MUTED }}>{f}</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link
//                 href="/login"
//                 className="block text-center py-3 rounded-xl text-sm font-semibold transition-all"
//                 style={{
//                   background: plan.highlight ? ACCENT : `${ACCENT}14`,
//                   color:      plan.highlight ? 'white' : ACCENT,
//                   border:     plan.highlight ? 'none' : `1px solid ${ACCENT}33`,
//                 }}
//               >
//                 {plan.cta}
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Final CTA
// ───────────────────────────────────────────────── */
// function FinalCTA() {
//   return (
//     <section className="py-32 border-t relative overflow-hidden" style={{ background: SURFACE, borderColor: BORDER }}>
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,187,102,0.06) 0%, transparent 60%)' }}
//       />

//       <div className="max-w-4xl mx-auto px-6 text-center relative z-10" data-animate>
//         <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-6" style={{ color: ACCENT }}>
//           Get started
//         </p>
//         <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] mb-6 leading-none" style={{ color: TEXT }}>
//           Start watching.
//           <br />
//           <span style={{ color: DIM }}>Stop wondering.</span>
//         </h2>
//         <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: MUTED }}>
//           Free forever on 3 URLs. No credit card. Setup in 60 seconds.
//         </p>
//         <Link
//           href="/login"
//           className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90"
//           style={{ background: ACCENT }}
//         >
//           Start for free <ArrowRight className="w-4 h-4" />
//         </Link>
//       </div>
//     </section>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Footer
// ───────────────────────────────────────────────── */
// function Footer() {
//   return (
//     <footer className="border-t py-10" style={{ background: BG, borderColor: BORDER }}>
//       <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
//         <Link href="/light" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
//           <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: ACCENT }}>
//             <Monitor className="w-3.5 h-3.5 text-white" />
//           </div>
//           <span className="text-sm font-semibold" style={{ color: TEXT }}>PageWatch</span>
//         </Link>

//         <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
//           <span style={{ color: DIM }}>Viewing:</span>
//           <span className="font-semibold" style={{ color: ACCENT }}>Light theme preview</span>
//           <span style={{ color: DIM }}>·</span>
//           <Link href="/" className="font-medium transition-colors" style={{ color: MUTED }}>Switch to dark →</Link>
//         </div>

//         <p className="text-xs" style={{ color: DIM }}>&copy; 2026 PageWatch Inc.</p>
//       </div>
//     </footer>
//   )
// }

// /* ─────────────────────────────────────────────────
//    Page
// ───────────────────────────────────────────────── */
// export default function MarketingPageLight() {
//   return (
//     <div className="min-h-screen antialiased" style={{ background: BG, color: TEXT }}>
//       <ScrollReveal />
//       <Nav />
//       <Hero />
//       <SocialProof />
//       <Problem />
//       <HowItWorks />
//       <Features />
//       <UseCases />
//       <LightPricing />
//       <FinalCTA />
//       <Footer />
//     </div>
//   )
// }
import Link from 'next/link'
import { Monitor, ArrowRight, Check } from 'lucide-react'
import { ScrollReveal } from '@/components/landing/ScrollReveal'

export const metadata = {
  title: 'PageWatch — Know the moment anything changes',
  description:
    'PageWatch monitors your pages on a schedule, compares screenshots pixel by pixel, and alerts you the instant something changes.',
}

/* ─────────────────────────────────────────────────
   Light theme constants
───────────────────────────────────────────────── */
const BG = '#ffffff'
const SURFACE = '#f5f7fa'
const SURFACE2 = '#eef1f5'
const BORDER = 'rgba(0,0,0,0.08)'
const TEXT = '#0f172a'
const MUTED = 'rgba(15,23,42,0.55)'
const DIM = 'rgba(15,23,42,0.35)'
const ACCENT = '#00bb66'   // slightly darker green — readable on white
const DANGER = '#ff4444'

function LandingThemeStyles() {
  const css = `
    .light-nav-link { color: rgba(15,23,42,0.55); }
    .light-nav-link:hover { color: ${TEXT}; }

    .light-btn-wire {
      color: ${TEXT};
      background: rgba(255,255,255,0.74);
      border-color: rgba(15,23,42,0.10);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .light-btn-wire:hover {
      transform: translateY(-1px);
      background: #ffffff;
      border-color: rgba(0,187,102,0.22);
      box-shadow: 0 16px 40px -22px rgba(0,0,0,0.22);
    }

    .light-btn-accent:hover {
      transform: translateY(-1px);
      box-shadow: 0 16px 36px -18px rgba(0,187,102,0.55);
    }

    .mockup-glow {
      box-shadow: 0 30px 80px -28px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.8) inset;
    }

    .scan-line {
      animation: scanline 4.8s linear infinite;
    }

    .diff-region::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,68,68,0.04), transparent 45%, rgba(255,68,68,0.05));
      pointer-events: none;
    }

    .alert-slide {
      animation: floatIn 900ms cubic-bezier(.22,1,.36,1) both, hoverFloat 5.4s ease-in-out 900ms infinite;
    }

    .bento-card {
      transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
    }
    .bento-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 24px 48px -28px rgba(15,23,42,0.22);
      border-color: rgba(0,187,102,0.18) !important;
    }

    @keyframes scanline {
      0% { transform: translateY(0); opacity: 0; }
      12% { opacity: 1; }
      88% { opacity: 1; }
      100% { transform: translateY(312px); opacity: 0; }
    }

    @keyframes floatIn {
      from { opacity: 0; transform: translate3d(0, 14px, 0) scale(.96); }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    }

    @keyframes hoverFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .scan-line, .alert-slide { animation: none !important; }
      .bento-card, .light-btn-wire, .light-btn-accent { transition: none !important; }
    }
  `

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

/* ─────────────────────────────────────────────────
   Nav
───────────────────────────────────────────────── */
function Nav() {
  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/light" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: ACCENT }}>
            <Monitor className="w-4 h-4" style={{ color: '#fff' }} />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: TEXT }}>PageWatch</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {['Features', 'How it works', 'Pricing'].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="light-nav-link text-sm font-medium transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium transition-colors" style={{ color: MUTED }}>
            Log in
          </Link>
          <Link
            href="/login"
            className="light-btn-accent px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: ACCENT }}
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────
   Hero diff mockup (light version)
───────────────────────────────────────────────── */
function HeroMockup() {
  return (
    <div className="relative hero-5">
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,187,102,0.08) 0%, transparent 70%)' }}
      />

      <div
        className="relative rounded-2xl overflow-hidden mockup-glow"
        style={{ border: '1px solid rgba(0,0,0,0.1)', background: '#f8fafc', boxShadow: '0 20px 60px -12px rgba(0,0,0,0.15)' }}
      >
        <div
          className="absolute inset-x-0 h-px pointer-events-none z-20 scan-line"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,187,102,0.30), transparent)' }}
        />

        {/* Browser chrome */}
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <div
            className="flex-1 flex items-center gap-2 mx-2 px-3 py-1 rounded-md"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
            <span className="text-[11px] font-mono truncate" style={{ color: DIM }}>acme.com/pricing</span>
          </div>
        </div>

        {/* Alert banner */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: 'rgba(255,50,50,0.06)', borderBottom: '1px solid rgba(255,50,50,0.15)' }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#ff5555' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#ff4444' }} />
            </span>
            <span className="text-xs font-medium" style={{ color: '#cc3333' }}>Visual change detected</span>
          </div>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{ color: '#cc3333', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}
          >
            23.4% changed
          </span>
        </div>

        {/* Simulated page */}
        <div style={{ background: '#f8fafc' }}>
          <div className="flex items-center gap-5 px-5 py-2.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="w-16 h-2.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.1)' }} />
            <div className="flex gap-4 ml-auto">
              {[10, 14, 12, 10].map((w, i) => (
                <div key={i} className="h-2 rounded-sm" style={{ width: w * 4, background: 'rgba(0,0,0,0.06)' }} />
              ))}
              <div className="w-20 h-5 rounded-md" style={{ background: 'rgba(0,0,0,0.07)' }} />
            </div>
          </div>

          <div className="px-5 pt-4 pb-3 text-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="w-20 h-2 rounded-sm mx-auto mb-3" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <div className="w-52 h-4 rounded-sm mx-auto mb-2" style={{ background: 'rgba(0,0,0,0.12)' }} />
            <div className="w-40 h-4 rounded-sm mx-auto mb-4" style={{ background: 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Diff region */}
          <div className="relative px-5 py-4 diff-region" style={{ background: 'rgba(255,68,68,0.04)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ border: '1px solid rgba(255,68,68,0.12)' }} />
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 relative"
                  style={{
                    border: i === 1 ? '1px solid rgba(255,68,68,0.35)' : '1px solid rgba(0,0,0,0.07)',
                    background: i === 1 ? 'rgba(255,50,50,0.05)' : 'white',
                    boxShadow: i === 1 ? '0 10px 24px -20px rgba(255,68,68,0.8)' : 'none',
                  }}
                >
                  {i === 1 && (
                    <div
                      className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: DANGER, color: 'white' }}
                    >
                      CHANGED
                    </div>
                  )}
                  <div className="w-10 h-2 rounded-sm mb-2" style={{ background: 'rgba(0,0,0,0.1)' }} />
                  <div className="w-8 h-3.5 rounded-sm mb-1" style={{ background: i === 1 ? 'rgba(255,80,80,0.3)' : 'rgba(0,0,0,0.15)' }} />
                  <div className="w-12 h-1.5 rounded-sm mb-2.5" style={{ background: 'rgba(0,0,0,0.08)' }} />
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="w-full h-1.5 rounded-sm mb-1.5"
                      style={{ background: i === 1 ? 'rgba(255,80,80,0.12)' : 'rgba(0,0,0,0.06)' }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div
              className="mt-3 flex items-center justify-between px-2 py-1.5 rounded-md relative"
              style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.10)' }}
            >
              <span className="text-[10px]" style={{ color: 'rgba(204,51,51,0.82)' }}>
                23.4% pixels changed, Pro card price updated
              </span>
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: '23.4%', background: DANGER }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 px-5 py-2.5 opacity-50" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="w-12 h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.08)' }} />
            <div className="flex gap-4 ml-auto">
              {[3, 3, 3].map((_, i) => (
                <div key={i} className="w-10 h-1.5 rounded-sm" style={{ background: 'rgba(0,0,0,0.06)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating alert card */}
      <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 alert-slide" style={{ zIndex: 10 }}>
        <div
          className="rounded-xl p-4 min-w-[210px]"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)' }}
            >
              <span className="text-sm" style={{ color: '#cc3333' }}>⚡</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold mb-0.5" style={{ color: TEXT }}>Alert sent</p>
              <p className="text-[11px] truncate" style={{ color: MUTED }}>acme.com/pricing · now</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '23.4%', background: '#ff4444' }} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: '#cc3333' }}>23.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col pt-14" style={{ background: BG }}>
      {/* Light dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />
      {/* Spotlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,187,102,0.07) 0%, transparent 60%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-10 py-24 lg:py-32 flex-1">
        <div className="flex-1 max-w-xl">
          {/* Badge */}
          <div
            className="hero-1 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-8"
            style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}33`, color: ACCENT }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
            Monitoring 12,000+ pages
          </div>

          <h1 className="hero-2 text-5xl sm:text-6xl lg:text-[64px] font-bold leading-[1.04] tracking-[-0.03em] mb-6" style={{ color: TEXT }}>
            Know the moment
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, #009944 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              anything changes.
            </span>
          </h1>

          <p className="hero-3 text-lg leading-relaxed mb-10" style={{ color: MUTED }}>
            PageWatch monitors your pages on a schedule, compares screenshots
            pixel by pixel, and sends you a diff the instant something shifts.
          </p>

          <div className="hero-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/login"
              className="light-btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: ACCENT }}
            >
              Start watching free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="light-btn-wire inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all border"
            >
              See how it works
            </a>
          </div>

          <p className="hero-4 text-xs mt-5" style={{ color: DIM }}>
            Free forever on 3 URLs · No credit card · Setup in 60 seconds
          </p>
        </div>

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
    <div className="border-y" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {['#3b5', '#6af', '#f96', '#a7f', '#fc6'].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: c + '22', color: c, border: `2px solid ${BG}` }}
              >
                {['JD', 'SA', 'MK', 'LP', 'RO'][i]}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: TEXT }}>400+ teams trust PageWatch</p>
            <p className="text-xs" style={{ color: MUTED }}>Agencies · Founders · Compliance teams</p>
          </div>
        </div>
        <blockquote className="max-w-sm text-center sm:text-right">
          <p className="text-sm italic" style={{ color: MUTED }}>
            &ldquo;PageWatch caught a broken checkout on a client site within 40 minutes of it going live. I was the one who told them.&rdquo;
          </p>
          <cite className="text-xs not-italic mt-1 block" style={{ color: DIM }}>
            — Sarah A., Senior Dev, Pixel Studio
          </cite>
        </blockquote>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Problem
───────────────────────────────────────────────── */
function Problem() {
  const pains = [
    {
      headline: 'You find out your site broke from a customer.',
      body: "By the time someone files a support ticket, it's been broken for hours. You were the last to know.",
    },
    {
      headline: 'Your competitor quietly changed their pricing.',
      body: "No announcement. No press release. You're still running a comparison deck with their old numbers.",
    },
    {
      headline: 'You have no record of what any page looked like.',
      body: "Screenshots are the audit trail most teams don't know they need — until a client or auditor asks.",
    },
  ]

  return (
    <section className="py-28" style={{ background: BG }} id="features">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>
            The problem
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight" style={{ color: TEXT, maxWidth: 520 }}>
            You&apos;re the last to know.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" data-animate data-delay-1
          style={{ background: BORDER, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          {pains.map((p, i) => (
            <div key={i} className="p-8" style={{ background: BG }}>
              <div className="text-xs font-bold mb-6 tabular-nums" style={{ color: DIM }}>0{i + 1}</div>
              <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: TEXT }}>{p.headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{p.body}</p>
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
    <section className="py-28 border-t" id="how-it-works" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
            Up and running in 90 seconds.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              step: '01', label: 'Add a URL', headline: 'Paste any public URL.',
              body: "PageWatch derives a display name automatically. No configuration, no setup scripts, no API keys to generate.",
              preview: (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'white', border: `1px solid ${ACCENT}44` }}>
                    <span className="text-xs font-mono" style={{ color: MUTED }}>https://</span>
                    <span className="text-xs font-mono" style={{ color: TEXT }}>acme.com/pricing</span>
                    <span className="ml-auto w-1.5 h-4 rounded-sm animate-pulse" style={{ background: ACCENT }} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
                    <span className="text-xs font-mono" style={{ color: DIM }}>https://competitor.io/pricing</span>
                  </div>
                </div>
              ),
            },
            {
              step: '02', label: 'Set a schedule', headline: 'Choose when we check.',
              body: "Hourly, daily, or weekly — per URL. Set a sensitivity threshold: 2% catches subtle shifts, 15% only fires on major changes.",
              preview: (
                <div className="space-y-2">
                  {[{ label: 'Hourly', active: true }, { label: 'Daily', active: false }, { label: 'Weekly', active: false }].map((opt) => (
                    <div key={opt.label} className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: opt.active ? `${ACCENT}0f` : 'white', border: `1px solid ${opt.active ? ACCENT + '33' : BORDER}` }}>
                      <span className="text-xs font-medium" style={{ color: opt.active ? ACCENT : MUTED }}>{opt.label}</span>
                      {opt.active && <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: '03', label: 'Get your diff', headline: 'An email with the diff attached.',
              body: "The moment a change exceeds your threshold, you get an email with the diff screenshot. No dashboard required.",
              preview: (
                <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="px-3 py-2" style={{ background: SURFACE2, borderBottom: `1px solid ${BORDER}` }}>
                    <p className="text-[10px]" style={{ color: DIM }}>From: alerts@pagewatch.app</p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: TEXT }}>⚡ acme.com/pricing changed (23.4%)</p>
                  </div>
                  <div className="px-3 py-2.5 bg-white">
                    <div className="w-full h-12 rounded-md mb-2 flex items-center justify-center"
                      style={{ background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.12)' }}>
                      <span className="text-[10px]" style={{ color: '#cc3333' }}>diff screenshot attached</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-6 rounded flex items-center justify-center"
                        style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}33` }}>
                        <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>View diff →</span>
                      </div>
                      <div className="flex-1 h-6 rounded flex items-center justify-center"
                        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                        <span className="text-[9px]" style={{ color: MUTED }}>Acknowledge</span>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
          ].map(({ step, label, headline, body, preview }, i) => (
            <div key={step} data-animate {...(i > 0 ? { [`data-delay-${i}`]: '' } : {})}>
              <div className="rounded-2xl p-6 mb-6" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
                <p className="text-[11px] font-medium mb-3" style={{ color: DIM }}>{label.toUpperCase()}</p>
                {preview}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                {step} — {label}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: TEXT }}>{headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{body}</p>
            </div>
          ))}
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
    <section className="py-28 border-t" style={{ background: BG, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-lg" style={{ color: TEXT }}>
            Everything you need to see what changed.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" data-animate data-delay-1>
          {/* Pixel diffs */}
          <div className="sm:col-span-2 lg:col-span-4 rounded-2xl p-6 overflow-hidden bento-card"
            style={{ background: 'white', border: `1px solid ${BORDER}` }}>
            <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Pixel-perfect diffs</h3>
            <p className="text-sm mb-5" style={{ color: MUTED }}>Every pixel accounted for. The diff image shows exactly what moved.</p>
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, background: SURFACE }}>
              <div className="grid grid-cols-2 divide-x" style={{ borderColor: BORDER }}>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: DIM }}>Before</p>
                  <div className="space-y-2">
                    {[1, 0.7, 0.5].map((o, i) => (
                      <div key={i} className="h-2 rounded-sm" style={{ width: ['100%', '80%', '60%'][i], background: `rgba(0,0,0,${o * 0.09})` }} />
                    ))}
                    <div className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
                      style={{ background: 'white', border: `1px solid ${BORDER}` }}>
                      <span className="text-[11px] font-mono" style={{ color: MUTED }}>$49 <span style={{ color: DIM }}>/month</span></span>
                    </div>
                  </div>
                </div>
                <div className="p-4" style={{ background: 'rgba(255,50,50,0.03)' }}>
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: DIM }}>After</p>
                  <div className="space-y-2">
                    {[1, 0.7, 0.5].map((o, i) => (
                      <div key={i} className="h-2 rounded-sm" style={{ width: ['100%', '80%', '60%'][i], background: `rgba(0,0,0,${o * 0.09})` }} />
                    ))}
                    <div className="h-9 w-full rounded-lg mt-3 flex items-center px-3"
                      style={{ background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,68,68,0.3)' }}>
                      <span className="text-[11px] font-mono" style={{ color: '#cc3333' }}>
                        $79 <span style={{ color: '#cc333399' }}>/month</span>
                      </span>
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: '#cc3333', background: 'rgba(255,68,68,0.1)' }}>+$30</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="text-[11px]" style={{ color: DIM }}>23.4% of pixels changed</span>
                <span className="text-[11px] font-semibold" style={{ color: '#cc3333' }}>23.4%</span>
              </div>
            </div>
          </div>

          {/* AI summary */}
          <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
            <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>AI change summary</h3>
            <p className="text-sm mb-5" style={{ color: MUTED }}>Plain-English description of exactly what changed.</p>
            <div className="rounded-xl p-4" style={{ background: `${ACCENT}09`, border: `1px solid ${ACCENT}22` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>PageWatch AI</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                The Pro plan price changed from{' '}
                <span className="font-mono px-1 rounded" style={{ background: SURFACE2, color: TEXT }}>$49</span>{' '}
                to{' '}
                <span className="font-mono px-1 rounded" style={{ background: 'rgba(255,68,68,0.08)', color: '#cc3333' }}>$79</span>.
                The CTA text also changed from &ldquo;Start free&rdquo; to &ldquo;Start trial.&rdquo;
              </p>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
            <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Screenshot history</h3>
            <p className="text-sm mb-5" style={{ color: MUTED }}>Every check is stored. Compare any two snapshots across time.</p>
            <div className="space-y-2">
              {[
                { time: 'Today  2:00 PM', change: true, label: 'CHANGED' },
                { time: 'Today  1:00 PM', change: false, label: 'OK' },
                { time: 'Today 12:00 PM', change: false, label: 'OK' },
                { time: 'Yesterday', change: false, label: 'OK' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    background: row.change ? 'rgba(255,50,50,0.04)' : SURFACE,
                    border: `1px solid ${row.change ? 'rgba(255,68,68,0.15)' : BORDER}`,
                  }}>
                  <div className="w-10 h-7 rounded flex-shrink-0"
                    style={{ background: row.change ? 'rgba(255,68,68,0.1)' : SURFACE2 }} />
                  <span className="text-xs font-mono flex-1" style={{ color: MUTED }}>{row.time}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      color: row.change ? '#cc3333' : ACCENT,
                      background: row.change ? 'rgba(255,68,68,0.08)' : `${ACCENT}0f`,
                      border: `1px solid ${row.change ? 'rgba(255,68,68,0.15)' : ACCENT + '22'}`,
                    }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monitor everything */}
          <div className="lg:col-span-2 rounded-2xl p-6 bento-card" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
            <h3 className="font-semibold mb-1.5" style={{ color: TEXT }}>Monitor everything</h3>
            <p className="text-sm mb-5" style={{ color: MUTED }}>Your pages, client sites, competitor pages — all in one workspace.</p>
            <div className="space-y-2.5">
              {[
                { url: 'acme.com/pricing', alert: true },
                { url: 'competitor.io/pricing', alert: false },
                { url: 'client-site.com/', alert: false },
                { url: 'docs.acme.com/api', alert: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.alert ? '#ff4444' : ACCENT }} />
                  <span className="text-xs font-mono flex-1 truncate" style={{ color: MUTED }}>{item.url}</span>
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
      body: "Monitor every site you manage from one workspace. You'll spot a broken checkout, a disappeared hero section, or a layout shift before your client does.",
      accent: ACCENT,
    },
    {
      label: 'Founders',
      headline: 'Watch what your competitors are doing.',
      body: "Your competitor's pricing page, homepage, and feature comparison are live documents. Know when they make a move.",
      accent: '#0088ee',
    },
    {
      label: 'Compliance',
      headline: 'Build an audit trail automatically.',
      body: "Timestamped screenshots of every state of every page. When an auditor asks what the site looked like on a given date, you have an answer.",
      accent: '#7755dd',
    },
  ]

  return (
    <section className="py-28 border-t" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Use cases</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
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
              style={{ background: 'white', border: `1px solid ${BORDER}` }}
            >
              <div
                className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-6"
                style={{ background: c.accent + '14', color: c.accent, border: `1px solid ${c.accent}22` }}
              >
                {c.label}
              </div>
              <h3 className="font-semibold text-lg leading-snug mb-3" style={{ color: TEXT }}>{c.headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────
   Pricing (inline — light-adapted)
───────────────────────────────────────────────── */
function LightPricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      desc: 'For personal projects and trying things out.',
      cta: 'Start for free',
      highlight: false,
      features: ['3 monitored URLs', 'Daily checks', '7-day screenshot history', 'Email alerts'],
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      desc: 'For founders and teams who need real coverage.',
      cta: 'Start 14-day trial',
      highlight: true,
      badge: 'Most popular',
      features: ['25 monitored URLs', 'Hourly checks', '90-day screenshot history', 'Email alerts', 'AI change summaries', 'Diff image in every alert'],
    },
    {
      name: 'Agency',
      price: '$79',
      period: '/month',
      desc: 'For agencies monitoring client properties at scale.',
      cta: 'Start 14-day trial',
      highlight: false,
      features: ['Unlimited URLs', 'Hourly checks', '365-day screenshot history', 'Email alerts', 'AI change summaries', 'Diff image in every alert', 'Priority support'],
    },
  ]

  return (
    <section className="py-28 border-t" id="pricing" style={{ background: BG, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14 text-center" data-animate>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}>Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: TEXT }}>
            Simple, transparent pricing.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-8 flex flex-col bento-card"
              style={{
                background: plan.highlight ? TEXT : 'white',
                border: plan.highlight ? `1px solid ${ACCENT}22` : `1px solid ${BORDER}`,
                boxShadow: plan.highlight ? '0 24px 60px -18px rgba(15,23,42,0.30)' : '0 10px 30px -24px rgba(15,23,42,0.16)',
              }}
            >
              {plan.badge && (
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 w-fit"
                  style={{ background: ACCENT, color: 'white' }}
                >
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold mb-1" style={{ color: plan.highlight ? 'white' : TEXT }}>{plan.name}</h3>
              <p className="text-sm mb-5" style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : MUTED }}>{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: plan.highlight ? 'white' : TEXT }}>{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.5)' : MUTED }}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.highlight ? ACCENT : ACCENT }} />
                    <span className="text-sm" style={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : MUTED }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="light-btn-accent block text-center py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: plan.highlight ? ACCENT : `${ACCENT}14`,
                  color: plan.highlight ? 'white' : ACCENT,
                  border: plan.highlight ? 'none' : `1px solid ${ACCENT}33`,
                }}
              >
                {plan.cta}
              </Link>
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
    <section className="py-32 border-t relative overflow-hidden" style={{ background: SURFACE, borderColor: BORDER }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,187,102,0.06) 0%, transparent 60%)' }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" data-animate>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-6" style={{ color: ACCENT }}>
          Get started
        </p>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] mb-6 leading-none" style={{ color: TEXT }}>
          Start watching.
          <br />
          <span style={{ color: DIM }}>Stop wondering.</span>
        </h2>
        <p className="text-lg mb-10 max-w-md mx-auto" style={{ color: MUTED }}>
          Free forever on 3 URLs. No credit card. Setup in 60 seconds.
        </p>
        <Link
          href="/login"
          className="light-btn-accent inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90"
          style={{ background: ACCENT }}
        >
          Start for free <ArrowRight className="w-4 h-4" />
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
    <footer className="border-t py-10" style={{ background: BG, borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/light" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: ACCENT }}>
            <Monitor className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>PageWatch</span>
        </Link>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-5">
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
                style={{ color: MUTED }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: SURFACE2, border: `1px solid ${BORDER}` }}>
            <span style={{ color: DIM }}>Viewing:</span>
            <span className="font-semibold" style={{ color: ACCENT }}>Light theme preview</span>
            <span style={{ color: DIM }}>·</span>
            <Link href="/" className="font-medium transition-colors" style={{ color: MUTED }}>Switch to dark →</Link>
          </div>
        </div>

        <p className="text-xs" style={{ color: DIM }}>&copy; 2026 PageWatch Inc.</p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────
   Page
───────────────────────────────────────────────── */
export default function MarketingPageLight() {
  return (
    <div className="min-h-screen antialiased" style={{ background: BG, color: TEXT }}>
      <LandingThemeStyles />
      <ScrollReveal />
      <Nav />
      <Hero />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Features />
      <UseCases />
      <LightPricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
