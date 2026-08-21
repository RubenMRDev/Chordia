import React from 'react';

/**
 * The brand mark: five keys, one of them lit.
 *
 * Authored rather than borrowed from an icon set, because the whole product is
 * a keyboard with one note sounding on it, and a generic music note said
 * nothing that a hundred other apps do not already say.
 */
const BrandMark: React.FC<{ size?: number; className?: string }> = ({
  size = 22,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className={className}
  >
    {/* Three white keys. */}
    <rect x="1.5" y="4" width="6.4" height="16" rx="1.4" fill="#F4F7FB" />
    <rect x="8.8" y="4" width="6.4" height="16" rx="1.4" fill="#F4F7FB" />
    <rect
      x="16.1"
      y="4"
      width="6.4"
      height="16"
      rx="1.4"
      fill="var(--color-hand-right)"
    />
    {/* Two black keys straddling the seams. */}
    <rect x="6.1" y="4" width="3.6" height="9.6" rx="1" fill="#151b26" />
    <rect x="13.4" y="4" width="3.6" height="9.6" rx="1" fill="#151b26" />
  </svg>
);

export default BrandMark;
