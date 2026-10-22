# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The site is deployed continuously from `main`; there are no published version tags yet.

---

## [Unreleased]

### Added
- **Deployed to Vercel** — https://akhil-arvapalli.vercel.app. The `example.com`
  placeholders in `index.html` (`og:url`, `canonical`), `public/sitemap.xml`, `public/robots.txt`
  and `.env.example` are now the real domain. The Vercel project is named `akhil-arvapalli` and is
  connected to the GitHub repo, so pushes build automatically.

- **README.md** — setup, scripts, stack, design tokens, the photography workflow, deployment and
  accessibility notes.
- **CHANGELOG.md** — this file.
- **LICENSE** — MIT.
- **.gitignore** — node_modules, build output, env files, logs, Lighthouse/Playwright artifacts,
  the downloaded font cache and AI-tooling scratch logs.
- **.gitattributes** — LF normalisation in the repo, CRLF for Windows scripts, binary rules for
  images, fonts and PDFs.
- **scripts/lighthouse.mjs** — `pnpm lighthouse` referenced a script that did not exist. The new
  one waits for the preview server, runs Lighthouse over mobile emulation with 4x CPU throttling
  and prints a score summary alongside the failing audits.
- **Camera settings in the photography pile.** Each photo now carries its own focal length,
  aperture, shutter speed and ISO, shown next to the frame counter as plain text
  (`35MM · F/2.8 · 1/250S · ISO 100`). The values are placeholders — edit them in
  `src/content/photos.json`. `pnpm photos` keeps them across regenerations and fills in defaults
  for photos that do not have any yet.
- **`SectionHeading`** — the FIG./label/title block split out of `SectionHeader`, so a section can
  put its headline inside a column next to a visual instead of in the full-width header row.

### Fixed
- **The Photography headline had a hole in it.** "BEYOND" and "code." were a headline apart, and
  another 125px of dead space sat between "code." and the paragraph. The heading now sits in the
  left column beside the photo stack with a 0.87 line-height and "code." pulled up by -0.1em, and
  the paragraph follows 2rem below it. The left group is centred against the photo stack.
- **The cursor vanished over project rows.** The index rows flip to an ink background on hover
  (`hover:bg-ink`), but the cursor kept its paper-band navy — navy on navy, effectively invisible.
  The cursor now reads the scoped `--color-base` of whatever is under the pointer and inverts with
  it: cream over a hovered row, navy back over the paper, and the cream/navy of whichever band it
  is in. Buttons that invert on hover follow the same rule.
- **`pnpm assets:report` crashed on a fresh clone.** `scripts/alpha-check.mjs` wrote to
  `brain/ALPHA.md` without creating the directory. It now creates `brain/` first.
- **`pnpm lint` failed on the audit scripts.** `scripts/gap-audit.mjs` and `scripts/reveal-check.mjs`
  hand browser callbacks to `page.evaluate()`, so they legitimately use DOM globals. The ESLint
  config now gives `scripts/**/*.mjs` the browser globals. Lint is back to 0 errors.

### Changed
- `.env.example` now documents `CONTACT_TO_EMAIL`, which `api/contact.ts` reads but was missing.
- **The album button no longer says "Portfolio".** This site *is* the portfolio, so a "Portfolio" button
  promising another portfolio was circular — and the link actually opens a Google Photos shared
  album. It now reads "Full Album" in the Photography section, and the footer link to the same
  destination was aligned with it (it read "Photography" before).
- **The dock is now proper iOS-style glass.** The panel was already blurring the page, but it was
  painted with a heavy white gradient that hid the effect. It now uses a much more transparent
  panel with a stronger blur (34px), higher saturation (2.2×) and a slight brightness lift, so the
  content behind it reads through the glass. The tiles got their own blur and a crisper edge so
  they stay distinct from the panel.

### Removed
- **12 unused React Bits components.** `BlurText`, `GlassIcons`, `GlassSurface`, `GradientText`,
  `MagicBento`, `Noise`, `ScrollVelocity`, `SplitText`, `SpotlightCard`, `Stepper`, `TargetCursor`
  and `TiltedCard` were ported in but never rendered anywhere. `src/components/rb/index.ts` now
  exports only the 8 that are used.
- **`gsap` and `@gsap/react`** — the site animates with `motion` and `lenis` only; GSAP was never
  imported. Removing it drops a ~70 KB chunk from the build.
- **`satori`** — never imported.
- Dead exports: `MARQUEE_PHRASES` and `CONTACT` (`src/content/content.ts`), `SPRING`
  (`src/lib/motion.ts`), the `ProjectSlug` / `GpuTier` / `ScrollProgress` types
  (`src/lib/tokens.ts`), and the unused `src/components/media/index.ts` barrel.

---

## Round 8 — the 12-photo pile

### Changed
- The single temple photo is replaced by a 12-photo set (`01-temple` … `12-moon`), already cropped
  to the frame's 16:11 shape with EXIF/GPS stripped.
- `src/content/photos.json` now carries all 12 entries with real alt text (no `TODO:` placeholders).
- `pnpm photos` regenerated the web sizes: 12 × (800 / 1280 / 1920 webp + 1280 jpg) = 48 files,
  6.38 MB total.

### Removed
- `photos-src/frame-temple.jpg` and the four `public/assets/photography/frame-temple-*` assets.

### Notes
- The pile component was already generic — it renders whatever `photos.json` holds — so no
  component changes were needed.
- `07-fisherman` (1737px) and `12-moon` (1776px) are narrower than 1920px, so their `-1920.webp`
  files are not upscaled; `pnpm photos` resizes with `withoutEnlargement`.
- Verified in Edge at 1440px and 390px: cursor scrub, click, arrow keys and all 12 segment buttons
  step the pile; scrolling with the cursor over the frame changes the photo while the page still
  scrolls; no horizontal overflow on mobile; no console errors and no failed requests.

---

## Round 7 — the photo pile

### Changed
- The Photography frame became a pile of prints. With 2+ photos you can move the cursor across it,
  scroll with the cursor over it, click/tap, swipe, press arrow keys, or use the segments
  underneath. With a single photo it stays a still frame.

---

## Round 6 — photography

### Changed
- The Photography frame shows a real photo from `public/assets/photography/` (webp + jpg fallback).
- The invented "ƒ/1.8 · 1/250 · ISO 100" readout was removed — the file has no EXIF, so there are
  no real values to show.
- The Portfolio button (Google Photos album) now comes before Instagram.

---

## Round 5 — custom fonts

### Changed
- Headings use **Highstar** (tall condensed caps); accent words use **Kolak** (display serif, no
  italic, so italics are switched off). Body and labels are unchanged (Inter, JetBrains Mono,
  Instrument Serif for long statements).
- Fonts are self-hosted in `public/fonts/` and preloaded in `index.html`. Archivo was removed.

### Notes
- **Licensing:** Highstar's author note says personal use only; promotional or commercial use needs
  a paid license. See `public/fonts/LICENSES.md`.

---

## Round 4 — refinement brief

### Removed
- CausalFunnel, JalPath v2 and the WhatsApp AI bot.

### Changed
- Internship end date is July 2026 everywhere (education "June 2027" is unchanged).
- CascadeGuard is labelled "In active development" — no paper link, no "published" wording; the
  pipeline graphic is labelled a sketch.
- Throttle Theory links to its Vercel deployment from the resume.
- PromptWars added under Hackathons as "Participant" — no result claimed, no credential link.
- The About section was rewritten; identity wording is "Full-Stack AI Developer" site-wide
  (page title, meta, JSON-LD).

---

## Round 3 — the redesign

### Changed
- New concept: a printed spec-sheet. Paper (`#e8dac2`) and navy ink, alternating navy and
  caput-mortium bands, square edges, visible column guides, a scroll ruler on the right.
- Hero: split layout. Full name stacked on the left, portrait in its own panel on the right, so
  the name is never covered.
- Work: an indexed list of builds — builds first, then academic projects (SENTINEL, DepViz). Each
  opens `/projects/<slug>` with bullets and repo/live links. CascadeGuard is the flagship.
- The Photography band gained a camera focus reticle that follows the cursor; cursor and ruler
  recolour by band.

---

## Rounds 1–2 — the original build

### Added
- The site itself: Vite + React 18 + TS strict + Tailwind v4 + GSAP + Lenis + Motion, deployed on
  Vercel with a Resend-backed contact handler in `api/contact.ts`.
- A preloader, custom cursor, section dock, and an eight-section structure: hero, about, stack,
  work, experience, recognition, photography, contact.

### Fixed
- **Reveal blank/misplaced:** the portrait canvas ignored `devicePixelRatio`, so the photo drew in
  the top-left of a bigger canvas with the mask offset from the cursor. Rewritten with DPR-scaled
  contexts.
- **"Motion as code" not working:** the app imported `framer-motion` everywhere while the `motion`
  package sat installed and unused. Everything now imports `motion/react`.
- **Phantom gaps:** headline reveals observed elements hidden inside their own clip mask, so they
  never became "in view" and stayed invisible. Fixed in `LineReveal`; section padding is one token
  (`--section-y`).
- **Off-theme leftovers:** `color-scheme: light`, `bg-white/40`, `mix-blend-multiply`, an undefined
  `--band` and an unused `marquee-x` keyframe were removed.
- **Inconsistent cards:** five card styles, pastel blobs and brutal shadows collapsed into one
  token set and one `Panel` wrapper for every React Bits card.

### Changed
- 14 thin sections became 8.
- Dead code removed: the three.js/R3F scene, the orbit component, the showstopper, GSAP
  ScrollTrigger usage and the old cursor.

---

## Known gaps

- `FORMSPREE_ID` is unset, so the contact form falls back to the visitor's mail app. The optional
  `api/contact.ts` handler needs `RESEND_API_KEY` and `CONTACT_TO_EMAIL`.
- `pnpm lint` is clean — 0 errors, 0 warnings.
- The Highstar display font needs a paid license for promotional or commercial use.
- The camera settings in `src/content/photos.json` are placeholders — edit them to match the real
  shots.
- Vercel assigns `akhil-arvapalli-akhil-arvapallis-projects.vercel.app` and
  `akhil-arvapalli-git-main-akhil-arvapallis-projects.vercel.app` automatically, from the project
  name and team slug. They point at the same deployment as `akhil-arvapalli.vercel.app` and cannot
  be removed. Use `akhil-arvapalli.vercel.app` in your resume.
