import { Suspense, lazy, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";
import { IDENTITY } from "@/content/content";
import { Picture } from "@/components/media/Picture";
import { LineReveal } from "@/components/motion";
import Badge from "@/components/ui/Badge";
import { RotatingText, ShinyText, StarBorder, Magnet, DecryptedText, ClickSpark } from "@/components/rb";
import { useIntroDone } from "@/lib/intro";
import { scrollToSection } from "@/lib/scroll-store";
import { DUR, EASE } from "@/lib/motion";

const PortraitReveal = lazy(() => import("./PortraitReveal"));

function Fallback() {
  return (
    <Picture
      asset="portrait"
      sizes="(max-width: 768px) 90vw, 33vw"
      className="absolute inset-0 h-full w-full object-cover object-top"
      loading="eager"
      fetchPriority="high"
    />
  );
}

const CORNERS = [
  "left-3 top-3 border-l border-t",
  "right-3 top-3 border-r border-t",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
] as const;

export default function Hero() {
  const reduced = useReducedMotion();
  const ready = useIntroDone();
  const [flooded, setFlooded] = useState(false);

  const rise = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 24 } as const),
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: DUR.base, delay, ease: EASE },
  });

  return (
    <section id="hero" aria-label="Intro" className="band overflow-hidden pb-28 pt-24 md:pt-28">
      <ClickSpark sparkColor="#632024" sparkSize={9} sparkRadius={22} sparkCount={8} duration={420}>
        <div className="wrap">
          {/* meta strip */}
          <motion.div {...rise(0.1)} className="flex items-center justify-between gap-4 border-b border-ink/25 pb-4">
            <p className="eyebrow flex items-center gap-2 !text-ink">
              <MapPin size={14} strokeWidth={1.5} aria-hidden />
              <DecryptedText text={IDENTITY.location} animateOn="view" speed={45} maxIterations={10} />
            </p>
            <p className="eyebrow flex items-center gap-2.5 !text-ink">
              <span aria-hidden className="h-2 w-2 rounded-full bg-accent" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <ShinyText text="Open to opportunities" speed={3.2} color="#1b2740" shineColor="#632024" />
            </p>
          </motion.div>

          <div className="mt-8 grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            {/* name + intro */}
            <div className="lg:col-span-8">
              <h1 className="display">
                <span className="sr-only">Arvapalli Venkata Sai Akhil, Full-Stack AI Developer</span>
                <span aria-hidden className="block text-[min(16.5vw,5.2rem)] lg:text-[min(9.6vw,9.25rem)]">
                  <LineReveal trigger="mount" active={ready} delay={0.1} pad={0.2} lines={["Arvapalli Venkata Sai"]} />
                  <span className="mt-[0.02em] block text-[2.1em] leading-[0.82] text-accent">
                    <LineReveal trigger="mount" active={ready} delay={0.25} pad={0.2} lines={["Akhil"]} />
                  </span>
                </span>
              </h1>

              <motion.div {...rise(0.65)} className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <div className="max-w-xl">
                  <p className="eyebrow mb-3 !text-accent">
                    <RotatingText
                      texts={IDENTITY.roles as unknown as string[]}
                      rotationInterval={2600}
                      mainClassName="inline-flex overflow-hidden"
                      splitLevelClassName="overflow-hidden"
                    />
                  </p>
                  <p className="text-xl leading-snug text-ink">{IDENTITY.positioning}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Magnet padding={50} magnetStrength={3}>
                    <StarBorder
                      as="a"
                      href="#contact"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        scrollToSection("contact");
                      }}
                      radius="0px"
                      innerClassName="px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em]"
                      backgroundColor="#1b2740"
                      color="#632024"
                      borderColor="#1b2740"
                      textColor="#e8dac2"
                    >
                      Work with me
                    </StarBorder>
                  </Magnet>
                  <button type="button" onClick={() => scrollToSection("work")} className="btn">
                    See the work
                  </button>
                </div>
              </motion.div>
            </div>

            {/* portrait panel: its own column, so the name is never covered */}
            <motion.div
              className="relative mx-auto w-full max-w-[24rem] lg:col-span-4 lg:max-w-none"
              initial={reduced ? false : { opacity: 0, y: 36 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: DUR.slow, delay: 0.3, ease: EASE }}
            >
              <div className="theme-bordo relative overflow-hidden bg-base" style={{ aspectRatio: "640 / 770" }} data-cursor="reveal">
                <div className="absolute inset-x-0 bottom-0" style={{ aspectRatio: "640 / 716" }} onClick={() => setFlooded((v) => !v)}>
                  {reduced ? (
                    <Fallback />
                  ) : (
                    <Suspense fallback={<Fallback />}>
                      <PortraitReveal flooded={flooded} />
                    </Suspense>
                  )}
                </div>
                {CORNERS.map((c) => (
                  <span key={c} aria-hidden className={`pointer-events-none absolute size-5 border-ink/70 ${c}`} />
                ))}
                <p className="eyebrow pointer-events-none absolute left-6 top-6 !text-ink">SUBJECT 001</p>
              </div>
              <button
                type="button"
                aria-pressed={flooded}
                onClick={() => setFlooded((v) => !v)}
                className="btn mt-3 w-full justify-center"
              >
                <Sparkles size={13} strokeWidth={1.5} aria-hidden />
                {flooded ? "Back to me" : "Move over me · tap to flip"}
              </button>
              <Badge
                text="Full-Stack AI Developer · Hyderabad · 2027 · "
                className="pointer-events-none absolute -left-12 -top-10 hidden size-28 text-ink md:block"
              />
            </motion.div>
          </div>

          <motion.div {...rise(0.9)} className="mt-10 flex items-center justify-between border-t border-ink/25 pt-4">
            <p className="eyebrow">Final-year B.Tech · CSE (AI/ML) · CMR College of Engineering, class of 2027</p>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="eyebrow hidden items-center gap-2 !text-ink transition-colors hover:!text-accent sm:inline-flex"
            >
              Scroll
              <motion.span animate={reduced ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown size={14} strokeWidth={1.5} aria-hidden />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </ClickSpark>
    </section>
  );
}
