/**
 * Runs Lighthouse against the local production build.
 *
 * Expects `pnpm preview` to already be serving on :4173 (the same port the
 * Playwright config and the other audit scripts use).
 *
 *   pnpm build && pnpm preview      # in one terminal
 *   pnpm lighthouse                 # in another
 *
 * Writes the JSON report to lighthouse.json and a human-readable summary to
 * stdout. Mobile emulation with 4x CPU throttling and slow-4G, matching how
 * the scores in the README were taken.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const ORIGIN = process.env.LH_ORIGIN ?? "http://localhost:4173";
const OUT = "lighthouse.json";
const CHROME =
  process.env.LH_CHROME ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/** Poll the preview server until it answers, so we don't race the build. */
async function waitForServer(url, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  return false;
}

if (!(await waitForServer(ORIGIN))) {
  console.error(`\nNo server answering at ${ORIGIN}.`);
  console.error("Start one first:  pnpm build && pnpm preview\n");
  process.exit(1);
}

if (!existsSync(CHROME)) {
  console.error(`\nChrome/Edge not found at: ${CHROME}`);
  console.error("Set LH_CHROME to a Chrome or Edge binary.\n");
  process.exit(1);
}

// Lighthouse ships as a CLI inside the npx cache; run it via npx so it stays
// out of the project's dependency tree.
const args = [
  "lighthouse",
  ORIGIN,
  "--output=json",
  `--output-path=${OUT}`,
  "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
  "--form-factor=mobile",
  "--screenEmulation.mobile",
  "--throttling-method=simulate",
  "--throttling.cpuSlowdownMultiplier=4",
  "--only-categories=" + CATEGORIES.join(","),
];

console.log(`Running Lighthouse against ${ORIGIN} ...\n`);

const child = spawn("npx", args, { stdio: "inherit", shell: true });
const code = await new Promise((resolve) => child.on("close", resolve));

if (code !== 0 || !existsSync(OUT)) {
  console.error(`\nLighthouse failed (exit ${code}).`);
  process.exit(code ?? 1);
}

const report = JSON.parse(readFileSync(OUT, "utf8"));
const score = (c) => {
  const v = report.categories?.[c]?.score;
  return v == null ? "n/a" : Math.round(v * 100);
};

console.log("\nLighthouse (mobile, 4x CPU + slow-4G)");
console.log("--------------------------------------");
for (const c of CATEGORIES) {
  const label = c.replace("best-practices", "best practices").padEnd(18);
  console.log(`  ${label} ${score(c)}`);
}

const lcp = report.audits?.["largest-contentful-paint"]?.displayValue;
const tbt = report.audits?.["total-blocking-time"]?.displayValue;
const cls = report.audits?.["cumulative-layout-shift"]?.displayValue;
if (lcp) console.log(`\n  LCP ${lcp}   TBT ${tbt ?? "n/a"}   CLS ${cls ?? "n/a"}`);

const fails = Object.values(report.audits ?? {})
  .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode === "binary")
  .map((a) => `  - ${a.title}`)
  .slice(0, 15);
if (fails.length) {
  console.log("\nFailing audits:");
  fails.forEach((f) => console.log(f));
}

writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(`\nFull report: ${OUT}`);
