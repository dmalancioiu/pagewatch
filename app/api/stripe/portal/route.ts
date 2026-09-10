import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

/**
 * Opens the Stripe billing portal for the caller's workspace.
 *
 * Until this existed there was no way for a customer to cancel, change plan, or
 * update a card without emailing us — which is both a support burden and, in
 * several jurisdictions, a compliance problem. Stripe hosts the whole flow; we
 * only mint a session for the right customer.
 *
 * Everything the portal can do (cancel, switch plan, update payment method)
 * comes back as a webhook, so no state is written here.
 */
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Billing is not configured.' }, { status: 503 })
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS scopes this to workspaces the caller belongs to, so a row coming back
  // at all proves they may manage it.
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(id, stripe_customer_id)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const workspace = membership?.workspaces as
    | { id: string; stripe_customer_id: string | null }
    | undefined

  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found.' }, { status: 400 })
  }

  // A workspace that never checked out has no Stripe customer. That is not an
  // error — there is simply nothing to manage yet.
  if (!workspace.stripe_customer_id) {
    return NextResponse.json(
      { error: 'This workspace has no billing history yet.' },
      { status: 400 }
    )
  }

  // Honour the caller's current page so the portal returns them where they were.
  let returnUrl = `${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
  const body = await request.json().catch(() => null)
  if (typeof body?.returnPath === 'string' && body.returnPath.startsWith('/')) {
    // Only a same-origin path is accepted; an absolute URL here would be an
    // open redirect out of our own billing flow.
    returnUrl = `${env.NEXT_PUBLIC_APP_URL}${body.returnPath}`
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: workspace.stripe_customer_id,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe] billing portal session failed', err)
    return NextResponse.json({ error: 'Could not open the billing portal.' }, { status: 500 })
  }
}
