import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const FONTS_DIR = "scripts/.fonts";
const LIMELIGHT = join(FONTS_DIR, "Limelight-Regular.ttf");
const LIMELIGHT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/limelight/Limelight-Regular.ttf";

const W = 1200;
const H = 630;

async function main() {
  mkdirSync(FONTS_DIR, { recursive: true });
  if (!existsSync(LIMELIGHT)) {
    const res = await fetch(LIMELIGHT_URL);
    if (!res.ok) throw new Error("limelight download failed");
    writeFileSync(LIMELIGHT, Buffer.from(await res.arrayBuffer()));
  }

  const avatar = await sharp("public/assets/me/passport-320.webp")
    .resize(180, 180)
    .png()
    .toBuffer();

  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#FAF7F2"/>
  <circle cx="180" cy="140" r="200" fill="#D9D4F6" opacity="0.55"/>
  <circle cx="1020" cy="540" r="200" fill="#FFD9C7" opacity="0.6"/>
  <circle cx="880" cy="200" r="108" fill="#FFFFFF"/>
  <clipPath id="av"><circle cx="880" cy="200" r="96"/></clipPath>
  <image x="800" y="120" width="180" height="180" clip-path="url(#av)" href="data:image/png;base64,${avatar.toString("base64")}"/>
  <text x="90" y="300" font-family="Limelight" font-size="120" fill="#2B2A33">Akhil</text>
  <text x="92" y="372" font-family="Segoe UI" font-size="34" fill="#2B2A33">Full-Stack AI Developer — Hyderabad</text>
  <text x="90" y="440" font-family="Segoe UI" font-size="22" fill="#6B6879">llm pipelines · rag · voice agents · photography</text>
  <rect x="90" y="475" width="180" height="8" rx="4" fill="#FF5D3A"/>
</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: {
      fontFiles: [LIMELIGHT],
      loadSystemFonts: true,
      defaultFontFamily: "Segoe UI",
    },
  });
  writeFileSync("public/og.png", resvg.render().asPng());
  console.log("public/og.png written");
}

main();
