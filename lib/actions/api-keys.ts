'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '../supabase/server'
import { assertFeature } from '../entitlements'
import { action } from './action'
import { generateApiKey, type ApiKeyScope } from '../api-keys'

/**
 * API key CRUD for the dashboard settings page.
 *
 * Every mutation runs through `assertFeature(ctx.entitlements, 'api')` before
 * touching the database — Business and above only, per `lib/plans.ts`. Reads
 * and writes both go through `ctx.supabase` / `createServerClient()` (the
 * session-scoped client), so `api_keys_access` RLS
 * (`supabase/migrations/011_api_keys_webhooks.sql`) is the real backstop
 * here, same as every other table in this file's neighbours — unlike
 * `app/api/v1/**`, which has no session and must filter by workspace
 * explicitly against the admin client instead.
 */

export interface ApiKeySummary {
  id: string
  name: string
  key_prefix: string
  scope: ApiKeyScope
  last_used_at: string | null
  revoked_at: string | null
  created_at: string
}

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Mints a new key and returns its plaintext exactly once.
 *
 * This is the only function in the codebase that ever produces a usable key.
 * `key_hash` (not the plaintext) is what gets inserted; the row this reads
 * back afterward (`.select(...)`) deliberately does not include `key_hash`
 * either, so nothing downstream of `generateApiKey()`'s local variable ever
 * holds or logs the secret again once this handler returns.
 */
export const createApiKey = action
  .input(
    z.object({
      name: z.string().min(1, 'Name is required').max(120),
      scope: z.enum(['read', 'read_write']),
    })
  )
  .handler(async ({ input, ctx }) => {
    assertFeature(ctx.entitlements, 'api')

    const generated = generateApiKey()

    const { data, error } = await ctx.supabase
      .from('api_keys')
      .insert({
        workspace_id: ctx.workspaceId,
        name: input.name.trim(),
        key_prefix: generated.displayPrefix,
        key_hash: generated.hash,
        scope: input.scope,
        created_by: ctx.userId,
      })
      .select('id, name, key_prefix, scope, created_at')
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/settings')

    return {
      id: data.id as string,
      name: data.name as string,
      keyPrefix: data.key_prefix as string,
      scope: data.scope as ApiKeyScope,
      createdAt: data.created_at as string,
      /** Shown once, in a dialog, then discarded by the client. Never refetchable. */
      plaintext: generated.plaintext,
    }
  })

// ─── Read ────────────────────────────────────────────────────────────────────

/** Never selects `key_hash` — the list view has no legitimate use for it, even under RLS. */
export async function getApiKeys(workspaceId: string): Promise<ApiKeySummary[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, scope, last_used_at, revoked_at, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as ApiKeySummary[]
}

// ─── Revoke ──────────────────────────────────────────────────────────────────

/**
 * Revokes a key. There is no "un-revoke" and no way to reactivate the same
 * key — `app/api/v1` rejects any request whose `revoked_at` is set, forever.
 * Issue a new key instead.
 */
export const revokeApiKey = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', input.id)
      .is('revoked_at', null)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/settings')
  })
