from __future__ import annotations

from typing import Any

import httpx

from app.providers.base import BaseProvider, ProviderError, elapsed_ms, started_ms


class AnthropicProvider(BaseProvider):
    name = "anthropic"
    default_model = "claude-haiku-4-5-20251001"

    async def generate_text(
        self,
        prompt: str,
        *,
        model: str | None = None,
        max_tokens: int = 900,
        temperature: float = 0.4,
    ) -> tuple[str, int]:
        start = started_ms()
        body: dict[str, Any] = {
            "model": model or self.default_model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "system": "You are a careful research simulation agent. Return valid JSON when asked.",
            "messages": [{"role": "user", "content": prompt}],
        }
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post("https://api.anthropic.com/v1/messages", json=body, headers=headers)

        if response.status_code >= 400:
            raise ProviderError(
                self.name,
                "provider_http_error",
                f"Anthropic request failed with HTTP {response.status_code}.",
            )

        try:
            data = response.json()
            text_parts = [part.get("text", "") for part in data["content"] if part.get("type") == "text"]
            text = "\n".join(part for part in text_parts if part)
        except (KeyError, TypeError, ValueError) as exc:
            raise ProviderError(
                self.name,
                "provider_response_error",
                "Anthropic returned an unexpected response shape.",
            ) from exc

        if not text:
            raise ProviderError(self.name, "empty_response", "Anthropic returned an empty text response.")

        return text, elapsed_ms(start)

