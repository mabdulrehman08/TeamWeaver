export type Sentiment = "positive" | "neutral" | "negative";

export interface Persona {
  name: string;
  age: number;
  location: string;
  segment: string;
  sentiment: Sentiment;
  reaction: string;
  quote: string;
  education: string;
  income: string;
  party: string;
  issues: string[];
}
