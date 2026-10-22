import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LineReveal } from "@/components/motion";

export default function NotFound() {
  return (
    <section className="band flex min-h-[100svh] flex-col items-center justify-center px-[var(--gutter)] text-center">
      <h1 className="display text-[clamp(8rem,28vw,22rem)] leading-[0.85]">
        <span className="sr-only">404, page not found</span>
        <span aria-hidden>
          <LineReveal lines={[<>4<em>0</em>4</>]} trigger="mount" />
        </span>
      </h1>
      <p className="mt-6 max-w-sm text-ink-soft">This page wandered off. Let&apos;s get you back.</p>
      <Link
        to="/"
        className="btn btn-solid mt-8"
      >
        <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
        Back to the good stuff
      </Link>
    </section>
  );
}
