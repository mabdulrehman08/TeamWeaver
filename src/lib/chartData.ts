import type { Benchmark, ComparisonResult, Synthesis } from "../types";

export const sentimentColors = ["#34d399", "#fbbf24", "#fb7185"];

export function toSentimentChartData(synthesis: Synthesis) {
  return [
    { name: "Positive", value: synthesis.positive },
    { name: "Neutral", value: synthesis.neutral },
    { name: "Negative", value: synthesis.negative },
  ];
}

export function toBenchmarkChartData(benchmark: Benchmark) {
  return [
    { name: "Simulated", support: benchmark.simulatedSupport, fill: "#38bdf8" },
    { name: "Historical", support: benchmark.historicalSupport, fill: "#8b5cf6" },
  ];
}

export function toComparisonChartData(comparison: ComparisonResult) {
  return [
    { name: "Message A", support: comparison.aggregate.messageA, fill: "#38bdf8" },
    { name: "Message B", support: comparison.aggregate.messageB, fill: "#a78bfa" },
  ];
}
