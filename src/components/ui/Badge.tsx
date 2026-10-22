import { useId } from "react";
import { cn } from "@/lib/utils";

/** Rotating circular-text stamp. */
export default function Badge({ text, className }: { text: string; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 120" className={cn("animate-[spin_22s_linear_infinite]", className)} role="img" aria-label={text}>
      <defs>
        <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="currentColor" opacity="0.08" />
      <text fontSize="9.2" fill="currentColor" className="font-mono uppercase" textLength="272" lengthAdjust="spacing">
        <textPath href={`#${id}`} textLength="272" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
