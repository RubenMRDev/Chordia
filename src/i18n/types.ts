import type { es } from './messages/es';

/** Every string the product can say. `es` is the source of truth. */
export type MessageKey = keyof typeof es;

/**
 * A translation table. Typed against the Spanish dictionary, so adding a
 * string without translating it is a compile error rather than a blank label.
 */
export type Messages = Record<MessageKey, string>;

export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Espanol',
  en: 'English',
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/** Values interpolated into a message's `{placeholders}`. */
export type Vars = Record<string, string | number>;

/** Translate function handed out by `useT`. */
export type Translate = (key: MessageKey, vars?: Vars) => string;
