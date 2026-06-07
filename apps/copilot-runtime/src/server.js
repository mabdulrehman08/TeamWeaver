import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { BuiltInAgent, CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotExpressHandler } from "@copilotkit/runtime/v2/express";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../../..");

dotenv.config({ path: resolve(repoRoot, ".env") });
dotenv.config();

const port = Number(process.env.COPILOT_RUNTIME_PORT ?? 3001);
const basePath = "/api/copilotkit";
const model = process.env.COPILOT_MODEL ?? "openai/gpt-4o-mini";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
    ],
    credentials: true,
  }),
);

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model,
      instructions: [
        "You are the campaign persona simulator copilot.",
        "Answer questions using the frontend-provided simulation context and frontend tools.",
        "Use the persona, red flag, sentiment, benchmark, and filter tools when they can ground your answer.",
        "Frame outputs as qualitative voter sentiment research, not personalized persuasion advice.",
        "Do not claim the simulation replaces polling or live survey data.",
      ].join(" "),
    }),
  },
});

app.use(
  createCopilotExpressHandler({
    runtime,
    basePath,
    mode: "single-route",
  }),
);

app.use(
  createCopilotExpressHandler({
    runtime,
    basePath,
    mode: "multi-route",
  }),
);

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    runtime: "copilotkit",
    basePath,
    model,
  });
});

const server = app.listen(port, () => {
  console.log(`Copilot runtime listening on http://localhost:${port}${basePath}`);
});

server.ref();

const keepalive = setInterval(() => undefined, 60_000);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    clearInterval(keepalive);
    server.close(() => process.exit(0));
  });
}
