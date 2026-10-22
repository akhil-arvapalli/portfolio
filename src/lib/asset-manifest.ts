export type AssetVariant = { width: 320 | 640 | 960 | 1280; avif: string; webp: string; png?: string };

export type PortraitAsset = {
  key: "portrait" | "racing" | "passport";
  role: string;
  variants: AssetVariant[];
};

export const ME_ASSETS = {
  portrait: {
    key: "portrait",
    role: "BASE hero portrait",
    variants: [
      { width: 640, avif: "/assets/me/portrait-640.avif", webp: "/assets/me/portrait-640.webp", png: "/assets/me/portrait-640.png" },
      { width: 960, avif: "/assets/me/portrait-960.avif", webp: "/assets/me/portrait-960.webp", png: "/assets/me/portrait-960.png" },
      { width: 1280, avif: "/assets/me/portrait-1280.avif", webp: "/assets/me/portrait-1280.webp", png: "/assets/me/portrait-1280.png" },
    ],
  },
  racing: {
    key: "racing",
    role: "REVEAL hero portrait",
    variants: [
      { width: 640, avif: "/assets/me/racing-640.avif", webp: "/assets/me/racing-640.webp", png: "/assets/me/racing-640.png" },
      { width: 960, avif: "/assets/me/racing-960.avif", webp: "/assets/me/racing-960.webp", png: "/assets/me/racing-960.png" },
      { width: 1280, avif: "/assets/me/racing-1280.avif", webp: "/assets/me/racing-1280.webp", png: "/assets/me/racing-1280.png" },
    ],
  },
  passport: {
    key: "passport",
    role: "ID card / avatars / OG",
    variants: [
      { width: 320, avif: "/assets/me/passport-320.avif", webp: "/assets/me/passport-320.webp" },
      { width: 640, avif: "/assets/me/passport-640.avif", webp: "/assets/me/passport-640.webp" },
      { width: 960, avif: "/assets/me/passport-960.avif", webp: "/assets/me/passport-960.webp" },
    ],
  },
  placeholder: "/assets/me/placeholder.svg",
  passportJpeg: "/assets/me/passport.jpeg",
} as const satisfies Record<string, PortraitAsset | string>;
