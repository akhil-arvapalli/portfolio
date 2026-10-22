import { chromium } from "@playwright/test";

const b = await chromium.launch({ channel: "msedge", headless: true });
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const rows = await page.evaluate(() => {
  let prevBottom = 0;
  const out = [];
  for (const el of document.querySelectorAll("main section, footer")) {
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + scrollY);
    const cs = getComputedStyle(el);
    out.push({
      id: el.id || el.tagName,
      top,
      h: Math.round(r.height),
      pad: cs.paddingTop + "/" + cs.paddingBottom,
      gap: top - prevBottom,
    });
    prevBottom = top + r.height;
  }
  return out;
});
for (const s of rows) {
  console.log(String(s.top).padStart(6), (s.id || "").padEnd(12), "h=" + String(s.h).padStart(5), "pad=" + s.pad.padEnd(14), "gap=" + s.gap);
}
const total = await page.evaluate(() => document.documentElement.scrollHeight);
console.log("TOTAL PAGE:", total, "px = about", Math.round(total / 900), "viewports");
await b.close();
