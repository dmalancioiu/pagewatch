import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPlanId, type PlanId, type PlanStatus } from '@/lib/plans'
import type Stripe from 'stripe'

/**
 * Stripe webhook.
 *
 * Two things this endpoint gets wrong easily, and both were wrong before:
 *
 * 1. It used to write plan values (`starter`, `trial`) that violate the
 *    database's check constraint. The write threw, the error was swallowed, and
 *    the handler still returned 200 — so Stripe never retried, the customer's
 *    card was charged, and their plan silently never changed.
 * 2. Plans live on the workspace, not the user. Writing to `profiles` could not
 *    answer "what is this tenant allowed to do" once a workspace had two members.
 *
 * A failed write now returns a non-2xx so Stripe retries, and every event is
 * recorded first so a retry cannot apply the same change twice.
 */

/** Stripe subscription status → the plan status we store. */
function toPlanStatus(status: Stripe.Subscription.Status): PlanStatus {
  switch (status) {
    case 'trialing':
      return 'trialing'
    case 'active':
      return 'active'
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return 'past_due'
    default:
      // canceled, incomplete_expired, paused
      return 'canceled'
  }
}

function planFromMetadata(metadata: Stripe.Metadata | null | undefined): PlanId | null {
  const value = metadata?.plan
  return isPlanId(value) && value !== 'free' ? value : null
}

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Billing is not configured.' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Idempotency. Stripe retries on any non-2xx, and a retry must not re-apply a
  // change. The insert is the lock: a duplicate event id collides on the primary
  // key and we acknowledge without doing the work twice.
  const { error: seenError } = await supabase
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })

  if (seenError) {
    if (seenError.code === '23505') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('[stripe] could not record event', seenError)
    return NextResponse.json({ error: 'Could not record event.' }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const workspaceId = session.metadata?.workspace_id
        const plan = planFromMetadata(session.metadata)

        if (!workspaceId || !plan) {
          console.warn('[stripe] checkout completed without a usable workspace/plan', {
            eventId: event.id,
          })
          break
        }

        const { error } = await supabase
          .from('workspaces')
          .update({
            plan,
            plan_status: 'active',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', workspaceId)

        if (error) throw new Error(`workspace update failed: ${error.message}`)
        break
      }

      // Plan changes, cancellations scheduled at period end, and dunning all
      // arrive here. Without it, a downgrade or a failed payment never landed.
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const plan = planFromMetadata(subscription.metadata)

        const update: Record<string, unknown> = {
          plan_status: toPlanStatus(subscription.status),
          stripe_subscription_id: subscription.id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }
        if (plan) update.plan = plan
        if (subscription.trial_end) {
          update.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString()
        }

        const { error } = await supabase
          .from('workspaces')
          .update(update)
          .eq('stripe_customer_id', subscription.customer as string)

        if (error) throw new Error(`subscription update failed: ${error.message}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Drop to free rather than stripping access. Entitlements already treat
        // `canceled` as free limits, and the customer keeps their history.
        const { error } = await supabase
          .from('workspaces')
          .update({
            plan: 'free',
            plan_status: 'canceled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer as string)

        if (error) throw new Error(`cancellation failed: ${error.message}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const { error } = await supabase
          .from('workspaces')
          .update({ plan_status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', invoice.customer as string)

        if (error) throw new Error(`dunning update failed: ${error.message}`)
        break
      }

      default:
        // Unhandled event types are acknowledged, not retried.
        break
    }
  } catch (err) {
    // Non-2xx so Stripe retries. The event row is removed first, otherwise the
    // idempotency guard would swallow that retry.
    console.error('[stripe] handler failed', event.type, err)
    await supabase.from('stripe_events').delete().eq('id', event.id)
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
