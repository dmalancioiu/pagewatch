import Link from 'next/link'
import { Monitor } from 'lucide-react'

const LEGAL_LINKS = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/acceptable-use', label: 'Acceptable use' },
  { href: '/subprocessors', label: 'Subprocessors' },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded bg-accent text-accent-fg">
              <Monitor className="size-3.5" aria-hidden />
            </span>
            <span className="text-ui-medium text-text">PageWatch</span>
          </Link>
          <nav className="hidden items-center gap-5 sm:flex" aria-label="Legal">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-meta text-text-muted transition-colors duration-120 hover:text-text"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-6 text-meta text-text-faint sm:px-6">
          <Link href="/" className="hover:text-text-muted">
            ← Back to pagewatch.dev
          </Link>
        </div>
      </footer>
    </div>
  )
}
