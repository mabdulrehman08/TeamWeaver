import React from "react";
import ReactDOM from "react-dom/client";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "./index.css";
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen={false}
        labels={{
          title: "Campaign Copilot",
          initial: "Ask for a persona drilldown, message risks, or segment-specific rewrites.",
          placeholder: "Ask about the simulation…",
        }}
      >
        <Dashboard />
      </CopilotSidebar>
    </CopilotKit>
  </React.StrictMode>,
);
