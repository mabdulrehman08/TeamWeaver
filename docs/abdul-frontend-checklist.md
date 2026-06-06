# Abdul Frontend Checklist

This checklist maps Abdul's CopilotKit frontend responsibilities to the current implementation.

## Already covered

- Stimulus input UI with preset options is implemented in the dashboard.
- Persona reaction cards are implemented as reusable persona components.
- Sentiment breakdown is implemented with Recharts and reusable metric cards.
- Benchmark comparison view is implemented with Recharts and mock benchmark data.
- Compare Messages UI is implemented with message A/B inputs, aggregate comparison, and segment delta cards.
- Mock AG-UI-style event streaming is implemented with typed simulation events.
- CopilotKit provider, sidebar, and `showPersonaDetails` generative UI action are wired in the frontend.

## Frontend work remaining before backend integration

- Replace the local CopilotKit vendor stubs with official CopilotKit packages when package registry access is available.
- Agree with the backend team on the final response schema before wiring the real endpoint.
- Add the backend AG-UI endpoint URL to the provider/service configuration once the backend exists.
- Map the real backend event names and payloads to the existing `SimulationEvent` type or update the type contract if the backend differs.
- Extend the persona frontend model if Dev/Aj add weighted fields such as race or ethnicity, occupation, industry, media diet, institutional trust, personal stake, model label, and memory toggle state.
- Add UI affordances for memory toggle and model label display once those backend fields are available.
- Add the Dobbs preset and benchmark copy/data when the demo path is ready to be hardcoded.
- Verify that 20 streamed persona cards render smoothly once the backend emits all demo personas.

## Current frontend contract

The frontend currently expects a `SimulationResult` with `stimulus`, `personas`, `synthesis`, and `benchmark`, plus streamed `SimulationEvent` updates for agent start, persona completion, synthesis completion, benchmark completion, and simulation finish.
