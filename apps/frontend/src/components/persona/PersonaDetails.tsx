import type { Persona } from "../../types";

interface PersonaDetailsProps {
  persona: Persona;
}

export function PersonaDetails({ persona }: PersonaDetailsProps) {
  return (
    <div className="rounded-2xl border border-sky-400/30 bg-slate-950 p-4 text-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Generative UI</p>
          <h3 className="mt-1 text-lg font-black">{persona.name}</h3>
          <p className="text-sm text-slate-400">{persona.segment} · {persona.location}</p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-300">{persona.sentiment}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Party</dt><dd className="font-bold">{persona.party}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Income</dt><dd className="font-bold">{persona.income}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Age</dt><dd className="font-bold">{persona.age}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Education</dt><dd className="font-bold">{persona.education}</dd></div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-slate-300">{persona.reaction}</p>
      <blockquote className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm italic text-slate-200">“{persona.quote}”</blockquote>
    </div>
  );
}

export default PersonaDetails;
