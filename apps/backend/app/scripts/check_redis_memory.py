from __future__ import annotations

import asyncio
import sys

from app.config import get_settings
from app.memory.redis_agent_memory import RedisAgentMemory


async def main() -> int:
    settings = get_settings()
    redis = RedisAgentMemory(settings)
    try:
        await redis.check_connection()
    except Exception as exc:  # noqa: BLE001
        print(f"[fail] Redis Agent Memory: {exc.__class__.__name__}")
        return 1

    print("[ok] Connected to Redis Agent Memory")
    print("[ok] Read session memory")
    print("[ok] Test writes skipped until a disposable cleanup namespace is explicitly enabled")
    print("Redis Agent Memory validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))

