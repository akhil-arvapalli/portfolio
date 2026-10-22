import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/motion";
import { LINKS } from "@/content/content";
import PhotoDeck from "./PhotoDeck";
import { isLive } from "@/lib/links";

/** A camera focus reticle that trails the pointer across the section, with a live coordinate readout. */
function useReticle({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();

  const handlers = {
    onPointerMove: (e: React.PointerEvent) => {
      const r = target.current?.getBoundingClientRect();
      if (!r || e.pointerType === "touch") return;
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      x.set(px);
      y.set(py);
      setPos({ x: Math.round(px), y: Math.round(py) });
      // over the photo pile the cursor ring already says "browse", so the reticle steps aside
      setOn(!(e.target as HTMLElement).closest("[aria-roledescription=carousel]"));
    },
    onPointerLeave: () => setOn(false),
  };
  return {
    handlers,
    node:
      reduced ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", opacity: on ? 1 : 0 }}
        >
          <span className="relative block size-20 border border-ink/80">
            <span className="absolute left-1/2 top-[-10px] h-[10px] w-px bg-ink" />
            <span className="absolute bottom-[-10px] left-1/2 h-[10px] w-px bg-ink" />
            <span className="absolute left-[-10px] top-1/2 h-px w-[10px] bg-ink" />
            <span className="absolute right-[-10px] top-1/2 h-px w-[10px] bg-ink" />
            <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </span>
          <span className="eyebrow absolute left-[calc(100%+14px)] top-0 whitespace-nowrap !text-ink">
            AF
            <br />
            X {String(pos.x).padStart(4, "0")} Y {String(pos.y).padStart(4, "0")}
          </span>
        </motion.div>
      ),
  };
}

export default function Photography() {
  const ref = useRef<HTMLElement>(null);
  const { handlers, node } = useReticle({ target: ref });
  return (
    <section id="photography" ref={ref} {...handlers} className="band theme-bordo section relative overflow-hidden">
      {node}
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              num="06"
              label="Photography"
              title={["Beyond", <><em>code.</em></>]}
              titleStyle={{ lineHeight: 0.87 }}
              lineStyles={[{ marginTop: 0 }, { marginTop: "-0.1em" }]}
            />

            <Reveal delay={0.06}>
              <p className="mt-8 font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.12] text-ink">{LINKS.photoBlurb}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {isLive(LINKS.photoPortfolio) && (
                  <a href={LINKS.photoPortfolio} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                    Portfolio <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                  </a>
                )}
                {isLive(LINKS.instagram) && (
                  <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="btn">
                    Instagram {LINKS.instagramHandle} <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:col-span-5">
            <PhotoDeck />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
