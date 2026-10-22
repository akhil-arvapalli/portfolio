import { test, expect, type Page } from "@playwright/test";

const SECTIONS = ["hero", "about", "stack", "work", "experience", "recognition", "photography", "contact"];

async function scrollThrough(page: Page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
}

test("home renders every section", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("#hero h1")).toContainText("Arvapalli");
  await expect(page.locator("nav[aria-label='Section navigation']")).toBeVisible();
});

test("every headline actually reveals (no invisible headings = no phantom gaps)", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await scrollThrough(page);
  await page.waitForTimeout(1500);
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll("main h2")]
      .filter((h) => {
        const inner = h.querySelector("span span span") as HTMLElement | null;
        if (!inner) return false;
        const m = new DOMMatrix(getComputedStyle(inner).transform);
        return Math.abs(m.m42) > 2;
      })
      .map((h) => h.textContent)
  );
  expect(stuck).toEqual([]);
});

test("vertical rhythm: no section pair is separated by more than 220px of padding", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  const pads = await page.evaluate(() =>
    [...document.querySelectorAll("main > section.section")].map((s) => {
      const cs = getComputedStyle(s);
      return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    })
  );
  for (const p of pads) expect(p).toBeLessThanOrEqual(220);
});

test("hero portrait renders and the reveal responds to the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4200);
  const canvas = page.locator("canvas[role=img]");
  const box = await canvas.boundingBox();
  expect(box && box.width > 200 && box.height > 200).toBeTruthy();

  const sample = () =>
    canvas.evaluate((c: HTMLCanvasElement) => {
      const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
      let h = 0;
      for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0;
      return h;
    });
  await page.waitForTimeout(2600); // let the intro sweep finish
  const before = await sample();
  await page.mouse.move(box!.x + box!.width * 0.4, box!.y + box!.height * 0.25);
  for (let i = 0; i < 10; i++) {
    await page.mouse.move(box!.x + box!.width * (0.4 + i * 0.02), box!.y + box!.height * 0.25, { steps: 2 });
    await page.waitForTimeout(30);
  }
  const during = await sample();
  expect(during).not.toBe(before);
});

test("no horizontal overflow at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(3500);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(over).toBeLessThanOrEqual(1);
});

test("dock navigation scrolls to a section", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.getByRole("button", { name: "About" }).first().click();
  await page.waitForTimeout(1800);
  const box = await page.locator("#about").boundingBox();
  expect(box!.y).toBeLessThan(300);
});

test("project detail route works", async ({ page }) => {
  await page.goto("/projects/physicslens");
  await page.waitForTimeout(1500);
  await expect(page.getByText("PhysicsLens").first()).toBeVisible();
});

test("404 page renders", async ({ page }) => {
  await page.goto("/definitely-not-a-page");
  await expect(page.getByText("404").first()).toBeAttached();
});

test("no console errors on load", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForTimeout(4500);
  expect(errors.filter((e) => !e.includes("_vercel") && !e.includes("favicon"))).toEqual([]);
});
