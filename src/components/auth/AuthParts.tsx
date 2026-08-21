import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useT } from '@/i18n';

/**
 * An error, or a confirmation, above the form. Announced, dismissable, and
 * tinted from the palette rather than with a generic red.
 */
export const AuthNotice: React.FC<{
  tone: 'error' | 'ok';
  children: React.ReactNode;
  onDismiss?: () => void;
}> = ({ tone, children, onDismiss }) => {
  const { t } = useT();
  const error = tone === 'error';

  return (
    <div
      role={error ? 'alert' : 'status'}
      className="mb-5 flex items-start gap-3 rounded-md border px-3.5 py-3 text-[13px] leading-relaxed"
      style={{
        borderColor: error
          ? 'color-mix(in srgb, var(--color-felt-ink) 40%, transparent)'
          : 'color-mix(in srgb, var(--color-hand-right) 40%, transparent)',
        background: error
          ? 'color-mix(in srgb, var(--color-felt) 22%, transparent)'
          : 'color-mix(in srgb, var(--color-hand-right) 10%, transparent)',
        color: error ? 'var(--color-felt-ink)' : 'var(--color-hand-right)',
      }}
    >
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t('nav.close')}
          className="press -mr-1 -mt-0.5 h-6 w-6 shrink-0 grid place-items-center rounded text-current opacity-70 hover:opacity-100"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M2 2l7 7M9 2l-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

/** "or" between the form and the provider buttons. */
export const AuthDivider: React.FC = () => {
  const { t } = useT();
  return (
    <div className="my-6 flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-[var(--edge)]" />
      <span className="text-[12px] uppercase tracking-[0.09em] text-ink-low">
        {t('auth.or')}
      </span>
      <span className="h-px flex-1 bg-[var(--edge)]" />
    </div>
  );
};

export const GoogleButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
}> = ({ onClick, disabled }) => {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press inline-flex w-full items-center justify-center gap-2.5 h-11 rounded-md border border-[var(--edge)] bg-ground-3 text-sm font-semibold text-ink hover:bg-ground-4 hover:border-[var(--seam)] disabled:opacity-45 disabled:pointer-events-none"
    >
      <FaGoogle aria-hidden className="text-[15px]" />
      {t('auth.google')}
    </button>
  );
};

/** A checkbox that looks like it belongs to the instrument. */
export const AuthCheckbox: React.FC<{
  checked: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
  id: string;
}> = ({ checked, onChange, children, id }) => (
  <div className="flex items-start gap-2.5">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border border-[var(--seam)] bg-ground-1"
    />
    <label
      htmlFor={id}
      className="text-[13px] leading-relaxed text-ink-mid cursor-pointer select-none"
    >
      {children}
    </label>
  </div>
);
