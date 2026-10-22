import { useEffect, useRef } from "react";
import { useSpring } from "motion/react";
import { HERO_TEXTURES } from "@/lib/tokens";

const LIFE = 950; // ms a trail stamp takes to fully "un-reveal"
const STEP = 9; // px of head travel between stamps
const MAX_STAMPS = 180;

type Stamp = { x: number; y: number; r: number; t: number };

function makeSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 160;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(80, 80, 0, 80, 80, 80);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.8, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 160, 160);
  return c;
}

/**
 * Cursor-reveal portrait. Two cut-out photos share one frame; a soft blob follows the pointer
 * (spring-smoothed with `motion`), reveals the second photo and then heals behind itself.
 *
 * Fixes vs. the old version: every canvas context is scaled by devicePixelRatio, so the
 * photo, the mask and the pointer all share one coordinate space on any screen; the base
 * layer is *cut out* where the reveal shows, so the two photos never ghost through each other.
 */
export default function PortraitReveal({ flooded }: { flooded: boolean }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const floodRef = useRef(flooded);

  const px = useSpring(0, { stiffness: 340, damping: 34, mass: 0.5 });
  const py = useSpring(0, { stiffness: 340, damping: 34, mass: 0.5 });
  const rad = useSpring(0, { stiffness: 170, damping: 19, mass: 0.7 });

  useEffect(() => {
    floodRef.current = flooded;
  }, [flooded]);

  useEffect(() => {
    const holder = holderRef.current;
    const canvas = canvasRef.current;
    if (!holder || !canvas) return;
    const ctx = canvas.getContext("2d");
    const mk = () => document.createElement("canvas");
    const trail = mk();
    const baseLayer = mk();
    const revealLayer = mk();
    const tctx = trail.getContext("2d");
    const bctx = baseLayer.getContext("2d");
    const rctx = revealLayer.getContext("2d");
    if (!ctx || !tctx || !bctx || !rctx) return;

    const sprite = makeSprite();
    const base = new Image();
    const alt = new Image();
    let loaded = 0;
    base.onload = alt.onload = () => {
      loaded += 1;
    };
    base.decoding = alt.decoding = "async";
    base.src = HERO_TEXTURES.base;
    alt.src = HERO_TEXTURES.reveal;

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let raf = 0;
    let disposed = false;
    let inside = false;
    let wasInside = false;
    let interacted = false;
    let lastTarget = -1;
    let idleDrawn = false;
    let lastX = 0;
    let lastY = 0;
    const stamps: Stamp[] = [];

    const resize = () => {
      const r = holder.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = r.width;
      ch = r.height;
      for (const c of [canvas, trail, baseLayer, revealLayer]) {
        c.width = Math.round(cw * dpr);
        c.height = Math.round(ch * dpr);
        c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      idleDrawn = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(holder);

    const drawCover = (c: CanvasRenderingContext2D, img: HTMLImageElement) => {
      if (!img.complete || !img.naturalWidth) return;
      // match by width, anchor to the top so both heads line up
      const s = cw / img.naturalWidth;
      c.drawImage(img, 0, 0, cw, img.naturalHeight * s);
    };

    const onMove = (e: PointerEvent) => {
      const r = holder.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const pad = 64;
      const near = x > -pad && x < r.width + pad && y > -pad && y < r.height + pad;
      if (near) {
        interacted = true;
        if (!wasInside) {
          px.jump(x);
          py.jump(y);
          lastX = x;
          lastY = y;
        }
        px.set(x);
        py.set(y);
      }
      inside = near;
      wasInside = near;
    };
    const onLeave = () => {
      inside = false;
      wasInside = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") onLeave();
    };
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    // a short intro sweep so the effect teaches itself, then gets out of the way
    const introTimers: number[] = [];
    introTimers.push(
      window.setTimeout(() => {
        if (interacted || !cw) return;
        px.jump(cw * 0.5);
        py.jump(ch * 0.32);
        lastX = cw * 0.5;
        lastY = ch * 0.32;
        inside = true;
        introTimers.push(
          window.setTimeout(() => {
            if (!interacted) inside = false;
          }, 1100)
        );
      }, 1900)
    );

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!cw || loaded < 2) return;

      const R = Math.min(Math.max(cw * 0.36, 110), 210);
      const target = floodRef.current ? Math.hypot(cw, ch) * 1.1 : inside ? R : 0;
      if (target !== lastTarget) {
        rad.set(target);
        lastTarget = target;
      }

      const hx = px.get();
      const hy = py.get();
      const hr = Math.max(0, rad.get());

      if (hr > 10) {
        const dx = hx - lastX;
        const dy = hy - lastY;
        const dist = Math.hypot(dx, dy);
        if (dist >= STEP) {
          const n = Math.min(Math.floor(dist / STEP), 24);
          for (let i = 1; i <= n; i++) {
            stamps.push({ x: lastX + (dx * i) / n, y: lastY + (dy * i) / n, r: hr, t: now });
          }
          lastX = hx;
          lastY = hy;
          if (stamps.length > MAX_STAMPS) stamps.splice(0, stamps.length - MAX_STAMPS);
        }
      }

      // retire expired stamps
      while (stamps.length && now - stamps[0].t > LIFE) stamps.shift();

      const active = stamps.length > 0 || hr > 1;
      if (!active && idleDrawn) return;

      // 1. mask
      tctx.clearRect(0, 0, cw, ch);
      for (const s of stamps) {
        const k = 1 - (now - s.t) / LIFE;
        const r = s.r * (0.45 + 0.55 * k);
        tctx.globalAlpha = k * k;
        tctx.drawImage(sprite, s.x - r, s.y - r, r * 2, r * 2);
      }
      if (hr > 1) {
        const t = now / 1000;
        const rxr = hr * (1 + 0.06 * Math.sin(t * 2.3));
        const ryr = hr * (1 + 0.06 * Math.cos(t * 1.9));
        tctx.globalAlpha = 1;
        tctx.drawImage(sprite, hx - rxr, hy - ryr, rxr * 2, ryr * 2);
      }
      tctx.globalAlpha = 1;

      // 2. reveal layer = alt photo masked by trail
      rctx.globalCompositeOperation = "source-over";
      rctx.clearRect(0, 0, cw, ch);
      drawCover(rctx, alt);
      rctx.globalCompositeOperation = "destination-in";
      rctx.drawImage(trail, 0, 0, cw, ch);
      rctx.globalCompositeOperation = "source-over";

      // 3. base layer = base photo with the whole blob erased, so inside the reveal only
      //    the alt photo remains (no face/beard leaking around the helmet)
      bctx.globalCompositeOperation = "source-over";
      bctx.clearRect(0, 0, cw, ch);
      drawCover(bctx, base);
      bctx.globalCompositeOperation = "destination-out";
      bctx.drawImage(trail, 0, 0, cw, ch);
      bctx.globalCompositeOperation = "source-over";

      // 4. compose
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(baseLayer, 0, 0, cw, ch);
      ctx.drawImage(revealLayer, 0, 0, cw, ch);
      idleDrawn = !active;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      introTimers.forEach((t) => window.clearTimeout(t));
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, rad]);

  return (
    <div ref={holderRef} className="absolute inset-0" style={{ touchAction: "pan-y" }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Portrait of Akhil. Move the pointer over it to reveal the racing-gear version."
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
