import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4173",
    ...(process.env.PW_CHROMIUM
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM, args: JSON.parse(process.env.PW_ARGS ?? "[]") } }
      : { channel: process.env.PLAYWRIGHT_CHANNEL ?? "msedge" }),
    screenshot: "off", // NO screenshots — DOM/console/bounding-box assertions only
    video: "off",
  },
  webServer: {
    command: "pnpm preview --port 4173 --strictPort",
    port: 4173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
