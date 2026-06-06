export type RunState =
  | "idle"
  | "starting"
  | "streaming_personas"
  | "synthesizing"
  | "benchmarking"
  | "completed"
  | "failed";

export type EventEnvelope<TPayload = Record<string, unknown>> = {
  event_type: string;
  run_id: string;
  sequence: number;
  timestamp: string;
  payload: TPayload;
  trace_id?: string;
  weave_url?: string | null;
  error?: {
    error_code: string;
    message: string;
  };
};

export type PersonaReactionPayload = {
  persona_id: string;
  persona_name: string;
  age: number;
  location: string;
  occupation: string;
  segment_tags: string[];
  provider: string;
  model_used: string;
  reaction_text: string;
  voter_voice_quote: string;
  latency_ms: number;
  memory_warning?: string;
};

export type PersonaFailedPayload = {
  persona_id: string;
  persona_name: string;
  provider: string;
  model_used: string;
  error_code: string;
  message: string;
};

export type SynthesisSegmentPayload = {
  segment_id: string;
  segment_name: string;
  sentiment_direction: string;
  movement_signal: string;
  persona_count: number;
  summary: string;
};

export type RedFlagPayload = {
  segment: string;
  flag_description: string;
  affected_personas: string[];
  severity: "low" | "medium" | "high";
};

export type SynthesisCompletedPayload = {
  overall_sentiment: string;
  executive_summary: string;
  best_quotes: Array<{
    persona_id: string;
    quote: string;
  }>;
};

export type BenchmarkPayload = {
  event_name: string;
  calibration_score: number;
  score_label: string;
  simulated_distribution: Array<{
    segment: string;
    simulated: string;
  }>;
  actual_polling_data: Array<{
    segment: string;
    actual: string;
    source_label: string;
  }>;
  interpretation: string;
};

export type RunCompletedPayload = {
  run_id: string;
  stimulus_id: string;
  completed_personas: number;
  failed_personas: number;
  memory_enabled: boolean;
  total_latency_ms: number;
  weave_url?: string | null;
};

export const mockEvents: EventEnvelope[] = [
  {
    event_type: "run.started",
    run_id: "run:mock:dobbs_2022",
    sequence: 1,
    timestamp: "2026-06-06T20:45:12Z",
    payload: {
      stimulus_id: "dobbs_2022",
      event_name: "Dobbs v. Jackson, June 2022",
      memory_enabled: false,
      persona_count: 3
    }
  },
  {
    event_type: "persona_reaction.completed",
    run_id: "run:mock:dobbs_2022",
    sequence: 2,
    timestamp: "2026-06-06T20:45:14Z",
    payload: {
      persona_id: "maria_milwaukee",
      persona_name: "Maria",
      age: 52,
      location: "Suburban Milwaukee, WI",
      occupation: "Union electrician",
      segment_tags: ["suburban_women", "working_class"],
      provider: "anthropic",
      model_used: "claude-haiku-4-5-20251001",
      reaction_text:
        "I am furious. This feels like politicians decided my daughter's future for her, and I do not trust my state legislature to protect women.",
      voter_voice_quote: "I never thought my daughter would grow up with fewer rights than I had.",
      latency_ms: 1320
    }
  },
  {
    event_type: "synthesis.started",
    run_id: "run:mock:dobbs_2022",
    sequence: 3,
    timestamp: "2026-06-06T20:45:18Z",
    payload: { completed_personas: 3, failed_personas: 0 }
  },
  {
    event_type: "synthesis.segment_completed",
    run_id: "run:mock:dobbs_2022",
    sequence: 4,
    timestamp: "2026-06-06T20:45:19Z",
    payload: {
      segment_id: "suburban_women",
      segment_name: "Suburban women",
      sentiment_direction: "strongly_negative",
      movement_signal: "high_activation",
      persona_count: 2,
      summary: "Strong emotional opposition, especially among mothers and college-educated moderates."
    }
  },
  {
    event_type: "synthesis.red_flag_detected",
    run_id: "run:mock:dobbs_2022",
    sequence: 5,
    timestamp: "2026-06-06T20:45:20Z",
    payload: {
      segment: "Moderate Republican women in suburban districts",
      flag_description: "Unexpectedly negative reaction among right-leaning suburban women.",
      affected_personas: ["maria_milwaukee"],
      severity: "high"
    }
  },
  {
    event_type: "synthesis.completed",
    run_id: "run:mock:dobbs_2022",
    sequence: 6,
    timestamp: "2026-06-06T20:45:21Z",
    payload: {
      overall_sentiment: "negative_majority",
      executive_summary:
        "The strongest negative reaction is concentrated among women, especially younger women and suburban moderates.",
      best_quotes: [
        {
          persona_id: "maria_milwaukee",
          quote: "I never thought my daughter would grow up with fewer rights than I had."
        }
      ]
    }
  },
  {
    event_type: "benchmark.started",
    run_id: "run:mock:dobbs_2022",
    sequence: 7,
    timestamp: "2026-06-06T20:45:22Z",
    payload: { benchmark_id: "dobbs_2022" }
  },
  {
    event_type: "benchmark.completed",
    run_id: "run:mock:dobbs_2022",
    sequence: 8,
    timestamp: "2026-06-06T20:45:23Z",
    payload: {
      event_name: "Dobbs v. Jackson, June 2022",
      calibration_score: 87,
      score_label: "Directional accuracy",
      simulated_distribution: [{ segment: "Women overall", simulated: "Strongly negative" }],
      actual_polling_data: [
        {
          segment: "Women overall",
          actual: "47% of women strongly disapproved",
          source_label: "Gallup/Pew June-July 2022"
        }
      ],
      interpretation:
        "The system matched the broad direction of segment-level reactions without claiming to replace polling."
    }
  },
  {
    event_type: "run.completed",
    run_id: "run:mock:dobbs_2022",
    sequence: 9,
    timestamp: "2026-06-06T20:45:24Z",
    payload: {
      run_id: "run:mock:dobbs_2022",
      stimulus_id: "dobbs_2022",
      completed_personas: 3,
      failed_personas: 0,
      memory_enabled: false,
      total_latency_ms: 12000,
      weave_url: "https://wandb.ai/campaign-persona-agent"
    }
  }
];

