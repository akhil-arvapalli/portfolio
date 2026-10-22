import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { LINKS, IDENTITY } from "@/content/content";
import { isLive } from "@/lib/links";
import { scrollToSection } from "@/lib/scroll-store";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] as const;

function Confetti() {
  const colors = ["#e2be8a", "#eadbc3", "#632024", "#d5b893"] as const;
  return (
    <div className="pointer-events-none fixed inset-0 z-[250] overflow-hidden" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-3 w-1.5 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, top: -20, background: colors[i % colors.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: 360 + i * 20, opacity: 0.9 }}
          transition={{ duration: 2.6 + (i % 5) * 0.4, delay: (i % 9) * 0.1, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const [egg, setEgg] = useState(false);

  useEffect(() => {
    let progress = 0;
    const keys: readonly string[] = KONAMI;
    const onKey = (e: KeyboardEvent) => {
      progress = e.key === keys[progress] ? progress + 1 : e.key === keys[0] ? 1 : 0;
      if (progress === keys.length) {
        progress = 0;
        setEgg(true);
        window.setTimeout(() => setEgg(false), 4500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links: { label: string; href: string }[] = [
    { label: "GitHub", href: LINKS.github },
    { label: "LinkedIn", href: LINKS.linkedin },
    { label: "Photography", href: LINKS.photoPortfolio },
    { label: "Instagram", href: LINKS.instagram },
    { label: "LeetCode", href: LINKS.leetcode },
    { label: "Email", href: `mailto:${LINKS.email}` },
  ].filter((l) => isLive(l.href) || l.label === "Email");

  return (
    <footer className="band theme-dark border-t border-ink/40 pb-32 pt-10">
      <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <p className="display text-3xl">
          A.V.S. Akhil
          <span className="eyebrow ml-4 align-middle">{IDENTITY.location}</span>
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer" className="transition-colors hover:text-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <span className="eyebrow">© {new Date().getFullYear()}</span>
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            aria-label="Back to top"
            className="btn !p-3"
          >
            <ArrowUp size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
      {egg && <Confetti />}
    </footer>
  );
}
