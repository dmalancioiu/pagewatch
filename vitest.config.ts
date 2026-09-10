import { defineConfig } from 'vitest/config'
import path from 'node:path'

/**
 * Node environment by default — every module under test here (lib/plans,
 * lib/url, lib/entitlements assertions, the isDue predicate) is pure or
 * server-only. Add a jsdom project/override if component tests show up
 * later; don't pay for a DOM in every run until then.
 */
export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'build'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
