/** Paper grain. No gradients, no glow. */
export default function GlobalBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.09] mix-blend-multiply"
      aria-hidden
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "180px 180px",
      }}
    />
  );
}
