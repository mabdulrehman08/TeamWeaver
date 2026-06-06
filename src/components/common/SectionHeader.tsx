import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  tone?: "sky" | "violet" | "emerald" | "rose";
}

const toneText = {
  sky: "text-sky-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  rose: "text-rose-300",
};

export function SectionHeader({ eyebrow, title, description, icon, tone = "sky" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className={icon ? "flex items-center gap-3" : ""}>
        {icon}
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${toneText[tone]}`}>{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      {description && <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  );
}

export default SectionHeader;
