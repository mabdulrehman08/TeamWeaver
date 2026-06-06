import { useEffect, useState } from "react";
import { messagePresets } from "../lib/constants";
import { runComparison } from "../services/comparisonService";
import type { ComparisonResult } from "../types";

export function useComparison() {
  const [messageA, setMessageA] = useState(messagePresets["Student Debt Relief"]);
  const [messageB, setMessageB] = useState(messagePresets["Healthcare Expansion"]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const compare = async () => {
    setIsComparing(true);
    const result = await runComparison(messageA, messageB);
    setComparison(result);
    setIsComparing(false);
  };

  useEffect(() => {
    void compare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    comparison,
    isComparing,
    messageA,
    messageB,
    onCompare: compare,
    onMessageAChange: setMessageA,
    onMessageBChange: setMessageB,
  };
}
