import { useEffect, useMemo, useState } from "react";
import { loadingMessages } from "../lib/constants";
import type { SimulationResult } from "../types";
import { useAgentEventStream } from "./useAgentEventStream";

export function useSimulation() {
  const [stimulus, setStimulus] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const { events, resetEvents, consumeSimulationStream } = useAgentEventStream();

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
    resetEvents();
    setMessageIndex(0);
    setIsLoading(true);
    await consumeSimulationStream(stimulus, setResult);
    setIsLoading(false);
  };

  return {
    currentLoadingMessage: loadingMessages[messageIndex],
    events,
    isLoading,
    result,
    run,
    sentimentBreakdown,
    setStimulus,
    stimulus,
  };
}
