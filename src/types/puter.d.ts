/**
 * Ambient types for the Puter SDK, which arrives as a global from the
 * `js.puter.com` script tag in `index.html` rather than as a module.
 *
 * This replaces the `declare const puter: any` that used to be repeated in
 * every consumer, and the `declare module 'puter'` that described an import
 * nothing ever made. `puter` is optional on purpose: the script is loaded with
 * `defer` from a third party, so it can genuinely be missing.
 */

/** The SDK returns one of these three shapes, depending on the model. */
type PuterChatResponse =
  | string
  | { message?: { content?: string } }
  | { choices?: Array<{ message?: { content?: string } }> }
  | { text?: string };

interface PuterAI {
  chat(prompt: string): Promise<PuterChatResponse | null | undefined>;
}

interface Puter {
  /** Safe to call more than once; the SDK guards re-initialisation itself. */
  init?: () => Promise<void>;
  ai: PuterAI;
}

declare const puter: Puter | undefined;

interface Window {
  puter?: Puter;
}
