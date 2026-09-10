import { NextRequest } from 'next/server'
import { ApiError, apiErrorResponse, apiList, authenticateApiRequest, encodeCursor, parsePagination } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// `storage_path` is intentionally excluded — it is an internal bucket key,
// not something a customer can do anything useful with, and signing a URL
// for every row on every page would be wasteful for callers that only want
// metadata. A future `?include=signed_url` could add it back per-row if a
// real integration needs it.
const SNAPSHOT_SELECT = 'id, workspace_id, monitored_url_id, taken_at, metadata, content_hash, created_at'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** `GET /v1/snapshots?monitored_url_id=&limit=&cursor=` */
export async function GET(request: NextRequest) {
  try {
    const ctx = await authenticateApiRequest(request)
    const { limit, cursor } = parsePagination(request.nextUrl.searchParams)
    const monitoredUrlId = request.nextUrl.searchParams.get('monitored_url_id')

    if (monitoredUrlId !== null && !UUID_RE.test(monitoredUrlId)) {
      throw new ApiError(400, 'invalid_filter', 'monitored_url_id must be a uuid.', {
        fields: { monitored_url_id: ['must be a uuid'] },
      })
    }

    let query = ctx.admin
      .from('screenshot_snapshots')
      .select(SNAPSHOT_SELECT)
      .eq('workspace_id', ctx.workspaceId)
      .order('taken_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1)

    if (monitoredUrlId) query = query.eq('monitored_url_id', monitoredUrlId)
    if (cursor) {
      // Ordered by `taken_at`, not `created_at` — `encodeCursor`/`decodeCursor`
      // only care that the field is a timestamp, not its name, so reusing
      // them here is safe as long as the same field is used consistently
      // for both the `order()` and the keyset comparison, which it is.
      query = query.or(`taken_at.lt.${cursor.createdAt},and(taken_at.eq.${cursor.createdAt},id.lt.${cursor.id})`)
    }

    const { data, error } = await query
    if (error) {
      console.error('[api/v1/snapshots] list failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not list snapshots.')
    }

    const rows = data ?? []
    const page = rows.slice(0, limit)
    const nextCursor =
      rows.length > limit
        ? encodeCursor({ created_at: (page[page.length - 1] as { taken_at: string }).taken_at, id: (page[page.length - 1] as { id: string }).id })
        : null

    return apiList(page, nextCursor, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
