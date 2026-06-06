import { createMockSimulationResponse } from "../mock/mockSimulationResponse";
import type { SimulationEvent } from "../types";

export const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const createEventId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const createEvent = <TEvent extends SimulationEvent>(event: Omit<TEvent, "id" | "timestamp">): TEvent => ({
  ...event,
  id: createEventId(),
  timestamp: new Date().toISOString(),
} as TEvent);

export async function* streamSimulation(stimulus: string): AsyncGenerator<SimulationEvent> {
  const result = createMockSimulationResponse(stimulus);

  yield createEvent({
    type: "agent_started",
    agent: "orchestrator",
    payload: { message: "Simulation swarm initialized" },
  });

  const personaBatch = result.personas.slice(0, 6);
  for (const [index, persona] of personaBatch.entries()) {
    await delay(180);
    yield createEvent({
      type: "persona_completed",
      agent: "persona-simulator",
      payload: { persona, completed: index + 1, total: result.personas.length },
    });
  }

  await delay(220);
  yield createEvent({
    type: "synthesis_completed",
    agent: "synthesis-agent",
    payload: { synthesis: result.synthesis },
  });

  await delay(220);
  yield createEvent({
    type: "benchmark_completed",
    agent: "benchmark-agent",
    payload: { benchmark: result.benchmark },
  });

  await delay(260);
  yield createEvent({
    type: "simulation_finished",
    agent: "orchestrator",
    payload: { result },
  });
}
