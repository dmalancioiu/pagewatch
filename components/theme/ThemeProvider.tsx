'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * Thin wrapper around `next-themes`.
 *
 * `attribute="class"` puts `.dark` / no-class on `<html>`, matching the
 * `:root` / `.dark` token pairs defined in `app/globals.css`. Dark is the
 * product default (see docs/DESIGN_SYSTEM.md §1) — `defaultTheme="dark"`
 * with `enableSystem` still lets a viewer opt into following OS preference
 * via the toggle's "system" option.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
