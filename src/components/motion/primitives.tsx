import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";

/** Fade + rise on enter. The one entrance used for every block on the site. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "article";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/**
 * Masked line-by-line headline reveal. Pass one ReactNode per visual line.
 * The in-view check runs on the *wrapper*: lines start translated out of their mask,
 * so observing them directly would never fire and the headline would stay invisible.
 */
export function LineReveal({
  lines,
  className,
  delay = 0,
  trigger = "view",
  active = true,
  pad = 0.07,
  lineClassName,
  lineStyle,
  lineStyles,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  trigger?: "view" | "mount";
  active?: boolean;
  pad?: number;
  /** Applied to every line wrapper — use for per-line leading/tightening. */
  lineClassName?: string;
  /** Applied to every line wrapper, e.g. a negative margin to pull lines together. */
  lineStyle?: CSSProperties;
  /** Per-line styles, indexed to match `lines`. Overrides `lineStyle` for that line. */
  lineStyles?: (CSSProperties | undefined)[];
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = trigger === "view" ? inView : active;
  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn("block overflow-hidden", lineClassName)}
          style={{ paddingBlock: `${pad}em`, marginBlock: `-${pad}em`, ...lineStyle, ...lineStyles?.[i] }}
        >
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "108%" }}
            animate={{ y: show ? 0 : "108%" }}
            transition={{ duration: DUR.slow, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * The FIG. number / rule / label eyebrow plus the big condensed title.
 * Split out of SectionHeader so a section can place its headline inside a
 * column (next to a visual) instead of in the full-width header row.
 */
export function SectionHeading({
  num,
  label,
  title,
  className,
  titleClassName,
  titleStyle,
  lineClassName,
  lineStyle,
  lineStyles,
  animate = true,
}: {
  num: string;
  label: string;
  title: ReactNode[];
  className?: string;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  lineClassName?: string;
  lineStyle?: CSSProperties;
  lineStyles?: (CSSProperties | undefined)[];
  /** Set false when an ancestor already animates the block in. */
  animate?: boolean;
}) {
  const eyebrow = (
    <p className="eyebrow flex items-center gap-3 !text-ink">
      <span aria-hidden className="text-accent">+</span>
      FIG. {num}
      <span aria-hidden className="h-px w-10 bg-ink/40" />
      <span className="!text-ink-mute">{label}</span>
    </p>
  );
  return (
    <div className={className}>
      {animate ? <Reveal y={10}>{eyebrow}</Reveal> : eyebrow}
      <h2 className={cn("display mt-4 text-[clamp(3.2rem,8vw,7.25rem)]", titleClassName)} style={titleStyle}>
        <LineReveal lines={title} lineClassName={lineClassName} lineStyle={lineStyle} lineStyles={lineStyles} />
      </h2>
    </div>
  );
}

/** Drafting-sheet section header: FIG. number, rule, label, then a big condensed title. */
export function SectionHeader({
  num,
  label,
  title,
  aside,
  className,
  titleClassName,
  titleStyle,
  lineClassName,
  lineStyle,
  lineStyles,
}: {
  num: string;
  label: string;
  title: ReactNode[];
  aside?: ReactNode;
  className?: string;
  /** Applied to the <h2> — e.g. a tighter leading for a two-word headline. */
  titleClassName?: string;
  titleStyle?: CSSProperties;
  /** Applied to every headline line wrapper. */
  lineClassName?: string;
  lineStyle?: CSSProperties;
  /** Per-line styles, indexed to match `title`. */
  lineStyles?: (CSSProperties | undefined)[];
}) {
  return (
    <header className={cn("mb-[var(--head-gap)] grid items-end gap-6 lg:grid-cols-12", className)}>
      <SectionHeading
        num={num}
        label={label}
        title={title}
        className="lg:col-span-8"
        titleClassName={titleClassName}
        titleStyle={titleStyle}
        lineClassName={lineClassName}
        lineStyle={lineStyle}
        lineStyles={lineStyles}
      />
      {aside ? (
        <Reveal delay={0.12} className="border-l border-ink/30 pl-5 text-ink-soft lg:col-span-4 lg:mb-1">
          {aside}
        </Reveal>
      ) : null}
    </header>
  );
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

/** Words light up as you scroll through the paragraph (React Bits "ScrollReveal" behaviour). */
export function ScrollReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  if (reduced) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.6 / words.length);
        return (
          <span key={`${w}-${i}`} aria-hidden>
            <Word word={w} range={[start, end]} progress={scrollYProgress} />
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

/** Infinite icon + label loop. Pure CSS transform, so it stays smooth off the main thread. */
export function Ticker({
  items,
  duration = 46,
  className,
}: {
  items: { label: string; icon: ReactNode }[];
  duration?: number;
  className?: string;
}) {
  const row = (suffix: string) =>
    items.map((it) => (
      <li key={`${it.label}-${suffix}`} className="flex items-center gap-3 text-ink-soft">
        <span className="text-xl text-ink md:text-2xl" aria-hidden>
          {it.icon}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em]">{it.label}</span>
      </li>
    ));
  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}
    >
      <ul
        className="flex w-max items-center gap-12 pr-12 motion-reduce:!animate-none group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration}s linear infinite` }}
      >
        {row("a")}
        <span aria-hidden className="contents">{row("b")}</span>
      </ul>
    </div>
  );
}
