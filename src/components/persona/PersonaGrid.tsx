import type { Persona } from "../../types";
import PersonaCard from "./PersonaCard";

interface PersonaGridProps {
  personas: Persona[];
}

export function PersonaGrid({ personas }: PersonaGridProps) {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {personas.map((persona) => <PersonaCard key={persona.name} persona={persona} />)}
    </div>
  );
}

export default PersonaGrid;
