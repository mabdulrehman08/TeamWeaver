import { TrendingUp } from "lucide-react";

interface MovedGroupsCardProps {
  movedGroups: string[];
}

export function MovedGroupsCard({ movedGroups }: MovedGroupsCardProps) {
  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-950/20 p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300"><TrendingUp className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Moved Groups</p>
          <h2 className="text-xl font-bold text-white">Persuasion pockets</h2>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {movedGroups.map((group) => (
          <li key={group} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">{group}</li>
        ))}
      </ul>
    </section>
  );
}

export default MovedGroupsCard;
