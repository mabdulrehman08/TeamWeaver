import { createMockSimulationResponse } from "../mock/mockSimulationResponse";
import type { SimulationResult } from "../types";
import { delay, streamSimulation } from "./eventStream";

export async function runSimulation(stimulus: string): Promise<SimulationResult> {
  await delay(1500);
  return createMockSimulationResponse(stimulus);
}

export { streamSimulation };

export type SimulationService = {
  runSimulation: typeof runSimulation;
  streamSimulation: typeof streamSimulation;
};
