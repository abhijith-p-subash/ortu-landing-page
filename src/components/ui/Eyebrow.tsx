import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  tone?: "accent" | "sage";
  className?: string;
}

/** Small bracketed, uppercase section label — terminal-flavoured brand motif. */
const Eyebrow = ({ children, tone = "accent", className = "" }: EyebrowProps) => {
  const toneClass =
    tone === "sage"
      ? "border-sage/30 bg-sage/10 text-sage"
      : "border-accent/30 bg-accent/10 text-accent";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${toneClass} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone === "sage" ? "bg-sage" : "bg-accent"}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
};

export default Eyebrow;
