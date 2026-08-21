import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonTone = 'right' | 'left' | 'quiet' | 'ghost' | 'felt';
export type ButtonSize = 'sm' | 'md' | 'lg';

const TONES: Record<ButtonTone, string> = {
  // A lit key: the accent carries the fill, dark ink sits on it.
  right:
    'bg-hand-right text-hand-right-ink font-semibold hover:brightness-110 bloom-right',
  left: 'bg-hand-left text-hand-left-ink font-semibold hover:brightness-110 bloom-left',
  // A chassis surface: reads as part of the instrument, not a floating pill.
  quiet:
    'bg-ground-3 text-ink border border-[var(--edge)] hover:bg-ground-4 hover:border-[var(--seam)]',
  ghost:
    'bg-transparent text-ink-mid hover:text-ink hover:bg-[color-mix(in_srgb,var(--color-ivory)_6%,transparent)]',
  // Damper felt, for anything that removes something.
  felt: 'bg-[var(--color-felt)] text-ivory font-semibold hover:brightness-115',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-[5px] gap-1.5',
  md: 'h-10 px-4 text-sm rounded-md gap-2',
  lg: 'h-12 px-6 text-[15px] rounded-lg gap-2.5',
};

const BASE =
  'press inline-flex items-center justify-center whitespace-nowrap ' +
  'no-underline select-none cursor-pointer ' +
  'disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none';

interface Shared {
  tone?: ButtonTone;
  size?: ButtonSize;
  /** Stretch to the container's width. */
  block?: boolean;
}

export const buttonClass = ({
  tone = 'quiet',
  size = 'md',
  block = false,
  className = '',
}: Shared & { className?: string }): string =>
  [BASE, TONES[tone], SIZES[size], block ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ');

type ButtonProps = Shared &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Swaps the label for a hold state without changing the button's width. */
    busy?: boolean;
    busyLabel?: string;
  };

export const Button: React.FC<ButtonProps> = ({
  tone,
  size,
  block,
  className,
  busy = false,
  busyLabel,
  children,
  disabled,
  type = 'button',
  ...rest
}) => (
  <button
    {...rest}
    type={type}
    disabled={disabled || busy}
    aria-busy={busy || undefined}
    className={buttonClass({ tone, size, block, className })}
  >
    {busy && busyLabel ? busyLabel : children}
  </button>
);

type ButtonLinkProps = Shared & LinkProps & { className?: string };

/** Same key, when the action is navigation. */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  tone,
  size,
  block,
  className,
  children,
  ...rest
}) => (
  <Link {...rest} className={buttonClass({ tone, size, block, className })}>
    {children}
  </Link>
);

type ExternalLinkProps = Shared &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { className?: string };

export const ButtonAnchor: React.FC<ExternalLinkProps> = ({
  tone,
  size,
  block,
  className,
  children,
  ...rest
}) => (
  <a {...rest} className={buttonClass({ tone, size, block, className })}>
    {children}
  </a>
);
