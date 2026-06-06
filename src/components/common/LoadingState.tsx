import { Bot, CheckCircle2, Loader2 } from "lucide-react";
import type { SimulationEvent } from "../../types";

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

interface LoadingStateProps {
  currentMessage: string;
  events: SimulationEvent[];
}

export function LoadingState({ currentMessage, events }: LoadingStateProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-sky-400/20 bg-slate-900/80 p-6 shadow-glow">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative rounded-3xl border border-sky-400/30 bg-sky-400/10 p-4 text-sky-300">
              <Bot className="h-7 w-7" />
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-emerald-300" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Agent swarm running</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{currentMessage}</h2>
            </div>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {events.slice(-3).map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>{event.type.replaceAll("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skeletonCards.map((card) => (
          <div key={card} className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="h-4 w-28 rounded-full bg-slate-800" />
            <div className="mt-4 h-7 w-44 rounded-full bg-slate-800" />
            <div className="mt-5 space-y-3">
              <div className="h-4 rounded-full bg-slate-800" />
              <div className="h-4 w-10/12 rounded-full bg-slate-800" />
              <div className="h-4 w-8/12 rounded-full bg-slate-800" />
            </div>
            <div className="mt-6 h-24 rounded-2xl bg-slate-800/80" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default LoadingState;
