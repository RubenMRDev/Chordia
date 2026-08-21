import React, { useId } from 'react';

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  /** Names the problem. Rendered under the control and announced. */
  error?: string | null;
  hint?: string;
  /** Rendered inside the control's right edge, e.g. a show-password toggle. */
  trailing?: React.ReactNode;
}

/**
 * A labelled text input. The label is a real `<label>`, the error is wired
 * through `aria-describedby`, and an invalid control says so with
 * `aria-invalid` rather than only turning red.
 */
export const Field: React.FC<FieldProps> = ({
  label,
  error = null,
  hint,
  trailing,
  className = '',
  ...rest
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const described =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-ink-mid mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className={`w-full h-11 rounded-md bg-ground-1 px-3.5 text-[15px] text-ink
            border transition-colors duration-[var(--t-quick)]
            placeholder:text-ink-low
            focus:outline-none focus-visible:outline-none
            ${trailing ? 'pr-12' : ''}
            ${
              error
                ? 'border-[var(--color-felt-ink)] focus:border-[var(--color-felt-ink)]'
                : 'border-[var(--edge)] hover:border-[var(--seam)] focus:border-hand-right'
            }`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-2 text-[13px] text-ink-low">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-2 text-[13px] text-[var(--color-felt-ink)]"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  title?: string;
}

/**
 * A segmented control. Used for every either/or in the player — mode, hands,
 * and so on — so those choices all read as the same kind of switch.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = 'right',
  size = 'md',
  className = '',
}: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
  tone?: 'right' | 'left' | 'wait';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const activeTone = {
    right: 'bg-hand-right text-hand-right-ink',
    left: 'bg-hand-left text-hand-left-ink',
    wait: 'bg-wait text-wait-ink',
  }[tone];

  const pad = size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-low">
          {label}
        </span>
      )}
      <div
        role="group"
        aria-label={label}
        className="inline-flex gap-1 rounded-lg bg-ground-1 p-1 border border-[var(--edge)]"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              title={option.title}
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`press inline-flex items-center gap-1.5 rounded-[5px] font-semibold ${pad} ${
                active
                  ? activeTone
                  : 'text-ink-mid hover:text-ink hover:bg-ground-3'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * An independent on/off, for the cases that are not either/or: which hands you
 * play, the metronome, note names.
 */
export const Toggle: React.FC<{
  pressed: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
  tone?: 'right' | 'left' | 'wait';
  title?: string;
  size?: 'sm' | 'md';
}> = ({ pressed, onChange, children, tone = 'right', title, size = 'md' }) => {
  const activeTone = {
    right: 'bg-hand-right text-hand-right-ink border-hand-right',
    left: 'bg-hand-left text-hand-left-ink border-hand-left',
    wait: 'bg-wait text-wait-ink border-wait',
  }[tone];

  const pad = size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]';

  return (
    <button
      type="button"
      title={title}
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      className={`press inline-flex items-center gap-1.5 rounded-md border font-semibold ${pad} ${
        pressed
          ? activeTone
          : 'border-[var(--edge)] bg-ground-3 text-ink-mid hover:text-ink hover:border-[var(--seam)]'
      }`}
    >
      {children}
    </button>
  );
};
