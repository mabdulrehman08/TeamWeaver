from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from app.schemas import EventEnvelope


def utc_now() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def make_run_id(stimulus_id: str) -> str:
    safe_ts = utc_now().replace(":", "-")
    return f"run:{stimulus_id}:{safe_ts}"


class EventBuilder:
    def __init__(self, run_id: str):
        self.run_id = run_id
        self._sequence = 0

    def emit(
        self,
        event_type: str,
        payload: dict[str, Any] | None = None,
        *,
        trace_id: str | None = None,
        weave_url: str | None = None,
        error: dict[str, Any] | None = None,
    ) -> EventEnvelope:
        self._sequence += 1
        return EventEnvelope(
            event_type=event_type,
            run_id=self.run_id,
            sequence=self._sequence,
            timestamp=utc_now(),
            payload=payload or {},
            trace_id=trace_id,
            weave_url=weave_url,
            error=error,
        )


def encode_sse(event: EventEnvelope) -> str:
    data = event.model_dump(exclude_none=True)
    return f"event: {event.event_type}\ndata: {json.dumps(data, separators=(',', ':'))}\n\n"


def safe_error(error_code: str, message: str) -> dict[str, str]:
    return {"error_code": error_code, "message": message}

