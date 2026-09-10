'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '../supabase/server'
import { assertFeature } from '../entitlements'
import { action } from './action'
import { generateWebhookSecret } from '../webhooks'
import { assertPublicUrl, UrlValidationError } from '../url'

/**
 * Webhook endpoint CRUD for the dashboard settings page.
 *
 * Not in this pass's original file list, but required for `WebhooksCard.tsx`
 * to have anything to call — see this task's final report. Modeled directly
 * on `lib/actions/api-keys.ts` next to it: same `action` builder, same
 * `assertFeature(ctx.entitlements, 'api')` gate, same session-scoped
 * `ctx.supabase` relying on `webhook_endpoints_access` RLS
 * (`supabase/migrations/011_api_keys_webhooks.sql`).
 *
 * A registered endpoint URL is somewhere OUR infrastructure will fetch (from
 * `trigger/tasks/deliver-webhook.ts`), which is exactly the SSRF shape
 * `lib/url.ts#assertPublicUrl` exists to close for monitored URLs — so the
 * same guard is reused here rather than left unchecked just because this
 * isn't a "monitor".
 */

export interface WebhookEndpointRow {
  id: string
  url: string
  description: string | null
  secret: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebhookDeliverySummary {
  id: string
  endpoint_id: string
  event_type: string
  status: 'success' | 'failed'
  response_status: number | null
  error: string | null
  attempt_number: number
  created_at: string
}

/** Validates a webhook target: must parse, must be https, must not point at a private/loopback/metadata address. */
function assertValidWebhookUrl(raw: string): string {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    throw new Error('Enter a valid URL, including https://.')
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Webhook URLs must use https://.')
  }

  try {
    assertPublicUrl(parsed)
  } catch (err) {
    if (err instanceof UrlValidationError) throw new Error(err.message)
    throw err
  }

  parsed.hash = ''
  return parsed.toString()
}

// ─── Create ──────────────────────────────────────────────────────────────────

export const createWebhookEndpoint = action
  .input(
    z.object({
      url: z.string().min(1, 'URL is required').max(2048),
      description: z.string().max(200).optional(),
    })
  )
  .handler(async ({ input, ctx }) => {
    assertFeature(ctx.entitlements, 'api')

    const url = assertValidWebhookUrl(input.url)
    const secret = generateWebhookSecret()

    const { data, error } = await ctx.supabase
      .from('webhook_endpoints')
      .insert({
        workspace_id: ctx.workspaceId,
        url,
        description: input.description?.trim() || null,
        secret,
      })
      .select('id, url, description, secret, is_active, created_at, updated_at')
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/settings')
    return data as WebhookEndpointRow
  })

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Unlike `getApiKeys`, this DOES select `secret` — a webhook secret must be
 * readable from the dashboard so the customer can configure their receiver
 * with it (see `lib/webhooks.ts`'s header comment for why it isn't hashed).
 */
export async function getWebhookEndpoints(workspaceId: string): Promise<WebhookEndpointRow[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('webhook_endpoints')
    .select('id, url, description, secret, is_active, created_at, updated_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as WebhookEndpointRow[]
}

/** Most recent delivery attempts across every endpoint, newest first — what the settings card shows to surface failures. */
export async function getRecentWebhookDeliveries(
  workspaceId: string,
  limit = 20
): Promise<WebhookDeliverySummary[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('webhook_deliveries')
    .select('id, endpoint_id, event_type, status, response_status, error, attempt_number, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as WebhookDeliverySummary[]
}

// ─── Update ──────────────────────────────────────────────────────────────────

export const setWebhookEndpointActive = action
  .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase
      .from('webhook_endpoints')
      .update({ is_active: input.isActive })
      .eq('id', input.id)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/settings')
  })

/** Rotates the signing secret without changing the endpoint URL or its history. */
export const regenerateWebhookSecret = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    const secret = generateWebhookSecret()

    const { data, error } = await ctx.supabase
      .from('webhook_endpoints')
      .update({ secret })
      .eq('id', input.id)
      .select('id, url, description, secret, is_active, created_at, updated_at')
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/settings')
    return data as WebhookEndpointRow
  })

// ─── Delete ──────────────────────────────────────────────────────────────────

export const deleteWebhookEndpoint = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase.from('webhook_endpoints').delete().eq('id', input.id)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/settings')
  })
