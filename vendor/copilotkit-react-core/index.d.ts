import type { ReactNode } from 'react';
export interface CopilotAction<T = Record<string, unknown>> {
  name: string;
  description?: string;
  parameters?: unknown[];
  handler?: (args: T) => unknown | Promise<unknown>;
  render?: (props: { args: T; status: 'inProgress' | 'complete' | 'executing' }) => ReactNode;
}
export declare function CopilotKit(props: { children: ReactNode; runtimeUrl?: string }): JSX.Element;
export declare function useCopilotAction<T = Record<string, unknown>>(action: CopilotAction<T>): void;
export declare function useCopilotReadable(readable?: unknown): void;
export declare function useCopilotContext(): { runtimeUrl?: string; actions: Record<string, CopilotAction>; setActions: React.Dispatch<React.SetStateAction<Record<string, CopilotAction>>> } | null;
