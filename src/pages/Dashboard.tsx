import { ArrowRightLeft, BadgeCheck, Bot, Play, Radar, Sparkles } from "lucide-react";
import BenchmarkCard from "../components/benchmark/BenchmarkCard";
import Button from "../components/common/Button";
import LoadingState from "../components/common/LoadingState";
import PersonaGrid from "../components/persona/PersonaGrid";
import SentimentOverview from "../components/sentiment/SentimentOverview";
import BestQuotesCard from "../components/synthesis/BestQuotesCard";
import MovedGroupsCard from "../components/synthesis/MovedGroupsCard";
import RedFlagsCard from "../components/synthesis/RedFlagsCard";
import { useSimulation } from "../hooks/useSimulation";
import { messagePresets } from "../lib/constants";
import { useSimulationCopilotActions } from "../lib/copilotActions";
import CompareMessages from "./CompareMessages";
import { useState } from "react";

type Tab = "single" | "compare";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("single");
  const {
    currentLoadingMessage,
    events,
    isLoading,
    result,
    run,
    sentimentBreakdown,
    setStimulus,
    stimulus,
  } = useSimulation();

  useSimulationCopilotActions(result);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-20 text-slate-100">
      <div className="noise-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-card backdrop-blur md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-200">
                <Sparkles className="h-4 w-4" /> AG-UI ready multi-agent simulation
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">Persona Campaign Simulator</h1>
              <p className="mt-4 text-lg leading-8 text-slate-400">Test campaign messages against synthetic voter personas.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"><Radar className="h-5 w-5 text-sky-300" /><p className="mt-4 text-2xl font-black">16</p><p className="text-sm text-slate-400">Synthetic voters</p></div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"><Bot className="h-5 w-5 text-violet-300" /><p className="mt-4 text-2xl font-black">5</p><p className="text-sm text-slate-400">Agent events</p></div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"><BadgeCheck className="h-5 w-5 text-emerald-300" /><p className="mt-4 text-2xl font-black">78</p><p className="text-sm text-slate-400">Calibration</p></div>
            </div>
          </div>
        </header>

        <nav className="mt-8 inline-flex rounded-2xl border border-slate-800 bg-slate-900/80 p-1">
          <Button onClick={() => setTab("single")} variant={tab === "single" ? "tabActive" : "tabInactive"} className="rounded-xl px-5 py-3 text-sm">Run Simulation</Button>
          <Button onClick={() => setTab("compare")} variant={tab === "compare" ? "tabActive" : "tabInactive"} className={`rounded-xl px-5 py-3 text-sm ${tab === "compare" ? "bg-violet-400" : ""}`}><ArrowRightLeft className="h-4 w-4" /> Compare Messages</Button>
        </nav>

        {tab === "single" ? (
          <section className="mt-8 space-y-8">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-card md:p-6">
              <textarea
                value={stimulus}
                onChange={(event: { target: HTMLTextAreaElement }) => setStimulus(event.target.value)}
                placeholder="Paste a speech, policy proposal, ad script, or attack response..."
                className="min-h-56 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-base leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10"
              />
              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(messagePresets).map(([label, value]) => (
                    <Button key={label} onClick={() => setStimulus(value)} variant="secondary" className="rounded-full px-4 py-2 text-sm">{label}</Button>
                  ))}
                </div>
                <Button onClick={run} disabled={isLoading || !stimulus.trim()}>
                  <Play className="h-5 w-5 fill-slate-950" /> {isLoading ? "Simulation Running" : "Run Simulation"}
                </Button>
              </div>
            </div>

            {isLoading && <LoadingState currentMessage={currentLoadingMessage} events={events} />}

            {result && !isLoading && (
              <div className="space-y-8">
                <SentimentOverview synthesis={result.synthesis} />

                {sentimentBreakdown && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-sm text-slate-400">Total personas</p><p className="mt-2 text-3xl font-black text-white">{sentimentBreakdown.total}</p></div>
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5"><p className="text-sm text-emerald-200">Positive cards</p><p className="mt-2 text-3xl font-black text-white">{sentimentBreakdown.positive}</p></div>
                    <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5"><p className="text-sm text-amber-100">Neutral cards</p><p className="mt-2 text-3xl font-black text-white">{sentimentBreakdown.neutral}</p></div>
                    <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5"><p className="text-sm text-rose-200">Negative cards</p><p className="mt-2 text-3xl font-black text-white">{sentimentBreakdown.negative}</p></div>
                  </div>
                )}

                <section>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Persona reactions</p>
                      <h2 className="mt-2 text-3xl font-black text-white">Synthetic voter panel</h2>
                    </div>
                    <p className="hidden max-w-md text-sm leading-6 text-slate-400 md:block">Responsive generative cards model how different voters interpret tone, trust, specificity, and policy tradeoffs.</p>
                  </div>
                  <PersonaGrid personas={result.personas} />
                </section>

                <div className="grid gap-6 xl:grid-cols-3">
                  <BestQuotesCard quotes={result.synthesis.bestQuotes} />
                  <RedFlagsCard redFlags={result.synthesis.redFlags} />
                  <MovedGroupsCard movedGroups={result.synthesis.movedGroups} />
                </div>

                <BenchmarkCard benchmark={result.benchmark} />
              </div>
            )}
          </section>
        ) : (
          <div className="mt-8"><CompareMessages /></div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
