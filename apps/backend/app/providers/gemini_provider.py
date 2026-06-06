from __future__ import annotations

from typing import Any

import httpx

from app.providers.base import BaseProvider, ProviderError, elapsed_ms, started_ms


class GeminiProvider(BaseProvider):
    name = "gemini"
    default_model = "gemini-2.5-flash"

    async def generate_text(
        self,
        prompt: str,
        *,
        model: str | None = None,
        max_tokens: int = 900,
        temperature: float = 0.4,
    ) -> tuple[str, int]:
        start = started_ms()
        selected_model = model or self.default_model
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{selected_model}:generateContent"
        body: dict[str, Any] = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "responseMimeType": "application/json",
            },
        }
        headers = {"Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.post(url, params={"key": self.api_key}, json=body, headers=headers)

        if response.status_code >= 400:
            raise ProviderError(self.name, "provider_http_error", f"Gemini request failed with HTTP {response.status_code}.")

        try:
            data = response.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            raise ProviderError(self.name, "provider_response_error", "Gemini returned an unexpected response shape.") from exc

        return text, elapsed_ms(start)

