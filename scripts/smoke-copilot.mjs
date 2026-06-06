import { readFileSync } from "node:fs";

const checks = [
  {
    name: "CopilotKit dependency is wired to the local core package",
    file: "package.json",
    includes: '"@copilotkit/react-core": "file:vendor/copilotkit-react-core"',
  },
  {
    name: "Copilot sidebar dependency is wired to the local UI package",
    file: "package.json",
    includes: '"@copilotkit/react-ui": "file:vendor/copilotkit-react-ui"',
  },
  {
    name: "App providers wrap the dashboard in CopilotKit",
    file: "src/app/providers.tsx",
    includes: "<CopilotKit runtimeUrl=\"/api/copilotkit\">",
  },
  {
    name: "Copilot sidebar is mounted with campaign labels",
    file: "src/app/providers.tsx",
    includes: "<CopilotSidebar",
  },
  {
    name: "Simulation result is exposed as Copilot readable context",
    file: "src/lib/copilotActions.tsx",
    includes: "useCopilotReadable",
  },
  {
    name: "showPersonaDetails action is registered",
    file: "src/lib/copilotActions.tsx",
    includes: 'name: "showPersonaDetails"',
  },
  {
    name: "showPersonaDetails renders the persona detail UI",
    file: "src/lib/copilotActions.tsx",
    includes: "<PersonaDetails persona={args.persona} />",
  },
  {
    name: "Local Copilot sidebar renders registered actions",
    file: "vendor/copilotkit-react-ui/index.js",
    includes: "showPersonaAction.render",
  },
];

let failures = 0;

for (const check of checks) {
  const source = readFileSync(check.file, "utf8");
  if (source.includes(check.includes)) {
    console.log(`✅ ${check.name}`);
  } else {
    failures += 1;
    console.error(`❌ ${check.name}`);
    console.error(`   Missing ${JSON.stringify(check.includes)} in ${check.file}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} Copilot smoke check(s) failed.`);
  process.exit(1);
}

console.log("\nCopilot smoke checks passed. The local sidebar/action demo is wired.");
console.log("Note: this verifies the current local CopilotKit stub integration, not a live LLM runtime.");
