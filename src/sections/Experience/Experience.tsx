import { ArrowUpRight } from "lucide-react";
import { SectionHeader, Reveal } from "@/components/motion";
import { DecryptedText } from "@/components/rb";
import { EXPERIENCE } from "@/content/content";

export default function Experience() {
  return (
    <section id="experience" className="band theme-dark section">
      <div className="wrap">
        <SectionHeader num="04" label="Experience" title={["Where I've", <><em>worked.</em></>]} />

        <ol className="border-t border-ink/60">
          {EXPERIENCE.map((job, i) => (
            <Reveal as="li" key={job.company} delay={i * 0.06} className="grid gap-6 border-b border-ink/40 py-9 md:grid-cols-[14rem_1fr] md:gap-12">
              <div>
                <p className="eyebrow !text-accent">
                  <DecryptedText text={job.period} animateOn="view" speed={40} maxIterations={8} />
                </p>
                <p className="mt-3 text-sm text-ink-mute">{job.place}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {job.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2 !text-[10px]">
                        {l.label} <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="display text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[0.95]">
                  {job.company}
                  <span className="text-ink-mute"> / </span>
                  <em>{job.role}</em>
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {job.points.map((pt) => (
                    <li key={pt} className="flex gap-4 text-ink-soft">
                      <span aria-hidden className="mt-[0.75em] h-px w-5 shrink-0 bg-accent" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
