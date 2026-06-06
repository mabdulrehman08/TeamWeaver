import type { ReactNode } from "react";
import type { Sentiment } from "../../types";

type BadgeTone = Sentiment | "sky" | "violet" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  neutral: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  negative: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  sky: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  slate: "border-slate-800 bg-slate-950/80 text-slate-300",
};

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
}

export function Badge({ children, className = "", tone = "slate" }: BadgeProps) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${toneClasses[tone]} ${className}`}>{children}</span>;
}

export default Badge;
