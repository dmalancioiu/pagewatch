import Anthropic from '@anthropic-ai/sdk'

const NO_ALERT_MARKER = 'NO_ALERT'

export interface ZoneCrop {
  label:  string   // e.g. "Zone 1" or user-provided label
  before: Buffer   // PNG buffer of the zone cropped from the previous screenshot
  after:  Buffer   // PNG buffer of the zone cropped from the current screenshot
}

export interface AiAnalysisResult {
  shouldAlert: boolean
  summary: string   // Always populated — either Claude's description or a generic fallback
}

/**
 * Asks Claude Haiku to look at before/after screenshots (or zone crops) and decide:
 *  - Whether the change is relevant to what the user asked to watch
 *  - A plain-English description of what changed (1-2 sentences)
 *
 * When zoneCrops are provided (user has defined tracking zones), Claude receives
 * cropped before/after pairs for each zone instead of the full page screenshots.
 * This focuses the analysis on exactly what the user cares about and reduces noise.
 *
 * If ANTHROPIC_API_KEY is not set, returns a generic summary so alerting still fires.
 */
export async function analyzeWithAI(params: {
  beforeBuffer:     Buffer
  afterBuffer:      Buffer
  diffPct:          number
  watchDescription: string | null
  thresholdPct?:    number
  zoneCrops?:       ZoneCrop[]   // if set, use these instead of full-page images
}): Promise<AiAnalysisResult> {
  const { beforeBuffer, afterBuffer, diffPct, watchDescription, thresholdPct, zoneCrops } = params

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { shouldAlert: true, summary: genericSummary(diffPct) }
  }

  const client = new Anthropic({ apiKey })

  const hasZones = zoneCrops && zoneCrops.length > 0

  // ── Build content array ──────────────────────────────────────────────────────

  const content: Anthropic.ContentBlockParam[] = []

  if (hasZones) {
    // Send before/after crops for each zone as image pairs
    for (const crop of zoneCrops) {
      content.push({ type: 'text', text: `${crop.label} — before:` })
      content.push({
        type:   'image',
        source: { type: 'base64', media_type: 'image/png', data: crop.before.toString('base64') },
      })
      content.push({ type: 'text', text: `${crop.label} — after:` })
      content.push({
        type:   'image',
        source: { type: 'base64', media_type: 'image/png', data: crop.after.toString('base64') },
      })
    }
  } else {
    // Full-page comparison
    content.push({
      type:   'image',
      source: { type: 'base64', media_type: 'image/png', data: beforeBuffer.toString('base64') },
    })
    content.push({
      type:   'image',
      source: { type: 'base64', media_type: 'image/png', data: afterBuffer.toString('base64') },
    })
  }

  // ── Build prompt ─────────────────────────────────────────────────────────────

  let prompt: string

  if (hasZones) {
    const zoneNames = zoneCrops.map((z) => z.label).join(', ')
    const sensitivityNote = thresholdPct != null
      ? ` The user's sensitivity is set to ${thresholdPct}%.`
      : ''

    if (watchDescription?.trim()) {
      prompt = [
        `The user is monitoring ${zoneCrops.length} specific zone${zoneCrops.length !== 1 ? 's' : ''} on a web page (${zoneNames}) and wants to be alerted when: "${watchDescription.trim()}"`,
        ``,
        `You are shown before/after image pairs for each zone.${sensitivityNote}`,
        ``,
        `Did anything the user specifically cares about change in any of these zones?`,
        ``,
        `- If YES: describe exactly what changed in one or two plain sentences, mentioning which zone if relevant.`,
        `  Be specific (e.g. "The pricing zone changed from $29/mo to $39/mo" or "The hero zone now shows a new 'Sale' banner").`,
        `- If NO (no relevant change in the watched zones): respond with only the word NO_ALERT.`,
        ``,
        `Respond with either NO_ALERT or a 1-2 sentence description. No preamble, no labels, no formatting.`,
      ].join('\n')
    } else {
      prompt = [
        `The user is monitoring ${zoneCrops.length} specific zone${zoneCrops.length !== 1 ? 's' : ''} on a web page (${zoneNames}).${sensitivityNote}`,
        ``,
        `You are shown before/after image pairs for each zone.`,
        ``,
        `Did anything visually change in any of these zones?`,
        ``,
        `- If YES: describe what changed in one or two plain sentences, mentioning which zone if relevant.`,
        `  Be specific (e.g. "The price zone changed from $29 to $39" or "New text appeared in the hero zone").`,
        `- If NO meaningful change in any zone: respond with only the word NO_ALERT.`,
        ``,
        `Respond with either NO_ALERT or a 1-2 sentence description. No preamble, no labels, no formatting.`,
      ].join('\n')
    }
  } else {
    // Full-page — original prompt logic
    const sensitivityNote = thresholdPct != null
      ? `The user's sensitivity is set to ${thresholdPct}% — changes smaller than this are generally considered noise by them.`
      : ''

    if (watchDescription?.trim()) {
      prompt = [
        `The user is monitoring a web page and wants to be alerted when: "${watchDescription.trim()}"`,
        ``,
        `The page changed — ${diffPct.toFixed(1)}% of pixels are different between the before and after screenshots.`,
        sensitivityNote,
        ``,
        `Look at both screenshots carefully. Did something the user specifically cares about change?`,
        ``,
        `- If YES: describe exactly what changed in one or two plain sentences. Be specific (e.g. "The pricing plan changed from $29/mo to $39/mo" or "The hero headline now reads 'New: Enterprise Plan'").`,
        `- If NO (the change is unrelated noise — ads rotating, a timestamp updating, minor layout shifts the user wouldn't care about): respond with only the word NO_ALERT and nothing else.`,
        ``,
        `Respond with either NO_ALERT or a 1-2 sentence description. No preamble, no labels, no formatting.`,
      ].filter(Boolean).join('\n')
    } else {
      prompt = [
        `A web page changed — ${diffPct.toFixed(1)}% of pixels are different between the before and after screenshots.`,
        sensitivityNote,
        ``,
        `Look at both screenshots and describe what visually changed in one or two plain sentences.`,
        `Be specific if you can (e.g. "The navigation bar colour changed from dark to light" or "New content appeared in the main hero section").`,
        ``,
        `Respond with just the description. No preamble, no labels, no formatting.`,
      ].filter(Boolean).join('\n')
    }
  }

  content.push({ type: 'text', text: prompt })

  // ── Call Claude ──────────────────────────────────────────────────────────────

  try {
    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages:   [{ role: 'user', content }],
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')
      .trim()

    if (text.toUpperCase().startsWith(NO_ALERT_MARKER)) {
      return { shouldAlert: false, summary: '' }
    }

    return {
      shouldAlert: true,
      summary: text || genericSummary(diffPct),
    }
  } catch (err) {
    console.error('[analyzeWithAI] Claude call failed, falling back to generic alert:', err)
    return { shouldAlert: true, summary: genericSummary(diffPct) }
  }
}

function genericSummary(diffPct: number): string {
  if (diffPct >= 50) return `Major layout change detected — ${diffPct.toFixed(1)}% of pixels are different. The page structure appears significantly altered.`
  if (diffPct >= 25) return `Significant visual change — ${diffPct.toFixed(1)}% of pixels changed. Multiple elements appear to have shifted or been replaced.`
  if (diffPct >= 10) return `Moderate change — ${diffPct.toFixed(1)}% of pixels differ. Some content or styling was updated.`
  return `Minor change detected — ${diffPct.toFixed(1)}% of pixels are different. A small text or style update may have occurred.`
}
