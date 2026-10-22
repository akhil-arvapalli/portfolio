import { SectionHeader, Reveal, ScrollReveal } from "@/components/motion";
import { CountUp } from "@/components/rb";
import { EDUCATION, IDENTITY, STATS } from "@/content/content";

const STATEMENT =
  "I'm a developer who likes turning ideas into working software, mostly where AI/ML meets full-stack.";

const ROWS: [string, string][] = [
  ["Name", IDENTITY.name],
  ["Based", IDENTITY.location],
  ["Studying", `${EDUCATION.degree}, ${EDUCATION.college}`],
  ["Period", EDUCATION.period],
  ["Focus", "AI/ML and full-stack: RAG, LLM tools, voice agents"],
];

export default function About() {
  return (
    <section id="about" className="band section">
      <div className="wrap">
        <SectionHeader num="01" label="About" title={["I build things", <>that <em>work.</em></>]} />

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ScrollReveal text={STATEMENT} className="font-serif text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.1] text-ink" />
            <Reveal delay={0.1} className="mt-6 max-w-xl text-lg text-ink-soft">
              <p>
                I've built RAG pipelines, LLM-powered tools, voice agents and GIS dashboards, and I like to get a working
                version in front of people early and improve it from there. DarexAI gave me hands-on time with production
                voice agents; right now I'm developing CascadeGuard.
              </p>
            </Reveal>
          </div>

          {/* file card */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="border border-ink/50 bg-surface p-5 md:p-6">
              <div className="flex items-start gap-5 border-b border-ink/30 pb-5">
                <img
                  src="/assets/me/passport-640.webp"
                  alt="Akhil"
                  width={640}
                  height={716}
                  loading="lazy"
                  className="w-24 shrink-0 border border-ink/40 bg-raised object-cover"
                />
                <div>
                  <p className="eyebrow !text-accent">File · A.V.S.A.</p>
                  <p className="display mt-2 text-[2.9rem]">Akhil</p>
                  <p className="mt-1 text-sm text-ink-mute">Full-Stack AI Developer</p>
                </div>
              </div>
              <dl className="mt-5 space-y-3">
                {ROWS.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
                    <dt className="eyebrow pt-1">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <div className="mt-[var(--head-gap)] grid grid-cols-2 border-y border-ink/40 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className={`px-1 py-6 lg:px-6 ${i > 0 ? "lg:border-l lg:border-ink/30" : ""} ${i % 2 === 1 ? "border-l border-ink/30 pl-5 lg:pl-6" : ""}`}>
              <p className="display text-[clamp(3.5rem,6.6vw,5.75rem)] leading-none">
                {"plain" in s ? s.to : <CountUp to={s.to} duration={1.6} delay={0.1 * i} />}
              </p>
              <p className="eyebrow mt-3">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
