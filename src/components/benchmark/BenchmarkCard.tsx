import type { Benchmark } from "../../types";
import Card from "../common/Card";
import BenchmarkChart from "./BenchmarkChart";

interface BenchmarkCardProps {
  benchmark: Benchmark;
}

export function BenchmarkCard({ benchmark }: BenchmarkCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Historical Benchmark</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Credibility calibration</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{benchmark.summary}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-center lg:min-w-52">
          <p className="text-sm text-slate-400">Calibration Score</p>
          <p className="mt-2 text-5xl font-black text-white">{benchmark.calibrationScore}<span className="text-xl text-slate-500"> / 100</span></p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400" style={{ width: `${benchmark.calibrationScore}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.5fr]">
        <BenchmarkChart benchmark={benchmark} />
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm text-slate-400">Simulated Support</p>
            <p className="mt-2 text-4xl font-black text-sky-300">{benchmark.simulatedSupport}%</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm text-slate-400">Historical Support</p>
            <p className="mt-2 text-4xl font-black text-violet-300">{benchmark.historicalSupport}%</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
            <p className="text-sm text-slate-400">Historical Match</p>
            <p className="mt-2 text-4xl font-black text-emerald-300">{benchmark.historicalMatch}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BenchmarkCard;
