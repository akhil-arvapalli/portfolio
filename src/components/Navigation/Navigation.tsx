import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Blocks, Briefcase, Camera, FileText, FolderKanban, House, Mail, Trophy, User } from "lucide-react";
import { Dock } from "@/components/rb";
import { SECTION_IDS, scrollToSection, type SectionId } from "@/lib/scroll-store";
import { LINKS } from "@/content/content";
import { isLive } from "@/lib/links";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/lib/intro";

const DARK_SECTIONS: readonly SectionId[] = ["stack", "experience", "photography", "contact"];

const META: Record<SectionId, { label: string; icon: React.ReactNode }> = {
  hero: { label: "Intro", icon: <House size={20} strokeWidth={1.5} /> },
  about: { label: "About", icon: <User size={20} strokeWidth={1.5} /> },
  stack: { label: "Stack", icon: <Blocks size={20} strokeWidth={1.5} /> },
  work: { label: "Work", icon: <FolderKanban size={20} strokeWidth={1.5} /> },
  experience: { label: "Experience", icon: <Briefcase size={20} strokeWidth={1.5} /> },
  recognition: { label: "Recognition", icon: <Trophy size={20} strokeWidth={1.5} /> },
  photography: { label: "Photography", icon: <Camera size={20} strokeWidth={1.5} /> },
  contact: { label: "Contact", icon: <Mail size={20} strokeWidth={1.5} /> },
};

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("hero");
  useEffect(() => {
    // Sections are lazy-loaded, so look them up on every scroll instead of once at mount.
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: SectionId = "hero";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return active;
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time} IST</span>;
}

function Ruler({ active }: { active: SectionId }) {
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const top = useTransform(y, (v) => `${v * 100}%`);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-[60] hidden h-[min(58vh,420px)] w-24 -translate-y-1/2 transition-colors duration-500 xl:block"
      style={{ color: DARK_SECTIONS.includes(active) ? "#eadbc3" : "#1b2740" }}
    >
      <span className="absolute right-0 top-0 h-full w-px bg-current opacity-50" />
      {SECTION_IDS.map((id, i) => {
        const on = id === active;
        return (
          <span
            key={id}
            className="absolute right-0 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ top: `${(i / (SECTION_IDS.length - 1)) * 100}%`, transform: "translateY(-50%)" }}
          >
            <span className={cn("transition-opacity duration-300", on ? "opacity-100" : "opacity-0")}>{String(i).padStart(2, "0")} {id}</span>
            <span className={cn("block h-px bg-current transition-all duration-300", on ? "w-6" : "w-2.5 opacity-60")} />
          </span>
        );
      })}
      <motion.span className="absolute -right-[3px] top-0 size-[7px] -translate-y-1/2 rounded-full bg-current" style={{ top }} />
    </div>
  );
}

export default function Navigation() {
  const active = useActiveSection();
  const ready = useIntroDone();
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const fn = () => setCompact(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const ids = compact ? SECTION_IDS.filter((id) => ["hero", "about", "work", "photography", "contact"].includes(id)) : SECTION_IDS;
  const items = ids.map((id) => ({
    icon: META[id].icon,
    label: META[id].label,
    active: active === id,
    onClick: () => scrollToSection(id),
  }));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
          scrolled ? "border-ink/25 bg-base/85 backdrop-blur-md" : "border-transparent"
        )}
      >
        <div className="wrap !static flex h-16 items-center justify-between before:hidden">
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-baseline gap-4 text-left"
            aria-label="Akhil, back to top"
          >
            <span className="display text-[2.1rem] leading-none">A.V.S. Akhil</span>
            <span className="eyebrow hidden sm:inline">
              <Clock />
            </span>
          </button>
          <div className="flex items-center gap-2.5">
            {isLive(LINKS.resume) && (
              <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className="btn !px-4 !py-2.5">
                <FileText size={14} strokeWidth={1.5} aria-hidden />
                Résumé
              </a>
            )}
            <button type="button" onClick={() => scrollToSection("contact")} className="btn btn-solid hidden !px-4 !py-2.5 sm:inline-flex">
              Let's talk
            </button>
          </div>
        </div>
      </header>

      <Ruler active={active} />

      {ready && (
        <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-24" aria-label="Section navigation">
          <Dock
            items={items}
            position="bottom"
            theme="dark"
            baseItemSize={44}
            magnification={64}
            distance={140}
            gap={8}
            showLabels
            showIndicators
            accentColor="#632024"
            className="pointer-events-auto"
          />
        </nav>
      )}
    </>
  );
}
