import React, { createContext, useContext, useMemo, useState } from 'react';

const CopilotContext = createContext(null);

export function CopilotKit({ children, runtimeUrl }) {
  const [actions, setActions] = useState({});
  const value = useMemo(() => ({ runtimeUrl, actions, setActions }), [runtimeUrl, actions]);
  return React.createElement(CopilotContext.Provider, { value }, children);
}

export function useCopilotAction(action) {
  const context = useContext(CopilotContext);
  React.useEffect(() => {
    if (!context || !action?.name) return;
    context.setActions((current) => ({ ...current, [action.name]: action }));
    return () => {
      context.setActions((current) => {
        const next = { ...current };
        delete next[action.name];
        return next;
      });
    };
  }, [context, action]);
}

export function useCopilotReadable() {}
export function useCopilotContext() { return useContext(CopilotContext); }
