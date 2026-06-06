export type Sentiment = "positive" | "neutral" | "negative";

export interface Persona {
  name: string;
  age: number;
  location: string;
  segment: string;
  sentiment: Sentiment;
  reaction: string;
  quote: string;
  education: string;
  income: string;
  party: string;
  issues: string[];
}

export interface Synthesis {
  overallSentiment: string;
  positive: number;
  neutral: number;
  negative: number;
  redFlags: string[];
  movedGroups: string[];
  bestQuotes: string[];
}

export interface Benchmark {
  calibrationScore: number;
  historicalMatch: number;
  summary: string;
  simulatedSupport: number;
  historicalSupport: number;
}

export interface SimulationResult {
  stimulus: string;
  personas: Persona[];
  synthesis: Synthesis;
  benchmark: Benchmark;
}

export type AgentEventType =
  | "agent_started"
  | "persona_completed"
  | "synthesis_completed"
  | "benchmark_completed"
  | "simulation_finished";

export interface AgentEventBase<TType extends AgentEventType, TPayload> {
  id: string;
  type: TType;
  agent: string;
  timestamp: string;
  payload: TPayload;
}

export type SimulationEvent =
  | AgentEventBase<"agent_started", { message: string }>
  | AgentEventBase<"persona_completed", { persona: Persona; completed: number; total: number }>
  | AgentEventBase<"synthesis_completed", { synthesis: Synthesis }>
  | AgentEventBase<"benchmark_completed", { benchmark: Benchmark }>
  | AgentEventBase<"simulation_finished", { result: SimulationResult }>;

export interface ComparisonSegment {
  segment: string;
  messageA: number;
  messageB: number;
  delta: number;
}

export interface ComparisonResult {
  messageA: string;
  messageB: string;
  improvedSegments: ComparisonSegment[];
  worsenedSegments: ComparisonSegment[];
  aggregate: {
    messageA: number;
    messageB: number;
  };
}
