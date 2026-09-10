/**
 * Local email renderer.
 *
 * `@react-email/components` is intentionally NOT a dependency — every
 * template under `emails/` is a plain, typed tree of React elements built
 * with `React.createElement` (never JSX syntax). That's deliberate, not a
 * style preference: it means this directory compiles identically under
 * Next.js's own build *and* Trigger.dev's separate esbuild worker bundle
 * (`trigger.config.ts`) no matter how either bundler's JSX transform is
 * configured, since there is no JSX for a transform to disagree about.
 * `renderToStaticMarkup` ships with `react-dom`, already a dependency, so
 * nothing new needed to be installed to render these to HTML strings.
 *
 * ── Inline styles only — this is the one exception in the codebase ────────
 * The rest of this app is moving away from `style={{}}` (see
 * docs/DESIGN_SYSTEM.md §8). Email is the opposite: Gmail, Outlook and most
 * mobile mail clients strip `<style>` tags and ignore CSS classes entirely,
 * several ignore flexbox/grid, and none understand CSS custom properties.
 * So every template here uses `<table>`-based layout, literal
 * `style={{...}}` objects with explicit pixel widths, and literal hex colors
 * (see `colors` in `components.tsx`) instead of design-system tokens. This
 * is the one place that inline-styles-everywhere is correct, not a shortcut.
 */
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export interface RenderedEmail {
  html: string
  text: string
}

/** Renders a template's root `<html>` element tree to a full HTML document string. */
export function renderEmailToHtml(element: React.ReactElement): string {
  return `<!DOCTYPE html>\n${renderToStaticMarkup(element)}`
}

/**
 * Normalizes a hand-written template-literal plain-text body: trims each
 * line (so template indentation doesn't leak into the email) and collapses
 * runs of blank lines. Every template's exported `*Text` function should
 * pass its result through this before returning it.
 */
export function normalizePlainText(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
