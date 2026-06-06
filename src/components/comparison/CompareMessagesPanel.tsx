import { GitCompareArrows } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import ComparisonChart from "./ComparisonChart";
import SegmentDeltaCard from "./SegmentDeltaCard";
import type { ComparisonResult } from "../../types";

interface CompareMessagesPanelProps {
  comparison: ComparisonResult | null;
  isComparing: boolean;
  messageA: string;
  messageB: string;
  onCompare: () => void;
  onMessageAChange: (message: string) => void;
  onMessageBChange: (message: string) => void;
}

export function CompareMessagesPanel({ comparison, isComparing, messageA, messageB, onCompare, onMessageAChange, onMessageBChange }: CompareMessagesPanelProps) {
  return (
    <section className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">Message A</span>
          <textarea value={messageA} onChange={(event: { target: HTMLTextAreaElement }) => onMessageAChange(event.target.value)} className="mt-4 min-h-44 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm leading-6 text-white outline-none transition focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10" />
        </label>
        <label className="block rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-300">Message B</span>
          <textarea value={messageB} onChange={(event: { target: HTMLTextAreaElement }) => onMessageBChange(event.target.value)} className="mt-4 min-h-44 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm leading-6 text-white outline-none transition focus:border-violet-400/60 focus:ring-4 focus:ring-violet-400/10" />
        </label>
      </div>

      <Button onClick={onCompare} disabled={isComparing || !messageA.trim() || !messageB.trim()}>
        <GitCompareArrows className="h-5 w-5" /> {isComparing ? "Comparing..." : "Compare Messages"}
      </Button>

      {comparison && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Head-to-head</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Aggregate support</h2>
            <ComparisonChart comparison={comparison} />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card tone="emerald">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Improved</p>
              <h3 className="mt-2 text-xl font-bold text-white">Segments lifted by B</h3>
              <div className="mt-5 space-y-3">
                {comparison.improvedSegments.map((segment) => <SegmentDeltaCard key={segment.segment} segment={segment} />)}
              </div>
            </Card>
            <Card tone="rose">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Worsened</p>
              <h3 className="mt-2 text-xl font-bold text-white">Segments requiring edits</h3>
              <div className="mt-5 space-y-3">
                {comparison.worsenedSegments.map((segment) => <SegmentDeltaCard key={segment.segment} segment={segment} positive={false} />)}
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}

export default CompareMessagesPanel;
