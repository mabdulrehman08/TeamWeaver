import type { SynthesisSegmentPayload } from "../lib/agui";

type Props = {
  segment: SynthesisSegmentPayload;
};

export function SegmentInsightCard({ segment }: Props) {
  return (
    <article className={`segment-card sentiment-${segment.sentiment_direction}`}>
      <div className="segment-card-header">
        <span className="pill">{segment.sentiment_direction.replaceAll("_", " ")}</span>
        <span className="pill ghost">{segment.movement_signal.replaceAll("_", " ")}</span>
      </div>
      <h3>{segment.segment_name}</h3>
      <p>{segment.summary}</p>
      <small>{segment.persona_count} persona(s)</small>
    </article>
  );
}
