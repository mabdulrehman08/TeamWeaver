import { createMockSimulationEvents } from "../data/mockSimulation";
import type { EventEnvelope } from "../lib/agui";

export type SimulationRequest = {
  stimulus_id: string;
  stimulus_text: string;
  memory_enabled: boolean;
  persona_count: number;
};

export type SimulationEventHandlers = {
  onEvent: (event: EventEnvelope) => void;
  onError?: (error: Error) => void;
  onDone?: () => void;
};

export type SimulationOptions = {
  useMockSimulation?: boolean;
};

export async function startSimulation(
  request: SimulationRequest,
  handlers: SimulationEventHandlers,
  signal?: AbortSignal,
  options: SimulationOptions = {}
) {
  const useMockSimulation = options.useMockSimulation ?? import.meta.env.VITE_USE_MOCK_SIMULATION === "true";

  if (useMockSimulation) {
    await runMockSimulation(request, handlers, signal);
    return;
  }

  await streamLiveSimulation(request, handlers, signal);
}

export async function subscribeToSimulationEvents(
  request: SimulationRequest,
  handlers: SimulationEventHandlers,
  signal?: AbortSignal,
  options?: SimulationOptions
) {
  await startSimulation(request, handlers, signal, options);
}

export async function runMockSimulation(
  request: SimulationRequest,
  handlers: SimulationEventHandlers,
  signal?: AbortSignal
) {
  const events = createMockSimulationEvents(request.persona_count, request.memory_enabled);

  try {
    for (const event of events) {
      if (signal?.aborted) return;
      const delayMs = event.event_type === "persona_reaction.completed" ? 260 : 380;
      await wait(delayMs, signal);
      if (signal?.aborted) return;
      handlers.onEvent(event);
    }
    handlers.onDone?.();
  } catch (error) {
    if (!signal?.aborted) {
      handlers.onError?.(error instanceof Error ? error : new Error("Mock simulation failed."));
    }
  }
}

async function streamLiveSimulation(
  request: SimulationRequest,
  handlers: SimulationEventHandlers,
  signal?: AbortSignal
) {
  const apiUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
  const response = await fetch(`${apiUrl}/api/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify(request),
    signal
  });

  if (!response.ok || !response.body) {
    throw new Error(`Run request failed with HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";
      for (const block of blocks) {
        const event = parseSseBlock(block);
        if (event) handlers.onEvent(event);
      }
    }

    const tail = parseSseBlock(buffer);
    if (tail) handlers.onEvent(tail);
    handlers.onDone?.();
  } catch (error) {
    if (!signal?.aborted) {
      handlers.onError?.(error instanceof Error ? error : new Error("Live simulation stream failed."));
    }
  }
}

function parseSseBlock(block: string): EventEnvelope | null {
  const dataLines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trim());

  if (dataLines.length === 0) return null;
  return JSON.parse(dataLines.join("\n")) as EventEnvelope;
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Simulation aborted.", "AbortError"));
      },
      { once: true }
    );
  });
}
