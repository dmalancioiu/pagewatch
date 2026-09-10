import { logger } from '@trigger.dev/sdk/v3'
import { SupabaseClient } from '@supabase/supabase-js'
import { chromium, type Page } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { analyzeWithAI, type ZoneCrop } from './analyze-diff-with-ai'
import { recordUsage } from './entitlements'
import { PLANS, type Plan } from '../../lib/plans'
import { normalizeUrl } from '../../lib/url'
import type { Zone } from '../../lib/types/database.types'

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

function cropZone(png: PNG, zone: Zone): Buffer | null {
  const srcX = Math.max(0, Math.floor(zone.x * png.width))
  const srcY = Math.max(0, Math.floor(zone.y * png.height))
  const srcW = Math.min(png.width - srcX, Math.ceil(zone.width * png.width))
  const srcH = Math.min(png.height - srcY, Math.ceil(zone.height * png.height))

  if (srcW <= 0 || srcH <= 0) return null

  const out = new PNG({ width: srcW, height: srcH })
  PNG.bitblt(png, out, srcX, srcY, srcW, srcH, 0, 0)
  return PNG.sync.write(out)
}

function diffZone(prevPng: PNG, currPng: PNG, zone: Zone): { changedPixels: number; totalPixels: number; diffPct: number } | null {
  const srcX = Math.max(0, Math.floor(zone.x * Math.min(prevPng.width, currPng.width)))
  const srcY = Math.max(0, Math.floor(zone.y * Math.min(prevPng.height, currPng.height)))
  const srcW = Math.min(prevPng.width - srcX, currPng.width - srcX, Math.ceil(zone.width * Math.min(prevPng.width, currPng.width)))
  const srcH = Math.min(prevPng.height - srcY, currPng.height - srcY, Math.ceil(zone.height * Math.min(prevPng.height, currPng.height)))

  if (srcW <= 0 || srcH <= 0) return null

  const prevSlice = new Uint8Array(srcW * srcH * 4)
  const currSlice = new Uint8Array(srcW * srcH * 4)

  for (let row = 0; row < srcH; row++) {
    for (let col = 0; col < srcW; col++) {
      const dst = (row * srcW + col) * 4
      const sp = ((srcY + row) * prevPng.width + (srcX + col)) * 4
      const sc = ((srcY + row) * currPng.width + (srcX + col)) * 4

      prevSlice[dst] = prevPng.data[sp]
      prevSlice[dst + 1] = prevPng.data[sp + 1]
      prevSlice[dst + 2] = prevPng.data[sp + 2]
      prevSlice[dst + 3] = prevPng.data[sp + 3]
      currSlice[dst] = currPng.data[sc]
      currSlice[dst + 1] = currPng.data[sc + 1]
      currSlice[dst + 2] = currPng.data[sc + 2]
      currSlice[dst + 3] = currPng.data[sc + 3]
    }
  }

  const diffImg = new PNG({ width: srcW, height: srcH })
  const changedPixels = pixelmatch(prevSlice, currSlice, diffImg.data, srcW, srcH, { threshold: 0.1 })
  const totalPixels = srcW * srcH

  return {
    changedPixels,
    totalPixels,
    diffPct: totalPixels > 0 ? (changedPixels / totalPixels) * 100 : 0,
  }
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
  for (const selector of CLICK_SELECTORS) {
    try {
      const el = page.locator(selector).first()
      if (await el.isVisible({ timeout: 400 })) {
        await el.click({ timeout: 800 })
        await page.waitForTimeout(250)
      }
    } catch {}
  }

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
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(1000)
    await preparePageForScreenshot(page)
    screenshotBuffer = await page.screenshot({ fullPage, type: 'png' })
    await context.close()
  } finally {
    await browser.close()
  }

  const screenshotPath = `screenshots/${monUrl.workspace_id}/${monUrl.id}/${ts}.png`

  const { error: uploadErr } = await supabase.storage
    .from('screenshots')
    .upload(screenshotPath, screenshotBuffer, { contentType: 'image/png', upsert: false })

  if (uploadErr) {
    logger.error('Upload failed', { url: monUrl.url, error: uploadErr.message })
    throw new Error(`Upload failed: ${uploadErr.message}`)
  }

  const { data: snapshot, error: snapErr } = await supabase
    .from('screenshot_snapshots')
    .insert({
      workspace_id: monUrl.workspace_id,
      monitored_url_id: monUrl.id,
      storage_path: screenshotPath,
      taken_at: now.toISOString(),
      file_size_bytes: screenshotBuffer.length,
      metadata: { viewport_width: 1280, manual_run: monUrl._manual ?? false, full_page: fullPage },
    })
    .select()
    .single()

  if (snapErr || !snapshot) throw new Error(`Failed to save snapshot: ${snapErr?.message}`)

  // Meter the capture the moment it is durable. Doing this after the diff would
  // let a monitor that always fails comparison run for free.
  await recordUsage(supabase, monUrl.workspace_id, {
    checks: 1,
    bytes: screenshotBuffer.length,
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
    const prevPng = PNG.sync.read(prevBuffer)
    const currPng = PNG.sync.read(screenshotBuffer)

    const width = Math.min(prevPng.width, currPng.width)
    const minH = Math.min(prevPng.height, currPng.height)
    const maxH = Math.max(prevPng.height, currPng.height)
    const totalPixels = width * maxH

    const prevSlice = new Uint8Array(width * minH * 4)
    const currSlice = new Uint8Array(width * minH * 4)

    for (let row = 0; row < minH; row++) {
      for (let col = 0; col < width; col++) {
        const dst = (row * width + col) * 4
        const sp = (row * prevPng.width + col) * 4
        const sc = (row * currPng.width + col) * 4

        prevSlice[dst] = prevPng.data[sp]
        prevSlice[dst + 1] = prevPng.data[sp + 1]
        prevSlice[dst + 2] = prevPng.data[sp + 2]
        prevSlice[dst + 3] = prevPng.data[sp + 3]
        currSlice[dst] = currPng.data[sc]
        currSlice[dst + 1] = currPng.data[sc + 1]
        currSlice[dst + 2] = currPng.data[sc + 2]
        currSlice[dst + 3] = currPng.data[sc + 3]
      }
    }

    const diffImg = new PNG({ width, height: minH })
    const changedPixels = pixelmatch(prevSlice, currSlice, diffImg.data, width, minH, { threshold: 0.1 })
    const extraPixels = width * (maxH - minH)
    pageDiffPct = ((changedPixels + extraPixels) / totalPixels) * 100

    if (zones.length > 0) {
      zoneCrops = []
      let zoneChangedPixels = 0
      let zoneTotalPixels = 0

      for (let i = 0; i < zones.length; i++) {
        const zone = zones[i]
        const label = zone.label?.trim() || `Zone ${i + 1}`
        const beforeCrop = cropZone(prevPng, zone)
        const afterCrop = cropZone(currPng, zone)
        const score = diffZone(prevPng, currPng, zone)
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
      const diffBuffer = PNG.sync.write(diffImg)
      const diffPath = `diffs/${monUrl.workspace_id}/${monUrl.id}/${ts}.png`
      const { error: diffUploadErr } = await supabase.storage.from('screenshots').upload(diffPath, diffBuffer, { contentType: 'image/png' })
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
  const AI_FLOOR = zoneCrops ? 0 : 0.05
  const passesFloor = zoneCrops ? passedZones.length > 0 : diffPct >= AI_FLOOR
  // Without the model pass there is no relevance judgement to make, so the
  // pixel threshold the user configured becomes the alert decision on its own.
  const shouldRunAI = passesFloor && plan.features.aiSummaries
  const shouldConsiderAlert = plan.features.aiSummaries
    ? passesFloor
    : diffPct >= (monUrl.threshold_pct ?? 5)
  let alerted = false

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
        })
        shouldAlert = aiResult.shouldAlert
        aiSummary = aiResult.summary
        await recordUsage(supabase, monUrl.workspace_id, { aiCalls: 1 })
        logger.info('AI analysis complete', {
          url: monUrl.url,
          shouldAlert,
          summaryLen: aiSummary.length,
          alertScore,
          zoneCount: zoneCrops?.length ?? 0,
          passedZoneCount: passedZones.length,
          zoneDiffPct: zoneDiffPct != null ? zoneDiffPct.toFixed(3) : null,
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

      await supabase.from('alerts').insert({
        workspace_id: monUrl.workspace_id,
        monitored_url_id: monUrl.id,
        alert_type: 'visual_change',
        severity,
        status: 'open',
        title: semanticAlertTitle(monUrl, passedZones),
        summary: aiSummary || semanticFallbackSummary(Boolean(zoneCrops)),
        ai_summary: aiSummary || null,
        diff_pct: diffPct,
        diff_storage_path: diffStoragePath,
        current_snapshot_id: snapshot.id,
        previous_snapshot_id: prevSnapshot.id,
        metadata: {
          url: monUrl.url,
          threshold_pct: monUrl.threshold_pct,
          alert_score: alertScore,
          page_diff_pct: Number(pageDiffPct.toFixed(4)),
          zone_diff_pct: zoneDiffPct != null ? Number(zoneDiffPct.toFixed(4)) : null,
          passed_zone_count: passedZones.length,
          zone_scores: zoneScores,
        },
        triggered_at: now.toISOString(),
      })
      alerted = true
      logger.info('Alert created', { url: monUrl.url, diffPct: diffPct.toFixed(1), alertScore, aiSuppressed: false })
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
