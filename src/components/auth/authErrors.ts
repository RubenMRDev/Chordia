import type { MessageKey } from '@/i18n';

/**
 * Maps a Firebase auth error onto one of our own messages.
 *
 * The auth pages used to print `error.message` straight from the SDK, so a
 * mistyped password showed "Firebase: Error (auth/invalid-credential)." An
 * error should name the problem in the product's own language.
 */
const CODES: Record<string, MessageKey> = {
  'auth/invalid-credential': 'auth.errWrong',
  'auth/invalid-login-credentials': 'auth.errWrong',
  'auth/wrong-password': 'auth.errWrong',
  'auth/user-not-found': 'auth.errWrong',
  'auth/invalid-email': 'auth.errEmail',
  'auth/email-already-in-use': 'auth.errTaken',
  'auth/weak-password': 'auth.errPasswordShort',
  'auth/network-request-failed': 'auth.errNetwork',
  'auth/too-many-requests': 'auth.errNetwork',
  'auth/invalid-api-key': 'auth.errUnconfigured',
  'auth/api-key-not-valid': 'auth.errUnconfigured',
};

/**
 * The key for a raised error, or `null` when we have nothing better to say than
 * whatever the SDK reported.
 */
export const authErrorKey = (raw: unknown): MessageKey | null => {
  const text =
    typeof raw === 'string'
      ? raw
      : raw instanceof Error
        ? `${(raw as { code?: string }).code ?? ''} ${raw.message}`
        : '';

  for (const [code, key] of Object.entries(CODES)) {
    if (text.includes(code)) return key;
  }
  if (text.includes('FirebaseUnconfigured')) return 'auth.errUnconfigured';
  return null;
};
