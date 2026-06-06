import type { ReactNode } from "react";

type CardTone = "default" | "sky" | "emerald" | "rose";

const toneClasses: Record<CardTone, string> = {
  default: "border-slate-800 bg-slate-900/80",
  sky: "border-sky-400/20 bg-sky-950/20",
  emerald: "border-emerald-400/20 bg-emerald-950/20",
  rose: "border-rose-400/20 bg-rose-950/20",
};

interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
}

export function Card({ children, className = "", tone = "default" }: CardProps) {
  return (
    <section className={`rounded-[2rem] border p-6 shadow-card ${toneClasses[tone]} ${className}`}>
      {children}
    </section>
  );
}

export default Card;
