import type { Vars } from './types';

const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * Replaces `{name}` placeholders. An unknown placeholder is left verbatim so a
 * missing value is visible in review instead of silently collapsing to an
 * empty string.
 */
export const interpolate = (template: string, vars?: Vars): string => {
  if (!vars) return template;
  return template.replace(PLACEHOLDER, (whole, name: string) => {
    const value = vars[name];
    return value === undefined ? whole : String(value);
  });
};

/**
 * Picks the singular or plural half of a `one|other` message.
 * Both Spanish and English pluralise on `n === 1`, which is all this product
 * needs; a language with richer rules would need real plural categories.
 */
export const plural = (template: string, count: number): string => {
  const [one, other] = template.split('|');
  if (other === undefined) return template;
  return count === 1 ? one : other;
};
