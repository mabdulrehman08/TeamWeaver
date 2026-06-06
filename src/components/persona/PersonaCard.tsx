import { MapPin, Sparkles, UserRound } from "lucide-react";
import type { Persona } from "../../types";
import Badge from "../common/Badge";

interface PersonaCardProps {
  persona: Persona;
  featured?: boolean;
}

export function PersonaCard({ persona, featured = false }: PersonaCardProps) {
  return (
    <article className={`group rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-900 ${featured ? "ring-1 ring-sky-400/30" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <UserRound className="h-4 w-4 text-sky-300" />
            <span>{persona.age} · {persona.education}</span>
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-white">{persona.name}</h3>
          <p className="mt-1 text-sm font-medium text-slate-300">{persona.segment}</p>
        </div>
        <Badge tone={persona.sentiment} className="uppercase tracking-wide">
          {persona.sentiment}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1"><MapPin className="h-3.5 w-3.5" />{persona.location}</span>
        <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1">{persona.party}</span>
        <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1">{persona.income}</span>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-300">{persona.reaction}</p>

      <blockquote className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm italic leading-6 text-slate-200">
        “{persona.quote}”
      </blockquote>

      <div className="mt-5 flex flex-wrap gap-2">
        {persona.issues.map((issue) => (
          <span key={issue} className="inline-flex items-center gap-1 rounded-full bg-sky-400/10 px-2.5 py-1 text-xs font-medium text-sky-200">
            <Sparkles className="h-3 w-3" /> {issue}
          </span>
        ))}
      </div>
    </article>
  );
}

export default PersonaCard;
