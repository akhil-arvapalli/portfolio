import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Database, ScanSearch, Brain, ShieldCheck, CircleCheck, Search } from "lucide-react";
import { SectionHeader, Reveal } from "@/components/motion";
import { FLAGSHIP, PROJECTS } from "@/content/content";

const STEP_ICONS = [Search, Database, Brain, ScanSearch, CircleCheck] as const;
const STEP_COPY = [
  "user question enters the pipeline",
  "documents pulled from the vector store",
  "the model drafts from retrieved context",
  "CascadeGuard is being built to score every claim against its sources",
  "only grounded claims survive to the answer",
] as const;

/** Scroll-driven: a hallucinated claim travels the pipeline, the verifier catches it, a grounded one passes. */
function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const badLeft = useTransform(scrollYProgress, [0.05, 0.62], ["10%", "70%"]);
  const badOpacity = useTransform(scrollYProgress, [0.03, 0.08, 0.6, 0.66], [0, 1, 1, 0]);
  const goodLeft = useTransform(scrollYProgress, [0.7, 0.98], ["70%", "90%"]);
  const goodOpacity = useTransform(scrollYProgress, [0.68, 0.74], [0, 1]);
  const verifierBorder = useTransform(scrollYProgress, [0.55, 0.64], ["rgba(243, 230, 210,0.12)", "rgba(226, 190, 138,0.9)"]);
  const caughtOpacity = useTransform(scrollYProgress, [0.62, 0.7], [0, 1]);
  const caughtY = useTransform(scrollYProgress, [0.62, 0.7], [8, 0]);

  return (
    <div ref={ref} className="relative mt-10 md:mt-14">
      {/* track (desktop) */}
      <div aria-hidden className="absolute left-[10%] right-[10%] top-[1.375rem] hidden h-px bg-line md:block" />
      {!reduced && (
        <>
          <motion.span
            aria-hidden
            className="absolute top-[1.375rem] z-10 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_24px_4px_rgba(226, 190, 138,0.6)] md:block"
            style={{ left: badLeft, opacity: badOpacity }}
          />
          <motion.span
            aria-hidden
            className="absolute top-[1.375rem] z-10 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_20px_3px_rgba(243, 230, 210,0.45)] md:block"
            style={{ left: goodLeft, opacity: goodOpacity }}
          />
        </>
      )}

      <ol className="grid gap-4 md:grid-cols-5 md:gap-3">
        {FLAGSHIP.pipeline.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const isVerifier = i === 3;
          return (
            <li key={step} className="flex gap-4 md:flex-col md:items-center md:text-center">
              <motion.span
                className="relative z-20 grid size-11 shrink-0 place-items-center rounded-full border bg-base text-ink"
                style={{
                  borderColor: isVerifier && !reduced ? verifierBorder : "rgba(243, 230, 210,0.12)",
                  ...(isVerifier && reduced ? { borderColor: "rgba(226, 190, 138,0.9)" } : null),
                }}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden />
              </motion.span>
              <div className="md:mt-4">
                <p className="eyebrow !text-ink-mute">{String(i + 1).padStart(2, "0")}</p>
                <p className="display mt-1 text-[2rem]">{step}</p>
                <p className="mt-1.5 text-sm leading-snug text-ink-mute md:px-2">{STEP_COPY[i]}</p>
                {isVerifier && (
                  <motion.span
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-bordo hover:bg-bordo-hi px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
                    style={reduced ? undefined : { opacity: caughtOpacity, y: caughtY }}
                  >
                    <ShieldCheck size={13} strokeWidth={2} aria-hidden />
                    caught
                  </motion.span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}


type Project = (typeof PROJECTS)[number];

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <li className="border-b border-ink/35">
      <Link
        to={`/projects/${p.slug}`}
        data-cursor="open"
        className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-4 px-1 py-5 transition-all duration-300 hover:bg-ink hover:px-4 hover:text-base md:grid-cols-[3.5rem_minmax(0,1.25fr)_minmax(0,1fr)_auto] md:py-6"
      >
        <span className="font-mono text-xs text-ink-mute transition-colors group-hover:text-base/70">{String(i + 1).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="display block text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[0.95] group-hover:!text-base">{p.name}</span>
          <span className="mt-2 block max-w-xl text-sm text-ink-soft transition-colors group-hover:text-base/80 md:line-clamp-1">{p.blurb}</span>
        </span>
        <span className="hidden flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute transition-colors group-hover:text-base/80 md:flex">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute transition-colors group-hover:text-base/80 lg:block">{p.kind}</span>
          <ArrowUpRight size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:rotate-45" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export default function Work() {
  const builds = PROJECTS.filter((p) => p.kind !== "Academic");
  const academic = PROJECTS.filter((p) => p.kind === "Academic");
  return (
    <section id="work" className="band section">
      <div className="wrap">
        <SectionHeader
          num="03"
          label="Work"
          title={["Things I've", <><em>shipped.</em></>]}
          aside="One flagship build in progress, then everything else from my GitHub, builds first and academic work after."
        />

        {/* flagship */}
        <Reveal>
          <div className="theme-dark relative border border-ink/40 bg-base p-6 text-ink md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 !text-accent">
                  Flagship
                  <span className="inline-flex items-center gap-2 border border-accent px-2.5 py-1.5">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
                    {FLAGSHIP.status}
                  </span>
                </p>
                <h3 className="display mt-4 text-[clamp(3.4rem,8vw,6.75rem)]">{FLAGSHIP.title}</h3>
                <p className="mt-4 text-lg text-ink-soft md:text-xl">
                  Currently developing real-time hallucination detection for multi-step agentic RAG. Not released yet; the sketch below shows where the verifier sits in the pipeline.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <a href={FLAGSHIP.repo} target="_blank" rel="noopener noreferrer" className="btn btn-solid !bg-ink !text-base hover:!bg-accent">
                  Follow the build on GitHub <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                </a>
              </div>
            </div>
            <Pipeline />
          </div>
        </Reveal>

        {/* index */}
        <div className="mt-[var(--head-gap)]">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <p className="eyebrow !text-ink">Index of builds</p>
            <p className="eyebrow">{String(builds.length).padStart(2, "0")} entries</p>
          </div>
          <ol>
            {builds.map((p, i) => (
              <Row key={p.slug} p={p} i={i} />
            ))}
          </ol>
        </div>

        <div className="mt-[var(--head-gap)]">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <p className="eyebrow !text-ink">Academic projects</p>
            <p className="eyebrow">{String(academic.length).padStart(2, "0")} entries</p>
          </div>
          <ol>
            {academic.map((p, i) => (
              <Row key={p.slug} p={p} i={builds.length + i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
