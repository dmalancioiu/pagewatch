import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'
import { PLANS, isPlanId, type PlanId } from '@/lib/plans'

/**
 * Creates a Stripe Checkout session for a paid plan.
 *
 * The plan id is validated against `lib/plans.ts` rather than a local union.
 * This route previously accepted `"starter" | "agency"` — values that exist in
 * neither the plan catalog nor the database's check constraint — which is how
 * the pricing page, checkout and the schema came to disagree about what a plan
 * is even called.
 */

/** Which env var holds each self-serve plan's recurring price. */
const PRICE_ENV: Partial<Record<PlanId, string | undefined>> = {
  pro: env.STRIPE_PRO_PRICE_ID,
  business: env.STRIPE_BUSINESS_PRICE_ID,
  agency: env.STRIPE_AGENCY_PRICE_ID,
}

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

  const body = await request.json().catch(() => null)
  const plan = body?.plan

  if (!isPlanId(plan) || plan === 'free') {
    return NextResponse.json({ error: 'Unknown plan.' }, { status: 400 })
  }

  if (!PLANS[plan].selfServe) {
    return NextResponse.json(
      { error: `${PLANS[plan].name} is not available for self-serve checkout.` },
      { status: 400 }
    )
  }

  const priceId = PRICE_ENV[plan]
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price is configured for the ${PLANS[plan].name} plan.` },
      { status: 503 }
    )
  }

  // Reuse the workspace's existing Stripe customer when there is one. Passing a
  // bare email instead creates a duplicate customer on every return visit and
  // splits their billing history in two.
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      ...(workspace.stripe_customer_id
        ? { customer: workspace.stripe_customer_id }
        : { customer_email: user.email }),
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/#pricing`,
      // The webhook reads these to know what to apply and to whom. Plans live
      // on the workspace, so the workspace id is the one that matters.
      metadata: {
        workspace_id: workspace.id,
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: { workspace_id: workspace.id, plan },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe] checkout session failed', err)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
