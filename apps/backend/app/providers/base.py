from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass
from typing import Any


class ProviderError(RuntimeError):
    def __init__(self, provider: str, error_code: str, message: str):
        super().__init__(message)
        self.provider = provider
        self.error_code = error_code
        self.safe_message = message


@dataclass(frozen=True)
class ProviderResult:
    provider: str
    model: str
    payload: dict[str, Any]
    latency_ms: int
    fallback_attempts: list[str]


def extract_json_object(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    fence_match = re.search(r"```(?:json)?\s*(.*?)```", cleaned, flags=re.DOTALL | re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    if not cleaned.startswith("{"):
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            cleaned = cleaned[start : end + 1]

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError("Provider response was not valid JSON.") from exc

    if not isinstance(parsed, dict):
        raise ValueError("Provider JSON response must be an object.")
    return parsed


def started_ms() -> float:
    return time.perf_counter()


def elapsed_ms(start: float) -> int:
    return int((time.perf_counter() - start) * 1000)


class BaseProvider:
    name: str
    default_model: str

    def __init__(self, api_key: str, timeout_seconds: float = 60):
        self.api_key = api_key
        self.timeout_seconds = timeout_seconds

    async def generate_text(
        self,
        prompt: str,
        *,
        model: str | None = None,
        max_tokens: int = 900,
        temperature: float = 0.4,
    ) -> tuple[str, int]:
        raise NotImplementedError

    async def generate_json(
        self,
        prompt: str,
        *,
        schema_hint: str,
        model: str | None = None,
        max_tokens: int = 900,
        temperature: float = 0.4,
    ) -> tuple[dict[str, Any], int, str]:
        full_prompt = (
            f"{prompt}\n\n"
            "Return only one valid JSON object. Do not wrap it in markdown.\n"
            f"Required JSON shape:\n{schema_hint}"
        )
        text, latency_ms = await self.generate_text(
            full_prompt,
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        try:
            return extract_json_object(text), latency_ms, model or self.default_model
        except ValueError as exc:
            raise ProviderError(self.name, "invalid_json", str(exc)) from exc

    async def check(self) -> tuple[str, int]:
        payload, latency_ms, model = await self.generate_json(
            f'Return exactly this JSON object for a health check: {{"ok": true, "provider": "{self.name}"}}',
            schema_hint='{"ok": true, "provider": "string"}',
            max_tokens=80,
            temperature=0,
        )
        if payload.get("ok") is not True:
            raise ProviderError(self.name, "health_check_failed", "Health check JSON did not return ok=true.")
        return model, latency_ms
