import type { BenchmarkPayload } from "../lib/agui";

type Props = {
  benchmark: BenchmarkPayload | null;
};

export function BenchmarkComparison({ benchmark }: Props) {
  if (!benchmark) {
    return <p className="empty-note">Benchmark comparison waits for synthesis output.</p>;
  }

  return (
    <article className="benchmark-card">
      <div className="score-orb">
        <strong>{benchmark.calibration_score}</strong>
        <span>{benchmark.score_label}</span>
      </div>
      <div>
        <h3>{benchmark.event_name}</h3>
        <p>{benchmark.interpretation}</p>
      </div>
      <div className="benchmark-grid">
        <div>
          <h4>Simulated</h4>
          {benchmark.simulated_distribution.map((item) => (
            <p key={item.segment}>
              <strong>{item.segment}:</strong> {item.simulated}
            </p>
          ))}
        </div>
        <div>
          <h4>Historical polling</h4>
          {benchmark.actual_polling_data.map((item) => (
            <p key={item.segment}>
              <strong>{item.segment}:</strong> {item.actual} <em>{item.source_label}</em>
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

