import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes the side borders and corners so it can sit flush in a column. */
  flush?: boolean;
  /** Kept to the elements that share div's event surface. */
  as?: 'div' | 'section' | 'aside';
}

/**
 * A machined plate. The `.chassis` class draws the material and the 1px of
 * caught light along its top edge; this only decides the element and padding.
 */
export const Panel: React.FC<PanelProps> = ({
  flush = false,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) => (
  <Tag
    {...rest}
    className={`chassis ${flush ? 'chassis-flush' : ''} ${className}`}
  >
    {children}
  </Tag>
);

/**
 * A measured value. Figures are tabular so a column of tempos, times or
 * percentages lines up instead of shuffling as the numbers change.
 */
export const Stat: React.FC<{
  value: React.ReactNode;
  label: React.ReactNode;
  note?: React.ReactNode;
  tone?: 'ink' | 'right' | 'left' | 'wait';
  className?: string;
}> = ({ value, label, note, tone = 'ink', className = '' }) => {
  const valueTone = {
    ink: 'text-ink',
    right: 'text-hand-right',
    left: 'text-hand-left',
    wait: 'text-wait',
  }[tone];

  return (
    <div className={className}>
      <div
        className={`numeric font-display text-[2.75rem] leading-[0.95] ${valueTone}`}
      >
        {value}
      </div>
      <div className="mt-2 text-sm font-medium text-ink">{label}</div>
      {note && (
        <p className="mt-1 text-[13px] leading-relaxed text-ink-low">{note}</p>
      )}
    </div>
  );
};

/** Section heading. No eyebrow, no section number: the heading carries itself. */
export const SectionHeading: React.FC<{
  title: React.ReactNode;
  body?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center';
}> = ({ title, body, className = '', align = 'start' }) => (
  <header
    className={`${align === 'center' ? 'text-center mx-auto' : ''} ${className}`}
  >
    <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05]">
      {title}
    </h2>
    {body && (
      <p
        className={`mt-6 text-[17px] leading-relaxed text-ink-mid prose-measure ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      >
        {body}
      </p>
    )}
  </header>
);
