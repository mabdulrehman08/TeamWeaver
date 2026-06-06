# Implementation Plan Update — Environment Variables Added and Validation Required

## Current Status

The required service credentials have been added to the local environment.

Available variables:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=

REDIS_AGENT_MEMORY_ENDPOINT=
REDIS_AGENT_MEMORY_API_KEY=
REDIS_AGENT_MEMORY_STORE_ID=

WEAVE_API_KEY=
WEAVE_PROJECT_NAME=campaign-persona-agent
```

These variables should be loaded by the backend from `.env` during local development.

Do not commit real secret values to the repo. Commit only `.env.example`.

## Updated Implementation Assumption

The backend can now assume access to:

* OpenAI
* Anthropic
* Gemini
* OpenRouter
* Redis Agent Memory
* Weave

The implementation should include startup validation to confirm these services are configured before running the full demo path.

## Required `.env.example`

Create or update:

```text
apps/backend/.env.example
```

with:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=

REDIS_AGENT_MEMORY_ENDPOINT=
REDIS_AGENT_MEMORY_API_KEY=
REDIS_AGENT_MEMORY_STORE_ID=

WEAVE_API_KEY=
WEAVE_PROJECT_NAME=campaign-persona-agent

BACKEND_ENV=local
DEMO_MODE=true
PERSONA_COUNT=20
PERSONA_CONCURRENCY_LIMIT=25
```

## Backend Environment Loading

The backend should load environment variables at startup.

Required behavior:

1. Load `.env` in local development.
2. Validate required variables.
3. Print a safe startup summary showing which services are configured.
4. Never print secret values.
5. Fail fast only if a critical required variable is missing.
6. Allow non-critical provider fallbacks if one model provider is missing.

## Required Service Validation

Add a startup or CLI validation command:

```bash
python -m app.scripts.check_services
```

This command should test:

### 1. OpenAI

Goal:

* Confirm `OPENAI_API_KEY` is present.
* Make one minimal model request.
* Return success/failure.

Expected output:

```text
[ok] OpenAI configured
```

### 2. Anthropic

Goal:

* Confirm `ANTHROPIC_API_KEY` is present.
* Make one minimal model request.
* Return success/failure.

Expected output:

```text
[ok] Anthropic configured
```

### 3. Gemini

Goal:

* Confirm `GEMINI_API_KEY` is present.
* Make one minimal model request.
* Return success/failure.

Expected output:

```text
[ok] Gemini configured
```

### 4. OpenRouter

Goal:

* Confirm `OPENROUTER_API_KEY` is present.
* Make one minimal model request using a cheap model.
* Return success/failure.

Expected output:

```text
[ok] OpenRouter configured
```

OpenRouter should be treated as optional overflow/model-variety capacity. If it fails, the demo should still run using OpenAI, Anthropic, and Gemini.

### 5. Redis Agent Memory

Goal:

* Confirm all Redis variables are present:

  * `REDIS_AGENT_MEMORY_ENDPOINT`
  * `REDIS_AGENT_MEMORY_API_KEY`
  * `REDIS_AGENT_MEMORY_STORE_ID`
* Write a test memory event.
* Read it back.
* Delete or ignore the test record after verification.

Expected output:

```text
[ok] Redis Agent Memory configured
```

If Redis fails:

* The demo should fall back to local persona JSON.
* Memory toggle should be visibly disabled or marked as unavailable.
* The rest of the demo should still work.

### 6. Weave

Goal:

* Confirm `WEAVE_API_KEY` is present.
* Confirm `WEAVE_PROJECT_NAME=campaign-persona-agent`.
* Initialize Weave once.
* Create one test trace.
* Confirm a trace URL or project URL is available.

Expected output:

```text
[ok] Weave configured: campaign-persona-agent
```

If Weave fails:

* The backend should still run.
* The demo should log a warning.
* The Weave dashboard portion of the demo will not be available until fixed.

## Startup Health Summary

When the backend starts locally, it should print a safe configuration summary:

```text
Campaign Persona Agent backend starting...

Environment:
- BACKEND_ENV: local
- DEMO_MODE: true
- PERSONA_COUNT: 20
- PERSONA_CONCURRENCY_LIMIT: 25

Providers:
- OpenAI: configured
- Anthropic: configured
- Gemini: configured
- OpenRouter: configured

Memory:
- Redis Agent Memory: configured

Observability:
- Weave project: campaign-persona-agent
```

Do not print API keys, endpoints with tokens, or secret values.

## Model Provider Strategy

Use this provider distribution for the 20 demo personas:

```text
OpenAI: 7 personas
Anthropic: 7 personas
Gemini: 4 personas
OpenRouter: 2 personas
```

Fallback rules:

1. If OpenRouter fails, reassign OpenRouter personas to OpenAI.
2. If Gemini fails, reassign Gemini personas evenly across OpenAI and Anthropic.
3. If Anthropic fails, reassign Anthropic personas to OpenAI and Gemini.
4. If OpenAI fails, reassign OpenAI personas to Anthropic and Gemini.
5. If fewer than two providers work, continue but display a warning in backend logs.

The demo should not depend on all four providers being healthy.

## Redis Agent Memory Test Plan

Before integrating Redis into the orchestration path, verify it independently.

Required test script:

```bash
python -m app.scripts.check_redis_memory
```

Test flow:

1. Connect to Redis Agent Memory using:

   * `REDIS_AGENT_MEMORY_ENDPOINT`
   * `REDIS_AGENT_MEMORY_API_KEY`
   * `REDIS_AGENT_MEMORY_STORE_ID`
2. Create test owner ID:

```text
persona:test_memory_probe
```

3. Write a long-term test profile memory.
4. Read the profile memory back.
5. Write a session reaction event.
6. Read the session reaction event back.
7. Print success or failure.

Expected successful output:

```text
[ok] Connected to Redis Agent Memory
[ok] Wrote test persona profile
[ok] Read test persona profile
[ok] Wrote test reaction history
[ok] Read test reaction history
Redis Agent Memory validation passed
```

## Weave Test Plan

Before full agent orchestration, verify Weave independently.

Required test script:

```bash
python -m app.scripts.check_weave
```

Test flow:

1. Initialize Weave using `WEAVE_PROJECT_NAME`.
2. Create a traced test function.
3. Run the function once.
4. Print project name and trace status.

Expected output:

```text
[ok] Weave initialized
[ok] Test trace created
Project: campaign-persona-agent
```

## End-to-End Smoke Test

After service validation passes, run a local smoke test:

```bash
python -m app.scripts.smoke_test_demo
```

Smoke test requirements:

1. Load 20 personas from local JSON or Redis.
2. Run only 3 personas first.
3. Use one OpenAI persona, one Anthropic persona, and one Gemini persona.
4. Stream or print persona reaction outputs.
5. Run synthesis on the 3 reactions.
6. Run benchmark against Dobbs static data.
7. Create Weave traces.
8. Exit successfully.

Expected output:

```text
[ok] Loaded personas
[ok] Ran 3 persona agents
[ok] Ran synthesis agent
[ok] Ran benchmark agent
[ok] Created Weave traces
Smoke test passed
```

Only after this passes should the full 20-persona UI demo path be wired.

## Codex Next Task

Implement backend configuration and validation first.

Scope:

1. Create backend config module.
2. Load environment variables from `.env`.
3. Add `.env.example`.
4. Add safe config validation.
5. Add service check scripts:

   * `check_services`
   * `check_redis_memory`
   * `check_weave`
   * `smoke_test_demo`
6. Add provider fallback strategy.
7. Do not implement full frontend yet.
8. Do not hardcode real API keys.
9. Do not commit secrets.

Acceptance criteria:

* Backend starts with the current environment variables.
* Missing secrets are reported clearly.
* No secrets are printed.
* Redis Agent Memory can be tested independently.
* Weave can be tested independently.
* At least one minimal LLM request works.
* A 3-persona smoke test can run before building the full 20-persona path.
