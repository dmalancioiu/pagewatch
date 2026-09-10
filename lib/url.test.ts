import { describe, it, expect } from 'vitest'
import { normalizeUrl, deriveMonitorName, UrlValidationError } from './url'

function expectRejected(input: string, reason: UrlValidationError['reason']) {
  try {
    normalizeUrl(input)
    throw new Error(`expected "${input}" to be rejected, but it was accepted`)
  } catch (err) {
    expect(err).toBeInstanceOf(UrlValidationError)
    expect((err as UrlValidationError).reason).toBe(reason)
  }
}

describe('normalizeUrl — accepted input', () => {
  it('prepends https:// to a bare domain', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/')
  })

  it('accepts an explicit http:// URL', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('accepts an explicit https:// URL', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('keeps paths, queries and ports intact', () => {
    expect(normalizeUrl('example.com:8080/pricing?utm=abc')).toBe(
      'https://example.com:8080/pricing?utm=abc'
    )
  })

  it('strips the fragment', () => {
    expect(normalizeUrl('https://example.com/page#section-2')).toBe(
      'https://example.com/page'
    )
  })

  it('trims surrounding whitespace before validating', () => {
    expect(normalizeUrl('  example.com  ')).toBe('https://example.com/')
  })
})

describe('normalizeUrl — malformed / empty / protocol', () => {
  it('rejects an empty string', () => {
    expectRejected('', 'empty')
  })

  it('rejects whitespace-only input', () => {
    expectRejected('   ', 'empty')
  })

  // `javascript:` and `data:` URIs have no `//` after the scheme, so a generic
  // "does it look like a protocol" test cannot distinguish them from
  // `example.com:8080` — both match `^[a-z][a-z0-9+.-]*:`. They are therefore
  // refused by an explicit deny list, which also gives callers the right
  // `reason` to branch on when showing an error.
  it('rejects javascript: scheme as unsupported_protocol', () => {
    expectRejected('javascript:alert(1)', 'unsupported_protocol')
  })

  it('rejects data: scheme as unsupported_protocol', () => {
    expectRejected('data:text/html,<script>alert(1)</script>', 'unsupported_protocol')
  })

  it('rejects file: scheme as unsupported_protocol', () => {
    expectRejected('file:///etc/passwd', 'unsupported_protocol')
  })

  it('still accepts a host:port that looks scheme-like', () => {
    expect(normalizeUrl('example.com:8080/pricing')).toBe('https://example.com:8080/pricing')
  })

  it('rejects file: scheme as unsupported_protocol (file:// does match the protocol regex)', () => {
    expectRejected('file:///etc/passwd', 'unsupported_protocol')
  })

  it('rejects a URL over 2048 chars', () => {
    const long = 'https://example.com/' + 'a'.repeat(2048)
    expectRejected(long, 'too_long')
  })

  it('rejects a bare hostname with no dot', () => {
    expectRejected('internalhost', 'malformed')
  })
})

describe('normalizeUrl — private / non-routable hosts (SSRF guard)', () => {
  it('rejects localhost', () => {
    expectRejected('http://localhost', 'private_host')
  })

  it('rejects 127.0.0.1 (loopback)', () => {
    expectRejected('http://127.0.0.1', 'private_host')
  })

  it('rejects 0.0.0.0 ("this network")', () => {
    expectRejected('http://0.0.0.0', 'private_host')
  })

  it('rejects 10.x (RFC1918)', () => {
    expectRejected('http://10.0.0.5', 'private_host')
  })

  it('rejects 172.16.x through 172.31.x (RFC1918)', () => {
    expectRejected('http://172.16.0.1', 'private_host')
    expectRejected('http://172.31.255.255', 'private_host')
    expectRejected('http://172.20.1.1', 'private_host')
  })

  it('ALLOWS 172.15.x and 172.32.x — the classic off-by-one boundary', () => {
    expect(() => normalizeUrl('http://172.15.255.255')).not.toThrow()
    expect(() => normalizeUrl('http://172.32.0.1')).not.toThrow()
  })

  it('rejects 192.168.x (RFC1918)', () => {
    expectRejected('http://192.168.1.1', 'private_host')
  })

  it('rejects 169.254.169.254 — cloud metadata endpoint', () => {
    // This is the single highest-value case in this suite: the metadata
    // endpoint on AWS/GCP/Azure hands back instance credentials to whoever
    // can reach it. If this regresses, an attacker who controls a monitored
    // URL's redirect chain (or gets a user to add this as a target) can have
    // our capture worker screenshot the credentials back to them.
    expectRejected('http://169.254.169.254', 'private_host')
  })

  it('rejects CGNAT 100.64.x', () => {
    expectRejected('http://100.64.0.1', 'private_host')
    expectRejected('http://100.127.255.255', 'private_host')
  })

  it('allows just outside the CGNAT range', () => {
    expect(() => normalizeUrl('http://100.63.255.255')).not.toThrow()
    expect(() => normalizeUrl('http://100.128.0.1')).not.toThrow()
  })

  it('rejects ::1 (IPv6 loopback), bare and bracketed', () => {
    expectRejected('http://[::1]', 'private_host')
  })

  it('rejects fc00::/fd00:: (unique-local IPv6)', () => {
    expectRejected('http://[fc00::1]', 'private_host')
    expectRejected('http://[fd00::1]', 'private_host')
  })

  it('rejects fe80:: (link-local IPv6)', () => {
    expectRejected('http://[fe80::1]', 'private_host')
  })

  // ── LATENT BUG (documented, not fixed — file is out of scope; see task report) ──
  //
  // `isPrivateIpv6`'s IPv4-mapped check only matches a literal dotted-decimal
  // IPv4-mapped IPv6 (::ffff:0:0/96) is the subtle case. `normalizeUrl` inspects
  // `parsed.hostname`, and the WHATWG URL parser always renders a mapped
  // address's tail as two hex groups rather than dotted-decimal:
  //
  //   new URL('http://[::ffff:127.0.0.1]').hostname       -> '[::ffff:7f00:1]'
  //   new URL('http://[::ffff:169.254.169.254]').hostname -> '[::ffff:a9fe:a9fe]'
  //
  // So the guard must decode the hex form. Matching only the dotted spelling
  // silently never fires, and these addresses then survive on nothing but the
  // unrelated "no dot" fallback — which is not an SSRF check and would let
  // cloud metadata through the moment that fallback is reordered.
  it('rejects a mapped loopback address as private_host, not by accident', () => {
    expectRejected('http://[::ffff:127.0.0.1]', 'private_host')
  })

  it('rejects mapped cloud metadata (169.254.169.254) as private_host', () => {
    expectRejected('http://[::ffff:169.254.169.254]', 'private_host')
  })

  it('rejects a mapped RFC1918 address as private_host', () => {
    expectRejected('http://[::ffff:10.0.0.1]', 'private_host')
  })

  // The "no dot means malformed" rule must not apply to IPv6 literals: no IPv6
  // address rendered by the URL parser contains a dot, so applying it there
  // would reject every public IPv6 target and make IPv6-only sites
  // unmonitorable.
  it('accepts a legitimate public IPv6 address (Google DNS)', () => {
    expect(normalizeUrl('http://[2001:4860:4860::8888]')).toContain('2001:4860:4860::8888')
  })

  it('still rejects public-looking IPv6 that is actually unique-local', () => {
    expectRejected('http://[fd00::1]', 'private_host')
  })

  it('rejects .local suffix', () => {
    expectRejected('http://printer.local', 'private_host')
  })

  it('rejects .internal suffix', () => {
    expectRejected('http://service.internal', 'private_host')
  })
})

describe('deriveMonitorName', () => {
  it('strips www. and a trailing slash on the root', () => {
    expect(deriveMonitorName('https://www.example.com/')).toBe('example.com')
  })

  it('keeps a path', () => {
    expect(deriveMonitorName('https://www.example.com/pricing')).toBe(
      'example.com/pricing'
    )
  })

  it('keeps the host as-is when there is no www. prefix', () => {
    expect(deriveMonitorName('https://example.com')).toBe('example.com')
  })

  it('does not throw on garbage input — falls back to the raw string', () => {
    expect(() => deriveMonitorName('not a url at all')).not.toThrow()
    expect(deriveMonitorName('not a url at all')).toBe('not a url at all')
  })
})
