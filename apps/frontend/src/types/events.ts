import type { Benchmark } from "./benchmark";
import type { Persona } from "./persona";
import type { SimulationResult } from "./simulation";
import type { Synthesis } from "./synthesis";

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
