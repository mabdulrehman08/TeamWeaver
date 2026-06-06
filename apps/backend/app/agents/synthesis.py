from __future__ import annotations

import logging
from collections import Counter, defaultdict

from app.observability.weave_client import WeaveClient
from app.providers.base import ProviderError
from app.providers.router import ProviderRouter
from app.schemas import BestQuote, Persona, PersonaReaction, RedFlag, SynthesisOutput, SynthesisSegment


logger = logging.getLogger(__name__)

SYNTHESIS_SCHEMA_HINT = """
{
  "overall_sentiment": "negative_majority|mixed|positive_majority",
  "segments": [
    {
      "segment_id": "string",
      "segment_name": "string",
      "sentiment_direction": "strongly_negative|negative|mixed|neutral|positive|strongly_positive",
      "movement_signal": "low_salience|persuasion_risk|persuasion_opportunity|high_activation|base_reinforcement|unclear",
      "persona_count": 1,
      "summary": "one sentence"
    }
  ],
  "red_flags": [
    {
      "segment": "string",
      "flag_description": "string",
      "affected_personas": ["persona_id"],
      "severity": "low|medium|high"
    }
  ],
  "best_quotes": [
    {"persona_id": "string", "quote": "string"}
  ],
  "executive_summary": "2 sentence summary"
}
"""


class SynthesisAgent:
    def __init__(self, provider_router: ProviderRouter, weave: WeaveClient):
        self.provider_router = provider_router
        self.weave = weave

    async def run(self, *, reactions: list[tuple[Persona, PersonaReaction]]) -> SynthesisOutput:
        async def _run() -> SynthesisOutput:
            prompt = build_synthesis_prompt(reactions)
            try:
                result = await self.provider_router.generate_json(
                    preferred_provider="openai",
                    prompt=prompt,
                    schema_hint=SYNTHESIS_SCHEMA_HINT,
                    max_tokens=1400,
                    temperature=0.2,
                )
                return SynthesisOutput.model_validate(result.payload)
            except (ProviderError, ValueError) as exc:
                logger.warning("Synthesis model failed; using deterministic fallback: %s", exc.__class__.__name__)
                return deterministic_synthesis(reactions)

        return await self.weave.run_op("synthesis_agent", _run)


def build_synthesis_prompt(reactions: list[tuple[Persona, PersonaReaction]]) -> str:
    lines: list[str] = []
    for persona, reaction in reactions:
        lines.append(
            f"- {persona.persona_id} ({persona.name}, {persona.party_affiliation}, "
            f"{persona.ideology}, tags={persona.segment_tags}): "
            f"{reaction.reaction_text} Quote: {reaction.voter_voice_quote}"
        )
    joined = "\n".join(lines)
    return f"""
You are a qualitative research synthesis agent for a synthetic voter focus group.
Infer segment-level directional sentiment from the persona reactions.
Use cautious research language. Do not claim the simulation replaces polling.

Persona reactions:
{joined}
""".strip()


def deterministic_synthesis(reactions: list[tuple[Persona, PersonaReaction]]) -> SynthesisOutput:
    segment_map: dict[str, list[tuple[Persona, PersonaReaction]]] = defaultdict(list)
    sentiment_counts: Counter[str] = Counter()

    for persona, reaction in reactions:
        sentiment = classify_sentiment(reaction.reaction_text)
        sentiment_counts[sentiment] += 1
        for tag in persona.segment_tags[:4]:
            segment_map[tag].append((persona, reaction))

    segments: list[SynthesisSegment] = []
    for segment_id, items in sorted(segment_map.items(), key=lambda item: len(item[1]), reverse=True)[:6]:
        segment_sentiments = [classify_sentiment(reaction.reaction_text) for _, reaction in items]
        direction = aggregate_sentiment(segment_sentiments)
        segments.append(
            SynthesisSegment(
                segment_id=segment_id,
                segment_name=segment_id.replace("_", " ").title(),
                sentiment_direction=direction,
                movement_signal=movement_signal_for(segment_id, direction),
                persona_count=len(items),
                summary=summary_for_segment(segment_id, direction, items),
            )
        )

    red_flags = detect_red_flags(reactions)
    best_quotes = [
        BestQuote(persona_id=reaction.persona_id, quote=reaction.voter_voice_quote)
        for _, reaction in reactions[:5]
        if reaction.voter_voice_quote
    ]

    overall = "mixed"
    if sentiment_counts["negative"] + sentiment_counts["strongly_negative"] > len(reactions) / 2:
        overall = "negative_majority"
    elif sentiment_counts["positive"] + sentiment_counts["strongly_positive"] > len(reactions) / 2:
        overall = "positive_majority"

    return SynthesisOutput(
        overall_sentiment=overall,
        segments=segments,
        red_flags=red_flags,
        best_quotes=best_quotes,
        executive_summary=(
            "The synthetic focus group shows a directional reaction pattern, with the sharpest concern "
            "clustered among women and younger or moderate voters. Treat this as fast qualitative signal, "
            "not a polling replacement."
        ),
    )


def classify_sentiment(text: str) -> str:
    lowered = text.lower()
    strong_negative = ["furious", "terrified", "devastated", "betrayed", "fewer rights"]
    negative = ["worried", "angry", "concerned", "upset", "do not trust", "don't trust"]
    positive = ["relieved", "support", "right decision", "agree", "states should"]
    if any(term in lowered for term in strong_negative):
        return "strongly_negative"
    if any(term in lowered for term in negative):
        return "negative"
    if any(term in lowered for term in positive):
        return "positive"
    return "mixed"


def aggregate_sentiment(sentiments: list[str]) -> str:
    counts = Counter(sentiments)
    if counts["strongly_negative"] >= max(1, len(sentiments) // 2):
        return "strongly_negative"
    if counts["negative"] + counts["strongly_negative"] > len(sentiments) / 2:
        return "negative"
    if counts["positive"] + counts["strongly_positive"] > len(sentiments) / 2:
        return "positive"
    return "mixed"


def movement_signal_for(segment_id: str, direction: str) -> str:
    if direction in {"strongly_negative", "negative"} and any(term in segment_id for term in ["women", "young", "moderate"]):
        return "high_activation"
    if direction in {"strongly_negative", "negative"} and "republican" in segment_id:
        return "persuasion_risk"
    if direction in {"positive", "strongly_positive"}:
        return "base_reinforcement"
    return "unclear"


def summary_for_segment(segment_id: str, direction: str, items: list[tuple[Persona, PersonaReaction]]) -> str:
    names = ", ".join(persona.name for persona, _ in items[:3])
    return (
        f"{segment_id.replace('_', ' ').title()} show a {direction.replace('_', ' ')} directional signal "
        f"across {len(items)} persona(s), led by reactions from {names}."
    )


def detect_red_flags(reactions: list[tuple[Persona, PersonaReaction]]) -> list[RedFlag]:
    affected: list[str] = []
    for persona, reaction in reactions:
        tags = set(persona.segment_tags)
        if (
            persona.party_affiliation.lower() in {"republican", "independent"}
            and {"suburban_women", "moderate_republicans"}.intersection(tags)
            and classify_sentiment(reaction.reaction_text) in {"negative", "strongly_negative"}
        ):
            affected.append(persona.persona_id)

    if not affected:
        return []

    return [
        RedFlag(
            segment="Moderate Republican women in suburban districts",
            flag_description=(
                "Unexpectedly negative reaction among right-leaning suburban women; "
                "this may be a vulnerability signal in close districts."
            ),
            affected_personas=affected,
            severity="high",
        )
    ]

