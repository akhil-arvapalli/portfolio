import { chromium } from "@playwright/test";
import sharp from "sharp";

const b = await chromium.launch({ channel: "msedge", headless: true });
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const card = page.locator('#hero div[class*="aspect-"]').first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
const bb = await card.boundingBox();
await page.screenshot({ path: "test-results/rv-base.png", clip: bb });

// sweep across the card â€” must reveal racing portrait
for (let i = 0; i <= 20; i++) {
  await page.mouse.move(bb.x + (i / 20) * bb.width, bb.y + (i / 20) * bb.height);
  await page.waitForTimeout(25);
}
await page.screenshot({ path: "test-results/rv-hot.png", clip: bb });

// stop â€” trail must decay, base returns
await page.mouse.move(bb.x - 60, bb.y - 60);
await page.waitForTimeout(2600);
await page.screenshot({ path: "test-results/rv-cool.png", clip: bb });

// About section integrated + no horizontal overflow at 360px
await page.setViewportSize({ width: 360, height: 800 });
await page.waitForTimeout(600);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.setViewportSize({ width: 1280, height: 900 });
const about = await page.locator("#about").count();

async function diff(a, c) {
  const A = await sharp(a).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(c).raw().toBuffer({ resolveWithObject: true });
  let n = 0, changed = 0, sum = 0;
  for (let i = 0; i < A.data.length; i += A.info.channels) {
    const d =
      Math.abs(A.data[i] - B.data[i]) +
      Math.abs(A.data[i + 1] - B.data[i + 1]) +
      Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d > 24) changed++;
    sum += d;
    n++;
  }
  return { changedPct: ((100 * changed) / n).toFixed(2), mean: (sum / (3 * n)).toFixed(2) };
}

console.log("REVEAL hot vs base  :", JSON.stringify(await diff("test-results/rv-base.png", "test-results/rv-hot.png")));
console.log("UNREVEAL cool vs hot:", JSON.stringify(await diff("test-results/rv-hot.png", "test-results/rv-cool.png")));
console.log("cool vs base (should be ~0):", JSON.stringify(await diff("test-results/rv-base.png", "test-results/rv-cool.png")));
console.log("360px h-overflow px:", overflow, "| about section:", about);
console.log("CONSOLE ERRORS:", errors.length ? errors.join("\n---\n") : "(none)");
await b.close();

