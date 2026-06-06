import type { EventEnvelope } from "./agui";

export type RunRequest = {
  stimulus_id: string;
  stimulus_text: string;
  memory_enabled: boolean;
  persona_count: number;
};

export async function streamRun(
  request: RunRequest,
  onEvent: (event: EventEnvelope) => void,
  signal?: AbortSignal
) {
  const response = await fetch("/api/runs", {
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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const event = parseSseBlock(part);
      if (event) onEvent(event);
    }
  }

  const tail = parseSseBlock(buffer);
  if (tail) onEvent(tail);
}

function parseSseBlock(block: string): EventEnvelope | null {
  const dataLine = block
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("data:"));

  if (!dataLine) return null;
  const jsonText = dataLine.slice("data:".length).trim();
  return JSON.parse(jsonText) as EventEnvelope;
}

