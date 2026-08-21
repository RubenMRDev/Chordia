import React from 'react';
import { Keyboard, Panel } from '@/ui';

interface EmptyStateProps {
  title: string;
  body: string;
  action?: React.ReactNode;
}

/**
 * Nothing here yet.
 *
 * Grounded by an unlit keyboard rather than a large grey icon: the instrument
 * is the product's own furniture, and it reads as "waiting" rather than
 * "broken".
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title, body, action }) => (
  <Panel className="px-6 py-14 text-center">
    <Keyboard
      lowestMidi={55}
      highestMidi={72}
      height={64}
      decorative
      tone="shadow"
      className="mx-auto mb-8 max-w-[240px]"
    />
    <h2 className="font-display text-lg font-semibold">{title}</h2>
    <p className="mt-2 mx-auto max-w-sm text-[13px] leading-relaxed text-ink-mid">
      {body}
    </p>
    {action && <div className="mt-7">{action}</div>}
  </Panel>
);

export default EmptyState;
