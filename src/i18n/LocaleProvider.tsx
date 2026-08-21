import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { es } from './messages/es';
import { en } from './messages/en';
import { interpolate, plural } from './interpolate';
import {
  isLocale,
  LOCALES,
  type Locale,
  type MessageKey,
  type Messages,
  type Translate,
  type Vars,
} from './types';

const TABLES: Record<Locale, Messages> = { es, en };

const STORAGE_KEY = 'chordia.locale';

/**
 * The locale to open with: what the visitor chose last, otherwise what their
 * browser asks for, otherwise Spanish.
 */
const detectLocale = (): Locale => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Private mode and blocked storage both land here; the browser's own
    // preference is a fine answer.
  }
  const languages = window.navigator?.languages ?? [];
  for (const tag of languages) {
    const base = tag.slice(0, 2).toLowerCase();
    if (isLocale(base)) return base;
  }
  return 'es';
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translate;
  /** Picks the right half of a `one|other` message and fills `{count}`. */
  tn: (key: MessageKey, count: number, vars?: Vars) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  // Keep the document in sync: screen readers, spellcheck and `:lang()` all
  // read this, and hyphenation breaks without it.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not being able to remember the choice is not worth an error.
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const table = TABLES[locale];
    const t: Translate = (key, vars) => interpolate(table[key], vars);
    return {
      locale,
      setLocale,
      t,
      tn: (key, count, vars) =>
        interpolate(plural(table[key], count), { count, ...vars }),
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

const useLocaleContext = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useT must be used inside a LocaleProvider');
  }
  return context;
};

/** The translate function, plus the plural helper. */
export const useT = (): LocaleContextValue => useLocaleContext();

export { LOCALES };
export type { Locale, MessageKey };
