import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toBenchmarkChartData } from "../../lib/chartData";
import type { Benchmark } from "../../types";

interface BenchmarkChartProps {
  benchmark: Benchmark;
}

export function BenchmarkChart({ benchmark }: BenchmarkChartProps) {
  return (
    <div className="h-72 rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={toBenchmarkChartData(benchmark)} margin={{ top: 18, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} />
          <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 16 }} formatter={(value: number) => [`${value}%`, "Support"]} />
          <Bar dataKey="support" radius={[14, 14, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BenchmarkChart;
