import type { RunState } from "../lib/agui";

type Props = {
  stimulusText: string;
  memoryEnabled: boolean;
  personaCount: number;
  runState: RunState;
  useMockMode: boolean;
  onStimulusTextChange: (value: string) => void;
  onMemoryEnabledChange: (value: boolean) => void;
  onPersonaCountChange: (value: number) => void;
  onRun: () => void;
  onUseMockModeChange: (value: boolean) => void;
};

export function SimulationControls({
  stimulusText,
  memoryEnabled,
  personaCount,
  runState,
  useMockMode,
  onStimulusTextChange,
  onMemoryEnabledChange,
  onPersonaCountChange,
  onRun,
  onUseMockModeChange
}: Props) {
  const isRunning = !["idle", "completed", "failed"].includes(runState);

  return (
    <section className="control-deck">
      <label>
        Event preset
        <select value="dobbs_2022" disabled>
          <option value="dobbs_2022">Dobbs v. Jackson, June 2022</option>
        </select>
      </label>
      <label className="wide">
        Stimulus text
        <textarea value={stimulusText} onChange={(event) => onStimulusTextChange(event.target.value)} />
      </label>
      <label>
        Personas
        <select value={personaCount} onChange={(event) => onPersonaCountChange(Number(event.target.value))}>
          <option value={3}>3-person smoke</option>
          <option value={20}>20-person demo</option>
        </select>
      </label>
      <label className="toggle">
        <input
          checked={memoryEnabled}
          onChange={(event) => onMemoryEnabledChange(event.target.checked)}
          type="checkbox"
        />
        Memory {memoryEnabled ? "ON" : "OFF"}
      </label>
      <label className="toggle">
        <input checked={useMockMode} onChange={(event) => onUseMockModeChange(event.target.checked)} type="checkbox" />
        Mock {useMockMode ? "ON" : "OFF"}
      </label>
      <button disabled={isRunning || stimulusText.trim().length === 0} onClick={onRun}>
        Run Simulation
      </button>
    </section>
  );
}
