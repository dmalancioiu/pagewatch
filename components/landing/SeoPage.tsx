import Link from 'next/link'
import { ArrowRight, Check, Monitor } from 'lucide-react'

type Section = {
    title: string
    body: string
}

type Faq = {
    question: string
    answer: string
}

type SeoPageProps = {
    eyebrow: string
    title: string
    description: string
    intro: string
    problemTitle: string
    problemBody: string
    features: string[]
    sections: Section[]
    faqs: Faq[]
    ctaTitle: string
    ctaBody: string
}

const BG = '#0a0a0a'
const SURFACE = '#111111'
const BORDER = 'rgba(255,255,255,0.07)'

export function SeoPage({
    eyebrow,
    title,
    description,
    intro,
    problemTitle,
    problemBody,
    features,
    sections,
    faqs,
    ctaTitle,
    ctaBody,
}: SeoPageProps) {
    return (
        <main style={{ background: BG, minHeight: '100vh' }}>
            <section
                style={{
                    borderBottom: `1px solid ${BORDER}`,
                    background:
                        'radial-gradient(ellipse at top, rgba(0,255,136,0.08) 0%, transparent 55%)',
                }}
            >
                <div className="max-w-5xl mx-auto px-6 py-24">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-8 text-sm"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        <Monitor className="w-4 h-4" />
                        PageWatch
                    </Link>

                    <p
                        className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
                        style={{ color: '#00ff88' }}
                    >
                        {eyebrow}
                    </p>

                    <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6"
                        style={{ maxWidth: '900px' }}
                    >
                        {title}
                    </h1>

                    <p
                        className="text-lg leading-relaxed mb-6"
                        style={{ color: 'rgba(255,255,255,0.58)', maxWidth: '760px' }}
                    >
                        {description}
                    </p>

                    <p
                        className="text-base leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '760px' }}
                    >
                        {intro}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-8">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                            style={{
                                background: '#00ff88',
                                color: '#0a0a0a',
                            }}
                        >
                            Start free
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/#pricing"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                            style={{
                                border: `1px solid ${BORDER}`,
                                color: 'white',
                                background: 'rgba(255,255,255,0.02)',
                            }}
                        >
                            View pricing
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <div
                        className="rounded-2xl p-8"
                        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {problemTitle}
                        </h2>
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '760px' }}
                        >
                            {problemBody}
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Why teams use PageWatch</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature) => (
                            <div
                                key={feature}
                                className="rounded-xl p-4 flex items-start gap-3"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${BORDER}`,
                                }}
                            >
                                <Check className="w-5 h-5 mt-0.5" style={{ color: '#00ff88' }} />
                                <p style={{ color: 'rgba(255,255,255,0.78)' }}>{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <div className="space-y-12">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                    {section.title}
                                </h2>
                                <p
                                    className="text-base leading-relaxed"
                                    style={{ color: 'rgba(255,255,255,0.52)', maxWidth: '760px' }}
                                >
                                    {section.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <h2 className="text-3xl font-bold text-white mb-8">FAQ</h2>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div
                                key={faq.question}
                                className="rounded-xl p-5"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${BORDER}`,
                                }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <div
                        className="rounded-2xl p-8"
                        style={{
                            background: 'linear-gradient(180deg, rgba(0,255,136,0.08), rgba(255,255,255,0.02))',
                            border: `1px solid rgba(0,255,136,0.16)`,
                        }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">{ctaTitle}</h2>
                        <p
                            className="text-base leading-relaxed mb-6"
                            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '700px' }}
                        >
                            {ctaBody}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                                style={{ background: '#00ff88', color: '#0a0a0a' }}
                            >
                                Start free
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                                style={{
                                    border: `1px solid ${BORDER}`,
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.02)',
                                }}
                            >
                                Back to homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}