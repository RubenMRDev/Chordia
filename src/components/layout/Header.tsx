import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useT, type MessageKey } from '@/i18n';
import { ButtonLink, LanguageSwitcher } from '@/ui';
import BrandMark from './BrandMark';

const AVATAR_FALLBACK =
  'https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp';

interface NavItem {
  to: string;
  key: MessageKey;
  /** Matches child routes too, e.g. /play/:id under the catalogue. */
  prefixes?: string[];
  /** Hidden until there is an account to hang it on. */
  needsAccount?: boolean;
}

/*
  Discover and the catalogue are always advertised: they are what the product
  is, and hiding them until someone has an account makes Chordia look like a
  MIDI player with a login screen. The personal surfaces appear once there is
  an account to hang them on.
*/
const NAV: NavItem[] = [
  { to: '/discover', key: 'nav.discover' },
  { to: '/midi', key: 'nav.catalog', prefixes: ['/midi', '/play', '/demo'] },
  { to: '/create', key: 'nav.create', needsAccount: true },
  { to: '/library', key: 'nav.library', needsAccount: true },
  { to: '/dashboard', key: 'nav.dashboard', needsAccount: true },
];

const Header: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useT();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // A route change closes the sheet; otherwise it stays open over the new page.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Escape closes it too, and the body must not scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const items = NAV.filter(
    (item) => !item.needsAccount || Boolean(currentUser),
  );

  const isActive = (item: NavItem): boolean =>
    (item.prefixes ?? [item.to]).some((prefix) =>
      prefix === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(prefix),
    );

  const avatar = userProfile?.photoURL || currentUser?.photoURL || AVATAR_FALLBACK;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:h-10 focus:px-4 focus:inline-flex focus:items-center focus:rounded-md focus:bg-hand-right focus:text-hand-right-ink focus:font-semibold"
      >
        {t('nav.skipToContent')}
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--edge)] bg-[color-mix(in_srgb,var(--color-ground-1)_88%,transparent)] backdrop-blur-md">
        <div className="shell flex items-center gap-6 h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline shrink-0 group"
          >
            <BrandMark />
            <span className="font-display text-[19px] font-semibold tracking-[-0.02em]">
              Chordia
            </span>
          </Link>

          {/* Desktop navigation. */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative h-16 px-3.5 inline-flex items-center text-sm font-medium no-underline transition-colors duration-[var(--t-quick)] ${
                    active ? 'text-ink' : 'text-ink-mid hover:text-ink'
                  }`}
                >
                  {t(item.key)}
                  {/* The active tab is marked by a struck key, not a pill. */}
                  <span
                    aria-hidden
                    className="absolute left-3.5 right-3.5 bottom-0 h-[2px] rounded-t bg-hand-right transition-all duration-[var(--t-move)] ease-[var(--ease-strike)]"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active ? 'scaleX(1)' : 'scaleX(0.3)',
                      boxShadow: active
                        ? '0 0 12px rgba(0,230,118,0.45)'
                        : 'none',
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            {currentUser ? (
              <Link to="/profile" className="shrink-0" title={t('nav.profile')}>
                <img
                  src={avatar}
                  alt={t('nav.profile')}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover border border-[var(--seam)]"
                  onError={(event) => {
                    event.currentTarget.src = AVATAR_FALLBACK;
                  }}
                />
              </Link>
            ) : (
              <>
                <ButtonLink to="/login" tone="ghost" size="sm">
                  {t('nav.signIn')}
                </ButtonLink>
                <ButtonLink to="/register" tone="right" size="sm">
                  {t('nav.signUp')}
                </ButtonLink>
              </>
            )}
          </div>

          {/* Mobile trigger. The old header had none: the nav simply stacked. */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label={t('nav.menu')}
            className="press md:hidden h-10 w-10 -mr-2 inline-flex flex-col items-center justify-center gap-[5px] rounded-md text-ink hover:bg-ground-3"
          >
            <span aria-hidden className="block h-[1.5px] w-5 bg-current" />
            <span aria-hidden className="block h-[1.5px] w-5 bg-current" />
            <span aria-hidden className="block h-[1.5px] w-5 bg-current" />
          </button>
        </div>
      </header>

      {/* Mobile sheet. */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label={t('nav.close')}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ground-0/80 backdrop-blur-sm cursor-default"
          />
          <div className="chassis chassis-flush absolute inset-x-0 top-0 pb-6 rise">
            <div className="shell flex items-center h-16">
              <Link
                to="/"
                className="flex items-center gap-2.5 no-underline"
                onClick={() => setMenuOpen(false)}
              >
                <BrandMark />
                <span className="font-display text-[19px] font-semibold">
                  Chordia
                </span>
              </Link>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t('nav.close')}
                className="press h-10 w-10 -mr-2 grid place-items-center rounded-md text-ink hover:bg-ground-3"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M3.5 3.5l11 11M14.5 3.5l-11 11" />
                </svg>
              </button>
            </div>

            <div aria-hidden className="rule-keys mx-[var(--gutter)] mb-2" />

            <nav className="shell flex flex-col">
              {items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 h-13 py-3.5 text-[17px] font-medium no-underline border-b border-[var(--edge)] ${
                      active ? 'text-hand-right' : 'text-ink'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="w-1 h-5 rounded-full transition-colors"
                      style={{
                        background: active
                          ? 'var(--color-hand-right)'
                          : 'var(--edge)',
                      }}
                    />
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>

            <div className="shell mt-6 flex items-center justify-between gap-4">
              <LanguageSwitcher />
              {currentUser ? (
                <ButtonLink to="/profile" tone="quiet" size="sm">
                  {t('nav.profile')}
                </ButtonLink>
              ) : (
                <div className="flex items-center gap-2">
                  <ButtonLink to="/login" tone="quiet" size="sm">
                    {t('nav.signIn')}
                  </ButtonLink>
                  <ButtonLink to="/register" tone="right" size="sm">
                    {t('nav.signUp')}
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
