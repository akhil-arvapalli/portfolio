import { ME_ASSETS, type PortraitAsset } from "@/lib/asset-manifest";
import { cn } from "@/lib/utils";

type PictureAsset = "portrait" | "racing" | "passport";

/**
 * Typed <picture> with avif -> webp -> png fallbacks + srcset.
 * Only uses pre-optimized variants in /public/assets/me — never sources.
 */
export function Picture({
  asset,
  sizes = "100vw",
  className,
  alt,
  loading = "lazy",
  fetchPriority,
}: {
  asset: PictureAsset;
  sizes?: string;
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const a = ME_ASSETS[asset] as PortraitAsset;
  const srcSet = (fmt: "avif" | "webp" | "png") =>
    a.variants
      .filter((v) => v[fmt])
      .map((v) => `${v[fmt]!} ${v.width}w`)
      .join(", ");
  const fallback = a.variants[a.variants.length - 1];
  const last = fallback.png ?? fallback.webp;
  const alts: Record<PictureAsset, string> = {
    portrait: "Akhil — portrait",
    racing: "Akhil — racing",
    passport: "Akhil — ID photo",
  };
  return (
    <picture>
      {a.variants.some((v) => v.avif) && <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />}
      {a.variants.some((v) => v.webp) && <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />}
      {a.variants.some((v) => v.png) && <source type="image/png" srcSet={srcSet("png")} sizes={sizes} />}
      <img
        src={last}
        alt={alt ?? alts[asset]}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={cn("block h-auto w-full", className)}
      />
    </picture>
  );
}
