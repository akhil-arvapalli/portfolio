import Lenis from "lenis";
import { useEffect } from "react";

const holder: { lenis: Lenis | null } = { lenis: null };

export function getLenis(): Lenis | null {
  return holder.lenis;
}

/** Smooth scroll on its own rAF loop. No GSAP ticker, no ScrollTrigger. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.3 });
    holder.lenis = lenis;
    return () => {
      lenis.destroy();
      holder.lenis = null;
    };
  }, []);
  return <>{children}</>;
}
