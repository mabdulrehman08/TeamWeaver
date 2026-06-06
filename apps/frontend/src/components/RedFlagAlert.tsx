import type { RedFlagPayload } from "../lib/agui";

type Props = {
  redFlags: RedFlagPayload[];
};

export function RedFlagAlert({ redFlags }: Props) {
  if (redFlags.length === 0) {
    return null;
  }

  return (
    <section className="red-flags">
      {redFlags.map((flag) => (
        <article key={`${flag.segment}-${flag.severity}`} className={`red-flag ${flag.severity}`}>
          <span>{flag.severity} signal</span>
          <h3>{flag.segment}</h3>
          <p>{flag.flag_description}</p>
          <small>Affected personas: {flag.affected_personas.join(", ")}</small>
        </article>
      ))}
    </section>
  );
}

