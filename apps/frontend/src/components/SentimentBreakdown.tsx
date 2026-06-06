import type { SynthesisSegmentPayload } from "../lib/agui";

type Props = {
  segments: SynthesisSegmentPayload[];
};

export function SentimentBreakdown({ segments }: Props) {
  if (segments.length === 0) {
    return <p className="empty-note">Segment synthesis will appear after persona reactions finish.</p>;
  }

  return (
    <div className="segment-list">
      {segments.map((segment) => (
        <article className="segment-card" key={segment.segment_id}>
          <div>
            <span className="pill">{segment.sentiment_direction.replaceAll("_", " ")}</span>
            <span className="pill ghost">{segment.movement_signal.replaceAll("_", " ")}</span>
          </div>
          <h3>{segment.segment_name}</h3>
          <p>{segment.summary}</p>
          <small>{segment.persona_count} persona(s)</small>
        </article>
      ))}
    </div>
  );
}

