# Frontend Backend Contract

This document is the working seam between the frontend and backend for async development.

The core rule:

```text
The frontend sends run requests and renders structured events.
The backend owns all agent execution and emits structured events.
The backend never sends HTML.
The frontend never calls model providers directly.
```

## 1. Ownership

### Frontend Owns

* Stimulus preset selector.
* Dobbs preset UI.
* Stimulus text input/display.
* Memory toggle.
* Run button and disabled/loading states.
* Streaming client.
* Persona reaction grid.
* Synthesis breakdown UI.
* Red flag alert UI.
* Benchmark comparison UI.
* Optional Weave trace link display.
* Mock event playback for local UI development.

### Backend Owns

* Environment loading and validation.
* Provider health checks.
* Redis Agent Memory health checks.
* Weave initialization.
* Persona loading.
* Prompt construction.
* Parallel persona fan-out.
* Provider fallback.
* Synthesis agent execution.
* Benchmark agent execution.
* Structured event streaming.
* Safe run failure handling.
* Local JSON fallback for personas.
* Basic smoke test scripts.

## 2. Transport

Initial implementation should use a single streaming endpoint:

```text
POST /api/runs
```

The response should be a stream of JSON event envelopes.

Preferred transport:

```text
text/event-stream
```

If using Server-Sent Events, each event should send one JSON envelope:

```text
event: persona_reaction.completed
data: {"event_type":"persona_reaction.completed","run_id":"run:...","sequence":7,"timestamp":"2026-06-06T20:45:19Z","payload":{}}
```

Frontend requirement:

* Parse every streamed `data` payload as one event envelope.
* Treat event arrival as incremental UI updates.
* Do not wait for `run.completed` before rendering persona cards.

Backend requirement:

* Flush events as they are available.
* Send monotonically increasing `sequence` values within a run.
* Keep payloads JSON-serializable.
* Never include secret values in event payloads or errors.

## 3. Run Request

Endpoint:

```text
POST /api/runs
```

Request body:

```json
{
  "stimulus_id": "dobbs_2022",
  "stimulus_text": "The Supreme Court has overturned Roe v. Wade in the Dobbs v. Jackson decision, ending the constitutional right to abortion and returning the matter to states.",
  "memory_enabled": false,
  "persona_count": 20
}
```

Field rules:

* `stimulus_id` is required.
* `stimulus_text` is required.
* `memory_enabled` is required.
* `persona_count` is optional; default is `20`.
* For the demo, the frontend should send `persona_count: 20`.
* For local UI testing, the frontend may send `persona_count: 3`.

Supported stimulus IDs for first pass:

```text
dobbs_2022
```

## 4. Event Envelope

Every streamed backend event must use this envelope:

```json
{
  "event_type": "persona_reaction.completed",
  "run_id": "run:dobbs_2022:2026-06-06T20-45-12Z",
  "sequence": 7,
  "timestamp": "2026-06-06T20:45:19Z",
  "payload": {}
}
```

Required fields:

* `event_type`
* `run_id`
* `sequence`
* `timestamp`
* `payload`

Optional fields:

* `trace_id`
* `weave_url`
* `error`

Envelope rules:

* `event_type` must be one of the event types in section 5.
* `run_id` must be stable for the full run.
* `sequence` starts at `1` and increments by `1` for every event in a run.
* `timestamp` must be an ISO 8601 UTC timestamp.
* `payload` must always be an object, even when empty.
* `error` must be safe for display and must not include secrets, raw provider responses, or stack traces.

## 5. Event Types and Order

Expected event order:

```text
run.started
persona_reaction.completed
persona_reaction.failed
synthesis.started
synthesis.segment_completed
synthesis.red_flag_detected
synthesis.completed
benchmark.started
benchmark.completed
run.completed
run.failed
```

Ordering rules:

* `run.started` is always first.
* `persona_reaction.completed` events arrive as personas finish and may be in any persona order.
* `persona_reaction.failed` is optional and should be emitted only when useful for UI status/debugging.
* `synthesis.started` starts after persona fan-out finishes or reaches the minimum viable completion threshold.
* `synthesis.segment_completed` may be emitted one or more times.
* `synthesis.red_flag_detected` is optional.
* `synthesis.completed` is emitted once.
* `benchmark.started` is emitted once.
* `benchmark.completed` is emitted once.
* `run.completed` is the final success event.
* `run.failed` is the final failure event.

Completion threshold:

* Continue the run if at least `15` of `20` personas complete.
* If fewer than `15` personas complete, emit `run.failed`.
* If `15` to `19` personas complete, continue and include failure counts in `run.completed`.

## 6. Payload Schemas

### 6.1 `run.started`

Frontend use:

* Reset run state.
* Clear previous cards/results.
* Show streaming progress.

Payload:

```json
{
  "stimulus_id": "dobbs_2022",
  "event_name": "Dobbs v. Jackson, June 2022",
  "memory_enabled": false,
  "persona_count": 20
}
```

### 6.2 `persona_reaction.completed`

Frontend component:

```text
PersonaReactionCard
```

Payload:

```json
{
  "persona_id": "maria_milwaukee",
  "persona_name": "Maria",
  "age": 52,
  "location": "Suburban Milwaukee, WI",
  "occupation": "Union electrician",
  "segment_tags": [
    "suburban_women",
    "working_class",
    "union_household"
  ],
  "provider": "anthropic",
  "model_used": "claude-sonnet",
  "reaction_text": "I am furious. This feels like politicians decided my daughter's future for her, and I do not trust my state legislature to protect women.",
  "voter_voice_quote": "I never thought my daughter would grow up with fewer rights than I had.",
  "latency_ms": 1320
}
```

Field rules:

* `reaction_text` should be 2 to 4 sentences.
* `voter_voice_quote` should be one short first-person sentence.
* `model_used` should be display-safe.
* `provider` should be one of `openai`, `anthropic`, `gemini`, `openrouter`, or `fallback`.
* The frontend should render cards as events arrive.

### 6.3 `persona_reaction.failed`

Frontend use:

* Increment failure count.
* Optionally show compact warning after enough failures.

Payload:

```json
{
  "persona_id": "maria_milwaukee",
  "persona_name": "Maria",
  "provider": "anthropic",
  "model_used": "claude-sonnet",
  "error_code": "provider_timeout",
  "message": "Persona response timed out and was omitted from synthesis."
}
```

Field rules:

* `message` must be safe for display.
* Do not include provider API keys, raw request bodies, raw stack traces, or full provider error payloads.

### 6.4 `synthesis.started`

Frontend use:

* Show synthesis loading state.

Payload:

```json
{
  "completed_personas": 19,
  "failed_personas": 1
}
```

### 6.5 `synthesis.segment_completed`

Frontend component:

```text
SentimentBreakdown
```

Payload:

```json
{
  "segment_id": "suburban_women",
  "segment_name": "Suburban women",
  "sentiment_direction": "strongly_negative",
  "movement_signal": "high_activation",
  "persona_count": 4,
  "summary": "Strong emotional opposition, especially among mothers and college-educated moderates."
}
```

Allowed `sentiment_direction` values:

```text
strongly_negative
negative
mixed
neutral
positive
strongly_positive
```

Allowed `movement_signal` values:

```text
low_salience
persuasion_risk
persuasion_opportunity
high_activation
base_reinforcement
unclear
```

### 6.6 `synthesis.red_flag_detected`

Frontend component:

```text
RedFlagAlert
```

Payload:

```json
{
  "segment": "Moderate Republican women in suburban districts",
  "flag_description": "Unexpectedly negative reaction despite Republican affiliation; possible persuasion vulnerability.",
  "affected_personas": [
    "maria_milwaukee",
    "linda_phoenix"
  ],
  "severity": "high"
}
```

Allowed `severity` values:

```text
low
medium
high
```

### 6.7 `synthesis.completed`

Frontend use:

* Finalize synthesis section.
* Render executive summary and best quotes.

Payload:

```json
{
  "overall_sentiment": "negative_majority",
  "executive_summary": "The strongest negative reaction is concentrated among women, especially younger women and suburban moderates. Rural conservative men are more supportive.",
  "best_quotes": [
    {
      "persona_id": "maria_milwaukee",
      "quote": "I never thought my daughter would grow up with fewer rights than I had."
    }
  ]
}
```

### 6.8 `benchmark.started`

Frontend use:

* Show benchmark loading state.

Payload:

```json
{
  "benchmark_id": "dobbs_2022"
}
```

### 6.9 `benchmark.completed`

Frontend component:

```text
BenchmarkComparison
```

Payload:

```json
{
  "event_name": "Dobbs v. Jackson, June 2022",
  "calibration_score": 87,
  "score_label": "Directional accuracy",
  "simulated_distribution": [
    {
      "segment": "Women overall",
      "simulated": "Strongly negative"
    }
  ],
  "actual_polling_data": [
    {
      "segment": "Women overall",
      "actual": "47% of women strongly disapproved",
      "source_label": "Gallup/Pew June-July 2022"
    }
  ],
  "interpretation": "The system matched the broad direction of segment-level reactions without claiming to replace polling."
}
```

Field rules:

* `calibration_score` is an integer from `0` to `100`.
* `score_label` should use directional language, not statistical certainty.
* `actual_polling_data` comes from hardcoded benchmark data, not live polling fetches.

### 6.10 `run.completed`

Frontend use:

* Stop loading state.
* Show final status.
* Render Weave link if present.

Payload:

```json
{
  "run_id": "run:dobbs_2022:2026-06-06T20-45-12Z",
  "stimulus_id": "dobbs_2022",
  "completed_personas": 19,
  "failed_personas": 1,
  "memory_enabled": false,
  "total_latency_ms": 14200,
  "weave_url": "https://..."
}
```

### 6.11 `run.failed`

Frontend use:

* Stop loading state.
* Show compact error state.
* Preserve partial successful persona cards if any were emitted.

Payload:

```json
{
  "run_id": "run:dobbs_2022:2026-06-06T20-45-12Z",
  "stimulus_id": "dobbs_2022",
  "completed_personas": 11,
  "failed_personas": 9,
  "error_code": "insufficient_persona_completions",
  "message": "Only 11 of 20 personas completed, below the minimum threshold of 15."
}
```

## 7. Frontend State Machine

Minimum frontend states:

```text
idle
starting
streaming_personas
synthesizing
benchmarking
completed
failed
```

Recommended transitions:

* `idle` to `starting` when the user clicks Run.
* `starting` to `streaming_personas` on `run.started`.
* Stay in `streaming_personas` while receiving `persona_reaction.completed` and `persona_reaction.failed`.
* Move to `synthesizing` on `synthesis.started`.
* Move to `benchmarking` on `benchmark.started`.
* Move to `completed` on `run.completed`.
* Move to `failed` on `run.failed` or stream/network failure.

Frontend should keep partial results visible after a failure.

## 8. Backend Failure Behavior

Provider failures:

* Log provider failures server-side.
* Emit `persona_reaction.failed` only when useful.
* Reassign failed providers according to fallback rules.
* Do not crash the whole run for one failed LLM call.

Run failure:

* If fewer than 15 of 20 personas complete, emit `run.failed`.
* If at least 15 personas complete, proceed to synthesis and benchmark.

Redis failure:

* Memory OFF must not read or write Redis Agent Memory.
* Memory ON should try Redis retrieval/writeback.
* Redis failure should not crash the run.
* Emit safe warning metadata only if frontend needs to show it.

Weave failure:

* Weave failure should not crash the run.
* If no `weave_url` is available, omit it or set it to `null`.

## 9. Memory Toggle Contract

When `memory_enabled` is `false`:

* Backend must not retrieve prior persona reaction history.
* Backend must not include prior reactions in persona prompts.
* Backend must not write new reactions to Redis Agent Memory.
* Frontend should label this as a clean first-run simulation.

When `memory_enabled` is `true`:

* Backend retrieves persona profile.
* Backend retrieves prior reaction history.
* Backend includes prior reactions in persona context.
* Backend writes each completed reaction back to Redis Agent Memory.
* Frontend should label this as memory-enabled campaign continuity.

## 10. Mock Stream for Frontend Development

Frontend can develop before the backend is complete by replaying these mock events.

Minimum happy path:

```json
[
  {
    "event_type": "run.started",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 1,
    "timestamp": "2026-06-06T20:45:12Z",
    "payload": {
      "stimulus_id": "dobbs_2022",
      "event_name": "Dobbs v. Jackson, June 2022",
      "memory_enabled": false,
      "persona_count": 3
    }
  },
  {
    "event_type": "persona_reaction.completed",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 2,
    "timestamp": "2026-06-06T20:45:14Z",
    "payload": {
      "persona_id": "maria_milwaukee",
      "persona_name": "Maria",
      "age": 52,
      "location": "Suburban Milwaukee, WI",
      "occupation": "Union electrician",
      "segment_tags": [
        "suburban_women",
        "working_class"
      ],
      "provider": "anthropic",
      "model_used": "claude-sonnet",
      "reaction_text": "I am furious. This feels like politicians decided my daughter's future for her, and I do not trust my state legislature to protect women.",
      "voter_voice_quote": "I never thought my daughter would grow up with fewer rights than I had.",
      "latency_ms": 1320
    }
  },
  {
    "event_type": "synthesis.started",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 3,
    "timestamp": "2026-06-06T20:45:18Z",
    "payload": {
      "completed_personas": 3,
      "failed_personas": 0
    }
  },
  {
    "event_type": "synthesis.segment_completed",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 4,
    "timestamp": "2026-06-06T20:45:19Z",
    "payload": {
      "segment_id": "suburban_women",
      "segment_name": "Suburban women",
      "sentiment_direction": "strongly_negative",
      "movement_signal": "high_activation",
      "persona_count": 2,
      "summary": "Strong emotional opposition, especially among mothers and college-educated moderates."
    }
  },
  {
    "event_type": "synthesis.red_flag_detected",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 5,
    "timestamp": "2026-06-06T20:45:20Z",
    "payload": {
      "segment": "Moderate Republican women in suburban districts",
      "flag_description": "Unexpectedly negative reaction despite Republican affiliation; possible persuasion vulnerability.",
      "affected_personas": [
        "maria_milwaukee"
      ],
      "severity": "high"
    }
  },
  {
    "event_type": "synthesis.completed",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 6,
    "timestamp": "2026-06-06T20:45:21Z",
    "payload": {
      "overall_sentiment": "negative_majority",
      "executive_summary": "The strongest negative reaction is concentrated among women, especially younger women and suburban moderates.",
      "best_quotes": [
        {
          "persona_id": "maria_milwaukee",
          "quote": "I never thought my daughter would grow up with fewer rights than I had."
        }
      ]
    }
  },
  {
    "event_type": "benchmark.started",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 7,
    "timestamp": "2026-06-06T20:45:22Z",
    "payload": {
      "benchmark_id": "dobbs_2022"
    }
  },
  {
    "event_type": "benchmark.completed",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 8,
    "timestamp": "2026-06-06T20:45:23Z",
    "payload": {
      "event_name": "Dobbs v. Jackson, June 2022",
      "calibration_score": 87,
      "score_label": "Directional accuracy",
      "simulated_distribution": [
        {
          "segment": "Women overall",
          "simulated": "Strongly negative"
        }
      ],
      "actual_polling_data": [
        {
          "segment": "Women overall",
          "actual": "47% of women strongly disapproved",
          "source_label": "Gallup/Pew June-July 2022"
        }
      ],
      "interpretation": "The system matched the broad direction of segment-level reactions without claiming to replace polling."
    }
  },
  {
    "event_type": "run.completed",
    "run_id": "run:mock:dobbs_2022",
    "sequence": 9,
    "timestamp": "2026-06-06T20:45:24Z",
    "payload": {
      "run_id": "run:mock:dobbs_2022",
      "stimulus_id": "dobbs_2022",
      "completed_personas": 3,
      "failed_personas": 0,
      "memory_enabled": false,
      "total_latency_ms": 12000,
      "weave_url": "https://wandb.ai/andrew2115-minerva-university/campaign-persona-agent"
    }
  }
]
```

## 11. Compatibility Rules

To keep async work unblocked:

* Backend may add optional fields to payloads without breaking frontend.
* Backend must not remove or rename required fields without updating this document.
* Frontend must ignore unknown fields.
* Frontend must handle missing optional fields.
* Frontend must not assume all personas succeed.
* Frontend must not assume persona events arrive in persona list order.
* Backend must keep `event_type` strings stable.
* Backend must keep enum values stable after frontend work starts.

## 12. Definition of Done

Backend side is contract-ready when:

* `POST /api/runs` accepts the request body in section 3.
* The endpoint streams event envelopes in the shape from section 4.
* A 3-persona smoke run emits the happy-path event sequence.
* Errors are safe and secret-free.

Frontend side is contract-ready when:

* The UI can replay the mock stream from section 10.
* The UI can render each component from the mapped event types.
* The UI can handle a failed persona without crashing.
* The UI can handle `run.failed` while preserving partial results.
