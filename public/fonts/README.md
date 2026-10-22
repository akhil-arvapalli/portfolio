# /public/fonts/

**No font files here yet.** `index.html` and `tailwind.config.js` reference three
self-hosted faces that are not yet present:

| Role | Family | Referenced as | File expected |
|---|---|---|---|
| Display | Anton SC | `font-display` | `/fonts/anton-sc-latin-400-normal.woff2` |
| Body | Inter | `font-body` | `/fonts/inter-latin-400-normal.woff2` |
| Mono | JetBrains Mono | `font-mono` | `/fonts/jetbrains-mono-latin-400-normal.woff2` |

## Current behaviour — graceful, not broken
`tailwind.config.js` declares a full fallback chain for each, so the site renders
today with system fonts:

```
display → Anton SC → Impact → sans-serif
body    → Inter     → system-ui → sans-serif
mono    → JetBrains Mono → ui-monospace → monospace
```

## Why there are no files
Fonts are licensed assets — they have to be downloaded from the foundry/Google
Fonts and subset by hand. Rather than hotlink a CDN (which adds a render-blocking
third-party connection and hurts the Lighthouse budget), the build self-hosts them.

## To add them
1. Fetch each family (Google Fonts → download the latin subset, or `fontsource`):
   - Anton SC — SIL Open Font License 1.1
   - Inter — SIL Open Font License 1.1
   - JetBrains Mono — SIL Open Font License 1.1
   All three are free to self-host.
2. Drop the latin-subset `.woff2` files in this folder using the exact names above.
3. Add `@font-face` blocks to `src/index.css` with `font-display: swap`.

The two `<link rel="preload">` tags already in `index.html` point at the
Anton and Inter files — they will 404 until step 2 is done, which is a known,
tracked gap. **The font agent owns closing this** (see brain/TODO-ASSETS.md).

## Why preloaded
`display-xl` (the hero name) and body copy are what paint first. Preloading those
two removes the FOUT flash on the largest text on the page.