import { useState } from "react";
import { streamSimulation } from "../services/eventStream";
import type { SimulationEvent, SimulationResult } from "../types";

export function useAgentEventStream() {
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  const resetEvents = () => setEvents([]);

  const consumeSimulationStream = async (stimulus: string, onFinished: (result: SimulationResult) => void) => {
    for await (const event of streamSimulation(stimulus)) {
      setEvents((current) => [...current, event]);
      if (event.type === "simulation_finished") {
        onFinished(event.payload.result);
      }
    }
  };

  return { events, resetEvents, consumeSimulationStream };
}
