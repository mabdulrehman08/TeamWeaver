# CopilotKit Readiness

## What works now

- The app is wrapped with `CopilotKit` in `src/app/providers.tsx`.
- The Copilot sidebar is mounted through `CopilotSidebar` with the campaign-specific title, intro, and input placeholder.
- The dashboard registers a `showPersonaDetails` Copilot action through `useSimulationCopilotActions`.
- The action renders the reusable `PersonaDetails` component as generative UI.
- The current simulation result is exposed to Copilot as readable context.
- The local CopilotKit UI stub renders the registered persona details action in the sidebar, so the demo can show a generative UI card without a backend.

## How to verify locally

Run:

```bash
npm run smoke:copilot
```

Expected result: every check prints with a green checkmark and the command exits successfully.

## Important limitation

The current repo uses local vendor stubs for `@copilotkit/react-core` and `@copilotkit/react-ui`. That means the sidebar and generative UI action are wired for the frontend demo, but it is not yet connected to a real CopilotKit runtime or LLM chat backend.

## Next step for real CopilotKit integration

- Replace the local vendor stub dependencies with official CopilotKit packages.
- Point `CopilotKit runtimeUrl` at the real runtime endpoint.
- Keep the existing `showPersonaDetails` action contract unless the backend response schema changes.
