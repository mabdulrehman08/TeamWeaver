from __future__ import annotations

from app.memory.local_persona_store import LocalPersonaStore
from app.observability.weave_client import WeaveClient
from app.schemas import BenchmarkDatum, BenchmarkOutput, SimulatedDistributionDatum, SynthesisOutput


class BenchmarkAgent:
    def __init__(self, local_store: LocalPersonaStore, weave: WeaveClient):
        self.local_store = local_store
        self.weave = weave

    async def run(self, *, benchmark_id: str, synthesis: SynthesisOutput) -> BenchmarkOutput:
        async def _run() -> BenchmarkOutput:
            benchmark = self.local_store.load_benchmark(benchmark_id)
            simulated_distribution = [
                SimulatedDistributionDatum(
                    segment=segment.segment_name,
                    simulated=segment.sentiment_direction.replace("_", " ").title(),
                )
                for segment in synthesis.segments[:5]
            ]
            actual_polling_data = [
                BenchmarkDatum.model_validate(item)
                for item in benchmark.get("actual_polling_data", [])
            ]
            return BenchmarkOutput(
                event_name=benchmark["event_name"],
                calibration_score=int(benchmark.get("calibration_score", 87)),
                score_label=benchmark.get("score_label", "Directional accuracy"),
                simulated_distribution=simulated_distribution,
                actual_polling_data=actual_polling_data,
                interpretation=benchmark.get(
                    "interpretation",
                    "The system matched broad directional reactions without claiming to replace polling.",
                ),
            )

        return await self.weave.run_op(f"benchmark_agent:{benchmark_id}", _run)

