import React, { useMemo, useState } from 'react';
import { useCopilotContext } from '@copilotkit/react-core';
import './styles.css';

export function CopilotSidebar({ labels = {}, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const context = useCopilotContext();
  const actions = context?.actions ?? {};
  const showPersonaAction = actions.showPersonaDetails;
  const sampleArgs = useMemo(() => ({ persona: {
    name: 'Maya Rodriguez', age: 34, location: 'Phoenix, AZ', segment: 'Suburban parent', sentiment: 'positive',
    reaction: 'Responds to the message because it connects economic pressure with household tradeoffs.',
    quote: 'This sounds like someone has actually listened to families budgeting every week.',
    education: 'Some college', income: '$74k household', party: 'Independent', issues: ['Cost of living', 'Healthcare', 'Schools']
  }}), []);

  return React.createElement(React.Fragment, null,
    children,
    React.createElement('button', { className: 'copilotkit-fab', onClick: () => setOpen((value) => !value), 'aria-label': 'Toggle Copilot' }, open ? '×' : 'AI'),
    open && React.createElement('aside', { className: 'copilotkit-sidebar' },
      React.createElement('div', { className: 'copilotkit-header' },
        React.createElement('div', null,
          React.createElement('p', { className: 'copilotkit-eyebrow' }, 'CopilotKit'),
          React.createElement('h2', null, labels.title || 'Campaign Copilot')
        ),
        React.createElement('button', { onClick: () => setOpen(false), 'aria-label': 'Close Copilot' }, '×')
      ),
      React.createElement('p', { className: 'copilotkit-intro' }, labels.initial || 'Ask for persona details, message rewrites, or segment-specific risks.'),
      React.createElement('div', { className: 'copilotkit-chat' },
        React.createElement('div', { className: 'copilotkit-message assistant' }, 'I can inspect simulation results and render generative UI cards for individual personas.'),
        showPersonaAction?.render ? React.createElement('div', { className: 'copilotkit-action-render' }, showPersonaAction.render({ args: sampleArgs, status: 'complete' })) : null
      ),
      React.createElement('form', { className: 'copilotkit-input', onSubmit: (event) => event.preventDefault() },
        React.createElement('input', { placeholder: labels.placeholder || 'Ask about a voter persona…' }),
        React.createElement('button', { type: 'submit' }, 'Send')
      )
    )
  );
}
