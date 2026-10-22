import { ArrowUpRight } from "lucide-react";
import { SectionHeader, Reveal } from "@/components/motion";
import { CountUp } from "@/components/rb";
import { CERTIFICATIONS, EDUCATION, HACKATHONS } from "@/content/content";

export default function Recognition() {
  return (
    <section id="recognition" className="band section">
      <div className="wrap">
        <SectionHeader num="05" label="Recognition" title={["Proof under", <><em>pressure.</em></>]} />

        <div className="grid border-y border-ink/50 lg:grid-cols-12">
          <Reveal className="py-8 lg:col-span-7 lg:pr-10">
            <p className="eyebrow mb-6 !text-ink">Hackathons</p>
            <ul className="divide-y divide-ink/30">
              {HACKATHONS.map((h) => (
                <li key={h.title} className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="display text-[clamp(2.1rem,3.8vw,3.1rem)] leading-none">{h.title}</p>
                    <p className="mt-3 text-ink-soft">{h.detail}</p>
                    <p className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                      {h.period}
                      {h.href ? (
                        <a href={h.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink transition-colors hover:text-accent">
                          Credential <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden />
                        </a>
                      ) : null}
                    </p>
                  </div>
                  <span className="h-fit w-fit -rotate-3 border-2 border-accent px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent">
                    {h.result}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="border-t border-ink/50 py-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10">
            <p className="eyebrow mb-6 !text-ink">Education</p>
            <h3 className="display text-[clamp(2.1rem,3.8vw,3.1rem)] leading-none">{EDUCATION.degree}</h3>
            <p className="mt-3 text-ink-soft">{EDUCATION.college}</p>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
              <p className="display text-[5rem] leading-none">
                <CountUp to={Number(EDUCATION.cgpa)} duration={1.6} />
                <span className="eyebrow ml-3 align-middle">CGPA</span>
              </p>
              <p className="eyebrow pb-1">{EDUCATION.period}</p>
            </div>
            <p className="mt-6 border-t border-ink/30 pt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-ink-mute">
              {EDUCATION.coursework.join("  /  ")}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-[var(--head-gap)]">
          <p className="eyebrow mb-4 !text-ink">Certifications</p>
          <ul className="grid border-l border-t border-ink/40 md:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((c, i) => {
              const body = (
                <>
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block leading-snug">{c.name}</span>
                    <span className="mt-1 block text-sm text-ink-mute transition-colors group-hover:text-base/70">{c.issuer}</span>
                  </span>
                  {c.href ? <ArrowUpRight size={16} strokeWidth={1.5} className="mt-1 shrink-0" aria-hidden /> : null}
                </>
              );
              const cls = "group flex h-full items-start gap-4 border-b border-r border-ink/40 p-5 transition-colors duration-300";
              return (
                <li key={c.name}>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-ink hover:text-base`}>
                      {body}
                    </a>
                  ) : (
                    <div className={cls}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
