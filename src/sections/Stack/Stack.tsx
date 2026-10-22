import { SectionHeader, Reveal } from "@/components/motion";
import { SKILLS_AI, SKILLS_FULLSTACK, SKILL_NOTES } from "@/content/content";
import { SKILL_ICONS } from "@/lib/icons";

export default function Stack() {
  return (
    <section id="stack" className="band theme-dark section">
      <div className="wrap">
        <SectionHeader
          num="02"
          label="Stack"
          title={["Tools I", <><em>reach</em> for.</>]}
          aside="The stack behind CascadeGuard and the DarexAI voice agents, plus everything around it that makes it a product."
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4 !text-accent">AI &amp; LLM systems</p>
            <ul className="border-t border-ink/40">
              {SKILLS_AI.map((s) => (
                <li key={s} className="flex items-center gap-4 border-b border-ink/25 py-3.5">
                  <span className="grid w-7 shrink-0 place-items-center text-xl text-accent" aria-hidden>{SKILL_ICONS[s]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-ink">{s}</span>
                    <span className="block text-sm text-ink-mute">{SKILL_NOTES[s]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <p className="eyebrow mb-4 !text-accent">Full-stack &amp; data</p>
            <ul className="grid grid-cols-2 border-l border-t border-ink/40 sm:grid-cols-3 xl:grid-cols-4">
              {SKILLS_FULLSTACK.map((s) => (
                <li
                  key={s}
                  className="group relative flex min-h-[7.25rem] flex-col justify-between overflow-hidden border-b border-r border-ink/40 p-4 transition-colors duration-300 hover:bg-ink hover:text-base"
                >
                  <span className="text-2xl text-accent transition-colors group-hover:text-base" aria-hidden>
                    {SKILL_ICONS[s]}
                  </span>
                  <span>
                    <span className="block font-mono text-xs uppercase tracking-[0.1em]">{s}</span>
                    <span className="mt-1 block max-h-0 text-xs leading-snug opacity-0 transition-all duration-300 group-hover:max-h-12 group-hover:opacity-80">
                      {SKILL_NOTES[s]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
