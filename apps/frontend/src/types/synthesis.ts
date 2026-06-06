export interface Synthesis {
  overallSentiment: string;
  positive: number;
  neutral: number;
  negative: number;
  redFlags: string[];
  movedGroups: string[];
  bestQuotes: string[];
}
