// Global test setup, loaded before every test file.
//
// Nothing pure-module tests need today (no DOM, no globals to polyfill), but
// this file stays wired into vitest.config.ts so it's the one place to add
// jest-dom matchers, fetch mocks, etc. when component tests land.
export {}
