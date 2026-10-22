# Redesign notes

## Root causes found
- **Reveal blank/misplaced**: portrait canvas ignored devicePixelRatio (photo drawn in the top-left of a bigger canvas, mask offset from cursor). Rewritten with DPR-scaled contexts.
- **"motion as code" not working**: the app imported `framer-motion` everywhere; the `motion` package was installed but unused. Everything now imports `motion/react`; `framer-motion` removed.
- **Phantom gaps**: headline reveal observed elements hidden inside their own clip mask, so they never became "in view" and stayed invisible. Fixed in `LineReveal`. Section padding is also one token now (`--section-y`).
- **Pale / off-theme leftovers**: `color-scheme: light`, `bg-white/40`, `mix-blend-multiply`, undefined `--band`, unused `marquee-x` keyframe. Removed.
- **Khichdi**: 5 card styles, pastel blobs, brutal shadows, cream marquee bars on dark, Limelight display font. Replaced by one token set + one `Panel` wrapper for every React Bits card.

## Structure
- 14 thin sections -> 8: hero, about, stack, work, experience, recognition, photography, contact.
- Dead code removed: three/R3F scene, orbit, showstopper, gsap ScrollTrigger usage, old cursor.

## Aligned with resume (29-09-26)
- Links filled from the PDF: GitHub, LinkedIn, LeetCode, Throttle Theory (live + repo), PhysicsLens (live + repo), Silent Link and Flood repos, DarexAI certificate, hackathon credentials, certification links. Instagram: @drsyalu.
- CGPA 8.27, "Full-Stack AI Engineer" title, resume experience/project wording, full skills and coursework, resume copied to `public/akhil-resume.pdf`.

## To fill in (placeholders still in `src/content/content.ts`)
PAPER_URL, PHOTO_PORTFOLIO_URL, FORMSPREE_ID.
Buttons for unfilled links are hidden automatically; the contact form falls back to the visitor's mail app until a Formspree id is set.

## Copy I wrote or changed (check these)
- Photography blurb (was `[PHOTO_BLURB]`).
- "Open to opportunities" pill in the hero.
- Stat label "hackathons placed" (was "hackathon wins").

## Palette (round 2)
Navy palette from the "Space Cadet / Slate / Tan / Coffee / Caput Mortuum" reference, no green: base #0e1524, surfaces #162136 / #25344f, cream ink #f3e6d2, tan #d5b893, champagne accent #e2be8a, caput-mortuum fills #7a262b. All colors are tokens in `src/index.css`; change them there.
Hero shows the full name (given names on one line, giant AKHIL behind the portrait).
Dock: glass panel + tiles; the active dot now follows the section you're in (the old observer ran before the lazy sections existed).
StarBorder patched (shared radius, inner padding via `innerClassName`, keyframes restored).

## Round 3: redesign + all GitHub projects
- New concept: printed spec-sheet. Paper (#e8dac2) and navy ink, alternating navy / caput-mortuum bands, square edges, visible column guides, a scroll ruler on the right, Archivo condensed display type with Instrument Serif italics. No gradients or glow.
- Hero: split layout. Full name stacked at the left, portrait in its own panel at the right, so the name is never covered.
- Work: indexed list of builds from github.com/akhil-arvapalli, builds first then academic (SENTINEL, DepViz). Each opens `/projects/<slug>` with bullets and repo/live links. CascadeGuard stays the flagship, labelled "In active development".
- Photography band has a camera focus reticle that follows the cursor. Cursor and ruler recolour by band.

## Round 4: refinement brief (portfolio only)
- Removed: CausalFunnel, JalPath v2 and the WhatsApp AI bot (see note in the hand-off message about the ambiguous entry).
- Internship end date is July 2026 everywhere on the site (education "June 2027" is the graduation date and is unchanged).
- CascadeGuard is shown as "In active development"; no paper link, no "published" wording. The pipeline graphic is labelled a sketch.
- Throttle Theory links to the Vercel deployment from the resume's own links: https://throttle-theory-theta.vercel.app/
- PromptWars added under Hackathons as "Participant" (no result claimed, no credential link).
- About rewritten; identity wording is "Full-Stack AI Developer" site-wide (also page title, meta, JSON-LD).

## Round 5: custom fonts
- Headings: **Highstar** (tall condensed caps). Accent words: **Kolak** (display serif, no italic, so italics are switched off). Body/labels unchanged (Inter, JetBrains Mono, Instrument Serif for the long statements).
- Files: `public/fonts/Highstar.woff2`, `public/fonts/Kolak.woff2`, preloaded in `index.html`. Archivo removed.
- **Licensing:** Highstar's author note says personal use only; promotional or commercial use needs a paid license (https://brandsemut.com/product/highstar/). See `public/fonts/LICENSES.md`. Kolak shipped without a license file.
- To swap a font, change `--font-display` / `--font-accent` in `src/index.css`.

## Round 6: photography
- Photography frame now shows your temple photo (`public/assets/photography/`, webp + jpg fallback). The made-up "ƒ/1.8 · 1/250 · ISO 100" text is gone (the file has no EXIF, so no real values to show).
- Portfolio button (Google Photos album, https://photos.app.goo.gl/UPjCkmE5aNkyGZZz9) now comes before Instagram.

## Round 7: photo pile
- The Photography frame is now a pile of prints. With 2+ photos: move the cursor across it, scroll with the cursor over it, click/tap, swipe, press arrow keys, or use the segments underneath. With 1 photo it stays a still frame (current state).
- Add photos: drop files into `photos-src/`, run `pnpm photos`, then edit the `alt` text in `src/content/photos.json`. The script makes the web sizes and rewrites that list. Order = file name order (prefix 01-, 02-...).

## Round 8: the 12-photo pile
- The single temple photo is replaced by a 12-photo set (`01-temple` … `12-moon`), already cropped to the frame's 16:11 shape with EXIF/GPS stripped.
- `photos-src/frame-temple.jpg` and `public/assets/photography/frame-temple-*` are gone. `src/content/photos.json` now carries all 12 entries with real alt text (no TODOs).
- `pnpm photos` regenerated the web sizes: 12 × (800 / 1280 / 1920 webp + 1280 jpg) = 48 files, 6.38 MB total.
- The pile was already generic (it renders whatever `photos.json` holds), so no component changes were needed. Verified in a real browser at 1440px and 390px: cursor scrub, click, arrow keys and the 12 segment buttons all step the pile; scrolling with the cursor over the frame changes the photo while the page still scrolls; no horizontal overflow on mobile; no console errors and no failed requests.
- Source of truth for the alt text is `photos-for-pile/photos.json`. `photos-for-pile/optional/` and `optional-has-people/` were deliberately **not** copied into the repo.
- Two of the sources are smaller than 1920px wide (`07-fisherman` 1737px, `12-moon` 1776px), so their `-1920.webp` files are not upscaled — `pnpm photos` resizes with `withoutEnlargement`.

