import { useEffect, useState } from "react";
import { getLenis } from "@/components/scroll/LenisProvider";

export const SECTION_IDS = [
  "hero",
  "about",
  "stack",
  "work",
  "experience",
  "recognition",
  "photography",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenis();
  if (lenis && !reduced) {
    lenis.scrollTo(el, { offset: id === "hero" ? 0 : -8, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}
