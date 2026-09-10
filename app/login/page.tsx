'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Monitor, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/api/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-fg">
              <Monitor className="size-4" aria-hidden />
            </span>
            <span className="text-page-title text-text">PageWatch</span>
          </div>
          <p className="text-meta text-text-muted">Visual change alerts for websites</p>
        </Link>

        <Card>
          <CardContent className="p-6">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-2 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-ok-subtle">
                  <CheckCircle2 className="size-5 text-ok" aria-hidden />
                </div>
                <div>
                  <h1 className="text-section-title text-text">Check your email</h1>
                  <p className="mt-1.5 text-ui text-text-muted">
                    We sent a magic link to <span className="text-ui-medium text-text">{email}</span>.
                    Click it to sign in.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-ui text-text-faint underline-offset-4 transition-colors duration-120 hover:text-text-muted hover:underline"
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-page-title text-text">Sign in to PageWatch</h1>
                  <p className="mt-1.5 text-ui text-text-muted">
                    Enter your email to receive a magic link — no password needed.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Field label="Email address" htmlFor="email">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@agency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      prefix={<Mail className="size-3.5" aria-hidden />}
                    />
                  </Field>

                  {error && (
                    <div className="flex items-start gap-2 rounded-md border border-critical/30 bg-critical-subtle p-3 text-ui text-critical">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" loading={loading} disabled={!email} className="w-full">
                    Send magic link
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-meta text-text-faint">
          No password needed · No credit card for trial
        </p>
      </div>
    </div>
  )
}
