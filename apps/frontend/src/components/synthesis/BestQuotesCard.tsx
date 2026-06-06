import { Quote } from "lucide-react";
import Card from "../common/Card";

interface BestQuotesCardProps {
  quotes: string[];
}

export function BestQuotesCard({ quotes }: BestQuotesCardProps) {
  return (
    <Card tone="sky">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-300"><Quote className="h-5 w-5" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Best Quotes</p>
          <h2 className="text-xl font-bold text-white">Language worth repeating</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {quotes.map((quote) => (
          <blockquote key={quote} className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-lg font-semibold leading-8 text-white">
            <span className="absolute -left-2 -top-8 text-8xl font-black text-sky-400/10">“</span>
            <span className="relative">{quote}</span>
          </blockquote>
        ))}
      </div>
    </Card>
  );
}

export default BestQuotesCard;
