import type { SimulationResult } from "../types";
import { mockPersonas } from "./mockPersonas";

export const createMockSimulationResponse = (stimulus: string): SimulationResult => ({
  stimulus,
  personas: mockPersonas,
  synthesis: {
    overallSentiment: "Broadly positive with measurable persuasion among independents, younger voters, and working-class households; resistance concentrates among anti-tax and local-control conservatives.",
    positive: 62,
    neutral: 18,
    negative: 20,
    redFlags: [
      "Fiscal skeptics need a one-sentence funding mechanism before they will share the message.",
      "Rural conservatives interpret broad federal language as local-control risk.",
      "Older voters want explicit reassurance that Medicare, Social Security, and fixed-income budgets are protected.",
      "Claims about implementation should be paired with measurable outcomes to satisfy high-information swing voters.",
    ],
    movedGroups: [
      "Independent suburban parents moved +9 points on trust after household-cost framing.",
      "Manufacturing households moved +7 points when the message mentioned domestic production.",
      "Young renters moved +11 points when affordability was linked to opportunity rather than blame.",
      "Black working-class women moved +8 points on authenticity after kitchen-table examples.",
    ],
    bestQuotes: [
      "This sounds like someone has actually listened to families budgeting every week.",
      "It is refreshing to hear a plan instead of another shouting match.",
      "That part about choosing between gas and groceries is real life.",
    ],
  },
  benchmark: {
    calibrationScore: 78,
    historicalMatch: 84,
    simulatedSupport: 62,
    historicalSupport: 58,
    summary: "The simulated response is within four points of historical support for comparable kitchen-table economic messages among presidential-year persuadable voters.",
  },
});
