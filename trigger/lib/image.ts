import sharp from 'sharp'
import type { Zone } from '../../lib/types/database.types'

/**
 * Raw, fully-decoded RGBA pixel data plus its dimensions. This is the shape
 * every diffing routine in take-screenshot.ts works with once an image has
 * left storage/Playwright and entered the comparison pipeline - it replaces
 * the pngjs `PNG` object the pipeline used to pass around.
 */
export interface RawImage {
  data:   Buffer
  width:  number
  height: number
}

/**
 * Decode any image sharp can read (PNG, WebP, ...) to raw RGBA.
 *
 * Deliberately format-agnostic: older snapshots in storage are PNG, newer
 * ones are WebP, and this must handle both without the caller ever branching
 * on file extension. sharp sniffs the format from the buffer's magic bytes,
 * not from a filename, so it just works either way.
 */
export async function decodeToRaw(buf: Buffer): Promise<RawImage> {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/**
 * Re-encode a full-page (or viewport) capture as WebP for storage upload.
 * Quality 80 is a standard "visually lossless enough" tradeoff for
 * screenshot-style content and cuts stored bytes by roughly 70-85% versus
 * PNG on typical web pages.
 */
export async function encodeCaptureWebp(buf: Buffer): Promise<Buffer> {
  return sharp(buf).webp({ quality: 80 }).toBuffer()
}

/**
 * Encode a raw RGBA buffer (e.g. a pixelmatch diff overlay) as WebP. Used in
 * place of `PNG.sync.write` now that pixelmatch's output buffer is a plain
 * Uint8Array rather than a pngjs `PNG` instance.
 */
export async function encodeRawWebp(data: Buffer | Uint8Array, width: number, height: number): Promise<Buffer> {
  return sharp(Buffer.from(data), { raw: { width, height, channels: 4 } }).webp({ quality: 80 }).toBuffer()
}

/**
 * Generate a small WebP thumbnail (capped at `maxWidth`, default 480px wide)
 * from a full-size capture, for the dashboard's screenshot history grid -
 * which previously loaded the full 1.5-3MB capture for every grid cell.
 */
export async function makeThumbnail(buf: Buffer, maxWidth = 480): Promise<Buffer> {
  return sharp(buf).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
}

/**
 * Crop a normalized (0-1) zone rectangle out of a decoded raw image and
 * re-encode it as a small WebP buffer, ready to hand to the AI call (which
 * downsamples it further) or to store. Mirrors the old pngjs `cropZone` but
 * operates on raw pixel data + sharp instead of a `PNG` instance.
 */
export async function cropZoneWebp(raw: RawImage, zone: Pick<Zone, 'x' | 'y' | 'width' | 'height'>): Promise<Buffer | null> {
  const srcX = Math.max(0, Math.floor(zone.x * raw.width))
  const srcY = Math.max(0, Math.floor(zone.y * raw.height))
  const srcW = Math.min(raw.width - srcX, Math.ceil(zone.width * raw.width))
  const srcH = Math.min(raw.height - srcY, Math.ceil(zone.height * raw.height))

  if (srcW <= 0 || srcH <= 0) return null

  return sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
    .extract({ left: srcX, top: srcY, width: srcW, height: srcH })
    .webp({ quality: 80 })
    .toBuffer()
}
