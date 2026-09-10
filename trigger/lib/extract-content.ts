import { logger } from '@trigger.dev/sdk/v3'
import type { Page } from 'playwright'
import type { PageExtract } from '../../lib/content-diff'

// Caps mirror the ones documented on `PageExtract` in lib/content-diff.ts.
// Kept here (not exported) because they're an extraction-time concern, not a
// diffing concern - a 400-price-string page must not produce a multi-MB
// `screenshot_snapshots` row, regardless of what the diff later does with it.
const MAX_TEXT_CHARS = 40_000
const MAX_HEADINGS = 300
const MAX_PRICES = 150
const MAX_LINKS = 40
const MAX_JSONLD = 20

type BrowserExtract = Omit<PageExtract, 'extractedAt'>

interface ExtractCaps {
  maxTextChars: number
  maxHeadings: number
  maxPrices: number
  maxLinks: number
  maxJsonLd: number
}

/**
 * Runs entirely inside the page (`page.evaluate`) - everything it needs must
 * be self-contained, since Playwright serializes this function and executes
 * it in the browser context. One pass over the DOM produces title/meta,
 * headings, visible text, JSON-LD, prices-with-labels, prominent CTA links,
 * and a structure hash, so a capture pays one evaluate() round-trip instead
 * of one per field.
 */
function browserExtract(caps: ExtractCaps): BrowserExtract {
  const { maxTextChars, maxHeadings, maxPrices, maxLinks, maxJsonLd } = caps

  // Elements whose text is never part of what a visitor reads - script/style
  // payloads and noscript fallbacks would otherwise show up as "page text"
  // and produce phantom changes on every deploy that touches a bundle hash.
  // SVG is excluded too: icon/logo SVGs frequently embed <title>/<text> that
  // is not reader-facing copy.
  const EXCLUDE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'])

  function isVisible(el: Element): boolean {
    const style = window.getComputedStyle(el)
    if (!style) return true
    if (style.display === 'none' || style.visibility === 'hidden') return false
    if (Number(style.opacity) === 0) return false
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return false
    return true
  }

  // A "label" for a nearby price is either a real heading, or an element
  // whose class/id names it as a plan/tier/product title - pricing tables
  // are built with the second shape at least as often as the first.
  function isLabelCandidate(el: Element): boolean {
    if (/^H[1-6]$/.test(el.tagName)) return true
    const cls = `${el.className?.toString() ?? ''} ${el.id ?? ''}`
    return /plan|tier|price-?title|pricing-?title|product-?name|package-?name/i.test(cls)
  }

  // Symbol-prefixed ("$1,299.00", "€49", "£9.99/mo") and code-suffixed
  // ("29 USD") forms in one pass. Each alternative carries its own optional
  // "/mo" style billing-period suffix since that suffix can follow either
  // shape.
  const PRICE_RE =
    /([$€£¥₹])\s?(\d[\d,]*(?:\.\d{1,2})?)(?:\s*\/\s*(mo|month|yr|year|wk|week))?|(\d[\d,]*(?:\.\d{1,2})?)\s?(USD|EUR|GBP|JPY|INR|CAD|AUD)\b(?:\s*\/\s*(mo|month|yr|year|wk|week))?/gi
  const SYMBOL_CURRENCY: Record<string, string> = { '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '₹': 'INR' }

  const textParts: string[] = []
  const prices: BrowserExtract['prices'] = []
  let currentLabel = ''
  let truncated = false

  const root = document.body ?? document.documentElement

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return NodeFilter.FILTER_ACCEPT
      const el = node as Element
      // FILTER_REJECT prunes the whole subtree - a hidden or excluded
      // container's text nodes are never visited at all, so there is no
      // separate per-text-node visibility check needed below.
      if (EXCLUDE_TAGS.has(el.tagName) || !isVisible(el)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (isLabelCandidate(el)) {
        const t = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
        // A long "heading" is more likely a mis-tagged content block than a
        // plan/tier name - don't let it become every subsequent price's label.
        if (t && t.length <= 80) currentLabel = t
      }
      continue
    }

    const raw = node.textContent ?? ''
    if (raw.trim()) textParts.push(raw)

    if (prices.length < maxPrices) {
      PRICE_RE.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = PRICE_RE.exec(raw))) {
        let amountStr: string | undefined
        let currency: string | undefined
        if (m[1]) {
          amountStr = m[2]
          currency = SYMBOL_CURRENCY[m[1]]
        } else {
          amountStr = m[4]
          currency = m[5]?.toUpperCase()
        }
        if (!amountStr || !currency) continue
        const amount = Number(amountStr.replace(/,/g, ''))
        if (Number.isNaN(amount)) continue
        prices.push({ raw: m[0].trim(), amount, currency, label: currentLabel })
        if (prices.length >= maxPrices) {
          truncated = true
          break
        }
      }
    }
  }

  let text = textParts.join(' ').replace(/\s+/g, ' ').trim()
  if (text.length > maxTextChars) {
    text = text.slice(0, maxTextChars)
    truncated = true
  }

  const headings: BrowserExtract['headings'] = []
  for (const el of Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))) {
    if (!isVisible(el)) continue
    const t = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!t) continue
    headings.push({ level: Number(el.tagName[1]), text: t })
    if (headings.length >= maxHeadings) {
      truncated = true
      break
    }
  }

  const jsonLd: unknown[] = []
  for (const el of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
    if (jsonLd.length >= maxJsonLd) {
      truncated = true
      break
    }
    // A malformed JSON-LD block is common (hand-edited templates, truncated
    // by a CMS) and must not take down the whole extract - skip just that
    // block.
    try {
      jsonLd.push(JSON.parse(el.textContent ?? ''))
    } catch {
      // ignore malformed block
    }
  }

  // Buttons and prominent CTAs only - a full nav/footer link dump is mostly
  // noise and would swamp the array cap with things nobody watches for.
  const LINK_SELECTOR = 'a.button, a.btn, a[class*="cta" i], a[role="button"], a[class*="btn" i], button a'
  const links: BrowserExtract['links'] = []
  const seen = new Set<string>()
  for (const el of Array.from(document.querySelectorAll(LINK_SELECTOR))) {
    if (links.length >= maxLinks) {
      truncated = true
      break
    }
    if (!isVisible(el)) continue
    const href = el.getAttribute('href') ?? ''
    const t = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!t) continue
    const key = `${href}|${t}`
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ href, text: t })
  }

  // Stable outline hash: tag name + depth only, no text - so a layout change
  // (a column added to a pricing table, a section reordered) is detectable
  // even when the copy inside every element is identical, independent of the
  // text/price diff entirely.
  function structureHash(): string {
    let outline = ''
    function walk(el: Element | null, depth: number) {
      if (!el) return
      if (EXCLUDE_TAGS.has(el.tagName)) return
      outline += `${el.tagName}${depth};`
      for (const child of Array.from(el.children)) walk(child, depth + 1)
    }
    walk(root, 0)
    // djb2 - cheap, deterministic, and stable across runs. Not a security
    // hash, just a fast "did the outline change at all" fingerprint.
    let hash = 5381
    for (let i = 0; i < outline.length; i++) hash = ((hash << 5) + hash + outline.charCodeAt(i)) | 0
    return String(hash >>> 0)
  }

  return {
    title: document.title ?? '',
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    lang: document.documentElement.lang ?? '',
    headings,
    text,
    jsonLd,
    prices,
    links,
    structureHash: structureHash(),
    truncated,
  }
}

/**
 * Extracts structure and text from the current page state: title/meta,
 * headings, visible text, JSON-LD, prices with their nearest label, and
 * prominent CTA links, plus a stable hash of the DOM outline.
 *
 * Extraction must never fail a capture - a screenshot is still worth having
 * even when this can't run (a mid-page JS error, a detached frame, a page
 * that throws inside a getter). Every failure path here returns null, and
 * callers treat null exactly like "no previous extract exists": the content
 * diff degrades to empty and the pixel-diff pipeline is completely
 * untouched.
 */
export async function extractContent(page: Page): Promise<PageExtract | null> {
  try {
    const caps: ExtractCaps = {
      maxTextChars: MAX_TEXT_CHARS,
      maxHeadings: MAX_HEADINGS,
      maxPrices: MAX_PRICES,
      maxLinks: MAX_LINKS,
      maxJsonLd: MAX_JSONLD,
    }
    const result = await page.evaluate(browserExtract, caps)
    return { ...result, extractedAt: new Date().toISOString() }
  } catch (err) {
    logger.warn('Content extraction failed. Continuing with screenshot only', { err })
    return null
  }
}
