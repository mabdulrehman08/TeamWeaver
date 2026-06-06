from __future__ import annotations

import inspect
import logging
import os
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from app.config import Settings


logger = logging.getLogger(__name__)
T = TypeVar("T")


class WeaveClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._weave: Any | None = None
        self.initialized = False
        self.warning: str | None = None
        self._resolved_url: str | None = None

    def init(self) -> None:
        if not self.settings.weave_configured():
            self.warning = "Weave is not configured."
            logger.warning(self.warning)
            return

        try:
            if self.settings.weave_api_key and not os.environ.get("WANDB_API_KEY"):
                os.environ["WANDB_API_KEY"] = self.settings.weave_api_key
            import weave  # type: ignore

            client = weave.init(self.settings.weave_project_name)
            self._weave = weave
            self.initialized = True
            entity = getattr(client, "entity", None)
            project = getattr(client, "project", None)
            if entity and project:
                self._resolved_url = f"https://wandb.ai/{entity}/{project}/weave"
        except Exception as exc:  # noqa: BLE001 - observability must not crash the demo.
            self.warning = f"Weave initialization failed: {exc.__class__.__name__}"
            logger.warning(self.warning)

    def weave_url(self) -> str | None:
        if not self.initialized:
            return None
        return self._resolved_url or f"https://wandb.ai/{self.settings.weave_project_name}/weave"

    async def run_op(self, name: str, func: Callable[..., T | Awaitable[T]], *args: Any, **kwargs: Any) -> T:
        if not self.initialized or not self._weave:
            result = func(*args, **kwargs)
            if inspect.isawaitable(result):
                return await result
            return result

        try:
            traced = self._weave.op(name=name)(func)
            result = traced(*args, **kwargs)
            if inspect.isawaitable(result):
                return await result
            return result
        except Exception as exc:  # noqa: BLE001
            logger.warning("Weave trace wrapper failed for %s: %s", name, exc.__class__.__name__)
            result = func(*args, **kwargs)
            if inspect.isawaitable(result):
                return await result
            return result
