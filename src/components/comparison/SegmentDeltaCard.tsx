import { ChevronRight } from "lucide-react";
import type { ComparisonSegment } from "../../types";

interface SegmentDeltaCardProps {
  segment: ComparisonSegment;
  positive?: boolean;
}

export function SegmentDeltaCard({ segment, positive = true }: SegmentDeltaCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-white">{segment.segment}</span>
        <span className={positive ? "text-emerald-300" : "text-rose-300"}>{positive ? `+${segment.delta}` : segment.delta}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><span>{segment.messageA}%</span><ChevronRight className="h-3 w-3" /><span>{segment.messageB}%</span></div>
    </div>
  );
}

export default SegmentDeltaCard;
