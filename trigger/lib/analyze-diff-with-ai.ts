import Anthropic from '@anthropic-ai/sdk'
import sharp from 'sharp'
import type { ContentChange } from '../../lib/content-diff'

export interface ZoneCrop {
  label:        string   // e.g. "Zone 1" or user-provided label
  instruction?: string   // user-provided per-zone watch instruction
  sensitivity?: 'low' | 'normal' | 'high'
  before:       Buffer   // PNG buffer of the zone cropped from the previous screenshot
  after:        Buffer   // PNG buffer of the zone cropped from the current screenshot
}

export interface AiAnalysisResult {
  shouldAlert: boolean
  summary: string   // Always populated: either Claude's description or a generic fallback
}

/**
 * JSON schema for the classification result, used via `output_config.format`
 * (structured outputs) rather than free text. Two things this buys over the
 * old "reply NO_ALERT or a sentence" convention: the veto decision is a real
 * typed boolean instead of a string-prefix match, and `summary` can never
 * come back wrapped in preamble/markdown the old prompt had to explicitly
 * forbid.
 *
 * Deliberately NOT built with assistant-message prefill (unsupported / 400s
 * on current models) and NOT the deprecated top-level `output_format` — both
 * would be the "obvious" way to do this from older training data.
 */
const CLASSIFICATION_FORMAT: Anthropic.Messages.OutputConfig['format'] = {
  type: 'json_schema',
  schema: {
    type: 'object',
    properties: {
      should_alert: {
        type: 'boolean',
        description: 'Whether this change is relevant enough to alert the user about, given their watch instructions (if any).',
      },
      summary: {
        type: 'string',
        description:
          'A plain-English 1-2 sentence description of exactly what changed. Empty string when should_alert is false.',
      },
    },
    required: ['should_alert', 'summary'],
    additionalProperties: false,
  },
}

/**
 * Downscale + re-encode an image before it goes to the model. A full-page
 * capture can be 1280x6000; sending it at full size is pure waste since the
 * model downsamples internally anyway. Zone crops are already small, but are
 * still passed through this so nothing ever exceeds the cap.
 */
async function toModelImage(buf: Buffer): Promise<string> {
  const resized = await sharp(buf)
    .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  return resized.toString('base64')
}

/** Human-readable rendering of one structured content change, for the text-first prompt and for the no-API-key/call-failure fallback. */
function describeChange(c: ContentChange): string {
  switch (c.kind) {
    case 'price':
      return `The price for "${c.label}" changed from ${c.from} to ${c.to}.`
    case 'price_added':
      return `A new price appeared${c.label ? ` for "${c.label}"` : ''}: ${c.value}.`
    case 'price_removed':
      return `A price was removed${c.label ? ` for "${c.label}"` : ''}: ${c.value}.`
    case 'heading_added':
      return `A new heading appeared: "${c.text}".`
    case 'heading_removed':
      return `A heading was removed: "${c.text}".`
    case 'heading_changed':
      return `A heading changed from "${c.from}" to "${c.to}".`
    case 'text_added':
      return `New text appeared: "${c.text}"`
    case 'text_removed':
      return `Text was removed: "${c.text}"`
    case 'meta_changed':
      return `The page ${c.field} changed from "${c.from}" to "${c.to}".`
    case 'structure_changed':
      return `The page's layout/structure changed.`
  }
}

/** Priority order for picking the 1-2 most alert-worthy changes to summarize when there's no model call to ask (no API key, or the call failed). Prices first — they're the highest-value field in the whole feature. */
const CHANGE_PRIORITY: ContentChange['kind'][] = [
  'price', 'price_added', 'price_removed',
  'heading_changed', 'heading_added', 'heading_removed',
  'text_added', 'text_removed',
  'meta_changed', 'structure_changed',
]

function summarizeContentChangesPlain(changes: ContentChange[]): string {
  if (changes.length === 0) {
    return 'A change was detected. Open the before/after comparison to review the exact change.'
  }
  const sorted = [...changes].sort((a, b) => CHANGE_PRIORITY.indexOf(a.kind) - CHANGE_PRIORITY.indexOf(b.kind))
  return sorted.slice(0, 2).map(describeChange).join(' ')
}

/**
 * Asks Claude Haiku to look at a change and decide:
 *  - Whether the change is relevant to what the user asked to watch
 *  - A plain-English description of what changed (1-2 sentences)
 *
 * Three input shapes, cheapest first:
 *  1. `contentChanges` set, no zones, `forceImages` false: TEXT ONLY. The
 *     structured changes `diffExtracts` already found are handed to the
 *     model as a bullet list — no images at all. This is the point of the
 *     whole feature: text tokens are a small fraction of the cost of two
 *     full-page images, and the model already knows exactly what changed
 *     without having to visually re-derive it.
 *  2. `zoneCrops` set: cropped before/after image pairs, one per tracked
 *     zone — unchanged from the original pixel-diff pipeline.
 *  3. Neither of the above (extraction returned null, or the change is
 *     layout-only — `structure_changed` with no text/price changes):
 *     full-page before/after images, same as this function has always done.
 *
 * If ANTHROPIC_API_KEY is not set, returns a summary built directly from
 * whatever information is available (content changes if present, otherwise a
 * generic pixel-based fallback) so alerting still fires without making pixel
 * percentage the user-facing reason.
 */
export async function analyzeWithAI(params: {
  beforeBuffer:     Buffer
  afterBuffer:      Buffer
  diffPct:          number
  watchDescription: string | null
  thresholdPct?:    number
  zoneCrops?:       ZoneCrop[]   // if set, use these instead of full-page images
  /**
   * Structured changes from `diffExtracts`. Non-null and non-empty routes
   * this call to the text-only path (unless zones or `forceImages` say
   * otherwise). Null means extraction failed or there is no prior extract to
   * diff against — the caller should also set `forceImages` in that case.
   */
  contentChanges?:  ContentChange[] | null
  /**
   * Forces the image path even when `contentChanges` is set — used for a
   * layout-only change (`structure_changed` with nothing else) or when
   * `contentChanges` is null. Ignored when `zoneCrops` is set, since zones
   * already dictate an image-based comparison.
   */
  forceImages?:     boolean
}): Promise<AiAnalysisResult> {
  const { beforeBuffer, afterBuffer, diffPct, watchDescription, thresholdPct, zoneCrops, contentChanges, forceImages } = params

  const hasZones = Boolean(zoneCrops && zoneCrops.length > 0)
  const textOnly = !hasZones && !forceImages && contentChanges != null && contentChanges.length > 0

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    if (textOnly) return { shouldAlert: true, summary: summarizeContentChangesPlain(contentChanges!) }
    return { shouldAlert: true, summary: genericSummary(diffPct, hasZones) }
  }

  const client = new Anthropic({ apiKey })

  // Build content array

  const content: Anthropic.ContentBlockParam[] = []

  if (!textOnly) {
    try {
      if (hasZones) {
        // Send before/after crops for each zone as image pairs
        for (const crop of zoneCrops!) {
          const instruction = crop.instruction?.trim()
          const sensitivity = crop.sensitivity ?? 'normal'
          const meta = instruction
            ? `${crop.label} - watch instruction: "${instruction}". Sensitivity: ${sensitivity}.`
            : `${crop.label} - no custom watch instruction. Sensitivity: ${sensitivity}.`

          content.push({ type: 'text', text: meta })
          content.push({ type: 'text', text: `${crop.label} - before:` })
          content.push({
            type:   'image',
            source: { type: 'base64', media_type: 'image/webp', data: await toModelImage(crop.before) },
          })
          content.push({ type: 'text', text: `${crop.label} - after:` })
          content.push({
            type:   'image',
            source: { type: 'base64', media_type: 'image/webp', data: await toModelImage(crop.after) },
          })
        }
      } else {
        // Full-page comparison
        content.push({
          type:   'image',
          source: { type: 'base64', media_type: 'image/webp', data: await toModelImage(beforeBuffer) },
        })
        content.push({
          type:   'image',
          source: { type: 'base64', media_type: 'image/webp', data: await toModelImage(afterBuffer) },
        })
      }
    } catch (encodeErr) {
      console.error('[analyzeWithAI] Image resize/encode failed, falling back to generic alert:', encodeErr)
      return { shouldAlert: true, summary: genericSummary(diffPct, hasZones) }
    }
  }

  // Build prompt

  let prompt: string

  if (textOnly) {
    const bullets = contentChanges!.map((c) => `- ${describeChange(c)}`).join('\n')

    const watchNote = watchDescription?.trim()
      ? `The user wants to be alerted when: "${watchDescription.trim()}"`
      : `The user has no specific watch instruction — alert for any change a visitor would consider meaningful (content, pricing, structure), not cosmetic noise.`

    prompt = [
      `An automated content extraction found the following differences between the previous and current version of a monitored web page:`,
      ``,
      bullets,
      ``,
      watchNote,
      ``,
      `Decide whether this is worth alerting the user about, and if so, describe it in one or two plain sentences (you may combine or rephrase the bullets above — do not just restate them verbatim). If none of these differences are things the user would care about (e.g. only volatile/noise content slipped through), decide not to alert.`,
    ].join('\n')
  } else if (hasZones) {
    const zoneBrief = zoneCrops!.map((z, i) => {
      const instruction = z.instruction?.trim()
      return [
        `${i + 1}. ${z.label}`,
        `   Sensitivity: ${z.sensitivity ?? 'normal'}`,
        `   Watch instruction: ${instruction ? `"${instruction}"` : 'No custom instruction. Alert for meaningful visual changes in this zone.'}`,
      ].join('\n')
    }).join('\n')

    const globalFallback = watchDescription?.trim()
      ? `If a zone has no custom watch instruction, use this monitor-level fallback: "${watchDescription.trim()}"`
      : `If a zone has no custom watch instruction, alert only for meaningful visual changes in that zone.`

    const sensitivityNote = [
      `Interpret zone sensitivity this way:`,
      `- high: alert for small but visible changes that match the zone instruction.`,
      `- normal: alert for clear content, layout, image, price, status, or text changes.`,
      `- low: suppress minor cosmetic shifts, small timestamp updates, ad/noise changes, and tiny layout movement unless the zone instruction explicitly says to watch them.`,
    ].join('\n')

    const thresholdNote = thresholdPct != null
      ? `The monitor-level pixel threshold is ${thresholdPct}%, but zone instructions are more important than the global threshold when deciding relevance.`
      : `Zone instructions are the main source of truth when deciding relevance.`

    prompt = [
      `The user is monitoring specific zones on a web page. You are shown before/after image pairs for each zone.`,
      ``,
      `Zone rules:`,
      zoneBrief,
      ``,
      globalFallback,
      thresholdNote,
      sensitivityNote,
      ``,
      `Decide whether any zone changed in a way that matches its own watch instruction. If YES, describe exactly what changed in one or two plain sentences (mention the zone name when useful; if multiple zones changed, summarize without being verbose). If NO zone changed in a relevant way, decide not to alert.`,
      ``,
      `Ignore unrelated noise such as ads rotating, cookie banners, chat widgets, loading shimmer, tiny antialiasing differences, and timestamps unless a zone instruction explicitly asks to watch them.`,
    ].join('\n')
  } else {
    // Full-page image comparison (extraction failed, or a layout-only change)
    const sensitivityNote = thresholdPct != null
      ? `The user's sensitivity is set to ${thresholdPct}% - changes smaller than this are generally considered noise by them.`
      : ''

    if (watchDescription?.trim()) {
      prompt = [
        `The user is monitoring a web page and wants to be alerted when: "${watchDescription.trim()}"`,
        ``,
        `The page changed: ${diffPct.toFixed(1)}% of pixels are different between the before and after screenshots.`,
        sensitivityNote,
        ``,
        `Look at both screenshots carefully. Did something the user specifically cares about change? If YES, describe exactly what changed in one or two plain sentences (be specific, e.g. "The pricing plan changed from $29/mo to $39/mo" or "The hero headline now reads 'New: Enterprise Plan'"). If NO (the change is unrelated noise such as ads rotating, a timestamp updating, or minor layout shifts the user would not care about), decide not to alert.`,
      ].filter(Boolean).join('\n')
    } else {
      prompt = [
        `A web page changed: ${diffPct.toFixed(1)}% of pixels are different between the before and after screenshots.`,
        sensitivityNote,
        ``,
        `Look at both screenshots and describe what visually changed in one or two plain sentences. Be specific if you can (e.g. "The navigation bar colour changed from dark to light" or "New content appeared in the main hero section").`,
      ].filter(Boolean).join('\n')
    }
  }

  content.push({ type: 'text', text: prompt })

  // Call Claude

  try {
    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages:   [{ role: 'user', content }],
      output_config: { format: CLASSIFICATION_FORMAT },
      // Haiku 4.5 does not take adaptive thinking, and this is a cheap,
      // high-volume path — no `thinking` param here.
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')
      .trim()

    let parsed: { should_alert?: unknown; summary?: unknown } | null = null
    try {
      parsed = JSON.parse(text)
    } catch (parseErr) {
      console.error('[analyzeWithAI] Could not parse structured output, falling back to generic alert:', parseErr, text)
    }

    if (!parsed || typeof parsed.should_alert !== 'boolean') {
      return { shouldAlert: true, summary: textOnly ? summarizeContentChangesPlain(contentChanges!) : genericSummary(diffPct, hasZones) }
    }

    if (!parsed.should_alert) return { shouldAlert: false, summary: '' }

    const summary = typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : null
    return {
      shouldAlert: true,
      summary: summary ?? (textOnly ? summarizeContentChangesPlain(contentChanges!) : genericSummary(diffPct, hasZones)),
    }
  } catch (err) {
    console.error('[analyzeWithAI] Claude call failed, falling back to generic alert:', err)
    if (textOnly) return { shouldAlert: true, summary: summarizeContentChangesPlain(contentChanges!) }
    return { shouldAlert: true, summary: genericSummary(diffPct, hasZones) }
  }
}

function genericSummary(diffPct: number, hasZones = false): string {
  if (hasZones) {
    if (diffPct >= 10) return 'A significant change was detected inside one of the watched zones. Open the before/after comparison to review the exact change.'
    return 'A watched zone changed in a way that passed its sensitivity setting. Open the before/after comparison to review the exact change.'
  }

  if (diffPct >= 50) return 'A major visual change was detected. The page structure appears significantly altered.'
  if (diffPct >= 25) return 'A significant visual change was detected. Multiple elements appear to have shifted or been replaced.'
  if (diffPct >= 10) return 'A moderate visual change was detected. Some content or styling appears to have changed.'
  return 'A small visual change was detected. Open the before/after comparison to review the exact change.'
}
