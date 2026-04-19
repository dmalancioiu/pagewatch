import { logger } from '@trigger.dev/sdk/v3'
import { SupabaseClient } from '@supabase/supabase-js'
import { chromium, type Page } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { analyzeWithAI, type ZoneCrop } from './analyze-diff-with-ai'
import type { Zone } from '../../lib/types/database.types'

/**
 * Crops a rectangular region (defined as relative 0–1 coordinates) from a PNG.
 * Returns a PNG buffer of just that region.
 */
function cropZone(png: PNG, zone: Zone): Buffer | null {
  const srcX = Math.max(0, Math.floor(zone.x      * png.width))
  const srcY = Math.max(0, Math.floor(zone.y      * png.height))
  const srcW = Math.min(png.width  - srcX, Math.ceil(zone.width  * png.width))
  const srcH = Math.min(png.height - srcY, Math.ceil(zone.height * png.height))

  if (srcW <= 0 || srcH <= 0) return null

  const out = new PNG({ width: srcW, height: srcH })
  PNG.bitblt(png, out, srcX, srcY, srcW, srcH, 0, 0)
  return PNG.sync.write(out)
}

// ── Ad / tracking domains to block ──────────────────────────────────────────
// Reduces screenshot noise and speeds up page loads
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

// ── Overlay selectors ────────────────────────────────────────────────────────

/**
 * Specific selectors to try clicking first (known consent / close buttons).
 * Ordered from most-specific to least-specific.
 */
const CLICK_SELECTORS = [
  // OneTrust
  '#onetrust-accept-btn-handler',
  '.onetrust-close-btn-handler',
  // Cookiebot
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  // TrustArc
  '#truste-consent-button',
  // Axeptio
  '.axeptio_btn_acceptAll',
  // Osano
  '.osano-cm-accept-all',
  '.osano-cm-dismiss',
  // Quantcast / CMP2
  '.qc-cmp2-summary-buttons button:last-child',
  // Didomi
  '#didomi-notice-agree-button',
  // usercentrics
  '[data-testid="uc-accept-all-button"]',
  // Generic "X" / close on fixed banners
  '[class*="cookie-banner"] [class*="close"]',
  '[class*="consent-banner"] [class*="close"]',
  '[id*="cookie-banner"] [class*="close"]',
]

/**
 * Elements to hide via CSS after click-dismissal.
 * Covers chat widgets, surviving cookie banners, and generic named patterns.
 */
const CSS_HIDE_SELECTORS = [
  // ── Cookie / consent banners ────────────────────────────────────────────
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
  // Brief-specified selectors
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
  // ── Chat / support widgets ──────────────────────────────────────────────
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
  // ── Marketing / newsletter popups ──────────────────────────────────────
  '.klaviyo-form',
  '[class*="klaviyo"]',
  '[id*="klaviyo"]',
  '.optinmonster-optin-wrap',
  // ── Notification / permission prompts ──────────────────────────────────
  '[class*="push-notification"]',
  '[class*="notification-prompt"]',
]

// ── Page preparation ─────────────────────────────────────────────────────────

/**
 * Best-effort cleanup before taking a screenshot:
 *  1. Click known dismiss / accept buttons on consent dialogs
 *  2. Text-match generic accept buttons inside likely cookie containers
 *  3. Inject CSS to hide known overlay widgets that survived the clicks
 *  4. Stop all CSS animations and transitions for consistent frames
 *  5. Scroll back to the top of the page
 *  6. Final 500ms settle wait
 *
 * All steps are individually try/caught — a failure in any one step
 * does not prevent the screenshot from being taken.
 */
async function preparePageForScreenshot(page: Page): Promise<void> {
  // 1. Click known selectors ──────────────────────────────────────────────────
  for (const selector of CLICK_SELECTORS) {
    try {
      const el = page.locator(selector).first()
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ timeout: 800 })
        await page.waitForTimeout(250)
      }
    } catch { /* best-effort */ }
  }

  // 2. Text-match generic accept buttons inside likely cookie containers ───────
  await page.evaluate(() => {
    const ACCEPT_RE = /^(accept all|accept cookies?|allow all|allow cookies?|i accept|i agree|agree|got it|ok)$/i
    const CONTAINERS = '[class*="cookie"],[class*="consent"],[class*="gdpr"],[id*="cookie"],[id*="consent"]'
    for (const el of document.querySelectorAll<HTMLElement>(`${CONTAINERS} button, ${CONTAINERS} a[role="button"]`)) {
      if (ACCEPT_RE.test(el.innerText.trim())) el.click()
    }
    // Also try top-level buttons matching these labels (catches minimalist banners)
    const TOP_ACCEPT_RE = /^(accept|accept all|accept cookies?|agree|i agree|ok|got it|allow all|allow cookies?)$/i
    for (const el of document.querySelectorAll<HTMLElement>('button, a[role="button"]')) {
      if (TOP_ACCEPT_RE.test(el.innerText.trim())) {
        // Only click fixed/sticky elements near the top or bottom (cookie bar placement)
        const style = window.getComputedStyle(el.closest('[style*="fixed"], [class*="fixed"], [class*="sticky"]') ?? el)
        if (style.position === 'fixed' || style.position === 'sticky') el.click()
      }
    }
  }).catch(() => {})

  // Wait for any dismiss animations to complete
  await page.waitForTimeout(500)

  // 3. DOM removal — forcibly remove remaining overlay elements ───────────────
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
          // Don't nuke elements that are part of the main content layout
          const style = window.getComputedStyle(el)
          if (style.position === 'fixed' || style.position === 'sticky' ||
              el.getAttribute('role') === 'dialog' ||
              el.getAttribute('aria-modal') === 'true') {
            el.remove()
          }
        })
      } catch { /* best-effort */ }
    }
  }).catch(() => {})

  // 4. CSS: hide surviving overlays + known widgets ───────────────────────────
  await page.addStyleTag({
    content: `
      ${CSS_HIDE_SELECTORS.join(', ')} {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* Freeze all animations / transitions for a stable frame */
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay:    0.001ms !important;
        transition-duration: 0.001ms !important;
        transition-delay:    0.001ms !important;
      }

      /* Hide scrollbar chrome */
      ::-webkit-scrollbar { display: none !important; }
      html, body { scrollbar-width: none !important; }
    `,
  }).catch(() => {})

  // 5. Scroll to top ──────────────────────────────────────────────────────────
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})

  // 6. Final settle wait ──────────────────────────────────────────────────────
  await page.waitForTimeout(500)
}

/**
 * Takes a screenshot of a single monitored URL, diffs it against the previous
 * snapshot, saves everything to Supabase, and fires an alert if needed.
 * When mode is 'watch', the AI layer decides whether the change is alert-worthy.
 * When mode is 'archive', no diff or alert is produced — just snapshots.
 *
 * Used by both the scheduled cron task and the manual "run now" task.
 */
export async function processUrl(
  monUrl: any,
  supabase: SupabaseClient,
  now: Date = new Date()
): Promise<{ diffPct: number | null; alerted: boolean }> {
  const ts       = now.toISOString().replace(/[:.]/g, '-')
  const fullPage = monUrl.full_page !== false   // default true if column missing
  const mode     = monUrl.mode ?? 'watch'

  // ── Launch browser & take screenshot ────────────────────────────────────────
  const browser = await chromium.launch()
  let screenshotBuffer: Buffer

  try {
    const context = await browser.newContext({
      locale:     'en-US',
      timezoneId: 'UTC',
      colorScheme: 'light',
      permissions: [],
    })

    // Block known ad/tracking domains to reduce noise and speed up load
    await context.route('**/*', (route) => {
      const url = route.request().url()
      if (BLOCKED_DOMAINS.some((d) => url.includes(d))) {
        return route.abort()
      }
      return route.continue()
    })

    const page = await context.newPage()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(monUrl.url, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(1000)
    await preparePageForScreenshot(page)
    screenshotBuffer = await page.screenshot({ fullPage, type: 'png' })
    await context.close()
  } finally {
    await browser.close()
  }

  // ── Upload current screenshot ────────────────────────────────────────────────
  const screenshotPath = `screenshots/${monUrl.workspace_id}/${monUrl.id}/${ts}.png`

  const { error: uploadErr } = await supabase.storage
    .from('screenshots')
    .upload(screenshotPath, screenshotBuffer, { contentType: 'image/png', upsert: false })

  if (uploadErr) {
    logger.error('Upload failed', { url: monUrl.url, error: uploadErr.message })
    throw new Error(`Upload failed: ${uploadErr.message}`)
  }

  // ── Save snapshot row ────────────────────────────────────────────────────────
  const { data: snapshot, error: snapErr } = await supabase
    .from('screenshot_snapshots')
    .insert({
      workspace_id:     monUrl.workspace_id,
      monitored_url_id: monUrl.id,
      storage_path:     screenshotPath,
      taken_at:         now.toISOString(),
      file_size_bytes:  screenshotBuffer.length,
      metadata:         { viewport_width: 1280, manual_run: monUrl._manual ?? false, full_page: fullPage },
    })
    .select()
    .single()

  if (snapErr || !snapshot) {
    throw new Error(`Failed to save snapshot: ${snapErr?.message}`)
  }

  // ── Archive mode: no diff, no alert ─────────────────────────────────────────
  if (mode === 'archive') {
    await supabase
      .from('monitored_urls')
      .update({ last_checked_at: now.toISOString() })
      .eq('id', monUrl.id)
    logger.info('Archive snapshot saved', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  // ── Fetch previous snapshot ──────────────────────────────────────────────────
  const { data: prevSnapshot } = await supabase
    .from('screenshot_snapshots')
    .select('*')
    .eq('monitored_url_id', monUrl.id)
    .neq('id', snapshot.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  await supabase
    .from('monitored_urls')
    .update({ last_checked_at: now.toISOString() })
    .eq('id', monUrl.id)

  if (!prevSnapshot) {
    logger.info('First snapshot recorded', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  // ── Download previous screenshot & diff ─────────────────────────────────────
  const { data: prevBlob, error: prevDlErr } = await supabase.storage
    .from('screenshots')
    .download(prevSnapshot.storage_path)

  if (prevDlErr || !prevBlob) {
    logger.warn('Could not download previous screenshot — skipping diff', { url: monUrl.url })
    return { diffPct: null, alerted: false }
  }

  let diffPct = 0
  let diffStoragePath: string | null = null
  let prevBuffer: Buffer | null = null
  let zoneCrops: ZoneCrop[] | undefined

  // Parse zones from the monitored URL (JSONB array or null)
  const zones: Zone[] = Array.isArray(monUrl.zones) ? monUrl.zones : []

  try {
    prevBuffer      = Buffer.from(await prevBlob.arrayBuffer())
    const prevPng   = PNG.sync.read(prevBuffer)
    const currPng   = PNG.sync.read(screenshotBuffer)

    // ── Build zone crops if the user defined tracking zones ──────────────────
    if (zones.length > 0) {
      zoneCrops = []
      for (let i = 0; i < zones.length; i++) {
        const zone = zones[i]
        const beforeCrop = cropZone(prevPng, zone)
        const afterCrop  = cropZone(currPng, zone)
        if (beforeCrop && afterCrop) {
          zoneCrops.push({
            label:  zone.label?.trim() || `Zone ${i + 1}`,
            before: beforeCrop,
            after:  afterCrop,
          })
        }
      }
      if (zoneCrops.length === 0) zoneCrops = undefined
    }

    const width       = Math.min(prevPng.width, currPng.width)
    const minH        = Math.min(prevPng.height, currPng.height)
    const maxH        = Math.max(prevPng.height, currPng.height)
    const totalPixels = width * maxH

    const prevSlice = new Uint8Array(width * minH * 4)
    const currSlice = new Uint8Array(width * minH * 4)

    for (let row = 0; row < minH; row++) {
      for (let col = 0; col < width; col++) {
        const dst = (row * width + col) * 4
        const sp  = (row * prevPng.width + col) * 4
        const sc  = (row * currPng.width + col) * 4
        prevSlice[dst]     = prevPng.data[sp];     prevSlice[dst + 1] = prevPng.data[sp + 1]
        prevSlice[dst + 2] = prevPng.data[sp + 2]; prevSlice[dst + 3] = prevPng.data[sp + 3]
        currSlice[dst]     = currPng.data[sc];     currSlice[dst + 1] = currPng.data[sc + 1]
        currSlice[dst + 2] = currPng.data[sc + 2]; currSlice[dst + 3] = currPng.data[sc + 3]
      }
    }

    const diffImg       = new PNG({ width, height: minH })
    const changedPixels = pixelmatch(prevSlice, currSlice, diffImg.data, width, minH, { threshold: 0.1 })
    const extraPixels   = width * (maxH - minH)
    diffPct = ((changedPixels + extraPixels) / totalPixels) * 100

    if (diffPct > 0) {
      const diffBuffer = PNG.sync.write(diffImg)
      const diffPath   = `diffs/${monUrl.workspace_id}/${monUrl.id}/${ts}.png`
      const { error: diffUploadErr } = await supabase.storage
        .from('screenshots')
        .upload(diffPath, diffBuffer, { contentType: 'image/png' })
      if (!diffUploadErr) diffStoragePath = diffPath
    }
  } catch (diffErr) {
    logger.warn('Pixel comparison error — diff skipped', { url: monUrl.url, err: diffErr })
  }

  // ── Save diff row ────────────────────────────────────────────────────────────
  await supabase.from('screenshot_diffs').insert({
    workspace_id:         monUrl.workspace_id,
    monitored_url_id:     monUrl.id,
    previous_snapshot_id: prevSnapshot.id,
    current_snapshot_id:  snapshot.id,
    diff_pct:             diffPct,
    diff_storage_path:    diffStoragePath,
  })

  // ── Fire alert if any detectable change exists ──────────────────────────────
  // When zones are defined: floor is 0 — any pixel change at all routes through
  // Claude, which analyses only the zone crops. Without zones: 0.05% floor
  // (essentially "any pixel difference at all") keeps noise-free.
  const AI_FLOOR = zoneCrops ? 0 : 0.05
  let alerted = false
  if (diffPct >= AI_FLOOR) {
    // ── AI analysis layer ─────────────────────────────────────────────────────
    // Claude decides: is this change relevant? Produces a plain-English summary.
    // Only called when pixelmatch already confirmed the change is ≥ threshold.
    let shouldAlert = true
    let aiSummary   = ''

    if (prevBuffer) {
      try {
        const aiResult = await analyzeWithAI({
          beforeBuffer:     prevBuffer,
          afterBuffer:      screenshotBuffer,
          diffPct,
          watchDescription: monUrl.watch_description ?? null,
          thresholdPct:     monUrl.threshold_pct ?? undefined,
          zoneCrops,
        })
        shouldAlert = aiResult.shouldAlert
        aiSummary   = aiResult.summary
        logger.info('AI analysis complete', {
          url:         monUrl.url,
          shouldAlert,
          summaryLen:  aiSummary.length,
        })
      } catch (aiErr) {
        // If AI analysis itself throws unexpectedly, still fire the alert
        logger.warn('AI analysis error — defaulting to threshold-based alert', { url: monUrl.url, err: aiErr })
        shouldAlert = true
        aiSummary   = `${diffPct.toFixed(1)}% of pixels changed on ${monUrl.url}`
      }
    }

    if (shouldAlert) {
      const severity =
        diffPct >= 50 ? 'critical' : diffPct >= 25 ? 'high' : diffPct >= 10 ? 'medium' : 'low'

      await supabase.from('alerts').insert({
        workspace_id:         monUrl.workspace_id,
        monitored_url_id:     monUrl.id,
        alert_type:           'visual_change',
        severity,
        status:               'open',
        title:                `Page changed — ${monUrl.name}`,
        summary:              aiSummary || `${diffPct.toFixed(1)}% of pixels changed on ${monUrl.url}`,
        ai_summary:           aiSummary || null,
        diff_pct:             diffPct,
        diff_storage_path:    diffStoragePath,
        current_snapshot_id:  snapshot.id,
        previous_snapshot_id: prevSnapshot.id,
        metadata:             { url: monUrl.url, threshold_pct: monUrl.threshold_pct },
        triggered_at:         now.toISOString(),
      })
      alerted = true
      logger.info('Alert created', { url: monUrl.url, diffPct: diffPct.toFixed(1), aiSuppressed: false })
    } else {
      logger.info('Alert suppressed by AI — change not relevant to watch description', {
        url:    monUrl.url,
        diffPct: diffPct.toFixed(1),
      })
    }
  }

  logger.info('URL processed', {
    url:       monUrl.url,
    diffPct:   `${diffPct.toFixed(1)}%`,
    threshold: `${monUrl.threshold_pct}%`,
    alerted,
  })

  return { diffPct, alerted }
}
