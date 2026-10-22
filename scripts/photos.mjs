// Usage: put photos in /photos-src (jpg, png, webp, avif), then run `pnpm photos`.
// Files are sorted by name (prefix with 01-, 02- to control the order). Alt text you
// already wrote in src/content/photos.json is kept; new photos get a placeholder to edit.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "photos-src";
const OUT = "public/assets/photography";
const JSON_PATH = "src/content/photos.json";
const WIDTHS = [800, 1280, 1920];

const slug = (f) =>
  path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const existing = JSON.parse(await fs.readFile(JSON_PATH, "utf8").catch(() => "[]"));
const altByName = new Map(existing.map((p) => [p.name, p.alt]));

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f)).sort();
if (!files.length) throw new Error(`No images found in ${SRC}/`);

const list = [];
for (const f of files) {
  const name = slug(f);
  const input = path.join(SRC, f);
  let outW = 0;
  let outH = 0;
  for (const w of WIDTHS) {
    const img = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    const info = await img.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.webp`));
    if (w === 1280) {
      outW = info.width;
      outH = info.height;
      await img.clone().jpeg({ quality: 84, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${name}-1280.jpg`));
    }
  }
  list.push({
    name,
    alt: altByName.get(name) ?? "TODO: describe this photo for screen readers",
    width: outW,
    height: outH,
  });
  console.log("✓", f, "->", name);
}
await fs.writeFile(JSON_PATH, JSON.stringify(list, null, 2) + "\n");
const todo = list.filter((p) => p.alt.startsWith("TODO"));
console.log(`\nWrote ${list.length} photo(s) to ${JSON_PATH}.`);
if (todo.length) console.log(`Edit the alt text for: ${todo.map((p) => p.name).join(", ")}`);
