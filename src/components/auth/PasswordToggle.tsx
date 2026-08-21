import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useT } from '@/i18n';

/**
 * Show/hide for a password field.
 *
 * An icon rather than a text label: the label reads "Ver la contraseña", which
 * is nine characters too long to sit inside a 44px-tall input without crowding
 * the value the visitor is typing. The words stay as the accessible name.
 */
const PasswordToggle: React.FC<{
  shown: boolean;
  onToggle: () => void;
}> = ({ shown, onToggle }) => {
  const { t } = useT();
  const label = shown ? t('auth.hidePassword') : t('auth.showPassword');

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={shown}
      title={label}
      className="press h-8 w-8 grid place-items-center rounded text-ink-low hover:text-ink hover:bg-ground-3"
    >
      {shown ? (
        <FaEyeSlash aria-hidden className="text-[14px]" />
      ) : (
        <FaEye aria-hidden className="text-[14px]" />
      )}
    </button>
  );
};

export default PasswordToggle;
