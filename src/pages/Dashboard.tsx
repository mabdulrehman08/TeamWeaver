import { useEffect, useMemo, useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRightLeft, BadgeCheck, Bot, ChevronRight, GitCompareArrows, Play, Quote, Radar, Sparkles } from "lucide-react";
import BenchmarkCard from "../components/BenchmarkCard";
import LoadingState from "../components/LoadingState";
import MovedGroupsCard from "../components/MovedGroupsCard";
import PersonaCard from "../components/PersonaCard";
import RedFlagsCard from "../components/RedFlagsCard";
import SentimentOverview from "../components/SentimentOverview";
import { runComparison, streamSimulation } from "../services/simulationService";
import type { ComparisonResult, Persona, SimulationEvent, SimulationResult } from "../types/simulation";

const presets = {
  "Student Debt Relief": "We will lower the burden of student debt for working families, expand skills-based pathways, and make sure young people can build a life without choosing between rent, groceries, and opportunity.",
  "Immigration Reform": "Our immigration plan secures the border, modernizes legal pathways, protects Dreamers, and gives local communities the resources they need to keep families safe and economies moving.",
  "Tax Cuts": "We will cut taxes for middle-class families and small businesses while closing loopholes that reward outsourcing and special interests over work, investment, and community growth.",
  "Healthcare Expansion": "Every family deserves access to affordable healthcare. Our plan lowers premiums, protects Medicare, expands rural care, and gives patients more power over their choices.",
};

const loadingMessages = [
  "Analyzing suburban voters...",
  "Comparing historical polling...",
  "Synthesizing reactions...",
  "Stress-testing fiscal language...",
  "Mapping persuasion pockets...",
];

type Tab = "single" | "compare";

function PersonaDetailsPanel({ persona }: { persona: Persona }) {
  return (
    <div className="rounded-2xl border border-sky-400/30 bg-slate-950 p-4 text-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Generative UI</p>
          <h3 className="mt-1 text-lg font-black">{persona.name}</h3>
          <p className="text-sm text-slate-400">{persona.segment} · {persona.location}</p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-300">{persona.sentiment}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Party</dt><dd className="font-bold">{persona.party}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Income</dt><dd className="font-bold">{persona.income}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Age</dt><dd className="font-bold">{persona.age}</dd></div>
        <div className="rounded-xl bg-slate-900 p-3"><dt className="text-slate-500">Education</dt><dd className="font-bold">{persona.education}</dd></div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-slate-300">{persona.reaction}</p>
      <blockquote className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm italic text-slate-200">“{persona.quote}”</blockquote>
    </div>
  );
}

function BestQuotesCard({ quotes }: { quotes: string[] }) {
  return (
    <section className="rounded-[2rem] border border-sky-400/20 bg-sky-950/20 p-6 shadow-card">
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
    </section>
  );
}

function CompareMessagesTab() {
  const [messageA, setMessageA] = useState(presets["Student Debt Relief"]);
  const [messageB, setMessageB] = useState(presets["Healthcare Expansion"]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const compare = async () => {
    setIsComparing(true);
    const result = await runComparison(messageA, messageB);
    setComparison(result);
    setIsComparing(false);
  };

  useEffect(() => {
    void compare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = comparison ? [
    { name: "Message A", support: comparison.aggregate.messageA, fill: "#38bdf8" },
    { name: "Message B", support: comparison.aggregate.messageB, fill: "#a78bfa" },
  ] : [];

  return (
    <section className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">Message A</span>
          <textarea value={messageA} onChange={(event: { target: HTMLTextAreaElement }) => setMessageA(event.target.value)} className="mt-4 min-h-44 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm leading-6 text-white outline-none transition focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10" />
        </label>
        <label className="block rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-300">Message B</span>
          <textarea value={messageB} onChange={(event: { target: HTMLTextAreaElement }) => setMessageB(event.target.value)} className="mt-4 min-h-44 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm leading-6 text-white outline-none transition focus:border-violet-400/60 focus:ring-4 focus:ring-violet-400/10" />
        </label>
      </div>

      <button onClick={compare} disabled={isComparing || !messageA.trim() || !messageB.trim()} className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-6 py-4 font-black text-slate-950 shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">
        <GitCompareArrows className="h-5 w-5" /> {isComparing ? "Comparing..." : "Compare Messages"}
      </button>

      {comparison && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Head-to-head</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Aggregate support</h2>
            <div className="mt-6 h-72 rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20, right: 8, top: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" tickFormatter={(value: number) => `${value}%`} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 16 }} formatter={(value: number) => [`${value}%`, "Support"]} />
                  <Bar dataKey="support" radius={[14, 14, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-950/20 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Improved</p>
              <h3 className="mt-2 text-xl font-bold text-white">Segments lifted by B</h3>
              <div className="mt-5 space-y-3">
                {comparison.improvedSegments.map((segment) => (
                  <div key={segment.segment} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm"><span className="font-bold text-white">{segment.segment}</span><span className="text-emerald-300">+{segment.delta}</span></div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><span>{segment.messageA}%</span><ChevronRight className="h-3 w-3" /><span>{segment.messageB}%</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-rose-400/20 bg-rose-950/20 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Worsened</p>
              <h3 className="mt-2 text-xl font-bold text-white">Segments requiring edits</h3>
              <div className="mt-5 space-y-3">
                {comparison.worsenedSegments.map((segment) => (
                  <div key={segment.segment} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm"><span className="font-bold text-white">{segment.segment}</span><span className="text-rose-300">{segment.delta}</span></div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><span>{segment.messageA}%</span><ChevronRight className="h-3 w-3" /><span>{segment.messageB}%</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("single");
  const [stimulus, setStimulus] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);

  useCopilotReadable({ description: "Current campaign simulation result", value: result });
  useCopilotAction<{ persona: Persona }>({
    name: "showPersonaDetails",
    description: "Render a detailed voter persona card for a persona selected from the simulation.",
    parameters: [
      { name: "persona", type: "object", description: "The persona to inspect in detail", required: true },
    ],
    render: ({ args }: { args: { persona: Persona } }) => args?.persona ? <PersonaDetailsPanel persona={args.persona} /> : <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">Select a persona to inspect.</div>,
    handler: async ({ persona }: { persona: Persona }) => ({ persona }),
  });

  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setInterval(() => setMessageIndex((index) => (index + 1) % loadingMessages.length), 1000);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  const sentimentBreakdown = useMemo(() => {
    if (!result) return null;
    const total = result.personas.length;
    return {
      positive: result.personas.filter((persona) => persona.sentiment === "positive").length,
      neutral: result.personas.filter((persona) => persona.sentiment === "neutral").length,
      negative: result.personas.filter((persona) => persona.sentiment === "negative").length,
      total,
    };
  }, [result]);

  const run = async () => {
    if (!stimulus.trim()) return;
    setResult(null);
    setEvents([]);
    setMessageIndex(0);
    setIsLoading(true);

    for await (const event of streamSimulation(stimulus)) {
      setEvents((current) => [...current, event]);
      if (event.type === "simulation_finished") {
        setResult(event.payload.result);
      }
    }

    setIsLoading(false);
  };

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
          <button onClick={() => setTab("single")} className={`rounded-xl px-5 py-3 text-sm font-bold transition ${tab === "single" ? "bg-sky-400 text-slate-950" : "text-slate-400 hover:text-white"}`}>Run Simulation</button>
          <button onClick={() => setTab("compare")} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${tab === "compare" ? "bg-violet-400 text-slate-950" : "text-slate-400 hover:text-white"}`}><ArrowRightLeft className="h-4 w-4" /> Compare Messages</button>
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
                  {Object.entries(presets).map(([label, value]) => (
                    <button key={label} onClick={() => setStimulus(value)} className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-sky-400/50 hover:text-sky-200">{label}</button>
                  ))}
                </div>
                <button onClick={run} disabled={isLoading || !stimulus.trim()} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-6 py-4 font-black text-slate-950 shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">
                  <Play className="h-5 w-5 fill-slate-950" /> {isLoading ? "Simulation Running" : "Run Simulation"}
                </button>
              </div>
            </div>

            {isLoading && <LoadingState currentMessage={loadingMessages[messageIndex]} events={events} />}

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
                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {result.personas.map((persona) => <PersonaCard key={persona.name} persona={persona} />)}
                  </div>
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
          <div className="mt-8"><CompareMessagesTab /></div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
