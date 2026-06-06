import { useDeferredValue, useMemo, useRef, useState } from "react";
import { BenchmarkComparison } from "./components/BenchmarkComparison";
import { PersonaReactionCard } from "./components/PersonaReactionCard";
import { RedFlagAlert } from "./components/RedFlagAlert";
import { SentimentBreakdown } from "./components/SentimentBreakdown";
import { dobbsPreset } from "./data/presets";
import type {
  BenchmarkPayload,
  EventEnvelope,
  PersonaFailedPayload,
  PersonaReactionPayload,
  RedFlagPayload,
  RunCompletedPayload,
  RunState,
  SynthesisCompletedPayload,
  SynthesisSegmentPayload
} from "./lib/agui";
import { mockEvents } from "./lib/agui";
import { streamRun } from "./lib/api";

export default function App() {
  const [stimulusText, setStimulusText] = useState(dobbsPreset.stimulus_text);
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [personaCount, setPersonaCount] = useState(20);
  const [runState, setRunState] = useState<RunState>("idle");
  const [personas, setPersonas] = useState<PersonaReactionPayload[]>([]);
  const deferredPersonas = useDeferredValue(personas);
  const [failedPersonas, setFailedPersonas] = useState<PersonaFailedPayload[]>([]);
  const [segments, setSegments] = useState<SynthesisSegmentPayload[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlagPayload[]>([]);
  const [synthesis, setSynthesis] = useState<SynthesisCompletedPayload | null>(null);
  const [benchmark, setBenchmark] = useState<BenchmarkPayload | null>(null);
  const [completion, setCompletion] = useState<RunCompletedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const progressLabel = useMemo(() => {
    if (runState === "idle") return "Ready";
    if (runState === "starting") return "Starting run";
    if (runState === "streaming_personas") return `Streaming personas: ${personas.length}/${personaCount}`;
    if (runState === "synthesizing") return "Synthesizing segment signals";
    if (runState === "benchmarking") return "Comparing against Dobbs benchmark";
    if (runState === "completed") return "Run complete";
    return "Run failed";
  }, [personaCount, personas.length, runState]);

  function resetRun() {
    setRunState("starting");
    setPersonas([]);
    setFailedPersonas([]);
    setSegments([]);
    setRedFlags([]);
    setSynthesis(null);
    setBenchmark(null);
    setCompletion(null);
    setError(null);
  }

  function handleEvent(event: EventEnvelope) {
    switch (event.event_type) {
      case "run.started":
        setRunState("streaming_personas");
        break;
      case "persona_reaction.completed":
        setPersonas((current) => [...current, event.payload as PersonaReactionPayload]);
        break;
      case "persona_reaction.failed":
        setFailedPersonas((current) => [...current, event.payload as PersonaFailedPayload]);
        break;
      case "synthesis.started":
        setRunState("synthesizing");
        break;
      case "synthesis.segment_completed":
        setSegments((current) => [...current, event.payload as SynthesisSegmentPayload]);
        break;
      case "synthesis.red_flag_detected":
        setRedFlags((current) => [...current, event.payload as RedFlagPayload]);
        break;
      case "synthesis.completed":
        setSynthesis(event.payload as SynthesisCompletedPayload);
        break;
      case "benchmark.started":
        setRunState("benchmarking");
        break;
      case "benchmark.completed":
        setBenchmark(event.payload as BenchmarkPayload);
        break;
      case "run.completed":
        setCompletion(event.payload as RunCompletedPayload);
        setRunState("completed");
        break;
      case "run.failed":
        setError(event.error?.message ?? "The run failed. Partial results are preserved.");
        setRunState("failed");
        break;
      default:
        break;
    }
  }

  async function runLive() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    resetRun();
    try {
      await streamRun(
        {
          stimulus_id: dobbsPreset.stimulus_id,
          stimulus_text: stimulusText,
          memory_enabled: memoryEnabled,
          persona_count: personaCount
        },
        handleEvent,
        controller.signal
      );
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(caught instanceof Error ? caught.message : "Stream failed.");
        setRunState("failed");
      }
    }
  }

  async function runMock() {
    abortRef.current?.abort();
    resetRun();
    for (const event of mockEvents) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      handleEvent(event);
    }
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Synthetic voter focus group</p>
          <h1>Directional reaction signal in seconds.</h1>
          <p className="hero-copy">
            Run 20 multi-model personas against the Dobbs preset, stream voter voice cards, synthesize
            segment-level signals, and compare against static benchmark data.
          </p>
        </div>
        <aside className="status-panel">
          <span className={`status-dot ${runState}`} />
          <strong>{progressLabel}</strong>
          <p>{failedPersonas.length} failed persona(s)</p>
          {completion?.weave_url ? (
            <a href={completion.weave_url} target="_blank" rel="noreferrer">
              Open Weave trace
            </a>
          ) : null}
        </aside>
      </section>

      <section className="control-deck">
        <label>
          Event preset
          <select value={dobbsPreset.stimulus_id} disabled>
            <option value={dobbsPreset.stimulus_id}>{dobbsPreset.event_name}</option>
          </select>
        </label>
        <label className="wide">
          Stimulus text
          <textarea value={stimulusText} onChange={(event) => setStimulusText(event.target.value)} />
        </label>
        <label>
          Personas
          <select value={personaCount} onChange={(event) => setPersonaCount(Number(event.target.value))}>
            <option value={3}>3-person smoke</option>
            <option value={20}>20-person demo</option>
          </select>
        </label>
        <label className="toggle">
          <input
            checked={memoryEnabled}
            onChange={(event) => setMemoryEnabled(event.target.checked)}
            type="checkbox"
          />
          Memory {memoryEnabled ? "ON" : "OFF"}
        </label>
        <button disabled={runState !== "idle" && runState !== "completed" && runState !== "failed"} onClick={runLive}>
          Run live
        </button>
        <button className="secondary" onClick={runMock}>
          Replay mock stream
        </button>
      </section>

      {error ? <section className="error-banner">{error}</section> : null}

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Persona stream</p>
          <h2>Voter voice cards</h2>
        </div>
        <div className="persona-grid">
          {deferredPersonas.map((persona) => (
            <PersonaReactionCard key={persona.persona_id} persona={persona} />
          ))}
        </div>
      </section>

      <section className="panel split">
        <div>
          <div className="section-heading">
            <p className="eyebrow">Synthesis</p>
            <h2>Segment signals</h2>
          </div>
          <SentimentBreakdown segments={segments} />
        </div>
        <div>
          <div className="section-heading">
            <p className="eyebrow">Executive readout</p>
            <h2>What moved</h2>
          </div>
          <p className="summary-copy">{synthesis?.executive_summary ?? "Awaiting synthesis output."}</p>
          {synthesis?.best_quotes.map((quote) => (
            <blockquote className="quote-strip" key={`${quote.persona_id}-${quote.quote}`}>
              {quote.quote}
            </blockquote>
          ))}
          <RedFlagAlert redFlags={redFlags} />
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Calibration</p>
          <h2>Benchmark comparison</h2>
        </div>
        <BenchmarkComparison benchmark={benchmark} />
      </section>
    </main>
  );
}

