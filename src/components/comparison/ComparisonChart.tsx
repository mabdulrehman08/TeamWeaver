import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toComparisonChartData } from "../../lib/chartData";
import type { ComparisonResult } from "../../types";

interface ComparisonChartProps {
  comparison: ComparisonResult;
}

export function ComparisonChart({ comparison }: ComparisonChartProps) {
  return (
    <div className="mt-6 h-72 rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={toComparisonChartData(comparison)} margin={{ left: -20, right: 8, top: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis domain={[0, 100]} stroke="#94a3b8" tickFormatter={(value: number) => `${value}%`} />
          <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 16 }} formatter={(value: number) => [`${value}%`, "Support"]} />
          <Bar dataKey="support" radius={[14, 14, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
