import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Synthesis } from "../../types";
import Card from "../common/Card";
import SectionHeader from "../common/SectionHeader";
import SentimentMetricCard from "./SentimentMetricCard";
import { sentimentColors, toSentimentChartData } from "../../lib/chartData";

interface SentimentOverviewProps {
  synthesis: Synthesis;
}

export function SentimentOverview({ synthesis }: SentimentOverviewProps) {
  const data = toSentimentChartData(synthesis);

  return (
    <Card>
      <SectionHeader eyebrow="Sentiment model" title="Voter reaction overview" description={synthesis.overallSentiment} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="h-72 rounded-3xl border border-slate-800 bg-slate-950/60 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={72} outerRadius={108} paddingAngle={4} dataKey="value">
                {data.map((entry, index) => <Cell key={entry.name} fill={sentimentColors[index]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 16, color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {data.map((item, index) => (
            <SentimentMetricCard key={item.name} name={item.name} value={item.value} color={sentimentColors[index]} />
          ))}
        </div>
      </div>
    </Card>
  );
}

export default SentimentOverview;
