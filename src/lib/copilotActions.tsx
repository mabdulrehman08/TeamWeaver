import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import PersonaDetails from "../components/persona/PersonaDetails";
import type { Persona, SimulationResult } from "../types";

export function useSimulationCopilotActions(result: SimulationResult | null) {
  useCopilotReadable({ description: "Current campaign simulation result", value: result });
  useCopilotAction<{ persona: Persona }>({
    name: "showPersonaDetails",
    description: "Render a detailed voter persona card for a persona selected from the simulation.",
    parameters: [
      { name: "persona", type: "object", description: "The persona to inspect in detail", required: true },
    ],
    render: ({ args }: { args: { persona: Persona } }) => args?.persona ? <PersonaDetails persona={args.persona} /> : <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">Select a persona to inspect.</div>,
    handler: async ({ persona }: { persona: Persona }) => ({ persona }),
  });
}
