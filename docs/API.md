# PageWatch REST API (v1)

The PageWatch API lets you manage monitors, read alerts and snapshots, and
receive alert events as webhooks — everything the dashboard does, scriptable.

Available on the **Business** plan and above. See
[pagewatch.dev/#pricing](https://pagewatch.dev/#pricing) to upgrade.

Base URL:

```
https://app.pagewatch.dev/api/v1
```

---

## Authentication

Every request carries an API key as a bearer token:

```
Authorization: Bearer pw_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Create a key from **Settings → Developer → API keys**. Keys come in two
scopes:

| Scope        | Can do                                                             |
| ------------ | -------------------------------------------------------------------- |
| `read`       | `GET` requests only                                                   |
| `read_write` | Everything `read` can, plus `POST` / `PATCH` / `DELETE`               |

A `read` key used on a mutating endpoint gets `403 read_only_key`.

**The key is shown exactly once**, at creation, in the dashboard. PageWatch
stores only a one-way hash of it — if you lose a key, revoke it and create a
new one. There is no way to retrieve a lost key.

A request with no key, a malformed key, or a revoked key gets `401
unauthorized`.

---

## Envelope

Every response is JSON.

**Success — single resource:**

```json
{ "data": { "...": "..." } }
```

**Success — list (cursor-paginated):**

```json
{ "data": [{ "...": "..." }], "next_cursor": "eyJjcmVhdGVkX2F0Ijoi..." }
```

**Error:**

```json
{ "error": { "code": "validation_error", "message": "Check the request body and try again.", "fields": { "url": ["url is required"] } } }
```

`fields` is present only for validation errors and names the offending field.
`message` is always safe to show a user; it never contains a raw database
error.

### Error codes

| HTTP  | `code`             | Meaning                                                          |
| ----- | ------------------ | ----------------------------------------------------------------- |
| `400` | `invalid_json`      | Request body is not valid JSON                                    |
| `400` | `invalid_pagination`| `limit` or `cursor` is malformed                                  |
| `400` | `invalid_filter`    | A query filter (`status`, `severity`, ...) has a bad value        |
| `401` | `unauthorized`      | Missing, malformed, invalid, or revoked API key                   |
| `403` | `read_only_key`     | A `read`-scoped key was used on a write endpoint                  |
| `403` | `feature_locked`    | The API is not included on your plan                              |
| `403` | `limit_reached`     | A plan limit (monitors, check quota, manual runs/hour) was hit    |
| `403` | `frequency_locked`  | The requested `check_frequency` isn't included on your plan       |
| `404` | `not_found`         | No resource with that id in your workspace                        |
| `409` | `monitor_paused`    | Tried to run a check on a paused monitor                          |
| `422` | `validation_error`  | Body failed schema validation — see `fields`                      |
| `422` | `url_*`             | URL failed normalization (e.g. `url_private_host`, `url_malformed`) |
| `429` | `rate_limited`      | Too many requests this minute — see Rate limits below             |
| `500` | `internal_error`    | Something went wrong on our side                                  |

---

## Rate limits

Enforced per API key, per minute:

| Plan       | Requests / minute |
| ---------- | ------------------ |
| Business   | 120                 |
| Agency     | 300                 |

Every response carries:

```
RateLimit-Limit: 120
RateLimit-Remaining: 117
RateLimit-Reset: 42
```

A `429` additionally carries `Retry-After` (seconds until the window resets).
Back off and retry after that many seconds rather than polling continuously.

---

## Pagination

List endpoints take:

- `limit` — 1 to 100, default 25
- `cursor` — opaque string from a previous response's `next_cursor`

```
GET /v1/monitors?limit=50
GET /v1/monitors?limit=50&cursor=eyJjcmVhdGVkX2F0Ijoi...
```

`next_cursor` is `null` on the last page. There is no offset pagination —
these tables only grow, and an offset page shifts under you as new rows
arrive.

---

## Monitors

### `GET /v1/monitors`

Query params: `limit`, `cursor`, `is_active` (`true`/`false`), `mode`
(`watch`/`archive`).

```bash
curl https://app.pagewatch.dev/api/v1/monitors?is_active=true \
  -H "Authorization: Bearer pw_live_..."
```

```json
{
  "data": [
    {
      "id": "5a9e...",
      "workspace_id": "1f2b...",
      "url": "https://example.com/pricing",
      "name": "example.com/pricing",
      "check_frequency": "daily",
      "check_hour": null,
      "threshold_pct": 5,
      "is_active": true,
      "last_checked_at": "2026-09-10T06:00:00.000Z",
      "watch_description": "Alert me if the price changes",
      "full_page": true,
      "mode": "watch",
      "zones": null,
      "consecutive_failures": 0,
      "last_error": null,
      "last_error_at": null,
      "last_success_at": "2026-09-10T06:00:00.000Z",
      "created_at": "2026-08-01T12:00:00.000Z",
      "updated_at": "2026-09-10T06:00:00.000Z"
    }
  ],
  "next_cursor": null
}
```

### `POST /v1/monitors` — requires `read_write`

```json
{
  "url": "example.com/pricing",
  "name": "Pricing page",
  "check_frequency": "daily",
  "threshold_pct": 5,
  "watch_description": "Alert me if the price or CTA text changes"
}
```

`url` is normalized and safety-checked exactly the way the dashboard's "Add
monitor" form checks it — `https://` is added if missing, and a URL that
resolves to a private, loopback, or cloud-metadata address is rejected with
`422 url_private_host`, the same rule that protects the capture worker from
being pointed at your own infrastructure.

Only `url` is required. Creating a monitor is subject to the same plan
limits as the dashboard (`403 limit_reached` if you're at your monitor
ceiling, `403 frequency_locked` if `check_frequency: "hourly"` isn't on your
plan).

Response: `201` with the created monitor, same shape as the list above.

### `GET /v1/monitors/:id`

### `PATCH /v1/monitors/:id` — requires `read_write`

Body: any subset of `name`, `check_frequency`, `check_hour`, `threshold_pct`,
`watch_description`, `full_page`, `mode`, `zones`, `is_active`. `url` cannot
be changed after creation — delete and recreate the monitor instead.

### `DELETE /v1/monitors/:id` — requires `read_write`

Soft-deletes the monitor (history is retained; the retention job reclaims it
later). Response: `{ "data": { "id": "...", "deleted": true } }`.

### `POST /v1/monitors/:id/checks` — requires `read_write`

Triggers an on-demand check, identical to pressing "Run now" in the
dashboard. Subject to the same monthly check quota and per-hour manual-run
ceiling as the UI.

```bash
curl -X POST https://app.pagewatch.dev/api/v1/monitors/5a9e.../checks \
  -H "Authorization: Bearer pw_live_..."
```

```json
{ "data": { "run_id": "run_9f2c..." } }
```

Response: `202` — the check is queued, not complete. Poll
`GET /v1/monitors/:id` (watch `last_checked_at`) or `GET /v1/alerts` for the
result, or use a webhook.

---

## Alerts

### `GET /v1/alerts`

Query params: `limit`, `cursor`, `status` (`open`/`acknowledged`/`dismissed`),
`severity` (`low`/`medium`/`high`/`critical`), `monitored_url_id`.

```json
{
  "data": [
    {
      "id": "a1b2...",
      "workspace_id": "1f2b...",
      "monitored_url_id": "5a9e...",
      "alert_type": "visual_change",
      "severity": "high",
      "status": "open",
      "title": "Pricing page changed",
      "summary": "12.4% of the page changed.",
      "ai_summary": "The hero price changed from $39/mo to $49/mo.",
      "diff_pct": 12.4,
      "current_snapshot_id": "c3d4...",
      "previous_snapshot_id": "b2c3...",
      "triggered_at": "2026-09-10T06:01:00.000Z",
      "created_at": "2026-09-10T06:01:00.000Z",
      "monitored_urls": { "id": "5a9e...", "url": "https://example.com/pricing", "name": "Pricing page" }
    }
  ],
  "next_cursor": null
}
```

### `GET /v1/alerts/:id`

### `PATCH /v1/alerts/:id` — requires `read_write`

```json
{ "status": "acknowledged" }
```

`status` must be `"acknowledged"` or `"dismissed"` — alerts don't reopen.

---

## Snapshots

### `GET /v1/snapshots`

Query params: `limit`, `cursor`, `monitored_url_id`.

```json
{
  "data": [
    {
      "id": "c3d4...",
      "workspace_id": "1f2b...",
      "monitored_url_id": "5a9e...",
      "taken_at": "2026-09-10T06:00:30.000Z",
      "metadata": { "manual_run": false },
      "content_hash": "9f2c...",
      "created_at": "2026-09-10T06:00:30.000Z"
    }
  ],
  "next_cursor": null
}
```

Snapshot image bytes aren't served directly by this endpoint — the storage
path is internal. Open the monitor in the dashboard to view or download a
capture.

---

## Webhooks

Configure endpoints from **Settings → Developer → Webhooks**. Each endpoint
gets its own signing secret (`whsec_...`).

### Event types

| `type`                | Fired when                          |
| ---------------------- | ------------------------------------ |
| `alert.created`         | A new alert fires on any monitor     |
| `alert.acknowledged`    | An alert is acknowledged              |
| `alert.dismissed`       | An alert is dismissed                 |

### Payload

```json
{
  "id": "evt_...",
  "type": "alert.created",
  "created_at": "2026-09-10T06:01:00.000Z",
  "data": {
    "alert": {
      "id": "a1b2...",
      "severity": "high",
      "status": "open",
      "title": "Pricing page changed",
      "summary": "12.4% of the page changed.",
      "ai_summary": "The hero price changed from $39/mo to $49/mo.",
      "diff_pct": 12.4,
      "triggered_at": "2026-09-10T06:01:00.000Z"
    },
    "monitor": {
      "id": "5a9e...",
      "url": "https://example.com/pricing",
      "name": "Pricing page"
    }
  }
}
```

### Delivery and retries

Every attempt is a `POST` with `Content-Type: application/json`. A failed
attempt (network error, timeout, or a non-2xx response) is retried with
exponential backoff for up to 6 attempts, spread over roughly the next 30
minutes. Retries reuse the same `id` for a given event, so it's safe to
de-duplicate deliveries by `id` on your end.

### Verifying signatures

Every delivery carries two headers:

```
PageWatch-Signature: 5f9a1c2e...            (hex-encoded HMAC-SHA256)
PageWatch-Timestamp: 1757500000              (unix seconds)
```

The signature is `HMAC-SHA256(secret, "{timestamp}.{raw body}")`, hex-encoded
— the same scheme Stripe uses for its webhooks. Verify it before trusting the
payload, and reject anything with a timestamp more than 5 minutes old to
guard against replay:

```js
const crypto = require('crypto')

function verifyPageWatchWebhook(rawBody, signatureHeader, timestampHeader, secret) {
  const timestamp = Number(timestampHeader)
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) {
    return false // missing, malformed, or stale
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  const a = Buffer.from(signatureHeader, 'hex')
  const b = Buffer.from(expected, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)

  // Use the RAW request body string (before JSON.parse) — re-serializing
  // the parsed object can produce different bytes (key order, whitespace)
  // and break the signature.
}
```

```python
import hashlib
import hmac
import time

def verify_pagewatch_webhook(raw_body: str, signature_header: str, timestamp_header: str, secret: str) -> bool:
    try:
        timestamp = int(timestamp_header)
    except (TypeError, ValueError):
        return False
    if abs(time.time() - timestamp) > 300:
        return False

    expected = hmac.new(
        secret.encode(), f"{timestamp}.{raw_body}".encode(), hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature_header, expected)
```

If your framework parses the body before your handler runs (Express's
`express.json()`, for example), configure it to also expose the raw bytes —
signing and verifying must both operate on the exact same bytes that were
sent.
