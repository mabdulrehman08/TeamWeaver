import type { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen={false}
        labels={{
          title: "Campaign Copilot",
          initial: "Ask for a persona drilldown, message risks, or segment-specific rewrites.",
          placeholder: "Ask about the simulation…",
        }}
      >
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}

export default Providers;
