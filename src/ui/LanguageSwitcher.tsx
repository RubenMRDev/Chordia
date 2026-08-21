import React from 'react';
import { LOCALE_NAMES, LOCALES, useT, type Locale } from '@/i18n';

/**
 * Two languages, both always visible. A dropdown for a two-item choice hides
 * the option behind a click for no benefit, and a visitor who landed in the
 * wrong language should not have to read a menu label to escape it.
 */
const LanguageSwitcher: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { locale, setLocale, t } = useT();

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className={`inline-flex items-center rounded-md border border-[var(--edge)] bg-ground-1 p-0.5 ${className}`}
    >
      {LOCALES.map((code: Locale) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            title={t('lang.switchTo', { name: LOCALE_NAMES[code] })}
            className={`press h-7 w-9 rounded-[4px] text-[12px] font-semibold uppercase tracking-wide ${
              active
                ? 'bg-ground-4 text-ink'
                : 'text-ink-low hover:text-ink-mid'
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
