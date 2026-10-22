import { useSyncExternalStore } from "react";

let done = false;
const subs = new Set<() => void>();

/** Preloader calls this when its curtain starts lifting; the hero reveals on it. */
export function markIntroDone() {
  if (done) return;
  done = true;
  subs.forEach((s) => s());
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => done,
    () => true
  );
}
