import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Mode = "idle" | "link" | "label";

const LIGHT_INK = "#1b2740";
const DARK_INK = "#eadbc3";

/**
 * Replaces the old glass lens. A dot that tracks 1:1 plus a spring-lagged ring.
 * Over links/buttons the ring grows; over [data-cursor="text"] it becomes a labelled disc.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    let armed = false;

    let lastX = 0;
    let lastY = 0;
    let scrollRaf = 0;

    const classify = (t: Element | null) => {
      setOnDark(!!t?.closest(".theme-dark, .theme-bordo"));
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      if (tagged?.dataset.cursor) {
        setMode("label");
        setLabel(tagged.dataset.cursor);
      } else if (t?.closest("a, button, [role='button'], .cursor-target, summary")) {
        setMode("link");
      } else {
        setMode("idle");
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!armed) {
        armed = true;
        root.classList.add("has-cursor");
        x.jump(e.clientX);
        y.jump(e.clientY);
        rx.jump(e.clientX);
        ry.jump(e.clientY);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      classify(e.target as Element | null);
    };
    // content moves under a still pointer when scrolling: re-check what's under it
    const onScroll = () => {
      if (!armed || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        classify(document.elementFromPoint(lastX, lastY));
      });
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y, rx, ry]);

  if (!enabled) return null;

  const ink = onDark ? DARK_INK : LIGHT_INK;
  const ring = mode === "label" ? 76 : mode === "link" ? 46 : 30;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ring,
          height: ring,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.86 : 1,
          borderColor: ink,
          backgroundColor: mode === "link" ? `${ink}26` : `${ink}00`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: ink }}
          animate={{ opacity: mode === "label" ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.span>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full"
        style={{ x, y, translateX: "-50%", translateY: "-50%", backgroundColor: ink }}
        animate={{ opacity: visible && mode === "idle" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
