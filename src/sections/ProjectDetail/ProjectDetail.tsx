import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/content/content";
import { DUR, EASE } from "@/lib/motion";

export default function ProjectDetail() {
  const { slug } = useParams();
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[idx];

  if (!project) {
    return (
      <main className="band mx-auto flex min-h-[100svh] flex-col items-center justify-center px-[var(--gutter)] text-center">
        <p className="display text-6xl">Project not found</p>
        <Link to="/" className="btn mt-8">Back home</Link>
      </main>
    );
  }

  const demo = "demo" in project ? project.demo : undefined;
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <motion.main
      className="band min-h-[100svh] pb-28 pt-28 md:pt-36"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, ease: EASE }}
    >
      <div className="wrap">
        <Link to="/" className="eyebrow inline-flex items-center gap-2 !text-ink transition-colors hover:!text-accent">
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden /> Index of work
        </Link>
        <p className="eyebrow mt-10 !text-accent">
          {String(idx + 1).padStart(2, "0")} / {project.kind}
        </p>
        <h1 className="display mt-3 text-[clamp(4rem,12vw,10rem)]">{project.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-ink-soft">{project.blurb}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              Live site <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
            </a>
          )}
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn">
            GitHub <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
          </a>
        </div>

        <div className="mt-14 grid gap-10 border-t border-ink/50 pt-10 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <p className="eyebrow mb-5 !text-ink">What I built</p>
            <ul className="space-y-5">
              {project.points.map((pt) => (
                <li key={pt} className="flex gap-4 text-lg text-ink-soft">
                  <span aria-hidden className="mt-[0.8em] h-px w-6 shrink-0 bg-accent" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="lg:col-span-5">
            <p className="eyebrow mb-5 !text-ink">Stack</p>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li key={t} className="border border-ink/40 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Link to={`/projects/${next.slug}`} className="group mt-16 flex items-end justify-between border-t border-ink pt-6">
          <span>
            <span className="eyebrow">Next</span>
            <span className="display mt-2 block text-[clamp(2.6rem,6vw,5rem)] transition-colors group-hover:text-accent">{next.name}</span>
          </span>
          <ArrowUpRight size={34} strokeWidth={1.25} className="transition-transform duration-300 group-hover:rotate-45" aria-hidden />
        </Link>
      </div>
    </motion.main>
  );
}
