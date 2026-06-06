from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.config import REPO_ROOT
from app.schemas import Persona


class LocalPersonaStore:
    def __init__(
        self,
        personas_path: Path | None = None,
        benchmark_path: Path | None = None,
    ):
        self.personas_path = personas_path or REPO_ROOT / "data" / "personas" / "personas.json"
        self.benchmark_path = benchmark_path or REPO_ROOT / "data" / "benchmarks" / "dobbs_2022.json"

    def load_personas(self) -> list[Persona]:
        raw = json.loads(self.personas_path.read_text(encoding="utf-8"))
        return [Persona.model_validate(item) for item in raw["personas"]]

    def select_personas(self, count: int) -> list[Persona]:
        personas = self.load_personas()
        return personas[: min(count, len(personas))]

    def get_persona(self, persona_id: str) -> Persona | None:
        for persona in self.load_personas():
            if persona.persona_id == persona_id:
                return persona
        return None

    def load_benchmark(self, benchmark_id: str = "dobbs_2022") -> dict[str, Any]:
        raw = json.loads(self.benchmark_path.read_text(encoding="utf-8"))
        if raw.get("benchmark_id") != benchmark_id:
            raise ValueError(f"Unsupported benchmark_id: {benchmark_id}")
        return raw

