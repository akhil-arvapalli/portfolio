# /public/assets/me/ — DROP YOUR PHOTO HERE

**This folder is where your portrait goes.** Until it does, the site renders
`placeholder.svg` — a deliberately abstract HUD-styled silhouette, not a fake face.

## What to put here

| File | Purpose | Ideal |
|---|---|---|
| `hero.jpg` | Hero portrait | ≥1600×2000, subject on a plain-ish background so the cutout pipeline can mask it |

Any filename works — but if you use `hero.jpg`, the manifest in
`src/config/site.ts` (`PHOTO_PLACEHOLDER.src`) needs updating to match.
`scripts/optimize-assets.ts` regenerates the manifest automatically.

## Then run

```bash
pnpm optimize:assets
```

That produces, alongside your source image:
- `hero.avif` + `hero.webp` — modern formats, correctly sized
- `hero-blur.jpg` + a base64 LQIP for blur-up placeholders
- an alpha **cutout** if the background is flat/clean (this is what makes the
  hero photo sit *in* the scene rather than on a rectangle)

…then rewrites the asset manifest in `src/config/site.ts` so the components
pick up the new paths with no manual editing.

## Optional
Drop 1–2 more images here for card/detail pages. The script handles any image
it finds in this folder.