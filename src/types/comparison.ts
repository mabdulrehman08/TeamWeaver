export interface ComparisonSegment {
  segment: string;
  messageA: number;
  messageB: number;
  delta: number;
}

export interface ComparisonResult {
  messageA: string;
  messageB: string;
  improvedSegments: ComparisonSegment[];
  worsenedSegments: ComparisonSegment[];
  aggregate: {
    messageA: number;
    messageB: number;
  };
}
