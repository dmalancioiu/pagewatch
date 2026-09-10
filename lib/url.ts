/**
 * URL normalization and safety checks.
 *
 * Pure and isomorphic — the Next app validates on input, and the Trigger.dev
 * worker re-validates immediately before navigating. Both matter: the worker
 * runs with network access the browser does not have, so a URL that was safe
 * when it was saved must be checked again when it is used.
 */

export class UrlValidationError extends Error {
  readonly reason:
    | 'empty'
    | 'malformed'
    | 'unsupported_protocol'
    | 'private_host'
    | 'too_long'

  constructor(reason: UrlValidationError['reason'], message: string) {
    super(message)
    this.name = 'UrlValidationError'
    this.reason = reason
  }
}

/** Storage and display both get unhappy well before this. */
const MAX_URL_LENGTH = 2048

/**
 * Hostnames that must never be fetched.
 *
 * The capture worker runs inside our infrastructure, so a monitor pointed at a
 * loopback or link-local address is a server-side request forgery: it would
 * screenshot an internal service — or a cloud metadata endpoint holding
 * credentials — and hand the PNG back to whoever created the monitor.
 */
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  // AWS / GCP / Azure instance metadata.
  'metadata',
  'metadata.google.internal',
  'instance-data',
])

/** Suffixes that only ever resolve inside a private network. */
const BLOCKED_SUFFIXES = ['.local', '.internal', '.localdomain', '.home.arpa']

/**
 * True for IP literals that are not routable on the public internet:
 * loopback, RFC1918 private ranges, link-local (including 169.254.169.254,
 * the cloud metadata address), and carrier-grade NAT.
 */
function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split('.')
  if (parts.length !== 4) return false

  const octets = parts.map((part) => Number(part))
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false
  }

  const [a, b] = octets

  if (a === 0) return true // "this network"
  if (a === 10) return true // 10.0.0.0/8
  if (a === 127) return true // loopback
  if (a === 169 && b === 254) return true // link-local + metadata
  if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
  if (a === 192 && b === 168) return true // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
  if (a >= 224) return true // multicast + reserved

  return false
}

function isPrivateIpv6(hostname: string): boolean {
  const address = hostname.replace(/^\[|\]$/g, '').toLowerCase()

  if (address === '::1' || address === '::') return true
  // Unique-local (fc00::/7) and link-local (fe80::/10).
  if (/^f[cd][0-9a-f]{2}:/.test(address)) return true
  if (/^fe[89ab][0-9a-f]:/.test(address)) return true

  // IPv4-mapped (::ffff:0:0/96) — unwrap and re-check against the v4 rules.
  //
  // Two spellings reach us. A hand-written URL may carry the dotted tail
  // (`::ffff:169.254.169.254`), but `new URL()` normalizes that to two hex
  // groups (`::ffff:a9fe:a9fe`) before we ever see it — so matching only the
  // dotted form silently never fires, which is exactly the hole that let
  // mapped cloud-metadata addresses through this check.
  const mappedDotted = address.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/)
  if (mappedDotted) return isPrivateIpv4(mappedDotted[1])

  const mappedHex = address.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (mappedHex) {
    const high = parseInt(mappedHex[1], 16)
    const low = parseInt(mappedHex[2], 16)
    const dotted = [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.')
    return isPrivateIpv4(dotted)
  }

  return false
}

/** True for a hostname the URL parser rendered as an IPv6 literal. */
function isIpv6Literal(hostname: string): boolean {
  return hostname.startsWith('[') && hostname.endsWith(']')
}

/**
 * Rejects a URL the capture worker must not fetch.
 *
 * This blocks literal private hosts only. A public hostname that *resolves* to
 * a private address (DNS rebinding) still gets through — closing that requires
 * resolving at capture time and pinning the address, which belongs in the
 * worker's request interceptor.
 */
export function assertPublicUrl(parsed: URL): void {
  const hostname = parsed.hostname.toLowerCase()

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new UrlValidationError('private_host', `${parsed.hostname} is not reachable.`)
  }

  if (BLOCKED_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    throw new UrlValidationError('private_host', `${parsed.hostname} is not a public address.`)
  }

  if (isPrivateIpv4(hostname) || isPrivateIpv6(hostname)) {
    throw new UrlValidationError(
      'private_host',
      `${parsed.hostname} is a private address. Monitors must point at publicly reachable pages.`
    )
  }

  // A bare hostname with no dot is either a local machine name or a search
  // term someone typed by mistake. IPv6 literals are exempt: no IPv6 address
  // rendered by the URL parser contains a dot, so applying this check to them
  // would reject every public IPv6 target as malformed.
  if (!isIpv6Literal(hostname) && !hostname.includes('.')) {
    throw new UrlValidationError('malformed', `"${parsed.hostname}" is not a valid domain.`)
  }
}

/**
 * Normalizes user input into a URL safe to store and capture.
 *
 * Adds `https://` when no protocol is given, strips the fragment (never
 * affects what is rendered server-side), and validates the host.
 *
 * @throws {UrlValidationError} for anything that cannot be monitored.
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()

  if (!trimmed) {
    throw new UrlValidationError('empty', 'Enter a URL.')
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    throw new UrlValidationError('too_long', 'That URL is too long to monitor.')
  }

  // Schemes that must be refused as protocols rather than mangled into a
  // hostname. Checked explicitly, because a generic `scheme:` test cannot tell
  // `javascript:alert(1)` from `example.com:8080` — both match it.
  if (/^(javascript|data|file|blob|about|vbscript|mailto|tel|ftp|wss?):/i.test(trimmed)) {
    throw new UrlValidationError(
      'unsupported_protocol',
      'Only http and https pages can be monitored.'
    )
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    throw new UrlValidationError('malformed', `"${raw}" is not a valid URL.`)
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new UrlValidationError(
      'unsupported_protocol',
      'Only http and https pages can be monitored.'
    )
  }

  assertPublicUrl(parsed)

  // The fragment never reaches the server and never changes the render.
  parsed.hash = ''

  return parsed.toString()
}

/**
 * A readable default monitor name: `example.com/pricing`, or just the host for
 * a root URL. Users rename these constantly, so it only has to be recognizable.
 */
export function deriveMonitorName(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const host = hostname.replace(/^www\./, '')
    const path = pathname.replace(/\/$/, '')
    return path ? `${host}${path}` : host
  } catch {
    return url
  }
}
