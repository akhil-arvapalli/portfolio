# Portfolio — Arvapalli Venkata Sai Akhil

Personal site for **Akhil**, a Full-Stack AI Developer in Hyderabad, Telangana. Built around a
dark editorial "printed spec-sheet" identity: paper-and-ink palette, square edges, visible column
guides, and a scroll ruler down the right edge.

Live site: **https://akhil-arvapalli.vercel.app**

Deployed on Vercel from this repo. The domain is set in `index.html` (`og:url`, `canonical`),
`public/sitemap.xml` and `public/robots.txt` — change all four together if it moves.


---

## Stack

| | |
|---|---|
| Build | [Vite 6](https://vite.dev) + [React 18.3](https://react.dev) + TypeScript 5.6 (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` tokens) + plain CSS |
| Motion | [Motion](https://motion.dev) (Framer Motion successor) · [GSAP](https://gsap.com) · [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| Icons | [Lucide](https://lucide.dev) + [React Icons](https://react-icons.github.io/react-icons/) |
| Routing | [React Router 6](https://reactrouter.com) |
| Analytics | [Vercel Analytics](https://vercel.com/docs/analytics) (production only) |
| Images | [sharp](https://sharp.pixelplumbing.com) (build-time processing) |
| Testing | [Playwright](https://playwright.dev) (DOM assertions) + [ESLint 9](https://eslint.org) |

No CSS framework beyond Tailwind, no component library, no three.js — every visual is either CSS,
inline SVG, or a canvas effect.

## Getting started

```bash
pnpm install     # Node 20+ recommended
pnpm dev         # http://localhost:5173
```

| Script | What it does |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Type-check (`tsc -b`) then production build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | ESLint across the repo |
| `pnpm photos` | Rebuild `public/assets/photography/` from `photos-src/` and rewrite `src/content/photos.json` |
| `pnpm qa:dom` | Playwright DOM suite (needs a server on `:4173` — it starts one) |
| `pnpm assets:report` | Report alpha-channel metadata for the portrait PNGs |
| `pnpm lighthouse` | Run Lighthouse against the local build |
| `pnpm deploy` | Deploy to Vercel production, then re-point the canonical domain |
| `pnpm pin:domain` | Point `akhil-arvapalli.vercel.app` at the newest deployment |

## Layout

```
src/
  content/       content.ts — identity, links, work, experience, recognition
                 photos.json — the photography pile (alt text lives here)
  sections/      one folder per section: hero, about, stack, work, experience,
                 recognition, photography, contact + project detail route
  components/    navigation, preloader, cursor, background, motion primitives,
                 media (typed <picture>), rb/ (third-party component ports)
  lib/           asset manifest, motion tokens, scroll store, links helper
api/contact.ts   Vercel serverless handler (Resend) — optional, see below
scripts/         asset + audit tooling
public/assets/   pre-optimised images (avif/webp/jpg variants)
```

### Sections

`hero` · `about` · `stack` · `work` · `experience` · `recognition` · `photography` · `contact`

Plus `/projects/:slug` for individual project pages and a 404 route.

## Design system

Tokens live in `src/index.css` under `@theme` — change them there, not in components.

| Token | Value | Used for |
|---|---|---|
| `base` | `#e8dac2` | Paper background |
| `surface` | `#f1e7d4` | Raised panels |
| `raised` | `#dcccb0` | Cards, borders |
| `ink` | `#1b2740` | Navy body text |
| `ink-soft` / `ink-mute` | `#33445f` / `#4d5d75` | Secondary text |
| `accent` / `bordo` | `#632024` | Caput-mortium accents, dark bands |

Type: **Highstar** for display headings, **Kolak** for accent words, **Instrument Serif** for
long-form statements, **Inter** for body, **JetBrains Mono** for labels and HUD text.

> **Font licensing.** Highstar is licensed for personal use only and needs a paid license for
> promotional or commercial use. Kolak shipped without a license file. Inter, JetBrains Mono and
> Instrument Serif are SIL Open Font License. See [`public/fonts/LICENSES.md`](public/fonts/LICENSES.md)
> before using this site commercially — swap `--font-display` in `src/index.css` if you need to.

## The photography pile

The Photography section renders a pile of prints inside a viewfinder frame. It is driven entirely
by `src/content/photos.json` — the component needs no changes to add photos.

To add or swap photos:

1. Drop the source image into `photos-src/` (prefix with `01-`, `02-` to control order).
2. Run `pnpm photos`. This generates webp at 800/1280/1920 plus a 1280 jpg fallback in
   `public/assets/photography/`, and rewrites `src/content/photos.json`.
3. Edit the `alt` text in `src/content/photos.json` for any new entry (the script writes a `TODO:`
   placeholder for names it has not seen before).

Each entry also carries a `settings` object — the lens and exposure shown next to the frame
counter in the pile. The shipped values are placeholders; edit them to match the real shot:

```json
"settings": { "focal": "35MM", "aperture": "F/2.8", "shutter": "1/250S", "iso": "ISO 100" }
```

`pnpm photos` preserves these across regenerations and fills in defaults for new photos.

The sources should already be cropped to the frame's 16:11 shape and have EXIF/GPS stripped.

## Configuration

Copy `.env.example` to `.env` and fill in what you need:

| Variable | Needed for |
|---|---|
| `FORMSPREE_ID` | Contact form delivery via Formspree. Without it the form falls back to the visitor's mail app. |
| `RESEND_API_KEY` | The optional `api/contact.ts` Vercel handler. |
| `VITE_SITE_URL` | Canonical URL for OG tags and the sitemap. |

`index.html` (`og:url`, `canonical`), `public/sitemap.xml` and `public/robots.txt` all point at
`https://akhil-arvapalli.vercel.app`. If the domain changes, update all four together.

## Deployment

The repo is configured for Vercel: `vercel.json` sets the framework to `vite` and rewrites all
routes to `index.html` for client-side routing. The Vercel project is connected to this GitHub
repo, so **every push to `main` deploys automatically**.

- Build command: `pnpm build`
- Output directory: `dist`
- The `api/` folder is deployed as a serverless function automatically.

### The canonical domain needs a nudge

Vercel auto-assigns `<project>-<team>.vercel.app` to every new deployment, but the canonical
`akhil-arvapalli.vercel.app` is a manually created alias — it stays pinned to whichever
deployment it was set on and goes stale on the next push.

`scripts/pin-domain.mjs` re-points it. Run it after any deploy:

```bash
pnpm deploy          # deploy + re-point the domain
pnpm pin:domain      # re-point only
pnpm pin:domain --check   # report drift, change nothing
```

If the domain is serving an older build, run `pnpm pin:domain`.

Any other static host works too — `dist/` is plain static output.

## Testing

```bash
pnpm build
pnpm preview        # or let qa:dom start it
pnpm qa:dom
```

The Playwright suite asserts section rendering, headline reveals, vertical rhythm, the hero
portrait reveal, no horizontal overflow at 360px, dock navigation, project routes, the 404 page and
a clean console. It defaults to the `msedge` browser channel; override with `PLAYWRIGHT_CHANNEL`.

## Accessibility

Semantic landmarks, a labelled section-navigation dock, `aria-live` announcements as the photo pile
advances, keyboard support (arrow keys / Enter / Space) on the carousel, visible focus rings, and
full `prefers-reduced-motion` fallbacks for every animation.

## License

Code is released under the [MIT License](LICENSE). The photography, fonts and portraits are
separate works with their own terms — see [`public/fonts/LICENSES.md`](public/fonts/LICENSES.md).
