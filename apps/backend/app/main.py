from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import get_settings
from app.orchestrator import CampaignOrchestrator
from app.schemas import RunRequest
from app.streaming.ag_ui_events import encode_sse


logging.basicConfig(level=logging.INFO)

settings = get_settings()
app = FastAPI(title="Campaign Persona Agent", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    print(settings.safe_startup_summary())
    app.state.orchestrator = CampaignOrchestrator(settings)


@app.get("/health")
async def health() -> dict[str, object]:
    return {
        "status": "ok",
        "backend_env": settings.backend_env,
        "demo_mode": settings.demo_mode,
        "configured_providers": settings.configured_providers(),
        "redis_agent_memory": "configured" if settings.redis_configured() else "missing",
        "weave": "configured" if settings.weave_configured() else "missing",
        "missing_required": settings.missing_required(),
    }


@app.post("/api/runs")
async def run_campaign(request: RunRequest) -> StreamingResponse:
    orchestrator: CampaignOrchestrator = app.state.orchestrator

    async def event_stream():
        async for event in orchestrator.stream_run(request):
            yield encode_sse(event)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

