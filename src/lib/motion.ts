/** The only easings, durations and springs allowed on this site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = { fast: 0.25, base: 0.7, slow: 1.1 } as const;

export const SPRING = {
  soft: { type: "spring", stiffness: 170, damping: 24, mass: 0.7 },
  snappy: { type: "spring", stiffness: 320, damping: 30, mass: 0.5 },
} as const;

export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
