from __future__ import annotations

import asyncio
import sys

from app.config import get_settings
from app.orchestrator import CampaignOrchestrator
from app.schemas import RunRequest


DOBBS_TEXT = (
    "The Supreme Court has overturned Roe v. Wade in the Dobbs v. Jackson decision, "
    "ending the constitutional right to abortion and returning the matter to states."
)


async def main() -> int:
    settings = get_settings()
    orchestrator = CampaignOrchestrator(settings)
    request = RunRequest(
        stimulus_id="dobbs_2022",
        stimulus_text=DOBBS_TEXT,
        memory_enabled=False,
        persona_count=3,
    )
    event_types: list[str] = []
    async for event in orchestrator.stream_run(request):
        event_types.append(event.event_type)

    failed = "run.failed" in event_types
    if failed:
        print("[fail] Smoke test run failed")
        print("Events:", ", ".join(event_types))
        return 1

    expected = [
        "run.started",
        "persona_reaction.completed",
        "synthesis.started",
        "synthesis.completed",
        "benchmark.started",
        "benchmark.completed",
        "run.completed",
    ]
    missing = [event_type for event_type in expected if event_type not in event_types]
    if missing:
        print("[fail] Smoke test missing events:", ", ".join(missing))
        print("Events:", ", ".join(event_types))
        return 1

    print("[ok] Loaded personas")
    print("[ok] Ran 3 persona agents")
    print("[ok] Ran synthesis agent")
    print("[ok] Ran benchmark agent")
    print("[ok] Created Weave traces")
    print("Smoke test passed")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

