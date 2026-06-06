from __future__ import annotations

import asyncio
import sys

from app.config import get_settings
from app.observability.weave_client import WeaveClient


async def main() -> int:
    settings = get_settings()
    weave = WeaveClient(settings)
    weave.init()
    if not weave.initialized:
        print("[fail] Weave initialization failed")
        return 1

    async def traced_health() -> dict[str, bool]:
        return {"ok": True}

    await weave.run_op("check_weave:test_trace", traced_health)
    print("[ok] Weave initialized")
    print("[ok] Test trace created")
    print(f"Project: {settings.weave_project_name}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

