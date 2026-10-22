import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HERO_TEXTURES } from "@/lib/tokens";
import { markIntroDone } from "@/lib/intro";
import { DUR, EASE } from "@/lib/motion";

function loadImage(src: string, onDone: () => void) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => { onDone(); resolve(); }, { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
    img.src = src;
  });
}

export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let loaded = 0;
    let closed = false;
    const timers: number[] = [];

    const bump = () => {
      loaded = Math.min(3, loaded + 1);
      setPct(Math.round((loaded / 3) * 100));
    };
    const finish = () => {
      if (closed) return;
      closed = true;
      setPct(100);
      timers.push(
        window.setTimeout(() => {
          document.body.style.overflow = "";
          setOpen(false);
          markIntroDone();
        }, 400)
      );
    };

    const all = Promise.all([
      loadImage(HERO_TEXTURES.base, bump),
      loadImage(HERO_TEXTURES.reveal, bump),
      document.fonts.ready.then(bump),
    ]);
    timers.push(window.setTimeout(finish, 1400));
    void all.then(() => timers.push(window.setTimeout(finish, 250)));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-base p-[var(--gutter)]"
          exit={{ y: "-100%" }}
          transition={{ duration: DUR.slow, ease: EASE }}
        >
          <p className="eyebrow">Arvapalli Venkata Sai Akhil — portfolio</p>
          <div className="flex items-end justify-between gap-6">
            <p className="display text-[clamp(4rem,14vw,10rem)] leading-none tabular-nums">
              {String(pct).padStart(2, "0")}
              <span className="text-accent">%</span>
            </p>
            <p className="eyebrow pb-3">Hyderabad · IST</p>
          </div>
          <div className="absolute inset-x-[var(--gutter)] bottom-[var(--gutter)] h-px bg-ink/10">
            <motion.div
              className="h-full origin-left bg-accent"
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
