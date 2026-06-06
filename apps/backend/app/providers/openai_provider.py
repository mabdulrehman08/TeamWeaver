from __future__ import annotations

from typing import Any

import httpx

from app.providers.base import BaseProvider, ProviderError, elapsed_ms, started_ms


class OpenAIProvider(BaseProvider):
    name = "openai"
    default_model = "gpt-4o-mini"

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
            "messages": [
                {"role": "system", "content": "You are a careful research simulation agent."},
                {"role": "user", "content": prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"},
        }
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post("https://api.openai.com/v1/chat/completions", json=body, headers=headers)

        if response.status_code >= 400:
            raise ProviderError(self.name, "provider_http_error", f"OpenAI request failed with HTTP {response.status_code}.")

        try:
            data = response.json()
            text = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            raise ProviderError(self.name, "provider_response_error", "OpenAI returned an unexpected response shape.") from exc

        return text, elapsed_ms(start)

