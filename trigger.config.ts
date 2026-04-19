import { defineConfig } from "@trigger.dev/sdk/v3";
import { playwright } from "@trigger.dev/build/extensions/playwright";

export default defineConfig({
  project: "proj_femgaoshhlqbobegyjpv",
  runtime: "node",
  logLevel: "info",
  maxDuration: 300,
  dirs: ["./trigger"],
  build: {
    extensions: [playwright()],
    external: ["playwright", "playwright-core", "chromium-bidi"],
  },
});