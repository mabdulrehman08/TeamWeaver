declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface IntrinsicAttributes {
    key?: any;
  }
}

declare module "react" {
  export type ReactNode = any;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export interface ChangeEvent<T = Element> { target: T; }
  export interface FormEvent<T = Element> { preventDefault(): void; target: T; }
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export const StrictMode: any;
  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "react-dom/client" {
  export function createRoot(container: Element): { render(children: any): void };
}

declare module "recharts" {
  export const Bar: any;
  export const BarChart: any;
  export const CartesianGrid: any;
  export const Cell: any;
  export const Pie: any;
  export const PieChart: any;
  export const ResponsiveContainer: any;
  export const Tooltip: any;
  export const XAxis: any;
  export const YAxis: any;
}

declare module "lucide-react" {
  export const AlertTriangle: any;
  export const ArrowRightLeft: any;
  export const BadgeCheck: any;
  export const Bot: any;
  export const CheckCircle2: any;
  export const ChevronRight: any;
  export const GitCompareArrows: any;
  export const Loader2: any;
  export const MapPin: any;
  export const Play: any;
  export const Quote: any;
  export const Radar: any;
  export const Sparkles: any;
  export const TrendingUp: any;
  export const UserRound: any;
}

declare module "@copilotkit/react-ui/styles.css";
declare module "vite/client";


declare module "@copilotkit/react-core" {
  import type { ReactNode } from "react";
  export interface CopilotAction<T = Record<string, unknown>> {
    name: string;
    description?: string;
    parameters?: unknown[];
    handler?: (args: T) => unknown | Promise<unknown>;
    render?: (props: { args: T; status: "inProgress" | "complete" | "executing" }) => ReactNode;
  }
  export function CopilotKit(props: { children: ReactNode; runtimeUrl?: string }): any;
  export function useCopilotAction<T = Record<string, unknown>>(action: CopilotAction<T>): void;
  export function useCopilotReadable(readable?: unknown): void;
}

declare module "@copilotkit/react-ui" {
  import type { ReactNode } from "react";
  export function CopilotSidebar(props: { children?: ReactNode; defaultOpen?: boolean; labels?: { title?: string; initial?: string; placeholder?: string } }): any;
}

declare module "*.css";
