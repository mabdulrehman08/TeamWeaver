import { createMockComparison } from "../mock/mockComparisonResponse";
import type { ComparisonResult } from "../types";
import { delay } from "./eventStream";

export async function runComparison(messageA: string, messageB: string): Promise<ComparisonResult> {
  await delay(1200);
  return createMockComparison(messageA, messageB);
}
