import type { ComparisonResult } from "../types";

export const createMockComparison = (messageA: string, messageB: string): ComparisonResult => ({
  messageA,
  messageB,
  aggregate: {
    messageA: 58,
    messageB: 64,
  },
  improvedSegments: [
    { segment: "Young renters", messageA: 54, messageB: 68, delta: 14 },
    { segment: "Suburban parents", messageA: 59, messageB: 69, delta: 10 },
    { segment: "Manufacturing households", messageA: 57, messageB: 65, delta: 8 },
    { segment: "Black working-class women", messageA: 63, messageB: 71, delta: 8 },
  ],
  worsenedSegments: [
    { segment: "Rural conservatives", messageA: 36, messageB: 31, delta: -5 },
    { segment: "Retired fiscal conservatives", messageA: 44, messageB: 40, delta: -4 },
    { segment: "Libertarian contractors", messageA: 39, messageB: 34, delta: -5 },
  ],
});
