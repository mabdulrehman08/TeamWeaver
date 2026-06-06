interface SentimentMetricCardProps {
  name: string;
  value: number;
  color: string;
}

export function SentimentMetricCard({ name, value, color }: SentimentMetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="h-2 w-12 rounded-full" style={{ backgroundColor: color }} />
      <p className="mt-5 text-sm font-medium text-slate-400">{name}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-white">{value}%</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">Share of synthetic voters with a {name.toLowerCase()} modeled reaction.</p>
    </div>
  );
}

export default SentimentMetricCard;
