import type { Benchmark } from "./benchmark";
import type { Persona } from "./persona";
import type { Synthesis } from "./synthesis";

export interface SimulationResult {
  stimulus: string;
  personas: Persona[];
  synthesis: Synthesis;
  benchmark: Benchmark;
}
