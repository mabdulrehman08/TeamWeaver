from __future__ import annotations

from dataclasses import dataclass

from app.memory.redis_agent_memory import RedisAgentMemory
from app.observability.weave_client import WeaveClient
from app.providers.router import ProviderRouter
from app.schemas import Persona, PersonaReaction


PERSONA_SCHEMA_HINT = """
{
  "reaction_text": "2 to 4 short sentences in the persona's voice",
  "voter_voice_quote": "one short first-person sentence"
}
"""


@dataclass(frozen=True)
class PersonaAgentResult:
    persona: Persona
    reaction: PersonaReaction
    memory_warning: str | None


class PersonaAgent:
    def __init__(
        self,
        provider_router: ProviderRouter,
        memory: RedisAgentMemory,
        weave: WeaveClient,
    ):
        self.provider_router = provider_router
        self.memory = memory
        self.weave = weave

    async def run(
        self,
        *,
        persona: Persona,
        run_id: str,
        stimulus_id: str,
        stimulus_text: str,
        memory_enabled: bool,
    ) -> PersonaAgentResult:
        profile, prior_reactions, memory_warning = await self.memory.get_persona_with_history(
            persona,
            memory_enabled=memory_enabled,
        )
        prompt = build_persona_prompt(
            persona=persona,
            profile=profile,
            stimulus_text=stimulus_text,
            prior_reactions=prior_reactions,
            memory_enabled=memory_enabled,
        )

        async def _call_model() -> PersonaAgentResult:
            provider_result = await self.provider_router.generate_json(
                preferred_provider=persona.assigned_provider,
                model=persona.assigned_model,
                prompt=prompt,
                schema_hint=PERSONA_SCHEMA_HINT,
                max_tokens=500,
                temperature=0.7,
            )
            raw = provider_result.payload
            reaction = PersonaReaction(
                persona_id=persona.persona_id,
                persona_name=persona.name,
                provider=provider_result.provider,  # type: ignore[arg-type]
                model_used=provider_result.model,
                reaction_text=str(raw.get("reaction_text", "")).strip(),
                voter_voice_quote=str(raw.get("voter_voice_quote", "")).strip(),
                latency_ms=provider_result.latency_ms,
            )
            if not reaction.reaction_text or not reaction.voter_voice_quote:
                raise ValueError("Persona model returned empty required fields.")

            save_warning = None
            if memory_enabled:
                save_warning = await self.memory.save_persona_reaction(
                    persona=persona,
                    run_id=run_id,
                    stimulus_id=stimulus_id,
                    reaction=reaction,
                )
            return PersonaAgentResult(
                persona=persona,
                reaction=reaction,
                memory_warning=save_warning or memory_warning,
            )

        op_name = f"persona_agent:{persona.persona_id}:{persona.assigned_model or 'unassigned'}"
        return await self.weave.run_op(op_name, _call_model)


def build_persona_prompt(
    *,
    persona: Persona,
    profile: str,
    stimulus_text: str,
    prior_reactions: list[str],
    memory_enabled: bool,
) -> str:
    memory_context = "Memory is OFF. Treat this as a clean first-run simulation."
    if memory_enabled:
        if prior_reactions:
            joined = "\n".join(f"- {item}" for item in prior_reactions[:5])
            memory_context = f"Memory is ON. Prior reactions for this persona:\n{joined}"
        else:
            memory_context = "Memory is ON, but no prior reaction history was retrieved."

    return f"""
You are simulating one synthetic voter persona for a qualitative research demo.
This is not a real voter and not a polling replacement.

Persona profile:
{profile}

Stimulus:
{stimulus_text}

Memory context:
{memory_context}

Write in {persona.name}'s own voice. Keep it grounded in their life, media diet, and issue priorities.
Do not write campaign advice. Do not generate persuasion messages. Do not include sentiment scores.
""".strip()

