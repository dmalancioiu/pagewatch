import { logger } from '@trigger.dev/sdk/v3'
import { SupabaseClient } from '@supabase/supabase-js'
import { chromium, type Page } from 'playwright'
import pixelmatch from 'pixelmatch'
import { analyzeWithAI, type ZoneCrop } from './analyze-diff-with-ai'
import { extractContent } from './extract-content'
import { recordUsage } from './entitlements'
import { triggerInstantAlert } from './notify'
import { PLANS, type Plan } from '../../lib/plans'
import { normalizeUrl } from '../../lib/url'
import type { Zone } from '../../lib/types/database.types'
import { decodeToRaw, encodeCaptureWebp, encodeRawWebp, makeThumbnail, cropZoneWebp, type RawImage } from './image'
import { diffExtracts, contentTextHash, type PageExtract } from '../../lib/content-diff'
import { classifyChange, type ClassificationResult } from './classify-change'
import { resolveRouting, type ChangeType } from '../../lib/change-types'

interface ZoneDiffScore {
  label: string
  instruction: string | null
  sensitivity: Zone['sensitivity']
  changed_pixels: number
  total_pixels: number
  diff_pct: number
  alert_score: number
  passes_threshold: boolean
}

const SENSITIVITY_CONFIG: Record<NonNullable<Zone['sensitivity']>, { thresholdPct: number; weight: number }> = {
  low:    { thresholdPct: 5.0, weight: 0.75 },
  normal: { thresholdPct: 1.0, weight: 1.0 },
  high:   { thresholdPct: 0.2, weight: 1.35 },
}

const BLOCKED_DOMAINS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'facebook.net',
  'facebook.com/tr',
  'connect.facebook.net',
  'ads.twitter.com',
  'static.ads-twitter.com',
  'platform.twitter.com',
  'scorecardresearch.com',
  'quantserve.com',
  'moatads.com',
  'adnxs.com',
  'rubiconproject.com',
  'pubmatic.com',
  'openx.net',
  'hotjar.com',
  'mouseflow.com',
  'fullstory.com',
  'logrocket.com',
  'heap.io',
  'segment.com',
  'amplitude.com',
  'mixpanel.com',
]

const CLICK_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '.onetrust-close-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  '#truste-consent-button',
  '.axeptio_btn_acceptAll',
  '.osano-cm-accept-all',
  '.osano-cm-dismiss',
  '.qc-cmp2-summary-buttons button:last-child',
  '#didomi-notice-agree-button',
  '[data-testid="uc-accept-all-button"]',
  '[class*="cookie-banner"] [class*="close"]',
  '[class*="consent-banner"] [class*="close"]',
  '[id*="cookie-banner"] [class*="close"]',
]

const CSS_HIDE_SELECTORS = [
  '#onetrust-banner-sdk',
  '#onetrust-consent-sdk',
  '#CybotCookiebotDialog',
  '#CybotCookiebotDialogBodyUnderlay',
  '.truste_popframe',
  '.truste_overlay',
  '.cc-window',
  '#cookie-law-info-bar',
  '#cookie-notice',
  '.cookie-notice',
  '.cookie-banner',
  '.cookie-bar',
  '.cookie-popup',
  '.gdpr-banner',
  '[id*="cookie-banner"]',
  '[id*="consent-banner"]',
  '[class*="cookie-banner"]',
  '[class*="consent-banner"]',
  '[class*="gdpr-banner"]',
  '[class*="privacy-banner"]',
  '[class*="cookie"]',
  '[id*="cookie"]',
  '[class*="gdpr"]',
  '[id*="gdpr"]',
  '[class*="consent"]',
  '[id*="consent"]',
  '[aria-label*="cookie" i]',
  '[aria-label*="consent" i]',
  '#intercom-container',
  '.intercom-lightweight-app',
  '#drift-widget-container',
  '.drift-frame-controller',
  '.crisp-client',
  '#hubspot-messages-iframe-container',
  '#launcher',
  '#webWidget',
  '#chat-widget-container',
  '#freshworks-container',
  '#fc_frame',
  '#tidio-chat',
  '.tawk-min-container',
  '.klaviyo-form',
  '[class*="klaviyo"]',
  '[id*="klaviyo"]',
  '.optinmonster-optin-wrap',
  '[class*="push-notification"]',
  '[class*="notification-prompt"]',
]

function sensitivityConfig(sensitivity: Zone['sensitivity']) {
  return SENSITIVITY_CONFIG[sensitivity ?? 'normal']
}

function zoneAlertScore(diffPct: number, sensitivity: Zone['sensitivity']): number {
  const { thresholdPct, weight } = sensitivityConfig(sensitivity)
  if (diffPct <= 0) return 0

  const ratio = diffPct / thresholdPct
  const score = Math.log1p(ratio) * 34 * weight
  return Math.max(0, Math.min(100, Number(score.toFixed(1))))
}

function aggregateAlertScore(zoneScores: ZoneDiffScore[], fallbackDiffPct: number): number {
  if (zoneScores.length === 0) {
    return Math.max(0, Math.min(100, Number((Math.log1p(fallbackDiffPct) * 20).toFixed(1))))
  }

  const maxZoneScore = Math.max(...zoneScores.map(z => z.alert_score))
  const avgPassedScore = zoneScores
    .filter(z => z.passes_threshold)
    .reduce((sum, z, _, arr) => sum + z.alert_score / arr.length, 0)
  const multiZoneLift = Math.min(12, zoneScores.filter(z => z.passes_threshold).length * 3)

  return Math.max(0, Math.min(100, Number((maxZoneScore * 0.78 + avgPassedScore * 0.22 + multiZoneLift).toFixed(1))))
}

function diffZone(prevRaw: RawImage, currRaw: RawImage, zone: Zone): { changedPixels: number; totalPixels: number; diffPct: number } | null {
  const srcX = Math.max(0, Math.floor(zone.x * Math.min(prevRaw.width, currRaw.width)))
  const srcY = Math.max(0, Math.floor(zone.y * Math.min(prevRaw.height, currRaw.height)))
  const srcW = Math.min(prevRaw.width - srcX, currRaw.width - srcX, Math.ceil(zone.width * Math.min(prevRaw.width, currRaw.width)))
  const srcH = Math.min(prevRaw.height - srcY, currRaw.height - srcY, Math.ceil(zone.height * Math.min(prevRaw.height, currRaw.height)))

  if (srcW <= 0 || srcH <= 0) return null

  const prevSlice = new Uint8Array(srcW * srcH * 4)
  const currSlice = new Uint8Array(srcW * srcH * 4)

  for (let row = 0; row < srcH; row++) {
    for (let col = 0; col < srcW; col++) {
      const dst = (row * srcW + col) * 4
      const sp = ((srcY + row) * prevRaw.width + (srcX + col)) * 4
      const sc = ((srcY + row) * currRaw.width + (srcX + col)) * 4

      prevSlice[dst] = prevRaw.data[sp]
      prevSlice[dst + 1] = prevRaw.data[sp + 1]
      prevSlice[dst + 2] = prevRaw.data[sp + 2]
      prevSlice[dst + 3] = prevRaw.data[sp + 3]
      currSlice[dst] = currRaw.data[sc]
      currSlice[dst + 1] = currRaw.data[sc + 1]
      currSlice[dst + 2] = currRaw.data[sc + 2]
      currSlice[dst + 3] = currRaw.data[sc + 3]
    }
  }

  // pixelmatch requires an output buffer but we only need the changed-pixel
  // count here - the visualisation image is built once, for the whole page,
  // not per zone.
  const discardOutput = new Uint8Array(srcW * srcH * 4)
  const changedPixels = pixelmatch(prevSlice, currSlice, discardOutput, srcW, srcH, { threshold: 0.1 })
  const totalPixels = srcW * srcH

  return {
    changedPixels,
    totalPixels,
    diffPct: totalPixels > 0 ? (changedPixels / totalPixels) * 100 : 0,
  }
}

/**
 * Cheap prefilter for whether a diff confined to a single edge band is
 * "chrome noise" (sticky header clock, footer year, a re-rendered cookie
 * banner remnant) rather than a real content change.
 *
 * Splits the full-page comparison into 10 equal horizontal bands. Real
 * content changes are essentially never confined to only the very top or
 * very bottom band - so if every changed pixel sits in band 0 or band 9 (and
 * nowhere in between), and the overall diff is small, it's treated as noise.
 * `prevSlice`/`currSlice` are the same row-major RGBA buffers already built
 * for the whole-page pixelmatch pass, sliced by row range per band (a
 * contiguous view - no copy needed).
 */
function isBandedEdgeNoise(prevSlice: Uint8Array, currSlice: Uint8Array, width: number, height: number, pageDiffPct: number): boolean {
  // A diff this large is never just header/footer noise, regardless of where
  // it sits - skip the banding work entirely.
  if (pageDiffPct >= 2 || height < 10) return false

  const bandCount = 10
  const bandHeight = Math.ceil(height / bandCount)
  let sawEdgeChange = false
  let sawMiddleChange = false

  for (let b = 0; b < bandCount; b++) {
    const rowStart = b * bandHeight
    const rowEnd = Math.min(height, rowStart + bandHeight)
    const bandRows = rowEnd - rowStart
    if (bandRows <= 0) continue

    const bandPrev = prevSlice.subarray(rowStart * width * 4, rowEnd * width * 4)
    const bandCurr = currSlice.subarray(rowStart * width * 4, rowEnd * width * 4)
    const discardOutput = new Uint8Array(bandPrev.length)
    const changed = pixelmatch(bandPrev, bandCurr, discardOutput, width, bandRows, { threshold: 0.1 })

    if (changed > 0) {
      if (b === 0 || b === bandCount - 1) sawEdgeChange = true
      else sawMiddleChange = true
    }
  }

  return sawEdgeChange && !sawMiddleChange
}

function semanticFallbackSummary(hasZones: boolean): string {
  if (hasZones) {
    return 'A watched zone changed in a way that passed its sensitivity setting. Open the before/after comparison to review the exact change.'
  }

  return 'A visual change was detected. Open the before/after comparison to review the exact change.'
}

function semanticAlertTitle(monUrl: any, passedZones: ZoneDiffScore[]): string {
  const monitorName = monUrl.name || monUrl.url
  const primaryZone = passedZones[0]?.label

  if (primaryZone) return `${primaryZone} changed - ${monitorName}`
  return `Relevant change detected - ${monitorName}`
}

async function preparePageForScreenshot(page: Page): Promise<void> {
  // All CLICK_SELECTORS are resolved in a single browser-side pass instead of
  // round-tripping Playwright's isVisible() (which polls up to 400ms) once
  // per selector - that was up to ~5.2s of pure protocol overhead per capture
  // on pages where none of them matched. Behaviour is preserved: every
  // selector that is currently visible still gets clicked, in the same order.
  const clickedAny = await page.evaluate((selectors: string[]) => {
    function isVisible(el: Element): boolean {
      const style = window.getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }

    let clicked = false
    for (const selector of selectors) {
      try {
        const el = document.querySelector(selector) as HTMLElement | null
        if (el && isVisible(el)) {
          el.click()
          clicked = true
        }
      } catch {}
    }
    return clicked
  }, CLICK_SELECTORS).catch(() => false)

  // Only pay the settle-time wait when a click actually happened.
  if (clickedAny) await page.waitForTimeout(250)

  await page.evaluate(() => {
    const ACCEPT_RE = /^(accept all|accept cookies?|allow all|allow cookies?|i accept|i agree|agree|got it|ok)$/i
    const CONTAINERS = '[class*="cookie"],[class*="consent"],[class*="gdpr"],[id*="cookie"],[id*="consent"]'

    for (const el of document.querySelectorAll<HTMLElement>(`${CONTAINERS} button, ${CONTAINERS} a[role="button"]`)) {
      if (ACCEPT_RE.test(el.innerText.trim())) el.click()
    }

    const TOP_ACCEPT_RE = /^(accept|accept all|accept cookies?|agree|i agree|ok|got it|allow all|allow cookies?)$/i
    for (const el of document.querySelectorAll<HTMLElement>('button, a[role="button"]')) {
      if (TOP_ACCEPT_RE.test(el.innerText.trim())) {
        const style = window.getComputedStyle(el.closest('[style*="fixed"], [class*="fixed"], [class*="sticky"]') ?? el)
        if (style.position === 'fixed' || style.position === 'sticky') el.click()
      }
    }
  }).catch(() => {})

  await page.waitForTimeout(500)

  await page.evaluate(() => {
    const REMOVE_SELECTORS = [
      '#cookie-banner', '.cookie-banner', '.cookie-notice', '.cookie-consent',
      '.cc-window', '.cc-banner',
      '[class*="cookie"]', '[id*="cookie"]',
      '[class*="gdpr"]', '[id*="gdpr"]',
      '[class*="consent"]', '[id*="consent"]',
      '[aria-label*="cookie" i]', '[aria-label*="consent" i]',
      '.modal-overlay',
    ]

    for (const sel of REMOVE_SELECTORS) {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          const style = window.getComputedStyle(el)
          if (style.position === 'fixed' || style.position === 'sticky' ||
              el.getAttribute('role') === 'dialog' ||
              el.getAttribute('aria-modal') === 'true') {
            el.remove()
          }
        })
      } catch {}
    }
  }).catch(() => {})

  await page.addStyleTag({
    content: `
      ${CSS_HIDE_SELECTORS.join(', ')} {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0.001ms !important;
        transition-duration: 0.001ms !important;
        transition-delay: 0.001ms !important;
      }

      ::-webkit-scrollbar { display: none !important; }
      html, body { scrollbar-width: none !important; }
    `,
  }).catch(() => {})

  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
  await page.waitForTimeout(500)
}

/**
 * Captures a monitor, diffs it against the previous snapshot, and raises an
 * alert when the change is judged relevant.
 *
 * @param plan Entitlements that apply to the owning workspace. Gates the model
 *   pass and tracking zones — a downgraded workspace keeps its zone
 *   configuration on the row but stops having it applied, so an upgrade
 *   restores it exactly.
 */
export async function processUrl(
  monUrl: any,
  supabase: SupabaseClient,
  now: Date = new Date(),
  plan: Plan = PLANS.free
): Promise<{ diffPct: number | null; alerted: boolean }> {
  const ts = now.toISOString().replace(/[:.]/g, '-')
  const fullPage = monUrl.full_page !== false
  const mode = monUrl.mode ?? 'watch'

  // Re-validate at capture time, not just at creation. A monitor may have been
  // saved before the host rules tightened, and this worker can reach addresses
  // the browser that created it never could.
  const targetUrl = normalizeUrl(monUrl.url)

  const browser = await chromium.launch()
  let screenshotBuffer: Buffer
  // Extraction runs on EVERY plan, deliberately.
  //
  // It is one in-page evaluate: no network, no model, and a jsonb blob a
  // fraction of the size of the screenshot beside it. What it buys is the
  // opposite of a cost - it is how we decide to skip the model entirely, and
  // how we send a text diff instead of two full-page images when we do call
  // it. Gating that behind a paid tier would mean the cheapest customers are
  // the most expensive ones to serve, which is backwards.
  //
  // `structuredExtraction` still gates what a workspace can SEE - charts over
  // price history, structured alert rules, the change data over the API. That
  // is the thing being sold; this is plumbing.
  let extract: PageExtract | null = null

  try {
    const context = await browser.newContext({
      locale: 'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
      permissions: [],
    })

    await context.route('**/*', (route) => {
      const url = route.request().url()
      if (BLOCKED_DOMAINS.some((d) => url.includes(d))) return route.abort()
      return route.continue()
    })

    const page = await context.newPage()
    await page.setViewportSize({ width: 1280, height: 800 })
    // `networkidle` never settles on pages with polling, live chat, or video
    // embeds - it used to burn the full 30s timeout on those every check.
    // `domcontentloaded` is fast and reliable; give the page a short, bounded
    // chance to also reach networkidle (most pages do, quickly), then move on
    // regardless and rely on the existing fixed wait below.
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.waitForLoadState('networkidle', { timeout: 3_000 }).catch(() => {})
    await page.waitForTimeout(1000)
    await preparePageForScreenshot(page)
    screenshotBuffer = await page.screenshot({ fullPage, type: 'png' })

    // Must run before the page/context closes below - extractContent reads
    // the live DOM via page.evaluate. It never throws (see its own doc
    // comment): a failed extraction still leaves the screenshot intact.
    extract = await extractContent(page)

    await context.close()
  } finally {
    await browser.close()
  }

  // Playwright only emits PNG reliably, but nothing downstream of this point
  // needs to store PNG - re-encode to WebP (quality 80) before it ever
  // touches storage. `screenshotBuffer` (the original PNG) is kept around for
  // the pixel-diff pipeline below, which wants the highest-fidelity source.
  const screenshotWebp = await encodeCaptureWebp(screenshotBuffer)
  const screenshotPath = `screenshots/${monUrl.workspace_id}/${monUrl.id}/${ts}.webp`

  const { error: uploadErr } = await supabase.storage
    .from('screenshots')
    .upload(screenshotPath, screenshotWebp, { contentType: 'image/webp', upsert: false })

  if (uploadErr) {
    logger.error('Upload failed', { url: monUrl.url, error: uploadErr.message })
    throw new Error(`Upload failed: ${uploadErr.message}`)
  }

  // Best-effort thumbnail for the dashboard's screenshot history grid, which
  // otherwise loads the full multi-MB capture per grid cell. A thumbnail
  // failure should never fail the capture itself.
  let thumbPath: string | null = null
  let thumbBuffer: Buffer | null = null
  try {
    thumbBuffer = await makeThumbnail(screenshotBuffer)
    const candidatePath = `thumbs/${monUrl.workspace_id}/${monUrl.id}/${ts}.webp`
    const { error: thumbErr } = await supabase.storage
      .from('screenshots')
      .upload(candidatePath, thumbBuffer, { contentType: 'image/webp', upsert: false })
    if (thumbErr) {
      logger.warn('Thumbnail upload failed. Continuing without one', { url: monUrl.url, error: thumbErr.message })
      thumbBuffer = null
    } else {
      thumbPath = candidatePath
    }
  } catch (thumbErr) {
    logger.warn('Thumbnail generation failed. Continuing without one', { url: monUrl.url, err: thumbErr })
    thumbBuffer = null
  }

  const { data: snapshot, error: snapErr } = await supabase
    .from('screenshot_snapshots')
    .insert({
      workspace_id: monUrl.workspace_id,
      monitored_url_id: monUrl.id,
      storage_path: screenshotPath,
      taken_at: now.toISOString(),
      file_size_bytes: screenshotWebp.length,
      // Both null when extraction is off-plan or failed - see the D1 hard
      // constraint that this degrade to today's behaviour exactly.
      extract,
      content_hash: extract ? contentTextHash(extract.text) : null,
      metadata: {
        viewport_width: 1280,
        manual_run: monUrl._manual ?? false,
        full_page: fullPage,
        ...(thumbPath ? { thumb_path: thumbPath } : {}),
      },
    })
    .select()
    .single()

  if (snapErr || !snapshot) throw new Error(`Failed to save snapshot: ${snapErr?.message}`)

  // Meter the capture the moment it is durable. Doing this after the diff would
  // let a monitor that always fails comparison run for free. Bytes reflect
  // what actually landed in storage (WebP capture + thumbnail), not the
  // in-memory PNG Playwright produced.
  await recordUsage(supabase, monUrl.workspace_id, {
    checks: 1,
    bytes: screenshotWebp.length + (thumbBuffer?.length ?? 0),
  })

  if (mode === 'archive') {
    await supabase.from('monitored_urls').update({ last_checked_at: now.toISOString() }).eq('id', monUrl.id)
    logger.info('Archive snapshot saved', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  const { data: prevSnapshot } = await supabase
    .from('screenshot_snapshots')
    .select('*')
    .eq('monitored_url_id', monUrl.id)
    .neq('id', snapshot.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  await supabase.from('monitored_urls').update({ last_checked_at: now.toISOString() }).eq('id', monUrl.id)

  if (!prevSnapshot) {
    logger.info('First snapshot recorded', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  // Loaded from the same row the pixel-diff path already fetched (`select
  // ('*')` above), so this costs nothing extra. `diffExtracts` degrades to
  // "no changes" on its own when either side is null - a first-ever extract,
  // an extraction failure this run, or a previous snapshot that predates
  // this feature all land here identically.
  const prevExtract: PageExtract | null = (prevSnapshot.extract as PageExtract | null | undefined) ?? null
  const contentDiff = diffExtracts(prevExtract, extract)

  const { data: prevBlob, error: prevDlErr } = await supabase.storage.from('screenshots').download(prevSnapshot.storage_path)

  if (prevDlErr || !prevBlob) {
    logger.warn('Could not download previous screenshot. Skipping diff', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  let diffPct = 0
  let pageDiffPct = 0
  let zoneDiffPct: number | null = null
  let alertScore = 0
  let diffStoragePath: string | null = null
  let prevBuffer: Buffer | null = null
  let zoneCrops: ZoneCrop[] | undefined
  let zoneScores: ZoneDiffScore[] = []
  let isBandedNoise = false

  // Zones stay on the row through a downgrade so an upgrade restores them
  // untouched — they are simply not applied while the plan excludes them.
  const configuredZones: Zone[] = Array.isArray(monUrl.zones) ? monUrl.zones : []
  const zones: Zone[] = plan.features.zones
    ? configuredZones.slice(0, plan.limits.maxZonesPerMonitor)
    : []

  if (configuredZones.length > zones.length) {
    logger.info('Some zones not applied on the current plan', {
      url: monUrl.url,
      plan: plan.id,
      configured: configuredZones.length,
      applied: zones.length,
    })
  }

  try {
    prevBuffer = Buffer.from(await prevBlob.arrayBuffer())
    // sharp sniffs the format from the buffer itself - prevBuffer may be PNG
    // (an older snapshot) or WebP (a snapshot taken after this pipeline
    // switched formats). screenshotBuffer is always the fresh PNG Playwright
    // just captured, decoded straight from memory rather than re-downloading
    // the WebP we just uploaded.
    const prevRaw = await decodeToRaw(prevBuffer)
    const currRaw = await decodeToRaw(screenshotBuffer)

    const width = Math.min(prevRaw.width, currRaw.width)
    const minH = Math.min(prevRaw.height, currRaw.height)
    const maxH = Math.max(prevRaw.height, currRaw.height)
    const totalPixels = width * maxH

    const prevSlice = new Uint8Array(width * minH * 4)
    const currSlice = new Uint8Array(width * minH * 4)

    for (let row = 0; row < minH; row++) {
      for (let col = 0; col < width; col++) {
        const dst = (row * width + col) * 4
        const sp = (row * prevRaw.width + col) * 4
        const sc = (row * currRaw.width + col) * 4

        prevSlice[dst] = prevRaw.data[sp]
        prevSlice[dst + 1] = prevRaw.data[sp + 1]
        prevSlice[dst + 2] = prevRaw.data[sp + 2]
        prevSlice[dst + 3] = prevRaw.data[sp + 3]
        currSlice[dst] = currRaw.data[sc]
        currSlice[dst + 1] = currRaw.data[sc + 1]
        currSlice[dst + 2] = currRaw.data[sc + 2]
        currSlice[dst + 3] = currRaw.data[sc + 3]
      }
    }

    const diffOutput = new Uint8Array(width * minH * 4)
    const changedPixels = pixelmatch(prevSlice, currSlice, diffOutput, width, minH, { threshold: 0.1 })
    const extraPixels = width * (maxH - minH)
    pageDiffPct = ((changedPixels + extraPixels) / totalPixels) * 100

    // Banding is only a meaningful signal for whole-page comparisons - a
    // monitor with zones already has a much more targeted filter (each
    // zone's own sensitivity threshold), left untouched below.
    isBandedNoise = isBandedEdgeNoise(prevSlice, currSlice, width, minH, pageDiffPct)

    if (zones.length > 0) {
      zoneCrops = []
      let zoneChangedPixels = 0
      let zoneTotalPixels = 0

      for (let i = 0; i < zones.length; i++) {
        const zone = zones[i]
        const label = zone.label?.trim() || `Zone ${i + 1}`
        const beforeCrop = await cropZoneWebp(prevRaw, zone)
        const afterCrop = await cropZoneWebp(currRaw, zone)
        const score = diffZone(prevRaw, currRaw, zone)
        const sensitivity = zone.sensitivity ?? 'normal'
        const config = sensitivityConfig(sensitivity)

        if (score) {
          const scorePct = zoneAlertScore(score.diffPct, sensitivity)
          const passesThreshold = score.diffPct >= config.thresholdPct
          zoneChangedPixels += score.changedPixels
          zoneTotalPixels += score.totalPixels
          zoneScores.push({
            label,
            instruction: zone.instruction?.trim() || null,
            sensitivity,
            changed_pixels: score.changedPixels,
            total_pixels: score.totalPixels,
            diff_pct: Number(score.diffPct.toFixed(4)),
            alert_score: scorePct,
            passes_threshold: passesThreshold,
          })
        }

        if (beforeCrop && afterCrop) {
          zoneCrops.push({
            label,
            instruction: zone.instruction?.trim() || undefined,
            sensitivity,
            before: beforeCrop,
            after: afterCrop,
          })
        }
      }

      if (zoneCrops.length === 0) zoneCrops = undefined
      if (zoneTotalPixels > 0) zoneDiffPct = (zoneChangedPixels / zoneTotalPixels) * 100
      alertScore = aggregateAlertScore(zoneScores, zoneDiffPct ?? pageDiffPct)
      diffPct = zoneDiffPct ?? pageDiffPct
    } else {
      diffPct = pageDiffPct
      alertScore = aggregateAlertScore([], pageDiffPct)
    }

    if (pageDiffPct > 0) {
      const diffBuffer = await encodeRawWebp(diffOutput, width, minH)
      const diffPath = `diffs/${monUrl.workspace_id}/${monUrl.id}/${ts}.webp`
      const { error: diffUploadErr } = await supabase.storage.from('screenshots').upload(diffPath, diffBuffer, { contentType: 'image/webp' })
      if (!diffUploadErr) diffStoragePath = diffPath
    }
  } catch (diffErr) {
    logger.warn('Pixel comparison error. Diff skipped', { url: monUrl.url, err: diffErr })
  }

  await supabase.from('screenshot_diffs').insert({
    workspace_id: monUrl.workspace_id,
    monitored_url_id: monUrl.id,
    previous_snapshot_id: prevSnapshot.id,
    current_snapshot_id: snapshot.id,
    diff_pct: diffPct,
    diff_storage_path: diffStoragePath,
  })

  const passedZones = zoneScores.filter(z => z.passes_threshold)
  // The no-zone floor used to be a flat 0.05% - five hundredths of one
  // percent - which any real page with a rotating hero, a relative
  // timestamp, or a variable-height element clears on essentially every
  // check. The floor is now the monitor's own `threshold_pct` (what the user
  // already told us they consider a meaningful change), with a hard 0.5%
  // minimum so a monitor saved with an unrealistically low threshold can't
  // reopen the near-every-check AI floor this replaces. Zone-based monitors
  // are unaffected - their per-zone sensitivity thresholds are a real filter
  // already and stay exactly as they were.
  const noZoneFloor = Math.max(monUrl.threshold_pct ?? 5, 0.5)
  const AI_FLOOR = zoneCrops ? 0 : noZoneFloor
  // isBandedNoise folds into the same floor: a diff confined to a single edge
  // band under 2% is chrome noise (sticky header clock, footer year, a
  // re-rendered cookie banner remnant), not a real change worth a model call
  // or an alert - so it's treated the same as "didn't pass the floor".
  const passesFloor = zoneCrops
    ? passedZones.length > 0
    : diffPct >= AI_FLOOR && !isBandedNoise

  // ─── Content-diff gating (D1) ─────────────────────────────────────────────
  // Only meaningful for whole-page monitors - zones already have their own
  // per-zone sensitivity floor and their own image-based model call above,
  // and neither is touched here (hard constraint: zone scoring stays exactly
  // as it is). `contentDiff` was computed from full extracts regardless of
  // zones, but only APPLIED when there are no zones on this monitor.
  const contentGateApplies = !zoneCrops
  // Two signals agreeing nothing happened: no describable content change,
  // and the raw pixel delta hasn't even crossed the user's own threshold.
  // Nothing changed that anyone could put into words - the model call is
  // pure cost with no chance of a useful summary.
  const skipModelForEmptyContent =
    contentGateApplies && contentDiff.isEmpty && diffPct < (monUrl.threshold_pct ?? 5)
  // A layout-only change (only `structure_changed`, no text/price/heading/meta
  // difference) can't be put into words from the extract alone - fall back to
  // full-page images exactly as this pipeline always has. Same fallback when
  // there's nothing to describe at all (extraction failed, or no previous
  // extract to diff against) - `contentDiff.changes` is already empty in
  // that case, which routes to the same image path in `analyzeWithAI` on its
  // own, but this is spelled out for clarity.
  const isLayoutOnlyChange =
    contentGateApplies && contentDiff.changes.length === 1 && contentDiff.changes[0].kind === 'structure_changed'
  const forceImages = !contentGateApplies || extract === null || prevExtract === null || isLayoutOnlyChange

  // Without the model pass there is no relevance judgement to make, so the
  // pixel threshold the user configured becomes the alert decision on its own.
  // Edge-band noise is still suppressed on that path: it is a free pixel-level
  // filter, not a paid capability, and letting it through would mean a plan
  // WITHOUT AI summaries produces noisier alerts than one with them.
  const shouldRunAI = passesFloor && plan.features.aiSummaries && !skipModelForEmptyContent
  const shouldConsiderAlert = plan.features.aiSummaries
    ? passesFloor
    : diffPct >= (monUrl.threshold_pct ?? 5) && !isBandedNoise
  let alerted = false

  // ─── Change classification + routing (D2) ─────────────────────────────────
  // Deterministic first (trigger/lib/classify-change.ts): most changes are
  // obvious from the structured diff alone and this must not cost a model
  // call. Zone-based monitors have no `ContentChange[]` to classify against,
  // so they go straight to "ambiguous" — the same shouldRunAI call already
  // being made below (if any) supplies the type instead of a second one.
  const classification: ClassificationResult = contentGateApplies
    ? classifyChange(contentDiff.changes, {
        url: monUrl.url,
        pageTitle: extract?.title ?? prevExtract?.title ?? null,
        afterText: extract ? extract.text : null,
      })
    : { type: null, needsModel: true, reason: 'Zone-based monitor: no structured content changes to classify deterministically.' }

  // Falls back to 'other' when ambiguous and the model either won't run
  // (plan lacks aiSummaries, or this change didn't clear the floor) or fails
  // — never left unset. Only overwritten below when `classification.needsModel`
  // is true AND the AI call actually returns, so a confident deterministic
  // answer is never second-guessed by the model.
  let changeType: ChangeType = classification.type ?? 'other'

  if (isBandedNoise) {
    logger.info('Diff confined to a single edge band under 2%. Treating as chrome noise', {
      url: monUrl.url,
      diffPct: diffPct.toFixed(3),
    })
  }

  if (shouldConsiderAlert) {
    let shouldAlert = true
    let aiSummary = ''

    if (shouldRunAI && prevBuffer) {
      try {
        const aiResult = await analyzeWithAI({
          beforeBuffer: prevBuffer,
          afterBuffer: screenshotBuffer,
          diffPct,
          watchDescription: monUrl.watch_description ?? null,
          thresholdPct: monUrl.threshold_pct ?? undefined,
          zoneCrops,
          // Text-first path (D1): non-null + non-empty routes this call to
          // text only, skipping images entirely, unless forceImages says the
          // change can't be described in words.
          contentChanges: contentGateApplies ? contentDiff.changes : null,
          forceImages,
        })
        shouldAlert = aiResult.shouldAlert
        aiSummary = aiResult.summary
        // Only trust the model's classification when our own deterministic
        // pass came back ambiguous — a confident deterministic answer (e.g.
        // `price`, from kind alone) is never second-guessed by the model.
        if (classification.needsModel) changeType = aiResult.changeType
        await recordUsage(supabase, monUrl.workspace_id, { aiCalls: 1 })
        logger.info('AI analysis complete', {
          url: monUrl.url,
          shouldAlert,
          summaryLen: aiSummary.length,
          alertScore,
          zoneCount: zoneCrops?.length ?? 0,
          passedZoneCount: passedZones.length,
          zoneDiffPct: zoneDiffPct != null ? zoneDiffPct.toFixed(3) : null,
          contentChangeCount: contentGateApplies ? contentDiff.changes.length : null,
          textOnly: contentGateApplies && !forceImages && contentDiff.changes.length > 0,
          changeType,
          changeTypeSource: classification.needsModel ? 'model' : 'deterministic',
        })
      } catch (aiErr) {
        logger.warn('AI analysis error. Defaulting to semantic threshold-based alert', { url: monUrl.url, err: aiErr })
        shouldAlert = true
        aiSummary = semanticFallbackSummary(Boolean(zoneCrops))
      }
    }

    if (shouldAlert) {
      const severity =
        alertScore >= 85 ? 'critical' : alertScore >= 65 ? 'high' : alertScore >= 35 ? 'medium' : 'low'

      // ─── Routing (D2) ─────────────────────────────────────────────────────
      // `monUrl.change_routing` is jsonb straight off the row - untyped, and
      // possibly null (the overwhelming majority of monitors, today). See
      // migration 010: absent/malformed input degrades to 'alert', matching
      // pre-D2 behaviour exactly.
      const routing = resolveRouting(monUrl.change_routing, changeType)
      // 'ignore' still writes the row (history is the product) but starts
      // 'dismissed' instead of 'open' - the same status column the dashboard's
      // dismiss action already writes - so it never enters the digest's
      // `status = 'open'` query or an instant send, without touching either
      // of those files.
      const status = routing === 'ignore' ? 'dismissed' : 'open'

      const { data: createdAlert, error: alertErr } = await supabase.from('alerts').insert({
        workspace_id: monUrl.workspace_id,
        monitored_url_id: monUrl.id,
        alert_type: 'visual_change',
        severity,
        status,
        title: semanticAlertTitle(monUrl, passedZones),
        summary: aiSummary || semanticFallbackSummary(Boolean(zoneCrops)),
        ai_summary: aiSummary || null,
        diff_pct: diffPct,
        diff_storage_path: diffStoragePath,
        current_snapshot_id: snapshot.id,
        previous_snapshot_id: prevSnapshot.id,
        change_type: changeType,
        metadata: {
          url: monUrl.url,
          threshold_pct: monUrl.threshold_pct,
          alert_score: alertScore,
          page_diff_pct: Number(pageDiffPct.toFixed(4)),
          zone_diff_pct: zoneDiffPct != null ? Number(zoneDiffPct.toFixed(4)) : null,
          passed_zone_count: passedZones.length,
          zone_scores: zoneScores,
          // Structured changes from diffExtracts (D1), so the UI can render
          // "Pro moved $29 -> $39" instead of a pixel percentage. Null when
          // the content-diff gate doesn't apply to this monitor (zones) -
          // matches `contentChanges` passed to analyzeWithAI above.
          content_changes: contentGateApplies ? contentDiff.changes : null,
          change_routing: routing,
        },
        triggered_at: now.toISOString(),
      })
        .select('id')
        .single()

      if (alertErr) throw new Error(`Failed to create alert: ${alertErr.message}`)

      alerted = true
      logger.info('Alert created', {
        url: monUrl.url,
        diffPct: diffPct.toFixed(1),
        alertScore,
        aiSuppressed: false,
        changeType,
        routing,
      })

      // High and critical changes go out immediately; everything else waits for
      // the daily digest. The task itself re-checks severity, the workspace's
      // plan and whether a notification was already sent, so enqueueing here is
      // safe and never double-sends. Fire-and-forget: a delivery problem must
      // not fail a capture that already succeeded.
      //
      // Routing gates this independently of severity: 'digest_only' waits for
      // the daily digest no matter how severe the change scored, and 'ignore'
      // never notifies at all (its 'dismissed' status above already keeps it
      // out of the digest query too - this additionally skips the instant path).
      if (createdAlert && routing === 'alert' && (severity === 'critical' || severity === 'high')) {
        await triggerInstantAlert(createdAlert.id)
      }
    } else {
      logger.info('Alert suppressed by AI. Change not relevant to watch instructions', {
        url: monUrl.url,
        diffPct: diffPct.toFixed(1),
        alertScore,
        zoneDiffPct: zoneDiffPct != null ? zoneDiffPct.toFixed(3) : null,
      })
    }
  } else {
    logger.info('Alert skipped. No zone passed sensitivity threshold', {
      url: monUrl.url,
      diffPct: diffPct.toFixed(1),
      alertScore,
      zoneScores,
    })
  }

  logger.info('URL processed', {
    url: monUrl.url,
    diffPct: `${diffPct.toFixed(1)}%`,
    pageDiffPct: `${pageDiffPct.toFixed(1)}%`,
    zoneDiffPct: zoneDiffPct != null ? `${zoneDiffPct.toFixed(1)}%` : null,
    alertScore,
    threshold: `${monUrl.threshold_pct}%`,
    alerted,
  })

  return { diffPct, alerted }
}
