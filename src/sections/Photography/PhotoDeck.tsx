import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import photoData from "@/content/photos.json";

type PhotoSettings = { focal: string; aperture: string; shutter: string; iso: string };
type Photo = { name: string; alt: string; settings?: PhotoSettings; width: number; height: number };
const PHOTOS = photoData as Photo[];

/** "35MM · F/2.8 · 1/250S · ISO 100" for the frame counter line. */
const settingsLine = (s?: PhotoSettings) =>
  s ? [s.focal, s.aperture, s.shutter, s.iso].filter(Boolean).join(" · ") : "";

/** Where each print sits in the pile: 0 = on top, 1 and 2 = peeking out behind it. */
const POS = [
  { x: 0, y: 0, rotate: 0, scale: 1, filter: "brightness(1)" },
  { x: 14, y: 10, rotate: 2.4, scale: 0.97, filter: "brightness(0.72)" },
  { x: -12, y: 18, rotate: -2.8, scale: 0.94, filter: "brightness(0.55)" },
] as const;

const mod = (n: number, m: number) => ((n % m) + m) % m;

function Print({ photo, pos, instant }: { photo: Photo; pos: number; instant: boolean }) {
  const target = POS[pos];
  const spring = instant ? { duration: 0 } : { type: "spring" as const, stiffness: 190, damping: 25, mass: 0.8 };
  return (
    <motion.div
      aria-hidden={pos !== 0}
      className="absolute inset-0 origin-center overflow-hidden border border-ink/60 bg-raised shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]"
      style={{ zIndex: 3 - pos }}
      initial={
        pos === 0
          ? { x: "-55%", y: 0, rotate: -9, scale: 1, opacity: 0, filter: "brightness(1)" }
          : { ...target, scale: target.scale - 0.05, opacity: 0 }
      }
      animate={{ ...target, opacity: 1 }}
      variants={{
        exit: (d: number) =>
          pos === 0 && d > 0
            ? { x: "-62%", rotate: -11, opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
            : { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
      }}
      exit="exit"
      transition={spring}
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`/assets/photography/${photo.name}-800.webp 800w, /assets/photography/${photo.name}-1280.webp 1280w, /assets/photography/${photo.name}-1920.webp 1920w`}
          sizes="(max-width: 1024px) 92vw, 40vw"
        />
        <img
          src={`/assets/photography/${photo.name}-1280.jpg`}
          alt={pos === 0 ? photo.alt : ""}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
      </picture>
    </motion.div>
  );
}

/**
 * A pile of prints inside the frame. Move the pointer across it, scroll with the pointer over it,
 * tap/click, swipe, or use the arrow keys to move through the photos. One photo = a still frame.
 */
export default function PhotoDeck() {
  const reduced = useReducedMotion() ?? false;
  const n = PHOTOS.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const indexRef = useRef(0);
  const lastChange = useRef(0);
  const wheelAcc = useRef(0);
  const swiped = useRef(false);
  const touchX = useRef<number | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const anchor = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const step = useCallback(
    (delta: number, { force = false, lock = false }: { force?: boolean; lock?: boolean } = {}) => {
      if (n < 2) return;
      const now = performance.now();
      if (!force && now - lastChange.current < 320) return;
      lastChange.current = now;
      // a manual action (scroll, click, key) wins until the pointer really moves again
      if (lock) anchor.current = lastPos.current ? { ...lastPos.current } : null;
      setDir(delta > 0 ? 1 : -1);
      setIndex((i) => mod(i + delta, n));
    },
    [n]
  );

  // scroll with the pointer over the frame (native passive listener: the page keeps scrolling)
  useEffect(() => {
    const el = frameRef.current;
    if (!el || n < 2) return;
    let timer = 0;
    const onWheel = (e: WheelEvent) => {
      wheelAcc.current += e.deltaY;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (wheelAcc.current = 0), 260);
      if (Math.abs(wheelAcc.current) > 90) {
        step(wheelAcc.current > 0 ? 1 : -1, { lock: true });
        wheelAcc.current = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, [n, step]);

  // warm the cache so a new print never pops in late
  useEffect(() => {
    if (n < 2) return;
    const warm = () => PHOTOS.forEach((p) => Object.assign(new Image(), { src: `/assets/photography/${p.name}-1280.webp` }));
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(warm) : window.setTimeout(warm, 1500);
    return () => {
      if (w.requestIdleCallback && w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [n]);

  const visibleCount = Math.min(3, n);
  const visible = Array.from({ length: visibleCount }, (_, pos) => ({ pos, idx: mod(index + pos, n) }));

  const onPointerMove = (e: React.PointerEvent) => {
    if (n < 2 || e.pointerType !== "mouse") return;
    const pos = { x: e.clientX, y: e.clientY };
    lastPos.current = pos;
    if (anchor.current) {
      // ignore the fake "mouse moved" events browsers fire after a scroll, and tiny jitters
      if (Math.hypot(pos.x - anchor.current.x, pos.y - anchor.current.y) < 28) return;
      anchor.current = null;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const target = Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * n)));
    if (target !== indexRef.current) step(target > indexRef.current ? 1 : -1);
  };

  return (
    <div className="pb-6 pt-2">
      <div
        ref={frameRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Photographs"
        tabIndex={n > 1 ? 0 : -1}
        data-cursor={n > 1 ? "browse" : "view"}
        className="relative aspect-[16/11] cursor-pointer outline-offset-8"
        style={{ touchAction: "pan-y" }}
        onPointerMove={onPointerMove}
        onPointerDown={(e) => {
          swiped.current = false;
          touchX.current = e.pointerType === "touch" ? e.clientX : null;
        }}
        onPointerUp={(e) => {
          if (touchX.current !== null) {
            const dx = e.clientX - touchX.current;
            if (Math.abs(dx) > 45) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1, { force: true, lock: true });
            }
          }
          touchX.current = null;
        }}
        onClick={() => {
          if (!swiped.current) step(1, { force: true, lock: true });
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            step(1, { force: true, lock: true });
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1, { force: true, lock: true });
          }
        }}
      >
        <AnimatePresence initial={false} custom={dir}>
          {/* render back-to-front so the top print is last in the DOM */}
          {[...visible].reverse().map(({ pos, idx }) => (
            <Print key={PHOTOS[idx].name} photo={PHOTOS[idx]} pos={pos} instant={reduced} />
          ))}
        </AnimatePresence>

        {/* viewfinder marks + caption sit above the whole pile */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
            <span key={c} className={`absolute size-6 border-white/80 ${c}`} />
          ))}
          <span className="absolute bottom-4 left-12 flex items-baseline gap-4 whitespace-nowrap">
            <span className="bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              Frame {String(index + 1).padStart(2, "0")}
              {n > 1 ? ` / ${String(n).padStart(2, "0")}` : ""}
            </span>
            {settingsLine(PHOTOS[index].settings) ? (
              <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] [@media(min-width:768px)]:inline-block">
                {settingsLine(PHOTOS[index].settings)}
              </span>
            ) : null}
          </span>
        </div>
        <p className="sr-only" aria-live="polite">{`Photo ${index + 1} of ${n}: ${PHOTOS[index].alt}`}</p>
      </div>

      {n > 1 && (
        <div className="mt-7 flex items-center gap-4">
          <div className="flex flex-1 gap-1.5">
            {PHOTOS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-label={`Show photo ${i + 1} of ${n}`}
                aria-current={i === index}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  lastChange.current = performance.now();
                  anchor.current = lastPos.current ? { ...lastPos.current } : null;
                  setIndex(i);
                }}
                className="group h-5 flex-1"
              >
                <span className={`block h-[3px] w-full transition-colors ${i === index ? "bg-ink" : "bg-ink/30 group-hover:bg-ink/60"}`} />
              </button>
            ))}
          </div>
          <p className="eyebrow !text-ink-soft [@media(pointer:coarse)]:hidden">Move across · scroll · click</p>
          <p className="eyebrow hidden !text-ink-soft [@media(pointer:coarse)]:block">Swipe or tap</p>
        </div>
      )}
    </div>
  );
}
