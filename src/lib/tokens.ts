export const HERO_TEXTURES = {
  base: "/assets/me/portrait-1280.webp",
  reveal: "/assets/me/racing-1280.webp",
} as const;

export type ProjectSlug = "physicslens" | "silent-link" | "flood-risk" | "anchor" | "geomark" | "sentinel" | "depviz";

export type GpuTier = "high" | "mid" | "low" | "none";

export interface ScrollProgress {
  sectionId: string;
  progress: number; // 0..1 within section
}
