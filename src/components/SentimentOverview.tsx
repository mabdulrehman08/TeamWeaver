import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Synthesis } from "../types/simulation";

const COLORS = ["#34d399", "#fbbf24", "#fb7185"];

interface SentimentOverviewProps {
  synthesis: Synthesis;
}

export function SentimentOverview({ synthesis }: SentimentOverviewProps) {
  const data = [
    { name: "Positive", value: synthesis.positive },
    { name: "Neutral", value: synthesis.neutral },
    { name: "Negative", value: synthesis.negative },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-card">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Sentiment model</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Voter reaction overview</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-400">{synthesis.overallSentiment}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="h-72 rounded-3xl border border-slate-800 bg-slate-950/60 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={72} outerRadius={108} paddingAngle={4} dataKey="value">
                {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 16, color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {data.map((item, index) => (
            <div key={item.name} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="h-2 w-12 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <p className="mt-5 text-sm font-medium text-slate-400">{item.name}</p>
              <p className="mt-2 text-4xl font-black tracking-tight text-white">{item.value}%</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">Share of synthetic voters with a {item.name.toLowerCase()} modeled reaction.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SentimentOverview;
