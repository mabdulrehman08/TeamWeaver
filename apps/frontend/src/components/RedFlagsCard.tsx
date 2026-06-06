import { AlertTriangle } from "lucide-react";

interface RedFlagsCardProps {
  redFlags: string[];
}

export function RedFlagsCard({ redFlags }: RedFlagsCardProps) {
  return (
    <section className="rounded-[2rem] border border-rose-400/20 bg-rose-950/20 p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-rose-300"><AlertTriangle className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Red Flags</p>
          <h2 className="text-xl font-bold text-white">Message vulnerabilities</h2>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {redFlags.map((flag) => (
          <li key={flag} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">{flag}</li>
        ))}
      </ul>
    </section>
  );
}

export default RedFlagsCard;
